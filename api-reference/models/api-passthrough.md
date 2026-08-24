---
title: "API Passthrough"
description: "Invoke enabled catalog API capabilities through their vendor-qualified paths."
aside: false
outline: false
apiReference:
  title: API Passthrough
  operation: Models
  method: POST
  path: /v1/api/{vendor}/{upstream_path}
  description: Resolve an enabled catalog capability named vendor/upstream_path and execute a JSON object through the unified SandBase pipeline. GET is also supported for capabilities that use it.
  groups:
    - title: Path parameters
      fields:
        - { name: vendor, type: string, required: true, description: First capability-name segment. }
        - { name: upstream_path, type: string, required: true, description: Remaining path, including literal slash-separated segments when present. }
    - title: Request body
      fields:
        - { name: model, type: string, required: false, description: Omit to use the URL-derived vendor/path identity. If supplied, it is preserved and controls execution. }
        - { name: capability fields, type: object, required: false, description: Fields defined by the selected capability's live schema. }
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"url":"https://example.com"}'
---

<ApiReferencePage />

The URL resolves an enabled model named `vendor/upstream_path`. Use the exact vendor-qualified name returned by the [Models API](./). Nested capability names remain literal path segments rather than percent-encoded slashes.

POST accepts only a JSON object. An empty POST body is allowed and behaves like an object containing the URL-derived model. GET uses an empty body. Response fields and synchronous versus asynchronous behavior depend on the selected capability; poll asynchronous results through `GET /v1/run/{id}`.
