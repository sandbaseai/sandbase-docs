---
i18nSource: 0413109dd629d7d7
title: แสดงรายการโมเดล
description: แสดงรายการโมเดลเชิงตรรกะที่เปิดใช้งานในรูปแบบรายการโมเดลที่เข้ากันได้กับ OpenAI
aside: false
outline: false
apiReference:
  title: แสดงรายการโมเดล
  operation: Models
  method: GET
  path: /v1/models
  description: แสดงรายการโมเดลเชิงตรรกะที่เปิดใช้งานในรูปแบบรายการโมเดลที่เข้ากันได้กับ OpenAI
  groups:
    - title: พารามิเตอร์ query
      fields:
        - name: q
          type: string
          required: false
          description: ค้นหาแบบคลุมเครือจากชื่อโมเดล ชื่อที่แสดง ผู้ให้บริการ และคำอธิบาย
        - name: vendor
          type: string
          required: false
          description: กรองตามผู้ให้บริการ เช่น OpenAI หรือ Anthropic
        - name: type
          type: string
          required: false
          description: กรองตามประเภทโมเดล ค่าเริ่มต้นคือ llm
        - name: order
          type: string
          required: false
          description: "ลำดับการเรียง: sort_order, most-popular, newest หรือ name"
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
