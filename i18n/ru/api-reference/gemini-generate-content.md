---
i18nSource: d4dc2aeab688ab05
title: Google Gemini GenerateContent
description: Вызов SandBase через нативный протокол Google Gemini GenerateContent.
aside: false
outline: false
apiReference:
  title: Google Gemini GenerateContent
  operation: Gemini
  method: POST
  path: /v1beta/models/{model}:generateContent
  description: Отправьте нативный запрос Gemini и получите Gemini-совместимый ответ. Для потоковой передачи используйте streamGenerateContent.
  groups:
    - title: Параметры пути
      fields:
        - name: model
          type: string
          required: true
          description: Имя модели Google без префикса, например gemini-3.5-flash. SandBase разрешает его как google/{model}.
    - title: Тело запроса
      fields:
        - name: contents
          type: array
          required: false
          description: Содержимое диалога Gemini, состоящее из role и parts.
        - name: systemInstruction
          type: object
          required: false
          description: Текстовая системная инструкция в формате Gemini Content.
        - name: generationConfig
          type: object
          required: false
          description: Настройки сэмплирования, длины вывода, структурированного вывода и мышления.
        - name: tools
          type: array
          required: false
          description: Объявления функций или поддерживаемая конфигурация встроенных инструментов Gemini.
        - name: toolConfig
          type: object
          required: false
          description: Политика вызова функций Gemini.
        - name: safetySettings
          type: array
          required: false
          description: Категории и пороги безопасности Gemini.
        - name: cachedContent
          type: string
          required: false
          description: Ресурс кэшированного контента Gemini, передаваемый, если поддерживается.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST \
          "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:generateContent" \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"contents":[{"role":"user","parts":[{"text":"Explain immutable infrastructure in one sentence."}]}]}'
  response:
    status: 200 OK
    code: |-
      {
        "candidates": [
          {
            "content": {
              "role": "model",
              "parts": [{"text": "Immutable infrastructure replaces servers from versioned images instead of modifying them in place."}]
            },
            "finishReason": "STOP",
            "index": 0
          }
        ],
        "usageMetadata": {
          "promptTokenCount": 8,
          "candidatesTokenCount": 15,
          "totalTokenCount": 23
        }
      }
---

<ApiReferencePage />

## Аутентификация {#authentication}

Google-совместимые запросы могут передавать API-ключ SandBase в `x-goog-api-key`, `Authorization: Bearer …` или параметре запроса `key` — в этом порядке приоритета. Предпочитайте заголовок: учётные данные в строке запроса могут попасть в логи прокси и историю браузера.

## Потоковая передача {#streaming}

Замените суффикс метода на `:streamGenerateContent`. Без параметра запроса SandBase возвращает Google-совместимые объекты ответа в виде потокового JSON-массива. Добавьте `?alt=sse`, чтобы получать Server-Sent Events:

```bash
curl -N -X POST \
  "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:streamGenerateContent?alt=sse" \
  -H "x-goog-api-key: $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Write a short greeting."}]}]}'
```

## Нативная генерация изображений {#native-image-generation}

Для этих моделей изображений есть отдельные нативные сопоставления GenerateContent:

- [Gemini 3 Pro Image（Nano Banana Pro）](https://www.sandbase.ai/models/google/gemini-3-pro-image/docs): `gemini-3-pro-image`
- [Gemini 3.1 Flash Image（Nano Banana 2）](https://www.sandbase.ai/models/google/gemini-3.1-flash-image/docs): `gemini-3.1-flash-image`
- [Gemini Nano Banana 2.1（Nano Banana 2.1）](https://www.sandbase.ai/models/google/gemini-nano-banana-2.1/docs): `gemini-nano-banana-2.1`

На странице каждой модели указаны цены за токены и стоимость одного изображения.

Для этих сопоставлений SandBase передаёт полезную нагрузку запроса и ответа без преобразования через Chat
Completions. Это сохраняет части с изображениями, модальности ответа и поля, определённые провайдером. Используйте в URL имя модели без
префикса; например, `google/gemini-3.1-flash-image` в пути становится `gemini-3.1-flash-image`.
### Редактирование изображения {#edit-an-image}

Добавьте исходное изображение как часть `inlineData` рядом с текстовой инструкцией. Укажите MIME-тип отправляемых байтов:

```json
{
  "contents": [{
    "role": "user",
    "parts": [
      {"text": "Keep the subject unchanged and turn the background into a paper-cut landscape."},
      {"inlineData": {"mimeType": "image/png", "data": "<base64-input-image>"}}
    ]
  }],
  "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"imageSize": "1K"}}
}
```

### Использование Google Gen AI SDK {#use-the-google-gen-ai-sdk}

Направьте официальный SDK на SandBase и используйте свой API-ключ SandBase:

```python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="YOUR_SANDBASE_API_KEY",
    http_options=types.HttpOptions(base_url="https://api.sandbase.ai"),
)

response = client.models.generate_content(
    model="gemini-nano-banana-2.1",
    contents="Create a wide editorial illustration of a solar-powered city at sunrise.",
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE"],
        image_config=types.ImageConfig(aspect_ratio="16:9", image_size="1K"),
    ),
)

for part in response.candidates[0].content.parts:
    if part.inline_data:
        with open("output.jpg", "wb") as f:
            f.write(part.inline_data.data)
```

Для потоковой передачи вызывайте `:streamGenerateContent?alt=sse` (в SDK: `generate_content_stream`) с тем же телом.

### Обработка ответа {#response-handling}
Читайте сгенерированные медиаданные из частей возвращённого кандидата. Поскольку эти модели используют нативную сквозную передачу, регистр
полей, определённых провайдером, и MIME-метаданные возвращаются в исходном виде. Декодируйте полезную нагрузку base64 и проверьте фактические байты
медиаданных, прежде чем выбирать расширение файла.

## Маршрутизация и границы преобразования {#routing-and-translation-boundaries}

SandBase выбирает только провайдеров, поддерживающих запрошенный нативный протокол Gemini. Если у выбранной модели нет
совместимого нативного сопоставления, запрос завершается ошибкой, а не переключается на провайдера с другим протоколом.

Модели, использующие путь GenerateContent с преобразованием, поддерживают текст, вызовы функций и ответы на них, встроенные данные `image/*`
и публичные ссылки HTTP(S) на изображения. Этот путь с преобразованием отклоняет неподдерживаемые встроенные MIME-типы, приватные Google Files или
ссылки `gs://`, несколько кандидатов и неподдерживаемые модальности ответа, возвращая ответ `400 INVALID_ARGUMENT` в стиле Google.
Перечисленные выше сопоставления для генерации изображений используют прямую сквозную передачу и не подпадают под эти ограничения
преобразования; проверяйте возвращённые поля медиаданных в соответствии с ответом выбранного провайдера.
