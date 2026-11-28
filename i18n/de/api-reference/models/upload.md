---
i18nSource: e047946a41e1be8b
title: Medien hochladen
description: Lade eine Bild-, Audio- oder Videodatei als Modelleingabe hoch.
aside: false
outline: false
apiReference:
  title: Medien hochladen
  operation: Assets
  method: POST
  path: /v1/upload
  description: Lade eine Bild-, Audio- oder Videodatei hoch und erhalte eine gespeicherte URL für eine unterstützte Modelleingabe.
  groups:
    - title: Multipart-Formular
      fields:
        - name: file
          type: binary
          required: true
          description: Bild bis 20 MB, Audio bis 50 MB oder Video bis 500 MB. Die unterstützten Formate sind unten aufgeführt.
        - name: type
          type: image | audio | video
          required: false
          description: Optionaler Kategoriehinweis. Die Validierung richtet sich weiterhin nach der MIME-Erkennung der Datei.
    - title: Unterstützte MIME-Typen
      fields:
        - name: Image
          type: string
          required: false
          description: image/jpeg, image/png, image/webp, image/gif — maximal 20 MB.
        - name: Audio
          type: string
          required: false
          description: audio/mpeg, audio/mp4, audio/wav, audio/x-wav, audio/ogg, audio/aac, audio/flac — maximal 50 MB.
        - name: Video
          type: string
          required: false
          description: video/mp4, video/quicktime, video/webm — maximal 500 MB.
    - title: Antwort
      fields:
        - name: url
          type: string
          required: true
          description: Gespeicherte Medien-URL, die du an eine unterstützte Modelleingabe übergibst.
        - name: filename · size
          type: string · integer
          required: true
          description: Ursprünglicher Multipart-Dateiname und Dateigröße in Bytes.
        - name: type · content_type
          type: string
          required: true
          description: Erkannter MIME-Typ, mit dem die Datei gespeichert wurde.
        - name: duration_seconds
          type: number
          required: false
          description: "Nur Audio und Video: Mediendauer in Sekunden, sofern sie aus der Datei gelesen werden kann."
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
    - title: MIME-Erkennung
      description: Der Server erkennt den Dateityp anhand der Bytes und des Dateinamens. Das optionale Feld type erzwingt keinen MIME-Typ.
---

<ApiReferencePage />
