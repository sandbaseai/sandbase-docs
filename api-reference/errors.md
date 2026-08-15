---
title: Error Codes
description: SandBase error codes reference. Standard error format, HTTP status codes, common error messages, and retry recommendations.
---

# Error Codes

SandBase uses standard HTTP status codes and a consistent JSON error format across all endpoints. This page documents all error codes, their meanings, and recommended handling strategies.

## Error Response Format

All error responses follow this structure:

```json
{
  "code": 400,
  "message": "Invalid request: model field is required"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `code` | integer | HTTP status code |
| `message` | string | Human-readable error description |

### Anthropic-Compatible Errors

The `/v1/messages` endpoint returns errors in Anthropic's format:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

## HTTP Status Codes

### Client Errors (4xx)

| Status | Name | Description |
|--------|------|-------------|
| 400 | Bad Request | Invalid request body, missing required fields, or unsupported parameters |
| 401 | Unauthorized | Missing, invalid, revoked, or expired API key |
| 402 | Payment Required | Insufficient account balance to process the request |
| 403 | Forbidden | API key lacks permission for the requested resource |
| 404 | Not Found | Requested resource (model, sandbox, webhook) does not exist |
| 409 | Conflict | Resource state conflict (e.g., pausing an already-paused sandbox) |
| 429 | Too Many Requests | Rate limit exceeded |

### Server Errors (5xx)

| Status | Name | Description |
|--------|------|-------------|
| 500 | Internal Server Error | Unexpected server-side error |
| 502 | Bad Gateway | Upstream provider returned an error or is unreachable |
| 503 | Service Unavailable | Service temporarily unavailable (maintenance or overload) |
| 504 | Gateway Timeout | Upstream provider did not respond in time |

## Common Errors and Solutions

### 400 — Bad Request

| Message | Cause | Solution |
|---------|-------|----------|
| `invalid request body` | Malformed JSON or missing required fields | Check your JSON syntax and include all required fields |
| `model field is required` | Missing `model` in request body | Add a valid model identifier |
| `max_tokens is required` | Missing `max_tokens` (Anthropic endpoint) | Include `max_tokens` in the request |
| `unknown agent: <slug>` | Invalid template ID for sandbox creation | Use a valid template slug (e.g., `code_interpreter`) |
| `invalid sandbox id` | Malformed sandbox ID | Use the ID returned from sandbox creation |
| `file too large` | File exceeds 1MB limit (sandbox filesystem) | Read smaller files or use streaming |
| `events list cannot be empty` | Webhook registration with no events | Specify at least one event type |
| `invalid webhook url` | Webhook URL too short or malformed | Provide a valid HTTPS URL |

### 401 — Unauthorized

| Message | Cause | Solution |
|---------|-------|----------|
| `missing API key in Authorization header` | No auth header provided | Add `Authorization: Bearer sk-sb-...` or `x-api-key: sk-sb-...` |
| `invalid API key` | Key not found in database | Verify the key is correct and hasn't been deleted |
| `API key has been revoked` | Key was disabled in the Dashboard | Create a new key or re-enable the existing one |
| `API key has expired` | Key past its expiration date | Create a new key with a later expiration |
| `invalid signature` | Webhook signature verification failed | Check your webhook secret and signature computation |

### 402 — Payment Required

| Message | Cause | Solution |
|---------|-------|----------|
| `insufficient balance` | Organization credit balance is zero or negative | Top up your account in the Dashboard under Billing |

### 404 — Not Found

| Message | Cause | Solution |
|---------|-------|----------|
| `model not found` | Requested model doesn't exist or isn't enabled | Check the [Models](/models/) page for available models |
| `sandbox not found` | Sandbox doesn't exist or belongs to another org | Verify the sandbox ID and that it hasn't been destroyed |
| `webhook not found` | Webhook doesn't exist or belongs to another org | Verify the webhook ID |

### 409 — Conflict

| Message | Reason | Solution |
|---------|--------|----------|
| `sandbox is not active` | Attempting keepalive on a non-running sandbox | Only call keepalive on sandboxes with status `running` |
| `sandbox maximum lifetime exceeded` | Sandbox has exceeded max allowed lifetime | Create a new sandbox instead |

### 429 — Too Many Requests

| Message | Cause | Solution |
|---------|-------|----------|
| `rate limit exceeded` | Too many requests in the current window | Wait and retry with exponential backoff |

::: warning
429 responses do **not** include `Retry-After` or `X-RateLimit-*` headers. Use client-side exponential backoff to pace retries — see [Rate Limiting](/guides/rate-limiting).
:::

### 500 — Internal Server Error

| Message | Cause | Solution |
|---------|-------|----------|
| `internal error` | Unexpected server failure | Retry after a brief delay. If persistent, contact support |

### 502 — Bad Gateway

| Message | Cause | Solution |
|---------|-------|----------|
| `failed to create sandbox in provider` | E2B provider returned an error | Retry after a brief delay |
| `failed to pause sandbox in provider` | Provider failed to pause | Check sandbox status and retry |
| `failed to destroy sandbox in provider` | Provider failed to destroy | Retry or check Dashboard |
| `failed to execute command in sandbox` | Command execution failed at provider level | Verify sandbox is running and retry |
| `failed to read file from sandbox` | File read failed at provider level | Verify the file path exists |
| `failed to list directory in sandbox` | Directory listing failed | Verify the path exists |
| `upstream provider error` | LLM provider returned an error | Retry; SandBase may automatically failover |

## Retry Strategies

### When to Retry

| Status Code | Retry? | Strategy |
|-------------|--------|----------|
| 400 | No | Fix the request — retrying won't help |
| 401 | No | Fix authentication — retrying won't help |
| 402 | No | Top up balance — retrying won't help |
| 403 | No | Check permissions — retrying won't help |
| 404 | No | Resource doesn't exist — retrying won't help |
| 409 | Maybe | Check resource state, then retry if appropriate |
| 429 | Yes | Back off (exponential) and retry — no `Retry-After` header is sent |
| 500 | Yes | Retry with exponential backoff |
| 502 | Yes | Retry with exponential backoff |
| 503 | Yes | Retry with exponential backoff |
| 504 | Yes | Retry with exponential backoff |

### Exponential Backoff

For retryable errors, use exponential backoff with jitter:

::: code-group

```python [Python]
import time
import random
import requests

def request_with_retry(url, headers, json_body, max_retries=5):
    """Make a request with exponential backoff retry."""
    for attempt in range(max_retries):
        response = requests.post(url, headers=headers, json=json_body)

        if response.status_code in (429, 500, 502, 503, 504):
            # No Retry-After header is sent — use exponential backoff with jitter
            delay = min(2 ** attempt + random.random(), 60)
            time.sleep(delay)
            continue

        return response

    raise Exception(f"Max retries ({max_retries}) exceeded")
```

```javascript [JavaScript]
async function requestWithRetry(url, options, maxRetries = 5) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(url, options);

    if ([429, 500, 502, 503, 504].includes(response.status)) {
      // No Retry-After header is sent — use exponential backoff with jitter
      const delay = Math.min(2 ** attempt + Math.random(), 60);
      await new Promise(r => setTimeout(r, delay * 1000));
      continue;
    }

    return response;
  }

  throw new Error(`Max retries (${maxRetries}) exceeded`);
}
```

:::

### Recommended Backoff Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| Base delay | 1 second | Initial wait time |
| Multiplier | 2x | Double the delay each attempt |
| Max delay | 60 seconds | Cap the maximum wait time |
| Jitter | 0–1 second | Random addition to prevent thundering herd |
| Max retries | 5 | Maximum number of attempts |

## Streaming Errors

When using streaming (`stream: true`), errors can occur mid-stream. These are delivered as SSE events:

### OpenAI Format (Chat Completions)

```
data: {"error":{"message":"upstream timeout","type":"server_error","code":"stream_timeout"}}

data: [DONE]
```

### Anthropic Format (Messages)

```
event: error
data: {"type":"error","error":{"type":"api_error","message":"upstream timeout"}}

event: message_stop
data: {"type":"message_stop"}
```

### Stream-Specific Errors

| Error | Description | Handling |
|-------|-------------|----------|
| `stream_timeout` | No data received from upstream for 60s | Retry the full request |
| `upstream_disconnect` | Provider connection dropped | Retry the full request |
| `content_filter` | Content was filtered mid-generation | Check your prompt content |

## Error Monitoring

Monitor error rates in the [SandBase Dashboard](https://www.sandbase.ai/dashboard) under **Usage → Errors**. You can:

- View error rates by status code over time
- Filter by endpoint, model, or API key
- Set up alerts for elevated error rates
- Export error logs for debugging
