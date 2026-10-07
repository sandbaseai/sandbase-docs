---
title: Pause, Resume, or Archive Service
description: Change the lifecycle of a Service.
aside: false
outline: false
apiReference:
  title: Pause, Resume, or Archive Service
  operation: Services
  method: POST
  path: /v1/services/{service_id}/pause
  description: "POST /v1/services/{service_id}/pause, POST /v1/services/{service_id}/resume, and POST /v1/services/{service_id}/archive share this body. archived is terminal: resume after archive returns 409. Paused Services reject invocations with 409."
  groups:
    - title: Path parameters
      fields:
        - name: service_id
          type: string
          required: true
          description: Service ID (svc_ prefix).
    - title: Request body
      description: JSON object.
      fields:
        - name: row_version
          type: integer
          required: true
          description: The row_version you last read. A stale value returns 409.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/services/svc_2d7a9e14-6b3c-5f8d-a1e2-4c6b8d0f3a95/pause \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "row_version": 2
          }'
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/services/svc_2d7a9e14-6b3c-5f8d-a1e2-4c6b8d0f3a95/pause",
            headers=headers,
            json={
                "row_version": 2
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/services/svc_2d7a9e14-6b3c-5f8d-a1e2-4c6b8d0f3a95/pause', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "row_version": 2
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "id": "svc_2d7a9e14-6b3c-5f8d-a1e2-4c6b8d0f3a95",
        "kind": "service",
        "name": "Weekly brief",
        "description": "",
        "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
        "agent_version": 3,
        "input": "Summarize this week in AI agents.",
        "status": "paused",
        "row_version": 3,
        "created_at": "2026-10-06T08:00:00Z",
        "updated_at": "2026-10-06T08:00:00Z"
      }
---

<ApiReferencePage />
