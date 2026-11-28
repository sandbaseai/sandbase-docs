---
i18nSource: 6f238c169e0f931d
title: ดึงค่าใช้จ่ายของงาน
description: ดึงสถานะการชำระยอด ค่าใช้จ่ายสุดท้าย และการใช้โทเค็นของงานล่าสุดที่สร้างด้วย API key เดียวกัน
aside: false
outline: false
apiReference:
  title: ดึงค่าใช้จ่ายของงาน
  operation: Tasks
  method: GET
  path: /v1/tasks/{task_id}/cost
  description: ดึงสถานะการชำระยอดแบบอะซิงโครนัส ค่าใช้จ่ายสุดท้าย และการใช้โทเค็นของงาน SandBase ล่าสุด
  groups:
    - title: พารามิเตอร์พาธ
      fields:
        - name: task_id
          type: string
          required: true
          description: ID งานแบบทึบที่ส่งคืนจากการดำเนินการที่มีค่าใช้จ่าย รวมถึงเฮดเดอร์การตอบกลับ x-task-id เมื่อมี
    - title: การตอบกลับ
      fields:
        - name: settled
          type: boolean
          required: true
          description: การชำระยอดค่าใช้จ่ายสุดท้ายเสร็จสมบูรณ์หรือไม่ cost จะยังไม่ใช่ค่าสุดท้ายจนกว่าค่านี้จะเป็น true
        - name: cost · estimated_cost
          type: string
          required: true
          description: จำนวนเงิน USD ทศนิยมหกตำแหน่ง estimated_cost เป็นค่าอ้างอิงโดยประมาณก่อนการชำระยอด
        - name: usage
          type: object
          required: true
          description: จำนวนโทเค็นที่บันทึกไว้สำหรับงาน
        - name: pricing
          type: object
          required: false
          description: "หลังการชำระยอด เมื่อมีการบันทึกส่วนลด: original_cost, discount_amount, discount_percent และ discount_type (ไม่บังคับ) โดย original_cost ลบ discount_amount เท่ากับ cost"
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
