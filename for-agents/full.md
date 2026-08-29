---
title: SandBase AI API Guide
description: Expanded SandBase API guide for AI agents, with core workflows, request examples, and links to the authoritative OpenAPI specification.
---

# AI API Guide

::: info Session contract
`session_id` is the persistent public identity for Agent interaction. Service invocation creates or continues a Session. Every Schedule (Deployment) trigger creates a public `drun_*` DeploymentRun and attempts to create one new Session. Internal Runtime Session IDs are not exposed.
:::

> A single-page guide to the most common API workflows. For the complete machine-readable contract, use the [OpenAPI specification](https://www.sandbase.ai/docs/openapi.yaml). Plain-text version: [`llms-full.txt`](https://www.sandbase.ai/docs/llms-full.txt).

## Authentication

All requests require:

```
Authorization: Bearer sk-YOUR_KEY
```

Base URL: `https://api.sandbase.ai/v1`

---

## Terminology

| Term | Meaning |
|------|---------|
| **Task** | A billable execution record for operations such as model inference. Not every API operation creates one. |
| **Run** | A media generation request via `POST /v1/run`. May be sync or async. Poll with `GET /v1/run/{id}`. |
| **Session** | An agent execution via `POST /v1/sessions`. A sequence of steps (tool calls, LLM reasoning). Query with `GET /v1/sessions/{id}`. |

> **run vs session**: "Run" (`/v1/run`) is for model generation tasks. "Session" (`/v1/sessions`) is for persistent Agent interactions. Run IDs are opaque and must not be parsed. A Schedule trigger additionally creates a `drun_*` DeploymentRun.
>
> **task vs run**: A "run" or "session" is the request you make; a "task" is a billable execution record. Use
> `GET /v1/tasks/{task_id}/cost` when an operation returns a task ID. Not every API operation creates a task.

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- GENERATION APIs                                          -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Chat Completions

### POST /v1/chat/completions

OpenAI-compatible. Streaming, tools, vision, reasoning, and structured-output support depend on the selected model and its declared schema.

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Explain quantum computing in one paragraph."}
    ],
    "temperature": 0.7,
    "max_tokens": 500,
    "stream": false
  }'
```

**Response:**

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "model": "openai/gpt-5.6-luna",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Quantum computing leverages quantum mechanical phenomena..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 89,
    "total_tokens": 113
  }
}
```

> Some billable operations may return `x-task-id: f3d2e8a1-7c4b-4a12-9d2e-123456789abc`; when present, use it to query
> `GET /v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost`.

---

## Anthropic Messages

### POST /v1/messages

Anthropic-compatible Messages API. Caching and other optional features depend on the selected model and request schema.

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-sonnet-5",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "What is SandBase?"}]
  }'
```

**Response:**

```json
{
  "id": "msg_abc123",
  "type": "message",
  "role": "assistant",
  "content": [
    { "type": "text", "text": "SandBase is an AI agent infrastructure platform..." }
  ],
  "model": "anthropic/claude-sonnet-5",
  "stop_reason": "end_turn",
  "usage": { "input_tokens": 12, "output_tokens": 64 }
}
```

---

## Embeddings

### POST /v1/embeddings

Generate text embeddings. OpenAI-compatible interface.

```bash
curl https://api.sandbase.ai/v1/embeddings \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<embedding-model-id>",
    "input": "SandBase is an AI agent platform."
  }'
```

**Response:**

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "index": 0,
      "embedding": [0.0023, -0.0091, 0.0152, 0.0087, -0.0034]
    }
  ],
  "model": "<embedding-model-id>",
  "usage": { "prompt_tokens": 7, "total_tokens": 7 }
}
```

> The `embedding` array is truncated. Its actual length depends on the selected model and any supported dimensions parameter.

---

## Image Generation

### POST /v1/run

The `/v1/run` endpoint is a **unified generation endpoint** — the `model` field determines the output type (image, video, or audio).

> **How to handle the response:** Check the `status` field.
> - `"completed"` → results are in `outputs`, done.
> - `"pending"` or `"running"` → poll `GET /v1/run/{id}` every 2–5s until a terminal status (`completed`, `failed`, or `timeout`).

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bfl/flux-2/flash",
    "prompt": "A futuristic city at sunset, cyberpunk style",
    "aspect_ratio": "1:1"
  }'
```

**Response (sync):**

```json
{
  "id": "f3d2e8a1-7c4b-4a12-9d2e-123456789abc",
  "status": "completed",
  "model": "bfl/flux-2/flash",
  "created_at": "2026-08-02T12:00:00Z",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/f3d2e8a1-7c4b-4a12-9d2e-123456789abc.png",
    "content_type": "image/png",
    "width": 1024,
    "height": 1024
  }]
}
```

---

## Video Generation

### POST /v1/run

Check the selected model's `execution_mode`. When submission returns `pending` or `running`, poll `GET /v1/run/{id}` until a terminal status.

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kwaivgi/kling-video/3.0/turbo/standard/text-to-video",
    "prompt": "A drone flying over mountains at golden hour",
    "duration": 5
  }'
```

**Response (async — initial):**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "running",
  "model": "kwaivgi/kling-video/3.0/turbo/standard/text-to-video",
  "created_at": "2026-08-02T12:00:00Z"
}
```

**Poll status: `GET /v1/run/{id}`**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "completed",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/6a7b9c10-2d3e-4f50-8a61-23456789abcd.mp4",
    "content_type": "video/mp4",
    "duration": 5
  }]
}
```

---

## Audio (Text-to-Speech)

### POST /v1/run

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seed-speech/tts/2.0",
    "text": "Hello world, this is a test of text to speech."
  }'
```

**Response:**

```json
{
  "id": "7b8c0d21-3e4f-5061-9b72-3456789abcde",
  "status": "completed",
  "model": "bytedance/seed-speech/tts/2.0",
  "created_at": "2026-08-02T12:00:00Z",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/7b8c0d21-3e4f-5061-9b72-3456789abcde.mp3",
    "content_type": "audio/mpeg",
    "duration_seconds": 3.2
  }]
}
```

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- DISCOVERY APIs                                           -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## List Models

### GET /v1/models

Returns enabled logical models in the OpenAI-compatible model-list format. The endpoint is not paginated and
defaults to `type=llm`. Detailed capabilities and pricing are intentionally omitted.

```bash
curl https://api.sandbase.ai/v1/models \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

The response contains `object: "list"` and a `data` array. Each item contains `id`, `object`, `created`, and
`owned_by`; use `id` as the logical model name. Retrieve that model for capability and pricing metadata.

---

## Get Model

### GET /v1/models/{id_or_name}

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

The detail response adds `unified_schema`, `supported_modes`, and `model_card`. Detailed prices live inside
`model_card`; there is no top-level `pricing` object.

---

## Get Task Cost

### GET /v1/tasks/{task_id}/cost

Check the recorded cost of a task using the task ID returned by the API operation.

```bash
curl https://api.sandbase.ai/v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

**Response:**

```json
{
  "id": "f3d2e8a1-7c4b-4a12-9d2e-123456789abc",
  "status": "completed",
  "settled": true,
  "currency": "USD",
  "cost": "0.000325",
  "estimated_cost": "0.000325",
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 89,
    "total_tokens": 113,
    "cached_tokens": 0,
    "cache_creation_tokens": 0,
    "reasoning_tokens": 0
  }
}
```

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- PLATFORM APIs                                            -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Agents

### POST /v1/agents — Create Agent

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research Assistant",
    "model": "openai/gpt-5.6-luna",
    "system": "You are a research assistant. Use tools to find and summarize information.",
    "tools": [{"type": "agent_toolset_20260401"}]
  }'
```

**Response:**

```json
{
  "id": "agent_abc123",
  "name": "Research Assistant",
    "model": "openai/gpt-5.6-luna",
  "system": "You are a research assistant...",
  "tools": [
    { "type": "agent_toolset_20260401" }
  ],
  "created_at": "2026-08-02T12:00:00Z",
  "version": 1
}
```

### GET /v1/agents — List Agents

```bash
curl https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

### GET /v1/agents/{id} — Get Agent

```bash
curl https://api.sandbase.ai/v1/agents/agent_abc123 \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

### POST /v1/agents/{id} — Update Agent

```bash
curl -X POST https://api.sandbase.ai/v1/agents/agent_abc123 \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "anthropic/claude-sonnet-5"}'
```

### POST /v1/agents/{id}/archive — Archive Agent

```bash
curl -X POST https://api.sandbase.ai/v1/agents/agent_abc123/archive \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

### GET /v1/agents/{id}/versions — List Versions

```bash
curl https://api.sandbase.ai/v1/agents/agent_abc123/versions \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

---

## Services

### POST /v1/endpoints/{id}/run — Invoke Service

Creates or continues a Session and sends one message. Omit `session_id` to create a Session. A supplied Session must have been created by the same Service and still match its Agent-version binding.

```bash
curl -X POST https://api.sandbase.ai/v1/endpoints/ep_abc/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"input": "Summarize the latest news about AI agents"}'
```

**Response (`202 Accepted`):**

```json
{
  "session_id": "sess_abc123",
  "events": [{
    "id": "sevt_abc123",
    "type": "user.message",
    "processed_at": "2026-08-03T12:00:01Z"
  }]
}
```

---

## Sessions

### POST /v1/sessions — Create Session

Create a version-pinned Agent Session. SandBase resolves the Agent's runtime binding internally. Use singular `initial_events` to submit the first message with creation.

```bash
curl -X POST https://api.sandbase.ai/v1/sessions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agent": "agent_abc123",
    "title": "GitHub research",
    "initial_events": [{
      "type": "user.message",
      "content": [{"type": "text", "text": "Research AI coding assistants"}]
    }]
  }'
```

**Response:**

```json
{
  "id": "sess_xyz789",
  "type": "session",
  "agent": {
    "id": "agent_abc123",
    "type": "agent",
    "version": 3
  },
  "status": "idle",
  "created_at": "2026-08-03T12:00:00Z"
}
```

If native runtime delivery returns `502` with a top-level `session_id`, its outcome is unknown. Retrieve that Session and inspect or stream its Events before continuing. Do not blindly create another Session and resend the message.

### POST /v1/sessions/{id}/events — Send Events

Send `user.message` to start or continue an idle Session, or `user.interrupt` to interrupt a running turn.

```bash
curl -X POST https://api.sandbase.ai/v1/sessions/sess_xyz789/events \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"events":[{"type":"user.message","content":[{"type":"text","text":"Focus on AI coding assistants specifically"}]}]}'
```

**Response:**

```json
{
  "data": [{
    "id": "sevt_001",
    "type": "user.message",
    "processed_at": "2026-08-03T12:00:01Z"
  }]
}
```

### GET /v1/sessions — List Sessions

```bash
curl https://api.sandbase.ai/v1/sessions \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

**Response:**

```json
{
  "data": [
    {
      "id": "sess_xyz789",
      "agent_id": "agent_abc123",
      "status": "idle",
      "created_at": "2026-08-03T12:00:00Z"
    }
  ]
}
```

### GET /v1/sessions/{id} — Get Session

```bash
curl https://api.sandbase.ai/v1/sessions/sess_xyz789 \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

### GET /v1/sessions/{id}/events — List Events

```bash
curl https://api.sandbase.ai/v1/sessions/sess_xyz789/events \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

**Response:**

```json
{
  "data": [
    {
      "id": "sevt_001",
      "type": "agent.message",
      "content": [{"type":"text","text":"I'll search GitHub for trending repositories..."}],
      "processed_at": "2026-08-02T12:00:05Z"
    },
    {
      "id": "sevt_002",
      "type": "agent.tool_use",
      "content": {"name":"github.search_repositories","input":{"query":"trending today"}},
      "processed_at": "2026-08-02T12:00:06Z"
    }
  ]
}
```

### GET /v1/sessions/{id}/events/stream — Stream Events (SSE)

Replays persisted events, then continues streaming newly persisted events. While idle, the server may send `: heartbeat` comment frames. The connection remains open until the client disconnects, the request context is cancelled, or a write fails; Session terminal state does not produce a separate close event.

```bash
curl -N https://api.sandbase.ai/v1/sessions/sess_xyz789/events/stream \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

**Event format:**

```
data: {"id":"sevt_001","type":"agent.message","content":[{"type":"text","text":"I'll search GitHub for trending repositories..."}],"processed_at":"2026-08-03T12:00:02Z"}
: heartbeat
data: {"id":"sevt_002","type":"session.status_idle","stop_reason":{"type":"end_turn"},"processed_at":"2026-08-03T12:00:03Z"}
```

---

## Schedules

### POST /v1/deployments — Create Schedule

Create a Schedule through the compatibility `/v1/deployments` resource. Every manual or cron trigger creates a distinct `drun_*` DeploymentRun and attempts to create one new Session.

```bash
curl -X POST https://api.sandbase.ai/v1/deployments \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily team summary",
    "agent_id": "agent_abc123",
    "initial_events": [{
      "type": "user.message",
      "content": [{"type":"text","text":"Generate daily summary of team activity"}]
    }],
    "schedule": {
      "type": "cron",
      "expression": "0 9 * * *",
      "timezone": "America/New_York"
    }
  }'
```

**Response:**

```json
{
  "id": "depl_abc123",
  "agent_id": "agent_abc123",
  "schedule": {"type":"cron","expression":"0 9 * * *","timezone":"America/New_York"},
  "status": "active",
  "next_run_at": "2026-08-03T09:00:00-04:00"
}
```

### GET /v1/deployments/{id}/runs — List DeploymentRuns

```bash
curl https://api.sandbase.ai/v1/deployments/depl_abc123/runs \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Each returned object has `id` (`drun_*`), `type`, `deployment_id`, `agent`, `trigger_context`, nullable `session_id`, nullable `error`, and `created_at`. Use the linked Session for subsequent Agent events. A pending nested record returns `409 deployment_trigger_in_progress` from the get endpoint.

---

## Skills

### GET /v1/skills — List Skills

```bash
curl https://api.sandbase.ai/v1/skills \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

**Response:**

```json
{
  "data": [
    {
      "id": "skill_web_scrape",
      "name": "Web Scraper",
      "description": "Extract content from URLs",
      "input_schema": {
        "type": "object",
        "properties": { "url": { "type": "string" } }
      }
    }
  ]
}
```

---

## Billing & Cost

### How costs are calculated

- Read the selected model's current pricing formula and units from its `model_card`.
- Token-priced models can include input, output, cache, or reasoning components when declared.
- Media and other models can use per-request, duration, resolution, or other model-specific units.
- When a billable operation returns a task ID (including an `x-task-id` response header), use `GET /v1/tasks/{task_id}/cost` for settlement and usage.
- For asynchronous `POST /v1/run` responses, query the generation result with `GET /v1/run/{id}`; a run ID is not a task ID and must not be sent to the cost endpoint.

### Budget control

- Set an optional spending limit when creating or editing a standard key under [Developer → API Keys](https://www.sandbase.ai/console/keys).
- Monitor requests and cost under **Console → Activities → Usage**.
- Review balance and credit transactions on the [Console Credits](https://www.sandbase.ai/console/billing) page.

---

## See Also

- [Models & Pricing](./models) — live model discovery, capabilities, and pricing guidance
- [Error Guide](./errors) — documented response shapes, HTTP handling, and retry safety
- [OpenAPI Spec](https://www.sandbase.ai/docs/openapi.yaml) — machine-readable schema
