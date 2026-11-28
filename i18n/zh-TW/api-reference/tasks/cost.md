---
i18nSource: 6f238c169e0f931d
title: 取得任務費用
description: 取得由同一個 API 金鑰所建立之近期任務的結算狀態、最終費用與 token 用量。
aside: false
outline: false
apiReference:
  title: 取得任務費用
  operation: Tasks
  method: GET
  path: /v1/tasks/{task_id}/cost
  description: 取得近期 SandBase 任務的非同步結算狀態、最終費用與 token 用量。
  groups:
    - title: 路徑參數
      fields:
        - name: task_id
          type: string
          required: true
          description: 由計費操作回傳的不透明任務 ID，包括存在時的 x-task-id 回應標頭。
    - title: 回應
      fields:
        - name: settled
          type: boolean
          required: true
          description: 最終費用結算是否已完成。在其為 true 之前，cost 都不是最終值。
        - name: cost · estimated_cost
          type: string
          required: true
          description: 以美元計算的金額，保留六位小數。estimated_cost 是結算前盡力提供的參考值。
        - name: usage
          type: object
          required: true
          description: 此任務記錄的 token 數量。
        - name: pricing
          type: object
          required: false
          description: 結算後若有記錄折扣：original_cost、discount_amount、discount_percent，以及選填的 discount_type。original_cost 減去 discount_amount 等於 cost。
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
