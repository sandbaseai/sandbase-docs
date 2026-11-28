---
i18nSource: 1b680f7f0804feb7
title: Обновить Agent
description: Частичное обновление Agent через POST-обновление в стиле OpenAI SDK.
aside: false
outline: false
apiReference:
  title: Обновить Agent
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}
  description: Частичное обновление в стиле SDK. Переданные поля заменяют сохранённые значения и создают новую версию; опущенные поля сохраняют свои значения. row_version не нужен. description и note здесь не принимаются; для них используйте Replace (PATCH). Для архивированных Agents возвращается 404.
  groups:
    - title: Параметры пути
      fields:
        - name: agent_id
          type: string
          required: true
          description: ID Agent (префикс agt_).
    - title: Заголовки
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Необязательно. Если не указан, сервис генерирует ключ сам, поэтому повторный запрос может создать дубликат. Для повторных попыток передавайте собственный стабильный ключ.
    - title: Тело запроса
      description: Любое подмножество этих полей. Другие поля возвращают 400.
      fields:
        - name: model
          type: string
          required: false
          description: ID модели из Models API, до 200 символов.
        - name: name
          type: string
          required: false
          description: Отображаемое имя, до 128 символов.
        - name: instructions
          type: string
          required: false
          description: Системные инструкции, до 256 KiB.
        - name: runtime_profile
          type: string
          required: false
          description: "Среда выполнения: codex (по умолчанию), claude или mcode."
        - name: skills
          type: array
          required: false
          description: 'Ссылки на Skills: {"skill_id": "skl_…", "version": null | "<version>"}. До 32. Для новой привязки null при сохранении Agent закрепляет текущую версию по умолчанию. Для существующей привязки null сохраняет закреплённую версию; для обновления укажите версию явно.'
        - name: mcp_connections
          type: array
          required: false
          description: "Ссылки на MCP: {connection_id, server_label, allowed_tools, required}. До 32; server_label должен быть уникальным в пределах Agent."
        - name: tools
          type: array
          required: false
          description: До 64 инструментов function и не более одного инструмента web_search. Сейчас сессии требуют, чтобы режим web_search был disabled, а результаты function на стороне клиента пока не поддерживаются.
        - name: text
          type: object
          required: false
          description: "format.type: text или json_schema (со схемой объекта); verbosity: low, medium или high."
        - name: reasoning
          type: object
          required: false
          description: "effort: none, minimal, low, medium, high, xhigh или max; summary: concise, detailed или auto."
        - name: service_tier
          type: string
          required: false
          description: auto (по умолчанию), default, flex, priority или fast.
        - name: metadata
          type: object
          required: false
          description: До 16 строковых пар; ключи до 64, значения до 512 символов.
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
