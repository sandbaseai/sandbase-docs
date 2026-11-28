---
i18nSource: d4a2ec314b751b1b
title: ยกเลิก Turn ของ Session
description: ยกเลิก Turn ที่กำลังดำเนินการอยู่ของ Session
aside: false
outline: false
apiReference:
  title: ยกเลิก Turn ของ Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/cancel
  description: ส่วนขยายของ SandBase ขอยกเลิก Turn ที่กำลังดำเนินการอยู่ body จะว่างหรือเป็น {} ก็ได้ และต้องมี Idempotency-Key หาก Session ว่างอยู่ การเรียกจะยังคงส่งคืน 202 พร้อม accepted เป็น true และไม่มีอะไรเปลี่ยนแปลง ทางเลือกมาตรฐานคือการส่งอีเวนต์ agent.session.input.cancel
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
          required: true
          description: 1-128 อักขระ โดยไม่มีช่องว่างนำหน้าหรือต่อท้าย ใช้คีย์และ body เดิมเมื่อลองใหม่ หากใช้คีย์เดิมกับ body ที่ต่างกันจะได้ 409
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/cancel \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: market-scan-cancel-1" \
          -H "Content-Type: application/json" \
          -d '{}'
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "market-scan-cancel-1",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/cancel",
            headers=headers,
            json={},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/cancel', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'market-scan-cancel-1',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 202 Accepted
    code: |-
      {
        "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
        "accepted": true
      }
---

<ApiReferencePage />
