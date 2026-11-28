---
i18nSource: 36f9771126ee9243
title: Agent 버전 조회
description: 변경 불가능한 Agent 버전 하나를 조회합니다.
aside: false
outline: false
apiReference:
  title: Agent 버전 조회
  operation: Agents
  method: GET
  path: /v1/agents/{agent_id}/versions/{version}
  description: 버전 스냅샷 하나를 조회합니다. version은 양의 정수여야 하며, 그렇지 않으면 400을 반환합니다. 여기서 created_at은 ISO 8601 문자열이지만 Agent 객체에서는 Unix 초를 사용합니다. note는 해당 버전을 만든 변경 요청에 note가 포함된 경우에만 나타납니다.
  groups:
    - title: 경로 매개변수
      fields:
        - name: agent_id
          type: string
          required: true
          description: Agent ID(agt_ 접두사).
        - name: version
          type: integer
          required: true
          description: 버전 번호이며 1부터 시작합니다.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/versions/1 \
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
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/versions/1",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/versions/1', {
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
        "version": 1,
        "agent": {
          "name": "Research assistant",
          "model": "deepseek/deepseek-v4-flash",
          "instructions": "Answer with cited sources."
        },
        "checksum": "d04d38eb890a1273fa7965a6a7cdc2426232326e43b901d1aad3ed669455acbf",
        "created_at": "2026-10-05T08:00:00.000Z"
      }
---

<ApiReferencePage />
