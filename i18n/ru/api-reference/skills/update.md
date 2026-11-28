---
i18nSource: 996f166544016111
title: Обновить Skill
description: Изменение версии по умолчанию, статуса или метаданных Skill.
aside: false
outline: false
apiReference:
  title: Обновить Skill
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}
  description: Изменяет default_version, status или метаданные market. row_version обязателен, если передаются metadata; в остальных случаях используется текущее значение.
  groups:
    - title: Параметры пути
      fields:
        - name: skill_id
          type: string
          required: true
          description: ID Skill (префикс skl_).
    - title: Тело запроса
      description: JSON-объект.
      fields:
        - name: default_version
          type: string
          required: false
          description: Версия по умолчанию при первом подключении этого Skill без явного указания версии. Существующие привязки Agent сохраняют закреплённые версии.
        - name: status
          type: string
          required: false
          description: active или disabled.
        - name: metadata
          type: object | null
          required: false
          description: Метаданные для отображения только в пространстве имён market (до 16 KiB). Требует row_version; заменяет объект metadata. Неизвестные пространства имён или поля возвращают 400. См. пример metadata ниже.
        - name: row_version
          type: integer
          required: false
          description: Текущее значение row_version из Get Skill. Устаревшее значение возвращает 409 conflict; обязательно, если указаны metadata.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "default_version": "2"
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        skill = client.skills.update("skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", default_version="2")
        print(skill.default_version)
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
            "https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
            headers=headers,
            json={
                "default_version": "2"
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "default_version": "2"
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
        "object": "skill",
        "name": "release-notes",
        "description": "Draft release notes from merged changes.",
        "default_version": "2",
        "latest_version": "2",
        "status": "active",
        "visibility": "private",
        "row_version": 3,
        "metadata": {},
        "created_at": 1791273600,
        "updated_at": 1791273600
      }
---

<ApiReferencePage />

## Пример metadata {#metadata-example}

Передайте текущий `row_version` вместе с полным объектом metadata:

```json
{
  "row_version": 3,
  "metadata": {
    "market": {
      "display_name": "Release notes",
      "categories": ["development"],
      "tags": ["releases"],
      "required_endpoints": ["github.issues"],
      "servers": ["github"]
    }
  }
}
```

Метаданные market описывают Skill для отображения. Они не устанавливают сервер, не выдают учётные данные и не меняют выбор MCP у Agent. `metadata: {}` или `metadata: null` очищают их; в обоих случаях `row_version` по-прежнему обязателен.
