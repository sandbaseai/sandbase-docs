---
title: Rate Limits
description: SandBase API rate limiting — how limits are enforced and how to handle 429 responses.
---

# Rate Limits

SandBase enforces rate limits to ensure fair usage and platform stability. The request limit is set per organization: an optional requests-per-minute cap, counted over a 1-minute sliding window and shared by every API key in the organization.

It applies to `POST /v1/run`, `POST /v1/chat/completions`, `POST /v1/responses`, `POST /v1/messages`, `POST /v1/upload`, and the Gemini `generateContent`, `streamGenerateContent`, and `POST /v1beta/interactions` endpoints. Polling endpoints such as `GET /v1/run/{id}` are not counted.

## How to find your effective limit

SandBase does not publish a single fixed requests-per-minute number because the limit is assigned per organization. Every API key in the organization counts toward the same limit, so creating more keys does not raise it.

If your workload needs a guaranteed or higher limit, contact SandBase support with the organization, application, expected steady rate, and expected burst rate. Do not design a production client around an undocumented numeric default.

## Handling 429 Responses

When a limit is exceeded, the API aborts the request with HTTP 429. On the `/v1/*` API, the body is a flat error object:

```json
{
  "error": "organization rate limit exceeded"
}
```

Protocol-compatible endpoints such as `POST /v1/messages` and the Gemini endpoints return the same `429` in their own error envelope.

::: warning
Platform-generated rate-limit responses do not currently add `Retry-After` or remaining-quota headers. A compatible
provider response can include provider rate-limit headers. Honor `Retry-After` when present; otherwise use bounded
client-side backoff with jitter.
:::

### Best Practices

1. **Implement exponential backoff** — on a 429, wait with increasing delays before retrying.
2. **Smooth your request rate** — spread bursts across the window rather than firing all at once.
3. **Cap retry attempts** — stop after a bounded number of retries and surface the failure.
4. **Add jitter** — randomize retry delays so multiple workers do not retry at the same moment.
5. **Retry only safe operations** — repeating a generation can add cost, and state-changing requests can duplicate work.

## Changing your limit

The organization limit is not currently exposed through the public API or Console. Contact support if your workload needs a different limit.
