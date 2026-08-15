---
title: Models API
description: Discover SandBase model metadata, pricing, support status, and capabilities.
---

# Models API

Use the Models API to discover model metadata before choosing an inference endpoint. Catalog responses include model identity, vendor, type, execution mode, pricing, support status, and capability information when available.

| Operation | Endpoint | Documentation |
|---|---|---|
| List models | `GET /v1/models` | [List Models](./list) |
| Get one model | `GET /v1/models/{id_or_name}` | [Get Model](./get) |
| Browse supported models | — | [Supported Models](/models/supported) |
| Compare capabilities | — | [Capabilities](/models/capabilities) |

To run a model, use the separate **Inference APIs** section for Chat Completions, Anthropic Messages, image, video, audio, vision, embeddings, assets, and task-cost lookup.
