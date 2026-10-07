---
title: Create Schedule
description: Create a Schedule with POST /v1/schedules.
aside: false
outline: false
apiReference:
  title: Create Schedule
  operation: Schedules
  method: POST
  path: /v1/schedules
  description: Create a Schedule that runs a pinned Agent version on a cron expression. Idempotency-Key is required. The model credential (model_provider, or your calling API key) is stored encrypted and used for every scheduled run.
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
          required: true
          description: Input sent on every run. Required and non-empty, up to 256 KiB.
        - name: description
          type: string
          required: false
          description: Up to 16384 characters.
        - name: model
          type: string
          required: false
          description: Default model override.
        - name: schedule
          type: object
          required: true
          description: '{"cron": "<5-field cron>", "timezone": "<IANA name>"}. timezone defaults to UTC. Seconds are not supported; an expression with no match in the next 366 days returns 400.'
        - name: model_provider
          type: object
          required: false
          description: Model credential stored encrypted for scheduled runs. Omit to store your calling API key.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/schedules \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: create-schedule-1" \
          -H "Content-Type: application/json" \
          -d '{
            "name": "Daily digest",
            "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            "input": "Summarize the previous day of AI agent news.",
            "schedule": {
              "cron": "0 9 * * 1-5",
              "timezone": "Asia/Shanghai"
            }
          }'
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "create-schedule-1",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/schedules",
            headers=headers,
            json={
                "name": "Daily digest",
                "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
                "input": "Summarize the previous day of AI agent news.",
                "schedule": {
                    "cron": "0 9 * * 1-5",
                    "timezone": "Asia/Shanghai"
                }
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/schedules', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'create-schedule-1',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "name": "Daily digest",
            "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            "input": "Summarize the previous day of AI agent news.",
            "schedule": {
              "cron": "0 9 * * 1-5",
              "timezone": "Asia/Shanghai"
            }
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 201 Created
    code: |-
      {
        "id": "sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17",
        "kind": "schedule",
        "name": "Daily digest",
        "description": "",
        "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
        "agent_version": 3,
        "input": "Summarize the previous day of AI agent news.",
        "status": "active",
        "row_version": 1,
        "schedule": {
          "cron": "0 9 * * 1-5",
          "timezone": "Asia/Shanghai"
        },
        "next_run_at": "2026-10-07T01:00:00Z",
        "created_at": "2026-10-06T08:00:00Z",
        "updated_at": "2026-10-06T08:00:00Z"
      }
---

<ApiReferencePage />
