---
title: Get Schedule Run by ID
description: Retrieve one DeploymentRun directly by its drun_* ID without supplying a Schedule ID.
aside: false
outline: false
apiReference:
  title: Get Schedule Run by ID
  operation: Schedules
  method: GET
  path: /v1/deployment_runs/{id}
  description: Retrieve one organization-owned DeploymentRun directly by ID.
  groups:
    - title: Path parameters
      fields:
        - { name: id, type: string, required: true, description: DeploymentRun identifier beginning with drun_. }
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/deployment_runs/drun_01... \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  notes:
    - title: Direct lookup
      description: Use this route when you already have the drun_* ID. The nested /v1/deployments/{deployment_id}/runs/{drun_id} route additionally verifies the owning Schedule.
---

<ApiReferencePage />
