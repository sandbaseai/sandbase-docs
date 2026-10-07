---
title: Pause, Resume, or Archive Schedule
description: Change the lifecycle of a Schedule.
aside: false
outline: false
apiReference:
  title: Pause, Resume, or Archive Schedule
  operation: Schedules
  method: POST
  path: /v1/schedules/{schedule_id}/pause
  description: "POST /v1/schedules/{schedule_id}/pause, POST /v1/schedules/{schedule_id}/resume, and POST /v1/schedules/{schedule_id}/archive share this body. archived is terminal: resume after archive returns 409. Paused Schedules neither fire nor accept manual runs (409); resume computes the next run time from now."
  groups:
    - title: Path parameters
      fields:
        - name: schedule_id
          type: string
          required: true
          description: Schedule ID (sch_ prefix).
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
        curl -X POST https://api.sandbase.ai/v1/schedules/sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17/pause \
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
            "https://api.sandbase.ai/v1/schedules/sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17/pause",
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
        const response = await fetch('https://api.sandbase.ai/v1/schedules/sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17/pause', {
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
        "id": "sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17",
        "kind": "schedule",
        "name": "Daily digest",
        "description": "",
        "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
        "agent_version": 3,
        "input": "Summarize the previous day of AI agent news.",
        "status": "paused",
        "row_version": 3,
        "schedule": {
          "cron": "0 9 * * 1-5",
          "timezone": "Asia/Shanghai"
        },
        "created_at": "2026-10-06T08:00:00Z",
        "updated_at": "2026-10-06T08:00:00Z"
      }
---

<ApiReferencePage />
