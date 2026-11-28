---
i18nSource: 88501841ea0abd9d
title: Единый API запуска для изображений
description: Генерация и редактирование изображений через единый API моделей SandBase.
aside: false
outline: false
apiReference:
  title: Генерация изображений
  operation: Models
  method: POST
  path: /v1/run
  description: Генерируйте изображения с помощью моделей ИИ, таких как FLUX, Stable Diffusion, DALL-E и других.
  groups:
    - title: Тело запроса
      fields:
        - name: model
          type: string
          required: true
          description: Текущий идентификатор модели, например bfl/flux-1/schnell.
        - name: prompt
          type: string
          required: true
          description: Текстовое описание изображения
        - name: aspect_ratio
          type: string
          required: false
          description: Соотношение сторон результата. Для Flux 1 Schnell по умолчанию 16:9.
        - name: guidance_scale
          type: number
          required: false
          description: Сила следования промпту от 1 до 20.
        - name: output_format
          type: jpeg | png
          required: false
          description: Формат выходного изображения. Для Flux 1 Schnell по умолчанию jpeg.
        - name: mode
          type: string
          required: false
          description: Указывайте async, только если выбранная модель поддерживает асинхронное выполнение
        - name: webhook_url
          type: string
          required: false
          description: Публичный HTTPS URL обратного вызова только для этой асинхронной задачи
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/run \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"bfl/flux-1/schnell","prompt":"A futuristic city at sunset","aspect_ratio":"1:1"}'
    - label: Python
      language: python
      code: |-
        response = client.post("/v1/run", json={
            "model": "bfl/flux-1/schnell",
            "prompt": "A futuristic city at sunset, cyberpunk style",
            "aspect_ratio": "1:1"
        })
        print(response.json()["outputs"][0]["url"])
  response:
    status: 200 OK
    code: |-
      {
        "id": "run_01...",
        "status": "completed",
        "outputs": [{ "url": "https://media.sandbase.ai/images/output.png" }]
      }
---

<ApiReferencePage />
