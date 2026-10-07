---
title: Services API
description: Invoke a pinned Agent version on demand and track each invocation as a Run.
---
# Services API

A Service binds a name and a default input to one pinned [Agent](/api-reference/agents/) version. Each invocation creates a Run (`run_` IDs), and each Run creates one [Session](/api-reference/sessions/) that holds the conversation and output. Service IDs use the `svc_` prefix.

## Service operations

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v1/services` | [Create a Service](./create) |
| `GET` | `/v1/services` | [List Services](./list) |
| `GET` | `/v1/services/{service_id}` | [Get a Service](./get) |
| `PATCH` | `/v1/services/{service_id}` | [Update a Service](./update) |
| `POST` | `/v1/services/{service_id}/pause` | [Pause](./lifecycle) |
| `POST` | `/v1/services/{service_id}/resume` | [Resume](./lifecycle) |
| `POST` | `/v1/services/{service_id}/archive` | [Archive](./lifecycle) (terminal) |
| `POST` | `/v1/services/{service_id}/invoke` | [Invoke](./invoke) and get a Run |
| `GET` | `/v1/services/{service_id}/runs` | [List Runs](./runs) |
| `GET` | `/v1/services/{service_id}/runs/{run_id}` | [Get a Run](./runs) |
| `POST` | `/v1/services/{service_id}/runs/{run_id}/cancel` | [Cancel a Run](./runs) |
| `GET` | `/v1/services/{service_id}/runs/{run_id}/notifications` | [Notification deliveries](#notifications) |
| `GET` | `/v1/services/{service_id}/notifications` | [Notification targets](#notifications) |
| `PUT` | `/v1/services/{service_id}/notifications/{channel}` | [Set a target](#notifications) |
| `DELETE` | `/v1/services/{service_id}/notifications/{channel}` | [Remove a target](#notifications) |

## Invoke and read the result

1. `POST /v1/services/{service_id}/invoke` with an `Idempotency-Key` returns **202 Accepted** and a Run with `status: "pending"`.
2. Poll `GET /v1/services/{service_id}/runs/{run_id}`. Each read also advances the Run from its Session, so `session_id` appears once the Session exists.
3. When `status` is `succeeded`, read the output with `GET /v1/agents/sessions/{session_id}/items` or `GET /v1/agents/sessions/{session_id}/turns`.

Run `status` values are `pending`, `succeeded`, `failed`, and `cancelled`. A failed Run carries `error_code`, for example `session_creation_rejected`, `execution_failed`, or an admission code such as `spending_limit_exceeded`.

## Rules that apply to writes

- Creating a Service, invoking it, and cancelling a Run require `Idempotency-Key` (1-128 characters, no surrounding whitespace). The same key and body return the original resource; the same key with a different body returns 409.
- Only one Run per Service can be pending. Another invocation returns `429 concurrency_limit` until the current Run finishes or is cancelled.
- `PATCH`, `pause`, `resume`, and `archive` require the current `row_version`. `archived` is terminal.
- Paused Services reject invocations with 409.
- Each invocation runs with your calling API key unless the body sends `model_provider`.

## Use a Service from AI tools

When you connect SandBase to an MCP client through [Connect AI tools](/setup/), your Services appear as tools: `sandbase_discover` (with type `service`) lists them, `sandbase_inspect` shows the input, `sandbase_run` with `name` set to the `svc_` ID and `arguments: {"idempotency_key": "…", "input": "…"}` starts a Run, and `sandbase_run_get`, `sandbase_runs`, and `sandbase_run_cancel` follow it.

## Notifications

A Service can post Run results to a Feishu or Lark bot. Only the `feishu` channel exists.

```bash
curl -X PUT https://api.sandbase.ai/v1/services/svc_2d7a9e14-6b3c-5f8d-a1e2-4c6b8d0f3a95/notifications/feishu \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"webhook_url": "https://open.feishu.cn/open-apis/bot/v2/hook/YOUR_BOT_TOKEN"}'
```

- `webhook_url` must be `https://open.feishu.cn/open-apis/bot/v2/hook/<token>` or the `open.larksuite.com` equivalent. It is write-only.
- `GET …/notifications` returns `{"data": [{"channel", "version", "updated_at"}]}` without the URL. `PUT` returns the same list.
- `DELETE …/notifications/feishu` returns `{"deleted": true}`.
- `GET …/runs/{run_id}/notifications` lists deliveries with `status` (`pending`, `processing`, `succeeded`, `failed`, `canceled`), `attempts`, `error_code`, `delivered_at`, and `next_attempt_at`.

## Pagination

Service and Run lists use offset pagination: `limit` (1-100, default 20) and `offset`, with `data`, `total`, `limit`, and `offset` in the response.
