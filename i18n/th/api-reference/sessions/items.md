---
i18nSource: 7f46c6a48c4e28b0
title: แสดงรายการ Item ของ Session
description: อ่านประวัติ item ของ Session
aside: false
outline: false
apiReference:
  title: แสดงรายการ Item ของ Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/items
  description: อ่าน item ของบทสนทนา (ข้อความ การเรียกเครื่องมือ และเอาต์พุต) ด้วยการแบ่งหน้าแบบ cursor ใช้วิธีนี้เพื่อกู้คืนเอาต์พุตที่สร้างขึ้นขณะที่ไม่มีสตรีมเปิดอยู่
  groups:
    - title: พารามิเตอร์พาธ
      fields:
        - name: session_id
          type: string
          required: true
          description: ID ของ Session (ขึ้นต้นด้วย ses_)
    - title: พารามิเตอร์ query
      fields:
        - name: limit
          type: integer
          required: false
          description: ขนาดหน้าตั้งแต่ 1 ถึง 100 ค่าที่อยู่นอกช่วงจะได้ 400
          default: "20"
        - name: after
          type: string
          required: false
          description: Cursor ให้ส่ง last_id จากหน้าก่อนหน้า
        - name: order
          type: string
          required: false
          description: asc หรือ desc ตามเวลาที่สร้าง
          default: desc
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc&limit=50" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        page = client.beta.agents.sessions.items.list("ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83", order="asc", limit=50)
        for row in page.data:
            print(row.id)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "GET",
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc&limit=50",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc&limit=50', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
          },
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
---

<ApiReferencePage />
