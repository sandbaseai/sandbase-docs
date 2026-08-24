---
title: Delete Embed Config
description: Permanently delete a web chat widget configuration.
aside: false
outline: false
apiReference:
  title: Delete Embed Config
  operation: Embed Configs
  method: DELETE
  path: /v1/embeds/{id}
  description: Permanently delete an Embed Config and invalidate its publishable key.
  groups:
    - title: Path parameters
      fields:
        - { name: id, type: string, required: true, description: Embed Config ID. }
  examples:
    - label: cURL
      language: bash
      code: |
        curl -X DELETE https://api.sandbase.ai/v1/embeds/emb_12345678-abc \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |
      {"id":"emb_12345678-abc","deleted":true}
---

<ApiReferencePage />
