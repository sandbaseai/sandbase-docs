---
i18nSource: 612f99de1f80d99a
title: Tạo Skill
description: Tải lên gói ZIP của Skill bằng POST /v1/skills.
aside: false
outline: false
apiReference:
  title: Tạo Skill
  operation: Skills
  method: POST
  path: /v1/skills
  description: Tải lên gói ZIP và tạo Skill ở phiên bản 1. Body multipart phải chứa đúng một phần file tên là files (hoặc files[]), tối đa 5 MiB. File ZIP phải chứa một thư mục cấp cao nhất có SKILL.md bên trong (ví dụ zip -r release-notes.zip release-notes/), và frontmatter của SKILL.md phải khai báo name và description. SKILL.md nằm ở gốc file ZIP sẽ trả về 400 invalid_request.
  groups:
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Tùy chọn, 1-128 byte, không có khoảng trắng ở đầu hoặc cuối. Nếu bỏ qua, dịch vụ sẽ tự tạo một key, nên request thử lại có thể tạo bản trùng lặp. Hãy gửi key ổn định của riêng bạn khi thử lại.
    - title: Body của request
      description: multipart/form-data.
      fields:
        - name: files
          type: file
          required: true
          description: File nén ZIP có một thư mục cấp cao nhất duy nhất chứa SKILL.md.
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
