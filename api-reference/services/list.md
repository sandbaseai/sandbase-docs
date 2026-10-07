---
title: List Services
description: List Services with offset pagination.
aside: false
outline: false
apiReference:
  title: List Services
  operation: Services
  method: GET
  path: /v1/services
  description: List definitions with offset pagination.
  groups:
    - title: Query parameters
      fields:
        - name: status
          type: string
          required: false
          description: active, paused, archived, or all. Other values return 400.
          default: active
        - name: agent_id
          type: string
          required: false
          description: Only definitions bound to this Agent.
        - name: limit
          type: integer
          required: false
          description: Page size up to 100; values above 100 return 400, and 0 or non-numeric values fall back to 20.
          default: "20"
        - name: offset
          type: integer
          required: false
          description: Number of records to skip.
          default: "0"
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET "https://api.sandbase.ai/v1/services?status=active&limit=20" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "GET",
            "https://api.sandbase.ai/v1/services?status=active&limit=20",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/services?status=active&limit=20', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
          },
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "data": [
          {
            "id": "svc_2d7a9e14-6b3c-5f8d-a1e2-4c6b8d0f3a95",
            "kind": "service",
            "name": "Weekly brief",
            "description": "",
            "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            "agent_version": 3,
            "input": "Summarize this week in AI agents.",
            "status": "active",
            "row_version": 1,
            "created_at": "2026-10-06T08:00:00Z",
            "updated_at": "2026-10-06T08:00:00Z"
          }
        ],
        "total": 1,
        "limit": 20,
        "offset": 0
      }
---

<ApiReferencePage />
