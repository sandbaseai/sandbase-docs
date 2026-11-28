---
i18nSource: 6f238c169e0f931d
title: 获取任务费用
description: 获取由同一 API 密钥创建的近期任务的结算状态、最终费用和 token 用量。
aside: false
outline: false
apiReference:
  title: 获取任务费用
  operation: Tasks
  method: GET
  path: /v1/tasks/{task_id}/cost
  description: 获取近期 SandBase 任务的异步结算状态、最终费用和 token 用量。
  groups:
    - title: 路径参数
      fields:
        - name: task_id
          type: string
          required: true
          description: 计费操作返回的不透明任务 ID，包括 x-task-id 响应头中返回的 ID（如有）。
    - title: 响应
      fields:
        - name: settled
          type: boolean
          required: true
          description: 最终费用结算是否已完成。在其为 true 之前，cost 不是最终值。
        - name: cost · estimated_cost
          type: string
          required: true
          description: 美元金额，保留六位小数。estimated_cost 是结算前尽力给出的参考值。
        - name: usage
          type: object
          required: true
          description: 该任务记录的 token 数量。
        - name: pricing
          type: object
          required: false
          description: 结算后若记录了折扣：original_cost、discount_amount、discount_percent，以及可选的 discount_type。original_cost 减去 discount_amount 等于 cost。
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
