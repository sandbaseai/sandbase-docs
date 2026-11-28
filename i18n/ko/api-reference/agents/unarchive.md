---
i18nSource: 0ca7c063b8a050fd
title: Agent 보관 해제
description: row_version으로 Agent 보관을 해제합니다.
aside: false
outline: false
apiReference:
  title: Agent 보관 해제
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}/unarchive
  description: compare-and-set으로 보관된 Agent를 활성 상태로 되돌립니다.
  groups:
    - title: 경로 파라미터
      fields:
        - name: agent_id
          type: string
          required: true
          description: Agent ID(agt_ 접두사)입니다.
    - title: 헤더
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: 선택 사항입니다. 생략하면 서비스가 키를 생성하므로 재시도한 요청이 중복 생성될 수 있습니다. 재시도에는 직접 지정한 고정 키를 보내세요.
    - title: 요청 본문
      description: JSON 객체입니다.
      fields:
        - name: row_version
          type: integer
          required: true
          description: 마지막으로 읽은 row_version입니다. 오래된 값이면 409를 반환합니다.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/unarchive \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
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
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/unarchive",
            headers=headers,
            json={
                "row_version": 3
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/unarchive', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
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
        "version": 3,
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
