---
title: Get Embed Config
description: Retrieve one organization-owned web chat widget configuration.
aside: false
outline: false
apiReference:
  title: Get Embed Config
  operation: Embed Configs
  method: GET
  path: /v1/embeds/{id}
  description: Retrieve one Embed Config. The publishable key is represented in embed_code and is derivable from the ID.
  groups:
    - title: Path parameters
      fields:
        - { name: id, type: string, required: true, description: Embed Config ID beginning with emb_. }
  examples:
    - label: cURL
      language: bash
      code: |
        curl https://api.sandbase.ai/v1/embeds/emb_12345678-abc \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
---

<ApiReferencePage />
