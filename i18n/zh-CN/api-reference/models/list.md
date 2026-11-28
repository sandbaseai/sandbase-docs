---
i18nSource: 0413109dd629d7d7
title: 列出模型
description: 以 OpenAI 兼容的模型列表格式列出已启用的逻辑模型。
aside: false
outline: false
apiReference:
  title: 列出模型
  operation: Models
  method: GET
  path: /v1/models
  description: 以 OpenAI 兼容的模型列表格式列出已启用的逻辑模型。
  groups:
    - title: 查询参数
      fields:
        - name: q
          type: string
          required: false
          description: 对模型名称、显示名称、服务商和描述进行模糊搜索。
        - name: vendor
          type: string
          required: false
          description: 按服务商过滤，例如 OpenAI 或 Anthropic。
        - name: type
          type: string
          required: false
          description: 按模型类型过滤。默认为 llm。
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
