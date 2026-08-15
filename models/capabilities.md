---
title: Capabilities
description: Capability matrix for all SandBase models — chat, streaming, tools, vision, thinking, JSON mode, and caching support.
---

# Capabilities

Each model supports a different set of capabilities. Check the capability metadata before sending a request so that the selected model supports the features you need.

## Capability Matrix

| Model | Chat | Streaming | Tools | Vision | Thinking | JSON Mode | Cache |
|-------|:----:|:---------:|:-----:|:------:|:--------:|:---------:|:-----:|
| `openai/gpt-4o` | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| `openai/gpt-4o-mini` | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| `openai/o3` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| `openai/o3-mini` | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| `anthropic/claude-sonnet-4` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| `anthropic/claude-3.5-haiku` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| `deepseek/deepseek-v3` | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| `deepseek/deepseek-chat` | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| `deepseek/deepseek-reasoner` | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `google/gemini-2.5-pro` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `google/gemini-2.5-flash` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `meta/llama-4-maverick` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `alibaba/qwen3-32b` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `bytedance/seed-1.6` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

## Capability Definitions

### Chat

All models support basic chat completion — sending messages and receiving a response. This is the fundamental capability.

### Streaming

Server-Sent Events (SSE) streaming for token-by-token response delivery. All models on SandBase support streaming.

See the [Streaming Guide](/guides/streaming) for implementation details.

### Tools (Function Calling)

The ability to define functions that the model can call. The model returns structured tool call requests that your application executes.

```python
tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get current weather",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string"}
            },
            "required": ["location"]
        }
    }
}]
```

**Models without tools support:** `deepseek/deepseek-reasoner` (reasoning-only model)

### Vision

The ability to process images in the input. Send images as URLs or base64-encoded data:

```python
messages = [{
    "role": "user",
    "content": [
        {"type": "text", "text": "What's in this image?"},
        {"type": "image_url", "image_url": {"url": "https://example.com/photo.jpg"}}
    ]
}]
```

**Models without vision:** `openai/o3-mini`, `deepseek/deepseek-v3`, `deepseek/deepseek-chat`, `deepseek/deepseek-reasoner`, `alibaba/qwen3-32b`

### Thinking (Reasoning)

Extended reasoning capabilities where the model "thinks" before responding. This produces higher-quality answers for complex problems at the cost of more tokens and latency.

**How to enable:**

::: code-group

```python [OpenAI format (o3)]
response = client.chat.completions.create(
    model="openai/o3",
    messages=[{"role": "user", "content": "Solve this step by step..."}],
    reasoning_effort="high"  # low, medium, high
)
```

```python [Anthropic format (Claude)]
response = client.messages.create(
    model="anthropic/claude-sonnet-4",
    max_tokens=8000,
    thinking={
        "type": "enabled",
        "budget_tokens": 5000
    },
    messages=[{"role": "user", "content": "Solve this step by step..."}]
)
```

```python [Gemini format]
response = client.chat.completions.create(
    model="google/gemini-2.5-pro",
    messages=[{"role": "user", "content": "Solve this step by step..."}],
    extra_body={
        "gemini": {"thinkingBudget": 5000}
    }
)
```

:::

**Models with thinking:** `openai/o3`, `openai/o3-mini`, `anthropic/claude-sonnet-4`, `deepseek/deepseek-reasoner`, `google/gemini-2.5-pro`, `google/gemini-2.5-flash`

### JSON Mode

Guaranteed JSON output. The model is constrained to produce valid JSON:

```python
response = client.chat.completions.create(
    model="openai/gpt-4o",
    messages=[{"role": "user", "content": "List 3 colors as JSON"}],
    response_format={"type": "json_object"}
)
# Response is guaranteed to be valid JSON
```

For stricter control, use JSON Schema mode (supported by OpenAI and Gemini models):

```python
response = client.chat.completions.create(
    model="openai/gpt-4o",
    messages=[{"role": "user", "content": "List 3 colors"}],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "colors",
            "schema": {
                "type": "object",
                "properties": {
                    "colors": {"type": "array", "items": {"type": "string"}}
                },
                "required": ["colors"]
            }
        }
    }
)
```

**Models with JSON mode:** `openai/gpt-4o`, `openai/gpt-4o-mini`, `openai/o3`, `openai/o3-mini`, `deepseek/deepseek-v3`, `deepseek/deepseek-chat`, `google/gemini-2.5-pro`, `google/gemini-2.5-flash`

### Cache (Prompt Caching)

Prompt caching reduces costs for repeated prompts. Cached input tokens are billed at a significant discount:

| Provider | Cache Discount |
|----------|---------------|
| Anthropic | 90% off input price |
| OpenAI | 50% off input price |
| DeepSeek | 90% off input price |
| Google | Varies by model |

**How caching works:**
- **OpenAI/DeepSeek:** Automatic — the provider caches prompts transparently
- **Anthropic:** Explicit — you mark cache breakpoints with `cache_control`
- **Google:** Automatic with explicit context caching API

**Models with caching:** `openai/gpt-4o`, `openai/gpt-4o-mini`, `anthropic/claude-sonnet-4`, `anthropic/claude-3.5-haiku`, `deepseek/deepseek-v3`, `deepseek/deepseek-chat`, `google/gemini-2.5-pro`, `google/gemini-2.5-flash`

## How Capabilities Affect Routing

When you send a request, SandBase inspects it to determine required capabilities:

| Request Feature | Required Capability |
|----------------|-------------------|
| `tools` parameter | `tools` |
| Image in messages | `vision` |
| `reasoning_effort` or `thinking` | `thinking` |
| `response_format: json_object` | `json_mode` |
| `cache_control` markers | `cache` |

If the requested model doesn't support a required capability through any available provider, SandBase returns a `capability_unsupported` error with details about what's missing.

### Hard vs Soft Requirements

| Capability | Type | Behavior When Missing |
|-----------|------|----------------------|
| Tools | Hard | Request fails — cannot process tool calls |
| Vision | Hard | Request fails — cannot process images |
| Thinking | Hard | Request fails — user explicitly requested reasoning |
| JSON Mode | Soft | Falls back to prompt-based JSON (with warning) |
| Cache | Soft | Silently ignored — request works, just no discount |

## Requesting New Models

If you need a model that's not currently available on SandBase, contact us at [support@sandbase.ai](mailto:support@sandbase.ai). We regularly add new models based on user demand.
