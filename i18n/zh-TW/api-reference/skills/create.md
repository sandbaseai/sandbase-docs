---
i18nSource: 612f99de1f80d99a
title: 建立 Skill
description: 使用 POST /v1/skills 上傳 Skill ZIP 套件。
aside: false
outline: false
apiReference:
  title: 建立 Skill
  operation: Skills
  method: POST
  path: /v1/skills
  description: 上傳 ZIP 套件並建立版本 1 的 Skill。multipart 本文必須只包含一個名為 files（或 files[]）的檔案部分，大小上限 5 MiB。ZIP 內必須有一個最上層資料夾，且其中包含 SKILL.md（例如 zip -r release-notes.zip release-notes/），SKILL.md 的 frontmatter 必須設定 name 與 description。SKILL.md 若位於 ZIP 根目錄，會回傳 400 invalid_request。
  groups:
    - title: 標頭
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: 選用，1–128 位元組，前後不可有空白。省略時由服務自動產生，因此重試的請求可能會建立重複項目。重試時請傳送您自己的固定金鑰。
    - title: 請求本文
      description: multipart/form-data。
      fields:
        - name: files
          type: file
          required: true
          description: ZIP 封存檔，其唯一的最上層資料夾中包含 SKILL.md。
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
