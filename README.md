<p align="center">
  <h1 align="center">SandBase</h1>
  <p align="center">
    <strong>One API. 200+ Models. 2,000+ Tools. Zero integration headaches.</strong>
  </p>
  <p align="center">
    <a href="https://docs.sandbase.ai">Docs</a> ·
    <a href="https://sandbase.ai">Platform</a> ·
    <a href="https://sandbase.ai/console">Dashboard</a> ·
    <a href="https://github.com/sandbaseai/cli">CLI</a>
  </p>
</p>

---

## The Problem

Building AI applications means juggling dozens of API keys, learning different SDKs, handling auth flows, managing rate limits, and paying for 10+ subscriptions just to get basic capabilities.

Need Twitter data? One API. Web scraping? Another. Image generation? A third. LLM inference? Yet another. Each with its own pricing, auth, error handling, and documentation.

## The Solution

SandBase gives you **one API key** that unlocks everything:

```sh
# Search Twitter
curl https://sandbase.ai/v1/run -d '{"model": "twitter/search", "query": "AI agents"}'

# Generate an image
curl https://sandbase.ai/v1/run -d '{"model": "flux/schnell", "prompt": "A startup logo"}'

# Call GPT-4o
curl https://sandbase.ai/v1/run -d '{"model": "openai/gpt-4o", "messages": [...]}'

# Scrape a webpage
curl https://sandbase.ai/v1/run -d '{"model": "firecrawl/scrape", "url": "https://..."}'
```

All through one endpoint. One auth. One billing dashboard.

---

## What You Get

### Models (200+)

| Type | Providers |
|------|-----------|
| LLM | OpenAI, Anthropic, Google, DeepSeek, Qwen, Meta, Mistral |
| Image Generation | Flux, DALL-E, Ideogram, Recraft |
| Video Generation | Kling, MiniMax, Runway, Luma |
| Audio | ElevenLabs TTS, Whisper STT |
| Embeddings | OpenAI, Voyage, Cohere |

### APIs (2,000+)

| Category | Examples |
|----------|----------|
| Web Search | Google, Exa, Tavily, Scholar |
| Social Media | Twitter/X, YouTube, Reddit, Instagram, TikTok, Xiaohongshu, Weibo, Bilibili |
| Scraping | Firecrawl, URL content extraction |
| E-commerce | Taobao, Amazon product data |
| Finance | Stock quotes, company data |
| And more | Weather, maps, translation, news... |

### Managed Agents

Define AI agents with instructions + tools, then run them:
- **On-demand** via API (Endpoints)
- **On a schedule** (Deployments)
- **In conversations** (Sessions)

---

## Three Ways to Use SandBase

### 1. Direct API Calls

For when you need precise control:

```python
import requests

response = requests.post("https://sandbase.ai/v1/run", 
    headers={"Authorization": "Bearer YOUR_KEY"},
    json={
        "model": "openai/gpt-4o",
        "messages": [{"role": "user", "content": "Explain quantum computing"}]
    }
)
print(response.json())
```

### 2. Connect Your AI Coding Agent

One command and your Cursor / Claude Code / Codex / Kiro gets access to all tools:

```sh
npx -y @sandbaseai/cli connect
```

Your agent can now search the web, pull social media data, generate images, and more — just by asking.

### 3. Build Managed Agents

Define reusable agents that combine models + tools + instructions:

```json
{
  "name": "market-researcher",
  "model": "openai/gpt-4o",
  "instructions": "Research market trends and competitors...",
  "tools": ["twitter/search", "exa/search", "firecrawl/scrape"]
}
```

Then trigger via API, schedule, or webhook.

---

## Getting Started

### Quick start (under 2 minutes)

1. **Sign up** at [sandbase.ai](https://sandbase.ai) — free tier included
2. **Get your API key** from the [Dashboard](https://sandbase.ai/console/keys)
3. **Make a call:**

```sh
curl https://sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### Connect to your AI tool

```sh
npx -y @sandbaseai/cli connect --client cursor
```

Works with Cursor, Claude Code, Codex, Kiro, Windsurf, Gemini CLI, Amp, Warp, and 10+ more.

---

## Documentation

This repository contains the full SandBase documentation site, built with [VitePress](https://vitepress.dev).

| Section | What's Inside |
|---------|---------------|
| [Getting Started](https://docs.sandbase.ai/getting-started/) | Account setup, API keys, first call |
| [Models](https://docs.sandbase.ai/models/) | Capabilities, supported models, pricing |
| [API Reference](https://docs.sandbase.ai/api-reference/) | Complete REST API docs |
| [Agents](https://docs.sandbase.ai/agents/) | Build and deploy managed agents |
| [Guides](https://docs.sandbase.ai/guides/) | Streaming, errors, rate limits, billing |
| [For AI Tools](https://docs.sandbase.ai/for-agents/) | MCP integration for coding agents |
| [Store](https://docs.sandbase.ai/store/) | Browse all available models & APIs |

### Run locally

```sh
npm ci
npm run dev      # Dev server at localhost:5173
npm run build    # Production build
npm run preview  # Preview build locally
```

### Deploy

```sh
docker build -t sandbase-docs .
docker run -p 80:80 sandbase-docs
```

---

## Why SandBase?

| Without SandBase | With SandBase |
|------------------|---------------|
| 10+ API keys to manage | 1 API key for everything |
| Different SDKs per service | One unified REST API |
| $200+/mo in subscriptions | Pay only for what you use |
| Weeks of integration work | Working in minutes |
| Each service has different errors | Consistent error handling |
| Separate billing per provider | One dashboard, one invoice |

---

## Links

- **Platform:** [sandbase.ai](https://sandbase.ai)
- **Docs:** [docs.sandbase.ai](https://docs.sandbase.ai)
- **CLI:** [@sandbaseai/cli](https://github.com/sandbaseai/cli)
- **npm:** [npmjs.com/package/@sandbaseai/cli](https://www.npmjs.com/package/@sandbaseai/cli)
- **Dashboard:** [sandbase.ai/console](https://sandbase.ai/console)

## License

Apache-2.0
