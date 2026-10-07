---
title: List Service Runs
description: List and inspect Service Runs.
aside: false
outline: false
apiReference:
  title: List Service Runs
  operation: Services
  method: GET
  path: /v1/services/{service_id}/runs
  description: "List Runs with offset pagination (limit 1-100). Read one Run with GET /v1/services/{service_id}/runs/{run_id}, which also advances its status from the linked Session. Request cancellation of a pending Run with POST /v1/services/{service_id}/runs/{run_id}/cancel (Idempotency-Key required, body {}). Cancel only reaches a Run whose Session has started: while session_id is null it returns 409 conflict, and while the Run input is still being delivered it returns 409 session_input_pending; in that state the Run may not be cancellable, so wait for it to finish. Cancelling a Run that has already finished returns 202 with the unchanged Run. Read notification deliveries with GET /v1/services/{service_id}/runs/{run_id}/notifications."
  groups:
    - title: Path parameters
      fields:
        - name: service_id
          type: string
          required: true
          description: Service ID (svc_ prefix).
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
          description: pending, succeeded, failed, or cancelled.
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
        curl -X GET "https://api.sandbase.ai/v1/services/svc_2d7a9e14-6b3c-5f8d-a1e2-4c6b8d0f3a95/runs?limit=20" \
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
            "https://api.sandbase.ai/v1/services/svc_2d7a9e14-6b3c-5f8d-a1e2-4c6b8d0f3a95/runs?limit=20",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/services/svc_2d7a9e14-6b3c-5f8d-a1e2-4c6b8d0f3a95/runs?limit=20', {
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
            "source_type": "service",
            "source_id": "svc_2d7a9e14-6b3c-5f8d-a1e2-4c6b8d0f3a95",
            "source_version": 1,
            "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            "agent_version": 3,
            "trigger_source": "manual",
            "status": "succeeded",
            "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            "created_at": "2026-10-06T08:05:00Z",
            "updated_at": "2026-10-06T08:05:00Z"
          }
        ],
        "total": 1,
        "limit": 20,
        "offset": 0
      }
---

<ApiReferencePage />
