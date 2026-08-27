---
title: List All Schedule Runs
description: List DeploymentRun records across all Schedules in the current organization.
aside: false
outline: false
apiReference:
  title: List All Schedule Runs
  operation: Schedules
  method: GET
  path: /v1/deployment_runs
  description: List durable DeploymentRun records across every Schedule, with optional Schedule, Agent, time, outcome, trigger, and error filters.
  groups:
    - title: Query parameters
      fields:
        - { name: deployment_id, type: string, required: false, description: Filter by the underlying Schedule Deployment ID. }
        - { name: agent_id, type: string, required: false, description: Filter by Agent ID. }
        - { name: 'created_at[gt]', type: string · RFC 3339, required: false, description: Created strictly after this timestamp. }
        - { name: 'created_at[gte]', type: string · RFC 3339, required: false, description: Created at or after this timestamp. }
        - { name: 'created_at[lt]', type: string · RFC 3339, required: false, description: Created strictly before this timestamp. }
        - { name: 'created_at[lte]', type: string · RFC 3339, required: false, description: Created at or before this timestamp. }
        - { name: has_error, type: boolean, required: false, description: Select runs with or without a recorded error. }
        - { name: trigger_type, type: 'schedule | manual[]', required: false, description: Repeat or comma-separate values. }
        - { name: status, type: 'pending | succeeded | failed[]', required: false, description: Repeat to select creation outcomes. Status is a filter but is not included in the response object. }
        - { name: limit, type: integer, required: false, default: '20', description: Page size from 1 to 1000. }
        - { name: page, type: string, required: false, description: Opaque next_page cursor from the previous response. }
  examples:
    - label: cURL
      language: bash
      code: |-
        curl "https://api.sandbase.ai/v1/deployment_runs?trigger_type=schedule&limit=20" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  notes:
    - title: API resource names
      description: The product calls these Schedule runs. The compatibility API returns DeploymentRun objects with drun_* IDs.
---

<ApiReferencePage />
