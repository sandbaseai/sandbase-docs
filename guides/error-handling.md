---
title: Errors
description: Strategies for handling errors from SandBase — retry logic, exponential backoff, circuit breakers, and idempotency.
---

# Errors and retries

LLM APIs are inherently prone to transient failures — upstream providers experience rate limits, timeouts, and temporary outages. A robust error handling strategy is essential for production applications.

## Error Response Format

Errors from the OpenAI-compatible endpoints (`/v1/chat/completions`) follow OpenAI's structure:

```json
{
  "error": {
    "message": "Rate limit exceeded.",
    "type": "rate_limit_error",
    "code": null,
    "param": null
  }
}
```

The Anthropic-compatible endpoint (`/v1/messages`) returns Anthropic's format instead. See the [Error Codes reference](/api-reference/errors) for every format and status code.

## Common Error Types

| HTTP Status | Error Type | Retryable | Description |
|-------------|-----------|-----------|-------------|
| 400 | `invalid_request_error` | No | Malformed request body or invalid parameters |
| 401 | `authentication_error` | No | Invalid or missing API key |
| 402 | `invalid_request_error` | No | Insufficient account balance (message: `insufficient balance`) |
| 403 | `permission_error` | No | API key lacks required permissions |
| 404 | `not_found_error` | No | Requested model doesn't exist |
| 429 | `rate_limit_error` | **Yes** | Too many requests — back off and retry |
| 500 | `server_error` | **Yes** | SandBase internal error |
| 502 | `server_error` | **Yes** | Upstream provider returned an error |
| 503 | `server_error` | **Yes** | Service temporarily overloaded |

## Retry Strategy

### Which Errors to Retry

**Always retry:** 429, 500, 502, 503
**Never retry:** 400, 401, 402, 403, 404

### Exponential Backoff

The recommended retry strategy uses exponential backoff with jitter:

::: code-group

```python [Python]
import time
import random
from openai import OpenAI, RateLimitError, APIStatusError

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-your-key"
)

def chat_with_retry(messages, max_retries=5, base_delay=1.0):
    """Make a chat completion request with exponential backoff."""
    for attempt in range(max_retries):
        try:
            return client.chat.completions.create(
                model="deepseek/deepseek-v4-flash",
                messages=messages
            )
        except RateLimitError as e:
            if attempt == max_retries - 1:
                raise
            # No Retry-After header is sent — use exponential backoff with jitter
            delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
            print(f"Rate limited. Retrying in {delay:.1f}s...")
            time.sleep(delay)
        except APIStatusError as e:
            if e.status_code in (500, 502, 503):
                if attempt == max_retries - 1:
                    raise
                delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
                time.sleep(delay)
            else:
                raise  # Non-retryable error
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: 'sk-your-key',
});

async function chatWithRetry(messages, maxRetries = 5, baseDelay = 1000) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await client.chat.completions.create({
        model: 'deepseek/deepseek-v4-flash',
        messages,
      });
    } catch (error) {
      const status = error.status;
      const isRetryable = [429, 500, 502, 503].includes(status);
      
      if (!isRetryable || attempt === maxRetries - 1) {
        throw error;
      }

      // No Retry-After header is sent — use exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;

      console.log(`Retrying in ${(delay / 1000).toFixed(1)}s (attempt ${attempt + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

:::

### Backoff Parameters

| Parameter | Recommended Value | Description |
|-----------|------------------|-------------|
| Base delay | 1 second | Initial wait before first retry |
| Multiplier | 2x | Exponential growth factor |
| Max delay | 60 seconds | Cap on wait time |
| Max retries | 5 | Total attempts before giving up |
| Jitter | 0–1 second (random) | Prevents thundering herd |

### Jitter Explained

Without jitter, multiple clients that hit a rate limit simultaneously will all retry at the same time, causing another spike. Adding random jitter spreads retries across time:

```python
# Full jitter (recommended)
delay = random.uniform(0, base_delay * (2 ** attempt))

# Equal jitter (alternative)
temp = base_delay * (2 ** attempt)
delay = temp / 2 + random.uniform(0, temp / 2)

# Decorrelated jitter
delay = min(max_delay, random.uniform(base_delay, last_delay * 3))
```

## Circuit Breaker Pattern

For high-throughput applications, implement a circuit breaker to avoid hammering a failing provider:

```python
import time
from enum import Enum

class CircuitState(Enum):
    CLOSED = "closed"       # Normal operation
    OPEN = "open"           # Failing — reject requests immediately
    HALF_OPEN = "half_open" # Testing if service recovered

class CircuitBreaker:
    def __init__(self, failure_threshold=5, recovery_timeout=30):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.last_failure_time = 0

    def can_execute(self) -> bool:
        if self.state == CircuitState.CLOSED:
            return True
        if self.state == CircuitState.OPEN:
            # Check if recovery timeout has elapsed
            if time.time() - self.last_failure_time >= self.recovery_timeout:
                self.state = CircuitState.HALF_OPEN
                return True
            return False
        # HALF_OPEN: allow one test request
        return True

    def record_success(self):
        self.failure_count = 0
        self.state = CircuitState.CLOSED

    def record_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        if self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN

# Usage
breaker = CircuitBreaker(failure_threshold=5, recovery_timeout=30)

def make_request(messages):
    if not breaker.can_execute():
        raise Exception("Circuit breaker is open — service unavailable")
    
    try:
        response = client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=messages
        )
        breaker.record_success()
        return response
    except Exception as e:
        breaker.record_failure()
        raise
```

### Circuit Breaker States

```
CLOSED (normal) ──[failures >= threshold]──→ OPEN (rejecting)
                                                │
                                    [recovery_timeout elapsed]
                                                │
                                                ▼
                                          HALF_OPEN (testing)
                                           │           │
                                    [success]     [failure]
                                           │           │
                                           ▼           ▼
                                        CLOSED       OPEN
```

## Idempotency Considerations

LLM requests are **not idempotent** — the same prompt can produce different responses. Keep this in mind when implementing retries:

- **Safe to retry:** If you only need *a* response (not *the same* response)
- **Careful with retries:** If the response triggers side effects (tool calls, database writes)
- **Track tool execution:** If a streamed response included tool calls before failing, don't re-execute those tools on retry

```python
def safe_retry_with_tools(messages, max_retries=3):
    """Retry that's aware of tool call side effects."""
    executed_tool_calls = set()
    
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="deepseek/deepseek-v4-flash",
                messages=messages,
                tools=my_tools
            )
            
            # Process tool calls, skipping already-executed ones
            if response.choices[0].message.tool_calls:
                for tc in response.choices[0].message.tool_calls:
                    if tc.id not in executed_tool_calls:
                        execute_tool(tc)
                        executed_tool_calls.add(tc.id)
            
            return response
        except Exception as e:
            if not is_retryable(e) or attempt == max_retries - 1:
                raise
            time.sleep(2 ** attempt)
```

## Timeout Configuration

### Client-Side Timeouts

Set appropriate timeouts for different use cases:

```python
# Short timeout for simple queries
client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-your-key",
    timeout=30.0  # 30 seconds
)

# Longer timeout for complex reasoning
response = client.chat.completions.create(
    model="o3",
    messages=[{"role": "user", "content": "Solve this complex problem..."}],
    timeout=120.0  # Override per-request
)
```

### Recommended Timeouts

| Use Case | Timeout | Reasoning |
|----------|---------|-----------|
| Simple chat | 30s | Fast models respond in <5s |
| Complex reasoning (o3, thinking) | 120s | Reasoning models can take 30-60s |
| Streaming (first chunk) | 30s | TTFT should be <10s for most models |
| Streaming (between chunks) | 60s | SandBase auto-terminates at 60s silence |
| Tool-heavy workflows | 90s | Multiple tool calls add latency |

## Error Handling Best Practices

1. **Log errors with context** — Include the model, message count, and error type for debugging
2. **Surface errors to users gracefully** — Don't expose raw API errors; translate them to user-friendly messages
3. **Monitor error rates** — Alert on sustained 5xx rates above 1%
4. **Use the OpenAI/Anthropic SDK retry features** — Both SDKs have built-in retry with backoff
5. **Implement request budgets** — Cap total retries per user request to avoid runaway costs

```python
# OpenAI SDK has built-in retries
client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-your-key",
    max_retries=3  # Built-in exponential backoff
)
```
