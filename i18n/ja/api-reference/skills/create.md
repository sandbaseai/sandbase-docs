---
i18nSource: 612f99de1f80d99a
title: Skill の作成
description: POST /v1/skills で Skill の ZIP バンドルをアップロードします。
aside: false
outline: false
apiReference:
  title: Skill の作成
  operation: Skills
  method: POST
  path: /v1/skills
  description: "ZIP バンドルをアップロードし、バージョン 1 の Skill を作成します。multipart ボディには、files（または files[]）という名前のファイルパートを 5 MiB 以内でちょうど 1 つ含める必要があります。ZIP には、SKILL.md を含むトップレベルのフォルダーが 1 つだけ必要です（例: zip -r release-notes.zip release-notes/）。また、SKILL.md のフロントマターで name と description を設定する必要があります。ZIP のルートに SKILL.md がある場合は 400 invalid_request を返します。"
  groups:
    - title: ヘッダー
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: 任意。1～128 バイトで、先頭と末尾に空白を含めないでください。省略するとサービスが生成するため、リトライしたリクエストで重複が作成される可能性があります。リトライに備えて、固定の独自キーを送信してください。
    - title: リクエストボディ
      description: multipart/form-data。
      fields:
        - name: files
          type: file
          required: true
          description: 単一のトップレベルフォルダーに SKILL.md を含む ZIP アーカイブ。
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
