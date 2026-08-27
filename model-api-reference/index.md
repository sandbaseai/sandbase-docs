---
title: Model API Reference
description: Browse SandBase model APIs by capability, provider, and model identifier.
---

# Model API Reference

Browse the models available through SandBase, find the exact model identifier to use, and copy a working API request.

## Models by category

### [LLM Models](/model-api-reference/llm-models)

Use language and reasoning models for chat, tool calling, structured output, vision, and long-context tasks. Browse models by provider, including OpenAI, Anthropic, Google, DeepSeek, Alibaba, Meta, and ByteDance.

### [Image Generation](/model-api-reference/image-generation)

Generate, edit, transform, upscale, and train image models through SandBase. Browse image models by provider, including OpenAI, Google, Ideogram, ByteDance, Recraft, Luma, and more.

### [Video Generation](/model-api-reference/video-generation)

Generate, edit, animate, upscale, and transform videos through SandBase. Browse video models by provider, including OpenAI, ByteDance, Kling, Google, Luma, Runway, Veed, and more.

### [Audio Generation](/model-api-reference/audio-generation)

Generate, transform, clone, transcribe, and synthesize audio through SandBase. Browse audio models by provider and copy the exact async request format for each model.

### [Official Native API](/model-api-reference/seedance-native-api)

Use provider-native protocols without rewriting an existing integration. Browse by provider and model; ByteDance Seedance is currently supported through the Volcengine Ark Contents Generations task protocol.

## Get started

All LLM models use the OpenAI-compatible [Chat Completions API](/api-reference/llm-gateway). Claude models can also use the [Anthropic Messages API](/api-reference/anthropic-compat).

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek/deepseek-v4-flash","messages":[{"role":"user","content":"Hello"}]}'
```

Image, video, and audio generation models use the async `/v1/run` flow:

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"openai/gpt-image-2","prompt":"A studio product photo on a clean white background"}'
```

Poll the returned task id until the result is ready:

```bash
curl https://api.sandbase.ai/v1/run/f3d2e8a1-7c4b-4a12-9d2e-123456789abc \
  -H "Authorization: Bearer sk-YOUR_KEY"
```
