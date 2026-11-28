---
i18nSource: 91ce9f65766e9662
title: Session 생성
description: POST /v1/agents/sessions로 저장된 Agent 또는 인라인 Agent의 Session을 생성하며, 첫 번째 턴을 스트리밍할 수도 있습니다.
aside: false
outline: false
apiReference:
  title: Session 생성
  operation: Sessions
  method: POST
  path: /v1/agents/sessions
  description: 저장된 Agent 버전 또는 요청에서 정의한 인라인 Agent의 Session을 생성합니다. Agent 구성, Skill 버전, MCP 연결은 Session이 유지되는 동안 고정됩니다. Session은 항상 SandBase의 호스팅 클라우드에서 실행되므로 실행 환경을 선택할 필요가 없습니다. stream=true와 초기 입력을 함께 보내면 JSON Session 대신 첫 번째 턴의 201 Server-Sent Events 스트림이 응답으로 반환됩니다. 실행 허용 여부(잔액 및 조직 상태)는 이 단계에서 확인합니다. OpenAI SDK에는 environment 인수가 필요합니다. OpenAI 호환성(/agents/openai-compatibility)을 참고하세요.
  groups:
    - title: 헤더
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: 선택 사항입니다. 생략하면 서비스가 키를 생성하므로 재시도한 요청이 중복을 만들 수 있습니다. 재시도할 때는 고정된 키를 직접 보내세요.
    - title: 요청 본문
      description: 엄격한 JSON 객체.
      fields:
        - name: agent_id
          type: string
          required: false
          description: 저장된 Agent ID(agt_ 접두사). Agent는 active 상태이고 projection_status가 ready여야 합니다. agent_id, agent 중 하나 또는 둘 다 보내세요.
        - name: agent
          type: object
          required: false
          description: Agent 구성. 허용되는 필드는 model, instructions, runtime_profile(codex, claude, mcode 중 하나, 기본값 codex), service_tier, tools, text, reasoning, multi_agent이며, Create Agent와 동일하게 검증됩니다. agent_id 없이 보내면 인라인 Agent를 정의하며 model이 필요합니다. 인라인 Agent에는 Skills나 MCP 연결이 포함되지 않습니다. agent_id와 함께 보내면 전송한 각 필드가 이 Session에 한해 저장된 버전의 해당 필드를 대체합니다. 알 수 없는 필드는 400을 반환합니다.
        - name: version
          type: integer
          required: false
          description: Agent 버전. 기본값은 현재 버전입니다. 인라인 Agent에는 사용할 수 없습니다.
        - name: title
          type: string
          required: false
          description: Session 제목.
        - name: input
          type: string | array
          required: false
          description: '선택적 첫 입력: 문자열 또는 메시지가 정확히 하나인 배열. 예: [{"role":"user","content":[{"type":"input_text","text":"…"}]}]. 배열로 감싸지 않은 객체는 400을 반환합니다.'
        - name: model
          type: string
          required: false
          description: 모델 재정의. agent.model은 OpenAI SDK 형식이며, 둘 다 보내는 경우 값이 일치해야 합니다.
        - name: metadata
          type: object
          required: false
          description: 최대 16개의 문자열 쌍.
        - name: stream
          type: boolean
          required: false
          description: "true이면 비어 있지 않은 input이 필요하며, text/event-stream 본문과 함께 201을 반환합니다. 이벤트는 Stream events 형식(event: <type>, data: <json>)을 따릅니다. 첫 번째 이벤트인 agent.session.created에는 Session 스냅샷이 담기며, 그 뒤로 해당 턴의 항목 및 출력 이벤트가 이어집니다. 스트림이 시작되기 전에 발생한 검증, 허용 여부 확인 및 기타 오류는 일반 JSON 오류로 반환됩니다. 기본값은 false입니다."
        - name: environment
          type: object
          required: false
          description: OpenAI SDK 호환성 전용입니다. 직접 HTTP를 호출할 때는 생략하세요. {"type":"openai_hosted"}는 허용되며, 다른 type은 400을 반환합니다.
        - name: model_provider
          type: object
          required: false
          description: 모델 자격 증명. 생략하면 호출에 사용한 API 키를 사용합니다. {"type":"custom","base_url":"https://…","api_key":"…"}를 지정하면 자체 OpenAI 호환 엔드포인트를 호출합니다. 쓰기 전용입니다.
        - name: github_workspace
          type: object
          required: false
          description: '이 Session에서 /workspace에 클론할 GitHub 저장소: {"repository_id":"1195090324","ref":"main","connection_id":"plc_…"}. repository_id만 필수이며, ref의 기본값은 기본 브랜치입니다. 생략하거나 null이면 Agent의 워크스페이스 저장소가 있을 경우 이를 사용하고, 없으면 아무것도 클론하지 않습니다. 저장소는 Agent의 GitHub 연결 범위 안에 있어야 합니다. GitHub 저장소 워크스페이스(/agents/github-workspace)를 참고하세요.'
    - title: Session 객체
      description: create, get, update, rename, archive, unarchive가 반환합니다.
      fields:
        - name: id
          type: string
          required: true
          description: ses_ 접두사가 붙은 Session ID.
        - name: status
          type: string
          required: true
          description: "실행 상태: idle, in_progress, failed 중 하나. requires_action은 아직 지원되지 않으며 502 executor_contract_error로 표시됩니다."
        - name: lifecycle_status
          type: string
          required: true
          description: active 또는 archived. 보관된 Session은 입력을 거부합니다.
        - name: failure
          type: object · null
          required: true
          description: code, message, action, 선택적 retryable을 포함한 공개 실패 정보.
        - name: agent_id · agent_version · model
          type: string · integer · string
          required: true
          description: 고정된 Agent 버전과 실제 적용되는 모델.
        - name: agent · usage
          type: object · object | null
          required: true
          description: 실제 적용되는 Agent 구성의 OpenAI 형식 스냅샷과 토큰 사용량(턴에서 사용량을 보고하기 전까지는 null).
        - name: source · source_id
          type: string · null
          required: false
          description: Session의 출처. POST /v1/agents/sessions로 생성한 Session은 direct와 null source_id를 보고합니다.
        - name: row_version
          type: integer
          required: true
          description: rename, archive, unarchive에 사용하는 compare-and-set 토큰.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/sessions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: market-scan-2026-10-06" \
          -H "Content-Type: application/json" \
          -d '{
            "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            "title": "Market scan"
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        session = client.beta.agents.sessions.create(
            agent_id="agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
        )
        print(session.id, session.status)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "market-scan-2026-10-06",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents/sessions",
            headers=headers,
            json={
                "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
                "title": "Market scan",
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'market-scan-2026-10-06',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            "title": "Market scan"
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 201 Created
    code: |-
      {
        "id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
        "object": "agent.session",
        "agent": {
          "id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
          "name": "Research assistant",
          "model": "deepseek/deepseek-v4-flash",
          "instructions": "Answer with cited sources.",
          "multi_agent": {"enabled": false, "max_concurrent_subagents": null},
          "reasoning": {"effort": null, "summary": null},
          "service_tier": "auto",
          "text": {"format": {"type": "text"}, "verbosity": "medium"},
          "tools": []
        },
        "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
        "agent_version": 1,
        "title": "Market scan",
        "model": "deepseek/deepseek-v4-flash",
        "environment": {
          "id": "env_…",
          "type": "openai_hosted",
          "capability_directories": [],
          "files": [],
          "network": {"access": "enabled", "allowed_domains": []},
          "packages": {"npm": [], "python": [], "system": []},
          "plugins": [],
          "skills": []
        },
        "metadata": {},
        "status": "idle",
        "lifecycle_status": "active",
        "sync_status": "ready",
        "execution_status": "idle",
        "failure": null,
        "row_version": 1,
        "required_actions": [],
        "vault_ids": [],
        "usage": null,
        "created_at": 1791273600,
        "last_active_at": 1791273600,
        "updated_at": 1791273600,
        "archived_at": null,
        "source": "direct",
        "source_id": null
      }
---

<ApiReferencePage />
