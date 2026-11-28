---
i18nSource: 1b680f7f0804feb7
title: Agent 업데이트
description: OpenAI SDK 방식의 POST 업데이트로 Agent를 부분 업데이트합니다.
aside: false
outline: false
apiReference:
  title: Agent 업데이트
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}
  description: SDK 방식의 부분 업데이트입니다. 지정한 필드는 저장된 값을 대체하고 새 버전을 생성하며, 생략한 필드는 기존 값을 유지합니다. row_version은 필요하지 않습니다. 여기서는 description과 note를 사용할 수 없으므로 이 필드는 Replace(PATCH)를 사용하세요. 보관된 Agent는 404를 반환합니다.
  groups:
    - title: 경로 파라미터
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
          description: 선택 사항입니다. 생략하면 서비스가 키를 생성하므로 재시도한 요청이 중복을 만들 수 있습니다. 재시도할 때는 고정된 키를 직접 보내세요.
    - title: 요청 본문
      description: 다음 필드 중 원하는 필드만 보낼 수 있습니다. 그 밖의 필드는 400을 반환합니다.
      fields:
        - name: model
          type: string
          required: false
          description: Models API의 모델 ID, 최대 200자.
        - name: name
          type: string
          required: false
          description: 표시 이름, 최대 128자.
        - name: instructions
          type: string
          required: false
          description: 시스템 지침, 최대 256 KiB.
        - name: runtime_profile
          type: string
          required: false
          description: "실행 런타임: codex(기본값), claude, mcode 중 하나."
        - name: skills
          type: array
          required: false
          description: 'Skill 참조: {"skill_id": "skl_…", "version": null | "<version>"}. 최대 32개. 새 바인딩에서 null은 Agent 저장 시점의 현재 기본 버전으로 고정됩니다. 기존 바인딩에서 null은 고정된 버전을 유지하며, 업그레이드하려면 버전을 명시하세요.'
        - name: mcp_connections
          type: array
          required: false
          description: "MCP 참조: {connection_id, server_label, allowed_tools, required}. 최대 32개. server_label은 Agent 내에서 고유해야 합니다."
        - name: tools
          type: array
          required: false
          description: 최대 64개의 function 도구와 최대 1개의 web_search 도구. 현재 Session에서는 web_search 모드를 disabled로 설정해야 하며, 클라이언트 측 function 결과는 아직 지원되지 않습니다.
        - name: text
          type: object
          required: false
          description: format.type은 text 또는 json_schema(객체 스키마 포함), verbosity는 low, medium, high 중 하나.
        - name: reasoning
          type: object
          required: false
          description: effort는 none, minimal, low, medium, high, xhigh, max 중 하나, summary는 concise, detailed, auto 중 하나.
        - name: service_tier
          type: string
          required: false
          description: auto(기본값), default, flex, priority, fast 중 하나.
        - name: metadata
          type: object
          required: false
          description: 최대 16개의 문자열 쌍. 키는 최대 64자, 값은 최대 512자.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "instructions": "Answer in five bullet points with cited sources."
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        agent = client.beta.agents.update(
            "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            instructions="Answer in five bullet points with cited sources.",
        )
        print(agent.version)
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
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            headers=headers,
            json={
                "instructions": "Answer in five bullet points with cited sources."
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "instructions": "Answer in five bullet points with cited sources."
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
        "instructions": "Answer in five bullet points with cited sources.",
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
        "version": 2,
        "row_version": 2,
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
