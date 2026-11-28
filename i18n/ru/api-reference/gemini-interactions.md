---
i18nSource: 8ddefa727d909bc8
title: Google Gemini Interactions
description: Создание, потоковая передача и опрос Interactions моделей через нативный протокол Google.
aside: false
outline: false
apiReference:
  title: Google Gemini Interactions
  operation: Gemini
  method: POST
  path: /v1beta/interactions
  description: "Создаёт нативный Interaction Google. Проверяйте status даже при HTTP 200: ответ in_progress нужно опрашивать."
  groups:
    - title: Тело запроса
      fields:
        - name: model
          type: string
          required: true
          description: Логическое имя модели SandBase.
        - name: input
          type: string | object | array
          required: true
          description: Нативный ввод Google Interaction.
        - name: stream
          type: boolean
          required: false
          description: Возвращать SSE-события Google Interactions, если модель это поддерживает.
        - name: background
          type: boolean
          required: false
          description: Надёжно отправить запрос и сразу вернуть Interaction, доступный для опроса. Нельзя сочетать с stream.
        - name: previous_interaction_id
          type: string
          required: false
          description: Продолжить с Interaction провайдера с сохранением привязки к провайдеру.
        - name: store
          type: boolean
          required: false
          description: Передать настройку хранения провайдеру без изменений.
        - name: system_instruction
          type: string
          required: false
          description: Нативная системная инструкция.
        - name: tools
          type: array
          required: false
          description: Нативные определения инструментов Google.
        - name: generation_config
          type: object
          required: false
          description: Нативная конфигурация генерации.
        - name: response_format
          type: object | array
          required: false
          description: Запрашиваемый формат ответа.
        - name: response_modalities
          type: array
          required: false
          description: Запрашиваемые модальности вывода.
  examples:
    - label: Background request
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1beta/interactions \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "google/gemini-omni-flash-preview",
            "input": "A red ball rolls across a table, 3 seconds.",
            "background": true,
            "response_format": {"type": "video"}
          }'
  response:
    status: 200 OK
    code: |-
      {
        "id": "job_75b74acd12534b01baba820b",
        "object": "interaction",
        "model": "google/gemini-omni-flash-preview",
        "status": "in_progress"
      }
---

<ApiReferencePage />

## Аутентификация {#authentication}

Используйте `x-goog-api-key`, `Authorization: Bearer …` или параметр запроса `key` — в этом порядке приоритета. Предпочитайте заголовок: учётные данные в строке запроса могут попасть в логи.

## Поддерживаемые модели {#supported-models}

Эндпоинт Interactions — не универсальный маршрут для всех моделей, имя которых в каталоге начинается с `google/`. У модели
должно быть сопоставление с провайдером, совместимым с Interactions. Сейчас SandBase документирует такие совместимые модели:

- Gemini Omni Flash Preview: `google/gemini-omni-flash-preview`
- Gemini Omni 1.1 Flash Preview: `google/gemini-omni-1.1-flash-preview`

Другие модели Google используют другие эндпоинты. Например, Nano Banana Pro и Nano Banana 2 используют
[`/v1beta/models/{model}:generateContent`](/api-reference/gemini-generate-content), а не `/v1beta/interactions`. Неподдерживаемая модель возвращает ошибку, а не направляется
через другой протокол Google.

## Успешный ответ и опрос {#success-and-polling}

Успешная отправка возвращает HTTP `200`, в том числе для фоновой работы и синхронных запросов, у которых истекло ограниченное время ожидания. Всегда проверяйте `status`:

- `completed`, `failed`, `cancelled` и `incomplete` — конечные статусы.
- `in_progress` — выполнение продолжается. Опрашивайте `GET /v1beta/interactions/{id}`; этот путь также может приходить в заголовке `Location`.
- `requires_action` — статус протокола, но SandBase пока не предоставляет эндпоинт подтверждения инструментов, необходимый для продолжения.

ID для опроса — это `id` Interaction провайдера, возвращённый `POST`, а не ID предсказания SandBase. Получать Interaction нужно с тем же API-ключом SandBase, которым он был создан.

```bash
curl https://api.sandbase.ai/v1beta/interactions/job_75b74acd12534b01baba820b \
  -H "x-goog-api-key: $SANDBASE_API_KEY"
```

Неконечные ответы GET не содержат частичного вывода и использования. Конечные ответы могут включать встроенные данные изображений, аудио или видео и занимать несколько мегабайт. Своевременно скачивайте и сохраняйте нужные медиаданные: после истечения срока хранения у провайдера SandBase может вернуть только упрощённый конечный ответ со структурой и метаданными, без исходных байтов медиаданных.

## Потоковая передача {#streaming}

Укажите `stream: true` в теле запроса. Ответ имеет тип `text/event-stream`; `?alt=sse` в этом протоколе не используется. Набор типов событий и дельт открыт, и они передаются без фиксированного списка разрешённых значений, поэтому клиенты должны допускать неизвестные значения. После отправки заголовков потока ошибки приходят как событие `error`, а не как другой HTTP-статус.

Поддержка потоковой передачи зависит от модели. Провайдер может отклонить `stream: true`, даже если протокол это поддерживает.

## Текущие ограничения {#current-limits}

Сейчас SandBase предоставляет только create и get:

- Agent Interactions отклоняются; используйте `model`.
- `background: true` и `stream: true` нельзя сочетать.
- Список, удаление и отмена Interaction не предоставляются.
- Доставка по URI и переподключение к потоку через GET не предоставляются.
- `previous_interaction_id` требует действующего сопоставления привязки к провайдеру и поддержки на стороне провайдера. Если привязка недоступна, SandBase возвращает ошибку, а не переключает провайдера незаметно.

Ошибки используют формат Google `{ "error": { "code", "message", "status" } }`. HTTP-статус считайте стабильным; очищенный текст провайдера в `message` может меняться.
