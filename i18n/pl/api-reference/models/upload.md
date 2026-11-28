---
i18nSource: e047946a41e1be8b
title: Prześlij multimedia
description: Prześlij plik obrazu, audio lub wideo do użycia jako dane wejściowe modelu.
aside: false
outline: false
apiReference:
  title: Prześlij multimedia
  operation: Assets
  method: POST
  path: /v1/upload
  description: Prześlij plik obrazu, audio lub wideo i otrzymaj URL zapisanego pliku do użycia w obsługiwanym wejściu modelu.
  groups:
    - title: Formularz multipart
      fields:
        - name: file
          type: binary
          required: true
          description: Obraz do 20 MB, audio do 50 MB lub wideo do 500 MB. Obsługiwane formaty podano poniżej.
        - name: type
          type: image | audio | video
          required: false
          description: Opcjonalna wskazówka kategorii. O walidacji nadal decyduje typ MIME wykryty z pliku.
    - title: Obsługiwane typy MIME
      fields:
        - name: Image
          type: string
          required: false
          description: image/jpeg, image/png, image/webp, image/gif — maksymalnie 20 MB.
        - name: Audio
          type: string
          required: false
          description: audio/mpeg, audio/mp4, audio/wav, audio/x-wav, audio/ogg, audio/aac, audio/flac — maksymalnie 50 MB.
        - name: Video
          type: string
          required: false
          description: video/mp4, video/quicktime, video/webm — maksymalnie 500 MB.
    - title: Odpowiedź
      fields:
        - name: url
          type: string
          required: true
          description: URL zapisanego pliku do przekazania w obsługiwanym wejściu modelu.
        - name: filename · size
          type: string · integer
          required: true
          description: Oryginalna nazwa pliku z formularza multipart i rozmiar pliku w bajtach.
        - name: type · content_type
          type: string
          required: true
          description: Wykryty typ MIME użyty przy zapisie pliku.
        - name: duration_seconds
          type: number
          required: false
          description: "Tylko audio i wideo: czas trwania w sekundach, jeśli da się go odczytać z pliku."
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
    - title: Wykrywanie MIME
      description: Serwer wykrywa typ pliku na podstawie jego bajtów i nazwy. Opcjonalne pole type nie wymusza typu MIME.
---

<ApiReferencePage />
