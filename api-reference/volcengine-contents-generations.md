---
title: Seedance Video (Volcengine Ark Protocol)
description: Generate Seedance 2.0 and 2.5 videos through the Volcengine Ark Contents Generations task protocol, including inputs, polling, billing and media Assets.
aside: false
outline: false
apiReference:
  title: Volcengine Ark Contents Generations
  operation: Video
  method: POST
  path: /api/v3/contents/generations/tasks
  description: Submit a Seedance video task. A successful submission returns HTTP 200 and a SandBase task id.
  groups:
    - title: Request body
      fields:
        - { name: model, type: string, required: true, description: 'Supported model identifier: bytedance/seedance/2.0-official or bytedance/seedance/2.5-official.' }
        - { name: content, type: array, required: true, description: Typed text and optional media inputs. Item shapes are validated by the model. }
        - { name: duration, type: integer, required: false, description: Forwarded to the model unchanged. Model validation applies. }
        - { name: resolution, type: string, required: false, description: Forwarded to the model unchanged. Model validation applies. }
        - { name: ratio, type: string, required: false, description: Forwarded to the model unchanged. Model validation applies. }
        - { name: generate_audio, type: boolean, required: false, description: Forwarded to the model unchanged. Request generated audio when supported. }
  examples:
    - label: Text to video
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "bytedance/seedance/2.0-official",
            "content": [{"type": "text", "text": "A paper boat crossing a rain puddle"}],
            "duration": 5,
            "resolution": "720p"
          }'
  response:
    status: 200 OK
    code: |-
      { "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }
---

<ApiReferencePage />

## Seedance guide

Seedance generates video from text, opening and closing frames, and multimodal references such as images, video, and
audio. Use it for anything from a simple text-to-video clip to a directed shot that follows a visual subject, camera
movement, and soundtrack.

Generation is asynchronous. Submit a task, then poll it until it reaches a terminal status.

## Choosing a model

| `model` | Best for | Output resolutions |
| --- | --- | --- |
| `bytedance/seedance/2.5-official` | 1080p delivery and highest available output resolution | 480p, 720p, 1080p |
| `bytedance/seedance/2.0-official` | Lower-cost generation when 480p or 720p is sufficient | 480p, 720p |

Both models accept the same multimodal input and support text-to-video, image-to-video, and multimodal reference
workflows in a single request shape. Pick `2.0-official` when 480p or 720p meets your needs and you want the lower-priced
option. Pick `2.5-official` when you need 1080p.

## API reference

| Method | Path |
| --- | --- |
| `POST` | `/api/v3/contents/generations/tasks` |
| `GET` | `/api/v3/contents/generations/tasks/{task_id}` |

Listing tasks and cancelling or deleting a task are not supported. Store the returned task `id` to retrieve the result.

Authenticate every request with the same API key used to create the task:

```
Authorization: Bearer $SANDBASE_API_KEY
```

The `model` value must match one of the names in [Choosing a model](#choosing-a-model). Polling is the supported way to
receive results; do not rely on `callback_url` for this endpoint.

## Quickstart

Submit a task:

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "A slow cinematic push across an alpine lake at sunrise"}
    ],
    "ratio": "16:9",
    "resolution": "720p",
    "duration": 5,
    "generate_audio": true
  }'
```

```json
{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }
```

Poll the task with that id every 5 to 10 seconds until `status` is `succeeded`, `failed`, `expired`, or `cancelled`:

```bash
curl https://api.sandbase.ai/api/v3/contents/generations/tasks/158d2649-e01d-45b9-b88a-ef3c450c601c \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "158d2649-e01d-45b9-b88a-ef3c450c601c",
  "model": "bytedance/seedance/2.5-official",
  "status": "succeeded",
  "created_at": 1787059000,
  "updated_at": 1787059150,
  "content": { "video_url": "https://media.sandbase.ai/files/158d2649.../0.mp4" },
  "usage": { "completion_tokens": 108900, "total_tokens": 108900 }
}
```

The generated video is available at `content.video_url`.

## Choose an input workflow

The API supports seven common input workflows. Each item in `content` has a `type`; the combination of item types and
roles selects the workflow:

| Goal | `content` combination | Use it when |
| --- | --- | --- |
| Text to video | Text | The scene can be described entirely in the prompt |
| Animate an opening frame | Text (optional) + image with `first_frame` | The first frame must match a supplied image |
| Transition between two frames | Text (optional) + `first_frame` + `last_frame` | The shot needs a controlled beginning and ending |
| Follow a visual reference | Text (optional) + image with `reference_image` | A subject, product, costume, or visual style should remain recognizable |
| Follow motion or camera language | Text (optional) + video with `reference_video` | Motion, timing, editing rhythm, or camera movement comes from a reference clip |
| Add an audio reference | Text/image/video + audio with `reference_audio` | Dialogue, music, voice, or sound design should guide the result |
| Full multimodal direction | Text + image + video + audio references | Different assets control appearance, motion, and sound in one shot |

Audio cannot stand alone. Every request that includes an audio item must also include at least one text, image, or video
item.

### Content item shapes

```json
{ "type": "text", "text": "A puppy running across a sunlit lawn" }
```

```json
{ "type": "image_url", "image_url": { "url": "https://example.com/ref.jpg" }, "role": "reference_image" }
```

```json
{ "type": "video_url", "video_url": { "url": "https://example.com/ref.mp4" }, "role": "reference_video" }
```

```json
{ "type": "audio_url", "audio_url": { "url": "https://example.com/bgm.mp3" }, "role": "reference_audio" }
```

`role` says how the model should use the asset:

| Asset | `role` | Effect |
| --- | --- | --- |
| Image | `first_frame` | Use the image as the opening frame |
| Image | `last_frame` | Use the image as the closing frame; include a `first_frame` in the same request |
| Image | `reference_image` | Reference the subject, composition, product, costume, or visual style |
| Video | `reference_video` | Reference motion, camera work, timing, or editing rhythm |
| Audio | `reference_audio` | Reference voice, dialogue, music, or sound design |

Image items accept either a public URL or an inline `data:image/...;base64,...` value. Video and audio references should
use public URLs that the model can download.

Including any `video_url` item puts the request in video-to-video mode, which changes the token rate. See
[Billing](#billing).

## Common recipes

The examples below show request bodies. Send any of them to the create-task endpoint shown in the [Quickstart](#quickstart).

### Animate a first frame

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "The woman slowly looks up and smiles as the camera gently pushes in"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 5,
  "generate_audio": true
}
```

### Create a first-to-last-frame transition

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "A smooth transition from a bright afternoon into a neon-lit night"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"},
    {"type": "image_url", "image_url": {"url": "https://example.com/last-frame.jpg"}, "role": "last_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 6
}
```

### Direct a shot with image, video, and audio references

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "First-person fruit tea commercial, camera pushes in on the layered foam"},
      {"type": "image_url", "image_url": {"url": "https://example.com/ref.jpg"}, "role": "reference_image"},
      {"type": "video_url", "video_url": {"url": "https://example.com/ref.mp4"}, "role": "reference_video"},
      {"type": "audio_url", "audio_url": {"url": "https://example.com/bgm.mp3"}, "role": "reference_audio"}
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 11
  }'
```

Use the prompt to assign a clear job to each reference: for example, “keep the product appearance from the image, use
the camera movement from the video, and follow the pacing of the audio.” This is more reliable than asking every asset
to control the whole result.

## Writing an effective prompt

A practical prompt usually follows this order:

1. **Subject** — who or what appears in the shot.
2. **Action** — what changes or moves.
3. **Scene** — location, time of day, weather, and surrounding details.
4. **Visual style** — cinematic, documentary, product commercial, animation, and so on.
5. **Camera** — framing, lens feel, camera movement, and cuts.
6. **Sound** — dialogue, ambience, music, or effects when `generate_audio` is enabled.

Be explicit about what must remain stable. For example: “The product label stays readable, the camera makes one slow
push-in, no scene cuts, natural room tone.” When several references are present, describe which visual or motion quality
to take from each one.

## Output options

| Parameter | Type | Default | Values |
| --- | --- | --- | --- |
| `resolution` | string | `720p` | `480p`, `720p`, `1080p`. `2.0-official` does not support `1080p` |
| `ratio` | string | `adaptive` | `16:9`, `9:16`, `4:3`, `3:4`, `1:1`, `21:9`, `adaptive`. `adaptive` chooses a ratio from the input and prompt |
| `duration` | integer | `5` | 4 to 15 seconds, or `-1` to let the model choose within the supported range |
| `generate_audio` | boolean | `true` | Generate synchronized voice, sound effects, and background music |
| `seed` | integer | `-1` | `-1` to `2^32-1`. The same prompt and seed produce similar, not identical, output |
| `watermark` | boolean | `false` | Add an AI-generated watermark to the lower-right corner |
| `tools` | array | `[]` | `[{"type": "web_search"}]` enables web search while planning the shot |

### Task control

| Parameter | Type | Default | Notes |
| --- | --- | --- | --- |
| `execution_expires_after` | integer | `172800` | Task timeout in seconds, from 3600 to 259200. A task past this becomes `expired` |
| `service_tier` | string | `default` | These models do not support `flex` |
| `safety_identifier` | string | — | Opaque end-user identifier, at most 64 characters. Send a hash, not raw personal data |

### Frame size

`resolution` and `ratio` together determine the pixel dimensions:

| Resolution | 16:9 | 9:16 | 4:3 | 3:4 | 1:1 | 21:9 |
| --- | --- | --- | --- | --- | --- | --- |
| 480p | 864×496 | 496×864 | 752×560 | 560×752 | 640×640 | 992×432 |
| 720p | 1280×720 | 720×1280 | 1112×834 | 834×1112 | 960×960 | 1470×630 |
| 1080p | 1920×1080 | 1080×1920 | 1664×1248 | 1248×1664 | 1440×1440 | 2206×946 |

## Task status

| `status` | Meaning | What to do |
| --- | --- | --- |
| `queued` | Accepted, waiting to start | Keep polling every 5 to 10 seconds |
| `running` | Generating | Keep polling |
| `succeeded` | Done | Download `content.video_url` |
| `failed` | Rejected by content review, or the model errored | Read `error.message`. Adjust the prompt before retrying |
| `expired` | Ran past `execution_expires_after` | Submit again |
| `cancelled` | Ended before generation started | Submit again |

### Task fields

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | The task id returned at submit |
| `model` | string | The `model` value you sent |
| `status` | string | See above |
| `created_at` | integer | Unix seconds |
| `updated_at` | integer | Unix seconds. Equals `created_at` until the task finishes |
| `content` | object | Empty until the task succeeds. Carries the generated `video_url` |
| `usage` | object | Token counts. See [Billing](#billing) |
| `error` | object | Present for `failed` and `expired`. Contains `code` and `message` |

### Complete Python flow

```python
import os
import time

import requests

BASE_URL = "https://api.sandbase.ai/api/v3/contents/generations/tasks"
HEADERS = {
    "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
    "Content-Type": "application/json",
}

task = requests.post(
    BASE_URL,
    headers=HEADERS,
    json={
        "model": "bytedance/seedance/2.5-official",
        "content": [
            {
                "type": "text",
                "text": "A quiet shoreline at sunrise, gentle waves, one slow camera push-in",
            }
        ],
        "ratio": "16:9",
        "resolution": "720p",
        "duration": 5,
        "generate_audio": True,
    },
)
task.raise_for_status()
task_id = task.json()["id"]

while True:
    time.sleep(8)
    result = requests.get(f"{BASE_URL}/{task_id}", headers=HEADERS)
    result.raise_for_status()
    data = result.json()
    print(data["status"])

    if data["status"] == "succeeded":
        print(data["content"]["video_url"])
        break
    if data["status"] in {"failed", "expired", "cancelled"}:
        raise RuntimeError(data.get("error", {"message": data["status"]}))
```

## Billing

These models bill on `usage.completion_tokens`, which the task reports when it finishes. The token rate depends on two
dimensions:

- **Whether the input includes video.** Video-to-video requests, meaning any `content` item of type `video_url`, bill at
  a lower rate than text-to-video.
- **Output resolution.** For `2.5-official`, 1080p bills higher than 480p and 720p. The `2.0-official` rate does not vary
  by resolution.

`usage` reports `completion_tokens` and `total_tokens`, which are currently equal. It is empty while the task is running.
See your [account history](/api-reference/account/history) for actual charges, and the
[pricing guide](/guides/billing) for current rates.

## Errors

An invalid request returns an error immediately. A generation-time error appears in the task after polling. Both use an
`error` object with a machine-readable `code` and a human-readable `message`:

```json
{ "error": { "code": "InvalidParameter", "message": "model is required", "type": "BadRequest" } }
```

| HTTP | `code` | `type` |
| --- | --- | --- |
| 400 | `InvalidParameter` | `BadRequest` |
| 401 | `AuthenticationError` | `Unauthorized` |
| 403 | `PermissionDenied` | `Forbidden` |
| 404 | `ResourceNotFound` | `NotFound` |
| 429 | `RateLimitExceeded` | `TooManyRequests` |
| 500 | `InternalServiceError` | `InternalServerError` |
| 503 | `InternalServiceError` | `ServiceUnavailable` |

Common recovery steps:

| Result | What to try |
| --- | --- |
| `400 InvalidParameter` | Check the model name, required content, roles, resolution, duration, and asset URLs |
| Task status `failed` with a content-review error | Rewrite the prompt or replace the flagged reference asset before submitting again |
| Task status `expired` | Submit a new task; consider a longer `execution_expires_after` for high-resolution or long clips |
| `429 RateLimitExceeded` | Retry with exponential backoff and reduce concurrent submissions |
| `503 ServiceUnavailable` | Retry the same request after a short delay |

## Use registered media Assets
# Media Assets for Seedance

SandBase exposes the official-compatible Asset protocol at `/v1/assets`. The Asset request and the returned `asset://`
reference follow the official protocol, and the reference is passed through unchanged in the native ByteDance Contents
Generations request. Both
`bytedance/seedance/2.5-official` and `bytedance/seedance/2.0-official` accept that reference
where they normally accept a public HTTP(S) URL.

The complete workflow is:

1. Register a reachable media URL with `POST /v1/assets`.
2. Query `GET /v1/assets/{external_id}` until the provider reports that the Asset is usable.
3. Put the returned `asset_url` in a Seedance `content` item and submit the generation task.

### Official-compatible Asset operations

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/v1/assets` | Register a reachable media URL and receive an official-compatible `asset://` reference |
| `GET` | `/v1/assets/{external_id}` | Read the provider status and obtain the current preview/download URL |

The public API currently exposes registration and lookup. Asset groups, listing, renaming, updating, and deletion are
not public operations. Assets belong to the organization associated with the API key.

### Step 1: register the Asset

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

### Step 2: check readiness

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

### Step 3: generate with the Asset

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

### Choose the content item and role

| Asset type | `content[].type` | URL field | Supported role | Use it for |
| --- | --- | --- | --- | --- |
| Image | `image_url` | `image_url.url` | `first_frame` | Start the video from this exact frame |
| Image | `image_url` | `image_url.url` | `last_frame` | End on this frame; include a `first_frame` in the same request |
| Image | `image_url` | `image_url.url` | `reference_image` | Preserve a subject, product, composition, costume, or visual style |
| Video | `video_url` | `video_url.url` | `reference_video` | Follow motion, timing, camera work, or editing rhythm |
| Audio | `audio_url` | `audio_url.url` | `reference_audio` | Follow voice, dialogue, music, or sound design |

Audio cannot be the only input. Combine a `reference_audio` Asset with text, an image, or a video. Any request that
contains a `video_url` uses the video-to-video billing rate.

#### Video Asset example

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-video1"},
  "role": "reference_video"
}
```

#### Audio Asset example

```json
{
  "type": "audio_url",
  "audio_url": {"url": "asset://asset-20260710150403-audio1"},
  "role": "reference_audio"
}
```

### Direct URL or `asset://` reference?

| Input | Best when | Trade-off |
| --- | --- | --- |
| Public HTTP(S) URL | The media is already hosted and used once | Fastest path, but the URL must remain reachable through task submission and provider fetch |
| `asset://` reference | The media is reused through the official Asset protocol | Adds a registration/readiness step, then gives a persistent reference for later Seedance tasks |

For request parameters, polling, task statuses, and billing, see the [Seedance guide](#seedance-guide) above.

## Official ByteDance resources
- [Seedance video generation documentation](https://www.volcengine.com/docs/82379/1520758?lang=en)
- [Create contents generation task API](https://api.volcengine.com/api-explorer/?action=CreateContentsGenerationsTasks&groupName=%E8%A7%86%E9%A2%91%E7%94%9F%E6%88%90API&serviceCode=ark&version=2024-01-01)
- [Seedance 2.0 prompting guide](https://www.volcengine.com/docs/82379/2222480?lang=en)
