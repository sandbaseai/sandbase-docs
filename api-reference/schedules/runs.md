---
title: List Schedule Runs
description: List and inspect Schedule Runs.
aside: false
outline: false
apiReference:
  title: List Schedule Runs
  operation: Schedules
  method: GET
  path: /v1/schedules/{schedule_id}/runs
  description: "List Runs with offset pagination (limit 1-100). Read one Run with GET /v1/schedules/{schedule_id}/runs/{run_id}; Schedule Run reads are read-only and status advances in the background. Request cancellation of a pending Run with POST /v1/schedules/{schedule_id}/runs/{run_id}/cancel (Idempotency-Key required, body {}). Cancel only reaches a Run whose Session has started: while session_id is null it returns 409 conflict, and while the Run input is still being delivered it returns 409 session_input_pending; in that state the Run may not be cancellable, so wait for it to finish. Cancelling a Run that has already finished returns 202 with the unchanged Run. Read notification deliveries with GET /v1/schedules/{schedule_id}/runs/{run_id}/notifications."
  groups:
    - title: Path parameters
      fields:
        - name: schedule_id
          type: string
          required: true
          description: Schedule ID (sch_ prefix).
    - title: Query parameters
      fields:
        - name: limit
          type: integer
          required: false
          description: Page size up to 100; values above 100 return 400, and 0 or non-numeric values fall back to 20.
          default: "20"
        - name: offset
          type: integer
          required: false
          description: Number of records to skip.
          default: "0"
    - title: Run object
      description: Returned by every Run operation.
      fields:
        - name: status
          type: string
          required: true
          description: pending, succeeded, failed, or cancelled; skipped when a scheduled tick finds a pending Run (error_code concurrency_limit).
        - name: session_id
          type: string · null
          required: true
          description: Session created for the Run; null until it exists.
        - name: error_code
          type: string
          required: false
          description: Set when the Run failed, for example session_creation_rejected, execution_failed, or spending_limit_exceeded.
        - name: trigger_source
          type: string
          required: true
          description: manual or scheduled.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET "https://api.sandbase.ai/v1/schedules/sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17/runs?limit=20" \
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
            "https://api.sandbase.ai/v1/schedules/sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17/runs?limit=20",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/schedules/sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17/runs?limit=20', {
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
        "data": [
          {
            "id": "run_4a6c8e0b-1d3f-5a7c-9e1b-3d5f7a9c1e24",
            "source_type": "schedule",
            "source_id": "sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17",
            "source_version": 1,
            "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            "agent_version": 3,
            "trigger_source": "scheduled",
            "status": "succeeded",
            "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            "created_at": "2026-10-06T08:05:00Z",
            "updated_at": "2026-10-06T08:05:00Z",
            "scheduled_at": "2026-10-06T01:00:00Z"
          }
        ],
        "total": 1,
        "limit": 20,
        "offset": 0
      }
---

<ApiReferencePage />
