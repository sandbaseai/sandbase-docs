---
i18nSource: 6f238c169e0f931d
title: タスクコストの取得
description: 同じ API キーで作成した最近のタスクについて、精算ステータス、最終コスト、トークン使用量を取得します。
aside: false
outline: false
apiReference:
  title: タスクコストの取得
  operation: Tasks
  method: GET
  path: /v1/tasks/{task_id}/cost
  description: 最近の SandBase タスクについて、非同期の精算ステータス、最終コスト、トークン使用量を取得します。
  groups:
    - title: パスパラメータ
      fields:
        - name: task_id
          type: string
          required: true
          description: 課金対象の操作が返した不透明なタスク ID。x-task-id レスポンスヘッダーがある場合はその値も含みます。
    - title: レスポンス
      fields:
        - name: settled
          type: boolean
          required: true
          description: 最終コストの精算が完了したかどうか。true になるまで cost は確定しません。
        - name: cost · estimated_cost
          type: string
          required: true
          description: 小数点以下 6 桁の USD 金額。estimated_cost は精算前のベストエフォートの参考値です。
        - name: usage
          type: object
          required: true
          description: タスクで記録されたトークン数。
        - name: pricing
          type: object
          required: false
          description: 精算後、割引が記録された場合：original_cost、discount_amount、discount_percent、および任意の discount_type。original_cost から discount_amount を引いた値が cost になります。
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
