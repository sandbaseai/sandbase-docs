---
i18nSource: 096e3c57e599c5ca
title: 上傳 Skill 版本
description: 上傳新的 Skill 版本。
aside: false
outline: false
apiReference:
  title: 上傳 Skill 版本
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}/versions
  description: 上傳新的 ZIP 套件作為下一個版本（200 OK）。ZIP 結構與建立 Skill 相同（一個包含 SKILL.md 的最上層資料夾）。傳送 default=true 可將其設為預設版本。使用 GET /v1/skills/{skill_id}/versions 列出版本，使用 GET /v1/skills/{skill_id}/versions/{version} 讀取單一版本，使用 GET /v1/skills/{skill_id}/versions/{version}/content 下載版本。版本識別碼為字串。
  groups:
    - title: 路徑參數
      fields:
        - name: skill_id
          type: string
          required: true
          description: Skill ID（skl_ 前綴）。
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
          description: ZIP 封存檔，最大 5 MiB。
        - name: default
          type: string
          required: false
          description: true 會將此版本設為日後附加時的預設版本；false 或省略則維持目前的預設版本。既有的 Agent 綁定不受影響。
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

## 列出與下載版本 {#list-and-download-versions}

`GET /v1/skills/{skill_id}/versions` 接受 `limit`（0–100，預設 20）、`order`（`asc` 或 `desc`，預設 `desc`）與 `after`。回應包含 `object: "list"`、`data`、`has_more`、`first_id` 與 `last_id`。請將 `last_id` 原樣作為下一次的 `after` 傳入；它是帶有 Skill 前綴的版本 ID，而不是單純的版本號碼。

`GET /v1/skills/{skill_id}/versions/{version}` 會回傳一個版本物件。對應的 `/content` 端點會回傳 ZIP 位元組；請參閱[下載範例](./#download-a-bundle)。
