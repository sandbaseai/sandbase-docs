---
i18nSource: 996f166544016111
title: อัปเดต Skill
description: เปลี่ยนเวอร์ชันเริ่มต้น สถานะ หรือ metadata ของ Skill
aside: false
outline: false
apiReference:
  title: อัปเดต Skill
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}
  description: เปลี่ยน default_version, status หรือ market metadata ต้องระบุ row_version เมื่อส่ง metadata มิฉะนั้นจะใช้ค่าปัจจุบัน
  groups:
    - title: พารามิเตอร์ของพาธ
      fields:
        - name: skill_id
          type: string
          required: true
          description: Skill ID (ขึ้นต้นด้วย skl_)
    - title: เนื้อหาคำขอ
      description: ออบเจ็กต์ JSON
      fields:
        - name: default_version
          type: string
          required: false
          description: ค่าเริ่มต้นที่ใช้เมื่อแนบ Skill นี้ครั้งแรกโดยไม่ระบุเวอร์ชัน การผูกกับ Agent ที่มีอยู่จะคงเวอร์ชันที่ปักหมุดไว้
        - name: status
          type: string
          required: false
          description: active หรือ disabled
        - name: metadata
          type: object | null
          required: false
          description: metadata สำหรับการแสดงผลภายใต้ namespace market เท่านั้น (สูงสุด 16 KiB) ต้องมี row_version และจะแทนที่ออบเจ็กต์ metadata ทั้งหมด namespace หรือฟิลด์ที่ไม่รู้จักจะได้ 400 ดูตัวอย่าง metadata ด้านล่าง
        - name: row_version
          type: integer
          required: false
          description: row_version ปัจจุบันจาก Get Skill ค่าที่ล้าสมัยจะได้ 409 conflict ต้องระบุเมื่อมี metadata
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "default_version": "2"
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        skill = client.skills.update("skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", default_version="2")
        print(skill.default_version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
            headers=headers,
            json={
                "default_version": "2"
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "default_version": "2"
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
        "object": "skill",
        "name": "release-notes",
        "description": "Draft release notes from merged changes.",
        "default_version": "2",
        "latest_version": "2",
        "status": "active",
        "visibility": "private",
        "row_version": 3,
        "metadata": {},
        "created_at": 1791273600,
        "updated_at": 1791273600
      }
---

<ApiReferencePage />

## ตัวอย่าง metadata {#metadata-example}

ส่ง `row_version` ปัจจุบันพร้อมกับออบเจ็กต์ metadata ฉบับสมบูรณ์:

```json
{
  "row_version": 3,
  "metadata": {
    "market": {
      "display_name": "Release notes",
      "categories": ["development"],
      "tags": ["releases"],
      "required_endpoints": ["github.issues"],
      "servers": ["github"]
    }
  }
}
```

Market metadata ใช้อธิบาย Skill สำหรับการแสดงผล ไม่ได้ติดตั้งเซิร์ฟเวอร์ ไม่ได้ให้ข้อมูลรับรอง และไม่ได้เปลี่ยนการเลือก MCP ของ Agent การส่ง `metadata: {}` หรือ `metadata: null` จะล้างค่า ทั้งสองแบบยังคงต้องมี `row_version`
