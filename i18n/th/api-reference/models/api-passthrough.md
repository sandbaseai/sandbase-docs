---
i18nSource: fb62188053fb216d
title: API Passthrough
description: เรียกใช้ความสามารถของ API ในแคตตาล็อกที่เปิดใช้งานผ่านพาธที่ระบุผู้ให้บริการ
aside: false
outline: false
apiReference:
  title: API Passthrough
  operation: Models
  method: POST
  path: /v1/api/{vendor}/{upstream_path}
  description: ค้นหาความสามารถในแคตตาล็อกที่เปิดใช้งานซึ่งมีชื่อ vendor/upstream_path แล้วประมวลผลออบเจ็กต์ JSON ผ่านไปป์ไลน์แบบรวมศูนย์ของ SandBase รองรับ GET ด้วยสำหรับความสามารถที่ใช้ GET
  groups:
    - title: พารามิเตอร์ของพาธ
      fields:
        - name: vendor
          type: string
          required: true
          description: เซกเมนต์แรกของชื่อความสามารถ
        - name: upstream_path
          type: string
          required: true
          description: พาธที่เหลือ
          including literal slash-separated segments when present.: null
    - title: เนื้อหาคำขอ
      fields:
        - name: model
          type: string
          required: false
          description: ไม่ต้องระบุหากต้องการใช้ตัวตน vendor/path ที่ได้จาก URL หากระบุ
          it is preserved and controls execution.: null
        - name: capability fields
          type: object
          required: false
          description: ฟิลด์ที่กำหนดโดยสคีมาปัจจุบันของความสามารถที่เลือก
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"url":"https://example.com"}'
---

<ApiReferencePage />

URL จะระบุโมเดลที่เปิดใช้งานซึ่งมีชื่อ `vendor/upstream_path` ให้ใช้ชื่อที่ระบุผู้ให้บริการแบบตรงตัวตามที่ [Models API](./) ส่งคืน ชื่อความสามารถแบบซ้อนจะยังคงเป็นเซกเมนต์ของพาธตามตัวอักษร ไม่ใช่เครื่องหมายทับที่เข้ารหัสแบบ percent-encoding

POST รับเฉพาะออบเจ็กต์ JSON เท่านั้น อนุญาตให้ส่งเนื้อหา POST ว่างได้ โดยจะทำงานเหมือนออบเจ็กต์ที่มีโมเดลซึ่งได้มาจาก URL ส่วน GET ใช้เนื้อหาว่าง ฟิลด์ในการตอบกลับและการทำงานแบบซิงโครนัสหรืออะซิงโครนัสขึ้นอยู่กับความสามารถที่เลือก ให้โพลผลลัพธ์แบบอะซิงโครนัสผ่าน `GET /v1/run/{id}`
