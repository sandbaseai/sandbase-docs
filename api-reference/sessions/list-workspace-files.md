---
title: List Workspace Files
description: List current Session workspace files with path, size, and pagination. This read-only endpoint returns file metadata.
aside: false
outline: false
apiReference:
  title: List Workspace Files
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/workspace-files
  description: List current file paths and sizes in one Session workspace directory. This is a metadata-only listing, not attachment history or artifact content. Unknown or repeated query parameters return 400.
  groups:
    - title: Path parameters
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID (ses_ prefix).
    - title: Query parameters
      fields:
        - name: path
          type: string
          required: false
          description: Absolute directory /workspace or a normalized directory below it. Maximum 4096 bytes; no traversal, backslashes, or trailing slash.
          default: /workspace
        - name: limit
          type: integer
          required: false
          description: Page size from 1 to 100.
          default: "20"
        - name: order
          type: string
          required: false
          description: "Path sort order: asc or desc."
          default: asc
        - name: page
          type: string
          required: false
          description: Opaque next value from the previous response. Omit on the first page; do not send an empty string. Keep path, order, and limit unchanged.
    - title: Response fields
      fields:
        - name: object
          type: string
          required: true
          description: Always page.
        - name: data
          type: array
          required: true
          description: Current directory files, each with path and size_bytes. This is not a recursive listing.
        - name: next
          type: string | null
          required: true
          description: Pass this value as page to continue; null at the end.
        - name: has_more
          type: boolean
          required: true
          description: Whether another page is available.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "page",
        "data": [
          {
            "path": "/workspace/notes.md",
            "size_bytes": 1024
          }
        ],
        "next": null,
        "has_more": false
      }
---

<ApiReferencePage />

Workspace reads can return `workspace_provisioning`, `workspace_environment_missing`, `workspace_cursor_invalid`, or `workspace_unavailable`. If the cursor is invalid, restart from the first page. Use [Artifacts](./list-artifacts) to find downloadable generated outputs.
