---
i18nSource: 270917aea416aa76
title: แสดงรายการ Artifact ของ Session
description: แสดงรายการ artifact เอาต์พุตของ Session ที่บันทึกไว้ ด้วยการแบ่งหน้าแบบ cursor, ID แบบทึบ, ขนาดไฟล์ และลิงก์ดาวน์โหลด
aside: false
outline: false
apiReference:
  title: แสดงรายการ Artifact ของ Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts
  description: แสดงรายการเอาต์พุตที่สร้างขึ้นและเปลี่ยนแปลงไม่ได้ของ Session นี้ ID ของ artifact เป็น handle แบบทึบในขอบเขตของ Session ให้ส่ง ID ที่ได้รับไปยัง endpoint ดาวน์โหลดโดยไม่เปลี่ยนแปลง พารามิเตอร์ query ที่ไม่รู้จักหรือซ้ำจะได้ 400
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
          description: ขนาดหน้าตั้งแต่ 1 ถึง 100 ค่าที่ไม่ถูกต้องจะได้ 400
          default: "20"
        - name: order
          type: string
          required: false
          description: asc หรือ desc
          default: desc
        - name: after
          type: string
          required: false
          description: ID ของ artifact ที่ส่งคืนเป็น last_id ในหน้าก่อนหน้า ให้ใช้ order เดิมเมื่อดึงหน้าต่อไป
    - title: ออบเจ็กต์ Artifact
      fields:
        - name: object
          type: string
          required: true
          description: เป็น agent.session.artifact เสมอ
        - name: id
          type: string
          required: true
          description: handle art_ แบบทึบ ห้ามสร้างหรือถอดรหัสเอง
        - name: session_id
          type: string
          required: true
          description: ID ของ Session ที่เป็นเจ้าของ
        - name: path
          type: string
          required: true
          description: พาธของเอาต์พุตที่สร้างขึ้นภายใต้ /workspace/outputs/
        - name: size_bytes
          type: integer
          required: true
          description: ขนาดของ artifact เป็นไบต์
        - name: created_at
          type: integer
          required: true
          description: timestamp เวลาที่สร้างเป็น Unix seconds
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "list",
        "data": [
          {
            "object": "agent.session.artifact",
            "id": "art_example_handle",
            "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            "path": "/workspace/outputs/report.md",
            "size_bytes": 1024,
            "created_at": 1791273600
          }
        ],
        "has_more": false,
        "first_id": "art_example_handle",
        "last_id": "art_example_handle"
      }
---

<ApiReferencePage />

handle ในตัวอย่างใช้เพื่อการอธิบายเท่านั้น ให้ใช้ `id` ที่ส่งคืนจากคำขอของคุณเองกับ [ดาวน์โหลด Artifact](./download-artifact) เมื่อ `has_more` เป็น true ให้ส่ง `after=last_id` เพื่อรับหน้าถัดไป `first_id` และ `last_id` จะเป็น null สำหรับรายการที่ว่างเปล่า ไม่มี endpoint GET แยกต่างหากสำหรับ metadata ของ artifact
