---
title: Errors and retries
description: Classify SandBase API failures, decide when a retry is safe, and preserve useful diagnostics without exposing secrets.
---

# Errors and retries

Handle errors by HTTP status, endpoint family, and operation semantics. SandBase exposes several compatible protocols,
so there is no single error JSON shape shared by every endpoint.

## Read the endpoint's error shape

- OpenAI-compatible operations normally return an `error` object with a message and type.
- Anthropic Messages returns Anthropic-compatible error envelopes.
- Core platform operations can return a flat `{ "error": "..." }` body or a documented resource-specific error.
- Google and provider-native operations preserve their compatible protocol shape where documented.

Use the response's HTTP status and documented body. Do not require optional fields such as `code`, `param`, or
`request_id` unless the selected endpoint guarantees them. See the [API error reference](/api-reference/errors) for
examples and the [OpenAPI specification](/docs/openapi.yaml) for operation-specific responses.

## Decide what to do by status

| Status | Typical cause | Recommended action |
|---|---|---|
| `400` / `422` | Invalid body, parameter, or unsupported model capability | Fix the request before retrying. |
| `401` | Missing, invalid, expired, or revoked credential | Replace the credential. |
| `402` | Billing state does not allow the request | Resolve the account balance or spending control. |
| `403` | Credential scope or resource access is insufficient | Use an authorized key or resource. |
| `404` | Model, task, or platform resource was not found | Verify the identifier and organization. |
| `409` | Resource state or concurrent operation conflict | Read the current state, then decide whether to retry. |
| `429` | SandBase or an upstream provider limited the request | Honor `Retry-After` when present; otherwise back off with jitter. |
| `500` / `502` / `503` / `504` | Internal, upstream, or temporary availability failure | Retry only if repeating the operation is safe. |

This table is a handling guide, not a promise that every endpoint emits every status.

## Use a bounded retry policy

For a safe-to-repeat request, use exponential backoff with jitter, cap the delay, and enforce a total request budget.
Disable SDK retries if an outer application layer already retries, or account for both layers when setting the budget.

```python
import os
import random
import time

from openai import APIStatusError, OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def chat_with_backoff(messages, attempts=4):
    for attempt in range(attempts):
        try:
            return client.chat.completions.create(
                model="deepseek/deepseek-v4-flash",
                messages=messages,
            )
        except APIStatusError as error:
            retryable = error.status_code in {429, 500, 502, 503, 504}
            if not retryable or attempt == attempts - 1:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

When a response includes `Retry-After`, parse and honor it rather than using the fallback delay. Keep the policy
configurable; the right attempt count and deadline depend on the caller's latency and cost budget.

## Protect against duplicate side effects

Repeating an inference request creates a new generation and can incur additional cost. It is acceptable only when the
application needs any valid answer and can tolerate regeneration.

Be more conservative with operations that create, update, delete, publish, schedule, or invoke work:

- use documented idempotency support when an endpoint provides it;
- otherwise read current state before repeating an ambiguous request;
- never replay a tool call merely because the surrounding model stream disconnected;
- keep a client operation ID in your own system when you need to reconcile retries.

## Handle timeouts and streams separately

A timeout does not prove the server stopped processing the request. Before retrying an asynchronous or state-changing
operation, query its documented resource or task status when possible.

For streaming responses, distinguish an HTTP error before the stream starts from a disconnect after partial output.
Only the normal protocol termination signal proves a complete stream. See [Streaming responses](/guides/streaming).

## Log useful, safe diagnostics

Record:

- endpoint and model identifier;
- HTTP status and compatible error type when present;
- provider or request identifier when returned;
- attempt count, elapsed time, and whether any response bytes arrived.

Do not log API keys, credential values, full sensitive prompts, or unredacted provider responses. Show users a concise
actionable message while retaining sanitized diagnostics for operators.

## Related guidance

- [API error reference](/api-reference/errors)
- [Rate limits](/guides/rate-limiting)
- [Streaming responses](/guides/streaming)
- [Authentication](/api-reference/authentication)
