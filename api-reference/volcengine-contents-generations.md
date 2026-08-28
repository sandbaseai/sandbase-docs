---
title: Volcengine Ark Contents Generations
description: Create and manage asynchronous Seedance video tasks with the Volcengine Ark native protocol.
canonical: /docs/model-api-reference/seedance-native-api/
robots: noindex,follow
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

## Full reference

The complete protocol reference lives in the
[Official Native API](/model-api-reference/seedance-native-api). It covers the supported model identifiers, the request
body rules, the task status vocabulary, usage reporting, and the error contract.

Quick orientation:

- Authenticate with `Authorization: Bearer $SANDBASE_API_KEY`. A task can only be read back by the organization **and**
  the API key that created it.
- Supported `model` values are `bytedance/seedance/2.0-official` and `bytedance/seedance/2.5-official`. Matching is exact.
- Retrieve a task with `GET /api/v3/contents/generations/tasks/{task_id}` and poll until `status` leaves `queued` and
  `running`.
