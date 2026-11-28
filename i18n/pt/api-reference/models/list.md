---
i18nSource: 0413109dd629d7d7
title: Listar modelos
description: Liste os modelos lógicos habilitados no formato de lista de modelos compatível com OpenAI.
aside: false
outline: false
apiReference:
  title: Listar modelos
  operation: Models
  method: GET
  path: /v1/models
  description: Lista os modelos lógicos habilitados no formato de lista de modelos compatível com OpenAI.
  groups:
    - title: Parâmetros de consulta
      fields:
        - name: q
          type: string
          required: false
          description: Busca aproximada por nome do modelo, nome de exibição, fornecedor e descrição.
        - name: vendor
          type: string
          required: false
          description: Filtra por fornecedor, por exemplo OpenAI ou Anthropic.
        - name: type
          type: string
          required: false
          description: Filtra por tipo de modelo. O padrão é llm.
        - name: order
          type: string
          required: false
          description: "Ordenação: sort_order, most-popular, newest ou name."
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
