---
i18nSource: 0413109dd629d7d7
title: Elenca modelli
description: Elenca i modelli logici abilitati nel formato di elenco modelli compatibile con OpenAI.
aside: false
outline: false
apiReference:
  title: Elenca modelli
  operation: Models
  method: GET
  path: /v1/models
  description: Elenca i modelli logici abilitati nel formato di elenco modelli compatibile con OpenAI.
  groups:
    - title: Parametri di query
      fields:
        - name: q
          type: string
          required: false
          description: Ricerca approssimativa su nome del modello, nome visualizzato, vendor e descrizione.
        - name: vendor
          type: string
          required: false
          description: Filtra per vendor, ad esempio OpenAI o Anthropic.
        - name: type
          type: string
          required: false
          description: Filtra per tipo di modello. Il valore predefinito è llm.
        - name: order
          type: string
          required: false
          description: "Ordinamento: sort_order, most-popular, newest o name."
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
