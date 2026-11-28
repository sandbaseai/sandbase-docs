---
i18nSource: 0413109dd629d7d7
title: Lister les modèles
description: Listez les modèles logiques activés au format de liste de modèles compatible OpenAI.
aside: false
outline: false
apiReference:
  title: Lister les modèles
  operation: Models
  method: GET
  path: /v1/models
  description: Liste les modèles logiques activés au format de liste de modèles compatible OpenAI.
  groups:
    - title: Paramètres de requête
      fields:
        - name: q
          type: string
          required: false
          description: Recherche approximative sur le nom du modèle, le nom d'affichage, le fournisseur et la description.
        - name: vendor
          type: string
          required: false
          description: Filtre par fournisseur, par exemple OpenAI ou Anthropic.
        - name: type
          type: string
          required: false
          description: "Filtre par type de modèle. Par défaut : llm."
        - name: order
          type: string
          required: false
          description: "Ordre de tri : sort_order, most-popular, newest ou name."
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
