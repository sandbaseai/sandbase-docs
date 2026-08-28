---
title: Get an asynchronous run
description: Poll a SandBase asynchronous model or API run and retrieve its current or terminal result.
aside: false
outline: false
apiReference:
  title: Get an asynchronous run
  operation: Models
  method: GET
  path: /v1/run/{id}
  description: Retrieve the current or terminal state of an asynchronous run created by POST /v1/run.
  groups:
    - title: Path parameters
      fields:
        - { name: id, type: string, required: true, description: Opaque run identifier returned by POST /v1/run. Use it exactly as returned; no prefix is guaranteed. }
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/run/opaque-run-id \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "completed",
        "outputs": [{"url":"https://media.sandbase.ai/files/result.png","content_type":"image/png"}]
      }
---

<ApiReferencePage />

## Polling

Poll every 5–10 seconds for long-running media or API tasks. Stop when `status` is `completed`, `failed`, or `timeout`. A non-terminal response may omit `outputs`; treat the run ID as opaque and do not construct a different status URL.
