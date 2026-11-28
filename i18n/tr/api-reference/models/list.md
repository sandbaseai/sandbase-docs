---
i18nSource: 0413109dd629d7d7
title: Modelleri Listeleme
description: Etkin mantıksal modelleri OpenAI uyumlu model listesi biçiminde listeleyin.
aside: false
outline: false
apiReference:
  title: Modelleri Listeleme
  operation: Models
  method: GET
  path: /v1/models
  description: Etkin mantıksal modelleri OpenAI uyumlu model listesi biçiminde listeler.
  groups:
    - title: Sorgu parametreleri
      fields:
        - name: q
          type: string
          required: false
          description: Model adı, görünen ad, sağlayıcı ve açıklama üzerinde bulanık arama.
        - name: vendor
          type: string
          required: false
          description: Sağlayıcıya göre filtreleyin, örneğin OpenAI veya Anthropic.
        - name: type
          type: string
          required: false
          description: Model türüne göre filtreleyin. Varsayılan llm'dir.
        - name: order
          type: string
          required: false
          description: "Sıralama düzeni: sort_order, most-popular, newest veya name."
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
