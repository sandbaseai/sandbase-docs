---
i18nSource: 6f238c169e0f931d
title: Получить стоимость задачи
description: Получение статуса расчёта, итоговой стоимости и использования токенов для недавней задачи, созданной тем же API-ключом.
aside: false
outline: false
apiReference:
  title: Получить стоимость задачи
  operation: Tasks
  method: GET
  path: /v1/tasks/{task_id}/cost
  description: Получение статуса асинхронного расчёта, итоговой стоимости и использования токенов для недавней задачи SandBase.
  groups:
    - title: Параметры пути
      fields:
        - name: task_id
          type: string
          required: true
          description: Непрозрачный ID задачи, возвращаемый платной операцией, в том числе в заголовке ответа x-task-id, если он присутствует.
    - title: Ответ
      fields:
        - name: settled
          type: boolean
          required: true
          description: Завершён ли итоговый расчёт стоимости. Пока значение не true, cost не окончательна.
        - name: cost · estimated_cost
          type: string
          required: true
          description: Суммы в USD с шестью знаками после запятой. estimated_cost — ориентировочное значение до расчёта.
        - name: usage
          type: object
          required: true
          description: Количество токенов, записанное для задачи.
        - name: pricing
          type: object
          required: false
          description: "После расчёта, если была учтена скидка: original_cost, discount_amount, discount_percent и необязательный discount_type. original_cost минус discount_amount равно cost."
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
