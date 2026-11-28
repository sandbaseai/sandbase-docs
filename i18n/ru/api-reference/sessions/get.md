---
i18nSource: be0b17847a19a11c
title: Получить сессию
description: Чтение одной сессии.
aside: false
outline: false
apiReference:
  title: Получить сессию
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}
  description: Чтение сессии. Статус выполнения читается в реальном времени, поэтому для отслеживания прогресса опрашивайте этот эндпоинт или используйте поток событий.
  groups:
    - title: Параметры пути
      fields:
        - name: session_id
          type: string
          required: true
          description: ID сессии (префикс ses_).
    - title: Объект сессии
      description: Возвращается операциями create, get, update, rename, archive и unarchive.
      fields:
        - name: id
          type: string
          required: true
          description: ID сессии с префиксом ses_.
        - name: status
          type: string
          required: true
          description: "Статус выполнения: idle, in_progress или failed. requires_action пока не поддерживается и возвращается как 502 executor_contract_error."
        - name: lifecycle_status
          type: string
          required: true
          description: active или archived. Архивированные сессии не принимают ввод.
        - name: failure
          type: object · null
          required: true
          description: Публичная ошибка с code, message, action и необязательным retryable.
        - name: agent_id · agent_version · model
          type: string · integer · string
          required: true
          description: Зафиксированная версия Agent и действующая модель.
        - name: agent · usage
          type: object · object | null
          required: true
          description: Снимок действующей конфигурации Agent в формате OpenAI и использование токенов (null, пока ход не сообщит об использовании).
        - name: source · source_id
          type: string · null
          required: false
          description: Источник сессии. Сессии, созданные через POST /v1/agents/sessions, возвращают direct и source_id, равный null.
        - name: row_version
          type: integer
          required: true
          description: Токен compare-and-set для rename, archive и unarchive.
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
