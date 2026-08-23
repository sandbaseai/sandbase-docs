---
title: AI-Readable Error Codes
description: Complete list of SandBase API error codes with HTTP status, descriptions, and fixes.
# TODO Phase 2: Auto-generate from /api-reference/errors.md as source of truth.
# Keep this file in sync manually until the generation script is built.
---

# Error Codes

> All SandBase API errors return a consistent JSON structure. Use this page to look up any error code and its resolution.

## Error Response Format

```json
{
  "error": {
    "code": "invalid_api_key",
    "message": "The API key provided is invalid or has been revoked.",
    "type": "authentication_error",
    "param": null,
    "request_id": "req_abc123"
  }
}
```

### Schema Fields

| Field | Type | Always Present | Description |
|-------|------|:--------------:|-------------|
| `code` | string | ✅ | Machine-readable error code (see tables below) |
| `message` | string | ✅ | Human-readable explanation with specific details |
| `type` | string | ✅ | Error category — one of: `authentication_error`, `rate_limit_error`, `billing_error`, `invalid_request_error`, `not_found_error`, `server_error`. Agent-specific errors (run_failed, tool_execution_failed) use `server_error` type. |
| `param` | string or null | ✅ | The parameter that caused the error, or `null` if not applicable |
| `request_id` | string | ✅ | Unique request ID — include this when contacting support |

---

## Authentication Errors

| Code | HTTP | Description | Fix |
|------|------|-------------|-----|
| `invalid_api_key` | 401 | API key is invalid or revoked | Verify key at [Console → API Keys](https://www.sandbase.ai/console/keys). Regenerate if compromised. |
| `missing_api_key` | 401 | No Authorization header provided | Add header: `Authorization: Bearer sk-sb-YOUR_KEY` |
| `expired_api_key` | 401 | API key has expired | Generate a new key in [Console → API Keys](https://www.sandbase.ai/console/keys) |
| `insufficient_permissions` | 403 | Key lacks permission for this operation | Check key scopes in console; create a new key with required permissions |
| `organization_suspended` | 403 | Organization account is suspended | Contact support@sandbase.ai with your `request_id` |

## Rate Limiting Errors

| Code | HTTP | Description | Fix |
|------|------|-------------|-----|
| `rate_limited` | 429 | Too many requests per minute | Respect `Retry-After` header; implement exponential backoff with jitter (see [Retry Strategy](#retry-strategy)) |
| `concurrent_limit` | 429 | Too many concurrent requests | Reduce parallelism; default is 5 concurrent requests |
| `daily_limit_exceeded` | 429 | Daily request quota exhausted | Wait for daily reset (midnight UTC) or upgrade plan in [Console → Billing](https://www.sandbase.ai/console/billing) |

## Billing Errors

| Code | HTTP | Description | Fix |
|------|------|-------------|-----|
| `insufficient_balance` | 402 | Account balance too low | Top up at [Console → Billing](https://www.sandbase.ai/console/billing) |
| `payment_required` | 402 | No payment method on file | Add payment method at [Console → Billing](https://www.sandbase.ai/console/billing) |
| `spend_limit_reached` | 402 | Spend limit for this period reached | Increase limit in [Console → Billing → Spend Limits](https://www.sandbase.ai/console/billing) |

## Model Errors

| Code | HTTP | Description | Fix |
|------|------|-------------|-----|
| `model_not_found` | 404 | Model doesn't exist or is disabled | Verify model name with `GET /v1/models`; check for typos in vendor/model format |
| `model_overloaded` | 503 | Model is temporarily at capacity | Retry after 5–10s or use a fallback model (see [Retry Strategy](#retry-strategy)) |
| `model_deprecated` | 410 | Model has been deprecated | Check `message` field for the suggested replacement model |
| `context_length_exceeded` | 400 | Input exceeds model's context window | Reduce input tokens; check `context_length` via `GET /v1/models/{name}` |
| `output_length_exceeded` | 400 | Output hit `max_tokens` limit before completing | Increase `max_tokens` parameter or accept truncated output (`finish_reason: "length"`) |

## Request Errors

| Code | HTTP | Description | Fix |
|------|------|-------------|-----|
| `invalid_request` | 400 | Request body doesn't match expected schema | Check `message` field for the specific validation error; compare with endpoint docs |
| `invalid_json` | 400 | Request body is not valid JSON | Validate JSON before sending; check for trailing commas, unescaped characters, or encoding issues |
| `invalid_parameter` | 400 | A parameter value is out of range or wrong type | Check `param` field; verify value constraints in API docs |
| `missing_parameter` | 400 | A required parameter is missing | Check `param` field for which parameter; see endpoint documentation for required fields |
| `content_too_large` | 413 | Request payload exceeds 10MB size limit | Reduce request size; split large inputs into multiple calls |
| `unsupported_media_type` | 415 | Content-Type not supported | Use `Content-Type: application/json` |
| `content_policy_violation` | 400 | Input or output violated content safety policy | Modify input to comply with [usage policies](https://www.sandbase.ai/policies); the `message` field contains details on what triggered the violation |

## Resource Errors

| Code | HTTP | Description | Fix |
|------|------|-------------|-----|
| `not_found` | 404 | Requested resource does not exist | Verify the resource ID; it may have been deleted or never existed |
| `already_exists` | 409 | Resource with this identifier already exists | Use a different name/ID, or use the update endpoint to modify the existing resource |
| `resource_archived` | 410 | Resource has been archived | Create a new resource; archived resources cannot be restored via API |

## Agent & Run Errors

| Code | HTTP | Description | Fix |
|------|------|-------------|-----|
| `agent_not_found` | 404 | Agent ID does not exist | Verify with `GET /v1/agents`; agent may have been archived |
| `agent_not_published` | 400 | Legacy publication resource is unavailable | Use a version-pinned Agent directly with `POST /v1/sessions`; current Agents have no publish state |
| `run_failed` | 500 | Agent run encountered an internal error | Retrieve details via `GET /v1/sessions/{id}/events` — the last event contains the error |
| `run_timeout` | 408 | Agent run exceeded time limit (default: 5min) | Simplify the task, reduce tool chain depth, or increase timeout in agent config |
| `tool_execution_failed` | 502 | An external tool/API call failed during agent execution | Check `GET /v1/sessions/{id}/events` for the failed tool call and its error output |

## Server Errors

| Code | HTTP | Description | Fix |
|------|------|-------------|-----|
| `internal_error` | 500 | Unexpected server error | Retry 1–2 times with backoff; if persistent, contact support with `request_id` |
| `service_unavailable` | 503 | Service is temporarily down | Retry with exponential backoff (see [Retry Strategy](#retry-strategy)) |
| `gateway_timeout` | 504 | Upstream provider timed out | Retry or try a different model from the same category |

---

## Streaming Errors

When using streaming (`"stream": true` or SSE endpoints), errors can occur mid-stream. These are delivered as an SSE event:

```
event: error
data: {"error": {"code": "internal_error", "message": "Stream interrupted", "type": "server_error"}}
```

Key differences from non-streaming errors:
- **No HTTP status code** — the connection was already established with 200
- **Partial data may have been sent** — handle gracefully by checking `finish_reason`
- **Always close the connection** after receiving an error event
- **The same `code` values apply** — use the tables above for resolution

---

## Retry Strategy

For transient errors, use exponential backoff **with jitter** to avoid thundering herd:

```
wait = min(base_delay × 2^attempt, max_delay) + random(0, base_delay)
```

Recommended settings:
- `base_delay`: 1 second
- `max_delay`: 60 seconds
- `max_retries`: 5
- Always add random jitter

The `Retry-After` header (when present) overrides the calculated wait time — always respect it.

### Retryable vs. Non-Retryable Errors

| Code | Retryable | Strategy |
|------|:---------:|----------|
| `rate_limited` | ✅ | Respect `Retry-After` header |
| `concurrent_limit` | ✅ | Back off and reduce parallelism |
| `model_overloaded` | ✅ | Wait 5–10s or switch to fallback model |
| `service_unavailable` | ✅ | Exponential backoff |
| `gateway_timeout` | ✅ | Retry or switch model |
| `internal_error` | ⚠️ | Retry 1–2 times only; if persistent, it's a real bug |
| `daily_limit_exceeded` | ❌ | Wait for daily reset |
| `run_failed` | ❌ | Terminal — inspect session events for cause |
| `run_timeout` | ⚠️ | May retry with simpler input or higher timeout |
| `content_policy_violation` | ❌ | Modify input; retrying the same content will fail again |
| All 400 errors | ❌ | Fix the request; the same input will always fail |
| All 401/402/403 errors | ❌ | Fix credentials or billing; retrying won't help |

---

## See Also

- [Authentication](/api-reference/authentication) — detailed auth guide
- [Rate Limiting](/guides/rate-limiting) — limits and best practices
- [Error Handling](/guides/error-handling) — patterns and code examples
- [Complete API Reference](./full) — all endpoints with request/response schemas
