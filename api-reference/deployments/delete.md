---
title: Delete Deployment
description: Permanently delete an eligible Deployment.
aside: false
outline: false
apiReference:
  title: Delete Deployment
  operation: Deployments
  method: DELETE
  path: /v1/deployments/{deployment_id}
  description: Permanently delete a Deployment when its current lifecycle state allows deletion.
  groups:
    - title: Path parameters
      fields:
        - name: deployment_id
          type: string
          required: true
          description: Stable Deployment identifier.
  examples:
    - label: cURL
      language: bash
      code: |
        curl -X DELETE \
          "https://api.sandbase.ai/v1/deployments/depl_01..." \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |
      {
        "id": "depl_01...",
        "deleted": true
      }
  notes:
    - title: Archive versus delete
      description: Archive a Deployment when its record should remain available. Delete is permanent and only succeeds for eligible lifecycle states.
  errors:
    - status: 401
      type: authentication_error
      description: The API key is missing or invalid.
    - status: 404
      type: not_found
      description: The Deployment does not exist.
    - status: 409
      type: conflict
      description: The Deployment cannot be deleted from its current state.
---

<ApiReferencePage />
