---
i18nSource: 0413109dd629d7d7
title: Listar modelos
description: Lista los modelos lógicos habilitados en el formato de lista de modelos compatible con OpenAI.
aside: false
outline: false
apiReference:
  title: Listar modelos
  operation: Models
  method: GET
  path: /v1/models
  description: Lista los modelos lógicos habilitados en el formato de lista de modelos compatible con OpenAI.
  groups:
    - title: Parámetros de consulta
      fields:
        - name: q
          type: string
          required: false
          description: Búsqueda aproximada por nombre de modelo, nombre visible, proveedor y descripción.
        - name: vendor
          type: string
          required: false
          description: Filtra por proveedor, por ejemplo OpenAI o Anthropic.
        - name: type
          type: string
          required: false
          description: Filtra por tipo de modelo. Por defecto, llm.
        - name: order
          type: string
          required: false
          description: "Orden: sort_order, most-popular, newest o name."
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
