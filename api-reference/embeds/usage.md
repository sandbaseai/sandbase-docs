---
title: Get Embed Config Usage
description: Get aggregate Session, message, and visitor counts for an Embed Config.
aside: false
outline: false
apiReference:
  title: Get Embed Config Usage
  operation: Embed Configs
  method: GET
  path: /v1/embeds/{id}/usage
  description: Return all-time aggregate Session, Session Event record, and visitor counts for one organization-owned Embed Config. The Event count field is historically named message_count.
  groups:
    - title: Path parameters
      fields:
        - { name: id, type: string, required: true, description: Embed Config ID. }
  examples:
    - label: cURL
      language: bash
      code: |
        curl https://api.sandbase.ai/v1/embeds/emb_12345678-abc/usage \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |
      {"session_count":42,"message_count":318,"visitor_count":27}
---

<ApiReferencePage />
