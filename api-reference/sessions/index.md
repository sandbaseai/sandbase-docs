---
title: Sessions API
description: Run a saved Agent version, send input, stream events, and read Session history.
---
# Sessions API

A Session runs one saved [Agent](/api-reference/agents/) version in SandBase's hosted cloud; there is no execution environment to choose. Session IDs use the `ses_` prefix. Sessions are a sub-resource of Agents: every path starts with `/v1/agents/sessions`.

The standard operations follow the OpenAI Agents protocol (`client.beta.agents.sessions`); see [OpenAI compatibility](/agents/openai-compatibility) for what the official SDK can and cannot do. SandBase extensions add renaming, archive state, cancellation, attachments, and a reconnectable product stream.

::: info Where Sessions come from
You create a Session directly with `POST /v1/agents/sessions`, or a [Service](/api-reference/services/) invocation or [Schedule](/api-reference/schedules/) Run creates one for you. The Session reports `source` (`direct`, `service`, or `schedule`) and `source_id`, and the Run reports the Session in `session_id`.
:::

## Recommended flow

1. [Create a Session](./create) for a saved Agent. The Agent version, Skill versions, and MCP connections are frozen at this point.
2. [Open the event stream](./stream) with `GET /v1/agents/sessions/{session_id}/events`. The stream is live-only, so open it before you send input.
3. [Send input](./send-events) with `POST /v1/agents/sessions/{session_id}/events` and an `agent.session.input.message` event. The call returns 202.
4. Read results from the stream, or afterwards from [items](./items) and [turns](./turns).

## Session operations

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v1/agents/sessions` | [Create a Session](./create) |
| `GET` | `/v1/agents/sessions` | [List Sessions](./list) |
| `GET` | `/v1/agents/sessions/{session_id}` | [Get a Session](./get) |
| `POST` | `/v1/agents/sessions/{session_id}` | [Replace metadata](./update) |
| `PATCH` | `/v1/agents/sessions/{session_id}` | [Rename](./rename) with `row_version` |
| `DELETE` | `/v1/agents/sessions/{session_id}` | [Delete](./delete), which archives the Session |
| `POST` | `/v1/agents/sessions/{session_id}/events` | [Send one input or cancel event](./send-events) |
| `GET` | `/v1/agents/sessions/{session_id}/events` | [Stream live events](./stream) (SSE) |
| `GET` | `/v1/agents/sessions/{session_id}/items` | [List items](./items) |
| `GET` | `/v1/agents/sessions/{session_id}/turns` | [List turns](./turns) |
| `GET` | `/v1/agents/sessions/{session_id}/turns/{turn_id}` | [Get one turn](./get-turn) |
| `POST` | `/v1/agents/sessions/{session_id}/cancel` | [Cancel the running turn](./cancel) |
| `POST` | `/v1/agents/sessions/{session_id}/archive` | [Archive](./archive) |
| `POST` | `/v1/agents/sessions/{session_id}/unarchive` | [Unarchive](./unarchive) |
| `POST` | `/v1/agents/sessions/{session_id}/reconnect` | [Reconnect](./reconnect) after a dropped stream |
| `GET` | `/v1/agents/sessions/{session_id}/events/stream` | [Snapshot-then-live stream](./stream-snapshot) (SSE) |
| `POST` | `/v1/agents/sessions/{session_id}/files` | [Upload an attachment](./upload-file) |
| `GET` | `/v1/agents/sessions/{session_id}/files` | [List attachments](./list-files) |
| `GET` | `/v1/agents/sessions/{session_id}/files/{file_id}/content` | [Download an attachment](./download-file) |
| `DELETE` | `/v1/agents/sessions/{session_id}/files/{file_id}` | [Delete an attachment](./delete-file) |

## Status fields

- `status` is the execution status: `idle`, `in_progress`, or `failed`. Function tools that require a client result (`requires_action`) are not supported yet; such a Session read returns `502 executor_contract_error`.
- `lifecycle_status` is `active` or `archived`. Archived Sessions reject input, metadata updates, and streams. `DELETE` archives; `unarchive` restores.
- `failure` is `null` or an object with `code`, `message`, `action`, and sometimes `retryable`.

| `failure.code` | Meaning | Suggested `action` |
|---|---|---|
| `session_creation_rejected` | The execution layer rejected the Session | `create_new_session` |
| `model_authentication_failed` | The model provider rejected the key | `create_session_with_updated_model_provider` |
| `model_rate_limited` | The model provider is rate limiting (retryable) | `retry_later` |
| `model_quota_exceeded` | The model account has no quota | `check_model_account` |
| `context_limit_exceeded` | The conversation exceeds the model context | `create_new_session` |
| `environment_connection_timeout` | The environment did not connect in time (retryable) | `retry_later` |
| `runtime_unavailable` | The execution environment is unavailable (retryable) | `retry_later` |
| `model_request_failed` | The model request did not complete | `inspect_history` |
| `model_configuration_rejected` | The model or execution layer rejected the configuration | `create_session_with_updated_model_provider` |
| `execution_failed` | Failure without a more specific public cause | `inspect_history` |

List results can also contain placeholder rows with `session_not_ready`, `session_execution_unavailable`, `session_configuration_unavailable`, or `session_snapshot_unavailable` when a Session cannot be read live.

## Model credentials

By default a Session calls models with the same SandBase API key that created it. Send `model_provider` to choose explicitly:

- `{"type": "sandbase"}` uses your calling key. `base_url` is not allowed.
- `{"type": "custom", "base_url": "https://…", "api_key": "…"}` calls your own OpenAI-compatible HTTPS endpoint. The URL cannot contain credentials, a query, or a fragment, and SandBase never falls back to your SandBase key.

`model_provider` is write-only and never appears in responses.

## Admission and errors

Creating a Session and sending input check execution admission: `402 spending_limit_exceeded` when the key limit or organization balance is exhausted, `403 org_disabled` when the organization cannot run Agents, and `503 admission_unavailable` when the check cannot complete. Reads, cancellation, and archive are not blocked by balance.

Sending input can also return `409 session_input_pending` (earlier input is still being delivered; wait, and do not resend with a new key), `409 session_input_expired` (inspect history before sending again), or `409 session_environment_unavailable` (wait or create a new Session). See [Errors](/api-reference/errors#agents-platform-errors).

## Pagination

Sessions, items, and turns use cursor pagination (`limit` 1-100, `after`, `order`). Attachments use offset pagination (`limit` 1-100, `offset`).
