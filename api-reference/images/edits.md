---
title: Edit Image
description: Edit uploaded images with the synchronous OpenAI Images-compatible API.
aside: false
outline: false
apiReferenceKey: "images/edits"
---

<ApiReferencePage />

## Supported models
These OpenAI image models use the native Images API on this endpoint and on [`/v1/images/generations`](/api-reference/images/generations). Send the public model name in `model`:

| `model` | Best for |
| --- | --- |
| `gpt-image-2.5-flare` | Fast, high-quality generation and editing for everyday creative work |
| `gpt-image-2.5-sunburst` | Work where visual fidelity and precision matter most |
| `gpt-image-2` | The previous GPT Image generation |

Requests are synchronous and return image data in `data` as `b64_json` or a URL. This endpoint is separate from the general asynchronous `/v1/run` model endpoint; each model's page in the [model catalog](https://www.sandbase.ai/models/image-video) documents that contract and its pricing.

Provide `model`, `prompt`, and at least one `image` file. Repeat the `image` field to compose or edit multiple source images:

```bash
curl https://api.sandbase.ai/v1/images/edits \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -F "model=gpt-image-2.5-flare" \
  -F "prompt=Turn this product photo into a warm editorial scene" \
  -F "image=@product.png" \
  -F "quality=high"
```
