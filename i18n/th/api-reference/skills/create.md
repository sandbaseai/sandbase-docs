---
i18nSource: 612f99de1f80d99a
title: สร้าง Skill
description: อัปโหลดชุด Skill แบบ ZIP ด้วย POST /v1/skills
aside: false
outline: false
apiReference:
  title: สร้าง Skill
  operation: Skills
  method: POST
  path: /v1/skills
  description: อัปโหลดชุดไฟล์ ZIP และสร้าง Skill เป็นเวอร์ชัน 1 เนื้อหาแบบ multipart ต้องมี file part เพียงหนึ่งรายการชื่อ files (หรือ files[]) ขนาดไม่เกิน 5 MiB ไฟล์ ZIP ต้องมีโฟลเดอร์ระดับบนสุดหนึ่งโฟลเดอร์ที่มี SKILL.md อยู่ข้างใน (เช่น zip -r release-notes.zip release-notes/) และ frontmatter ของ SKILL.md ต้องกำหนด name และ description หาก SKILL.md อยู่ที่ราก ZIP จะได้ 400 invalid_request
  groups:
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
          description: ไฟล์ ZIP ที่มีโฟลเดอร์ระดับบนสุดเพียงโฟลเดอร์เดียวซึ่งมี SKILL.md
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/skills \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: release-notes-skill-1" \
          -F "files=@release-notes.zip;type=application/zip"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        with open("release-notes.zip", "rb") as bundle:
            skill = client.skills.create(files=[("release-notes.zip", bundle.read(), "application/zip")])
        print(skill.id, skill.default_version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "release-notes-skill-1",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/skills",
            headers=headers,
            files={"files": open("release-notes.zip", "rb")},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        import { readFile } from 'node:fs/promises';

        const form = new FormData();
        form.append('files', new Blob([await readFile('release-notes.zip')], { type: 'application/zip' }), 'release-notes.zip');

        const response = await fetch('https://api.sandbase.ai/v1/skills', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'release-notes-skill-1',
          },
          body: form,
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 201 Created
    code: |-
      {
        "id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
        "object": "skill",
        "name": "release-notes",
        "description": "Draft release notes from merged changes.",
        "default_version": "1",
        "latest_version": "1",
        "status": "active",
        "visibility": "private",
        "row_version": 1,
        "metadata": {},
        "created_at": 1791273600,
        "updated_at": 1791273600
      }
---

<ApiReferencePage />
