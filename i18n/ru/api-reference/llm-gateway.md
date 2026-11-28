---
i18nSource: 9ee3d6d77d12e944
title: Chat Completions API
description: Создание OpenAI-совместимых chat completions с языковыми и визуальными моделями SandBase.
aside: false
outline: false
apiReference:
  title: Создать chat completion
  operation: Inference
  method: POST
  path: /v1/chat/completions
  description: Создаёт OpenAI-совместимый chat completion с любой поддерживаемой чат-моделью SandBase. Поля, совместимые с провайдером, сохраняются, если их поддерживает выбранный маршрут.
  signature: client.chat.completions.create(params)
  groups:
    - title: Тело запроса
      schema: ChatCompletionCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Идентификатор модели из Models API.
        - name: messages
          type: object[]
          required: true
          description: "Сообщения диалога с ролями, которые поддерживает выбранный провайдер: обычно system, developer, user, assistant или tool."
        - name: temperature
          type: number
          required: false
          default: "1"
          description: Температура сэмплирования от 0 до 2.
        - name: top_p
          type: number
          required: false
          default: "1"
          description: Порог nucleus-сэмплирования.
        - name: max_tokens
          type: integer
          required: false
          description: Максимальное число выходных токенов.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Возвращать инкрементальные Server-Sent Events.
        - name: stop
          type: string | string[]
          required: false
          description: Последовательность или последовательности, останавливающие генерацию.
        - name: tools
          type: object[]
          required: false
          description: Определения функций, доступных модели.
        - name: tool_choice
          type: string | object
          required: false
          default: auto
          description: Определяет, выбирается ли инструмент и какой именно.
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: Разрешить поддерживаемым моделям выдавать несколько вызовов инструментов за один ход.
        - name: user
          type: string
          required: false
          description: Совместимый с провайдером идентификатор конечного пользователя.
        - name: response_format
          type: object
          required: false
          description: Настройка вывода в виде JSON-объекта или по JSON Schema.
        - name: reasoning_effort
          type: string
          required: false
          description: Совместимая с провайдером настройка интенсивности рассуждений.
        - name: reasoning
          type: object
          required: false
          description: Настройка рассуждений, например effort или max_tokens.
        - name: thinking
          type: object
          required: false
          description: Настройка thinking, например type или budget_tokens.
        - name: extra_body
          type: object
          required: false
          description: Параметры конкретного провайдера для маршрутов, требующих преобразования протокола.
        - name: n
          type: integer
          required: false
          default: "1"
          description: Число генерируемых вариантов ответа.
        - name: presence_penalty
          type: number
          required: false
          default: "0"
          description: Штраф за присутствие от -2 до 2.
        - name: frequency_penalty
          type: number
          required: false
          default: "0"
          description: Штраф за частоту от -2 до 2.
        - name: stream_options
          type: object
          required: false
          description: Параметры потоковой передачи, например include_usage.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/chat/completions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"deepseek/deepseek-v4-flash","messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(response.choices[0].message.content)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.chat.completions.create({
          model: "deepseek/deepseek-v4-flash",
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(response.choices[0].message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "chatcmpl_01...",
        "object": "chat.completion",
        "model": "deepseek/deepseek-v4-flash",
        "choices": [{
          "index": 0,
          "message": { "role": "assistant", "content": "Hello! How can I help?" },
          "finish_reason": "stop"
        }],
        "usage": { "prompt_tokens": 8, "completion_tokens": 7, "total_tokens": 15 }
      }
  notes:
    - title: Потоковая передача и инструменты
      description: "Установите stream в true для SSE; поток завершается строкой data: [DONE]. Добавьте stream_options.include_usage, чтобы получить финальный фрагмент с usage. Вызовы инструментов и мультимодальный контент соответствуют OpenAI-совместимой схеме."
    - title: Совместимость с провайдерами
      description: На маршрутах с тем же протоколом SandBase сохраняет дополнительные совместимые поля. Поддержка полей при смене протокола и полей конкретных провайдеров различается; при необходимости используйте extra_body.
  errors:
    - status: "400"
      description: Недопустимое тело запроса или неподдерживаемый параметр.
    - status: "401"
      description: API-ключ отсутствует или недействителен.
    - status: "402"
      description: Достигнут лимит расходов организации.
    - status: "404"
      description: Модель не найдена или недоступна.
    - status: "429"
      description: Превышен лимит запросов.
    - status: "500"
      description: Ошибка сохранения запроса или поиска организации.
    - status: "502"
      description: Выбранный провайдер вернул недопустимый ответ.
    - status: "503"
      description: Ни один маршрут провайдера не завершился успешно.
---

<ApiReferencePage />
