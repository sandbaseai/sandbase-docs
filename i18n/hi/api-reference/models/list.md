---
i18nSource: 0413109dd629d7d7
title: Models की सूची
description: Enabled logical models को OpenAI-compatible model-list format में सूचीबद्ध करें।
aside: false
outline: false
apiReference:
  title: Models की सूची
  operation: Models
  method: GET
  path: /v1/models
  description: Enabled logical models को OpenAI-compatible model-list format में सूचीबद्ध करें।
  groups:
    - title: Query parameters
      fields:
        - name: q
          type: string
          required: false
          description: Model name, display name, vendor और description पर fuzzy search।
        - name: vendor
          type: string
          required: false
          description: Vendor के आधार पर filter करें, जैसे OpenAI या Anthropic।
        - name: type
          type: string
          required: false
          description: Model type के आधार पर filter करें। डिफ़ॉल्ट llm है।
        - name: order
          type: string
          required: false
          description: "Sort order: sort_order, most-popular, newest या name।"
  examples:
    - label: cURL
      language: bash
      code: |-
        curl "https://api.sandbase.ai/v1/models" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "object": "list",
        "data": [
          {
            "id": "openai/gpt-4o",
            "object": "model",
            "created": 1783353600,
            "owned_by": "openai"
          }
        ]
      }
---

<ApiReferencePage />
