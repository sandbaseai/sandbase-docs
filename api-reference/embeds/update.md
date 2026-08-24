---
title: Update Embed Config
description: Partially update appearance, origin, or enabled settings.
aside: false
outline: false
apiReference:
  title: Update Embed Config
  operation: Embed Configs
  method: PATCH
  path: /v1/embeds/{id}
  description: Update mutable widget settings. Omitted fields and null preserve their current values; an empty allowed_origins array clears the allowlist.
  groups:
    - title: Path parameters
      fields:
        - { name: id, type: string, required: true, description: Embed Config ID. }
    - title: Request body
      fields:
        - { name: name, type: string, description: Management label. }
        - { name: allowed_origins, type: "string[]", description: "Exact origins or hostnames. Send [] to allow every origin." }
        - { name: title, type: string, description: Widget title. }
        - { name: welcome_message, type: string, description: Initial visitor message. }
        - { name: theme_color, type: string, description: Widget theme color. }
        - { name: avatar_url, type: string, description: Widget avatar URL. }
        - { name: placeholder_text, type: string, description: Composer placeholder. }
        - { name: enabled, type: boolean, description: Whether the widget accepts new use. }
  examples:
    - label: cURL
      language: bash
      code: |
        curl -X PATCH https://api.sandbase.ai/v1/embeds/emb_12345678-abc \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"title":"Ask our docs","enabled":true}'
---

<ApiReferencePage />
