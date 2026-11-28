---
i18nSource: dcaf28fee73ca27e
title: Agent 버전 복원
description: 이전 Agent 버전을 새 현재 버전으로 복원합니다.
aside: false
outline: false
apiReference:
  title: Agent 버전 복원
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}/restore
  description: source_version의 구성을 새 현재 버전으로 복사합니다. 기록은 절대 다시 쓰이지 않습니다.
  groups:
    - title: 경로 매개변수
      fields:
        - name: agent_id
          type: string
          required: true
          description: Agent ID(agt_ 접두사).
    - title: 헤더
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: 선택 사항입니다. 생략하면 서비스가 키를 생성하므로 재시도한 요청이 중복을 만들 수 있습니다. 재시도에는 고정된 자체 키를 보내세요.
    - title: 요청 본문
      description: JSON 객체.
      fields:
        - name: source_version
          type: integer
          required: true
          description: 복원할 이전 버전입니다.
        - name: row_version
          type: integer
          required: true
          description: 마지막으로 읽은 row_version입니다. 오래된 값은 409를 반환합니다.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/restore \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "source_version": 1,
            "row_version": 3
          }'
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
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/restore",
            headers=headers,
            json={
                "source_version": 1,
                "row_version": 3
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/restore', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "source_version": 1,
            "row_version": 3
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
        "object": "agent",
        "name": "Research assistant",
        "model": "deepseek/deepseek-v4-flash",
        "instructions": "Answer with cited sources.",
        "tools": [],
        "text": {
          "format": {
            "type": "text"
          },
          "verbosity": "medium"
        },
        "reasoning": {
          "effort": null,
          "summary": null
        },
        "service_tier": "auto",
        "multi_agent": {
          "enabled": false,
          "max_concurrent_subagents": null
        },
        "visibility": "private",
        "status": "active",
        "version": 4,
        "row_version": 4,
        "projection_status": "ready",
        "runtime_profile": "codex",
        "description": "",
        "metadata": {
          "team": "research"
        },
        "mcp_connections": [],
        "skills": [],
        "created_at": 1791273600,
        "updated_at": 1791273600,
        "archived_at": null
      }
---

<ApiReferencePage />
