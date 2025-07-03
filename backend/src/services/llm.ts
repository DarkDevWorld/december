import OpenAI from "openai";
import { config, validateProviderConfig, currentProvider } from "../../config";
import prompt from "../utils/prompt.txt";
import * as dockerService from "./docker";
import * as fileService from "./file";

// Validate configuration on startup
if (!validateProviderConfig(config.aiSdk.provider)) {
  console.error(`Invalid configuration for provider: ${config.aiSdk.provider}`);
  process.exit(1);
}

// Initialize OpenAI client with current provider configuration
const openai = new OpenAI({
  apiKey: config.aiSdk.apiKey,
  baseURL: config.aiSdk.baseUrl,
});

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  attachments?: Attachment[];
}

export interface Attachment {
  type: "image" | "document";
  data: string;
  name: string;
  mimeType: string;
  size: number;
}

export interface ChatSession {
  id: string;
  containerId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

const chatSessions = new Map<string, ChatSession>();

export async function createChatSession(
  containerId: string
): Promise<ChatSession> {
  const sessionId = `${containerId}-${Date.now()}`;
  const session: ChatSession = {
    id: sessionId,
    containerId,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  chatSessions.set(sessionId, session);
  return session;
}

export function getChatSession(sessionId: string): ChatSession | undefined {
  return chatSessions.get(sessionId);
}

export function getOrCreateChatSession(containerId: string): ChatSession {
  const existingSession = Array.from(chatSessions.values()).find(
    (session) => session.containerId === containerId
  );

  if (existingSession) {
    return existingSession;
  }

  const sessionId = `${containerId}-${Date.now()}`;
  const session: ChatSession = {
    id: sessionId,
    containerId,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  chatSessions.set(sessionId, session);
  return session;
}

function buildMessageContent(
  message: string,
  attachments: Attachment[] = []
): any[] {
  const content: any[] = [{ type: "text", text: message }];

  for (const attachment of attachments) {
    if (attachment.type === "image") {
      content.push({
        type: "image_url",
        image_url: {
          url: `data:${attachment.mimeType};base64,${attachment.data}`,
        },
      });
    } else if (attachment.type === "document") {
      const decodedText = Buffer.from(attachment.data, "base64").toString(
        "utf-8"
      );
      content.push({
        type: "text",
        text: `\n\nDocument "${attachment.name}" content:\n${decodedText}`,
      });
    }
  }

  return content;
}

// Provider-specific message formatting
function formatMessagesForProvider(messages: any[]): any[] {
  const provider = config.aiSdk.provider;
  
  switch (provider) {
    case "anthropic":
      // Anthropic uses a different message format
      return messages.map(msg => {
        if (msg.role === "system") {
          // Anthropic handles system messages differently
          return {
            role: "user",
            content: `System: ${msg.content}`
          };
        }
        return msg;
      });
    
    case "google":
      // Google AI has its own format
      return messages.map(msg => ({
        role: msg.role === "assistant" ? "model" : msg.role,
        parts: [{ text: msg.content }]
      }));
    
    case "huggingface":
      // Hugging Face might need special formatting
      return messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
    
    default:
      // OpenAI-compatible format (works for most providers)
      return messages;
  }
}

// Provider-specific request parameters
function getProviderSpecificParams(): any {
  const provider = config.aiSdk.provider;
  const baseParams = {
    model: config.aiSdk.model,
    temperature: config.aiSdk.temperature,
    max_tokens: config.aiSdk.maxTokens,
  };

  switch (provider) {
    case "anthropic":
      return {
        ...baseParams,
        max_tokens: config.aiSdk.maxTokens,
        top_p: config.aiSdk.topP,
      };
    
    case "google":
      return {
        model: config.aiSdk.model,
        generationConfig: {
          temperature: config.aiSdk.temperature,
          maxOutputTokens: config.aiSdk.maxTokens,
          topP: config.aiSdk.topP,
        },
      };
    
    case "groq":
      return {
        ...baseParams,
        top_p: config.aiSdk.topP,
        frequency_penalty: config.aiSdk.frequencyPenalty,
        presence_penalty: config.aiSdk.presencePenalty,
      };
    
    case "ollama":
      return {
        model: config.aiSdk.model,
        options: {
          temperature: config.aiSdk.temperature,
          num_predict: config.aiSdk.maxTokens,
          top_p: config.aiSdk.topP,
        },
      };
    
    default:
      return {
        ...baseParams,
        top_p: config.aiSdk.topP,
        frequency_penalty: config.aiSdk.frequencyPenalty,
        presence_penalty: config.aiSdk.presencePenalty,
      };
  }
}

export async function sendMessage(
  containerId: string,
  userMessage: string,
  attachments: Attachment[] = []
): Promise<{ userMessage: Message; assistantMessage: Message }> {
  console.log(`[LLM] Using provider: ${currentProvider.name} with model: ${config.aiSdk.model}`);
  
  const session = getOrCreateChatSession(containerId);

  const userMsg: Message = {
    id: `user-${Date.now()}`,
    role: "user",
    content: userMessage,
    timestamp: new Date().toISOString(),
    attachments: attachments.length > 0 ? attachments : undefined,
  };

  session.messages.push(userMsg);

  const fileContentTree = await fileService.getFileContentTree(
    dockerService.docker,
    containerId
  );

  const codeContext = JSON.stringify(fileContentTree, null, 2);

  const systemPrompt = `${prompt}

Current codebase structure and content:
${codeContext}`;

  const openaiMessages = [
    { role: "system" as const, content: systemPrompt },
    ...session.messages.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content:
        msg.role === "user" && msg.attachments
          ? buildMessageContent(msg.content, msg.attachments)
          : msg.content,
    })),
  ];

  const formattedMessages = formatMessagesForProvider(openaiMessages);
  const requestParams = {
    messages: formattedMessages,
    ...getProviderSpecificParams(),
  };

  console.log(`[LLM] Sending request to ${currentProvider.name}...`);

  const completion = await openai.chat.completions.create(requestParams);

  const assistantContent =
    completion.choices[0]?.message?.content ||
    "Sorry, I could not generate a response.";

  const assistantMsg: Message = {
    id: `assistant-${Date.now()}`,
    role: "assistant",
    content: assistantContent,
    timestamp: new Date().toISOString(),
  };

  session.messages.push(assistantMsg);
  session.updatedAt = new Date().toISOString();

  console.log(`[LLM] Response received from ${currentProvider.name}`);

  return {
    userMessage: userMsg,
    assistantMessage: assistantMsg,
  };
}

export async function* sendMessageStream(
  containerId: string,
  userMessage: string,
  attachments: Attachment[] = []
): AsyncGenerator<{ type: "user" | "assistant" | "done"; data: any }> {
  console.log(`[LLM] Starting stream with provider: ${currentProvider.name} using model: ${config.aiSdk.model}`);
  
  const session = getOrCreateChatSession(containerId);

  const userMsg: Message = {
    id: `user-${Date.now()}`,
    role: "user",
    content: userMessage,
    timestamp: new Date().toISOString(),
    attachments: attachments.length > 0 ? attachments : undefined,
  };

  session.messages.push(userMsg);
  yield { type: "user", data: userMsg };

  const fileContentTree = await fileService.getFileContentTree(
    dockerService.docker,
    containerId
  );

  const codeContext = JSON.stringify(fileContentTree, null, 2);

  const systemPrompt = `${prompt}

Current codebase structure and content:
${codeContext}`;

  const openaiMessages = [
    { role: "system" as const, content: systemPrompt },
    ...session.messages.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content:
        msg.role === "user" && msg.attachments
          ? buildMessageContent(msg.content, msg.attachments)
          : msg.content,
    })),
  ];

  const formattedMessages = formatMessagesForProvider(openaiMessages);
  const requestParams = {
    messages: formattedMessages,
    stream: true,
    ...getProviderSpecificParams(),
  };

  const assistantId = `assistant-${Date.now()}`;
  let assistantContent = "";

  console.log(`[LLM] Starting stream from ${currentProvider.name}...`);

  const stream = await openai.chat.completions.create(requestParams);

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta;
    if (delta?.content) {
      assistantContent += delta.content;
      yield {
        type: "assistant",
        data: {
          id: assistantId,
          role: "assistant",
          content: assistantContent,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  const finalAssistantMsg: Message = {
    id: assistantId,
    role: "assistant",
    content: assistantContent,
    timestamp: new Date().toISOString(),
  };

  session.messages.push(finalAssistantMsg);
  session.updatedAt = new Date().toISOString();

  console.log(`[LLM] Stream completed from ${currentProvider.name}`);

  yield { type: "done", data: finalAssistantMsg };
}