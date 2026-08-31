---
title: Media Assets for Seedance
description: Register reusable media through the official-compatible Asset protocol, then use asset:// references with Seedance 2.0 and 2.5.
---

# Media Assets for Seedance

SandBase exposes the official-compatible Asset protocol at `/v1/assets`. The Asset request and the returned `asset://`
reference follow the official protocol, and the reference is passed through unchanged in the native ByteDance Contents
Generations request. Both
[Seedance 2.5 Official](./seedance-2.5-official) and [Seedance 2.0 Official](./seedance-2.0-official) accept that reference
where they normally accept a public HTTP(S) URL.

The complete workflow is:

1. Register a reachable media URL with `POST /v1/assets`.
2. Query `GET /v1/assets/{external_id}` until the provider reports that the Asset is usable.
3. Put the returned `asset_url` in a Seedance `content` item and submit the generation task.

## Official-compatible Asset operations

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/v1/assets` | Register a reachable media URL and receive an official-compatible `asset://` reference |
| `GET` | `/v1/assets/{external_id}` | Read the provider status and obtain the current preview/download URL |

The public API currently exposes registration and lookup. Asset groups, listing, renaming, updating, and deletion are
not public operations. Assets belong to the organization associated with the API key.

## Step 1: register the Asset

Send the reachable URL to `POST /v1/assets`. `asset_type` is case-sensitive and must be `Image`, `Video`, or `Audio`:

```bash
curl -X POST https://api.sandbase.ai/v1/assets \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/product-reference.png",
    "asset_type": "Image",
    "name": "Product reference"
  }'
```

Save `asset_url` from the response:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Image",
  "name": "Product reference",
  "created_at": "2026-07-10T15:04:03Z"
}
```

The value after `asset://` is the `external_id` used by the official-compatible lookup operation.

## Step 2: check readiness

Query the Asset with the `external_id`, without the `asset://` prefix:

```bash
curl https://api.sandbase.ai/v1/assets/asset-20260710150403-hx4hf \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "external_id": "asset-20260710150403-hx4hf",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "status": "Active",
  "asset_type": "Image",
  "name": "Product reference",
  "download_url": "https://media.example.com/current-signed-url",
  "created_at": "2026-07-10T15:04:03Z"
}
```

Treat `status` as an open provider value rather than an exhaustive enum. Wait until the provider reports a usable
state before submitting the generation task; a common ready value is `Active`. `download_url` is provider-managed and
can be empty while processing. Query the Asset again when you need a current preview URL. Keep using the persistent
`asset_url` in Seedance requests rather than copying `download_url`.

## Step 3: generate with the Asset

Place `asset_url` in the URL field that matches the media type. This example uses the registered image as a visual
reference:

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {
        "type": "text",
        "text": "Create a cinematic product shot. Keep the bottle shape and label from the reference image."
      },
      {
        "type": "image_url",
        "image_url": {"url": "asset://asset-20260710150403-hx4hf"},
        "role": "reference_image"
      }
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 5,
    "generate_audio": true
  }'
```

The create response returns a task `id`. Poll
`GET /api/v3/contents/generations/tasks/{task_id}` as described on the selected model page.

## Choose the content item and role

| Asset type | `content[].type` | URL field | Supported role | Use it for |
| --- | --- | --- | --- | --- |
| Image | `image_url` | `image_url.url` | `first_frame` | Start the video from this exact frame |
| Image | `image_url` | `image_url.url` | `last_frame` | End on this frame; include a `first_frame` in the same request |
| Image | `image_url` | `image_url.url` | `reference_image` | Preserve a subject, product, composition, costume, or visual style |
| Video | `video_url` | `video_url.url` | `reference_video` | Follow motion, timing, camera work, or editing rhythm |
| Audio | `audio_url` | `audio_url.url` | `reference_audio` | Follow voice, dialogue, music, or sound design |

Audio cannot be the only input. Combine a `reference_audio` Asset with text, an image, or a video. Any request that
contains a `video_url` uses the video-to-video billing rate.

### Video Asset example

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-video1"},
  "role": "reference_video"
}
```

### Audio Asset example

```json
{
  "type": "audio_url",
  "audio_url": {"url": "asset://asset-20260710150403-audio1"},
  "role": "reference_audio"
}
```

## Direct URL or `asset://` reference?

| Input | Best when | Trade-off |
| --- | --- | --- |
| Public HTTP(S) URL | The media is already hosted and used once | Fastest path, but the URL must remain reachable through task submission and provider fetch |
| `asset://` reference | The media is reused through the official Asset protocol | Adds a registration/readiness step, then gives a persistent reference for later Seedance tasks |

For request parameters, polling, task statuses, and billing, continue with
[Seedance 2.5 Official](./seedance-2.5-official), [Seedance 2.0 Official](./seedance-2.0-official), or the complete
[Official Native API overview](/model-api-reference/official-native-api).
