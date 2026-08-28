---
title: AI-Readable Error Guide
description: Handle SandBase API errors by endpoint family, HTTP status, retry safety, and documented response shape.
---

# Error handling for AI clients

SandBase does not expose one universal error schema. Branch on HTTP status first, then parse the response shape
documented for the endpoint family. Do not assume that every response contains `code`, `param`, `request_id`, or a
specific message string.

## Public response shapes

Core `/v1/*` middleware and several model or resource endpoints return a flat error:

```json
{"error":"API key rate limit exceeded"}
```

Agent resource APIs can return a typed error object:

```json
{"error":{"type":"invalid_request","message":"invalid request body"}}
```

OpenAI-compatible gateways retain an OpenAI-compatible envelope. `POST /v1/messages` retains the
Anthropic-compatible envelope:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

## HTTP status handling

| Status | Meaning | Client action |
|---|---|---|
| `400` | Invalid input or unsupported parameter | Fix the request using the selected endpoint and model schema. |
| `401` | Missing, invalid, revoked, or expired credential | Replace or rotate the credential; do not retry unchanged. |
| `402` | The request cannot be funded or a spending limit was reached | Resolve billing or key limits before retrying. |
| `403` | The credential lacks permission, or a compatibility surface maps a spending failure to 403 | Inspect the documented envelope and use an authorized key. |
| `404` | Model or resource not found | Verify the current model name or resource ID. |
| `409` | Resource state conflict | Read the latest resource state before deciding whether a retry is safe. |
| `429` | Per-key or platform-wide request protection | Retry with bounded exponential backoff and jitter. |
| `500`, `502`, `503`, `504` | SandBase or upstream transient failure | Retry only when the operation is safe to repeat. |

## Authentication and rate-limit messages

Documented authentication messages include:

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`
- `insufficient_scope`

Documented rate-limit messages include `API key rate limit exceeded` and `global rate limit exceeded`. A `429`
response does not currently include `Retry-After` or `X-RateLimit-*` headers, and there is no published universal
RPM or concurrency default.

## Model and resource lookup

Use `GET /v1/models` to discover enabled model IDs and `GET /v1/models/{id_or_name}` to inspect a model before
execution. Treat a resource ID as opaque and verify it with the relevant list or get operation. Do not construct a
different polling URL from an ID prefix.

## Retry algorithm

Use bounded exponential backoff with jitter:

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

Apply these rules:

- retry `429` after a client-computed delay;
- retry transient `5xx` responses only a small, bounded number of times;
- do not retry an unchanged `400`, `401`, `402`, `403`, or `404` request;
- check idempotency before repeating any create, trigger, or external-action request;
- retain partial output when a stream fails and decide whether continuing or restarting is safe;
- surface the final HTTP status and sanitized endpoint-specific error to the caller.

## Streaming failures

After a streaming response has started, a failure may arrive in the protocol's stream format instead of as a new
HTTP status. Treat the stream as incomplete, close it, retain any partial content needed by the application, and
retry only when the request is safe to repeat.

## See also

- [Error Codes](/api-reference/errors) — public response formats and common HTTP statuses
- [Rate limits](/guides/rate-limiting) — 429 handling and request smoothing
- [Errors and retries](/guides/error-handling) — implementation patterns
- [Authentication](/api-reference/authentication) — supported credentials and key lifecycle
