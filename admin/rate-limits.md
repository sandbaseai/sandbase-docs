---
title: Rate Limits
description: SandBase API rate limiting — how limits are enforced and how to handle 429 responses.
---

# Rate Limits

SandBase enforces rate limits to ensure fair usage and platform stability. Limiting is applied as a 1-minute sliding window using two layers, and a request must pass both to be served:

1. **Per-key limit** — an optional per-minute request cap on an individual API key. When unset, the key is only subject to the global limit.
2. **Global limit** — a platform-wide per-minute request cap.

## How to find your effective limit

SandBase does not publish a single fixed requests-per-minute number because the effective limit can vary by workspace, key, and platform capacity. Your key is governed by the lower of any custom per-key limit and the current platform-wide protection limit.

If your workload needs a guaranteed or higher limit, contact SandBase support with the organization, application, expected steady rate, and expected burst rate. Do not design a production client around an undocumented numeric default.

## Handling 429 Responses

When a limit is exceeded, the API aborts the request with HTTP 429. On the `/v1/*` API, the body is a flat error object:

```json
{
  "error": "API key rate limit exceeded"
}
```

The message is `"API key rate limit exceeded"` when the per-key limit is hit, or `"global rate limit exceeded"` when the platform-wide limit is hit.

::: warning
The API does **not** currently emit `Retry-After` or `X-RateLimit-*` headers on 429 responses. Do not rely on these headers — they are not sent. Use client-side backoff instead.
:::

### Best Practices

1. **Implement exponential backoff** — on a 429, wait with increasing delays before retrying.
2. **Batch where possible** — combine multiple small requests into fewer larger ones.
3. **Smooth your request rate** — spread bursts across the window rather than firing all at once.
4. **Cap retry attempts** — stop after a bounded number of retries and surface the failure.
5. **Add jitter** — randomize retry delays so multiple workers do not retry at the same moment.

## Per-Key Limit

A per-key request cap can be set on an individual key (stored as `rate_limit`, requests per minute). When set, it is enforced independently of and in addition to the global limit.

::: info
Setting a per-key rate limit is not currently exposed through the public key-management API. Contact support if you need a custom per-key limit configured.
:::
