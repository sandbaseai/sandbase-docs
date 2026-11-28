---
i18nSource: 04f3657850b71e58
title: สร้าง Anthropic Message
description: สร้างข้อความที่เข้ากันได้กับ Anthropic ด้วยโมเดลของ SandBase
aside: false
outline: false
apiReference:
  title: สร้าง Anthropic Message
  operation: Inference
  method: POST
  path: /v1/messages
  description: สร้างข้อความผ่าน Messages endpoint ที่เข้ากันได้กับ Anthropic ของ SandBase โดย SandBase จะแมปโมเดลสำหรับผู้ให้บริการที่เลือก และคงฟิลด์คำขอและการตอบกลับที่เข้ากันได้ไว้
  signature: client.messages.create(params)
  groups:
    - title: ส่วนหัวของคำขอ
      fields:
        - name: x-api-key
          type: string
          required: false
          description: "SandBase API key รองรับ Authorization: Bearer ด้วย หากมีทั้งสองแบบ x-api-key จะมีลำดับความสำคัญสูงกว่า"
        - name: anthropic-version
          type: string
          required: false
          default: 2023-06-01
          description: เวอร์ชัน Anthropic API ที่ส่งต่อไปยังต้นทาง หากไม่ระบุ SandBase จะใช้ 2023-06-01
        - name: anthropic-beta
          type: string
          required: false
          description: ตัวระบุฟีเจอร์ beta คั่นด้วยเครื่องหมายจุลภาค ขึ้นอยู่กับความเข้ากันได้ของผู้ให้บริการ
    - title: เนื้อหาคำขอ
      schema: MessageCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: ตัวระบุโมเดลที่เข้ากันได้กับ Anthropic
        - name: messages
          type: object[]
          required: true
          description: ข้อความของ user และ assistant ที่มีข้อความหรือบล็อกเนื้อหาแบบมีชนิด
        - name: max_tokens
          type: integer
          required: true
          description: จำนวนโทเค็นเอาต์พุตสูงสุด
        - name: system
          type: string | object[]
          required: false
          description: คำสั่งระบบระดับบนสุด
        - name: temperature
          type: number
          required: false
          default: "1"
          description: อุณหภูมิการสุ่มตั้งแต่ 0 ถึง 1
        - name: top_p
          type: number
          required: false
          description: เกณฑ์ของ nucleus sampling
        - name: top_k
          type: integer
          required: false
          description: จำกัดการสุ่มไว้ที่ K โทเค็นแรก
        - name: stop_sequences
          type: string[]
          required: false
          description: ลำดับอักขระที่กำหนดเองสำหรับหยุดการสร้าง
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: ส่งคืน Server-Sent Events แบบ Anthropic
        - name: metadata
          type: object
          required: false
          description: metadata ของคำขอ รวมถึง user_id ที่ไม่บังคับ
        - name: tools
          type: object[]
          required: false
          description: นิยามเครื่องมือที่โมเดลใช้ได้
        - name: tool_choice
          type: object
          required: false
          description: ควบคุมพฤติกรรมการเลือกเครื่องมือ
        - name: thinking
          type: object
          required: false
          description: การกำหนดค่า extended thinking สำหรับโมเดลที่รองรับ
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/messages \
          -H "x-api-key: $SANDBASE_API_KEY" \
          -H "anthropic-version: 2023-06-01" \
          -H "Content-Type: application/json" \
          -d '{"model":"anthropic/claude-sonnet-4","max_tokens":256,"messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from anthropic import Anthropic

        client = Anthropic(api_key="sk-sb-...", base_url="https://api.sandbase.ai")
        message = client.messages.create(
            model="anthropic/claude-sonnet-4",
            max_tokens=256,
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(message.content[0].text)
    - label: TypeScript
      language: typescript
      code: |-
        import Anthropic from "@anthropic-ai/sdk";

        const client = new Anthropic({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai" });
        const message = await client.messages.create({
          model: "anthropic/claude-sonnet-4",
          max_tokens: 256,
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "msg_01...",
        "type": "message",
        "role": "assistant",
        "model": "anthropic/claude-sonnet-4",
        "content": [{ "type": "text", "text": "Hello! How can I help?" }],
        "stop_reason": "end_turn",
        "usage": { "input_tokens": 8, "output_tokens": 7 }
      }
  notes:
    - title: การยืนยันตัวตน
      description: "ใช้ x-api-key หรือ Authorization: Bearer หากระบุทั้งสองแบบ x-api-key จะมีลำดับความสำคัญสูงกว่า"
    - title: โปรโตคอลแบบโปร่งใส
      description: นอกเหนือจากการแมปโมเดลและกฎความเข้ากันได้ของผู้ให้บริการที่กำหนดไว้ SandBase จะส่งต่อฟิลด์คำขอที่เข้ากันได้ การตอบกลับแบบไม่สตรีม และอีเวนต์ SSE โดยไม่แปลงโปรโตคอล
    - title: ฟีเจอร์ beta
      description: anthropic-beta จะถูกส่งต่อเมื่อมีการระบุ กฎความเข้ากันได้ของผู้ให้บริการที่เป็นตัวเลือกอาจนำฟิลด์ beta ที่ไม่รองรับออก หรือข้ามผู้ให้บริการนั้นไป
  errors:
    - status: "400"
      description: เนื้อหาคำขอไม่ถูกต้องหรือฟีเจอร์ไม่รองรับ
    - status: "401"
      description: ไม่มี API key หรือ API key ไม่ถูกต้อง
    - status: "402"
      description: ถึงขีดจำกัดการใช้จ่ายขององค์กรแล้ว
    - status: "403"
      description: ถึงขีดจำกัดการใช้จ่ายของ API Key หรือสิทธิ์ขององค์กรไม่ผ่าน
    - status: "404"
      description: ไม่พบโมเดลหรือโมเดลไม่พร้อมใช้งาน
    - status: "413"
      description: ผู้ให้บริการปฏิเสธคำขอเนื่องจากมีขนาดใหญ่เกินไป
    - status: "429"
      description: เกินขีดจำกัดอัตราของผู้ให้บริการ
    - status: "500"
      description: ข้อผิดพลาดในวงจรชีวิตของ prediction หรือของผู้ให้บริการ
    - status: "502"
      description: สตรีมจากต้นทางสิ้นสุดก่อนได้เนื้อหาที่ใช้งานได้
    - status: "503"
      description: การกำหนดเส้นทางล้มเหลว หรือผู้ให้บริการที่เป็นตัวเลือกทั้งหมดไม่พร้อมใช้งาน
---

<ApiReferencePage />
