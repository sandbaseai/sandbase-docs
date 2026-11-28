---
i18nSource: 08bc15c123b1c466
title: แสดงรายการไฟล์ของ Session
description: แสดงรายการไฟล์แนบของ Session
aside: false
outline: false
apiReference:
  title: แสดงรายการไฟล์ของ Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/files
  description: แสดงรายการไฟล์แนบด้วยการแบ่งหน้าแบบ offset โดย limit ต้องอยู่ระหว่าง 1-100
  groups:
    - title: พารามิเตอร์ของพาธ
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID (ขึ้นต้นด้วย ses_)
    - title: พารามิเตอร์ของ query
      fields:
        - name: limit
          type: integer
          required: false
          description: ขนาดหน้าสูงสุด 100 ค่าที่มากกว่า 100 จะได้ 400 ส่วน 0 หรือค่าที่ไม่ใช่ตัวเลขจะใช้ค่า 20 แทน
          default: "20"
        - name: offset
          type: integer
          required: false
          description: จำนวนรายการที่จะข้าม
          default: "0"
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files?limit=20" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
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
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files?limit=20",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files?limit=20', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
          },
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "data": [
          {
            "id": "fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72",
            "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            "name": "q3-report.pdf",
            "mime_type": "application/pdf",
            "size_bytes": 482113,
            "status": "ready",
            "created_at": "2026-10-06T08:10:00Z",
            "updated_at": "2026-10-06T08:10:02Z"
          }
        ],
        "total": 1,
        "limit": 20,
        "offset": 0
      }
---

<ApiReferencePage />
