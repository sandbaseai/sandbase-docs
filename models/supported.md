---
title: Supported models
description: Find current SandBase model identifiers, capabilities, request schemas, and live pricing.
---

# Supported models

SandBase's model catalog changes frequently. Use the live catalog or the generated Model API Reference instead of relying on a static model list.

::: tip Current source of truth
Browse [Models](https://www.sandbase.ai/models) for current availability and pricing. For production integrations, call [`GET /v1/models`](/api-reference/models/list) immediately before selecting or validating a model.
:::

## Browse by capability

| Category | API reference | Primary API |
|---|---|---|
| Language, reasoning, vision, and tool use | [LLM models](/model-api-reference/llm-models) | [`POST /v1/chat/completions`](/api-reference/llm-gateway) |
| Claude-compatible messages | [Anthropic models](/model-api-reference/llm-models#anthropic) | [`POST /v1/messages`](/api-reference/anthropic-compat) |
| Image generation and editing | [Image generation](/model-api-reference/image-generation) | [`POST /v1/run`](/api-reference/models/image) or [OpenAI Images](/api-reference/images/generations) |
| Video generation and editing | [Video generation](/model-api-reference/video-generation) | [`POST /v1/run`](/api-reference/models/video) |
| Audio generation and processing | [Audio generation](/model-api-reference/audio-generation) | [`POST /v1/run`](/api-reference/models/audio) |
| Embeddings | [Embedding models](/api-reference/models/embedding) | [`POST /v1/embeddings`](/api-reference/models/embedding) |

Each generated model page contains the exact public model identifier, request fields, supported values, capabilities, and a working request. Disabled or internal-only registry entries are not published there.

## List models through the API

```bash
curl https://api.sandbase.ai/v1/models \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

The response follows the OpenAI-compatible model-list format and contains enabled logical models available to your account. Treat returned model IDs as opaque strings and send them unchanged in the relevant request's `model` field.

## Pricing and availability

Do not copy prices from a documentation table into application logic. Pricing, provider availability, routing, and enabled status can change independently of this page.

- Check [live model pricing](https://www.sandbase.ai/models) before estimating production cost.
- Use [`GET /v1/tasks/{task_id}/cost`](/api-reference/tasks/cost) to inspect the settled cost and usage of a completed task.
- Handle model-unavailable and admission errors even when a model appeared in an earlier catalog response.
- Use the model-specific reference page rather than assuming every model supports the same context window, tools, vision, streaming, or reasoning parameters.

## Choosing a model

Choose from the current catalog based on the operation you need, then verify the exact schema on its generated reference page. For a stable production integration, pin a specific logical model ID when available; use moving aliases only when you intentionally accept upstream model changes.

Check operational incidents separately on the [SandBase Status Page](https://status.sandbase.ai).
