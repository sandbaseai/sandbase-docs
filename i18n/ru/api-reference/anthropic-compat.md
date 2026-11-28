---
i18nSource: 04f3657850b71e58
title: Создать сообщение Anthropic
description: Создание Anthropic-совместимого сообщения с моделью SandBase.
aside: false
outline: false
apiReference:
  title: Создать сообщение Anthropic
  operation: Inference
  method: POST
  path: /v1/messages
  description: Создаёт сообщение через Anthropic-совместимый эндпоинт Messages в SandBase. SandBase сопоставляет модель для выбранного провайдера и сохраняет совместимые поля запроса и ответа.
  signature: client.messages.create(params)
  groups:
    - title: Заголовки запроса
      fields:
        - name: x-api-key
          type: string
          required: false
          description: "API-ключ SandBase. Также принимается Authorization: Bearer; если указаны оба, приоритет у x-api-key."
        - name: anthropic-version
          type: string
          required: false
          default: 2023-06-01
          description: Версия Anthropic API, передаваемая провайдеру. Если не указана, SandBase подставляет 2023-06-01.
        - name: anthropic-beta
          type: string
          required: false
          description: Идентификаторы бета-функций через запятую; поддержка зависит от совместимости провайдера.
    - title: Тело запроса
      schema: MessageCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Anthropic-совместимый идентификатор модели.
        - name: messages
          type: object[]
          required: true
          description: Сообщения пользователя и ассистента с текстом или типизированными блоками контента.
        - name: max_tokens
          type: integer
          required: true
          description: Максимальное количество выходных токенов.
        - name: system
          type: string | object[]
          required: false
          description: Системная инструкция верхнего уровня.
        - name: temperature
          type: number
          required: false
          default: "1"
          description: Температура сэмплирования от 0 до 1.
        - name: top_p
          type: number
          required: false
          description: Порог nucleus-сэмплирования.
        - name: top_k
          type: integer
          required: false
          description: Ограничение сэмплирования top K токенами.
        - name: stop_sequences
          type: string[]
          required: false
          description: Пользовательские последовательности, останавливающие генерацию.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Возвращать Server-Sent Events в стиле Anthropic.
        - name: metadata
          type: object
          required: false
          description: Метаданные запроса, включая необязательный user_id.
        - name: tools
          type: object[]
          required: false
          description: Определения инструментов, доступных модели.
        - name: tool_choice
          type: object
          required: false
          description: Управляет выбором инструментов.
        - name: thinking
          type: object
          required: false
          description: Настройка расширенного мышления для поддерживаемых моделей.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/messages \
          -H "x-api-key: $SANDBASE_API_KEY" \
          -H "anthropic-version: 2023-06-01" \
          -H "Content-Type: application/json" \
          -d '{"model":"anthropic/claude-sonnet-4","max_tokens":256,"messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from anthropic import Anthropic

        client = Anthropic(api_key="sk-sb-...", base_url="https://api.sandbase.ai")
        message = client.messages.create(
            model="anthropic/claude-sonnet-4",
            max_tokens=256,
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(message.content[0].text)
    - label: TypeScript
      language: typescript
      code: |-
        import Anthropic from "@anthropic-ai/sdk";

        const client = new Anthropic({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai" });
        const message = await client.messages.create({
          model: "anthropic/claude-sonnet-4",
          max_tokens: 256,
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "msg_01...",
        "type": "message",
        "role": "assistant",
        "model": "anthropic/claude-sonnet-4",
        "content": [{ "type": "text", "text": "Hello! How can I help?" }],
        "stop_reason": "end_turn",
        "usage": { "input_tokens": 8, "output_tokens": 7 }
      }
  notes:
    - title: Аутентификация
      description: "Используйте x-api-key или Authorization: Bearer. Если указаны оба, приоритет у x-api-key."
    - title: Прозрачный протокол
      description: Помимо сопоставления моделей и настроенных правил совместимости провайдеров, SandBase передаёт совместимые поля запроса, ответы без потоковой передачи и SSE-события без преобразования протокола.
    - title: Бета-функции
      description: anthropic-beta передаётся, если указан. Правила совместимости кандидата могут удалить неподдерживаемые бета-поля или пропустить этого кандидата.
  errors:
    - status: "400"
      description: Некорректное тело запроса или неподдерживаемая функция.
    - status: "401"
      description: API-ключ отсутствует или недействителен.
    - status: "402"
      description: Достигнут лимит расходов организации.
    - status: "403"
      description: Достигнут лимит расходов API Key или недостаточно прав организации.
    - status: "404"
      description: Модель не найдена или недоступна.
    - status: "413"
      description: Провайдер отклонил запрос как слишком большой.
    - status: "429"
      description: Превышен лимит запросов провайдера.
    - status: "500"
      description: Ошибка жизненного цикла предсказания или провайдера.
    - status: "502"
      description: Поток от провайдера завершился до получения пригодного контента.
    - status: "503"
      description: Ошибка маршрутизации или все кандидаты-провайдеры недоступны.
---

<ApiReferencePage />
