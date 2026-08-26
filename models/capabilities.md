---
title: Capabilities
description: Discover current SandBase model capabilities from the live catalog and generated model references.
---

# Capabilities

Model capabilities change as models and provider routes are updated. Use the live model catalog and generated Model API Reference instead of relying on a hand-written capability matrix.

## Current sources of truth

1. Browse [Models](https://www.sandbase.ai/models) to compare currently available models.
2. Open the [Model API Reference](/model-api-reference/) for model-specific request fields and declared capabilities.
3. Call [`GET /v1/models`](/api-reference/models/list) when an integration needs to discover enabled model IDs programmatically.
4. Call [`GET /v1/models/{vendor}/{model}`](/api-reference/models/get) before depending on detailed capability or pricing metadata.

Treat model IDs and returned metadata as opaque values. Do not infer vision, tools, reasoning, structured-output, streaming, context, or caching support from the vendor name alone.

## Match the request to the capability

| Application need | Verify on the selected model |
|---|---|
| Text or chat | Chat or text-generation support and the required endpoint |
| Image input | Vision or multimodal-input support and accepted content-part formats |
| Tool use | Function/tool-calling support and the accepted tool schema |
| Structured output | JSON or schema-constrained output support |
| Reasoning | Supported reasoning controls, values, and token behavior |
| Streaming | Streaming support on the exact compatibility surface you call |
| Long context | Current context and output limits from the model card |
| Prompt caching | Model-specific cache behavior and returned usage fields |

Unsupported parameters may be rejected, ignored, or handled differently across compatibility surfaces. Send only fields documented by the selected model page.

## Production guidance

- Discover availability at startup or before accepting a newly selected model.
- Pin a specific logical model ID when stability matters.
- Handle unavailable-model and unsupported-capability errors even after successful discovery.
- Read current pricing from the detailed model card; do not copy a price or cache discount into application logic.
- Test the exact model, endpoint, and parameters used in production.

## Next steps

- [Supported Models](/models/supported)
- [Vision inputs](/models/vision)
- [Model API Reference](/model-api-reference/)
- [Chat Completions](/guides/chat-completions)
- [Streaming](/guides/streaming)
