---
i18nSource: e047946a41e1be8b
title: Enviar mídia
description: Envie um arquivo de imagem, áudio ou vídeo para usar como input de modelo.
aside: false
outline: false
apiReference:
  title: Enviar mídia
  operation: Assets
  method: POST
  path: /v1/upload
  description: Envie um arquivo de imagem, áudio ou vídeo e receba uma URL armazenada para um input de modelo suportado.
  groups:
    - title: Formulário multipart
      fields:
        - name: file
          type: binary
          required: true
          description: Imagem de até 20 MB, áudio de até 50 MB ou vídeo de até 500 MB. Os formatos suportados estão listados abaixo.
        - name: type
          type: image | audio | video
          required: false
          description: Dica de categoria opcional. A detecção de MIME a partir do arquivo continua controlando a validação.
    - title: Tipos MIME suportados
      fields:
        - name: Image
          type: string
          required: false
          description: image/jpeg, image/png, image/webp, image/gif — máximo de 20 MB.
        - name: Audio
          type: string
          required: false
          description: audio/mpeg, audio/mp4, audio/wav, audio/x-wav, audio/ogg, audio/aac, audio/flac — máximo de 50 MB.
        - name: Video
          type: string
          required: false
          description: video/mp4, video/quicktime, video/webm — máximo de 500 MB.
    - title: Resposta
      fields:
        - name: url
          type: string
          required: true
          description: URL da mídia armazenada para passar a um input de modelo suportado.
        - name: filename · size
          type: string · integer
          required: true
          description: Nome original do arquivo no multipart e tamanho do arquivo em bytes.
        - name: type · content_type
          type: string
          required: true
          description: Tipo MIME detectado e usado ao armazenar o arquivo.
        - name: duration_seconds
          type: number
          required: false
          description: "Apenas áudio e vídeo: duração da mídia em segundos, quando puder ser lida do arquivo."
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
    - title: Detecção de MIME
      description: O servidor detecta o tipo do arquivo pelos bytes e pelo nome do arquivo. O campo opcional type não força um tipo MIME.
---

<ApiReferencePage />
