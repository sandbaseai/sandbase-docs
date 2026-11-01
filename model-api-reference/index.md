---
title: Model API Reference
description: Find each SandBase model's and API's reference on its main-site page, plus the official native API references kept here.
---
# Model API Reference
Each model and API now has its reference on its own page on the SandBase website. That page shows the exact identifier, the request schema, pricing, and a working example.
## Where to find a reference
- Models: `https://www.sandbase.ai/models/{vendor}/{model}/docs`
- APIs: `https://www.sandbase.ai/apis/{vendor}/{endpoint}/docs`

Browse the catalogs to find a model or API:
- [Language models](https://www.sandbase.ai/models)
- [Image and video models](https://www.sandbase.ai/models/image-video)
- [APIs](https://www.sandbase.ai/apis)
## Official native APIs
This section keeps the references for provider-native protocols, so you can use an existing integration without rewriting it. ByteDance Seedance uses the Volcengine Ark Contents Generations task protocol, and Google models use the Gemini-compatible GenerateContent or Interactions protocols.

See [Official Native API](/model-api-reference/official-native-api/).
## Inference API contracts
The normalized request contracts are in the API reference:
- [Models API](/api-reference/models/) — discover enabled model IDs, capabilities, and pricing
- [Chat Completions](/api-reference/llm-gateway) — OpenAI-compatible text and vision requests
- [Responses](/api-reference/responses) — OpenAI Responses-compatible requests
- [Anthropic Messages](/api-reference/anthropic-compat) — Anthropic-compatible requests
- [Google Gemini](/api-reference/gemini-generate-content) — Gemini-compatible requests
- [Gemini Interactions](/api-reference/gemini-interactions) — asynchronous Gemini interactions
- [Media assets](/api-reference/models/assets) — upload and retrieve media used by model requests
