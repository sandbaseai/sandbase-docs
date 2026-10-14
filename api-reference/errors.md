---
title: API Errors
description: Handle SandBase API errors by HTTP status, endpoint family, documented response shape, and retry safety.
---

# API Errors

SandBase uses standard HTTP status codes, but it does not expose one universal error body. Branch on the HTTP status first, then parse the response schema documented for the endpoint you called. Do not require every error to contain `code`, `param`, `message`, or `request_id`.

## Response shapes

Core middleware and several `/v1/*` endpoints return a flat error:

```json
{"error":"organization rate limit exceeded"}
```

Agents platform resources (`/v1/agents*`, `/v1/services*`, `/v1/schedules*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*`) return an OpenAI-style object with a stable `code`. See [Agents platform errors](#agents-platform-errors):

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

The webhook Events API (`/events/webhooks*`) returns `{"code":<http status>,"message":"..."}`. See [Webhooks](/api-reference/webhooks#authentication-and-errors).

OpenAI-compatible endpoints retain an OpenAI-compatible envelope. `POST /v1/messages` retains an Anthropic-compatible envelope:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

Use the [OpenAPI specification](/openapi.yaml) for the exact status codes and schemas of a public operation.

## HTTP status handling

| Status | Typical meaning | Client action |
|---|---|---|
| `400` | Invalid input or unsupported parameter | Fix the request using the endpoint and selected model schema. |
| `401` | Missing, invalid, revoked, or expired credential | Replace or rotate the credential; do not retry unchanged. |
| `402` | The request cannot be funded or a spending limit was reached | Resolve the balance or key limit before retrying. |
| `403` | The credential lacks permission, or a compatibility endpoint maps a spending failure to 403 | Inspect the endpoint-specific envelope and use an authorized key. |
| `404` | Model or resource is unavailable to the caller | Verify the current model ID or resource ID. |
| `409` | Resource state conflict | Read the latest state before deciding whether a retry is safe. |
| `422` | Semantically invalid resource input | Correct the documented field values. |
| `429` | Organization request limit, video concurrency limit, or daily free API allowance | Retry with bounded backoff and jitter when the operation is safe to repeat. |
| `500`, `502`, `503`, `504` | SandBase or upstream failure | Retry only when the operation is safe to repeat. |

Not every endpoint documents every status in this table. The operation's OpenAPI response map is authoritative.

## Authentication errors

Documented authentication messages include:

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

A scoped key used outside its scope returns `403` with a nested body instead: `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`. Agents platform resources return the same `code` in their own envelope.

Use `Authorization: Bearer $SANDBASE_API_KEY` for standard endpoints. `POST /v1/messages` also accepts `x-api-key`; protocol-compatible Google endpoints document their own supported key headers.

A revoked key cannot be re-enabled. Create a replacement, update the consuming application, verify it, and then remove any remaining references to the old key.

## Rate limits

`organization rate limit exceeded` (`429`) means your organization reached its assigned requests-per-minute limit, which all of its API keys share. Protocol-compatible endpoints return it in their own envelope. SandBase does not publish one universal numeric limit because the limit is assigned per organization.

`daily free API limit exceeded` (`429`) means your organization used its daily allowance for API operations that are currently free. It resets at 00:00 UTC, so do not retry before then.

If a response includes `Retry-After`, respect it. Otherwise use bounded exponential backoff with jitter. See [Rate limits](/guides/rate-limiting) for request-smoothing patterns.

Task submissions have two additional checks. `organization concurrency limit exceeded` (`429`) means your organization already has as many tasks in progress as its account level allows; it clears when a running task finishes. It applies to every model type on `POST /v1/run` and `/v1/api/*`, and to video submissions on other endpoints. `insufficient credit for estimated video cost` (`402`) means the estimated cost is more than your balance plus credit line; top up before retrying. See [Concurrency limits](/guides/concurrency-limits).

## Retry safety

Use this decision order:

1. Determine whether the operation has already produced an externally visible effect.
2. Do not retry an unchanged `400`, `401`, `402`, `403`, `404`, or `422` request.
3. For `409`, read the current resource state before retrying.
4. Retry `429` and transient `5xx` responses only a small, bounded number of times.
5. Before repeating a create, trigger, upload, or external-action request, confirm that the operation is idempotent or that your application can reconcile duplicates.

A suitable delay is:

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

## Agents platform errors

Agents, Sessions, Services, Schedules, Skills, MCP connections, and Secrets return one envelope. For most codes, `message` is a fixed, safe sentence; `invalid_request` may carry a short explanation, such as which input shape or option is not supported. Branch on `code`, not on `message`.

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type` is `authentication_error` for 401, `server_error` for 5xx, and `invalid_request_error` otherwise.

| HTTP | `code` | Meaning | What to do |
|---|---|---|---|
| 400 | `invalid_request` | Malformed or unknown fields, failed validation, or an unsupported option | Fix the request; do not retry unchanged |
| 400 | `skill_not_found` | A referenced Skill or version is not available | Fix the Agent's `skills` |
| 401 | `unauthorized` | Missing, invalid, or conflicting API key headers | Check `Authorization` / `X-API-Key` |
| 402 | `spending_limit_exceeded` | Key spending limit or organization balance exhausted | Add credits or raise the limit |
| 403 | `insufficient_scope` | The key is scoped and cannot use Agents resources | Use a standard Console-created key |
| 403 | `org_disabled` | The organization is not permitted to run Agents | Contact support |
| 404 | `not_found` | The resource does not exist in your organization | Check the ID |
| 409 | `conflict` | Stale `row_version`, a state that does not allow the change, or an `Idempotency-Key` reused with a different body | Read the resource again, then decide |
| 409 | `session_input_pending` | Earlier input is still being delivered | Wait; do not resend with a new key |
| 409 | `session_input_expired` | Input admission expired | Inspect history before sending again |
| 409 | `session_environment_unavailable` | The execution environment is unavailable | Wait or create a new Session |
| 413 | `request_too_large` | The request body, or the Session configuration frozen from it, exceeds the size limit | Send a smaller body; do not retry unchanged |
| 429 | `concurrency_limit` | A Service or Schedule already has a pending Run | Wait for it to finish or cancel it |
| 429 | `quota_exceeded` | Agents quota exceeded | Retry later |
| 502 | `executor_rejected`, `executor_contract_error` | The execution layer rejected the request or answered unexpectedly | Check the Agent configuration, then retry |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | A dependency is temporarily unavailable | Retry with backoff and the same `Idempotency-Key` |

`skill_runtime_incompatible` can also appear; it is returned as 503 with the message `internal error`.

## Streaming failures

After a stream starts, an error may arrive in that protocol's stream format instead of as a new HTTP response. Treat the stream as incomplete, retain any partial output your application needs, and retry only when regenerating the request is safe. Do not assume every provider emits the same terminal event or finish reason.

## Operational debugging

Record the endpoint, HTTP status, selected model or resource ID, timestamp, and any safe request identifier returned by the server. Never log authorization headers, API keys, credential values, or sensitive prompt content.

Use [Console → Activities](https://www.sandbase.ai/console/activities) to inspect organization request history. When reporting a persistent failure, include sanitized request metadata and the smallest reproducible request.

## See also

- [Authentication](/api-reference/authentication)
- [Errors and retries](/guides/error-handling)
- [Rate limits](/guides/rate-limiting)
- [AI-readable Error Guide](/for-agents/errors)
