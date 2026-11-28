---
i18nSource: 6f238c169e0f931d
title: Obtener costo de la tarea
description: Obtén el estado de liquidación, el costo final y el uso de tokens de una tarea reciente creada con la misma API key.
aside: false
outline: false
apiReference:
  title: Obtener costo de la tarea
  operation: Tasks
  method: GET
  path: /v1/tasks/{task_id}/cost
  description: Obtén el estado de liquidación asíncrona, el costo final y el uso de tokens de una tarea reciente de SandBase.
  groups:
    - title: Parámetros de ruta
      fields:
        - name: task_id
          type: string
          required: true
          description: ID opaco de la tarea devuelto por una operación facturable, incluido el encabezado de respuesta x-task-id cuando está presente.
    - title: Respuesta
      fields:
        - name: settled
          type: boolean
          required: true
          description: Indica si la liquidación del costo final se completó. cost no es definitivo hasta que sea true.
        - name: cost · estimated_cost
          type: string
          required: true
          description: Importes en USD con seis decimales. estimated_cost es una referencia aproximada antes de la liquidación.
        - name: usage
          type: object
          required: true
          description: Recuentos de tokens registrados para la tarea.
        - name: pricing
          type: object
          required: false
          description: "Tras la liquidación, cuando se registró un descuento: original_cost, discount_amount, discount_percent y, opcionalmente, discount_type. original_cost menos discount_amount es igual a cost."
  examples:
    - label: HTTP
      language: http
      code: "Authorization: Bearer sk-YOUR_API_KEY"
    - label: cURL
      language: bash
      code: |-
        curl -sS \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          "https://api.sandbase.ai/v1/tasks/$TASK_ID/cost" | jq .
  response:
    status: 200 OK
    code: |-
      {
        "id": "f3d2e8a1-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "status": "completed",
        "settled": true,
        "currency": "USD",
        "cost": "0.001234",
        "estimated_cost": "0.001234",
        "usage": {
          "prompt_tokens": 1000,
          "completion_tokens": 200,
          "total_tokens": 1200,
          "cached_tokens": 800,
          "cache_creation_tokens": 0,
          "reasoning_tokens": 0
        }
      }
---

<ApiReferencePage />
