---
i18nSource: a4db28360a2974cd
title: Редактировать изображение
description: Редактирование загруженных изображений через синхронный API, совместимый с OpenAI Images.
aside: false
outline: false
apiReference:
  title: Редактировать изображение
  operation: Images
  method: POST
  path: /v1/images/edits
  description: Редактирование одного или нескольких загруженных изображений через синхронный multipart-эндпоинт SandBase, совместимый с OpenAI Images.
  signature: client.images.edit(params)
  groups:
    - title: Тело запроса
      schema: ImageEditParams
      fields:
        - name: model
          type: string
          required: true
          description: "Одна из моделей: gpt-image-2, gpt-image-2.5-flare или gpt-image-2.5-sunburst."
        - name: prompt
          type: string
          required: true
          description: Текстовое описание нужного редактирования.
        - name: image
          type: file | file[]
          required: true
          description: Один или несколько исходных файлов изображений. Для нескольких изображений повторите multipart-поле.
        - name: mask
          type: file
          required: false
          description: Необязательное изображение-маска для inpainting.
        - name: n
          type: integer
          required: false
          description: Количество возвращаемых отредактированных изображений, если поддерживается.
        - name: size
          type: string
          required: false
          description: Размеры вывода, поддерживаемые моделью.
        - name: quality
          type: string
          required: false
          description: Качество вывода, поддерживаемое моделью.
        - name: background
          type: string
          required: false
          description: Настройка фона вывода.
        - name: input_fidelity
          type: string
          required: false
          description: Насколько точно поддерживающие это модели должны сохранять детали исходного изображения.
        - name: output_format
          type: string
          required: false
          description: Формат вывода, например png, webp или jpeg.
        - name: output_compression
          type: integer
          required: false
          description: Уровень сжатия вывода от 0 до 100.
        - name: user
          type: string
          required: false
          description: Идентификатор конечного пользователя в формате провайдера.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/images/edits \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -F model=gpt-image-2 \
          -F 'prompt=Turn the daytime sky into a starry night' \
          -F image=@landscape.png
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-...", base_url="https://api.sandbase.ai/v1")
        with open("landscape.png", "rb") as image:
            result = client.images.edit(
                model="gpt-image-2",
                image=image,
                prompt="Turn the daytime sky into a starry night",
            )
        print(result.data[0].b64_json or result.data[0].url)
  response:
    status: 200 OK
    code: |-
      {
        "created": 1787529600,
        "data": [{"b64_json": "iVBORw0KGgo..."}],
        "usage": {
          "input_tokens": 1024,
          "output_tokens": 4096,
          "total_tokens": 5120,
          "input_tokens_details": {"text_tokens": 12, "image_tokens": 1012}
        }
      }
  notes:
    - title: Multipart-загрузка
      description: Передавайте model, prompt и image как multipart/form-data. Повтор поля image сохраняет несколько исходных файлов.
    - title: Только синхронно
      description: stream=true, mode=stream и mode=async отклоняются.
  errors:
    - status: "400"
      description: Некорректное multipart-тело, неподдерживаемая модель, потоковый режим или запрос к провайдеру.
    - status: "401"
      description: API-ключ отсутствует или недействителен.
    - status: "402"
      description: Достигнут лимит расходов организации или API Key.
    - status: "403"
      description: Область действия API-ключа не разрешает этот эндпоинт.
    - status: "404"
      description: Модель редактирования изображений, на которую направлен запрос, недоступна.
    - status: "429"
      description: Превышен лимит запросов.
    - status: "500"
      description: Не удалось сохранить запрос или обработать ответ.
    - status: "502"
      description: Провайдер вернул некорректный нативный ответ.
    - status: "503"
      description: Ни один маршрут провайдера не завершился успешно.
---

<ApiReferencePage />

## Поддерживаемые модели {#supported-models}
Эти модели изображений OpenAI используют нативный Images API на этом эндпоинте и на [`/v1/images/generations`](/api-reference/images/generations). Передайте публичное имя модели в `model`:

| `model` | Лучше всего подходит для |
| --- | --- |
| `gpt-image-2.5-flare` | Быстрой и качественной генерации и редактирования в повседневной творческой работе |
| `gpt-image-2.5-sunburst` | Задач, где важнее всего визуальная точность и детализация |
| `gpt-image-2` | Предыдущее поколение GPT Image |

Запросы синхронные и возвращают данные изображения в `data` как `b64_json` или URL. Этот эндпоинт отделён от общего асинхронного эндпоинта моделей `/v1/run`; контракт и цены каждой модели описаны на её странице в [каталоге моделей](https://www.sandbase.ai/models/image-video).

Передайте `model`, `prompt` и хотя бы один файл `image`. Чтобы скомбинировать или отредактировать несколько исходных изображений, повторите поле `image`:

```bash
curl https://api.sandbase.ai/v1/images/edits \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -F "model=gpt-image-2.5-flare" \
  -F "prompt=Turn this product photo into a warm editorial scene" \
  -F "image=@product.png" \
  -F "quality=high"
```
