---
title: API Errors
description: Handle SandBase API errors by HTTP status, endpoint family, documented response shape, and retry safety.
---

# API Errors

SandBase uses standard HTTP status codes, but it does not expose one universal error body. Branch on the HTTP status first, then parse the response schema documented for the endpoint you called. Do not require every error to contain `code`, `param`, `message`, or `request_id`.

## Response shapes

Core middleware and several `/v1/*` endpoints return a flat error:

```json
{"error":"API key rate limit exceeded"}
```

Agent resource APIs can return a typed error object:

```json
{"error":{"type":"invalid_request","message":"invalid request body"}}
```

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
| `429` | Per-key or platform-wide request protection | Retry with bounded backoff and jitter when the operation is safe to repeat. |
| `500`, `502`, `503`, `504` | SandBase or upstream failure | Retry only when the operation is safe to repeat. |

Not every endpoint documents every status in this table. The operation's OpenAPI response map is authoritative.

## Authentication errors

Documented authentication messages include:

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`
- `insufficient_scope`

Use `Authorization: Bearer $SANDBASE_API_KEY` for standard endpoints. `POST /v1/messages` also accepts `x-api-key`; protocol-compatible Google endpoints document their own supported key headers.

A revoked key cannot be re-enabled. Create a replacement, update the consuming application, verify it, and then remove any remaining references to the old key.

## Rate limits

Documented flat messages include `API key rate limit exceeded` and `global rate limit exceeded`. SandBase does not publish one universal numeric limit because the effective limit can vary by key and platform capacity.

If a response includes `Retry-After`, respect it. Otherwise use bounded exponential backoff with jitter. See [Rate limits](/guides/rate-limiting) for request-smoothing patterns.

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
