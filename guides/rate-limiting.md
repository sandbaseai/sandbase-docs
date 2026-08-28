---
title: Rate limits
description: Handle SandBase API rate limits safely with bounded retries, jitter, queues, and idempotency-aware request handling.
---

# Rate limits

SandBase can limit requests per API key and across the platform. Upstream model providers can also return their own
`429 Too Many Requests` responses. Limits may differ by account, key, endpoint, model, and provider, so do not hardcode
a quota unless SandBase has assigned one to your workload.

## Handle a 429 response

Platform-generated `/v1/*` rate-limit responses use a flat error body:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{"error":"API key rate limit exceeded"}
```

The message can instead report a platform-wide limit. A provider-originated response may use the compatible endpoint's
error shape and may include provider rate-limit headers.

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

## Related guidance

- [Error handling](/guides/error-handling)
- [Streaming](/guides/streaming)
- [API error reference](/api-reference/errors)
- [API keys](/getting-started/api-keys)
