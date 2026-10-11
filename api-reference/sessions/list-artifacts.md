---
title: List Session Artifacts
description: List captured Session output artifacts with cursor pagination, opaque IDs, file sizes, and download links.
aside: false
outline: false
apiReference:
  title: List Session Artifacts
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts
  description: List immutable generated outputs for this Session. Artifact IDs are opaque, Session-scoped handles; pass the returned ID unchanged to the download endpoint. Unknown or repeated query parameters return 400.
  groups:
    - title: Path parameters
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID (ses_ prefix).
    - title: Query parameters
      fields:
        - name: limit
          type: integer
          required: false
          description: Page size from 1 to 100; invalid values return 400.
          default: "20"
        - name: order
          type: string
          required: false
          description: asc or desc.
          default: desc
        - name: after
          type: string
          required: false
          description: Artifact ID returned as last_id on the previous page. Keep the same order when continuing.
    - title: Artifact object
      fields:
        - name: object
          type: string
          required: true
          description: Always agent.session.artifact.
        - name: id
          type: string
          required: true
          description: Opaque art_ handle. Do not construct or decode it.
        - name: session_id
          type: string
          required: true
          description: Owning Session ID.
        - name: path
          type: string
          required: true
          description: Generated output path below /workspace/outputs/.
        - name: size_bytes
          type: integer
          required: true
          description: Artifact size in bytes.
        - name: created_at
          type: integer
          required: true
          description: Creation timestamp in Unix seconds.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "list",
        "data": [
          {
            "object": "agent.session.artifact",
            "id": "art_example_handle",
            "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            "path": "/workspace/outputs/report.md",
            "size_bytes": 1024,
            "created_at": 1791273600
          }
        ],
        "has_more": false,
        "first_id": "art_example_handle",
        "last_id": "art_example_handle"
      }
---

<ApiReferencePage />

The example handle is illustrative. Use the `id` returned by your own request for [Download Artifact](./download-artifact). When `has_more` is true, send `after=last_id` for the next page. `first_id` and `last_id` are null for an empty list. A separate artifact metadata GET endpoint is not exposed.
