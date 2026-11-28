---
i18nSource: 36f9771126ee9243
title: ดึงข้อมูลเวอร์ชันของ Agent
description: อ่านเวอร์ชันของ Agent ที่แก้ไขไม่ได้หนึ่งเวอร์ชัน
aside: false
outline: false
apiReference:
  title: ดึงข้อมูลเวอร์ชันของ Agent
  operation: Agents
  method: GET
  path: /v1/agents/{agent_id}/versions/{version}
  description: อ่านสแนปช็อตของเวอร์ชันหนึ่งเวอร์ชัน version ต้องเป็นจำนวนเต็มบวก มิฉะนั้นจะได้ 400 ในที่นี้ created_at เป็นสตริง ISO 8601 ขณะที่ออบเจ็กต์ Agent ใช้วินาทีแบบ Unix ส่วน note จะปรากฏเฉพาะเมื่อการเปลี่ยนแปลงที่สร้างเวอร์ชันนั้นส่ง note มาด้วย
  groups:
    - title: พารามิเตอร์ของพาธ
      fields:
        - name: agent_id
          type: string
          required: true
          description: Agent ID (ขึ้นต้นด้วย agt_)
        - name: version
          type: integer
          required: true
          description: หมายเลขเวอร์ชัน เริ่มจาก 1
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/versions/1 \
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
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/versions/1",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/versions/1', {
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
        "version": 1,
        "agent": {
          "name": "Research assistant",
          "model": "deepseek/deepseek-v4-flash",
          "instructions": "Answer with cited sources."
        },
        "checksum": "d04d38eb890a1273fa7965a6a7cdc2426232326e43b901d1aad3ed669455acbf",
        "created_at": "2026-10-05T08:00:00.000Z"
      }
---

<ApiReferencePage />
