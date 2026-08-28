---
title: Models API
description: Discover SandBase model metadata, pricing, support status, and capabilities.
---

# Models API

Use the Models API to discover models before choosing an inference endpoint. The list operation is OpenAI-compatible and returns compact identity records. Retrieve one model for SandBase capability, schema, and pricing metadata.

| Operation | Endpoint | Documentation |
|---|---|---|
| List models | `GET /v1/models` | [List Models](./list) |
| Get one model | `GET /v1/models/{id_or_name}` | [Get Model](./get) |
| Invoke an API capability by path | `GET/POST /v1/api/{vendor}/{upstream_path}` | [API Passthrough](./api-passthrough) |
| Run a model or API capability | `POST /v1/run` | [Run Capability](./run) |
| Get an asynchronous result | `GET /v1/run/{id}` | [Get Run Result](./run-get) |
| Browse supported models | — | [Supported Models](/models/supported) |
| Compare capabilities | — | [Capabilities](/models/capabilities) |

To run a model, use the [Model API Reference](/model-api-reference/) for normalized Chat Completions, Anthropic Messages, image, video, audio, vision, and embedding contracts. This page documents discovery, the unified capability runner, API passthrough, assets, and task-cost lookup.

`GET /v1/models` supports `q`, `vendor`, `type`, and `order`; it is not paginated. Omitting `type` defaults to `llm`, while an explicitly empty `type=` lists all public model types. The `vendor` filter is exact and case-sensitive; `q` is a case-insensitive substring search. Each list item contains `id`, `object`, `created`, and `owned_by`, where `id` is the logical model name used in requests.

Model names may contain `/`. Pass those slashes as path separators when calling the detail endpoint, for example `/v1/models/openai/gpt-5.6-luna`; the server route consumes the remaining path as one logical identifier. Discover the current ID from `GET /v1/models` instead of copying an identifier from an older guide.

For an asynchronous `202` response from an inference API, poll `GET /v1/run/{id}` with the returned opaque ID. Do not infer an ID prefix or construct a different polling path from compatibility headers.
