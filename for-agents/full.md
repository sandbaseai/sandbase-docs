---
title: SandBase AI API Guide
description: Expanded SandBase API guide for AI agents, with core workflows, request examples, and links to the authoritative OpenAPI specification.
---

# AI API Guide

::: info Session and Run contract
A Session (`ses_*`) runs one saved Agent version and is created with `POST /v1/agents/sessions`. Invoking a Service or firing a Schedule creates a Run (`run_*`) that creates its own Session, reported in `session_id`. Internal Runtime Session IDs are not exposed.
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
| **Session** | An Agent execution via `POST /v1/agents/sessions`, holding the conversation, tool activity, and output. Query with `GET /v1/agents/sessions/{session_id}`. |
| **Service or Schedule Run** | One invocation of a Service or firing of a Schedule (`run_*`). Query with `GET /v1/services/{service_id}/runs/{run_id}` or `GET /v1/schedules/{schedule_id}/runs/{run_id}`; it links to one Session. |

> **run vs session**: A model "run" (`/v1/run`) is a model generation task. A "Session" (`/v1/agents/sessions`) is an Agent execution. A Service or Schedule Run (`run_*`) is a separate resource that creates one Session. All IDs are opaque and must not be parsed.
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

## Agents platform conventions

- Base URL `https://api.sandbase.ai/v1`. Send `Authorization: Bearer sk-YOUR_KEY` or `X-API-Key: sk-YOUR_KEY` (same value if both). `OpenAI-Beta` is optional; if sent it must be `agents=v1`. The official OpenAI SDK (`client.beta.agents`, `client.skills`) works with `base_url="https://api.sandbase.ai/v1"`; differences are listed in [OpenAI compatibility](/agents/openai-compatibility).

- Bodies are strict JSON up to 1 MiB; unknown fields return 400.

- Errors: `{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}`. Branch on `code`; see the [Error Guide](./errors#agents-platform-errors).

- `row_version` is the compare-and-set token for PATCH, archive, restore, pause, timing, and rotate. On 409, read again.

- Cursor lists (Agents, Sessions, items, turns, Skills): `limit` 1-100, `after`, `order`; response `{object:"list", data, has_more, first_id, last_id}`.

- Offset lists (Agent versions, Services, Schedules, Runs, attachments, MCP connections, Secrets): `limit`, `offset`; response `{data, total, limit, offset}`.

- IDs: Agent `agt_`, Session `ses_`, Service `svc_`, Schedule `sch_`, Run `run_`, Skill `skl_`, MCP connection `mcp_`, Secret `sec_`, attachment `fil_`. Treat them as opaque.

---

## Agents

### POST /v1/agents — Create Agent

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: create-research-agent-1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research assistant",
    "model": "deepseek/deepseek-v4-flash",
    "instructions": "Research the question and cite sources."
  }'
```

Required: `model`. Optional: `name`, `instructions`, `description`, `runtime_profile` (`codex` default, `claude`, `mcode`), `skills` (`[{"skill_id","version"}]`), `mcp_connections` (`[{"connection_id","server_label","allowed_tools","required"}]`), `tools`, `text`, `reasoning`, `service_tier`, `metadata`, `note`. Returns `201` with `id` (`agt_`), `version`, `row_version`, `status`, and `projection_status`; start Sessions when `projection_status` is `ready`. `web_search` tools must use `mode: "disabled"`, and client-side function results (`requires_action`) are not supported.

### GET /v1/agents — List Agents

Query `status` (`active` default, `archived`, `all`) plus cursor pagination.

### GET /v1/agents/{agent_id} — Get Agent

### POST /v1/agents/{agent_id} — Update Agent (SDK style)

Partial update of `name`, `instructions`, `model`, `metadata`, `service_tier`, `tools`, `text`, `reasoning`, `runtime_profile`, `mcp_connections`, `skills`. No `row_version`; creates a new version.

### PATCH /v1/agents/{agent_id} — Update Agent (compare-and-set)

Same fields plus `description` and `note`; `row_version` is required. Explicit `null` returns 400.

### Versions, archive, restore, catalog

- `GET /v1/agents/{agent_id}/versions` and `GET /v1/agents/{agent_id}/versions/{version}` read immutable snapshots.

- `POST /v1/agents/{agent_id}/archive`, `POST /v1/agents/{agent_id}/unarchive` take `{"row_version"}`. `DELETE /v1/agents/{agent_id}` also archives.

- `POST /v1/agents/{agent_id}/restore` takes `{"source_version","row_version"}`.

- `GET /v1/agents/catalog` lists public Agents; `POST /v1/agents/catalog/{agent_id}/clone` copies one into your organization (`201`, new `agt_`).

---

## Sessions

A Session runs one saved Agent version. Paths are under `/v1/agents/sessions`. The Agent version, Skill versions, and MCP connections are frozen at creation.

### POST /v1/agents/sessions — Create Session

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_..."}'
```

Required: `agent_id`. Optional: `version`, `title`, `input` (a string, or an array with exactly one user message containing one `input_text` part), `model` or `agent.model`, `metadata`, `model_provider` (`{"type":"custom","base_url":"https://...","api_key":"..."}`; omitted means your calling key). `stream: true` and inline Agents return 400. Sessions always run in SandBase's hosted cloud, so there is no environment to choose; the OpenAI SDK still requires `environment={"type": "openai_hosted"}`. Returns `201` with `status` (`idle`, `in_progress`, `failed`), `lifecycle_status` (`active`, `archived`), `failure`, `source` (`direct`, `service`, `schedule`), and `row_version`.

### GET /v1/agents/sessions/{session_id}/events — Stream Events (SSE)

Live-only. Open it before sending input. `Last-Event-ID` or `after` returns 400; events are not replayed. Event `type` values start with `agent.session.`.

### POST /v1/agents/sessions/{session_id}/events — Send Input

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_.../events \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "Summarize the findings."}]}'
```

Exactly one event per request: `agent.session.input.message` or `agent.session.input.cancel`. Returns `202` with no body. Extension form: `{"input": "...", "file_ids": ["fil_..."]}` (up to 10 ready attachments). `409 session_input_pending` means earlier input is still being delivered; wait and do not resend with a new key.

### History and other Session operations

- `GET /v1/agents/sessions` (query `lifecycle_status`, `agent_id`), `GET /v1/agents/sessions/{session_id}`.

- `GET /v1/agents/sessions/{session_id}/items`, `GET /v1/agents/sessions/{session_id}/turns`, `GET /v1/agents/sessions/{session_id}/turns/{turn_id}` read history.

- `POST /v1/agents/sessions/{session_id}` replaces `metadata`; `PATCH /v1/agents/sessions/{session_id}` renames with `{"title","row_version"}`.

- `POST /v1/agents/sessions/{session_id}/cancel` (requires `Idempotency-Key`) cancels the running turn.

- `DELETE /v1/agents/sessions/{session_id}` archives; `POST /v1/agents/sessions/{session_id}/unarchive` restores.

- `POST /v1/agents/sessions/{session_id}/files` uploads one attachment (multipart `file`, 5 MiB, `Idempotency-Key` required).

- `POST /v1/agents/sessions/{session_id}/reconnect` returns `stream_url` for `GET /v1/agents/sessions/{session_id}/events/stream`, which sends `session.snapshot` and then live events.

---

## Services

A Service pins an Agent version. Each invocation creates a Run (`run_`) that creates its own Session.

### POST /v1/services — Create Service

```bash
curl -X POST https://api.sandbase.ai/v1/services \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: weekly-brief-service" \
  -H "Content-Type: application/json" \
  -d '{"name": "Weekly brief", "agent_id": "agt_...", "input": "Summarize this week in AI agents."}'
```

`Idempotency-Key` is required. Omitted `agent_version` pins the current version. `schedule` and `model_provider` are rejected.

### POST /v1/services/{service_id}/invoke — Invoke Service

```bash
curl -X POST https://api.sandbase.ai/v1/services/svc_.../invoke \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: weekly-brief-2026-w41" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Returns `202` with a Run: `id`, `status` (`pending`, `succeeded`, `failed`, `cancelled`), `session_id` (null until the Session exists), `error_code`, `trigger_source`. Optional body fields `input`, `model`, `model_provider` apply to this Run. Same key and body return the same Run; a different body returns 409. A second pending Run returns `429 concurrency_limit`. Poll `GET /v1/services/{service_id}/runs/{run_id}`, then read `GET /v1/agents/sessions/{session_id}/items`. Cancel with `POST /v1/services/{service_id}/runs/{run_id}/cancel`.

---

## Schedules

### POST /v1/schedules — Create Schedule

```bash
curl -X POST https://api.sandbase.ai/v1/schedules \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: daily-digest-schedule" \
  -H "Content-Type: application/json" \
  -d '{"name": "Daily digest", "agent_id": "agt_...", "input": "Summarize yesterday in AI agents.", "schedule": {"cron": "0 9 * * 1-5", "timezone": "Asia/Shanghai"}}'
```

`Idempotency-Key` and non-empty `input` are required. `cron` has five fields; `timezone` is IANA and defaults to `UTC`. The model credential (`model_provider` or your calling key) is stored encrypted for scheduled Runs.

### POST /v1/schedules/{schedule_id}/runs — Trigger a Run

Returns `202` with a manual Run. Scheduled firings create Runs with `trigger_source: "scheduled"`; a firing that finds a pending Run records `status: "skipped"` with `error_code: "concurrency_limit"`. List with `GET /v1/schedules/{schedule_id}/runs`. Change timing with `PUT /v1/schedules/{schedule_id}/timing`.

---

## Skills, MCP Connections, and Secrets

### POST /v1/skills — Create Skill

```bash
curl -X POST https://api.sandbase.ai/v1/skills \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -F "files=@release-notes.zip;type=application/zip"
```

One ZIP part `files` (5 MiB). The ZIP must contain one top-level folder with `SKILL.md` (`name` and `description` frontmatter) inside it, for example `zip -r release-notes.zip release-notes/`; a `SKILL.md` at the ZIP root returns `400 invalid_request`. A Skill referenced by any Agent version (including archived Agents) cannot be deleted (`409`); disable it with `POST /v1/skills/{skill_id}` and `{"status": "disabled"}` instead. Returns `201` with `id` (`skl_`) and `default_version`. Add versions with `POST /v1/skills/{skill_id}/versions`; list with `GET /v1/skills`. Reference from an Agent as `{"skill_id": "skl_...", "version": null}`.

### POST /v1/mcp-connections — Register an MCP server

Body `{"name", "server_url" (HTTPS), "secret_id"?}`; `Idempotency-Key` required. Reference from an Agent's `mcp_connections`. Disabling it blocks new Sessions and further input.

### POST /v1/secrets — Store an MCP Bearer token

Body `{"name", "kind": "mcp_bearer", "server_url", "token"}`; `Idempotency-Key` required. The token is write-only and bound to that exact URL. Secrets are not environment variables. Rotate with `POST /v1/secrets/{secret_id}/rotate`; revoke with `DELETE /v1/secrets/{secret_id}` (204).

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
