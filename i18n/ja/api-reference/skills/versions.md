---
i18nSource: 096e3c57e599c5ca
title: Skill バージョンのアップロード
description: Skill の新しいバージョンをアップロードします。
aside: false
outline: false
apiReference:
  title: Skill バージョンのアップロード
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}/versions
  description: 新しい ZIP バンドルを次のバージョンとしてアップロードします（200 OK）。ZIP の構成は Create Skill と同じです（SKILL.md を含むトップレベルのフォルダーが 1 つ）。デフォルトのバージョンにするには default=true を送信します。バージョンの一覧は GET /v1/skills/{skill_id}/versions、1 つの読み取りは GET /v1/skills/{skill_id}/versions/{version}、ダウンロードは GET /v1/skills/{skill_id}/versions/{version}/content で行います。バージョン識別子は文字列です。
  groups:
    - title: パスパラメーター
      fields:
        - name: skill_id
          type: string
          required: true
          description: Skill ID（skl_ プレフィックス）。
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
          description: ZIP アーカイブ（最大 5 MiB）。
        - name: default
          type: string
          required: false
          description: true にすると、今後の関連付けでこのバージョンがデフォルトになります。false または省略した場合は現在のデフォルトが維持されます。既存の Agent のバインディングは変わりません。
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

## バージョンの一覧表示とダウンロード {#list-and-download-versions}

`GET /v1/skills/{skill_id}/versions` は `limit`（0～100、デフォルト 20）、`order`（`asc` または `desc`、デフォルト `desc`）、`after` を受け付けます。レスポンスには `object: "list"`、`data`、`has_more`、`first_id`、`last_id` が含まれます。`last_id` は変更せずに次の `after` として渡してください。これは Skill のプレフィックス付きのバージョン ID であり、単なるバージョン番号ではありません。

`GET /v1/skills/{skill_id}/versions/{version}` はバージョンオブジェクトを 1 つ返します。対応する `/content` エンドポイントは ZIP のバイト列を返します。[ダウンロードの例](./#download-a-bundle)を参照してください。
