---
title: Volcengine Ark Contents Generations
description: Create and manage asynchronous Seedance video tasks with the Volcengine Ark native protocol.
aside: false
outline: false
apiReference:
  title: Volcengine Ark Contents Generations
  operation: Video
  method: POST
  path: /api/v3/contents/generations/tasks
  description: Submit a Seedance video task. A successful asynchronous submission returns HTTP 200 and a task ID.
  groups:
    - title: Request body
      fields:
        - { name: model, type: string, required: true, description: Supported Ark Seedance model identifier. }
        - { name: content, type: array, required: true, description: Typed text and optional media inputs. At least one non-empty text item is required. }
        - { name: callback_url, type: string, required: false, description: Non-empty URL that receives the terminal task response. }
        - { name: duration, type: integer, required: false, description: Requested output duration. Model validation applies. }
        - { name: resolution, type: string, required: false, description: Requested output resolution. Model validation applies. }
        - { name: ratio, type: string, required: false, description: Requested aspect ratio. }
        - { name: generate_audio, type: boolean, required: false, description: Request generated audio when supported. }
  examples:
    - label: Text to video
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "doubao-seedance-2-5-260628",
            "content": [{"type": "text", "text": "A paper boat crossing a rain puddle"}],
            "duration": 5,
            "resolution": "720p"
          }'
  response:
    status: 200 OK
    code: |-
      { "id": "pred_01K..." }
---

<ApiReferencePage />

## Authentication and ownership

Use `Authorization: Bearer …`. This protocol does not accept `x-api-key` or query-string credentials. Task lookup, listing, cancellation, and deletion are restricted to the same organization and the same SandBase API key that created the task.

Supported models are:

- `doubao-seedance-2-0-260128`
- `doubao-seedance-2-0-fast-260128`
- `doubao-seedance-2-5-260628`

## Content modes

Every request needs at least one `{ "type": "text", "text": "…" }` item. The remaining content selects the mode:

- Text only creates text-to-video.
- An `image_url` with `first_frame` and optional `last_frame` creates image-to-video. A last frame cannot be used without a first frame.
- `reference_image`, `reference_video`, or `reference_audio` items create reference-to-video.

Media values can be URL strings or `{ "url": "…" }` objects. Image roles are `first_frame`, `last_frame`, or `reference_image`; video and audio use `reference_video` and `reference_audio`.

## Get and list tasks

Retrieve one task with `GET /api/v3/contents/generations/tasks/{task_id}`. List tasks with `GET /api/v3/contents/generations/tasks`; the collection returns `{ "items": [...], "total": 42 }` and supports:

- `page_num` and `page_size`, each from 1 through 500. Invalid values fall back to 1 and 10.
- Repeated or comma-separated `filter.task_ids`.
- `filter.model` using one of the supported model identifiers.
- `filter.status`: `queued`, `running`, `cancelled`, `succeeded`, `failed`, or `expired`.

An unknown model or status filter returns an empty collection rather than an error. Deleted tasks are omitted. List items use `failure_reason` for failures; the single-task response uses `error`.

## Cancel or delete

Send `DELETE /api/v3/contents/generations/tasks/{task_id}`:

- A queued task is cancelled and returns `204 No Content`.
- A succeeded, failed, or expired task is hidden and returns `204 No Content`.
- A running or already-cancelled task returns `400` and remains available.

Errors use `{ "error": { "code", "message", "type" } }`. Error codes include `InvalidParameter`, `AuthenticationError`, `PermissionDenied`, `ResourceNotFound`, `RateLimitExceeded`, and `InternalServiceError`.
