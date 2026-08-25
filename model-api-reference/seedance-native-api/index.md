---
title: Seedance Native API
description: Submit Seedance video tasks with the Volcengine Ark Contents Generations native task protocol, using your SandBase API key.
---

# Seedance Native API

This module documents the Volcengine Ark **Contents Generations** task protocol as exposed by SandBase. If you already
have client code written against Ark's `POST /api/v3/contents/generations/tasks`, point it at
`https://api.sandbase.ai`, swap in a SandBase API key, and set `model` to a supported SandBase model name. The request
and response shapes stay the same.

The models listed below are available through this protocol only. They are not part of the general model catalog and do
not accept the standard generation request shape.

## Authentication

```
Authorization: Bearer $SANDBASE_API_KEY
```

Bearer is the only accepted credential form. `x-api-key` headers and query-string credentials are rejected with `401`.

A task can only be read back by the same organization **and** the same API key that created it. A second key in the same
organization cannot see the first key's tasks.

## Supported models

Send one of these exact values in the request body's `model` field:

| `model` | Capability |
| --- | --- |
| `bytedance/seedance/2.0-official` | Text, image, and reference to video |
| `bytedance/seedance/2.5-official` | Text, image, and reference to video |

Matching is exact. There is no prefix or alias resolution, and an unrecognized value returns `400` rather than falling
back to another model.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/v3/contents/generations/tasks` | Create a task |
| `GET` | `/api/v3/contents/generations/tasks/{task_id}` | Retrieve one task |

## Create a task

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.0-official",
    "content": [
      {"type": "text", "text": "A slow cinematic push across an alpine lake at sunrise"},
      {"type": "image_url", "role": "first_frame", "image_url": {"url": "https://example.com/first-frame.jpg"}}
    ],
    "duration": 5,
    "resolution": "720p",
    "ratio": "16:9",
    "generate_audio": true
  }'
```

A successful submission returns `200` with the task id only:

```json
{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }
```

Use that id for every follow-up call. It is a SandBase identifier, not the upstream task id, and it carries no
guaranteed prefix.

### Request body rules

SandBase validates the envelope and forwards the rest of the body to the model unchanged.

| Rule | Behavior |
| --- | --- |
| Root value | Must be a single JSON object. Trailing content after the object is rejected. |
| Body size | Up to 4 MiB. |
| Duplicate keys | Rejected at any nesting depth, with the offending field named in the error message. |
| `model` | Required, non-empty string, from the table above. |
| `content` | Required, non-empty array. Item shapes are validated by the model, not by SandBase. |
| `_volcengine_contents_generation` | Reserved for internal routing metadata. Sending it returns `400`. |
| Everything else | Forwarded as-is, including numeric literals. |

That last row is the important one. `duration`, `resolution`, `ratio`, `generate_audio`, and any other model-specific
field pass straight through, so their accepted values and defaults come from the model rather than from SandBase. An
out-of-range value surfaces as a `400` from the generation attempt, not as a rejection at submit time.

## Retrieve a task

```bash
curl https://api.sandbase.ai/api/v3/contents/generations/tasks/158d2649-e01d-45b9-b88a-ef3c450c601c \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "158d2649-e01d-45b9-b88a-ef3c450c601c",
  "model": "bytedance/seedance/2.0-official",
  "status": "succeeded",
  "created_at": 1787059000,
  "updated_at": 1787059150,
  "content": { "video_url": "https://media.sandbase.ai/files/158d2649.../0.mp4" },
  "usage": { "completion_tokens": 108900, "total_tokens": 108900 }
}
```

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | The task id returned at submit. |
| `model` | string | The `model` value you submitted. |
| `status` | string | See [Task status](#task-status). |
| `created_at` | integer | Unix seconds. |
| `updated_at` | integer | Unix seconds. Equals `created_at` until the task finishes. |
| `content` | object | Empty until the task succeeds. May carry `video_url`, `last_frame_url`, and `file_url`. |
| `usage` | object | See [Usage](#usage). |
| `error` | object | Present only for `failed` and `expired`. Contains `code` and `message`. |

Poll until `status` leaves `queued` and `running`.

### Task status

| `status` | Meaning |
| --- | --- |
| `queued` | Accepted, not started. |
| `running` | Generation in progress. |
| `succeeded` | Finished. `content` carries the result. |
| `failed` | Finished with an error. `error` explains why. |
| `expired` | Timed out before producing a result. |
| `cancelled` | Ended before generation started. |

## Usage

`usage` reports the token counts the model returned for the task:

| Field | Type |
| --- | --- |
| `completion_tokens` | integer |
| `total_tokens` | integer |

The object is empty while the task is still running, and stays empty if the model did not report usage for that task.
Treat it as informational: it is not a billing statement. Use the
[account history API](/api-reference/account/history) for charges.

## Errors

Every error uses the same envelope:

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

Two cases are worth separating when a submission fails:

- `400` means the request is actionable on your side. An unknown `model`, a reserved field, a malformed body, or a model
  that is not currently available to your organization all land here.
- `503` means the request was well-formed but SandBase could not complete the submission. Retry with the same body.

Errors carried inside a finished task's `error` object use the same `code` vocabulary, with `InternalServiceError` as the
fallback for anything without a more specific category.
