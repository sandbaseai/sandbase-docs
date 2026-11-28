---
i18nSource: efa205ed7505643c
title: รันโมเดลหรือความสามารถของ API
description: ส่งงานไปยังโมเดลหรือความสามารถของ API ของ SandBase ผ่าน endpoint การรันแบบรวม
aside: false
outline: false
apiReference:
  title: รันโมเดลหรือความสามารถของ API
  operation: Models
  method: POST
  path: /v1/run
  description: เรียกใช้โมเดลหรือความสามารถของ API ของ SandBase ที่เปิดใช้งาน ฟิลด์ของคำขอขึ้นอยู่กับแต่ละความสามารถ ให้ดู schema ของความสามารถที่เลือกจากหน้าอ้างอิงโมเดลหรือ API บนเว็บไซต์ SandBase
  groups:
    - title: Request body
      fields:
        - name: model
          type: string
          required: true
          description: ตัวระบุโมเดลเชิงตรรกะหรือความสามารถของ API ที่เปิดใช้งาน
        - name: mode
          type: auto | sync | async | stream
          required: false
          description: คำแนะนำโหมดการทำงาน `auto` จะใช้ค่าเริ่มต้นที่กำหนดไว้ของความสามารถที่เลือก ส่วนค่าอื่นต้องได้รับการรองรับจากความสามารถนั้น
        - name: stream
          type: boolean
          required: false
          description: "ขอเอาต์พุตแบบสตรีมเมื่อความสามารถที่เลือกรองรับ เทียบเท่ากับ `mode: stream`"
        - name: webhook_url
          type: string
          required: false
          description: HTTPS callback (ไม่บังคับ) สำหรับงานรูปภาพแบบ asynchronous ที่รองรับ
          video: null
          or audio tasks. See the Webhooks reference for validation and delivery behavior.: null
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/run \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-image-2","prompt":"A studio product photo on a clean white background"}'
  response:
    status: 200 OK or 202 Accepted
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "pending"
      }
---

<ApiReferencePage />

## การทำงานและผลลัพธ์ {#execution-and-results}

ความสามารถแบบ synchronous จะส่งคืน response ที่เสร็จสมบูรณ์ในคำขอเดิม ส่วนความสามารถแบบ asynchronous จะส่งคืน `202 Accepted` พร้อม `id` แบบทึบ ให้ poll [ดูผลการรันแบบ asynchronous](./run-get) จนกว่าสถานะจะสิ้นสุด

ฟิลด์ของคำขอและรูปแบบเอาต์พุตเฉพาะของแต่ละความสามารถจะระบุไว้ในหน้าโมเดลหรือหน้าการดำเนินการ API ที่เลือก ให้ส่งฟิลด์เหล่านั้นไว้ที่ระดับบนสุดของ JSON body โดยไม่ต้องห่อไว้ในออบเจ็กต์ `input` และอย่าคาดว่าทุกความสามารถจะรับพารามิเตอร์เหมือนกัน

## Webhook callback {#webhook-callbacks}

ตั้งค่า `webhook_url` เฉพาะสำหรับงานรูปภาพ วิดีโอ หรือเสียงแบบ asynchronous ที่รองรับเท่านั้น SandBase จะส่งเหตุการณ์สุดท้ายของการรันไปยัง endpoint HTTPS หลังจากเสร็จสิ้นหรือล้มเหลว callback นี้เป็นเพียงสัญญาณแจ้งการส่งมอบ ไม่ได้ใช้แทน `GET /v1/run/{id}` ให้ poll endpoint ของการรันต่อไปเสมอเพื่อรับสถานะที่เชื่อถือได้ และลองใหม่อย่างปลอดภัยเมื่อ callback ล่าช้าหรือซ้ำ response ของโมเดลแบบ synchronous และ endpoint แบบ native ของผู้ให้บริการไม่ได้ใช้ฟิลด์ callback นี้
