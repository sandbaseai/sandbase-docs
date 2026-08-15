<p align="center">
  <h1 align="center">SandBase</h1>
  <p align="center">
    <strong>One API. 2,000+ Models. 2,000+ APIs. Zero integration headaches.</strong>
  </p>
  <p align="center">
    <a href="https://docs.sandbase.ai">Docs</a> ·
    <a href="https://sandbase.ai">Platform</a> ·
    <a href="https://sandbase.ai/console">Dashboard</a> ·
    <a href="https://github.com/sandbaseai/cli">CLI</a>
  </p>
  <p align="center">
    <a href="https://github.com/sandbaseai/sandbase-docs/stargazers"><img src="https://img.shields.io/github/stars/sandbaseai/sandbase-docs?style=social" alt="GitHub stars"></a>
    <a href="https://github.com/sandbaseai/sandbase-docs/blob/main/LICENSE"><img src="https://img.shields.io/github/license/sandbaseai/sandbase-docs" alt="Apache-2.0 license"></a>
    <a href="https://docs.sandbase.ai"><img src="https://img.shields.io/badge/docs-live-16a34a" alt="Documentation"></a>
  </p>
  <p align="center">
    If SandBase saves you integration time, please <a href="https://github.com/sandbaseai/sandbase-docs">star the repository</a> — it helps more builders discover the project.
  </p>
</p>

---

## The Problem

Building AI applications means juggling dozens of API keys, learning different SDKs, handling auth flows, managing rate limits, and paying for 10+ subscriptions just to get basic capabilities.

Need Twitter data? One API. Web scraping? Another. Image generation? A third. LLM inference? Yet another. Each with its own pricing, auth, error handling, and documentation.

**What if one API key could access all of them?**

## The Solution

SandBase is a unified gateway to **2,000+ AI models** and **2,000+ APIs** through a single interface:

```sh
# Call any LLM — GPT-4o, Claude, Gemini, DeepSeek, Qwen...
curl https://sandbase.ai/v1/run -d '{"model": "openai/gpt-4o", "messages": [...]}'

# Search Twitter
curl https://sandbase.ai/v1/run -d '{"model": "twitter/search", "query": "AI agents"}'

# Generate an image with Flux
curl https://sandbase.ai/v1/run -d '{"model": "flux/schnell", "prompt": "A startup logo"}'

# Scrape any webpage
curl https://sandbase.ai/v1/run -d '{"model": "firecrawl/scrape", "url": "https://..."}'

# Generate a video with Kling
curl https://sandbase.ai/v1/run -d '{"model": "kling/video", "prompt": "Product demo"}'
```

One endpoint. One API key. One billing dashboard. That's it.

---

## 2,000+ Models

| Type | Count | Providers |
|------|-------|-----------|
| **LLM** | 500+ | OpenAI (GPT-4o, o1, o3), Anthropic (Claude 4, Sonnet), Google (Gemini 2.5), DeepSeek (V3, R1), Qwen (3), Meta (Llama 4), Mistral, Cohere, Yi... |
| **Image Generation** | 200+ | Flux (Schnell, Pro, Dev), DALL-E 3, Ideogram 3, Recraft V3, Stable Diffusion 3.5, Midjourney... |
| **Video Generation** | 100+ | Kling 2.0, MiniMax, Runway Gen-4, Luma Dream Machine, Pika, Hailuo... |
| **Audio** | 100+ | ElevenLabs (TTS/clone), OpenAI Whisper, Fish Audio, Suno, Udio... |
| **Embeddings** | 50+ | OpenAI (text-3-large), Voyage 3, Cohere Embed V4, Jina V3... |
| **Multimodal** | 200+ | GPT-4o vision, Gemini Pro Vision, Claude vision, Qwen-VL... |

## 2,000+ APIs

| Category | Count | Examples |
|----------|-------|----------|
| **Web Search** | 50+ | Google, Exa, Tavily, Serper, Scholar, Brave, DuckDuckGo |
| **Social Media** | 300+ | Twitter/X (search, timeline, user), YouTube (transcript, search), Reddit, Instagram, TikTok, LinkedIn, Xiaohongshu, Weibo, Bilibili, Douyin |
| **Web Scraping** | 100+ | Firecrawl (crawl, scrape, map), Exa contents, Jina Reader, URL extract |
| **E-commerce** | 200+ | Taobao (search, detail), Amazon, AliExpress, JD, Pinduoduo |
| **Finance** | 100+ | Stock quotes, company fundamentals, SEC filings, forex rates |
| **Maps & Weather** | 50+ | Google Maps, weather forecasts, geocoding, places |
| **Translation** | 50+ | DeepL, Google Translate, specialized domain translation |
| **News** | 50+ | Google News, Bing News, RSS aggregation, media monitoring |
| **Developer Tools** | 100+ | GitHub, code search, package info, DNS/WHOIS, SSL check |
| **And more** | 500+ | Travel, food, sports, education, government data, academic papers... |

---

## See It In Action

### Your AI agent searches the web in real-time

```
You: "What happened with OpenAI this week?"

Agent → sandbase_discover("web search") → sandbase_run("exa/search")
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ 10 results from the past 7 days:
  1. "OpenAI Announces GPT-5 Preview" — The Verge (2 days ago)
  2. "New API Pricing for o3-mini" — OpenAI Blog (3 days ago)
  ...
```

### Generate images on demand

```
You: "Create a logo for my app called 'Moonshot' — dark theme, minimal"

Agent → sandbase_run("flux/schnell", {prompt: "..."})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Generated: moonshot-logo.png (1024x1024)
  Cost: $0.003 | Time: 1.8s
```

### Pull live social media data

```
You: "Find what people are saying about our competitor on Twitter"

Agent → sandbase_run("twitter/search", {query: "CompetitorName"})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ 25 recent posts mentioning CompetitorName:
  Sentiment: 60% positive, 25% neutral, 15% negative
  Top complaint: "pricing increased 40%"
  Top praise: "new AI features are solid"
```

### Scrape and analyze any website

```
You: "Get the pricing from linear.app and compare with our plans"

Agent → sandbase_run("firecrawl/scrape", {url: "https://linear.app/pricing"})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Extracted 3 plans:
  Free: $0/mo — 250 issues
  Standard: $8/user/mo — unlimited
  Plus: $14/user/mo — advanced analytics
```

---

## Three Ways to Use SandBase

### 1. Direct API — Full control

```python
import requests

# Call any model with one unified API
response = requests.post("https://sandbase.ai/v1/run",
    headers={"Authorization": "Bearer YOUR_KEY"},
    json={"model": "openai/gpt-4o", "messages": [...]}
)

# Or use OpenAI-compatible endpoint (drop-in replacement)
response = requests.post("https://sandbase.ai/v1/chat/completions",
    headers={"Authorization": "Bearer YOUR_KEY"},
    json={"model": "openai/gpt-4o", "messages": [...]}
)
```

### 2. CLI — Connect any AI coding agent in 30 seconds

```sh
npx -y @sandbaseai/cli connect
```

Your Cursor / Claude Code / Codex / Kiro / Windsurf instantly gets access to all 2,000+ models and 2,000+ APIs through MCP. Just ask naturally.

Supports 17+ clients: Cursor, Claude Code, Codex, Kiro IDE, Kiro CLI, Windsurf, Gemini CLI, Amp, Warp, OpenCode, Qwen Code, Kimi CLI, Hermes, OpenClaw, ChatGPT, Claude Desktop, and more.

### 3. Managed Agents — Reusable AI workflows

```json
{
  "name": "daily-market-report",
  "model": "openai/gpt-4o",
  "instructions": "Research market trends, analyze competitor moves, summarize findings",
  "tools": ["twitter/search", "exa/search", "firecrawl/scrape"],
  "schedule": "0 9 * * 1-5"
}
```

Define once, run on schedule, invoke via API, or trigger by webhook.

---

## Getting Started (under 2 minutes)

1. **Sign up** at [sandbase.ai](https://sandbase.ai) — free tier included
2. **Get your API key** from the [Dashboard](https://sandbase.ai/console/keys)
3. **Make your first call:**

```sh
curl https://sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "openai/gpt-4o", "messages": [{"role": "user", "content": "Hello!"}]}'
```

Or connect your AI tool:

```sh
npx -y @sandbaseai/cli connect --client cursor
```

---

## Why SandBase?

| Without SandBase | With SandBase |
|------------------|---------------|
| 20+ API keys to manage | 1 API key for everything |
| Different SDKs per service | One unified REST API |
| $500+/mo in separate subscriptions | Pay only for what you use |
| Weeks of integration per service | Working in 2 minutes |
| Each provider has different errors | Consistent error format |
| Separate billing per provider | One dashboard, one invoice |
| Manual rate limit handling | Built-in retry and fallback |
| No visibility across providers | Unified logs, costs, and analytics |

---

## Documentation

This repository contains the full SandBase documentation site, built with [VitePress](https://vitepress.dev).

| Section | What's Inside |
|---------|---------------|
| [Getting Started](https://docs.sandbase.ai/getting-started/) | Account setup, API keys, first call |
| [Models](https://docs.sandbase.ai/models/) | 2,000+ models — capabilities, pricing |
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

## Links

- **Platform:** [sandbase.ai](https://sandbase.ai)
- **Docs:** [docs.sandbase.ai](https://docs.sandbase.ai)
- **CLI:** [@sandbaseai/cli](https://github.com/sandbaseai/cli)
- **npm:** [npmjs.com/package/@sandbaseai/cli](https://www.npmjs.com/package/@sandbaseai/cli)
- **Dashboard:** [sandbase.ai/console](https://sandbase.ai/console)

## License

Apache-2.0

## Contributing

Found a missing model, unclear example, or documentation bug? Open an
[issue](https://github.com/sandbaseai/sandbase-docs/issues) or send a pull
request. Small fixes are welcome.
