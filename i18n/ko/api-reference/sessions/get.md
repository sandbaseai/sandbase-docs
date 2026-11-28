---
i18nSource: be0b17847a19a11c
title: Session 조회
description: Session 하나를 조회합니다.
aside: false
outline: false
apiReference:
  title: Session 조회
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}
  description: Session을 조회합니다. 실행 상태는 실시간으로 읽으므로, 진행 상황을 확인하려면 이 엔드포인트를 폴링하거나 이벤트 스트림을 사용하세요.
  groups:
    - title: 경로 매개변수
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID(ses_ 접두사).
    - title: Session 객체
      description: create, get, update, rename, archive, unarchive에서 반환됩니다.
      fields:
        - name: id
          type: string
          required: true
          description: ses_ 접두사가 붙은 Session ID입니다.
        - name: status
          type: string
          required: true
          description: "실행 상태: idle, in_progress 또는 failed. requires_action은 아직 지원되지 않으며 502 executor_contract_error로 나타납니다."
        - name: lifecycle_status
          type: string
          required: true
          description: active 또는 archived. 보관된 Session은 입력을 거부합니다.
        - name: failure
          type: object · null
          required: true
          description: code, message, action, 선택적 retryable을 포함한 공개 실패 정보입니다.
        - name: agent_id · agent_version · model
          type: string · integer · string
          required: true
          description: 고정된 Agent 버전과 실제 적용 모델입니다.
        - name: agent · usage
          type: object · object | null
          required: true
          description: 실제 적용된 Agent 구성의 OpenAI 형식 스냅샷과 토큰 사용량입니다(턴이 사용량을 보고하기 전까지는 null).
        - name: source · source_id
          type: string · null
          required: false
          description: Session의 출처입니다. POST /v1/agents/sessions로 생성한 Session은 direct와 null source_id를 보고합니다.
        - name: row_version
          type: integer
          required: true
          description: rename, archive, unarchive에 사용하는 compare-and-set 토큰입니다.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83 \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        session = client.beta.agents.sessions.retrieve("ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83")
        print(session.status, session.failure)
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
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83', {
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
        "status": "in_progress",
        "lifecycle_status": "active",
        "sync_status": "ready",
        "execution_status": "in_progress",
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
