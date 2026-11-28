---
i18nSource: 4e711691737c9671
title: Заменить Agent (CAS)
description: Обновление Agent по принципу compare-and-set с row_version.
aside: false
outline: false
apiReference:
  title: Заменить Agent (CAS)
  operation: Agents
  method: PATCH
  path: /v1/agents/{agent_id}
  description: Обновление продукта по принципу compare-and-set. row_version обязателен и должен совпадать с текущим значением, иначе возвращается 409. Переданные поля заменяют сохранённые значения; явные значения null возвращают 400. Используйте этот вариант, когда один и тот же Agent могут изменять несколько редакторов.
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
      description: row_version и любое подмножество полей Agent.
      fields:
        - name: row_version
          type: integer
          required: true
          description: Последнее прочитанное значение row_version. Устаревшее значение возвращает 409.
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
          description: Системные инструкции, до 256 КиБ.
        - name: runtime_profile
          type: string
          required: false
          description: "Среда выполнения: codex (по умолчанию), claude или mcode."
        - name: skills
          type: array
          required: false
          description: 'Ссылки на Skills: {"skill_id": "skl_…", "version": null | "<version>"}. До 32. Для новой привязки null фиксирует текущую версию по умолчанию на момент сохранения Agent. Для существующей привязки null сохраняет зафиксированную версию; чтобы обновиться, укажите версию явно.'
        - name: mcp_connections
          type: array
          required: false
          description: "Ссылки на MCP: {connection_id, server_label, allowed_tools, required}. До 32; server_label должен быть уникальным в пределах Agent."
        - name: tools
          type: array
          required: false
          description: До 64 инструментов-функций и не более одного инструмента web_search. Сейчас сессии требуют отключённого режима web_search, а результаты функций на стороне клиента пока не поддерживаются.
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
          description: До 4096 символов.
        - name: note
          type: string
          required: false
          description: Примечание к изменению, записываемое в новую версию.
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
