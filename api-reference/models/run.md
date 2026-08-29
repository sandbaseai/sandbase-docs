---
title: Run a model or API capability
description: Submit a SandBase model or API capability through the unified run endpoint.
aside: false
outline: false
apiReference:
  title: Run a model or API capability
  operation: Models
  method: POST
  path: /v1/run
  description: Execute an enabled SandBase model or API capability. The request fields are capability-specific; use the model detail page or Store for the selected capability schema.
  groups:
    - title: Request body
      fields:
        - { name: model, type: string, required: true, description: Enabled logical model or API capability identifier. }
        - { name: mode, type: 'auto | sync | async | stream', required: false, description: 'Execution mode hint. `auto` uses the selected capability''s configured default; other values require capability support.' }
        - { name: stream, type: boolean, required: false, description: 'Request streaming output when the selected capability supports it. Equivalent to `mode: stream`.' }
        - { name: webhook_url, type: string, required: false, description: Optional HTTPS callback for supported asynchronous image, video, audio, or API tasks. }
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/run \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-image-2","prompt":"A studio product photo on a clean white background"}'
  response:
    status: 200 OK or 202 Accepted
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "pending"
      }
---

<ApiReferencePage />

## Execution and results

Synchronous capabilities return a completed response in the original request. Asynchronous capabilities return `202 Accepted` with an opaque `id`; poll [Get an asynchronous run](./run-get) until the status is terminal.

Capability-specific request fields and output shapes are defined on the selected model or API operation page. Send those fields at the top level of the JSON body; do not wrap them in an `input` object. Do not assume that every capability accepts the same parameters.
