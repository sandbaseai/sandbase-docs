---
i18nSource: b5cf676d897d17a3
title: สร้าง Response
description: สร้าง response ของโมเดลที่เข้ากันได้กับ OpenAI รวมถึงคำขอแบบสตรีมมิงและคำขอที่ใช้เครื่องมือ
aside: false
outline: false
apiReference:
  title: สร้าง Response
  operation: Inference
  method: POST
  path: /v1/responses
  description: สร้าง response ของโมเดลที่เข้ากันได้กับ OpenAI โดย SandBase จะคงฟิลด์ของคำขอไว้หลังการแมปโมเดล แล้วกรอง response ให้เหลือเฉพาะฟิลด์สาธารณะของ OpenAI
  signature: client.responses.create(params)
  groups:
    - title: Request body
      schema: ResponseCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: ตัวระบุโมเดลจาก Models API
        - name: input
          type: string | object[]
          required: false
          description: ข้อความ รายการข้อความ หรืออินพุตอื่นที่โมเดลและผู้ให้บริการที่เลือกรองรับ
        - name: instructions
          type: string
          required: false
          description: คำสั่งระดับ system หรือ developer สำหรับ response
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: ส่งคืน Server-Sent Events ที่เข้ากันได้กับ OpenAI
        - name: background
          type: boolean
          required: false
          description: ขอให้ทำงานเบื้องหลังเมื่อผู้ให้บริการที่เลือกรองรับ
        - name: include
          type: string[]
          required: false
          description: ข้อมูล response สาธารณะเพิ่มเติมที่จะรวมไว้เมื่อรองรับ
        - name: max_output_tokens
          type: integer
          required: false
          description: จำนวนโทเค็นที่สร้างได้สูงสุด
        - name: max_tool_calls
          type: integer
          required: false
          description: จำนวนการเรียกเครื่องมือในตัวสูงสุดเมื่อรองรับ
        - name: metadata
          type: object
          required: false
          description: metadata ของคำขอที่ส่งต่อไปยังผู้ให้บริการ
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: อนุญาตให้โมเดลที่รองรับเรียกเครื่องมือแบบขนาน
        - name: previous_response_id
          type: string
          required: false
          description: response ก่อนหน้าที่จะทำต่อเมื่อเส้นทางที่เลือกรองรับ
        - name: reasoning
          type: object
          required: false
          description: การกำหนดค่า reasoning สำหรับโมเดลที่รองรับ
        - name: store
          type: boolean
          required: false
          description: ขอให้ผู้ให้บริการจัดเก็บ response เมื่อรองรับ
        - name: text
          type: object
          required: false
          description: การกำหนดค่าเอาต์พุตข้อความและรูปแบบที่มีโครงสร้าง
        - name: tool_choice
          type: string | object
          required: false
          description: ควบคุมการเลือกเครื่องมือ
        - name: tools
          type: object[]
          required: false
          description: เครื่องมือที่โมเดลใช้ได้
        - name: truncation
          type: string
          required: false
          description: พฤติกรรมการตัดทอนอินพุต
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/responses \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-5.2","input":"Explain immutable infrastructure in one sentence."}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.responses.create(
            model="openai/gpt-5.2",
            input="Explain immutable infrastructure in one sentence.",
        )
        print(response.output_text)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.responses.create({
          model: "openai/gpt-5.2",
          input: "Explain immutable infrastructure in one sentence.",
        });
        console.log(response.output_text);
  response:
    status: 200 OK
    code: |-
      {
        "id": "resp_01...",
        "object": "response",
        "status": "completed",
        "model": "openai/gpt-5.2",
        "output": [],
        "usage": {
          "input_tokens": 18,
          "output_tokens": 12,
          "total_tokens": 30,
          "input_tokens_details": {"cached_tokens": 0},
          "output_tokens_details": {"reasoning_tokens": 0}
        }
      }
  notes:
    - title: ความเข้ากันได้ของคำขอ
      description: SandBase จะเขียน model ใหม่เป็นโมเดลต้นทางที่เลือก และคงฟิลด์อื่นของคำขอไว้ ทั้งนี้การรองรับยังแตกต่างกันไปตามผู้ให้บริการ
    - title: Response ที่ผ่านการกรอง
      description: ส่งคืนเฉพาะฟิลด์ response สาธารณะของ OpenAI และการใช้โทเค็น ข้อมูลการเรียกเก็บเงิน บัญชี การกำหนดเส้นทางของผู้ให้บริการ และส่วนขยายระดับบนสุดที่ไม่รู้จักจะถูกลบออก ส่วนเนื้อหาของรายการเอาต์พุตจะคงไว้
    - title: การสตรีม
      description: เหตุการณ์ SSE แบบสาธารณะ response.* และ error จะถูกกรองและส่งต่อ เหตุการณ์ส่วนตัวที่ไม่รู้จักจะถูกทิ้ง และข้อมูลที่มีรูปแบบไม่ถูกต้องจะทำให้สตรีมปิดลงแทนการส่งต่อเนื้อหาที่ไม่ปลอดภัย
  errors:
    - status: "400"
      description: JSON ไม่ถูกต้อง ไม่มี model หรือคำขอไปยังผู้ให้บริการไม่ถูกต้อง
    - status: "401"
      description: ไม่มี API key หรือ API key ไม่ถูกต้อง
    - status: "402"
      description: ถึงขีดจำกัดการใช้จ่ายขององค์กรหรือ API Key แล้ว
    - status: "403"
      description: ถูกปฏิเสธเนื่องจากขอบเขตของ API key หรือสิทธิ์ฝั่งต้นทาง
    - status: "413"
      description: ผู้ให้บริการต้นทางปฏิเสธคำขอเนื่องจากมีขนาดใหญ่เกินไป
    - status: "500"
      description: วงจรชีวิตของ prediction หรือการค้นหาองค์กรล้มเหลว
    - status: "502"
      description: ไม่สามารถแยกวิเคราะห์และกรอง response จากต้นทางได้อย่างปลอดภัย
    - status: "503"
      description: การกำหนดเส้นทางล้มเหลว หรือใช้ผู้ให้บริการที่เป็นตัวเลือกจนหมดแล้ว
---

<ApiReferencePage />
