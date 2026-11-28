---
i18nSource: 06feb27e20f1b7f5
title: แสดงประวัติบัญชี
description: แสดงรายการบันทึกการดำเนินการล่าสุดขององค์กรที่เป็นเจ้าของ API key
aside: false
outline: false
apiReference:
  title: แสดงประวัติบัญชี
  operation: Account
  method: GET
  path: /v1/account/history
  description: แสดงรายการบันทึกการดำเนินการล่าสุดในขอบเขตขององค์กร โดยเรียงจากใหม่สุด ข้อความแสดงข้อผิดพลาดจะถูกกรองข้อมูลที่ละเอียดอ่อนออก และจะละเว้น JSON snapshot ที่จัดเก็บไว้หากถอดรหัสไม่ได้
  groups:
    - title: พารามิเตอร์ query
      fields:
        - name: model
          type: string
          required: false
          description: ชื่อโมเดลเชิงตรรกะแบบตรงตัว
        - name: api_key_id
          type: string
          required: false
          description: ID รีซอร์สของ API Key แบบตรงตัว
        - name: type
          type: multimodal | llm | api
          required: false
          description: หมวดหมู่การดำเนินการ โดย multimodal รวมถึงรูปภาพ วิดีโอ และเสียง
        - name: status
          type: completed | failure | in_progress
          required: false
          description: สถานะการดำเนินการแบบจัดกลุ่ม
        - name: error_type
          type: string
          required: false
          description: ชนิดข้อผิดพลาดแบบตรงตัว หรือ unknown สำหรับบันทึกที่ไม่มีชนิดข้อผิดพลาด
        - name: range
          type: 1h | 24h | 7d | 30d
          required: false
          description: ช่วงเวลาสร้างแบบย้อนหลังต่อเนื่อง ค่าเริ่มต้นคือ 7d
        - name: page
          type: integer
          required: false
          description: หมายเลขหน้า เริ่มที่ 1
        - name: page_size
          type: integer
          required: false
          description: จำนวนรายการต่อหน้าตั้งแต่ 1 ถึง 100 ค่าเริ่มต้นคือ 20
        - name: request_id
          type: string
          required: false
          description: ID การดำเนินการในขอบเขตองค์กรแบบตรงตัว เมื่อกำหนดค่านี้ ตัวกรองอื่นจะถูกละเว้นและจะขอผลลัพธ์เพียงรายการเดียว
        - name: time_basis
          type: created_at | settled_at
          required: false
          description: ฐานของ timestamp สำหรับช่วงเวลาที่ระบุชัดเจน
        - name: billing_scope
          type: any | positive | token
          required: false
          description: ตัวกรองการชำระยอด โดย positive และ token ต้องใช้ time_basis=settled_at
        - name: start_at
          type: RFC 3339 timestamp
          required: false
          description: จุดเริ่มต้นของช่วงเวลา (รวมค่านี้) ใช้คู่กับ end_at
        - name: end_at
          type: RFC 3339 timestamp
          required: false
          description: จุดสิ้นสุดของช่วงเวลา (ไม่รวมค่านี้) ช่วงเวลาต้องไม่เกิน 32 วัน
        - name: latency_sample
          type: positive | terminal_positive
          required: false
          description: จำกัดตัวอย่าง latency ให้เป็นค่าบวกเท่านั้น
        - name: min_latency_ms
          type: integer
          required: false
          description: latency ขั้นต่ำเป็นมิลลิวินาที
        - name: timezone
          type: IANA time-zone name
          required: false
          description: ใช้ตรวจสอบความเข้ากันได้เท่านั้น timestamp ยังคงเป็น UTC และการค้นหาด้วย request_id แบบตรงตัวจะละเว้นพารามิเตอร์นี้
  examples:
    - label: cURL
      language: bash
      code: |-
        curl "https://api.sandbase.ai/v1/account/history?range=24h&page_size=20" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "items": [
          {
            "id": "opaque-task-id",
            "model": "openai/gpt-5.4",
            "type": "llm",
            "execution_mode": "sync",
            "status": "completed",
            "latency_ms": 842,
            "user_cost": "0.001250",
            "prompt_tokens": 120,
            "completion_tokens": 48,
            "total_tokens": 168,
            "cached_tokens": 0,
            "cache_creation_tokens": 0,
            "created_at": "2026-08-24T00:00:00Z",
            "completed_at": "2026-08-24T00:00:01Z",
            "api_key_prefix": "sk-1234567"
          }
        ],
        "total": 1,
        "page": 1,
        "page_size": 20
      }
---

<ApiReferencePage />
