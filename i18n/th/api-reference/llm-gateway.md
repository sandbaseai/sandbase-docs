---
i18nSource: 9ee3d6d77d12e944
title: Chat Completions API
description: สร้าง chat completion ที่เข้ากันได้กับ OpenAI ด้วยโมเดลภาษาและโมเดลวิชันของ SandBase
aside: false
outline: false
apiReference:
  title: สร้าง Chat Completion
  operation: Inference
  method: POST
  path: /v1/chat/completions
  description: สร้าง chat completion ที่เข้ากันได้กับ OpenAI ด้วยโมเดลแชตใดก็ได้ที่ SandBase รองรับ ฟิลด์ที่เข้ากันได้กับผู้ให้บริการจะถูกคงไว้เมื่อเส้นทางที่เลือกรองรับ
  signature: client.chat.completions.create(params)
  groups:
    - title: Request body
      schema: ChatCompletionCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: ตัวระบุโมเดลจาก Models API
        - name: messages
          type: object[]
          required: true
          description: ข้อความในบทสนทนาโดยใช้บทบาทที่ผู้ให้บริการที่เลือกรองรับ ซึ่งมักเป็น system, developer, user, assistant หรือ tool
        - name: temperature
          type: number
          required: false
          default: "1"
          description: temperature สำหรับการสุ่มตั้งแต่ 0 ถึง 2
        - name: top_p
          type: number
          required: false
          default: "1"
          description: ค่าเกณฑ์ของ nucleus sampling
        - name: max_tokens
          type: integer
          required: false
          description: จำนวนโทเค็นเอาต์พุตสูงสุด
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: ส่งคืน Server-Sent Events แบบทีละส่วน
        - name: stop
          type: string | string[]
          required: false
          description: ลำดับอักขระหนึ่งรายการหรือมากกว่าที่จะหยุดการสร้าง
        - name: tools
          type: object[]
          required: false
          description: นิยามฟังก์ชันที่โมเดลใช้ได้
        - name: tool_choice
          type: string | object
          required: false
          default: auto
          description: ควบคุมว่าจะเลือกเครื่องมือหรือไม่ และเลือกเครื่องมือใด
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: อนุญาตให้โมเดลที่รองรับเรียกเครื่องมือหลายรายการใน turn เดียว
        - name: user
          type: string
          required: false
          description: ตัวระบุผู้ใช้ปลายทางที่เข้ากันได้กับผู้ให้บริการ
        - name: response_format
          type: object
          required: false
          description: การกำหนดค่าเอาต์พุตเป็นออบเจ็กต์ JSON หรือ JSON Schema
        - name: reasoning_effort
          type: string
          required: false
          description: การตั้งค่าระดับการให้เหตุผลที่เข้ากันได้กับผู้ให้บริการ
        - name: reasoning
          type: object
          required: false
          description: การกำหนดค่าการให้เหตุผล เช่น effort หรือ max_tokens
        - name: thinking
          type: object
          required: false
          description: การกำหนดค่าการคิด เช่น type หรือ budget_tokens
        - name: extra_body
          type: object
          required: false
          description: พารามิเตอร์เฉพาะผู้ให้บริการสำหรับเส้นทางที่ต้องแปลงโปรโตคอล
        - name: n
          type: integer
          required: false
          default: "1"
          description: จำนวนตัวเลือก completion ที่จะสร้าง
        - name: presence_penalty
          type: number
          required: false
          default: "0"
          description: presence penalty ตั้งแต่ -2 ถึง 2
        - name: frequency_penalty
          type: number
          required: false
          default: "0"
          description: frequency penalty ตั้งแต่ -2 ถึง 2
        - name: stream_options
          type: object
          required: false
          description: ตัวเลือกการสตรีม เช่น include_usage
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/chat/completions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"deepseek/deepseek-v4-flash","messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(response.choices[0].message.content)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.chat.completions.create({
          model: "deepseek/deepseek-v4-flash",
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(response.choices[0].message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "chatcmpl_01...",
        "object": "chat.completion",
        "model": "deepseek/deepseek-v4-flash",
        "choices": [{
          "index": 0,
          "message": { "role": "assistant", "content": "Hello! How can I help?" },
          "finish_reason": "stop"
        }],
        "usage": { "prompt_tokens": 8, "completion_tokens": 7, "total_tokens": 15 }
      }
  notes:
    - title: การสตรีมและเครื่องมือ
      description: "ตั้ง stream เป็น true เพื่อใช้ SSE โดยสตรีมจะจบด้วย data: [DONE] เพิ่ม stream_options.include_usage เพื่อรับ chunk การใช้งานสุดท้าย การเรียกเครื่องมือและเนื้อหาแบบมัลติโมดัลเป็นไปตาม schema ที่เข้ากันได้กับ OpenAI"
    - title: ความเข้ากันได้กับผู้ให้บริการ
      description: SandBase คงฟิลด์ที่เข้ากันได้เพิ่มเติมไว้บนเส้นทางที่ใช้โปรโตคอลเดียวกัน การรองรับฟิลด์ข้ามโปรโตคอลและฟิลด์เฉพาะผู้ให้บริการจะแตกต่างกันไป ให้ใช้ extra_body เมื่อเหมาะสม
  errors:
    - status: "400"
      description: request body ไม่ถูกต้องหรือมีพารามิเตอร์ที่ไม่รองรับ
    - status: "401"
      description: ไม่มี API key หรือ API key ไม่ถูกต้อง
    - status: "402"
      description: ถึงวงเงินการใช้จ่ายขององค์กรแล้ว
    - status: "404"
      description: ไม่พบโมเดลหรือโมเดลไม่พร้อมใช้งาน
    - status: "429"
      description: เกินขีดจำกัดอัตราการเรียกใช้
    - status: "500"
      description: การบันทึกคำขอหรือการค้นหาองค์กรล้มเหลว
    - status: "502"
      description: ผู้ให้บริการที่เลือกส่งคืนการตอบกลับที่ไม่ถูกต้อง
    - status: "503"
      description: ไม่มีเส้นทางของผู้ให้บริการใดที่สำเร็จ
---

<ApiReferencePage />
