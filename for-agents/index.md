---
title: AI-Readable Documentation
description: Everything an AI agent needs to discover and use SandBase API — one-page summary.
---

# AI-Friendly API Overview

::: info Session and Run contract
A Session (`ses_*`) runs one saved Agent version; create it with `POST /v1/agents/sessions`. Invoking a Service or firing a Schedule creates a Run (`run_*`), and each Run creates its own Session reported in `session_id`. Runtime instances remain internal and are never returned.
:::

> A concise reference for both humans and AI agents. For plain-text versions optimized for LLM ingestion, see [`llms.txt`](https://www.sandbase.ai/docs/llms.txt).

## What is SandBase?

SandBase is an AI agent infrastructure platform. One API key can access enabled Models and APIs across language, image, video, audio, search, and data, plus Agent workflows. Discover the current catalog instead of relying on a fixed count.

## API Base URL

```
https://api.sandbase.ai/v1
```

## Authentication

All requests require a Bearer token:

```
Authorization: Bearer sk-YOUR_KEY
```

Get your key at [Console → API Keys](https://www.sandbase.ai/console/keys).

## Quick Example

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## Core APIs

| Method | Route | Description |
|--------|----------|-------------|
| `POST` | `/v1/chat/completions` | OpenAI-compatible chat; optional capabilities depend on the selected model |
| `POST` | `/v1/messages` | Anthropic-compatible messages API |
| `POST` | `/v1/run` | Submit a model generation using its model-specific schema |
| `GET` | `/v1/run/{id}` | Poll async generation status and retrieve results |
| `GET` | `/v1/models` | List enabled logical models; defaults to the LLM type |
| `GET` | `/v1/models/{id_or_name}` | Get model details, schema, capabilities, and pricing |
| `GET` | `/v1/tasks/{task_id}/cost` | Get task cost and usage |

## Additional API Groups

Beyond the core generation APIs, SandBase provides APIs for agent lifecycle management. See the [AI API Guide](./full) for common workflows and the [OpenAPI specification](https://www.sandbase.ai/docs/openapi.yaml) for the complete contract.

| Group | Key routes | Purpose |
|-------|---------------|---------|
| **Agents** | `POST /v1/agents`, `GET /v1/agents`, `POST /v1/agents/{agent_id}` | Create and version saved Agent definitions |
| **Sessions** | `POST /v1/agents/sessions`, `POST /v1/agents/sessions/{session_id}/events`, `GET /v1/agents/sessions/{session_id}/events` | Run an Agent, send input, and stream live events |
| **Services** | `POST /v1/services`, `POST /v1/services/{service_id}/invoke` | Invoke a pinned Agent version; each call returns a Run |
| **Schedules** | `POST /v1/schedules`, `POST /v1/schedules/{schedule_id}/runs` | Run a pinned Agent version on cron or on demand |
| **Skills** | `POST /v1/skills`, `GET /v1/skills` | Versioned instruction bundles that Agents mount |
| **MCP Connections and Secrets** | `POST /v1/mcp-connections`, `POST /v1/secrets` | Remote HTTPS MCP tools and their write-only Bearer tokens |

Agents platform resources accept `Authorization: Bearer` or `X-API-Key` and return `{"error":{"type","code","param","message"}}` on failure.

## Pricing Model

Pay per use. Pricing is model-specific and may change independently of this page:

- **Model pricing**: read the selected model's current formula and units from `model_card`
- **Token pricing**: can include input, output, cache, or reasoning components when declared by that model
- **Media and other operations**: can use per-request, duration, resolution, or other model-specific units

Discover the current model ID with `GET /v1/models`, then inspect `GET /v1/models/{id_or_name}` before sending a request. Do not assume that pricing or cache discounts are shared across providers.

When an operation returns a task ID, inspect its recorded cost:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

## Rate Limits

There is no published universal numeric default. Requests are subject to an optional per-key RPM cap and the
current platform-wide RPM protection. A `429` response does not include quota or `Retry-After` headers; use bounded
exponential backoff with jitter. See the [Error Guide](./errors).

---

## Further Reading

- [AI API Guide](./full) — core workflows, request/response shapes, and curl examples
- [Models & Pricing](./models) — live model discovery, pricing, and capability guidance
- [Error Guide](./errors) — documented response shapes, HTTP handling, and retry safety
- [OpenAPI Spec](https://www.sandbase.ai/docs/openapi.yaml) — machine-readable OpenAPI 3.1

## Plain-Text Versions (for AI agents)

| File | URL | Content |
|------|-----|---------|
| `llms.txt` | [/docs/llms.txt](https://www.sandbase.ai/docs/llms.txt) | Compact summary (~60 lines) |
| `llms-full.txt` | [/docs/llms-full.txt](https://www.sandbase.ai/docs/llms-full.txt) | Expanded AI-oriented API guide |
| `openapi.yaml` | [/docs/openapi.yaml](https://www.sandbase.ai/docs/openapi.yaml) | OpenAPI 3.1 machine-readable spec |
