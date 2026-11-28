---
i18nSource: 270917aea416aa76
title: Список артефактов Session
description: Получите список сохранённых выходных артефактов Session с курсорной пагинацией, непрозрачными ID, размерами файлов и ссылками на скачивание.
aside: false
outline: false
apiReference:
  title: Список артефактов Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts
  description: Возвращает список неизменяемых сгенерированных результатов этой Session. ID артефактов — непрозрачные дескрипторы в пределах Session; передавайте полученный ID в эндпоинт скачивания без изменений. Неизвестные или повторяющиеся параметры запроса возвращают 400.
  groups:
    - title: Параметры пути
      fields:
        - name: session_id
          type: string
          required: true
          description: ID Session (префикс ses_).
    - title: Параметры запроса
      fields:
        - name: limit
          type: integer
          required: false
          description: Размер страницы от 1 до 100; недопустимые значения возвращают 400.
          default: "20"
        - name: order
          type: string
          required: false
          description: asc или desc.
          default: desc
        - name: after
          type: string
          required: false
          description: ID артефакта, возвращённый как last_id на предыдущей странице. При продолжении сохраняйте тот же порядок.
    - title: Объект артефакта
      fields:
        - name: object
          type: string
          required: true
          description: Всегда agent.session.artifact.
        - name: id
          type: string
          required: true
          description: Непрозрачный дескриптор art_. Не создавайте и не декодируйте его.
        - name: session_id
          type: string
          required: true
          description: ID Session-владельца.
        - name: path
          type: string
          required: true
          description: Путь к сгенерированному результату внутри /workspace/outputs/.
        - name: size_bytes
          type: integer
          required: true
          description: Размер артефакта в байтах.
        - name: created_at
          type: integer
          required: true
          description: Время создания в Unix-секундах.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "list",
        "data": [
          {
            "object": "agent.session.artifact",
            "id": "art_example_handle",
            "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            "path": "/workspace/outputs/report.md",
            "size_bytes": 1024,
            "created_at": 1791273600
          }
        ],
        "has_more": false,
        "first_id": "art_example_handle",
        "last_id": "art_example_handle"
      }
---

<ApiReferencePage />

Дескриптор в примере приведён для иллюстрации. Для [скачивания артефакта](./download-artifact) используйте `id`, возвращённый в ответ на ваш собственный запрос. Если `has_more` равно true, передайте `after=last_id`, чтобы получить следующую страницу. Для пустого списка `first_id` и `last_id` равны null. Отдельный GET-эндпоинт для метаданных артефакта не предоставляется.
