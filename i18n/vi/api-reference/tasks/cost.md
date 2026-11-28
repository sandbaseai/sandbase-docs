---
i18nSource: 6f238c169e0f931d
title: Lấy chi phí tác vụ
description: Lấy trạng thái quyết toán, chi phí cuối cùng và mức sử dụng token của một tác vụ gần đây do cùng API key tạo.
aside: false
outline: false
apiReference:
  title: Lấy chi phí tác vụ
  operation: Tasks
  method: GET
  path: /v1/tasks/{task_id}/cost
  description: Lấy trạng thái quyết toán bất đồng bộ, chi phí cuối cùng và mức sử dụng token của một tác vụ SandBase gần đây.
  groups:
    - title: Tham số path
      fields:
        - name: task_id
          type: string
          required: true
          description: ID tác vụ dạng chuỗi mờ do một thao tác có tính phí trả về, bao gồm cả header response x-task-id khi có.
    - title: Response
      fields:
        - name: settled
          type: boolean
          required: true
          description: Việc quyết toán chi phí cuối cùng đã hoàn tất hay chưa. cost chưa phải giá trị cuối cùng cho đến khi trường này là true.
        - name: cost · estimated_cost
          type: string
          required: true
          description: Số tiền USD với sáu chữ số thập phân. estimated_cost là giá trị tham khảo ước tính trước khi quyết toán.
        - name: usage
          type: object
          required: true
          description: Số token được ghi nhận cho tác vụ.
        - name: pricing
          type: object
          required: false
          description: "Sau khi quyết toán, nếu có ghi nhận giảm giá: original_cost, discount_amount, discount_percent và discount_type tùy chọn. original_cost trừ discount_amount bằng cost."
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
