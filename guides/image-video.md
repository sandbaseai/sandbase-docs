---
title: Image and Video Models
description: Use SandBase's shared Run API to generate images and videos asynchronously.
---

# Image and Video Models

Image and video models use SandBase's shared asynchronous Run API. Submit a task
with `POST /v1/run`, then poll `GET /v1/run/{id}` until the run reaches a
terminal status.

## Submit a task

Use the exact model ID from [Supported Models](/models/supported). The remaining
request fields are model-specific; open the model's API reference for its
required inputs and limits.

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<model-id>",
    "prompt": "A cinematic product shot at sunrise."
  }'
```

The response includes an opaque `id` and a `status` such as `pending` or
`running`.

## Poll for the result

```bash
curl https://api.sandbase.ai/v1/run/<run-id> \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Continue polling until `status` is `completed`, `failed`, or `timeout`. Completed
runs contain capability-specific outputs, such as an image or video URL. Keep
the run ID and treat the run response as the authoritative status.

## Webhook callbacks

Supported asynchronous tasks may also set `webhook_url` in the submit request.
The callback is a delivery hint, not a replacement for polling; continue to
use `GET /v1/run/{id}` and handle duplicate or delayed callbacks safely. See
[Run a capability](/api-reference/models/run#webhook-callbacks) for the common
callback contract.

## Next steps

- [Supported Models](/models/supported)
- [Image Generation API reference](/model-api-reference/image-generation)
- [Video Generation API reference](/model-api-reference/video-generation)
- [Run a capability](/api-reference/models/run)
- [Get a run result](/api-reference/models/run-get)
