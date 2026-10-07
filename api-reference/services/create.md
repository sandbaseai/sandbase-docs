---
title: Create Service
description: Create a Service with POST /v1/services.
aside: false
outline: false
apiReference:
  title: Create Service
  operation: Services
  method: POST
  path: /v1/services
  description: "Create a Service that pins a saved Agent version. Idempotency-Key is required: the same key and body return the original Service, and a different body returns 409. schedule and model_provider are not accepted on Services."
  groups:
    - title: Headers
      fields:
        - name: Idempotency-Key
          type: string
          required: true
          description: 1-128 characters, no leading or trailing whitespace. Reuse the same key and body when retrying; the same key with a different body returns 409.
    - title: Request body
      description: Strict JSON object.
      fields:
        - name: name
          type: string
          required: true
          description: Up to 200 characters.
        - name: agent_id
          type: string
          required: true
          description: Saved Agent ID. The Agent must be active and ready.
        - name: agent_version
          type: integer
          required: false
          description: Agent version to pin. Omit to pin the current version at creation time.
        - name: input
          type: string
          required: false
          description: Default input, up to 256 KiB. Invocations without input use it; the effective input must be non-empty.
        - name: description
          type: string
          required: false
          description: Up to 16384 characters.
        - name: model
          type: string
          required: false
          description: Default model override.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/services \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: create-service-1" \
          -H "Content-Type: application/json" \
          -d '{
            "name": "Weekly brief",
            "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            "input": "Summarize this week in AI agents."
          }'
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "create-service-1",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/services",
            headers=headers,
            json={
                "name": "Weekly brief",
                "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
                "input": "Summarize this week in AI agents."
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/services', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'create-service-1',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "name": "Weekly brief",
            "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            "input": "Summarize this week in AI agents."
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 201 Created
    code: |-
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
---

<ApiReferencePage />
