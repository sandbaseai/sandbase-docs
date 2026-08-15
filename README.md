<p align="center">
  <h1 align="center">SandBase Documentation</h1>
  <p align="center">
    <strong>The complete guide to building with 2,000+ AI models, APIs, and managed agents.</strong>
  </p>
  <p align="center">
    <a href="https://docs.sandbase.ai">Live Docs</a> ·
    <a href="https://sandbase.ai">Platform</a> ·
    <a href="https://sandbase.ai/console">Dashboard</a>
  </p>
</p>

---

## What is SandBase?

SandBase is a unified AI platform that gives developers access to:

- **200+ AI Models** — GPT-4o, Claude, Gemini, DeepSeek, Qwen, Llama, Flux, Kling, and more
- **2,000+ APIs** — Web search, social media, scraping, e-commerce, finance, image/video/audio generation
- **Managed Agents** — Define reusable AI agents with tools, run them on schedules or via API
- **One API Key** — Access everything through a single credential

## Documentation Structure

```
├── getting-started/     # Quickstart, API keys, first call
├── models/              # Model capabilities, supported models, vision
├── model-api-reference/ # Per-model API docs (LLM, image, video, audio)
├── api-reference/       # Full REST API reference
├── agents/              # Agent definition, MCP tools, sessions, deployments
├── guides/              # Streaming, error handling, rate limiting, billing
├── store/               # Browse models, APIs, skills, agents
├── for-agents/          # Integration guides for AI coding tools
├── admin/               # Organizations, API keys, billing management
├── setup/               # Client setup (Cursor, Claude Code, etc.)
└── use-cases/           # Real-world integration examples
```

## Quick Links

| Topic | Description |
|-------|-------------|
| [Getting Started](https://docs.sandbase.ai/getting-started/) | Create an account and make your first API call |
| [Models & APIs](https://docs.sandbase.ai/models/) | Browse 200+ models with capabilities and pricing |
| [API Reference](https://docs.sandbase.ai/api-reference/) | Complete REST API documentation |
| [Build an Agent](https://docs.sandbase.ai/agents/) | Create reusable AI agents with tools |
| [For AI Tools](https://docs.sandbase.ai/for-agents/) | Connect SandBase to Cursor, Claude Code, Codex, etc. |
| [Store](https://docs.sandbase.ai/store/) | Discover available models, APIs, and skills |

## Local Development

```sh
# Install dependencies
npm ci

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The site is built with [VitePress](https://vitepress.dev). Pages are written in Markdown with Vue components for interactive elements.

## Deployment

The docs are deployed as a static site via Docker:

```sh
docker build -t sandbase-docs .
docker run -p 80:80 sandbase-docs
```

The `nginx.conf` handles routing, caching headers, and SPA fallback.

## Contributing

Documentation improvements are welcome. To add or update content:

1. Find the relevant `.md` file in the directory structure above
2. Edit using standard Markdown + [VitePress extensions](https://vitepress.dev/guide/markdown)
3. Run `npm run dev` to preview locally
4. Submit a pull request

## Related Repositories

- [@sandbaseai/cli](https://github.com/sandbaseai/cli) — CLI tool to connect AI coding agents to SandBase
- [SandBase Platform](https://sandbase.ai) — The main platform

## License

Apache-2.0
