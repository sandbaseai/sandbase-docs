---
i18nSource: 116348cd4360a3c2
title: อัปโหลดไฟล์ของ Session
description: อัปโหลดไฟล์แนบลงใน workspace ของ Session
aside: false
outline: false
apiReference:
  title: อัปโหลดไฟล์ของ Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/files
  description: "ส่วนขยายของ SandBase อัปโหลดไฟล์หนึ่งไฟล์ (ฟิลด์ multipart ชื่อ file ขนาดไม่เกิน 5 MiB) ลงใน workspace ของ Session ต้องระบุ Idempotency-Key นามสกุลที่รองรับ: .txt, .md, .csv, .log, .json, .pdf, .png, .jpg, .jpeg, .webp และเนื้อหาต้องตรงกับนามสกุล ชื่อไฟล์ใช้ได้เฉพาะตัวอักษร ตัวเลข ช่องว่าง จุด ขีดล่าง และขีดกลาง หากการถ่ายโอนล้มเหลว การตอบกลับจะยังเป็น 201 โดยมี status เป็น failed และ error_code เป็น attachment_unavailable ส่งไฟล์ที่พร้อมแล้วด้วย POST /v1/agents/sessions/{session_id}/events โดยใช้ file_ids"
  groups:
    - title: พารามิเตอร์ของพาธ
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
          description: ยาว 1-128 อักขระ ไม่มีช่องว่างนำหน้าหรือต่อท้าย ใช้คีย์และเนื้อหาเดิมเมื่อส่งซ้ำ คีย์เดิมที่มีเนื้อหาต่างออกไปจะส่งคืน 409
    - title: เนื้อหาคำขอ
      description: multipart/form-data
      fields:
        - name: file
          type: file
          required: true
          description: ส่วน file เพียงหนึ่งส่วนเท่านั้น
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: upload-q3-report" \
          -F "file=@q3-report.pdf;type=application/pdf"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "upload-q3-report",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files",
            headers=headers,
            files={"file": open("q3-report.pdf", "rb")},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        import { readFile } from 'node:fs/promises';

        const form = new FormData();
        form.append('file', new Blob([await readFile('q3-report.pdf')], { type: 'application/pdf' }), 'q3-report.pdf');

        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'upload-q3-report',
          },
          body: form,
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 201 Created
    code: |-
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
---

<ApiReferencePage />
