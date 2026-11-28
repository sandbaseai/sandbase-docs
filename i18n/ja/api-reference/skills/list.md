---
i18nSource: 5909c2182af71782
title: Skill の一覧
description: 組織の Skill を一覧表示します。
aside: false
outline: false
apiReference:
  title: Skill の一覧
  operation: Skills
  method: GET
  path: /v1/skills
  description: カーソルページネーションで、組織が所有する Skill を一覧表示します。
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
        curl -X GET "https://api.sandbase.ai/v1/skills?limit=20" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        for skill in client.skills.list(limit=20):
            print(skill.id, skill.name)
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
            "https://api.sandbase.ai/v1/skills?limit=20",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/skills?limit=20', {
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
            "visibility": "private",
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
