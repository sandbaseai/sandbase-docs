---
i18nSource: 0413109dd629d7d7
title: Liệt kê Models
description: Liệt kê các model logic đã bật theo định dạng danh sách model tương thích OpenAI.
aside: false
outline: false
apiReference:
  title: Liệt kê Models
  operation: Models
  method: GET
  path: /v1/models
  description: Liệt kê các model logic đã bật theo định dạng danh sách model tương thích OpenAI.
  groups:
    - title: Tham số query
      fields:
        - name: q
          type: string
          required: false
          description: Tìm kiếm gần đúng theo tên model, tên hiển thị, vendor và mô tả.
        - name: vendor
          type: string
          required: false
          description: Lọc theo vendor, ví dụ OpenAI hoặc Anthropic.
        - name: type
          type: string
          required: false
          description: Lọc theo loại model. Mặc định là llm.
        - name: order
          type: string
          required: false
          description: "Thứ tự sắp xếp: sort_order, most-popular, newest hoặc name."
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
