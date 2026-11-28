---
i18nSource: 6f238c169e0f931d
title: Obter custo da tarefa
description: Consulte o status de liquidação, o custo final e o uso de tokens de uma tarefa recente criada pela mesma API key.
aside: false
outline: false
apiReference:
  title: Obter custo da tarefa
  operation: Tasks
  method: GET
  path: /v1/tasks/{task_id}/cost
  description: Consulte o status de liquidação assíncrona, o custo final e o uso de tokens de uma tarefa recente do SandBase.
  groups:
    - title: Parâmetros de caminho
      fields:
        - name: task_id
          type: string
          required: true
          description: ID opaco da tarefa retornado por uma operação cobrável, incluindo o header de resposta x-task-id, quando presente.
    - title: Resposta
      fields:
        - name: settled
          type: boolean
          required: true
          description: Indica se a liquidação do custo final foi concluída. cost não é final até que este valor seja true.
        - name: cost · estimated_cost
          type: string
          required: true
          description: Valores em USD com seis casas decimais. estimated_cost é uma referência aproximada antes da liquidação.
        - name: usage
          type: object
          required: true
          description: Contagens de tokens registradas para a tarefa.
        - name: pricing
          type: object
          required: false
          description: "Após a liquidação, quando um desconto foi registrado: original_cost, discount_amount, discount_percent e o opcional discount_type. original_cost menos discount_amount é igual a cost."
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
