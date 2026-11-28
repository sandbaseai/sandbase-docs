---
i18nSource: 0413109dd629d7d7
title: Список моделей
description: Получите список включённых логических моделей в OpenAI-совместимом формате.
aside: false
outline: false
apiReference:
  title: Список моделей
  operation: Models
  method: GET
  path: /v1/models
  description: Возвращает список включённых логических моделей в OpenAI-совместимом формате.
  groups:
    - title: Параметры запроса
      fields:
        - name: q
          type: string
          required: false
          description: Нечёткий поиск по имени модели, отображаемому имени, вендору и описанию.
        - name: vendor
          type: string
          required: false
          description: Фильтр по вендору, например OpenAI или Anthropic.
        - name: type
          type: string
          required: false
          description: Фильтр по типу модели. По умолчанию llm.
        - name: order
          type: string
          required: false
          description: "Порядок сортировки: sort_order, most-popular, newest или name."
  examples:
    - label: cURL
      language: bash
      code: |-
        curl "https://api.sandbase.ai/v1/models" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "object": "list",
        "data": [
          {
            "id": "openai/gpt-4o",
            "object": "model",
            "created": 1783353600,
            "owned_by": "openai"
          }
        ]
      }
---

<ApiReferencePage />
