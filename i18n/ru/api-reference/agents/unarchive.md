---
i18nSource: 0ca7c063b8a050fd
title: Разархивировать Agent
description: Разархивирование Agent с row_version.
aside: false
outline: false
apiReference:
  title: Разархивировать Agent
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}/unarchive
  description: Возвращает архивированный Agent в активное состояние по принципу compare-and-set.
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
      description: JSON-объект.
      fields:
        - name: row_version
          type: integer
          required: true
          description: Последнее прочитанное значение row_version. Устаревшее значение возвращает 409.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/unarchive \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "row_version": 3
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
            "POST",
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/unarchive",
            headers=headers,
            json={
                "row_version": 3
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/unarchive', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "row_version": 3
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
        "row_version": 4,
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
