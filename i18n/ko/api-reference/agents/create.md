---
i18nSource: f3150233afd08b90
title: Agent 생성
description: POST /v1/agents로 저장되고 버전이 관리되는 Agent를 생성합니다.
aside: false
outline: false
apiReference:
  title: Agent 생성
  operation: Agents
  method: POST
  path: /v1/agents
  description: 버전 1로 저장된 Agent를 생성합니다. 본문은 엄격한 JSON이며, 알 수 없는 필드는 400을 반환합니다. multi_agent는 생략하거나 null이어야 합니다.
  groups:
    - title: 헤더
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: 선택 사항입니다. 생략하면 서비스가 키를 생성하므로 재시도한 요청이 중복을 만들 수 있습니다. 재시도에는 직접 지정한 고정 키를 보내세요.
    - title: 요청 본문
      description: JSON 객체입니다.
      fields:
        - name: model
          type: string
          required: true
          description: Models API의 모델 ID로, 필수이며 최대 200자입니다. 기본값이 없으므로 model을 생략하면 400을 반환합니다. 예제에서는 deepseek/deepseek-v4-flash를 사용합니다.
        - name: name
          type: string
          required: false
          description: 표시 이름으로, 최대 128자입니다.
        - name: instructions
          type: string
          required: false
          description: 시스템 지침으로, 최대 256 KiB입니다.
        - name: runtime_profile
          type: string
          required: false
          description: "실행 런타임: codex(기본값), claude, mcode 중 하나입니다."
        - name: skills
          type: array
          required: false
          description: 'Skill 참조: {"skill_id": "skl_…", "version": null | "<version>"}. 최대 32개입니다. 새 바인딩에서 null은 Agent 저장 시점의 현재 기본 버전을 고정합니다. 기존 바인딩에서 null은 고정된 버전을 유지하며, 업그레이드하려면 버전을 명시하세요.'
        - name: mcp_connections
          type: array
          required: false
          description: 'MCP 참조: {connection_id, server_label, allowed_tools, required}. 최대 32개이며, server_label은 Agent 안에서 고유해야 합니다. 생략하면 내장 SandBase 도구({"connection_id": "builtin:sandbase", "server_label": "sandbase_builtin"})가 적용됩니다. 목록을 보내면 이 기본값을 대체하며, []를 보내면 도구가 없는 Agent가 생성됩니다. 내장 SandBase 도구(/agents/mcp-tools#built-in-sandbase-tools)를 참고하세요.'
        - name: tools
          type: array
          required: false
          description: function 도구 최대 64개와 web_search 도구 최대 1개입니다. 현재 Sessions에서는 web_search mode가 비활성화되어 있어야 하며, 클라이언트 측 function 결과는 아직 지원되지 않습니다.
        - name: text
          type: object
          required: false
          description: format.type은 text 또는 json_schema(객체 스키마 포함), verbosity는 low, medium, high 중 하나입니다.
        - name: reasoning
          type: object
          required: false
          description: effort는 none, minimal, low, medium, high, xhigh, max 중 하나, summary는 concise, detailed, auto 중 하나입니다.
        - name: service_tier
          type: string
          required: false
          description: auto(기본값), default, flex, priority, fast 중 하나입니다.
        - name: metadata
          type: object
          required: false
          description: 최대 16개의 문자열 쌍입니다. 키는 최대 64자, 값은 최대 512자입니다.
        - name: description
          type: string
          required: false
          description: 긴 설명으로, 최대 4096자입니다.
        - name: note
          type: string
          required: false
          description: 버전 1에 기록되는 변경 메모입니다.
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
        curl -X POST https://api.sandbase.ai/v1/agents \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: create-research-agent-1" \
          -H "Content-Type: application/json" \
          -d '{
            "name": "Research assistant",
            "model": "deepseek/deepseek-v4-flash",
            "instructions": "Answer with cited sources.",
            "metadata": {
              "team": "research"
            }
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        agent = client.beta.agents.create(
            model="deepseek/deepseek-v4-flash",
            name="Research assistant",
            instructions="Answer with cited sources.",
            metadata={"team": "research"},
        )
        print(agent.id, agent.version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "create-research-agent-1",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents",
            headers=headers,
            json={
                "name": "Research assistant",
                "model": "deepseek/deepseek-v4-flash",
                "instructions": "Answer with cited sources.",
                "metadata": {
                    "team": "research"
                }
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'create-research-agent-1',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "name": "Research assistant",
            "model": "deepseek/deepseek-v4-flash",
            "instructions": "Answer with cited sources.",
            "metadata": {
              "team": "research"
            }
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 201 Created
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
        "mcp_connections": [
          {"connection_id": "builtin:sandbase", "server_label": "sandbase_builtin", "allowed_tools": null, "required": true}
        ],
        "skills": [],
        "created_at": 1791273600,
        "updated_at": 1791273600,
        "archived_at": null
      }
---

<ApiReferencePage />
