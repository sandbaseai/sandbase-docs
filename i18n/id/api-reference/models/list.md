---
i18nSource: 0413109dd629d7d7
title: Daftar Model
description: Cantumkan model logis yang aktif dalam format daftar model yang kompatibel dengan OpenAI.
aside: false
outline: false
apiReference:
  title: Daftar Model
  operation: Models
  method: GET
  path: /v1/models
  description: Cantumkan model logis yang aktif dalam format daftar model yang kompatibel dengan OpenAI.
  groups:
    - title: Parameter query
      fields:
        - name: q
          type: string
          required: false
          description: Pencarian fuzzy pada nama model, nama tampilan, vendor, dan deskripsi.
        - name: vendor
          type: string
          required: false
          description: Filter berdasarkan vendor, misalnya OpenAI atau Anthropic.
        - name: type
          type: string
          required: false
          description: Filter berdasarkan jenis model. Default-nya llm.
        - name: order
          type: string
          required: false
          description: "Urutan pengurutan: sort_order, most-popular, newest, atau name."
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
