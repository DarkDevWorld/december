// AI Provider Configuration
// Choose your preferred AI provider and model

export interface AIProvider {
  name: string;
  baseUrl: string;
  apiKey: string;
  models: string[];
  defaultModel: string;
  requiresApiKey: boolean;
}

export const AI_PROVIDERS: Record<string, AIProvider> = {
  openai: {
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    apiKey: "sk-...", // Replace with your OpenAI API key
    models: [
      "gpt-4o",
      "gpt-4o-mini",
      "gpt-4-turbo",
      "gpt-4",
      "gpt-3.5-turbo",
      "o1-preview",
      "o1-mini"
    ],
    defaultModel: "gpt-4o",
    requiresApiKey: true,
  },
  anthropic: {
    name: "Anthropic",
    baseUrl: "https://api.anthropic.com/v1",
    apiKey: "sk-ant-...", // Replace with your Anthropic API key
    models: [
      "claude-3-5-sonnet-20241022",
      "claude-3-5-haiku-20241022",
      "claude-3-opus-20240229",
      "claude-3-sonnet-20240229",
      "claude-3-haiku-20240307"
    ],
    defaultModel: "claude-3-5-sonnet-20241022",
    requiresApiKey: true,
  },
  openrouter: {
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKey: "sk-or-v1-...", // Replace with your OpenRouter API key
    models: [
      "anthropic/claude-3.5-sonnet",
      "anthropic/claude-3-opus",
      "openai/gpt-4o",
      "openai/gpt-4-turbo",
      "google/gemini-pro-1.5",
      "meta-llama/llama-3.1-405b-instruct",
      "mistralai/mistral-large",
      "deepseek/deepseek-coder"
    ],
    defaultModel: "anthropic/claude-3.5-sonnet",
    requiresApiKey: true,
  },
  google: {
    name: "Google AI",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    apiKey: "AIza...", // Replace with your Google AI API key
    models: [
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "gemini-1.0-pro",
      "gemini-1.0-pro-vision"
    ],
    defaultModel: "gemini-1.5-pro",
    requiresApiKey: true,
  },
  groq: {
    name: "Groq",
    baseUrl: "https://api.groq.com/openai/v1",
    apiKey: "gsk_...", // Replace with your Groq API key
    models: [
      "llama-3.1-405b-reasoning",
      "llama-3.1-70b-versatile",
      "llama-3.1-8b-instant",
      "mixtral-8x7b-32768",
      "gemma2-9b-it"
    ],
    defaultModel: "llama-3.1-70b-versatile",
    requiresApiKey: true,
  },
  together: {
    name: "Together AI",
    baseUrl: "https://api.together.xyz/v1",
    apiKey: "...", // Replace with your Together AI API key
    models: [
      "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
      "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
      "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      "mistralai/Mixtral-8x7B-Instruct-v0.1",
      "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO"
    ],
    defaultModel: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
    requiresApiKey: true,
  },
  mistral: {
    name: "Mistral AI",
    baseUrl: "https://api.mistral.ai/v1",
    apiKey: "...", // Replace with your Mistral AI API key
    models: [
      "mistral-large-latest",
      "mistral-medium-latest",
      "mistral-small-latest",
      "codestral-latest",
      "mistral-embed"
    ],
    defaultModel: "mistral-large-latest",
    requiresApiKey: true,
  },
  huggingface: {
    name: "Hugging Face",
    baseUrl: "https://api-inference.huggingface.co/v1",
    apiKey: "hf_...", // Replace with your Hugging Face API key
    models: [
      "meta-llama/Meta-Llama-3.1-70B-Instruct",
      "microsoft/DialoGPT-medium",
      "microsoft/CodeBERT-base",
      "codellama/CodeLlama-34b-Instruct-hf",
      "WizardLM/WizardCoder-Python-34B-V1.0"
    ],
    defaultModel: "meta-llama/Meta-Llama-3.1-70B-Instruct",
    requiresApiKey: true,
  },
  deepseek: {
    name: "DeepSeek AI",
    baseUrl: "https://api.deepseek.com/v1",
    apiKey: "sk-...", // Replace with your DeepSeek API key
    models: [
      "deepseek-chat",
      "deepseek-coder",
      "deepseek-math"
    ],
    defaultModel: "deepseek-coder",
    requiresApiKey: true,
  },
  fireworks: {
    name: "Fireworks AI",
    baseUrl: "https://api.fireworks.ai/inference/v1",
    apiKey: "fw-...", // Replace with your Fireworks AI API key
    models: [
      "accounts/fireworks/models/llama-v3p1-405b-instruct",
      "accounts/fireworks/models/llama-v3p1-70b-instruct",
      "accounts/fireworks/models/llama-v3p1-8b-instruct",
      "accounts/fireworks/models/mixtral-8x7b-instruct",
      "accounts/fireworks/models/yi-large"
    ],
    defaultModel: "accounts/fireworks/models/llama-v3p1-70b-instruct",
    requiresApiKey: true,
  },
  ollama: {
    name: "Ollama (Local)",
    baseUrl: "http://localhost:11434/v1",
    apiKey: "ollama", // Ollama doesn't require an API key
    models: [
      "llama3.1:405b",
      "llama3.1:70b",
      "llama3.1:8b",
      "codellama:34b",
      "codellama:13b",
      "codellama:7b",
      "deepseek-coder:33b",
      "deepseek-coder:6.7b",
      "mistral:7b",
      "mixtral:8x7b"
    ],
    defaultModel: "llama3.1:8b",
    requiresApiKey: false,
  },
};

// Current configuration - change this to switch providers
export const config = {
  aiSdk: {
    // Choose your provider: 'openai', 'anthropic', 'openrouter', 'google', 'groq', 'together', 'mistral', 'huggingface', 'deepseek', 'fireworks', 'ollama'
    provider: "anthropic" as keyof typeof AI_PROVIDERS,
    
    // Get the configuration for the selected provider
    get baseUrl() {
      return AI_PROVIDERS[this.provider].baseUrl;
    },
    
    get apiKey() {
      return AI_PROVIDERS[this.provider].apiKey;
    },
    
    get model() {
      return AI_PROVIDERS[this.provider].defaultModel;
    },
    
    get availableModels() {
      return AI_PROVIDERS[this.provider].models;
    },
    
    // Model parameters
    temperature: 0.7,
    maxTokens: 4096,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
  },
} as const;

// Helper function to get provider info
export function getProviderInfo(providerKey: keyof typeof AI_PROVIDERS) {
  return AI_PROVIDERS[providerKey];
}

// Helper function to get all available providers
export function getAllProviders() {
  return Object.entries(AI_PROVIDERS).map(([key, provider]) => ({
    key,
    ...provider,
  }));
}

// Helper function to validate provider configuration
export function validateProviderConfig(providerKey: keyof typeof AI_PROVIDERS): boolean {
  const provider = AI_PROVIDERS[providerKey];
  
  if (!provider) {
    console.error(`Provider "${providerKey}" not found`);
    return false;
  }
  
  if (provider.requiresApiKey && (!provider.apiKey || provider.apiKey.includes("..."))) {
    console.error(`API key required for provider "${providerKey}" but not configured`);
    return false;
  }
  
  return true;
}

// Export current provider info for easy access
export const currentProvider = AI_PROVIDERS[config.aiSdk.provider];