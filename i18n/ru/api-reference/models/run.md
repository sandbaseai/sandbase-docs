---
i18nSource: efa205ed7505643c
title: Запуск модели или возможности API
description: Отправьте модель или возможность API SandBase на выполнение через единый эндпоинт запуска.
aside: false
outline: false
apiReference:
  title: Запуск модели или возможности API
  operation: Models
  method: POST
  path: /v1/run
  description: Выполняет включённую модель или возможность API SandBase. Поля запроса зависят от возможности; схему выбранной возможности смотрите на справочной странице модели или API на сайте SandBase.
  groups:
    - title: Тело запроса
      fields:
        - name: model
          type: string
          required: true
          description: Идентификатор включённой логической модели или возможности API.
        - name: mode
          type: auto | sync | async | stream
          required: false
          description: Подсказка режима выполнения. `auto` использует значение по умолчанию, настроенное для выбранной возможности; другие значения требуют поддержки со стороны возможности.
        - name: stream
          type: boolean
          required: false
          description: "Запросить потоковый вывод, если выбранная возможность его поддерживает. Эквивалентно `mode: stream`."
        - name: webhook_url
          type: string
          required: false
          description: Необязательный HTTPS-callback для поддерживаемых асинхронных задач с изображениями
          video: null
          or audio tasks. See the Webhooks reference for validation and delivery behavior.: null
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/run \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-image-2","prompt":"A studio product photo on a clean white background"}'
  response:
    status: 200 OK or 202 Accepted
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "pending"
      }
---

<ApiReferencePage />

## Выполнение и результаты {#execution-and-results}

Синхронные возможности возвращают готовый ответ на исходный запрос. Асинхронные возможности возвращают `202 Accepted` с непрозрачным `id`; опрашивайте [Получение асинхронного запуска](./run-get), пока статус не станет конечным.

Поля запроса и форма вывода, специфичные для возможности, описаны на странице выбранной модели или операции API. Передавайте эти поля на верхнем уровне тела JSON; не оборачивайте их в объект `input`. Не рассчитывайте на то, что все возможности принимают одинаковые параметры.

## Webhook-callback {#webhook-callbacks}

Задавайте `webhook_url` только для поддерживаемых асинхронных задач с изображениями, видео или аудио. После завершения или сбоя SandBase отправляет итоговое событие запуска на HTTPS-эндпоинт; callback служит подсказкой о доставке и не заменяет `GET /v1/run/{id}`. Всегда продолжайте опрашивать эндпоинт запуска для получения достоверного статуса и безопасно обрабатывайте задержанные или повторные callback. Синхронные ответы моделей и нативные эндпоинты провайдеров это поле callback не используют.
