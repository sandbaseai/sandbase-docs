---
i18nSource: 2ffb24dad49b9c79
title: ดึงข้อมูลการรันแบบอะซิงโครนัส
description: โพลการรันโมเดลหรือ API แบบอะซิงโครนัสของ SandBase และดึงผลลัพธ์ปัจจุบันหรือผลลัพธ์สุดท้าย
aside: false
outline: false
apiReference:
  title: ดึงข้อมูลการรันแบบอะซิงโครนัส
  operation: Models
  method: GET
  path: /v1/run/{id}
  description: ดึงสถานะปัจจุบันหรือสถานะสุดท้ายของการรันแบบอะซิงโครนัสที่สร้างโดย POST /v1/run
  groups:
    - title: พารามิเตอร์ของพาธ
      fields:
        - name: id
          type: string
          required: true
          description: ตัวระบุการรันแบบทึบที่ POST /v1/run ส่งคืน ให้ใช้ตามที่ได้รับมาทุกประการ ไม่มีการรับประกันคำนำหน้าใด ๆ
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/run/opaque-run-id \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "completed",
        "outputs": [{"url":"https://media.sandbase.ai/files/result.png","content_type":"image/png"}]
      }
---

<ApiReferencePage />

## การโพล {#polling}

โพลทุก 5–10 วินาทีสำหรับงานสื่อหรืองาน API ที่ใช้เวลานาน หยุดเมื่อ `status` เป็น `completed`, `failed` หรือ `timeout` การตอบกลับที่ยังไม่สิ้นสุดอาจไม่มี `outputs` ให้ถือว่า run ID เป็นค่าทึบ (opaque) และอย่าสร้าง URL สถานะในรูปแบบอื่น
