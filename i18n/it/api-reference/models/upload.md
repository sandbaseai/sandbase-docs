---
i18nSource: e047946a41e1be8b
title: Carica media
description: Carica un file immagine, audio o video da usare come input di un modello.
aside: false
outline: false
apiReference:
  title: Carica media
  operation: Assets
  method: POST
  path: /v1/upload
  description: Carica un file immagine, audio o video e ricevi un URL salvato da usare come input di un modello supportato.
  groups:
    - title: Form multipart
      fields:
        - name: file
          type: binary
          required: true
          description: Immagine fino a 20 MB, audio fino a 50 MB o video fino a 500 MB. I formati supportati sono elencati sotto.
        - name: type
          type: image | audio | video
          required: false
          description: Indicazione facoltativa della categoria. La validazione si basa comunque sul MIME rilevato dal file.
    - title: Tipi MIME supportati
      fields:
        - name: Image
          type: string
          required: false
          description: image/jpeg, image/png, image/webp, image/gif — massimo 20 MB.
        - name: Audio
          type: string
          required: false
          description: audio/mpeg, audio/mp4, audio/wav, audio/x-wav, audio/ogg, audio/aac, audio/flac — massimo 50 MB.
        - name: Video
          type: string
          required: false
          description: video/mp4, video/quicktime, video/webm — massimo 500 MB.
    - title: Risposta
      fields:
        - name: url
          type: string
          required: true
          description: URL del media salvato da passare come input di un modello supportato.
        - name: filename · size
          type: string · integer
          required: true
          description: Nome file multipart originale e dimensione del file in byte.
        - name: type · content_type
          type: string
          required: true
          description: Tipo MIME rilevato usato per salvare il file.
        - name: duration_seconds
          type: number
          required: false
          description: "Solo audio e video: durata del media in secondi, quando è leggibile dal file."
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
    - title: Rilevamento MIME
      description: Il server rileva il tipo di file dai suoi byte e dal nome file. Il campo facoltativo type non impone un tipo MIME.
---

<ApiReferencePage />
