---
i18nSource: faccf5122e785ea0
title: ดาวน์โหลด Artifact ของ Session
description: ดาวน์โหลด artifact ของ Session ที่บันทึกไว้ตาม ID ดูขีดจำกัดการดาวน์โหลดทั้งไฟล์ ประเภท response ที่รองรับ และพฤติกรรมของ Range
aside: false
outline: false
apiReference:
  title: ดาวน์โหลด Artifact ของ Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content
  description: ดาวน์โหลด artifact ที่เปลี่ยนแปลงไม่ได้ทั้งไฟล์โดยใช้ ID จาก List Session Artifacts รองรับไฟล์ขนาดสูงสุด 200 MiB ไม่รับพารามิเตอร์ query และคำขอแบบ Range จะได้ 416 หลังการตรวจสอบสิทธิ์เข้าถึง
  groups:
    - title: พารามิเตอร์พาธ
      fields:
        - name: session_id
          type: string
          required: true
          description: ID ของ Session (ขึ้นต้นด้วย ses_)
        - name: artifact_id
          type: string
          required: true
          description: ID art_ แบบทึบที่ส่งคืนจากรายการ artifact ของ Session นี้ตรงตัว ไม่รับ ID ของไฟล์แนบหรือพาธใน workspace
    - title: เฮดเดอร์ของ response
      fields:
        - name: Content-Type
          type: string
          required: true
          description: ประเภทสื่อที่อนุมานจากนามสกุลไฟล์ หรือ application/octet-stream
        - name: Content-Disposition
          type: string
          required: true
          description: attachment พร้อมชื่อไฟล์ของ artifact
        - name: Content-Length
          type: integer
          required: true
          description: ขนาดไฟล์ทั้งหมดเป็นไบต์
        - name: Cache-Control
          type: string
          required: true
          description: no-store
  examples:
    - label: cURL
      language: bash
      code: |-
        # Set SESSION_ID and ARTIFACT_ID from your Session and artifact list.
        curl --fail-with-body "https://api.sandbase.ai/v1/agents/sessions/${SESSION_ID}/artifacts/${ARTIFACT_ID}/content" \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          --output report.md
    - label: Python
      language: python
      code: |-
        import os
        from pathlib import Path
        import requests

        # Use IDs returned by your own Session and artifact list.
        session_id = os.environ["SESSION_ID"]
        artifact_id = os.environ["ARTIFACT_ID"]
        response = requests.get(
            f"https://api.sandbase.ai/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        Path("report.md").write_bytes(response.content)
    - label: TypeScript
      language: typescript
      code: |-
        import { writeFile } from 'node:fs/promises';

        const { SESSION_ID, ARTIFACT_ID, SANDBASE_API_KEY } = process.env;
        if (!SESSION_ID || !ARTIFACT_ID || !SANDBASE_API_KEY) throw new Error('Missing configuration');
        const response = await fetch(
          `https://api.sandbase.ai/v1/agents/sessions/${encodeURIComponent(SESSION_ID)}/artifacts/${encodeURIComponent(ARTIFACT_ID)}/content`,
          { headers: { Authorization: `Bearer ${SANDBASE_API_KEY}` } },
        );
        if (!response.ok) throw new Error(await response.text());
        await writeFile('report.md', new Uint8Array(await response.arrayBuffer()));
---

<ApiReferencePage />

response ที่สำเร็จคือไบต์ของไฟล์ ไม่ใช่ JSON ให้ดาวน์โหลดทั้งไฟล์ เนื่องจากไม่รองรับการถ่ายโอนบางส่วนและการดาวน์โหลดแบบ Range ที่ทำต่อได้ artifact ที่ไม่พร้อมใช้งานจะได้ `404` และบริการ artifact ที่ไม่พร้อมใช้งานจะได้ `executor_unavailable`
