---
i18nSource: e047946a41e1be8b
title: Medya Yükle
description: Model girdisi olarak kullanmak üzere bir görüntü, ses veya video dosyası yükleyin.
aside: false
outline: false
apiReference:
  title: Medya Yükle
  operation: Assets
  method: POST
  path: /v1/upload
  description: Bir görüntü, ses veya video dosyası yükleyin ve desteklenen bir model girdisi için saklanan bir URL alın.
  groups:
    - title: Multipart form
      fields:
        - name: file
          type: binary
          required: true
          description: En fazla 20 MB görüntü, 50 MB ses veya 500 MB video. Desteklenen biçimler aşağıda listelenmiştir.
        - name: type
          type: image | audio | video
          required: false
          description: İsteğe bağlı kategori ipucu. Doğrulamayı yine dosyadan yapılan MIME algılaması belirler.
    - title: Desteklenen MIME türleri
      fields:
        - name: Image
          type: string
          required: false
          description: image/jpeg, image/png, image/webp, image/gif — en fazla 20 MB.
        - name: Audio
          type: string
          required: false
          description: audio/mpeg, audio/mp4, audio/wav, audio/x-wav, audio/ogg, audio/aac, audio/flac — en fazla 50 MB.
        - name: Video
          type: string
          required: false
          description: video/mp4, video/quicktime, video/webm — en fazla 500 MB.
    - title: Yanıt
      fields:
        - name: url
          type: string
          required: true
          description: Desteklenen bir model girdisine aktarılacak saklanan medya URL'si.
        - name: filename · size
          type: string · integer
          required: true
          description: Orijinal multipart dosya adı ve bayt cinsinden dosya boyutu.
        - name: type · content_type
          type: string
          required: true
          description: Dosya saklanırken kullanılan, algılanmış MIME türü.
        - name: duration_seconds
          type: number
          required: false
          description: "Yalnızca ses ve video: dosyadan okunabildiğinde saniye cinsinden medya süresi."
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
    - title: MIME algılama
      description: Sunucu dosya türünü dosyanın baytlarından ve adından algılar. İsteğe bağlı type alanı bir MIME türünü zorlamaz.
---

<ApiReferencePage />
