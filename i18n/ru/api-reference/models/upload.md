---
i18nSource: e047946a41e1be8b
title: Загрузка медиафайлов
description: Загрузка изображения, аудио или видео для использования в качестве входных данных модели.
aside: false
outline: false
apiReference:
  title: Загрузка медиафайлов
  operation: Assets
  method: POST
  path: /v1/upload
  description: Загрузите изображение, аудио или видео и получите URL сохранённого файла для поддерживаемого входа модели.
  groups:
    - title: Multipart-форма
      fields:
        - name: file
          type: binary
          required: true
          description: Изображение до 20 МБ, аудио до 50 МБ или видео до 500 МБ. Поддерживаемые форматы перечислены ниже.
        - name: type
          type: image | audio | video
          required: false
          description: Необязательная подсказка категории. Проверка всё равно выполняется по MIME-типу, определённому из файла.
    - title: Поддерживаемые MIME-типы
      fields:
        - name: Image
          type: string
          required: false
          description: image/jpeg, image/png, image/webp, image/gif — максимум 20 МБ.
        - name: Audio
          type: string
          required: false
          description: audio/mpeg, audio/mp4, audio/wav, audio/x-wav, audio/ogg, audio/aac, audio/flac — максимум 50 МБ.
        - name: Video
          type: string
          required: false
          description: video/mp4, video/quicktime, video/webm — максимум 500 МБ.
    - title: Ответ
      fields:
        - name: url
          type: string
          required: true
          description: URL сохранённого медиафайла для передачи во вход поддерживаемой модели.
        - name: filename · size
          type: string · integer
          required: true
          description: Исходное имя файла из multipart-формы и размер файла в байтах.
        - name: type · content_type
          type: string
          required: true
          description: Определённый MIME-тип, использованный при сохранении файла.
        - name: duration_seconds
          type: number
          required: false
          description: "Только для аудио и видео: длительность в секундах, если её удаётся прочитать из файла."
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/upload \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -F "file=@reference.mp4" \
          -F "type=video"
  response:
    status: 200 OK
    code: |-
      {
        "url": "https://media.sandbase.ai/uploads/2026/08/550e8400-e29b-41d4-a716-446655440000.mp4",
        "filename": "reference.mp4",
        "size": 1048576,
        "type": "video/mp4",
        "content_type": "video/mp4",
        "duration_seconds": 5.04
      }
  notes:
    - title: Определение MIME-типа
      description: Сервер определяет тип файла по его байтам и имени. Необязательное поле type не задаёт MIME-тип принудительно.
---

<ApiReferencePage />
