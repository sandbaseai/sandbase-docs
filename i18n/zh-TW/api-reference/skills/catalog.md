---
i18nSource: 09bd958c8a1bba3a
title: Skill 目錄
description: 瀏覽公開的 Skills。
aside: false
outline: false
apiReference:
  title: Skill 目錄
  operation: Skills
  method: GET
  path: /v1/skills/catalog
  description: 以游標分頁列出公開的 Skills。使用 GET /v1/skills/catalog/{skill_id} 讀取單一 Skill，使用 GET /v1/skills/catalog/{skill_id}/versions 列出其版本，使用 GET /v1/skills/catalog/{skill_id}/versions/{version} 讀取某個版本，並使用 GET /v1/skills/catalog/{skill_id}/versions/{version}/content 下載它。
  groups:
    - title: 查詢參數
      fields:
        - name: limit
          type: integer
          required: false
          description: 每頁筆數，範圍 0 到 100。超出範圍的值會回傳 400。
          default: "20"
        - name: after
          type: string
          required: false
          description: 游標。傳入上一頁的 last_id。
        - name: order
          type: string
          required: false
          description: asc 或 desc。
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
