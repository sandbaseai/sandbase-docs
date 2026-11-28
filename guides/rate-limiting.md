---
title: Rate limits
description: Handle SandBase API rate limits safely with bounded retries, jitter, queues, and idempotency-aware request handling.
---

# Rate limits

Your organization has requests-per-minute limits set by its [account level](/guides/concurrency-limits#default-limits).
They are shared by every API key in the organization and counted over a one-minute sliding window. Upstream model
providers can also return their own `429 Too Many Requests` responses.

## Default limits by account level

Your level is set by your largest single paid top-up, as described in [Concurrency limits](/guides/concurrency-limits#default-limits).

| Level | Single top-up | LLM requests / min | Image requests / min | Free models / min |
|-------|---------------|--------------------|----------------------|-------------------|
| Bronze | Default | 120 | 20 | 30 |
| Silver | $10 or more | 600 | 60 | 60 |
| Gold | $100 or more | 2,000 | 300 | 200 |
| Platinum | $500 or more | 5,000 | 1,000 | 500 |
| Diamond | Contact sales | No limit | No limit | No limit |

- **LLM requests** count `POST /v1/chat/completions`, `POST /v1/responses`, `POST /v1/messages`, and the Gemini `generateContent` and `streamGenerateContent` endpoints, including image models called through Gemini `generateContent`.
- **Image requests** count image models submitted through `POST /v1/run` and the OpenAI Images endpoints (`/v1/images/generations`, `/v1/images/edits`).
- **Free models** are models whose ID ends in `:free`, such as `deepseek/deepseek-v4.1-flash:free`. They are counted separately from the LLM limit, and both apply. The paid model with the same ID minus `:free` has no free-model limit.
- A limit SandBase has set for your organization replaces the default LLM limit. If your workload needs a higher limit, contact SandBase support with the organization, application, expected steady rate, and expected burst rate.
- Polling endpoints such as `GET /v1/run/{id}` are not counted.

## Handle a 429 response

Platform-generated `/v1/*` rate-limit responses use a flat error body:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{"error":"organization rate limit exceeded"}
```

Image and free-model limits return a message that names the limit, the top-up that raises it, and (for free models)
the paid model to switch to. Protocol-compatible endpoints return the same `429` in their own error envelope,
such as the Anthropic or Google error shape. A provider-originated response may use the compatible endpoint's error
shape and may include provider rate-limit headers.

`Retry-After` and remaining-quota headers are not guaranteed. If `Retry-After` is present, honor it. Otherwise, use
exponential backoff with jitter and a maximum attempt count.

```python
import os
import random
import time

from openai import OpenAI, RateLimitError

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def create_with_backoff(**request):
    for attempt in range(5):
        try:
            return client.chat.completions.create(**request)
        except RateLimitError:
            if attempt == 4:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

The OpenAI SDK also supports built-in retries through `max_retries`. Choose either SDK retries or an application retry
loop deliberately so retries do not multiply across layers.

## Retry only safe operations

A repeated inference request can create a second generation and incur additional cost. Retry it only when your
application accepts regeneration. Do not automatically retry a state-changing request unless the operation documents
idempotency or your application can prove the first attempt did not succeed.

For streaming requests, a `429` normally arrives before the stream begins. Once bytes have arrived, treat a disconnect
as an interrupted generation rather than assuming a rate-limit error. Preserve or discard partial output according to
your product requirements; starting again creates a new generation.

## Control throughput

- Bound concurrency instead of releasing an unbounded batch at once.
- Queue bursty work and smooth the send rate.
- Avoid duplicate requests and cache reusable results when privacy and freshness requirements allow it.
- Use separate keys for ownership, spending controls, and revocation—not to bypass platform limits.
- Record the endpoint, model, HTTP status, and sanitized error body for troubleshooting.
- Contact SandBase support when a workload needs an assigned or higher capacity limit.

```python
import asyncio

semaphore = asyncio.Semaphore(8)

async def run_one(client, prompt):
    async with semaphore:
        return await client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": prompt}],
        )
```

Concurrency is not the same as requests per minute. Tune both against observed latency and the capacity assigned to
your application.

::: info Daily free API calls
The organization's 100 free data API calls per UTC day are a billing allowance, not a rate limit. Calls beyond it are
billed per call rather than rejected. See [Daily free API calls](/guides/billing#daily-free-api-calls).
:::

::: tip Video tasks
Video submissions are also limited by how many tasks your organization can run at once, based on its account level.
That `429` says `organization concurrency limit exceeded` and clears when a running task finishes, not on a timer. See
[Concurrency limits](/guides/concurrency-limits).
:::

## Related guidance

- [Error handling](/guides/error-handling)
- [Streaming](/guides/streaming)
- [API error reference](/api-reference/errors)
- [API keys](/getting-started/api-keys)
