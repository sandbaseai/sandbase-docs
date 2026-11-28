---
i18nSource: 0413109dd629d7d7
title: Lista modeli
description: Wyświetl włączone modele logiczne w formacie listy modeli zgodnym z OpenAI.
aside: false
outline: false
apiReference:
  title: Lista modeli
  operation: Models
  method: GET
  path: /v1/models
  description: Wyświetla włączone modele logiczne w formacie listy modeli zgodnym z OpenAI.
  groups:
    - title: Parametry zapytania
      fields:
        - name: q
          type: string
          required: false
          description: Wyszukiwanie przybliżone po nazwie modelu, nazwie wyświetlanej, dostawcy i opisie.
        - name: vendor
          type: string
          required: false
          description: Filtr według dostawcy, na przykład OpenAI lub Anthropic.
        - name: type
          type: string
          required: false
          description: Filtr według typu modelu. Domyślnie llm.
        - name: order
          type: string
          required: false
          description: "Kolejność sortowania: sort_order, most-popular, newest lub name."
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
