---
title: Chat Completions
description: Use OpenAI-compatible chat completions, streaming, tools, multimodal input, and structured output with SandBase.
---

# Chat Completions

SandBase provides an OpenAI-compatible Chat Completions endpoint at `POST /v1/chat/completions`. Existing OpenAI SDK applications can use SandBase by changing the API key and base URL.

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-sb-your-api-key",
    base_url="https://api.sandbase.ai/v1",
)
```

## Messages and multimodal content

Send `system`, `user`, `assistant`, and `tool` messages in conversation order. Text may be a string. Models that support vision also accept content parts such as `text` and `image_url`.

## Streaming

Set `stream: true` to receive Server-Sent Events. Read each `data:` event in order and concatenate `choices[0].delta.content`. The stream ends with `data: [DONE]`. Add `stream_options: {"include_usage": true}` when final token usage is required.

## Tools

Define callable functions in `tools`. When the assistant returns `tool_calls`, execute each function in your application, then append a `tool` message containing the matching `tool_call_id` before continuing.

## Structured output

Use `response_format` to request a JSON object or JSON Schema response. Support varies by model, so check the selected model’s capabilities before relying on strict schema enforcement.

## Errors and retries

Retry `429`, `500`, and `502` responses with exponential backoff and jitter. Do not automatically retry malformed requests or authentication failures. For the complete field and response schema, see [Create Chat Completion](/api-reference/llm-gateway).
