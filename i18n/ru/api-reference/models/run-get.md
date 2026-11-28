---
i18nSource: 2ffb24dad49b9c79
title: Получить асинхронный запуск
description: Опрос асинхронного запуска модели или API в SandBase и получение его текущего или итогового результата.
aside: false
outline: false
apiReference:
  title: Получить асинхронный запуск
  operation: Models
  method: GET
  path: /v1/run/{id}
  description: Получение текущего или итогового состояния асинхронного запуска, созданного через POST /v1/run.
  groups:
    - title: Параметры пути
      fields:
        - name: id
          type: string
          required: true
          description: Непрозрачный идентификатор запуска, возвращённый POST /v1/run. Используйте его точно в том виде, в каком он получен; наличие префикса не гарантируется.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/run/opaque-run-id \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "completed",
        "outputs": [{"url":"https://media.sandbase.ai/files/result.png","content_type":"image/png"}]
      }
---

<ApiReferencePage />

## Опрос {#polling}

Для долгих медиа- и API-задач опрашивайте каждые 5–10 секунд. Остановитесь, когда `status` примет значение `completed`, `failed` или `timeout`. Нетерминальный ответ может не содержать `outputs`; считайте ID запуска непрозрачным и не составляйте другой URL статуса.
