---
title: Google Gemini Interactions
description: Create, stream, and poll model Interactions through the native Google protocol.
aside: false
outline: false
apiReference:
  title: Google Gemini Interactions
  operation: Gemini
  method: POST
  path: /v1beta/interactions
  description: Create a native Google Interaction. Check status even on HTTP 200; an in_progress response must be polled.
  groups:
    - title: Request body
      fields:
        - { name: model, type: string, required: true, description: Logical SandBase model name. }
        - { name: input, type: string | object | array, required: true, description: Native Google Interaction input. }
        - { name: stream, type: boolean, required: false, description: Return Google Interactions SSE events when supported by the model. }
        - { name: background, type: boolean, required: false, description: Submit durably and return an immediately pollable Interaction. Cannot be combined with stream. }
        - { name: previous_interaction_id, type: string, required: false, description: Continue from an upstream Interaction while preserving provider affinity. }
        - { name: store, type: boolean, required: false, description: Forward the upstream storage preference unchanged. }
        - { name: system_instruction, type: string, required: false, description: Native system instruction. }
        - { name: tools, type: array, required: false, description: Native Google tool definitions. }
        - { name: generation_config, type: object, required: false, description: Native generation configuration. }
        - { name: response_format, type: object | array, required: false, description: Requested response format. }
        - { name: response_modalities, type: array, required: false, description: Requested output modalities. }
  examples:
    - label: Background request
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1beta/interactions \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "google/gemini-omni-flash-preview",
            "input": "A red ball rolls across a table, 3 seconds.",
            "background": true,
            "response_format": {"type": "video"}
          }'
  response:
    status: 200 OK
    code: |-
      {
        "id": "job_75b74acd12534b01baba820b",
        "object": "interaction",
        "model": "google/gemini-omni-flash-preview",
        "status": "in_progress"
      }
---

<ApiReferencePage />

## Authentication

Use `x-goog-api-key`, `Authorization: Bearer …`, or the `key` query parameter, in that priority order. Prefer a header because query-string credentials can be logged.

## Success and polling

Successful submissions return HTTP `200`, including background work and synchronous requests whose bounded wait expires. Always inspect `status`:

- `completed`, `failed`, `cancelled`, and `incomplete` are terminal.
- `in_progress` is still running. Poll `GET /v1beta/interactions/{id}`; the response can also include that path in the `Location` header.
- `requires_action` is a protocol status, but SandBase does not currently expose the tool-confirmation endpoint needed to advance it.

The polling ID is the upstream Interaction `id` returned by `POST`, not a SandBase prediction ID. The same SandBase API key that created the Interaction must retrieve it.

```bash
curl https://api.sandbase.ai/v1beta/interactions/job_75b74acd12534b01baba820b \
  -H "x-goog-api-key: $SANDBASE_API_KEY"
```

Non-terminal GET responses omit partial output and usage. Terminal responses can include inline image, audio, or video data and may be several megabytes. Download and persist required media promptly: after upstream retention expires, SandBase can return only a lossy terminal fallback with structure and metadata, not the original media bytes.

## Streaming

Set `stream: true` in the request body. The response is `text/event-stream`; `?alt=sse` is not used by this protocol. Event and delta types are open-ended and are forwarded without a fixed allowlist, so clients should tolerate unknown values. Once streaming headers have been written, failures arrive as an `error` event rather than a different HTTP status.

Streaming is model-dependent. An upstream provider can reject `stream: true` even though the protocol supports it.

## Current limits

SandBase currently exposes only create and get:

- Agent Interactions are rejected; use `model`.
- `background: true` and `stream: true` cannot be combined.
- Interaction list, delete, and cancel are not exposed.
- URI delivery and GET-based stream reconnection are not exposed.
- `previous_interaction_id` requires a live provider-affinity mapping and upstream support. SandBase fails instead of silently switching providers when affinity is unavailable.

Errors use the Google envelope `{ "error": { "code", "message", "status" } }`. Treat the HTTP status as stable; sanitized upstream text in `message` can change.
