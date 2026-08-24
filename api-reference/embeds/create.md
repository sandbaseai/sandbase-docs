---
title: Create Embed Config
description: Create a web chat widget configuration for an Agent and Environment.
aside: false
outline: false
apiReference:
  title: Create Embed Config
  operation: Embed Configs
  method: POST
  path: /v1/embeds
  description: Create a configuration and return its publishable browser key.
  groups:
    - title: Request body
      fields:
        - { name: agent_id, type: string, required: true, description: Eligible Agent owned by the API key organization. }
        - { name: environment_id, type: string, required: true, description: Eligible Environment owned by the same organization. }
        - { name: name, type: string, description: Management label. }
        - { name: allowed_origins, type: "string[]", description: Exact origins or hostnames. Empty or omitted permits every origin. }
        - { name: title, type: string, description: Widget title. }
        - { name: welcome_message, type: string, description: Initial visitor message. }
        - { name: theme_color, type: string, description: Widget theme color. }
        - { name: avatar_url, type: string, description: Widget avatar URL. }
        - { name: placeholder_text, type: string, description: Composer placeholder. }
  examples:
    - label: cURL
      language: bash
      code: |
        curl -X POST https://api.sandbase.ai/v1/embeds \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"agent_id":"agent_01...","environment_id":"env_01...","name":"Docs assistant","allowed_origins":["https://docs.example.com"]}'
  response:
    status: 201 Created
    code: |
      {"id":"emb_12345678-abc","agent_id":"agent_01...","environment_id":"env_01...","publishable_key":"pk-sb-emb_12345678-abc","enabled":true,"embed_code":"\u003cscript ...\u003e\u003c/script\u003e"}
---

<ApiReferencePage />
