---
title: First API call
description: Detailed walkthrough of making your first SandBase API call, understanding request anatomy, response structure, and streaming.
---

# First API call

This guide walks through the anatomy of a SandBase API request and response in detail. By the end, you'll understand every field in the request body, how to read the response, and how to use streaming.

## Before you start

You need an active SandBase organization, an [API key](/getting-started/api-keys), and a model ID from [Supported Models](/models/supported). Export the key so examples do not place secrets in source code:

```bash
export SANDBASE_API_KEY="sk-sb-YOUR_API_KEY"
```

Start with a non-streaming request. Once authentication and response handling work, add streaming and production retry behavior.

## Request Anatomy

Every request to SandBase's LLM Gateway follows this structure:

```bash
POST https://api.sandbase.ai/v1/chat/completions
```

### Required Headers

| Header | Value | Description |
|--------|-------|-------------|
| `Authorization` | `Bearer sk-sb-YOUR_API_KEY` | Your SandBase API key |
| `Content-Type` | `application/json` | Request body format |

### Request Body

```json
{
  "model": "deepseek/deepseek-v3",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is the capital of France?"}
  ],
  "temperature": 0.7,
  "max_tokens": 256
}
```

### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | Yes | The model to use (e.g., `deepseek/deepseek-v3`, `openai/gpt-4o`, `anthropic/claude-sonnet-4-20250514`) |
| `messages` | array | Yes | Conversation history as an array of message objects |
| `temperature` | number | No | Sampling temperature (0–2). Lower = more deterministic. Default varies by model. |
| `max_tokens` | integer | No | Maximum tokens to generate in the response |
| `top_p` | number | No | Nucleus sampling parameter (0–1) |
| `stream` | boolean | No | Whether to stream the response. Default: `false` |
| `stop` | string or array | No | Stop sequences — generation stops when these are encountered |
| `frequency_penalty` | number | No | Penalize repeated tokens (-2 to 2) |
| `presence_penalty` | number | No | Penalize tokens already in the conversation (-2 to 2) |

### Message Roles

| Role | Purpose |
|------|---------|
| `system` | Sets the assistant's behavior and personality |
| `user` | The human's input |
| `assistant` | Previous assistant responses (for multi-turn conversations) |

## Full Request Example

::: code-group

```bash [cURL]
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v3",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is the capital of France?"}
    ],
    "temperature": 0.7,
    "max_tokens": 256
  }'
```

```python [Python]
from openai import OpenAI

client = OpenAI(
    api_key="sk-sb-YOUR_API_KEY",
    base_url="https://api.sandbase.ai/v1"
)

response = client.chat.completions.create(
    model="deepseek/deepseek-v3",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is the capital of France?"}
    ],
    temperature=0.7,
    max_tokens=256
)

print(response.choices[0].message.content)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'sk-sb-YOUR_API_KEY',
  baseURL: 'https://api.sandbase.ai/v1',
});

const response = await client.chat.completions.create({
  model: 'deepseek/deepseek-v3',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' },
  ],
  temperature: 0.7,
  max_tokens: 256,
});

console.log(response.choices[0].message.content);
```

:::

## Response Structure

### Non-Streaming Response

```json
{
  "id": "chatcmpl-abc123def456",
  "object": "chat.completion",
  "created": 1719000000,
  "model": "deepseek/deepseek-v3",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The capital of France is Paris."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 8,
    "total_tokens": 32
  }
}
```

### Response Fields Explained

| Field | Description |
|-------|-------------|
| `id` | Unique identifier for this completion |
| `object` | Always `"chat.completion"` for non-streaming responses |
| `created` | Unix timestamp of when the response was generated |
| `model` | The model that generated the response |
| `choices` | Array of completion choices (typically one) |
| `choices[].index` | Index of this choice in the array |
| `choices[].message.role` | Always `"assistant"` |
| `choices[].message.content` | The generated text |
| `choices[].finish_reason` | Why generation stopped (see below) |
| `usage.prompt_tokens` | Tokens in your input |
| `usage.completion_tokens` | Tokens in the generated output |
| `usage.total_tokens` | Sum of prompt + completion tokens |

### Finish Reasons

| Value | Meaning |
|-------|---------|
| `stop` | Natural end of response or hit a stop sequence |
| `length` | Hit `max_tokens` limit — response was truncated |
| `content_filter` | Content was filtered by safety systems |

## Streaming Responses

For real-time output (like a chatbot typing), use streaming. The response arrives as Server-Sent Events (SSE):

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    api_key="sk-sb-YOUR_API_KEY",
    base_url="https://api.sandbase.ai/v1"
)

stream = client.chat.completions.create(
    model="deepseek/deepseek-v3",
    messages=[{"role": "user", "content": "Write a haiku about coding."}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()  # newline at the end
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'sk-sb-YOUR_API_KEY',
  baseURL: 'https://api.sandbase.ai/v1',
});

const stream = await client.chat.completions.create({
  model: 'deepseek/deepseek-v3',
  messages: [{ role: 'user', content: 'Write a haiku about coding.' }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) process.stdout.write(content);
}
console.log();
```

```bash [cURL]
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-sb-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -N \
  -d '{
    "model": "deepseek/deepseek-v3",
    "messages": [{"role": "user", "content": "Write a haiku about coding."}],
    "stream": true
  }'
```

:::

### Streaming SSE Format

Each chunk arrives as a Server-Sent Event:

```
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v3","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v3","choices":[{"index":0,"delta":{"content":"The"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v3","choices":[{"index":0,"delta":{"content":" capital"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v3","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

Key points:
- The first chunk contains `delta.role` indicating the assistant is responding
- Subsequent chunks contain `delta.content` with text fragments
- The final chunk has `finish_reason` set and empty `delta`
- The stream ends with `data: [DONE]`

## Using the Anthropic SDK

SandBase also exposes an Anthropic-compatible endpoint at `POST /v1/messages`. Use the Anthropic SDK by changing the `base_url`:

::: code-group

```python [Python]
import anthropic

client = anthropic.Anthropic(
    api_key="sk-sb-YOUR_API_KEY",
    base_url="https://api.sandbase.ai"
)

message = client.messages.create(
    model="anthropic/claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What is the capital of France?"}
    ]
)
print(message.content[0].text)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: 'sk-sb-YOUR_API_KEY',
  baseURL: 'https://api.sandbase.ai',
});

const message = await client.messages.create({
  model: 'anthropic/claude-sonnet-4-20250514',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'What is the capital of France?' }],
});
console.log(message.content[0].text);
```

:::

### Anthropic Response Structure

The Anthropic-compatible endpoint returns responses in Anthropic's format:

```json
{
  "id": "msg_abc123",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "The capital of France is Paris."
    }
  ],
  "model": "anthropic/claude-sonnet-4-20250514",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 14,
    "output_tokens": 8
  }
}
```

| Field | Description |
|-------|-------------|
| `id` | Message ID (prefixed with `msg_`) |
| `type` | Always `"message"` |
| `role` | Always `"assistant"` |
| `content` | Array of content blocks (text blocks) |
| `model` | The model that generated the response |
| `stop_reason` | `"end_turn"` (natural stop), `"max_tokens"` (hit limit), or `"stop_sequence"` |
| `usage.input_tokens` | Tokens in your input |
| `usage.output_tokens` | Tokens in the generated output |

### Anthropic Streaming

Streaming with the Anthropic SDK works the same way — just pass `stream=True`:

```python
import anthropic

client = anthropic.Anthropic(
    api_key="sk-sb-YOUR_API_KEY",
    base_url="https://api.sandbase.ai"
)

with client.messages.stream(
    model="anthropic/claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a haiku about coding."}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
print()
```

## Choosing a Model

When selecting a model, consider:

- **Speed**: DeepSeek V3 and GPT-4o Mini are fast and cheap for simple tasks
- **Quality**: Claude Sonnet and GPT-4o excel at complex reasoning
- **Cost**: Check the [Models](/models/) page for per-token pricing
- **Context window**: Some models support up to 200K tokens of context

You can switch models by changing the `model` parameter — no other code changes needed.

## Next Steps

Before production, set request timeouts, retry only transient failures with bounded exponential backoff, log request IDs when available, and monitor usage without logging prompts or API keys.

- [**API Reference**](/api-reference/) — Full endpoint documentation with all parameters
- [**Streaming Guide**](/guides/streaming) — Advanced streaming patterns and error handling
- [**Models**](/models/) — Complete list of available models with pricing
- [**Errors**](/guides/error-handling) — Handle failures and retries
