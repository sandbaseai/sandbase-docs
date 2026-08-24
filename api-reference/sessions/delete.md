---
title: "Delete Session"
description: "Permanently delete a Session that is not running or rescheduling."
aside: false
outline: false
apiReference:
  title: Delete Session
  operation: Sessions
  method: DELETE
  path: /v1/sessions/{id}
  description: Permanently delete a Session. Running and rescheduling Sessions return 409; archive instead when history must be retained.
  groups:
    - title: Path parameters
      fields:
        - { name: id, type: string, required: true, description: Session ID. }
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X DELETE https://api.sandbase.ai/v1/sessions/sess_01... \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "id": "sess_01...",
        "type": "session_deleted"
      }
---

<ApiReferencePage />
