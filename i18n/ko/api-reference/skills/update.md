---
i18nSource: 996f166544016111
title: Skill 업데이트
description: Skill의 기본 버전, 상태 또는 메타데이터를 변경합니다.
aside: false
outline: false
apiReference:
  title: Skill 업데이트
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}
  description: default_version, status 또는 market 메타데이터를 변경합니다. metadata를 보낼 때는 row_version이 필수이며, 그렇지 않으면 현재 값이 사용됩니다.
  groups:
    - title: 경로 매개변수
      fields:
        - name: skill_id
          type: string
          required: true
          description: Skill ID(skl_ 접두사).
    - title: 요청 본문
      description: JSON 객체.
      fields:
        - name: default_version
          type: string
          required: false
          description: 버전을 명시하지 않고 이 Skill을 처음 연결할 때 사용하는 기본값입니다. 기존 Agent 바인딩은 고정된 버전을 유지합니다.
        - name: status
          type: string
          required: false
          description: active 또는 disabled.
        - name: metadata
          type: object | null
          required: false
          description: market 네임스페이스 아래의 표시용 메타데이터만 허용됩니다(최대 16 KiB). row_version이 필요하며 metadata 객체를 대체합니다. 알 수 없는 네임스페이스나 필드는 400을 반환합니다. 아래 메타데이터 예시를 참고하세요.
        - name: row_version
          type: integer
          required: false
          description: Skill 조회에서 얻은 현재 row_version입니다. 오래된 값은 409 conflict를 반환하며, metadata가 있을 때 필수입니다.
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

## 메타데이터 예시 {#metadata-example}

현재 `row_version`과 전체 메타데이터 객체를 함께 보냅니다.

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

Market 메타데이터는 표시용으로 Skill을 설명합니다. 서버를 설치하거나, 자격 증명을 부여하거나, Agent의 MCP 선택을 변경하지 않습니다. `metadata: {}` 또는 `metadata: null`로 지울 수 있으며, 두 경우 모두 `row_version`이 필요합니다.
