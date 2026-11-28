---
i18nSource: 8ddefa727d909bc8
title: Google Gemini Interactions
description: สร้าง สตรีม และ poll Interaction ของโมเดลผ่านโปรโตคอล Google แบบ native
aside: false
outline: false
apiReference:
  title: Google Gemini Interactions
  operation: Gemini
  method: POST
  path: /v1beta/interactions
  description: สร้าง Google Interaction แบบ native ตรวจสอบ status เสมอแม้ได้ HTTP 200 การตอบกลับที่เป็น in_progress ต้อง poll ต่อ
  groups:
    - title: เนื้อหาคำขอ
      fields:
        - name: model
          type: string
          required: true
          description: ชื่อโมเดลเชิงตรรกะของ SandBase
        - name: input
          type: string | object | array
          required: true
          description: อินพุต Google Interaction แบบ native
        - name: stream
          type: boolean
          required: false
          description: ส่งคืนอีเวนต์ SSE ของ Google Interactions เมื่อโมเดลรองรับ
        - name: background
          type: boolean
          required: false
          description: ส่งงานแบบคงทนและส่งคืน Interaction ที่ poll ได้ทันที ใช้ร่วมกับ stream ไม่ได้
        - name: previous_interaction_id
          type: string
          required: false
          description: ทำต่อจาก Interaction ของต้นทางโดยคง provider affinity ไว้
        - name: store
          type: boolean
          required: false
          description: ส่งต่อค่ากำหนดการจัดเก็บของต้นทางโดยไม่เปลี่ยนแปลง
        - name: system_instruction
          type: string
          required: false
          description: คำสั่งระบบแบบ native
        - name: tools
          type: array
          required: false
          description: นิยามเครื่องมือของ Google แบบ native
        - name: generation_config
          type: object
          required: false
          description: การกำหนดค่าการสร้างแบบ native
        - name: response_format
          type: object | array
          required: false
          description: รูปแบบการตอบกลับที่ร้องขอ
        - name: response_modalities
          type: array
          required: false
          description: modality ของเอาต์พุตที่ร้องขอ
  examples:
    - label: Background request
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1beta/interactions \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "google/gemini-omni-flash-preview",
            "input": "A red ball rolls across a table, 3 seconds.",
            "background": true,
            "response_format": {"type": "video"}
          }'
  response:
    status: 200 OK
    code: |-
      {
        "id": "job_75b74acd12534b01baba820b",
        "object": "interaction",
        "model": "google/gemini-omni-flash-preview",
        "status": "in_progress"
      }
---

<ApiReferencePage />

## การยืนยันตัวตน {#authentication}

ใช้ `x-goog-api-key`, `Authorization: Bearer …` หรือพารามิเตอร์ query `key` ตามลำดับความสำคัญนี้ แนะนำให้ใช้ส่วนหัว เพราะข้อมูลรับรองใน query string อาจถูกบันทึกลงล็อก

## โมเดลที่รองรับ {#supported-models}

endpoint Interactions ไม่ใช่เส้นทางทั่วไปสำหรับทุกโมเดลที่ชื่อในแคตตาล็อกขึ้นต้นด้วย `google/` โมเดล
ต้องมีการแมปผู้ให้บริการที่เข้ากันได้กับ Interactions ปัจจุบัน SandBase ระบุโมเดลที่เข้ากันได้ไว้ดังนี้:

- Gemini Omni Flash Preview: `google/gemini-omni-flash-preview`
- Gemini Omni 1.1 Flash Preview: `google/gemini-omni-1.1-flash-preview`

โมเดล Google อื่นใช้ endpoint อื่น เช่น Nano Banana Pro และ Nano Banana 2 ใช้
[`/v1beta/models/{model}:generateContent`](/api-reference/gemini-generate-content) ไม่ใช่ `/v1beta/interactions` โมเดลที่ไม่รองรับจะล้มเหลว แทนที่จะถูกกำหนดเส้นทาง
ผ่านโปรโตคอล Google อื่น

## ความสำเร็จและการ poll {#success-and-polling}

การส่งที่สำเร็จจะได้ HTTP `200` รวมถึงงานเบื้องหลังและคำขอแบบซิงโครนัสที่เวลารอหมดลง ให้ตรวจสอบ `status` เสมอ:

- `completed`, `failed`, `cancelled` และ `incomplete` เป็นสถานะสิ้นสุด
- `in_progress` ยังทำงานอยู่ ให้ poll `GET /v1beta/interactions/{id}` การตอบกลับอาจมีพาธนี้ในส่วนหัว `Location` ด้วย
- `requires_action` เป็นสถานะของโปรโตคอล แต่ปัจจุบัน SandBase ยังไม่เปิด endpoint ยืนยันเครื่องมือที่จำเป็นต่อการดำเนินการต่อ

ID สำหรับ poll คือ `id` ของ Interaction จากต้นทางที่ `POST` ส่งคืน ไม่ใช่ prediction ID ของ SandBase และต้องใช้ SandBase API key เดียวกับที่สร้าง Interaction ในการดึงข้อมูล

```bash
curl https://api.sandbase.ai/v1beta/interactions/job_75b74acd12534b01baba820b \
  -H "x-goog-api-key: $SANDBASE_API_KEY"
```

การตอบกลับ GET ที่ยังไม่ถึงสถานะสิ้นสุดจะไม่มีเอาต์พุตบางส่วนและข้อมูลการใช้งาน การตอบกลับในสถานะสิ้นสุดอาจมีข้อมูลภาพ เสียง หรือวิดีโอแบบ inline และอาจมีขนาดหลายเมกะไบต์ ให้ดาวน์โหลดและจัดเก็บสื่อที่ต้องการโดยเร็ว เมื่อระยะเวลาการเก็บข้อมูลของต้นทางหมดลง SandBase จะส่งคืนได้เพียงข้อมูลสำรองสถานะสิ้นสุดที่สูญเสียข้อมูลบางส่วน ซึ่งมีโครงสร้างและ metadata แต่ไม่มีไบต์ของสื่อต้นฉบับ

## การสตรีม {#streaming}

ตั้งค่า `stream: true` ในเนื้อหาคำขอ การตอบกลับเป็น `text/event-stream` โปรโตคอลนี้ไม่ใช้ `?alt=sse` ประเภทของอีเวนต์และ delta เป็นแบบเปิดและถูกส่งต่อโดยไม่มี allowlist ตายตัว ไคลเอนต์จึงควรรองรับค่าที่ไม่รู้จัก เมื่อเขียนส่วนหัวของสตรีมแล้ว ข้อผิดพลาดจะมาเป็นอีเวนต์ `error` แทนที่จะเป็น HTTP status อื่น

การสตรีมขึ้นอยู่กับโมเดล ผู้ให้บริการต้นทางอาจปฏิเสธ `stream: true` แม้โปรโตคอลจะรองรับก็ตาม

## ข้อจำกัดปัจจุบัน {#current-limits}

ปัจจุบัน SandBase เปิดให้ใช้เฉพาะ create และ get:

- Agent Interactions จะถูกปฏิเสธ ให้ใช้ `model`
- ใช้ `background: true` และ `stream: true` ร่วมกันไม่ได้
- ไม่ได้เปิดให้ใช้ list, delete และ cancel ของ Interaction
- ไม่ได้เปิดให้ใช้การส่งผ่าน URI และการเชื่อมต่อสตรีมใหม่ผ่าน GET
- `previous_interaction_id` ต้องมีการแมป provider affinity ที่ยังใช้งานได้และต้นทางต้องรองรับ เมื่อไม่มี affinity SandBase จะล้มเหลวแทนการสลับผู้ให้บริการโดยไม่แจ้ง

ข้อผิดพลาดใช้รูปแบบของ Google `{ "error": { "code", "message", "status" } }` ให้ถือว่า HTTP status คงที่ ส่วนข้อความจากต้นทางที่ผ่านการกรองใน `message` อาจเปลี่ยนแปลงได้
