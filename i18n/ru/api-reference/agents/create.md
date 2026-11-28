---
i18nSource: f3150233afd08b90
title: Создание Agent
description: Создайте сохранённый Agent с версиями через POST /v1/agents.
aside: false
outline: false
apiReference:
  title: Создание Agent
  operation: Agents
  method: POST
  path: /v1/agents
  description: "Создаёт сохранённый Agent версии 1. Тело запроса — строгий JSON: неизвестные поля возвращают 400. Поле multi_agent нужно опустить или передать null."
  groups:
    - title: Заголовки
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Необязательно. Если не передан, сервис генерирует ключ сам, поэтому повторный запрос может создать дубликат. Для повторов передавайте собственный стабильный ключ.
    - title: Тело запроса
      description: Объект JSON.
      fields:
        - name: model
          type: string
          required: true
          description: Обязательный ID модели из Models API, до 200 символов. Значения по умолчанию нет; без model возвращается 400. В примерах используется deepseek/deepseek-v4-flash.
        - name: name
          type: string
          required: false
          description: Отображаемое имя, до 128 символов.
        - name: instructions
          type: string
          required: false
          description: Системные инструкции, до 256 КиБ.
        - name: runtime_profile
          type: string
          required: false
          description: "Среда выполнения: codex (по умолчанию), claude или mcode."
        - name: skills
          type: array
          required: false
          description: 'Ссылки на Skills: {"skill_id": "skl_…", "version": null | "<version>"}. Не более 32. Для новой привязки null закрепляет текущую версию по умолчанию на момент сохранения Agent. Для существующей привязки null сохраняет закреплённую версию; чтобы обновиться, укажите версию явно.'
        - name: mcp_connections
          type: array
          required: false
          description: 'Ссылки на MCP: {connection_id, server_label, allowed_tools, required}. Не более 32; server_label должен быть уникальным в пределах Agent. Если поле опущено, подключаются встроенные инструменты SandBase ({"connection_id": "builtin:sandbase", "server_label": "sandbase_builtin"}); переданный список заменяет это значение по умолчанию, а [] создаёт Agent без инструментов. См. Встроенные инструменты SandBase (/agents/mcp-tools#built-in-sandbase-tools).'
        - name: tools
          type: array
          required: false
          description: До 64 function-инструментов и не более одного инструмента web_search. Сейчас Sessions требуют отключённого режима web_search, а результаты функций на стороне клиента пока не поддерживаются.
        - name: text
          type: object
          required: false
          description: "format.type: text или json_schema (со схемой-объектом); verbosity: low, medium или high."
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
          description: До 16 строковых пар; ключи до 64 символов, значения до 512 символов.
        - name: description
          type: string
          required: false
          description: Подробное описание, до 4096 символов.
        - name: note
          type: string
          required: false
          description: Примечание об изменениях, записываемое в версию 1.
    - title: Объект Agent
      description: Возвращается методами create, get, update, archive, unarchive, restore и clone.
      fields:
        - name: id
          type: string
          required: true
          description: ID Agent с префиксом agt_.
        - name: object
          type: string
          required: true
          description: Всегда agent.
        - name: version
          type: integer
          required: true
          description: Текущая версия. Каждая фактическая запись создаёт новую версию.
        - name: row_version
          type: integer
          required: true
          description: Токен compare-and-set для PATCH, archive, unarchive и restore.
        - name: status
          type: string
          required: true
          description: active или archived.
        - name: projection_status
          type: string
          required: true
          description: Готовность текущей версии к выполнению. Для Sessions нужен статус ready; новый Agent может недолго сообщать pending.
        - name: runtime_profile
          type: string
          required: true
          description: codex, claude или mcode.
        - name: visibility
          type: string
          required: true
          description: private для ваших Agents; public для записей каталога.
        - name: created_at · updated_at · archived_at
          type: integer · null
          required: true
          description: Unix-время в секундах. archived_at равно null, пока Agent активен.
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
