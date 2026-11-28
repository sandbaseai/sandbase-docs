---
i18nSource: 75530d38a1e4b215
title: Agent 조회
description: ID로 Agent 하나를 조회합니다.
aside: false
outline: false
apiReference:
  title: Agent 조회
  operation: Agents
  method: GET
  path: /v1/agents/{agent_id}
  description: 보관된 Agent를 포함하여 Agent를 조회합니다.
  groups:
    - title: 경로 매개변수
      fields:
        - name: agent_id
          type: string
          required: true
          description: Agent ID(agt_ 접두사).
    - title: Agent 객체
      description: create, get, update, archive, unarchive, restore, clone에서 반환됩니다.
      fields:
        - name: id
          type: string
          required: true
          description: agt_ 접두사가 붙은 Agent ID입니다.
        - name: object
          type: string
          required: true
          description: 항상 agent입니다.
        - name: version
          type: integer
          required: true
          description: 현재 버전입니다. 실제 변경이 있는 쓰기마다 새 버전이 생성됩니다.
        - name: row_version
          type: integer
          required: true
          description: PATCH, archive, unarchive, restore에 사용하는 compare-and-set 토큰입니다.
        - name: status
          type: string
          required: true
          description: active 또는 archived입니다.
        - name: projection_status
          type: string
          required: true
          description: 현재 버전의 실행 준비 상태입니다. Sessions에는 ready가 필요하며, 새 Agent는 잠시 pending으로 표시될 수 있습니다.
        - name: runtime_profile
          type: string
          required: true
          description: codex, claude, mcode 중 하나입니다.
        - name: visibility
          type: string
          required: true
          description: 내 Agent는 private, 카탈로그 항목은 public입니다.
        - name: created_at · updated_at · archived_at
          type: integer · null
          required: true
          description: Unix 초 단위입니다. active 상태에서는 archived_at이 null입니다.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        agent = client.beta.agents.retrieve("agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60")
        print(agent.version, agent.status)
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
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60', {
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
        "version": 1,
        "row_version": 1,
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
