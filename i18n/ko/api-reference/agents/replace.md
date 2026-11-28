---
i18nSource: 4e711691737c9671
title: Agent 교체(CAS)
description: row_version에 대한 compare-and-set으로 Agent를 업데이트합니다.
aside: false
outline: false
apiReference:
  title: Agent 교체(CAS)
  operation: Agents
  method: PATCH
  path: /v1/agents/{agent_id}
  description: compare-and-set 방식의 제품 업데이트입니다. row_version은 필수이며 현재 값과 같아야 하고, 그렇지 않으면 409를 반환합니다. 전달한 필드는 저장된 값을 대체하며, 명시적인 null 값은 400을 반환합니다. 여러 편집자가 같은 Agent를 변경할 수 있을 때 이 방식을 사용하세요.
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
      description: row_version과 Agent 필드의 임의 부분 집합입니다.
      fields:
        - name: row_version
          type: integer
          required: true
          description: 마지막으로 읽은 row_version입니다. 오래된 값이면 409를 반환합니다.
        - name: model
          type: string
          required: false
          description: Models API의 모델 ID이며 최대 200자입니다.
        - name: name
          type: string
          required: false
          description: 표시 이름이며 최대 128자입니다.
        - name: instructions
          type: string
          required: false
          description: 시스템 지침이며 최대 256 KiB입니다.
        - name: runtime_profile
          type: string
          required: false
          description: "실행 런타임: codex(기본값), claude 또는 mcode입니다."
        - name: skills
          type: array
          required: false
          description: 'Skill 참조: {"skill_id": "skl_…", "version": null | "<version>"}. 최대 32개입니다. 새 바인딩에서 null은 Agent를 저장할 때의 현재 기본 버전으로 고정합니다. 기존 바인딩에서 null은 고정된 버전을 유지하며, 업그레이드하려면 명시적인 버전을 지정하세요.'
        - name: mcp_connections
          type: array
          required: false
          description: "MCP 참조: {connection_id, server_label, allowed_tools, required}. 최대 32개이며 server_label은 Agent 내에서 고유해야 합니다."
        - name: tools
          type: array
          required: false
          description: function 도구 최대 64개와 web_search 도구 최대 1개입니다. 현재 Session에서는 web_search 모드를 비활성화해야 하며, 클라이언트 측 function 결과는 아직 지원되지 않습니다.
        - name: text
          type: object
          required: false
          description: format.type은 text 또는 json_schema(object 스키마 포함), verbosity는 low, medium 또는 high입니다.
        - name: reasoning
          type: object
          required: false
          description: effort는 none, minimal, low, medium, high, xhigh 또는 max, summary는 concise, detailed 또는 auto입니다.
        - name: service_tier
          type: string
          required: false
          description: auto(기본값), default, flex, priority 또는 fast입니다.
        - name: metadata
          type: object
          required: false
          description: 최대 16개의 문자열 쌍입니다. 키는 최대 64자, 값은 최대 512자입니다.
        - name: description
          type: string
          required: false
          description: 최대 4096자입니다.
        - name: note
          type: string
          required: false
          description: 새 버전에 기록되는 변경 메모입니다.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "row_version": 2,
            "description": "Research Agent used by the weekly brief.",
            "note": "Add description"
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
            "PATCH",
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            headers=headers,
            json={
                "row_version": 2,
                "description": "Research Agent used by the weekly brief.",
                "note": "Add description"
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60', {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "row_version": 2,
            "description": "Research Agent used by the weekly brief.",
            "note": "Add description"
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
        "row_version": 3,
        "projection_status": "ready",
        "runtime_profile": "codex",
        "description": "Research Agent used by the weekly brief.",
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
