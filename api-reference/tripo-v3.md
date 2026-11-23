---
title: Tripo 3D (Tripo v3 Protocol)
description: Generate and process Tripo 3D models through the Tripo v3 task protocol on SandBase, including endpoints, model versions, polling, billing and error codes.
aside: false
outline: false
apiReference:
  title: Tripo 3D
  operation: 3D
  method: POST
  path: /tripo/v3/generation/image-to-model
  description: Submit a Tripo task. A successful submission returns code 0 and a SandBase task id in data.task_id.
  groups:
    - title: Request body
      fields:
        - { name: model, type: string, required: true, description: 'Tripo model version, for example v3.1-20260211 or P1-20260311. See Model versions.' }
        - { name: input, type: string | object, required: true, description: 'Public image URL, or an object with a url field. task_id and file_token inputs are not supported.' }
        - { name: texture, type: boolean, required: false, description: Generate texture. Tripo defaults apply when omitted. }
        - { name: pbr, type: boolean, required: false, description: 'PBR materials. Defaults to true, as on Tripo.' }
        - { name: model_seed, type: integer, required: false, description: Geometry seed. Other Tripo parameters for the endpoint are accepted unchanged. }
  examples:
    - label: Image to model
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/tripo/v3/generation/image-to-model \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "v3.1-20260211",
            "input": "https://static.sandbase.ai/examples/tripo3d/tripo/shared/front.jpg"
          }'
  response:
    status: 200 OK
    code: |-
      { "code": 0, "data": { "task_id": "158d2649-e01d-45b9-b88a-ef3c450c601c", "type": "image_to_model", "status": "queued" } }
---

<ApiReferencePage />

## Tripo guide

SandBase serves Tripo's v3 API at `https://api.sandbase.ai/tripo/v3`. Request bodies, task objects and error codes
follow the [Tripo API](https://developers.tripo3d.ai/en/docs/introduction), so an existing Tripo integration works after you
change the base URL and use a SandBase API key. Every request runs on Tripo's official channel.

The same models are also available through the [Unified Run API](/api-reference/models/run) as `tripo3d/*` models.
Use the Tripo protocol when you already have Tripo code, and `/v1/run` when you want one request shape for every
SandBase model.

Tasks are asynchronous. Submit a task, then poll `GET /tripo/v3/tasks/{task_id}` until it reaches a terminal status.

## Authentication

Send your SandBase API key as a Bearer token:

```
Authorization: Bearer $SANDBASE_API_KEY
```

Tripo API keys (`tsk_...`) are not accepted.

## Model versions

Generation endpoints take Tripo's `model` version string:

| `model` | SandBase model series |
| --- | --- |
| `v3.1-20260211` | `tripo3d/tripo-h3.1/*` |
| `v3.0-20250812` | `tripo3d/tripo-h3.0/*` |
| `v2.5-20250123` | `tripo3d/tripo-v2.5/*` |
| `P1-20260311` | `tripo3d/tripo-p1/*` |
| `P2-20260801` | `tripo3d/tripo-p2/*` |

On processing endpoints `model` is optional and selects the Tripo algorithm version. When it is omitted, Tripo's
documented default applies.

## Endpoints

| Method | Path | Tripo task type | SandBase model |
| --- | --- | --- | --- |
| `POST` | `/tripo/v3/generation/text-to-model` | `text_to_model` | `tripo3d/{series}/text-to-3d` |
| `POST` | `/tripo/v3/generation/image-to-model` | `image_to_model` | `tripo3d/{series}/image-to-3d` |
| `POST` | `/tripo/v3/generation/multiview-to-model` | `multiview_to_model` | `tripo3d/{series}/multiview-to-3d` |
| `POST` | `/tripo/v3/generation/image-to-splat` | `image_to_splat` | `tripo3d/tripo/image-to-splat` |
| `POST` | `/tripo/v3/generation/image-to-multiview` | `image_to_multiview` | `tripo3d/tripo/image-to-multiview` |
| `POST` | `/tripo/v3/models/texture` | `texture_model` | `tripo3d/tripo/texture` |
| `POST` | `/tripo/v3/models/convert` | `convert_model` | `tripo3d/tripo/convert` |
| `POST` | `/tripo/v3/mesh/segment` | `mesh_segmentation` | `tripo3d/tripo/segment` |
| `POST` | `/tripo/v3/mesh/smartsegment` | `smartsegment_image`, `smartsegment_model` | `tripo3d/tripo/smart-segment` |
| `POST` | `/tripo/v3/mesh/uv` | `mesh_uv` | `tripo3d/tripo/smart-uv` |
| `POST` | `/tripo/v3/mesh/decimate` | `highpoly_to_lowpoly` | `tripo3d/tripo/remesh` |
| `POST` | `/tripo/v3/animations/rig-check` | `animate_prerigcheck` | `tripo3d/tripo/rig-check` |
| `POST` | `/tripo/v3/animations/rig` | `animate_rig` | `tripo3d/tripo/rig` |
| `GET` | `/tripo/v3/tasks/{task_id}` | | |
| `POST` | `/tripo/v3/tasks/list` | | |
| `GET` | `/tripo/v3/account/balance` | | |

### Inputs

Inputs are public URLs. Pass a URL string, or an object with a `url` field. Processing endpoints take a 3D model URL
(for example a `.glb`) in `input` instead of a Tripo `original_model_task_id`.

- `multiview-to-model` takes `inputs` in Tripo's order: front, left, back, right. Use `""` for a missing view. The front
  view and at least one other view are required. `v2.5-20250123` needs the front and back views.
- `models/texture` takes the model in `input` and the guidance in `texture_prompt` (`text`, `image`, `images` or
  `style_image`).
- `mesh/smartsegment` takes `seg_type`: `image` with an image URL, or `model` with a model URL.

Tripo task ids and `file_token` values cannot be used as inputs yet. Requests that send them return `1004`.

### Not supported

These Tripo endpoints answer with code `2002` and a suggested alternative:

| Path | Alternative |
| --- | --- |
| `/animations/retarget` | Model `tripo3d/tripo/animate` on `/v1/run` rigs and animates a model URL in one call |
| `/mesh/complete` | Model `tripo3d/tripo/part-completion` on `/v1/run` |
| `/generation/edit-multiview` | Model `tripo3d/tripo/edit-multiview` on `/v1/run` |
| `/generation/text-to-image`, `/generation/image-to-image` | SandBase image models on `/v1/run` |
| `/models/import` | Not needed. Pass the model URL as `input` |
| `/files`, `/files/presign` | Not available. Pass a public URL as `input` |

`webhook_url` is ignored. Poll the task to get the result. Any other path under `/tripo/v3` returns `4001`.

## Quickstart

```python
import os
import time
import requests

BASE_URL = "https://api.sandbase.ai/tripo/v3"
HEADERS = {"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"}

submit = requests.post(
    f"{BASE_URL}/generation/text-to-model",
    headers=HEADERS,
    json={"model": "P1-20260311", "prompt": "A simple wooden chair"},
).json()
if submit["code"] != 0:
    raise RuntimeError(submit)
task_id = submit["data"]["task_id"]

while True:
    task = requests.get(f"{BASE_URL}/tasks/{task_id}", headers=HEADERS).json()["data"]
    if task["status"] not in ("queued", "running"):
        break
    time.sleep(5)

if task["status"] != "success":
    raise RuntimeError(f"{task.get('error_code')}: {task.get('error_message')}")
print(task["output"]["model_url"])
```

## Task status

| `status` | Meaning |
| --- | --- |
| `queued` | Accepted, waiting to start |
| `running` | Generating. `progress` is 50 |
| `success` | Done. Read `output` |
| `failed` | Tripo rejected or failed the task. Read `error_code` and `error_message` |
| `cancelled` | Ended before it finished |

### Task fields

| Field | Type | Notes |
| --- | --- | --- |
| `task_id` | string | The id returned at submit |
| `type` | string | Tripo task type, see [Endpoints](#endpoints) |
| `status` | string | See above |
| `progress` | integer | 0 while queued, 50 while running, 100 when finished |
| `output` | object | Present on `success`. Tripo field names such as `model_url`, `rendered_image_url`, `rigged_model_url`, `seg_model_url`, `riggable` and `generate_multiview_image` |
| `credits_consumed` | number | Present on `success`. The SandBase charge in credits, where 1 credit is $0.01 |
| `error_code` | integer | Present on `failed` when Tripo returned a code |
| `error_message` | string | Present on `failed` |
| `created_at`, `completed_at` | string | RFC 3339 timestamps |

Output URLs are SandBase-hosted copies of Tripo's files.

`POST /tripo/v3/tasks/list` takes `{"task_ids": [...]}` with up to 100 ids. It returns `data.tasks`, a map from id to
task object, and `data.missed`, the ids that were not found. Only Tripo tasks created with the same API key are
returned, including tasks submitted through `/v1/run`.

## Billing

Each task is charged to your SandBase balance at the price of the matching SandBase model, shown on the
[model pages](https://www.sandbase.ai/models/tripo). Tripo prices are passed through without a discount.
`GET /tripo/v3/account/balance` returns your SandBase balance in credits (1 credit = $0.01), with `frozen` always 0.

## Errors

Errors use Tripo's envelope with an HTTP error status:

```json
{ "code": 1004, "status": "error", "message": "input is required", "suggestion": "Refer to the API documentation for parameter requirements" }
```

| `code` | HTTP | Meaning |
| --- | --- | --- |
| `2` | 401 | No API key |
| `1002` | 401 / 403 | Invalid, expired or unauthorized API key, or the request IP is not on the key's allowlist |
| `1003` | 400 | The body is not valid JSON or not a JSON object |
| `1004` | 400 | A parameter is missing or invalid. `message` names the Tripo field |
| `1007` | 429 | Rate limit reached |
| `2000` | 429 | Concurrency limit reached. Try again later |
| `2001` | 404 | Task not found, or it belongs to another API key |
| `2002` | 400 | The endpoint or feature is not supported on SandBase |
| `2010` | 403 | Insufficient SandBase balance or API key spending limit reached |
| `4001` | 404 | Unknown endpoint |
| `1000` | 500 | Internal error |

When Tripo rejects or fails a task, the task ends as `failed` and carries Tripo's code in `error_code`. Codes that
describe your request or content (`1003`, `1004`, `2002`, `2003`, `2004`, `2006`, `2008`, `2015`, `2018`) are passed
through with Tripo's message. Codes about the upstream Tripo account are reported as `1000`. See
[Tripo error codes](https://developers.tripo3d.ai/en/docs/error-handling) for their meanings.
