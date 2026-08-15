---
title: Streaming Guide
description: How to use Server-Sent Events (SSE) streaming with SandBase — OpenAI and Anthropic formats, client handling, and best practices.
---

# Streaming Responses

Streaming allows you to receive LLM responses token-by-token as they're generated, rather than waiting for the complete response. This dramatically reduces perceived latency for chat interfaces.

## SSE Protocol Basics

SandBase uses **Server-Sent Events (SSE)** for streaming, the same protocol used by OpenAI and Anthropic. SSE is a simple HTTP/1.1 long-lived connection where the server pushes events to the client.

**Key characteristics:**
- Content-Type: `text/event-stream`
- Unidirectional: server → client only
- Each event is separated by a blank line (`\n\n`)
- Events have optional `event:` type and required `data:` payload
- Connection ends with a special termination signal

## OpenAI Streaming Format

When using the OpenAI-compatible endpoint (`/v1/chat/completions`), set `stream: true`:

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-sb-your-key"
)

stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Explain quantum computing"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: 'sk-sb-your-key',
});

const stream = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Explain quantum computing' }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    process.stdout.write(content);
  }
}
```

```bash [cURL]
curl -N https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-sb-your-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Explain quantum computing"}],
    "stream": true
  }'
```

:::

### OpenAI SSE Event Format

Each event in the stream looks like:

```
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"gpt-4o","choices":[{"index":0,"delta":{"content":"Hello"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"gpt-4o","choices":[{"index":0,"delta":{"content":" world"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"gpt-4o","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

**Key points:**
- The `id` is consistent across all chunks in a stream
- Content arrives in `choices[0].delta.content`
- The final content chunk has `finish_reason: "stop"`
- The stream terminates with `data: [DONE]`

### Getting Usage with Streaming

To receive token usage in the final chunk, include `stream_options`:

```python
stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
    stream=True,
    stream_options={"include_usage": True}
)

for chunk in stream:
    if chunk.usage:
        print(f"Tokens used: {chunk.usage.total_tokens}")
```

## Anthropic Streaming Format

When using the Anthropic-compatible endpoint (`/v1/messages`), set `stream: true`:

::: code-group

```python [Python]
import anthropic

client = anthropic.Anthropic(
    base_url="https://api.sandbase.ai",
    api_key="sk-sb-your-key"
)

with client.messages.stream(
    model="claude-sonnet-4",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain quantum computing"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  baseURL: 'https://api.sandbase.ai',
  apiKey: 'sk-sb-your-key',
});

const stream = client.messages.stream({
  model: 'claude-sonnet-4',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Explain quantum computing' }],
});

stream.on('text', (text) => {
  process.stdout.write(text);
});

await stream.finalMessage();
```

:::

### Anthropic SSE Event Format

Anthropic uses a richer event-driven protocol with 6 event types:

```
event: message_start
data: {"type":"message_start","message":{"id":"msg_abc","type":"message","role":"assistant","content":[],"model":"claude-sonnet-4","usage":{"input_tokens":25,"output_tokens":0}}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hello"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" world"}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":12}}

event: message_stop
data: {"type":"message_stop"}
```

### Differences from OpenAI Format

| Aspect | OpenAI | Anthropic |
|--------|--------|-----------|
| Event types | 1 (implicit) | 6 (explicit `event:` field) |
| Content delivery | `delta.content` string | `content_block_delta` events |
| Block boundaries | Implicit | Explicit start/stop events |
| Usage delivery | Final chunk (opt-in) | Split: input at start, output at end |
| Termination | `data: [DONE]` | `event: message_stop` |
| Finish reason | `finish_reason` field | `stop_reason` in `message_delta` |
| Tool calls | `delta.tool_calls` incremental | Separate `tool_use` content blocks |

## Streaming with Tool Calls

### OpenAI Format

Tool call arguments arrive as incremental string fragments:

```python
stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}],
    tools=[{
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get weather for a location",
            "parameters": {
                "type": "object",
                "properties": {"location": {"type": "string"}},
                "required": ["location"]
            }
        }
    }],
    stream=True
)

tool_calls = {}
for chunk in stream:
    delta = chunk.choices[0].delta
    if delta.tool_calls:
        for tc in delta.tool_calls:
            idx = tc.index
            if idx not in tool_calls:
                tool_calls[idx] = {"id": tc.id, "name": tc.function.name, "arguments": ""}
            if tc.function.arguments:
                tool_calls[idx]["arguments"] += tc.function.arguments

# tool_calls[0]["arguments"] is now the complete JSON string
```

### Anthropic Format

Tool calls arrive as `tool_use` content blocks with `input_json_delta`:

```python
with client.messages.stream(
    model="claude-sonnet-4",
    max_tokens=1024,
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}],
    tools=[{
        "name": "get_weather",
        "description": "Get weather for a location",
        "input_schema": {
            "type": "object",
            "properties": {"location": {"type": "string"}},
            "required": ["location"]
        }
    }]
) as stream:
    for event in stream:
        if event.type == "tool_use":
            print(f"Tool: {event.name}, Input: {event.input}")
```

## Streaming with Reasoning/Thinking

Models that support reasoning (o3, Claude with thinking) can stream their thought process:

```python
# OpenAI format — reasoning content in delta
stream = client.chat.completions.create(
    model="o3",
    messages=[{"role": "user", "content": "Solve this step by step: 2^10 * 3^5"}],
    stream=True
)

for chunk in stream:
    delta = chunk.choices[0].delta
    if hasattr(delta, 'reasoning_content') and delta.reasoning_content:
        print(f"[thinking] {delta.reasoning_content}", end="")
    elif delta.content:
        print(delta.content, end="")
```

## Low-Level SSE Parsing

While the OpenAI and Anthropic SDKs handle SSE parsing for you, understanding the raw protocol is useful for debugging, custom clients, or environments where SDKs aren't available.

### Raw SSE Parsing in Python

Using `httpx` for low-level streaming with manual SSE parsing:

```python
import httpx
import json

def stream_chat_raw(messages: list[dict], model: str = "gpt-4o"):
    """Stream chat completions using raw HTTP + SSE parsing."""
    url = "https://api.sandbase.ai/v1/chat/completions"
    headers = {
        "Authorization": "Bearer sk-sb-your-key",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": messages,
        "stream": True,
    }

    with httpx.stream("POST", url, json=payload, headers=headers, timeout=60.0) as response:
        response.raise_for_status()
        buffer = ""

        for line in response.iter_lines():
            # SSE lines are separated by newlines; blank lines delimit events
            if not line:
                continue

            # Remove the "data: " prefix
            if line.startswith("data: "):
                data = line[6:]
            else:
                continue

            # Check for stream termination
            if data == "[DONE]":
                break

            # Parse the JSON chunk
            try:
                chunk = json.loads(data)
                content = chunk["choices"][0]["delta"].get("content", "")
                if content:
                    print(content, end="", flush=True)
            except (json.JSONDecodeError, KeyError, IndexError) as e:
                # Handle malformed chunks gracefully
                print(f"\n[Parse error: {e}]")
```

Using `requests` with streaming:

```python
import requests
import json

def stream_chat_requests(messages: list[dict], model: str = "gpt-4o"):
    """Stream using the requests library."""
    url = "https://api.sandbase.ai/v1/chat/completions"
    headers = {
        "Authorization": "Bearer sk-sb-your-key",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": messages,
        "stream": True,
    }

    with requests.post(url, json=payload, headers=headers, stream=True, timeout=60) as resp:
        resp.raise_for_status()

        for line in resp.iter_lines(decode_unicode=True):
            if not line or not line.startswith("data: "):
                continue

            data = line[6:]
            if data == "[DONE]":
                break

            chunk = json.loads(data)
            content = chunk["choices"][0]["delta"].get("content", "")
            if content:
                yield content
```

### Raw SSE Parsing in JavaScript/TypeScript

Using the Fetch API with `ReadableStream` for manual SSE parsing:

```typescript
async function streamChatRaw(messages: Array<{role: string; content: string}>) {
  const response = await fetch('https://api.sandbase.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-sb-your-key',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // Append decoded text to buffer
    buffer += decoder.decode(value, { stream: true });

    // Process complete SSE events (separated by double newlines)
    const lines = buffer.split('\n');
    buffer = lines.pop() || ''; // Keep incomplete line in buffer

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;

      const data = trimmed.slice(6);
      if (data === '[DONE]') return;

      try {
        const chunk = JSON.parse(data);
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          process.stdout.write(content); // or append to DOM
        }
      } catch (e) {
        console.warn('Failed to parse SSE chunk:', e);
      }
    }
  }
}
```

For browser environments with a streaming UI:

```typescript
async function streamToElement(messages: Array<{role: string; content: string}>, el: HTMLElement) {
  const response = await fetch('https://api.sandbase.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-sb-your-key',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: 'gpt-4o', messages, stream: true }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6);
      if (data === '[DONE]') return;

      const chunk = JSON.parse(data);
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        el.textContent += content;
      }
    }
  }
}
```

## Error Handling in Streams

Errors during streaming require special attention because they can occur at any point — before the first token, mid-generation, or during finalization.

### Types of Stream Errors

| Error Type | When It Occurs | Recovery |
|-----------|---------------|----------|
| Connection refused | Before stream starts | Retry immediately |
| HTTP 429 (rate limit) | Before stream starts | Retry with backoff |
| HTTP 5xx | Before stream starts | Retry with backoff |
| Timeout (no data) | Mid-stream | Retry with accumulated context |
| Provider error | Mid-stream | Partial response + retry |
| Connection drop | Any time | Reconnect + retry |
| Malformed SSE | Mid-stream | Skip chunk, continue |

### OpenAI Format Errors

Errors mid-stream arrive as a special data event:

```
data: {"error":{"type":"stream_timeout","message":"No data received from upstream for 60 seconds"}}

data: [DONE]
```

### Anthropic Format Errors

Anthropic uses a dedicated `error` event type:

```
event: error
data: {"type":"error","error":{"type":"overloaded_error","message":"Provider temporarily unavailable"}}
```

### Comprehensive Error Handling in Python

```python
import openai
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-sb-your-key"
)

def stream_with_error_handling(messages: list[dict], model: str = "gpt-4o"):
    """Stream with comprehensive error detection and handling."""
    collected_content = ""

    try:
        stream = client.chat.completions.create(
            model=model,
            messages=messages,
            stream=True,
            stream_options={"include_usage": True},
        )

        for chunk in stream:
            # Check for error events embedded in the stream
            if hasattr(chunk, 'error') and chunk.error:
                print(f"\n[Stream error: {chunk.error}]")
                break

            # Check for valid choices
            if not chunk.choices:
                continue

            choice = chunk.choices[0]

            # Detect finish reason
            if choice.finish_reason:
                if choice.finish_reason == "length":
                    print("\n[Warning: Response truncated due to max_tokens]")
                elif choice.finish_reason == "content_filter":
                    print("\n[Warning: Content filtered by safety system]")
                break

            # Extract content
            content = choice.delta.content
            if content:
                collected_content += content
                print(content, end="", flush=True)

        return collected_content

    except openai.APIStatusError as e:
        # Server returned an error status code (4xx, 5xx)
        print(f"\nAPI error {e.status_code}: {e.message}")
        if e.status_code == 429:
            print("Rate limited — back off and retry")
        elif e.status_code >= 500:
            print("Server error — retry with exponential backoff")
        return collected_content

    except openai.APIConnectionError as e:
        # Network-level failure (DNS, TCP, TLS)
        print(f"\nConnection error: {e}")
        print(f"Collected {len(collected_content)} chars before disconnect")
        return collected_content

    except openai.APITimeoutError:
        # Request exceeded timeout
        print("\nRequest timed out")
        return collected_content
```

### Comprehensive Error Handling in JavaScript

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: 'sk-sb-your-key',
});

async function streamWithErrorHandling(
  messages: Array<{role: string; content: string}>,
  model = 'gpt-4o'
): Promise<string> {
  let collectedContent = '';

  try {
    const stream = await client.chat.completions.create({
      model,
      messages,
      stream: true,
      stream_options: { include_usage: true },
    });

    for await (const chunk of stream) {
      if (!chunk.choices?.length) continue;

      const choice = chunk.choices[0];

      // Detect finish reasons
      if (choice.finish_reason) {
        if (choice.finish_reason === 'length') {
          console.warn('Response truncated due to max_tokens');
        } else if (choice.finish_reason === 'content_filter') {
          console.warn('Content filtered by safety system');
        }
        break;
      }

      const content = choice.delta?.content;
      if (content) {
        collectedContent += content;
        process.stdout.write(content);
      }
    }
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(`\nAPI error ${error.status}: ${error.message}`);
      if (error.status === 429) {
        console.error('Rate limited — implement backoff');
      }
    } else if (error instanceof OpenAI.APIConnectionError) {
      console.error(`\nConnection lost: ${error.message}`);
      console.error(`Collected ${collectedContent.length} chars before disconnect`);
    } else {
      throw error; // Unknown error, re-throw
    }
  }

  return collectedContent;
}
```

### Detecting Mid-Stream Errors with Raw Fetch

When parsing SSE manually, you need to detect error payloads in the stream:

```typescript
async function streamWithMidStreamErrorDetection(messages: Array<{role: string; content: string}>) {
  const response = await fetch('https://api.sandbase.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-sb-your-key',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: 'gpt-4o', messages, stream: true }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`HTTP ${response.status}: ${body}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let content = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6);
        if (data === '[DONE]') return content;

        const chunk = JSON.parse(data);

        // Detect error payloads mid-stream
        if (chunk.error) {
          console.error('Mid-stream error:', chunk.error);
          throw new StreamError(chunk.error.type, chunk.error.message, content);
        }

        const delta = chunk.choices?.[0]?.delta?.content;
        if (delta) content += delta;
      }
    }
  } finally {
    reader.releaseLock();
  }

  return content;
}

class StreamError extends Error {
  constructor(
    public type: string,
    message: string,
    public partialContent: string
  ) {
    super(message);
    this.name = 'StreamError';
  }
}
```

## Reconnection Strategies

SSE connections can drop due to network issues, load balancer timeouts, or server restarts. A robust client needs reconnection logic.

### Exponential Backoff with Jitter (Python)

```python
import time
import random
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-sb-your-key"
)

def stream_with_retry(
    messages: list[dict],
    model: str = "gpt-4o",
    max_retries: int = 3,
    base_delay: float = 1.0,
):
    """Stream with automatic retry on transient failures."""
    for attempt in range(max_retries + 1):
        try:
            stream = client.chat.completions.create(
                model=model,
                messages=messages,
                stream=True,
            )

            for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

            return  # Stream completed successfully

        except (openai.APIConnectionError, openai.APITimeoutError) as e:
            if attempt == max_retries:
                raise

            # Exponential backoff with jitter
            delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
            print(f"\n[Retry {attempt + 1}/{max_retries} in {delay:.1f}s: {e}]")
            time.sleep(delay)

        except openai.APIStatusError as e:
            if e.status_code == 429:
                # Rate limited — no Retry-After header is sent, use exponential backoff
                if attempt == max_retries:
                    raise
                delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
                print(f"\n[Rate limited, retrying in {delay:.1f}s]")
                time.sleep(delay)
            elif e.status_code >= 500:
                # Server error — retry
                if attempt == max_retries:
                    raise
                delay = base_delay * (2 ** attempt)
                time.sleep(delay)
            else:
                # Client error (4xx) — don't retry
                raise
```

### Exponential Backoff with Jitter (JavaScript)

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: 'sk-sb-your-key',
});

async function* streamWithRetry(
  messages: Array<{role: string; content: string}>,
  model = 'gpt-4o',
  maxRetries = 3,
  baseDelay = 1000
) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const stream = await client.chat.completions.create({
        model,
        messages,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) yield content;
      }

      return; // Success
    } catch (error) {
      const isRetryable =
        error instanceof OpenAI.APIConnectionError ||
        error instanceof OpenAI.APITimeoutError ||
        (error instanceof OpenAI.APIError && error.status >= 500) ||
        (error instanceof OpenAI.APIError && error.status === 429);

      if (!isRetryable || attempt === maxRetries) throw error;

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      console.warn(`Retry ${attempt + 1}/${maxRetries} in ${(delay / 1000).toFixed(1)}s`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

// Usage
for await (const token of streamWithRetry([{ role: 'user', content: 'Hello' }])) {
  process.stdout.write(token);
}
```

### Resuming After Partial Response

When a stream disconnects mid-generation, you can resume by including the partial response in context:

```python
def stream_with_resume(
    messages: list[dict],
    model: str = "gpt-4o",
    max_retries: int = 2,
):
    """Resume generation after mid-stream disconnection."""
    collected = ""

    for attempt in range(max_retries + 1):
        try:
            # On retry, append partial response and ask to continue
            current_messages = messages.copy()
            if collected and attempt > 0:
                current_messages.append({"role": "assistant", "content": collected})
                current_messages.append({"role": "user", "content": "Continue from where you left off."})

            stream = client.chat.completions.create(
                model=model,
                messages=current_messages,
                stream=True,
            )

            for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    collected += content
                    yield content

            return  # Completed

        except (openai.APIConnectionError, openai.APITimeoutError):
            if attempt == max_retries:
                raise
            print(f"\n[Disconnected after {len(collected)} chars, resuming...]")
            time.sleep(2 ** attempt)
```

## Best Practices

### 1. Always Handle Partial Responses

The stream may terminate unexpectedly. Buffer content and handle incomplete responses gracefully:

```python
collected_content = []
finish_reason = None

for chunk in stream:
    if chunk.choices:
        choice = chunk.choices[0]
        if choice.delta.content:
            collected_content.append(choice.delta.content)
        if choice.finish_reason:
            finish_reason = choice.finish_reason

full_response = "".join(collected_content)

if finish_reason != "stop":
    # Response was incomplete — log, retry, or notify user
    logger.warning(f"Stream ended with finish_reason={finish_reason}, got {len(full_response)} chars")
```

### 2. Set Appropriate Timeouts

SandBase terminates streams after 60 seconds of no data from the upstream provider. Configure client timeouts accordingly:

```python
# Python — set per-request timeout
client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-sb-your-key",
    timeout=httpx.Timeout(connect=5.0, read=120.0, write=10.0, pool=10.0),
)
```

```typescript
// JavaScript — set per-request timeout
const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: 'sk-sb-your-key',
  timeout: 120_000, // 120 seconds
});
```

### 3. Use Streaming for Chat UIs

Streaming reduces Time-To-First-Token (TTFT) perception. Users see the response building in real-time rather than waiting for the full generation.

### 4. Disable Proxy Buffering

If you're running a reverse proxy (nginx, Cloudflare), ensure response buffering is disabled for SSE endpoints:

```nginx
# nginx configuration
location /v1/chat/completions {
    proxy_buffering off;
    proxy_cache off;
    proxy_set_header X-Accel-Buffering no;
    proxy_read_timeout 300s;
}
```

### 5. Monitor Stream Health

Track metrics to detect degradation early:

```python
import time

def stream_with_metrics(messages, model="gpt-4o"):
    """Stream with timing and health metrics."""
    start = time.monotonic()
    first_token_time = None
    token_count = 0
    last_chunk_time = start

    stream = client.chat.completions.create(
        model=model, messages=messages, stream=True
    )

    for chunk in stream:
        now = time.monotonic()

        if chunk.choices and chunk.choices[0].delta.content:
            if first_token_time is None:
                first_token_time = now - start
            token_count += 1
            last_chunk_time = now
            yield chunk.choices[0].delta.content

    total_time = time.monotonic() - start

    # Log metrics
    print(f"\n--- Stream Metrics ---")
    print(f"TTFT: {first_token_time:.3f}s")
    print(f"Total time: {total_time:.3f}s")
    print(f"Tokens: {token_count}")
    print(f"Tokens/sec: {token_count / total_time:.1f}")
```

### 6. Use AbortController for Cancellation (JavaScript)

Allow users to cancel in-progress streams:

```typescript
const controller = new AbortController();

// Cancel after 30 seconds or on user action
setTimeout(() => controller.abort(), 30_000);
cancelButton.onclick = () => controller.abort();

try {
  const stream = await client.chat.completions.create(
    { model: 'gpt-4o', messages, stream: true },
    { signal: controller.signal }
  );

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) outputEl.textContent += content;
  }
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Stream cancelled by user');
  } else {
    throw error;
  }
}
```

### 7. Backpressure and Memory Management

For high-throughput applications, avoid unbounded buffering:

```python
import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-sb-your-key"
)

async def stream_with_backpressure(messages, queue: asyncio.Queue):
    """Stream tokens into a bounded queue for consumer processing."""
    stream = await client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        stream=True,
    )

    async for chunk in stream:
        if chunk.choices and chunk.choices[0].delta.content:
            # This will block if the queue is full, applying backpressure
            await queue.put(chunk.choices[0].delta.content)

    await queue.put(None)  # Signal completion
```
