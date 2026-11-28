---
i18nSource: 39ce638efc41350d
title: Сгенерировать изображение
description: Генерация изображения через синхронный API, совместимый с OpenAI Images.
aside: false
outline: false
apiReference:
  title: Сгенерировать изображение
  operation: Images
  method: POST
  path: /v1/images/generations
  description: Генерация изображений через синхронный эндпоинт SandBase, совместимый с OpenAI Images. Этот эндпоинт отличается от общего API моделей /v1/run.
  signature: client.images.generate(params)
  groups:
    - title: Тело запроса
      schema: ImageGenerateParams
      fields:
        - name: model
          type: string
          required: true
          description: "Одна из моделей: gpt-image-2, gpt-image-2.5-flare или gpt-image-2.5-sunburst."
        - name: prompt
          type: string
          required: true
          description: Текстовое описание генерируемого изображения.
        - name: n
          type: integer
          required: false
          description: Количество генерируемых изображений, если поддерживается.
        - name: size
          type: string
          required: false
          description: Размеры результата, поддерживаемые моделью.
        - name: quality
          type: string
          required: false
          description: Качество результата, например low, medium, high или auto.
        - name: background
          type: string
          required: false
          description: Настройка фона, например transparent, opaque или auto.
        - name: output_format
          type: string
          required: false
          description: Формат кодирования, например png, webp или jpeg.
        - name: output_compression
          type: integer
          required: false
          description: Уровень сжатия результата от 0 до 100.
        - name: moderation
          type: string
          required: false
          description: Совместимая с провайдером настройка модерации.
        - name: user
          type: string
          required: false
          description: Совместимый с провайдером идентификатор конечного пользователя.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/images/generations \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"gpt-image-2","prompt":"A paper-cut city floating above the clouds","size":"1024x1024"}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-...", base_url="https://api.sandbase.ai/v1")
        result = client.images.generate(
            model="gpt-image-2",
            prompt="A paper-cut city floating above the clouds",
            size="1024x1024",
        )
        print(result.data[0].b64_json or result.data[0].url)
  response:
    status: 200 OK
    code: |-
      {
        "created": 1787529600,
        "data": [{"b64_json": "iVBORw0KGgo..."}],
        "usage": {
          "input_tokens": 12,
          "output_tokens": 4096,
          "total_tokens": 4108,
          "input_tokens_details": {"text_tokens": 12, "image_tokens": 0}
        }
      }
  notes:
    - title: Только синхронно
      description: stream=true, mode=stream и mode=async отклоняются. Используйте возвращённый массив data напрямую.
    - title: Совместимые поля
      description: Дополнительные JSON-поля передаются без изменений, но их поддержка зависит от модели и провайдера.
  errors:
    - status: "400"
      description: Недопустимый JSON, неподдерживаемая модель, режим потоковой передачи или запрос к провайдеру.
    - status: "401"
      description: API-ключ отсутствует или недействителен.
    - status: "402"
      description: Достигнут лимит расходов организации или API Key.
    - status: "403"
      description: Область действия API-ключа не разрешает доступ к этому эндпоинту.
    - status: "404"
      description: Модель изображений, на которую направлен запрос, недоступна.
    - status: "429"
      description: Превышен лимит запросов.
    - status: "500"
      description: Ошибка сохранения запроса или обработки ответа.
    - status: "502"
      description: Провайдер вернул недопустимый нативный ответ.
    - status: "503"
      description: Ни один маршрут провайдера не завершился успешно.
---

<ApiReferencePage />

## Поддерживаемые модели {#supported-models}
Эти модели изображений OpenAI работают на этом эндпоинте через нативный Images API. Передайте публичное имя модели в `model`:

| `model` | Лучше всего подходит для |
| --- | --- |
| `gpt-image-2.5-flare` | Быстрой и качественной генерации и редактирования в повседневной творческой работе |
| `gpt-image-2.5-sunburst` | Задач, где важнее всего визуальная точность и детализация |
| `gpt-image-2` | Предыдущее поколение GPT Image |

Запросы синхронные и возвращают данные изображения в `data` как `b64_json` или URL. Этот эндпоинт отделён от общего асинхронного эндпоинта моделей `/v1/run`; контракт и цены каждой модели описаны на её странице в [каталоге моделей](https://www.sandbase.ai/models/image-video).

Чтобы редактировать изображения, отправляйте `multipart/form-data` на [`POST /v1/images/edits`](/api-reference/images/edits) с теми же именами моделей.
