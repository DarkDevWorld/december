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
    ✅ Containerized Next.js applications with Docker
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

   December supports multiple AI providers. Choose your preferred provider and configure it:

   ```typescript
   export const config = {
     aiSdk: {
       // Choose your provider: 'openai', 'anthropic', 'google', 'groq', 'together', 'mistral', 'huggingface', 'deepseek', 'fireworks', 'openrouter', 'ollama'
       provider: "anthropic",
       
       // The configuration will automatically use the selected provider's settings
       temperature: 0.7,
       maxTokens: 4096,
     },
   };
   ```

   Then update the API key for your chosen provider in the `AI_PROVIDERS` configuration:

   **For Anthropic (Recommended):**
   ```typescript
   anthropic: {
     apiKey: "sk-ant-...", // Replace with your Anthropic API key
   }
   ```

   **For OpenAI:**
   ```typescript
   openai: {
     apiKey: "sk-...", // Replace with your OpenAI API key
   }
   ```

   **For Groq (Fast & Free tier available):**
   ```typescript
   groq: {
     apiKey: "gsk_...", // Replace with your Groq API key
   }
   ```

   **For Ollama (Local, no API key needed):**
   ```typescript
   // Just set provider to "ollama" - no API key required
   provider: "ollama"
   ```

   **For other providers:** Update the corresponding API key in the `AI_PROVIDERS` object.

3. Install Docker

   - [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
   - [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
   - [Docker Engine for Linux](https://docs.docker.com/engine/install/)

   Make sure you have Docker running and the Docker CLI installed before proceeding.

4. Run the start script to set up the environment

   ```sh
   sh start.sh
   ```

5. The application will start in development mode, and you can access it at [http://localhost:3000](http://localhost:3000).

   The backend will run on port 4000, and the frontend will run on port 3000.

   You can now start building your applications with December! 🥳

## AI Provider Recommendations

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

## Motivation

AI-powered development platforms have revolutionized how we build applications. They allow developers to go from idea to working application in seconds, but most solutions are closed-source or require expensive subscriptions.

Until recently, building a local alternative that matched the speed and capabilities of platforms like Loveable, Replit, or Bolt seemed challenging. The recent advances in AI and containerization technologies have made it possible to build a fast, local development environment that gives you full control over your code and API usage.

I would love for this repo to become the go-to place for people who want to run their own AI-powered development environment. I've been working on this project for a while now and I'm really excited to share it with you.

## Why run December locally?

Building applications shouldn't require expensive subscriptions or sacrificing your privacy. December gives you the power of platforms like Loveable, Replit, and Bolt without the downsides:

- **Full Control & Privacy** - Your code, ideas, and projects never leave your machine. No cloud storage, no data mining, no vendor lock-in
- **Your API Keys, Your Costs** - Use your own API keys and pay only for what you use. No monthly subscriptions or usage limits imposed by third parties
- **Complete Feature Access** - No paywalls, premium tiers, or artificial limitations. Every feature is available from day one
- **Multiple AI Providers** - Choose from 11+ AI providers including local options like Ollama

Most cloud-based AI development platforms charge $20-100+ per month while limiting your usage and storing your intellectual property on their servers. With December, a $5 API credit can generate dozens of complete applications, and you keep full ownership of everything you create.

The local-first approach means you can work offline, modify the platform itself, and never worry about service outages or policy changes affecting your projects. Your development environment evolves with your needs, not a company's business model.

December proves that you don't need to choose between powerful AI assistance and maintaining control over your work. Run it locally, use your own API keys, and build without boundaries.

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