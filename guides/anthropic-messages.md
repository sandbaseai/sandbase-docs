---
title: Anthropic Messages
description: Use Anthropic-compatible messages, content blocks, tools, thinking, and streaming with SandBase.
---

# Anthropic Messages

SandBase provides an Anthropic-compatible endpoint at `POST /v1/messages`. Anthropic SDK applications can connect by changing the API key and base URL.

```python
from anthropic import Anthropic

client = Anthropic(
    api_key="sk-sb-your-api-key",
    base_url="https://api.sandbase.ai",
)
```

## Authentication and version headers

Use `x-api-key` or `Authorization: Bearer …`. When both are supplied, `x-api-key` takes precedence. The optional `anthropic-version` header is accepted for SDK compatibility.

## Messages and content blocks

Messages use `user` and `assistant` roles. Put the system instruction in the top-level `system` field. Content can be plain text or an array of typed blocks such as `text`, `image`, `tool_use`, and `tool_result`.

## Tools and extended thinking

Add tool definitions in `tools` and control selection through `tool_choice`. When supported by the selected model, configure extended reasoning with `thinking`; preserve returned thinking blocks when continuing the conversation.

## Streaming

Set `stream: true` to receive Anthropic-style SSE events, including `message_start`, content-block events, `message_delta`, and `message_stop`. Consumers should ignore unknown event types for forward compatibility.

## Compatibility

SandBase normalizes requests across multiple providers. Provider-specific beta features may not be available on every model. For the complete request and response schema, see [Create Anthropic Message](/api-reference/anthropic-compat).
