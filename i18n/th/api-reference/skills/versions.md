---
i18nSource: 096e3c57e599c5ca
title: อัปโหลดเวอร์ชันของ Skill
description: อัปโหลด Skill เวอร์ชันใหม่
aside: false
outline: false
apiReference:
  title: อัปโหลดเวอร์ชันของ Skill
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}/versions
  description: อัปโหลดชุดไฟล์ ZIP ใหม่เป็นเวอร์ชันถัดไป (200 OK) โครงสร้าง ZIP เหมือนกับ Create Skill (โฟลเดอร์ระดับบนสุดหนึ่งโฟลเดอร์ที่มี SKILL.md) ส่ง default=true เพื่อตั้งเป็นเวอร์ชันเริ่มต้น แสดงรายการเวอร์ชันด้วย GET /v1/skills/{skill_id}/versions อ่านเวอร์ชันเดียวด้วย GET /v1/skills/{skill_id}/versions/{version} และดาวน์โหลดด้วย GET /v1/skills/{skill_id}/versions/{version}/content ตัวระบุเวอร์ชันเป็นสตริง
  groups:
    - title: พารามิเตอร์ของพาธ
      fields:
        - name: skill_id
          type: string
          required: true
          description: Skill ID (ขึ้นต้นด้วย skl_)
    - title: ส่วนหัว
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: ไม่บังคับ ยาว 1-128 ไบต์ ไม่มีช่องว่างนำหน้าหรือต่อท้าย หากไม่ระบุ บริการจะสร้างให้ ซึ่งทำให้คำขอที่ลองใหม่อาจสร้างรายการซ้ำได้ ให้ส่งคีย์ที่คงที่ของคุณเองสำหรับการลองใหม่
    - title: เนื้อหาคำขอ
      description: multipart/form-data
      fields:
        - name: files
          type: file
          required: true
          description: ไฟล์ ZIP ขนาดไม่เกิน 5 MiB
        - name: default
          type: string
          required: false
          description: true จะตั้งเวอร์ชันนี้เป็นค่าเริ่มต้นสำหรับการแนบในอนาคต ส่วน false หรือไม่ระบุจะคงค่าเริ่มต้นปัจจุบันไว้ การผูกกับ Agent ที่มีอยู่จะไม่เปลี่ยนแปลง
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: release-notes-v2" \
          -F "files=@release-notes-v2.zip;type=application/zip" \
          -F "default=true"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        with open("release-notes-v2.zip", "rb") as bundle:
            version = client.skills.versions.create(
                "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
                files=[("release-notes-v2.zip", bundle.read(), "application/zip")],
                default=True,
            )
        print(version.version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "release-notes-v2",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions",
            headers=headers,
            files={"files": open("release-notes-v2.zip", "rb")},
            data={"default": "true"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        import { readFile } from 'node:fs/promises';

        const form = new FormData();
        form.append('files', new Blob([await readFile('release-notes-v2.zip')], { type: 'application/zip' }), 'release-notes-v2.zip');
        form.append('default', 'true');

        const response = await fetch('https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'release-notes-v2',
          },
          body: form,
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "skill.version",
        "id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57:2",
        "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
        "version": "2",
        "name": "release-notes",
        "description": "Draft release notes from merged changes.",
        "created_at": 1791360000
      }
---

<ApiReferencePage />

## แสดงรายการและดาวน์โหลดเวอร์ชัน {#list-and-download-versions}

`GET /v1/skills/{skill_id}/versions` รับ `limit` (0-100 ค่าเริ่มต้น 20), `order` (`asc` หรือ `desc` ค่าเริ่มต้น `desc`) และ `after` การตอบกลับมี `object: "list"`, `data`, `has_more`, `first_id` และ `last_id` ให้ส่ง `last_id` เป็น `after` ถัดไปโดยไม่เปลี่ยนแปลง ค่านี้คือ ID ของเวอร์ชันที่มี prefix ของ Skill ไม่ใช่หมายเลขเวอร์ชันเปล่า

`GET /v1/skills/{skill_id}/versions/{version}` ส่งคืนออบเจ็กต์เวอร์ชันหนึ่งรายการ ส่วน endpoint `/content` ที่สอดคล้องกันจะส่งคืนไบต์ของ ZIP ดู[ตัวอย่างการดาวน์โหลด](./#download-a-bundle)
