---
i18nSource: e047946a41e1be8b
title: Subir contenido multimedia
description: Sube un archivo de imagen, audio o video para usarlo como entrada de un modelo.
aside: false
outline: false
apiReference:
  title: Subir contenido multimedia
  operation: Assets
  method: POST
  path: /v1/upload
  description: Sube un archivo de imagen, audio o video y recibe una URL almacenada para una entrada de modelo compatible.
  groups:
    - title: Formulario multipart
      fields:
        - name: file
          type: binary
          required: true
          description: Imagen de hasta 20 MB, audio de hasta 50 MB o video de hasta 500 MB. Los formatos admitidos se indican abajo.
        - name: type
          type: image | audio | video
          required: false
          description: Indicación opcional de categoría. La detección MIME del archivo sigue controlando la validación.
    - title: Tipos MIME admitidos
      fields:
        - name: Image
          type: string
          required: false
          description: image/jpeg, image/png, image/webp, image/gif — máximo 20 MB.
        - name: Audio
          type: string
          required: false
          description: audio/mpeg, audio/mp4, audio/wav, audio/x-wav, audio/ogg, audio/aac, audio/flac — máximo 50 MB.
        - name: Video
          type: string
          required: false
          description: video/mp4, video/quicktime, video/webm — máximo 500 MB.
    - title: Respuesta
      fields:
        - name: url
          type: string
          required: true
          description: URL del contenido almacenado que se pasa a una entrada de modelo compatible.
        - name: filename · size
          type: string · integer
          required: true
          description: Nombre de archivo multipart original y tamaño del archivo en bytes.
        - name: type · content_type
          type: string
          required: true
          description: Tipo MIME detectado que se usó al almacenar el archivo.
        - name: duration_seconds
          type: number
          required: false
          description: "Solo audio y video: duración en segundos, cuando se puede leer del archivo."
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
    - title: Detección MIME
      description: El servidor detecta el tipo de archivo a partir de sus bytes y su nombre. El campo opcional type no fuerza un tipo MIME.
---

<ApiReferencePage />
