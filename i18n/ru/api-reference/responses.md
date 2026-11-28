---
i18nSource: b5cf676d897d17a3
title: Создание ответа
description: Создайте OpenAI-совместимый ответ модели, в том числе с потоковой передачей и инструментами.
aside: false
outline: false
apiReference:
  title: Создание ответа
  operation: Inference
  method: POST
  path: /v1/responses
  description: Создаёт OpenAI-совместимый ответ модели. SandBase сохраняет поля запроса после сопоставления модели, а затем очищает ответы, оставляя публичные поля OpenAI.
  signature: client.responses.create(params)
  groups:
    - title: Тело запроса
      schema: ResponseCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Идентификатор модели из Models API.
        - name: input
          type: string | object[]
          required: false
          description: Текст, элементы сообщений или другие входные данные, поддерживаемые выбранной моделью и провайдером.
        - name: instructions
          type: string
          required: false
          description: Системная инструкция или инструкция разработчика для ответа.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Возвращать OpenAI-совместимые Server-Sent Events.
        - name: background
          type: boolean
          required: false
          description: Запросить фоновое выполнение, если его поддерживает выбранный провайдер.
        - name: include
          type: string[]
          required: false
          description: Дополнительные публичные данные ответа, если поддерживается.
        - name: max_output_tokens
          type: integer
          required: false
          description: Максимальное число генерируемых токенов.
        - name: max_tool_calls
          type: integer
          required: false
          description: Максимальное число вызовов встроенных инструментов, если поддерживается.
        - name: metadata
          type: object
          required: false
          description: Метаданные запроса, передаваемые провайдеру.
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: Разрешить поддерживаемым моделям вызывать инструменты параллельно.
        - name: previous_response_id
          type: string
          required: false
          description: Предыдущий ответ для продолжения, если это поддерживает выбранный маршрут.
        - name: reasoning
          type: object
          required: false
          description: Настройки рассуждений для поддерживаемых моделей.
        - name: store
          type: boolean
          required: false
          description: Запросить хранение ответа на стороне провайдера, если поддерживается.
        - name: text
          type: object
          required: false
          description: Настройки текстового вывода и структурированного формата.
        - name: tool_choice
          type: string | object
          required: false
          description: Управляет выбором инструментов.
        - name: tools
          type: object[]
          required: false
          description: Инструменты, доступные модели.
        - name: truncation
          type: string
          required: false
          description: Поведение при усечении входных данных.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/responses \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-5.2","input":"Explain immutable infrastructure in one sentence."}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.responses.create(
            model="openai/gpt-5.2",
            input="Explain immutable infrastructure in one sentence.",
        )
        print(response.output_text)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.responses.create({
          model: "openai/gpt-5.2",
          input: "Explain immutable infrastructure in one sentence.",
        });
        console.log(response.output_text);
  response:
    status: 200 OK
    code: |-
      {
        "id": "resp_01...",
        "object": "response",
        "status": "completed",
        "model": "openai/gpt-5.2",
        "output": [],
        "usage": {
          "input_tokens": 18,
          "output_tokens": 12,
          "total_tokens": 30,
          "input_tokens_details": {"cached_tokens": 0},
          "output_tokens_details": {"reasoning_tokens": 0}
        }
      }
  notes:
    - title: Совместимость запросов
      description: SandBase заменяет model на выбранную вышестоящую модель и сохраняет остальные поля запроса. Поддержка у провайдеров всё равно различается.
    - title: Очищенные ответы
      description: Возвращаются только публичные поля ответа OpenAI и данные об использовании токенов. Сведения провайдера об оплате, аккаунте, маршрутизации и неизвестные расширения верхнего уровня удаляются; содержимое элементов вывода сохраняется.
    - title: Потоковая передача
      description: Публичные SSE-события response.* и error очищаются и пересылаются. Неизвестные приватные события отбрасываются; при некорректных данных поток закрывается, чтобы не пересылать небезопасное содержимое.
  errors:
    - status: "400"
      description: Некорректный JSON, отсутствует model или недопустимый запрос к провайдеру.
    - status: "401"
      description: API-ключ отсутствует или недействителен.
    - status: "402"
      description: Достигнут лимит расходов организации или API-ключа.
    - status: "403"
      description: Отказ из-за области действия API-ключа или прав доступа у вышестоящего сервиса.
    - status: "413"
      description: Вышестоящий провайдер отклонил запрос как слишком большой.
    - status: "500"
      description: Сбой жизненного цикла предсказания или поиска организации.
    - status: "502"
      description: Ответ вышестоящего сервиса не удалось безопасно разобрать и очистить.
    - status: "503"
      description: Сбой маршрутизации или исчерпаны все кандидаты среди провайдеров.
---

<ApiReferencePage />
