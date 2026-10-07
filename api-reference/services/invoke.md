---
title: Invoke Service
description: Start a Service Run.
aside: false
outline: false
apiReference:
  title: Invoke Service
  operation: Services
  method: POST
  path: /v1/services/{service_id}/invoke
  description: "Start a Run and return 202 Accepted with the Run. Idempotency-Key is required: the same key and body return the original Run, a different body returns 409. Only one Run per Service can be pending; another invoke returns 429 concurrency_limit. Poll GET /v1/services/{service_id}/runs/{run_id} until status leaves pending, then read the result from the Session in session_id."
  groups:
    - title: Path parameters
      fields:
        - name: service_id
          type: string
          required: true
          description: Service ID (svc_ prefix).
    - title: Headers
      fields:
        - name: Idempotency-Key
          type: string
          required: true
          description: 1-128 characters, no leading or trailing whitespace. Reuse the same key and body when retrying; the same key with a different body returns 409.
    - title: Request body
      description: JSON object. Send {} to use the saved input.
      fields:
        - name: input
          type: string
          required: false
          description: Overrides the saved input for this Run. The effective input must be non-empty.
        - name: model
          type: string
          required: false
          description: Overrides the saved model for this Run.
        - name: model_provider
          type: object
          required: false
          description: Model credential for this Run. Omit to use your calling API key.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/services/svc_2d7a9e14-6b3c-5f8d-a1e2-4c6b8d0f3a95/invoke \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: weekly-brief-2026-w41" \
          -H "Content-Type: application/json" \
          -d '{
            "input": "Summarize this week in AI agents, focusing on open-source releases."
          }'
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "weekly-brief-2026-w41",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/services/svc_2d7a9e14-6b3c-5f8d-a1e2-4c6b8d0f3a95/invoke",
            headers=headers,
            json={
                "input": "Summarize this week in AI agents, focusing on open-source releases."
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/services/svc_2d7a9e14-6b3c-5f8d-a1e2-4c6b8d0f3a95/invoke', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'weekly-brief-2026-w41',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "input": "Summarize this week in AI agents, focusing on open-source releases."
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 202 Accepted
    code: |-
      {
        "id": "run_4a6c8e0b-1d3f-5a7c-9e1b-3d5f7a9c1e24",
        "source_type": "service",
        "source_id": "svc_2d7a9e14-6b3c-5f8d-a1e2-4c6b8d0f3a95",
        "source_version": 1,
        "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
        "agent_version": 3,
        "trigger_source": "manual",
        "status": "pending",
        "session_id": null,
        "created_at": "2026-10-06T08:05:00Z",
        "updated_at": "2026-10-06T08:05:00Z"
      }
---

<ApiReferencePage />
