---
title: Services
description: Deploy a tested Agent version as a Service, invoke it, track each Run, and call it from AI tools.
---

# Services

A **Service** makes a tested Agent version callable on demand. It stores a name, a pinned `agent_version`, and an optional default input. Each invocation creates a **Run**, and each Run creates its own Session with the full conversation and output.

Service IDs start with `svc_`; Run IDs start with `run_`.

## Create a Service

`Idempotency-Key` is required. Omitting `agent_version` pins the Agent's current version at creation time.

```bash
curl -X POST https://api.sandbase.ai/v1/services \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: weekly-brief-service" \
  -H "Content-Type: application/json" \
  -d '{"name": "Weekly brief", "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60", "input": "Summarize this week in AI agents."}'
```

The Service stays on that Agent version until you change it with `PATCH /v1/services/{service_id}` (`agent_version` plus the current `row_version`).

## Invoke it and read the result

```bash
curl -X POST https://api.sandbase.ai/v1/services/svc_2d7a9e14-6b3c-5f8d-a1e2-4c6b8d0f3a95/invoke \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: weekly-brief-2026-w41" \
  -H "Content-Type: application/json" \
  -d '{"input": "Summarize this week in AI agents, focusing on open-source releases."}'
```

The response is **202 Accepted** with a Run whose `status` is `pending`. Send `{}` to use the saved default input.

1. Poll `GET /v1/services/{service_id}/runs/{run_id}`. Each read also advances the Run from its Session.
2. When `session_id` is set, you can follow the conversation with the [Sessions API](/agents/sessions).
3. When `status` is `succeeded`, read the output with `GET /v1/agents/sessions/{session_id}/items`.

| Run `status` | Meaning |
|---|---|
| `pending` | Accepted; the Session is starting or running |
| `succeeded` | The turn completed |
| `failed` | See `error_code`, for example `session_creation_rejected`, `execution_failed`, or `spending_limit_exceeded` |
| `cancelled` | The turn was cancelled |

## Retries and concurrency

- Retrying an invocation with the same `Idempotency-Key` and body returns the original Run. The same key with a different body returns 409.
- Only one Run per Service can be pending. Another invocation returns `429 concurrency_limit` until it finishes. Cancel a pending Run with `POST /v1/services/{service_id}/runs/{run_id}/cancel` (body `{}`, `Idempotency-Key` required).
- Each invocation uses your calling API key for model calls unless the body sends `model_provider`.
- `pause`, `resume`, and `archive` take the current `row_version`. Paused Services reject invocations; archived is permanent.

## Use a Service from AI tools

When you [connect an AI tool to SandBase](/setup/), your Services become available through SandBase MCP tools:

- `sandbase_discover` lists Services (type `service`).
- `sandbase_inspect` with the `svc_` ID shows the input it expects.
- `sandbase_run` with `name` set to the `svc_` ID and `arguments: {"idempotency_key": "…", "input": "…"}` starts a Run. Reuse the same key and input on retries.
- `sandbase_run_get`, `sandbase_runs`, and `sandbase_run_cancel` follow, list, and cancel Runs.

Acceptance is not completion: poll `sandbase_run_get` until the Run finishes.

## Notifications

A Service can post Run results to a Feishu or Lark bot. Save the webhook with `PUT /v1/services/{service_id}/notifications/feishu` and `{"webhook_url": "https://open.feishu.cn/open-apis/bot/v2/hook/…"}`. The URL is write-only. See [Notifications](/api-reference/services/#notifications) for delivery records.

## Next steps

- [Services API reference](/api-reference/services/)
- [Schedules](/agents/schedules)
- [Sessions](/agents/sessions)
