<a name="readme-top"></a>

<div align="center">

<h3 align="center">Say hi to December ☃️</h3>

  <p align="center">
    December is an open-source alternative to AI-powered development platforms like Loveable, Replit, and Bolt that you can run locally with your own API keys, ensuring complete privacy and significant cost savings. 
    <br />
    <br />
    December lets you build full-stack applications from simple text prompts using AI.
    <br />
    <br />
    <a href="#get-started">Get started</a>
    ·
    <a href="https://github.com/ntegrals/december/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=">Report Bug</a>
    ·
    <a href="https://github.com/ntegrals/december/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.md&title=">Request Feature</a>

  </p>
</div>
<a href="https://github.com/ntegrals/december">
    <img src=".assets/preview.png" alt="December Preview">
  </a>

## Features

    ✅ AI-powered project creation from natural language prompts
    ✅ CodeSandbox integration for instant Next.js applications
    ✅ Live preview with mobile and desktop views
    ✅ Full-featured Monaco code editor with file management
    ✅ Real-time chat assistant for development help
    ✅ Project export and deployment capabilities
    ✅ Multiple AI provider support (OpenAI, Anthropic, Google, Groq, and more)

## Supported AI Providers

December supports multiple AI providers, giving you the flexibility to choose the best model for your needs:

### Cloud Providers
- **OpenAI** - GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo, o1-preview, o1-mini
- **Anthropic** - Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus, Claude 3 Sonnet
- **Google AI** - Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini 1.0 Pro
- **Groq** - Llama 3.1 405B/70B/8B, Mixtral 8x7B, Gemma2 9B (Ultra-fast inference)
- **Together AI** - Llama 3.1 models, Mixtral variants
- **Mistral AI** - Mistral Large/Medium/Small, Codestral
- **Hugging Face** - Llama 3.1, CodeLlama, WizardCoder
- **DeepSeek AI** - DeepSeek Chat/Coder/Math
- **Fireworks AI** - Llama 3.1 models, Mixtral variants
- **OpenRouter** - Access to multiple models through one API

### Local Providers
- **Ollama** - Run models locally (Llama 3.1, CodeLlama, DeepSeek Coder, etc.)

## Roadmap

    🔄 LLM streaming support
    🔄 Document & image attachments
    🔄 Improved fault tolerance
    🔄 Comprehensive test coverage
    🔄 Multi-framework support (beyond Next.js)

## Get started

1. Clone the repo

   ```sh
   git clone https://github.com/ntegrals/december
   ```

2. Configure your AI provider in the `config.ts` file

   December supports multiple AI providers. You have several options:

   ### Option 1: Use Ollama (Local, No API Key Required) - Recommended for Getting Started

   ```typescript
   export const config = {
     aiSdk: {
       provider: "ollama", // No API key needed!
     },
   };
   ```

   **To use Ollama:**
   1. Install Ollama from [https://ollama.ai](https://ollama.ai)
   2. Run: `ollama pull llama3.1:8b` (or any other model)
   3. Start December - it will work immediately!

   ### Option 2: Use Cloud Providers (Requires API Key)

   **For Anthropic (Best Code Quality):**
   ```typescript
   // In config.ts, update the anthropic provider:
   anthropic: {
     apiKey: "sk-ant-your-api-key-here", // Replace with your actual API key
   }

   // Then set the provider:
   export const config = {
     aiSdk: {
       provider: "anthropic",
     },
   };
   ```

   **For OpenAI:**
   ```typescript
   // In config.ts, update the openai provider:
   openai: {
     apiKey: "sk-your-api-key-here", // Replace with your actual API key
   }

   // Then set the provider:
   export const config = {
     aiSdk: {
       provider: "openai",
     },
   };
   ```

   **For Groq (Fast & Free tier available):**
   ```typescript
   // In config.ts, update the groq provider:
   groq: {
     apiKey: "gsk_your-api-key-here", // Replace with your actual API key
   }

   // Then set the provider:
   export const config = {
     aiSdk: {
       provider: "groq",
     },
   };
   ```

   ### Getting API Keys:
   - **Anthropic**: [https://console.anthropic.com](https://console.anthropic.com)
   - **OpenAI**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - **Groq**: [https://console.groq.com](https://console.groq.com)
   - **Google AI**: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
   - **OpenRouter**: [https://openrouter.ai/keys](https://openrouter.ai/keys)

3. **No Docker Required!** 🎉

   December now uses CodeSandbox for instant project creation and hosting. No need to install or configure Docker!

4. Run the start script to set up the environment

   ```sh
   sh start.sh
   ```

5. The application will start in development mode, and you can access it at [http://localhost:3000](http://localhost:3000).

   The backend will run on port 4000, and the frontend will run on port 3000.

   You can now start building your applications with December! 🥳

## AI Provider Recommendations

### For Getting Started (No API Key Required)
- **Ollama** - Run models completely locally, no data leaves your machine, no costs

### For Best Code Quality
- **Anthropic Claude 3.5 Sonnet** - Excellent at following instructions and generating clean code
- **OpenAI GPT-4o** - Great overall performance with good coding capabilities

### For Speed
- **Groq** - Ultra-fast inference with Llama models (free tier available)
- **Fireworks AI** - Fast inference with competitive pricing

### For Privacy/Local Use
- **Ollama** - Run models completely locally, no data leaves your machine

### For Cost-Effectiveness
- **OpenRouter** - Access to multiple models with competitive pricing
- **Together AI** - Good performance at lower costs

## Troubleshooting

### "API key required" Error
If you see an error like "API key required for provider 'anthropic' but not configured":

1. Open `config.ts`
2. Find your chosen provider in the `AI_PROVIDERS` object
3. Replace the empty `apiKey: ""` with your actual API key
4. Or switch to Ollama which doesn't require an API key:
   ```typescript
   provider: "ollama"
   ```

### Ollama Setup
1. Install Ollama: [https://ollama.ai](https://ollama.ai)
2. Pull a model: `ollama pull llama3.1:8b`
3. Verify it's running: `ollama list`
4. Set provider to "ollama" in config.ts

## Motivation

AI-powered development platforms have revolutionized how we build applications. They allow developers to go from idea to working application in seconds, but most solutions are closed-source or require expensive subscriptions.

Until recently, building a local alternative that matched the speed and capabilities of platforms like Loveable, Replit, or Bolt seemed challenging. The recent advances in AI and cloud development environments like CodeSandbox have made it possible to build a fast, accessible development environment that gives you full control over your code and API usage.

I would love for this repo to become the go-to place for people who want to run their own AI-powered development environment. I've been working on this project for a while now and I'm really excited to share it with you.

## Why use December with CodeSandbox?

Building applications shouldn't require expensive subscriptions or complex local setup. December gives you the power of platforms like Loveable, Replit, and Bolt with the convenience of CodeSandbox:

- **No Local Setup Required** - No Docker installation, no complex configuration. Just run and start building
- **Instant Project Creation** - Projects are created instantly on CodeSandbox with live preview
- **Your API Keys, Your Costs** - Use your own API keys and pay only for what you use. No monthly subscriptions
- **Complete Feature Access** - No paywalls, premium tiers, or artificial limitations
- **Multiple AI Providers** - Choose from 11+ AI providers including local options like Ollama
- **Live Collaboration** - Share your CodeSandbox projects easily with others

Most cloud-based AI development platforms charge $20-100+ per month while limiting your usage. With December, a $5 API credit can generate dozens of complete applications, and you can share and collaborate on them instantly through CodeSandbox.

The CodeSandbox integration means you get instant deployment, live preview, and easy sharing without any infrastructure management. Your development environment is accessible from anywhere with just a browser.

December proves that you don't need to choose between powerful AI assistance and ease of use. Run it locally, use your own API keys, and build without boundaries.

## Contact

Hi! Thanks for checking out and using this project. If you are interested in discussing your project, require mentorship, consider hiring me, or just wanna chat - I'm happy to talk.

You can send me an email to get in touch: j.schoen@mail.com or message me on Twitter: [@julianschoen](https://twitter.com/julianschoen)

Thanks and have an awesome day 👋

## Disclaimer

December, is an experimental application and is provided "as-is" without any warranty, express or implied. By using this software, you agree to assume all risks associated with its use, including but not limited to data loss, system failure, or any other issues that may arise.

The developers and contributors of this project do not accept any responsibility or liability for any losses, damages, or other consequences that may occur as a result of using this software. You are solely responsible for any decisions and actions taken based on the information provided by December.

Please note that the use of the large language models can be expensive due to its token usage. By utilizing this project, you acknowledge that you are responsible for monitoring and managing your own token usage and the associated costs. It is highly recommended to check your API usage regularly and set up any necessary limits or alerts to prevent unexpected charges.

By using December, you agree to indemnify, defend, and hold harmless the developers, contributors, and any affiliated parties from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from your use of this software or your violation of these terms.

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.