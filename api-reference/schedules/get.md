---
title: Get Schedule
description: Read one Schedule.
aside: false
outline: false
apiReference:
  title: Get Schedule
  operation: Schedules
  method: GET
  path: /v1/schedules/{schedule_id}
  description: Read a Schedule. row_version advances after every scheduled tick, so read it right before a write.
  groups:
    - title: Path parameters
      fields:
        - name: schedule_id
          type: string
          required: true
          description: Schedule ID (sch_ prefix).
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET https://api.sandbase.ai/v1/schedules/sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17 \
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
            "https://api.sandbase.ai/v1/schedules/sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/schedules/sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17', {
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
