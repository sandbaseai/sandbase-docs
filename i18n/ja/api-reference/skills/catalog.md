---
i18nSource: 09bd958c8a1bba3a
title: Skill カタログ
description: 公開 Skill を閲覧します。
aside: false
outline: false
apiReference:
  title: Skill カタログ
  operation: Skills
  method: GET
  path: /v1/skills/catalog
  description: カーソルページネーションで公開 Skill を一覧表示します。1 件を読み取るには GET /v1/skills/catalog/{skill_id}、バージョンの一覧は GET /v1/skills/catalog/{skill_id}/versions、特定バージョンの読み取りは GET /v1/skills/catalog/{skill_id}/versions/{version}、ダウンロードは GET /v1/skills/catalog/{skill_id}/versions/{version}/content を使用します。
  groups:
    - title: クエリパラメーター
      fields:
        - name: limit
          type: integer
          required: false
          description: ページサイズ（0〜100）。範囲外の値は 400 を返します。
          default: "20"
        - name: after
          type: string
          required: false
          description: カーソル。前のページの last_id を渡します。
        - name: order
          type: string
          required: false
          description: asc または desc。
          default: desc
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET "https://api.sandbase.ai/v1/skills/catalog?limit=20" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "GET",
            "https://api.sandbase.ai/v1/skills/catalog?limit=20",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/skills/catalog?limit=20', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
          },
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "list",
        "data": [
          {
            "id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
            "object": "skill",
            "name": "release-notes",
            "description": "Draft release notes from merged changes.",
            "default_version": "1",
            "latest_version": "1",
            "status": "active",
            "visibility": "public",
            "row_version": 1,
            "metadata": {},
            "created_at": 1791273600,
            "updated_at": 1791273600
          }
        ],
        "has_more": false,
        "first_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
        "last_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57"
      }
---

<ApiReferencePage />
