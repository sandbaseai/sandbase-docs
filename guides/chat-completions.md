---
title: Chat Completions
description: Use OpenAI-compatible chat completions, streaming, tools, multimodal input, and structured output with SandBase.
---

# Chat Completions

SandBase provides an OpenAI-compatible Chat Completions endpoint at `POST /v1/chat/completions`. Existing OpenAI SDK applications can use SandBase by changing the API key and base URL.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1",
)
```

## Messages and multimodal content

Send messages in conversation order using roles supported by the selected provider, commonly `system`, `developer`, `user`, `assistant`, and `tool`. Text may be a string. Models that support vision also accept content parts such as `text` and `image_url`.

## Streaming

Set `stream: true` to receive Server-Sent Events. Read each `data:` event in order and concatenate `choices[0].delta.content`. The stream ends with `data: [DONE]`. Add `stream_options: {"include_usage": true}` when the selected provider supplies streaming usage; otherwise usage may be absent.

## Tools

Define callable functions in `tools`. When the assistant returns `tool_calls`, execute each function in your application, then append a `tool` message containing the matching `tool_call_id` before continuing.

## Structured output

Use `response_format` to request a JSON object or JSON Schema response. Support varies by model, so check the selected model’s capabilities before relying on strict schema enforcement.

## Provider-specific parameters

SandBase uses `model` and `stream` for routing. Additional OpenAI-compatible request fields are preserved when the selected provider uses the same protocol. When SandBase translates between protocols, use documented fields or `extra_body`; support varies by provider.

## Errors and retries

Use bounded backoff for retryable `429` and transient server responses only when regenerating is safe. Do not automatically retry malformed requests, authentication failures, or requests whose tool side effects may already have occurred. See [Errors and retries](/guides/error-handling). For the complete field and response schema, see [Create Chat Completion](/api-reference/llm-gateway).
