---
title: Update Schedule Timing
description: Change the cron expression and timezone of a Schedule.
aside: false
outline: false
apiReference:
  title: Update Schedule Timing
  operation: Schedules
  method: PUT
  path: /v1/schedules/{schedule_id}/timing
  description: Replace cron and timezone with compare-and-set. Omitting model_provider keeps the stored model credential; send it to replace the credential. Archived Schedules return 409.
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
        - name: cron
          type: string
          required: true
          description: Five-field cron expression.
        - name: timezone
          type: string
          required: false
          description: IANA timezone name.
          default: UTC
        - name: model_provider
          type: object
          required: false
          description: Replacement model credential.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X PUT https://api.sandbase.ai/v1/schedules/sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17/timing \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "row_version": 3,
            "cron": "30 8 * * 1-5",
            "timezone": "Asia/Shanghai"
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
            "PUT",
            "https://api.sandbase.ai/v1/schedules/sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17/timing",
            headers=headers,
            json={
                "row_version": 3,
                "cron": "30 8 * * 1-5",
                "timezone": "Asia/Shanghai"
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/schedules/sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17/timing', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "row_version": 3,
            "cron": "30 8 * * 1-5",
            "timezone": "Asia/Shanghai"
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
        "status": "active",
        "row_version": 4,
        "schedule": {
          "cron": "30 8 * * 1-5",
          "timezone": "Asia/Shanghai"
        },
        "next_run_at": "2026-10-07T01:00:00Z",
        "created_at": "2026-10-06T08:00:00Z",
        "updated_at": "2026-10-06T08:00:00Z"
      }
---

<ApiReferencePage />
