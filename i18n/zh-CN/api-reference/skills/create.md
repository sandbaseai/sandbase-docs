---
i18nSource: 612f99de1f80d99a
title: 创建 Skill
description: 通过 POST /v1/skills 上传 Skill ZIP 包。
aside: false
outline: false
apiReference:
  title: 创建 Skill
  operation: Skills
  method: POST
  path: /v1/skills
  description: 上传 ZIP 包并以版本 1 创建 Skill。multipart 请求体必须恰好包含一个名为 files（或 files[]）的文件部分，大小不超过 5 MiB。ZIP 中必须只有一个顶层文件夹，且该文件夹内包含 SKILL.md（例如 zip -r release-notes.zip release-notes/），SKILL.md 的 frontmatter 必须设置 name 和 description。SKILL.md 位于 ZIP 根目录时返回 400 invalid_request。
  groups:
    - title: 请求头
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: 可选，1-128 字节，首尾不能有空白。省略时由服务生成，因此重试请求可能会创建重复项。重试时请发送你自己的固定键。
    - title: 请求体
      description: multipart/form-data。
      fields:
        - name: files
          type: file
          required: true
          description: ZIP 压缩包，其唯一的顶层文件夹中包含 SKILL.md。
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
