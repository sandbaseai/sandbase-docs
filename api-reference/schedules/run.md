---
title: Trigger Schedule Run
description: Start a manual Schedule Run.
aside: false
outline: false
apiReference:
  title: Trigger Schedule Run
  operation: Schedules
  method: POST
  path: /v1/schedules/{schedule_id}/runs
  description: Start a manual Run now and return 202 Accepted with a pending Run (trigger_source manual). Idempotency-Key is required. input, model, and model_provider override the saved values for this Run only. Only one Run per Schedule can be pending; another trigger returns 429 concurrency_limit.
  groups:
    - title: Path parameters
      fields:
        - name: schedule_id
          type: string
          required: true
          description: Schedule ID (sch_ prefix).
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
        curl -X POST https://api.sandbase.ai/v1/schedules/sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17/runs \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: daily-digest-manual-1" \
          -H "Content-Type: application/json" \
          -d '{}'
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "daily-digest-manual-1",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/schedules/sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17/runs",
            headers=headers,
            json={},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/schedules/sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17/runs', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'daily-digest-manual-1',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 202 Accepted
    code: |-
      {
        "id": "run_4a6c8e0b-1d3f-5a7c-9e1b-3d5f7a9c1e24",
        "source_type": "schedule",
        "source_id": "sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17",
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
