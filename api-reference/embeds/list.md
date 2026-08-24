---
title: List Embed Configs
description: List web chat widget configurations owned by the API key organization.
aside: false
outline: false
apiReference:
  title: List Embed Configs
  operation: Embed Configs
  method: GET
  path: /v1/embeds
  description: Return Embed Configs newest first, optionally filtered by Agent.
  groups:
    - title: Query parameters
      fields:
        - { name: agent_id, type: string, description: Exact Agent ID filter. }
  examples:
    - label: cURL
      language: bash
      code: |
        curl "https://api.sandbase.ai/v1/embeds?agent_id=agent_01..." \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |
      {"data":[{"id":"emb_12345678-abc","agent_id":"agent_01...","environment_id":"env_01...","enabled":true}]}
---

<ApiReferencePage />
