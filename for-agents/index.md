---
title: AI-Readable Documentation
description: Everything an AI agent needs to discover and use SandBase API — one-page summary.
---

# AI-Friendly API Overview

::: info Session contract
`session_id` is the public identity for persistent Agent interaction. Direct Session creation and Service (Endpoint) invocation create or continue that Session. Every Schedule (Deployment) trigger creates a separate public `drun_*` DeploymentRun and attempts to create one new Session. Runtime instances remain internal and are never returned.
:::

> A concise reference for both humans and AI agents. For plain-text versions optimized for LLM ingestion, see [`llms.txt`](https://www.sandbase.ai/docs/llms.txt).

## What is SandBase?

SandBase is an AI agent infrastructure platform. One API key gives you access to **2,000+ models and APIs** across LLM, image, video, audio, embedding, search, and data, plus agent workflows.

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
    "model": "openai/gpt-5.4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/v1/chat/completions` | OpenAI-compatible chat (LLM, vision, tools, streaming) |
| `POST` | `/v1/messages` | Anthropic-compatible messages API |
| `POST` | `/v1/embeddings` | Generate text embeddings |
| `POST` | `/v1/run` | Unified generation (image, video, audio, any async task) |
| `GET` | `/v1/run/{id}` | Poll async generation status and retrieve results |
| `GET` | `/v1/models` | List all available models |
| `GET` | `/v1/models/{id_or_name}` | Get model details, schema, capabilities, and pricing |
| `GET` | `/v1/tasks/{id}/cost` | Get task cost and usage |

## Additional Endpoint Groups

Beyond the core generation endpoints, SandBase provides APIs for agent lifecycle management. See the [AI API Guide](./full) for common workflows and the [OpenAPI specification](https://www.sandbase.ai/docs/openapi.yaml) for the complete contract.

| Group | Key Endpoints | Purpose |
|-------|---------------|---------|
| **Agents** | `POST /v1/agents`, `GET /v1/agents`, `POST /v1/agents/{id}` | Create and manage agent definitions |
| **Services (Endpoints)** | `POST /v1/endpoints/{id}/run` | Invoke a Service and create or continue a Session |
| **Sessions** | `POST /v1/sessions`, `POST /v1/sessions/{id}/events` | Create persistent Agent Sessions and send messages |
| **Schedules (Deployments)** | `POST /v1/deployments` | Define manual or cron triggers; each creates a DeploymentRun |
| **Skills** | `GET /v1/skills` | Extend agent capabilities with reusable instruction and resource bundles |

## Pricing Model

Pay per use. Pricing is model-specific and may change independently of this page:

- **LLM**: `input_tokens × prompt_price + output_tokens × completion_price`
- **Image/Video/Audio**: flat `base_price` per generation
- **Cached tokens**: use the selected model's current `model_card` for cache pricing and multipliers

Discover the current model ID with `GET /v1/models`, then inspect `GET /v1/models/{id_or_name}` before sending a request. Do not assume that pricing or cache discounts are shared across providers.

Check cost after any generation:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

## Rate Limits

There is no published universal numeric default. Requests are subject to an optional per-key RPM cap and the
current platform-wide RPM protection. A `429` response does not include quota or `Retry-After` headers; use bounded
exponential backoff with jitter. See [Error Codes](./errors).

---

## Further Reading

- [AI API Guide](./full) — core workflows, request/response shapes, and curl examples
- [Models & Pricing](./models) — live model discovery, pricing, and capability guidance
- [Error Codes](./errors) — public error categories with retry guidance
- [OpenAPI Spec](https://www.sandbase.ai/docs/openapi.yaml) — machine-readable OpenAPI 3.1

## Plain-Text Versions (for AI agents)

| File | URL | Content |
|------|-----|---------|
| `llms.txt` | [/docs/llms.txt](https://www.sandbase.ai/docs/llms.txt) | Compact summary (~60 lines) |
| `llms-full.txt` | [/docs/llms-full.txt](https://www.sandbase.ai/docs/llms-full.txt) | Expanded AI-oriented API guide |
| `openapi.yaml` | [/docs/openapi.yaml](https://www.sandbase.ai/docs/openapi.yaml) | OpenAPI 3.1 machine-readable spec |
