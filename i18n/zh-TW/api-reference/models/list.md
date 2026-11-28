---
i18nSource: 0413109dd629d7d7
title: 列出模型
description: 以 OpenAI 相容的模型清單格式列出已啟用的邏輯模型。
aside: false
outline: false
apiReference:
  title: 列出模型
  operation: Models
  method: GET
  path: /v1/models
  description: 以 OpenAI 相容的模型清單格式列出已啟用的邏輯模型。
  groups:
    - title: 查詢參數
      fields:
        - name: q
          type: string
          required: false
          description: 對模型名稱、顯示名稱、供應商與描述進行模糊搜尋。
        - name: vendor
          type: string
          required: false
          description: 依供應商篩選，例如 OpenAI 或 Anthropic。
        - name: type
          type: string
          required: false
          description: 依模型類型篩選。預設為 llm。
        - name: order
          type: string
          required: false
          description: 排序方式：sort_order、most-popular、newest 或 name。
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
