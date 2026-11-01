---
title: Generate Image
description: Generate an image with the synchronous OpenAI Images-compatible API.
aside: false
outline: false
apiReferenceKey: "images/generations"
---

<ApiReferencePage />

## Supported models
These OpenAI image models use the native Images API on this endpoint. Send the public model name in `model`:

| `model` | Best for |
| --- | --- |
| `gpt-image-2.5-flare` | Fast, high-quality generation and editing for everyday creative work |
| `gpt-image-2.5-sunburst` | Work where visual fidelity and precision matter most |
| `gpt-image-2` | The previous GPT Image generation |

Requests are synchronous and return image data in `data` as `b64_json` or a URL. This endpoint is separate from the general asynchronous `/v1/run` model endpoint; each model's page in the [model catalog](https://www.sandbase.ai/models/image-video) documents that contract and its pricing.

To edit images, send `multipart/form-data` to [`POST /v1/images/edits`](/api-reference/images/edits) with the same model names.
