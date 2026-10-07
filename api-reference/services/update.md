---
title: Update Service
description: Update a Service with compare-and-set.
aside: false
outline: false
apiReference:
  title: Update Service
  operation: Services
  method: PATCH
  path: /v1/services/{service_id}
  description: Compare-and-set update. Only name, description, agent_id, agent_version, input, and row_version are accepted; explicit null returns 400. Changing agent_id without agent_version pins that Agent's current version.
  groups:
    - title: Path parameters
      fields:
        - name: service_id
          type: string
          required: true
          description: Service ID (svc_ prefix).
    - title: Request body
      description: row_version plus any subset.
      fields:
        - name: row_version
          type: integer
          required: true
          description: The row_version you last read. A stale value returns 409.
        - name: name
          type: string
          required: false
          description: Up to 200 characters.
        - name: description
          type: string
          required: false
          description: Up to 16384 characters.
        - name: agent_id
          type: string
          required: false
          description: Rebind to another Agent.
        - name: agent_version
          type: integer
          required: false
          description: Pin a different version.
        - name: input
          type: string
          required: false
          description: New default input.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X PATCH https://api.sandbase.ai/v1/services/svc_2d7a9e14-6b3c-5f8d-a1e2-4c6b8d0f3a95 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "row_version": 1,
            "agent_version": 4
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
            "PATCH",
            "https://api.sandbase.ai/v1/services/svc_2d7a9e14-6b3c-5f8d-a1e2-4c6b8d0f3a95",
            headers=headers,
            json={
                "row_version": 1,
                "agent_version": 4
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/services/svc_2d7a9e14-6b3c-5f8d-a1e2-4c6b8d0f3a95', {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "row_version": 1,
            "agent_version": 4
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
        "agent_version": 4,
        "input": "Summarize this week in AI agents.",
        "status": "active",
        "row_version": 2,
        "created_at": "2026-10-06T08:00:00Z",
        "updated_at": "2026-10-06T08:00:00Z"
      }
---

<ApiReferencePage />
