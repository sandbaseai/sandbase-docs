---
i18nSource: 06a65ded83bf9438
title: Список файлов рабочего пространства
description: Список текущих файлов рабочего пространства сессии с путём, размером и пагинацией. Этот эндпоинт только для чтения возвращает метаданные файлов.
aside: false
outline: false
apiReference:
  title: Список файлов рабочего пространства
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/workspace-files
  description: Список текущих путей и размеров файлов в одном каталоге рабочего пространства сессии. Это список только метаданных, а не история вложений или содержимое артефактов. Неизвестные или повторяющиеся параметры запроса возвращают 400.
  groups:
    - title: Параметры пути
      fields:
        - name: session_id
          type: string
          required: true
          description: ID сессии (префикс ses_).
    - title: Параметры запроса
      fields:
        - name: path
          type: string
          required: false
          description: Абсолютный каталог /workspace или нормализованный каталог внутри него. Не более 4096 байт; без обхода каталогов, обратных слешей и завершающего слеша.
          default: /workspace
        - name: limit
          type: integer
          required: false
          description: Размер страницы от 1 до 100.
          default: "20"
        - name: order
          type: string
          required: false
          description: "Порядок сортировки путей: asc или desc."
          default: asc
        - name: page
          type: string
          required: false
          description: Непрозрачное значение next из предыдущего ответа. Не указывайте его для первой страницы и не передавайте пустую строку. Не меняйте path, order и limit.
    - title: Поля ответа
      fields:
        - name: object
          type: string
          required: true
          description: Всегда page.
        - name: data
          type: array
          required: true
          description: Файлы текущего каталога, каждый с path и size_bytes. Список не рекурсивный.
        - name: next
          type: string | null
          required: true
          description: Передайте это значение в page, чтобы продолжить; null в конце.
        - name: has_more
          type: boolean
          required: true
          description: Есть ли следующая страница.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "page",
        "data": [
          {
            "path": "/workspace/notes.md",
            "size_bytes": 1024
          }
        ],
        "next": null,
        "has_more": false
      }
---

<ApiReferencePage />

Чтение рабочего пространства может вернуть `workspace_provisioning`, `workspace_environment_missing`, `workspace_cursor_invalid` или `workspace_unavailable`. Если курсор недействителен, начните заново с первой страницы. Чтобы найти сгенерированные результаты для скачивания, используйте [Artifacts](./list-artifacts).
