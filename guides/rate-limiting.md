---
title: Rate limits
description: Understanding SandBase rate limits — headers, handling 429 responses, and best practices for high-throughput usage.
---

# Rate limits

SandBase enforces rate limits to ensure fair usage and protect upstream providers from overload. Limiting is applied as a 1-minute sliding window across two layers — an optional per-key request cap and a platform-wide global cap — and a request must pass both. Understanding this helps you build resilient applications.

::: warning
SandBase does **not** currently emit `Retry-After` or `X-RateLimit-*` headers. You cannot read your remaining quota from response headers — handle limits reactively with backoff, and smooth your request rate proactively. The header-driven examples some providers offer do not apply here.
:::

## Handling 429 Responses

When you exceed a rate limit, SandBase aborts the request with HTTP 429. On the `/v1/*` API the body is a flat error object (no `Retry-After` header is sent):

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "error": "API key rate limit exceeded"
}
```

The message is `"API key rate limit exceeded"` for the per-key cap or `"global rate limit exceeded"` for the platform-wide cap.

### Basic Retry Logic

::: code-group

```python [Python]
import time
import random
from openai import OpenAI, RateLimitError

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-your-key",
    max_retries=3  # SDK handles 429 automatically
)

# The SDK automatically retries on 429 with exponential backoff.
# For manual control — since no Retry-After header is sent, use
# exponential backoff with jitter:
def handle_rate_limit(func, *args, max_attempts=5, **kwargs):
    for attempt in range(max_attempts):
        try:
            return func(*args, **kwargs)
        except RateLimitError:
            wait = min(2 ** attempt + random.random(), 30)
            print(f"Rate limited. Backing off {wait:.1f}s...")
            time.sleep(wait)
    raise RuntimeError("Exceeded max retry attempts")
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: 'sk-your-key',
  maxRetries: 3, // SDK handles 429 automatically
});

// For manual control — no Retry-After header is sent, so use
// exponential backoff with jitter:
async function handleRateLimit(fn, maxAttempts = 5) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429) {
        const wait = Math.min(2 ** attempt + Math.random(), 30);
        console.log(`Rate limited. Backing off ${wait.toFixed(1)}s...`);
        await new Promise(r => setTimeout(r, wait * 1000));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Exceeded max retry attempts');
}
```

:::

## Proactive Rate Limit Management

Because SandBase does not expose remaining-quota headers, you cannot read your live quota from responses. Instead, throttle proactively on the client side by capping your own send rate below the limit you've been allocated:

```python
import time
import threading

class RateLimiter:
    """Client-side token-bucket limiter to stay under a known RPM cap."""

    def __init__(self, max_rpm: int):
        self.min_interval = 60.0 / max_rpm
        self._lock = threading.Lock()
        self._last = 0.0

    def acquire(self):
        with self._lock:
            now = time.monotonic()
            wait = self._last + self.min_interval - now
            if wait > 0:
                time.sleep(wait)
            self._last = time.monotonic()

# Set this to the RPM you've been allocated (global default or your per-key cap).
limiter = RateLimiter(max_rpm=120)

def make_request(messages):
    limiter.acquire()
    return client.chat.completions.create(
        model="deepseek/deepseek-v4-flash",
        messages=messages
    )
```

## Best Practices for High Throughput

### 1. Use Request Queuing

For batch workloads, queue requests and process them at a controlled rate:

```python
import asyncio
from asyncio import Semaphore

async def process_batch(prompts, max_concurrent=10):
    """Process multiple prompts with concurrency control."""
    semaphore = Semaphore(max_concurrent)
    
    async def process_one(prompt):
        async with semaphore:
            response = await async_client.chat.completions.create(
                model="deepseek/deepseek-v4-flash",
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
    
    tasks = [process_one(p) for p in prompts]
    return await asyncio.gather(*tasks, return_exceptions=True)
```

### 2. Keep Requests Purposeful

Request limits count calls, not the model's token price. Avoid duplicate work, collapse equivalent application requests when safe, and cache reusable results according to your data-freshness and privacy requirements. Choose smaller models to reduce latency and cost when they satisfy the task, but do not expect that choice to increase the documented request limit.

### 3. Plan Capacity Explicitly

Multiple API keys do not bypass the platform-wide limit and add credential-management risk. Smooth bursts with a queue, bound concurrency and retries, and contact SandBase support when a workload needs a guaranteed or higher limit. Use separate keys to isolate applications and spending controls, not to multiply throughput.

### 4. Cache Repeated Requests

Avoid hitting rate limits by caching responses for identical prompts:

```python
from functools import lru_cache
import hashlib
import json

def cache_key(messages):
    return hashlib.sha256(json.dumps(messages, sort_keys=True).encode()).hexdigest()

response_cache = {}

def cached_completion(messages, model="deepseek/deepseek-v4-flash"):
    key = cache_key(messages)
    if key in response_cache:
        return response_cache[key]
    
    response = client.chat.completions.create(model=model, messages=messages)
    response_cache[key] = response
    return response
```

## Rate Limit Errors in Streaming

Rate limits can also affect streaming requests. If you're rate limited mid-stream (rare), the stream will terminate with an error event. Always handle stream interruptions gracefully:

```python
try:
    stream = client.chat.completions.create(
        model="deepseek/deepseek-v4-flash",
        messages=messages,
        stream=True
    )
    content = ""
    for chunk in stream:
        if chunk.choices[0].delta.content:
            content += chunk.choices[0].delta.content
except RateLimitError:
    # Partial content may have been received
    print(f"Rate limited mid-stream. Received so far: {content[:100]}...")
    # Retry with the full message (LLM will regenerate)
```
