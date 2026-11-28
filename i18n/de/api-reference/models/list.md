---
i18nSource: 0413109dd629d7d7
title: Modelle auflisten
description: Listet aktivierte logische Modelle im OpenAI-kompatiblen Modelllistenformat auf.
aside: false
outline: false
apiReference:
  title: Modelle auflisten
  operation: Models
  method: GET
  path: /v1/models
  description: Listet aktivierte logische Modelle im OpenAI-kompatiblen Modelllistenformat auf.
  groups:
    - title: Query-Parameter
      fields:
        - name: q
          type: string
          required: false
          description: Unscharfe Suche über Modellname, Anzeigename, Anbieter und Beschreibung.
        - name: vendor
          type: string
          required: false
          description: Nach Anbieter filtern, zum Beispiel OpenAI oder Anthropic.
        - name: type
          type: string
          required: false
          description: Nach Modelltyp filtern. Standard ist llm.
        - name: order
          type: string
          required: false
          description: "Sortierung: sort_order, most-popular, newest oder name."
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
