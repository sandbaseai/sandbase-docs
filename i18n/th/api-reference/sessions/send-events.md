---
i18nSource: 57d5d4e3e9e72fe6
title: ส่งอินพุตไปยัง Session
description: ส่งอีเวนต์อินพุตหรืออีเวนต์ยกเลิกหนึ่งรายการไปยัง Session
aside: false
outline: false
apiReference:
  title: ส่งอินพุตไปยัง Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/events
  description: 'ส่งอีเวนต์ได้หนึ่งรายการต่อคำขอเท่านั้น: agent.session.input.message หรือ agent.session.input.cancel ส่งคืน 202 โดยไม่มี body ให้ติดตามความคืบหน้าจากสตรีมอีเวนต์ รูปแบบส่วนขยายของ SandBase {"input": "…", "file_ids": [...]} จะส่งข้อความพร้อมไฟล์แนบที่พร้อมใช้งานได้สูงสุด 10 ไฟล์ และใช้ร่วมกับ events ไม่ได้ หากได้ 409 session_input_pending แสดงว่าอินพุตก่อนหน้ายังส่งไม่เสร็จ ให้รอ และอย่าส่งซ้ำด้วยคีย์ใหม่'
  groups:
    - title: พารามิเตอร์พาธ
      fields:
        - name: session_id
          type: string
          required: true
          description: ID ของ Session (ขึ้นต้นด้วย ses_)
    - title: เฮดเดอร์
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: ไม่บังคับแต่แนะนำให้ใช้ ใช้คีย์เดิมเมื่อลองส่งอินพุตเดิมใหม่
    - title: Request body
      description: ใช้ events หรือ input/file_ids อย่างใดอย่างหนึ่ง
      fields:
        - name: events
          type: array
          required: false
          description: อีเวนต์หนึ่งรายการเท่านั้น input.message มี input เป็นข้อความหรือข้อความ input_text ของผู้ใช้หนึ่งรายการ ส่วน input.cancel ไม่มี input
        - name: input
          type: string
          required: false
          description: ส่วนขยายของ SandBase ข้อความที่ไม่ว่าง ไม่เกิน 256 KiB
        - name: file_ids
          type: array
          required: false
          description: ส่วนขยายของ SandBase ID ไฟล์แนบที่ไม่ซ้ำกันได้สูงสุด 10 รายการซึ่งมีสถานะ ready
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: market-scan-input-1" \
          -H "Content-Type: application/json" \
          -d '{
            "events": [
              {
                "type": "agent.session.input.message",
                "input": [
                  {
                    "role": "user",
                    "content": [
                      {
                        "type": "input_text",
                        "text": "List three notable launches this week."
                      }
                    ]
                  }
                ]
              }
            ]
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        client.beta.agents.sessions.events.create(
            "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            events=[{
                "type": "agent.session.input.message",
                "input": [{"role": "user", "content": [{"type": "input_text", "text": "List three notable launches this week."}]}],
            }],
        )
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "market-scan-input-1",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events",
            headers=headers,
            json={
                "events": [
                    {
                        "type": "agent.session.input.message",
                        "input": [
                            {
                                "role": "user",
                                "content": [
                                    {
                                        "type": "input_text",
                                        "text": "List three notable launches this week."
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
        )
        response.raise_for_status()
        print(response.status_code)  # 202 Accepted, no body
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'market-scan-input-1',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "events": [
              {
                "type": "agent.session.input.message",
                "input": [
                  {
                    "role": "user",
                    "content": [
                      {
                        "type": "input_text",
                        "text": "List three notable launches this week."
                      }
                    ]
                  }
                ]
              }
            ]
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(response.status); // 202 Accepted, no body
---

<ApiReferencePage />
