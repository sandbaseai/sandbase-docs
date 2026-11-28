---
i18nSource: 91ce9f65766e9662
title: Создать сессию
description: Создание сессии для сохранённого или встроенного Agent через POST /v1/agents/sessions, при необходимости с потоковой передачей первого хода.
aside: false
outline: false
apiReference:
  title: Создать сессию
  operation: Sessions
  method: POST
  path: /v1/agents/sessions
  description: Создаёт сессию для сохранённой версии Agent или для встроенного Agent, определённого в запросе. Конфигурация Agent, версии Skills и MCP-подключения фиксируются на всё время жизни сессии. Сессии всегда выполняются в облаке SandBase, поэтому среду выполнения выбирать не нужно. При stream=true и наличии начального ввода ответом будет поток Server-Sent Events первого хода с кодом 201 вместо JSON-объекта сессии. Здесь же проверяется допуск к выполнению (баланс и статус организации). OpenAI SDK требует аргумент environment; см. Совместимость с OpenAI (/agents/openai-compatibility).
  groups:
    - title: Заголовки
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Необязательно. Если не указан, сервис генерирует ключ сам, поэтому повторный запрос может создать дубликат. Для повторных попыток передавайте собственный стабильный ключ.
    - title: Тело запроса
      description: Строгий JSON-объект.
      fields:
        - name: agent_id
          type: string
          required: false
          description: ID сохранённого Agent (префикс agt_). Agent должен быть active, а projection_status — ready. Передайте agent_id, agent или оба.
        - name: agent
          type: object
          required: false
          description: "Конфигурация Agent. Допустимые поля: model, instructions, runtime_profile (codex, claude или mcode; по умолчанию codex), service_tier, tools, text, reasoning и multi_agent; они проверяются так же, как в Create Agent. Без agent_id поле определяет встроенный Agent, и model обязателен; у встроенных Agents нет Skills и MCP-подключений. С agent_id каждое переданное поле заменяет соответствующее поле сохранённой версии только для этой сессии. Неизвестные поля возвращают 400."
        - name: version
          type: integer
          required: false
          description: Версия Agent. По умолчанию — текущая версия. Не допускается для встроенного Agent.
        - name: title
          type: string
          required: false
          description: Заголовок сессии.
        - name: input
          type: string | array
          required: false
          description: 'Необязательный первый ввод: строка или массив ровно с одним сообщением, например [{"role":"user","content":[{"type":"input_text","text":"…"}]}]. Отдельный объект возвращает 400.'
        - name: model
          type: string
          required: false
          description: Переопределение модели. agent.model — форма OpenAI SDK; если переданы оба, они должны совпадать.
        - name: metadata
          type: object
          required: false
          description: До 16 строковых пар.
        - name: stream
          type: boolean
          required: false
          description: "При true требует непустой input и возвращает 201 с телом text/event-stream. События используют формат Stream events (event: <type>, data: <json>); первое событие, agent.session.created, содержит снимок сессии, за ним следуют события элементов и вывода хода. Ошибки валидации, допуска и прочие ошибки до начала потока возвращаются как обычная JSON-ошибка. По умолчанию false."
        - name: environment
          type: object
          required: false
          description: Только для совместимости с OpenAI SDK. В прямых HTTP-вызовах не указывайте; {"type":"openai_hosted"} принимается, любой другой type возвращает 400.
        - name: model_provider
          type: object
          required: false
          description: Учётные данные модели. Не указывайте, чтобы использовать вызывающий API-ключ. {"type":"custom","base_url":"https://…","api_key":"…"} вызывает ваш собственный OpenAI-совместимый эндпоинт. Только для записи.
        - name: github_workspace
          type: object
          required: false
          description: 'Репозиторий GitHub, клонируемый в /workspace для этой сессии: {"repository_id":"1195090324","ref":"main","connection_id":"plc_…"}. Обязателен только repository_id; ref по умолчанию — ветка по умолчанию. Если поле опущено или равно null, используется репозиторий рабочего пространства Agent, если он есть, иначе ничего не клонируется. Репозиторий должен входить в область GitHub-подключения Agent. См. Рабочее пространство из репозитория GitHub (/agents/github-workspace).'
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
