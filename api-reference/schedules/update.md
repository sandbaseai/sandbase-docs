---
title: Update Schedule
description: Update a Schedule with compare-and-set.
aside: false
outline: false
apiReference:
  title: Update Schedule
  operation: Schedules
  method: PATCH
  path: /v1/schedules/{schedule_id}
  description: Compare-and-set update. Only name, description, agent_id, agent_version, input, and row_version are accepted; explicit null returns 400. Changing agent_id without agent_version pins that Agent's current version. Change cron and timezone with PUT /v1/schedules/{schedule_id}/timing.
  groups:
    - title: Path parameters
      fields:
        - name: schedule_id
          type: string
          required: true
          description: Schedule ID (sch_ prefix).
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
        curl -X PATCH https://api.sandbase.ai/v1/schedules/sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17 \
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
            "https://api.sandbase.ai/v1/schedules/sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17",
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
        const response = await fetch('https://api.sandbase.ai/v1/schedules/sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17', {
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
        "id": "sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17",
        "kind": "schedule",
        "name": "Daily digest",
        "description": "",
        "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
        "agent_version": 4,
        "input": "Summarize the previous day of AI agent news.",
        "status": "active",
        "row_version": 2,
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
