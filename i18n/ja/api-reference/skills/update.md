---
i18nSource: 996f166544016111
title: Skill の更新
description: Skill のデフォルトバージョン、ステータス、メタデータを変更します。
aside: false
outline: false
apiReference:
  title: Skill の更新
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}
  description: default_version、status、または market メタデータを変更します。metadata を送信する場合は row_version が必須です。それ以外の場合は現在の値が使われます。
  groups:
    - title: パスパラメーター
      fields:
        - name: skill_id
          type: string
          required: true
          description: Skill ID（skl_ プレフィックス）。
    - title: リクエストボディ
      description: JSON オブジェクト。
      fields:
        - name: default_version
          type: string
          required: false
          description: バージョンを明示せずにこの Skill を初めて関連付けるときに使われるデフォルト。既存の Agent のバインディングは固定されたバージョンを維持します。
        - name: status
          type: string
          required: false
          description: active または disabled。
        - name: metadata
          type: object | null
          required: false
          description: market 名前空間のみの表示用メタデータ（最大 16 KiB）。row_version が必要で、metadata オブジェクトを置き換えます。不明な名前空間やフィールドは 400 を返します。下のメタデータの例を参照してください。
        - name: row_version
          type: integer
          required: false
          description: Get Skill で取得した現在の row_version。古い値の場合は 409 conflict を返します。metadata を指定する場合は必須です。
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

## メタデータの例 {#metadata-example}

現在の `row_version` と、完全な metadata オブジェクトを一緒に送信します。

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

market メタデータは、表示用に Skill を説明するものです。サーバーのインストール、認証情報の付与、Agent の MCP の選択の変更は行いません。`metadata: {}` または `metadata: null` でクリアされます。どちらの場合も `row_version` が必要です。
