---
i18nSource: 09bd958c8a1bba3a
title: Skill 카탈로그
description: 공개 Skill을 둘러봅니다.
aside: false
outline: false
apiReference:
  title: Skill 카탈로그
  operation: Skills
  method: GET
  path: /v1/skills/catalog
  description: 커서 페이지네이션으로 공개 Skill 목록을 조회합니다. GET /v1/skills/catalog/{skill_id}로 하나를 조회하고, GET /v1/skills/catalog/{skill_id}/versions로 버전 목록을, GET /v1/skills/catalog/{skill_id}/versions/{version}으로 특정 버전을 조회하며, GET /v1/skills/catalog/{skill_id}/versions/{version}/content로 다운로드합니다.
  groups:
    - title: 쿼리 파라미터
      fields:
        - name: limit
          type: integer
          required: false
          description: 0에서 100 사이의 페이지 크기. 범위를 벗어난 값은 400을 반환합니다.
          default: "20"
        - name: after
          type: string
          required: false
          description: 커서. 이전 페이지의 last_id를 전달하세요.
        - name: order
          type: string
          required: false
          description: asc 또는 desc.
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
