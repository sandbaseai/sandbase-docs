---
i18nSource: e047946a41e1be8b
title: Téléverser un média
description: Téléversez un fichier image, audio ou vidéo à utiliser comme entrée de modèle.
aside: false
outline: false
apiReference:
  title: Téléverser un média
  operation: Assets
  method: POST
  path: /v1/upload
  description: Téléversez un fichier image, audio ou vidéo et recevez une URL de stockage pour une entrée de modèle prise en charge.
  groups:
    - title: Formulaire multipart
      fields:
        - name: file
          type: binary
          required: true
          description: Image jusqu'à 20 Mo, audio jusqu'à 50 Mo ou vidéo jusqu'à 500 Mo. Les formats pris en charge sont listés ci-dessous.
        - name: type
          type: image | audio | video
          required: false
          description: Indication de catégorie facultative. La détection MIME à partir du fichier reste déterminante pour la validation.
    - title: Types MIME pris en charge
      fields:
        - name: Image
          type: string
          required: false
          description: image/jpeg, image/png, image/webp, image/gif — 20 Mo maximum.
        - name: Audio
          type: string
          required: false
          description: audio/mpeg, audio/mp4, audio/wav, audio/x-wav, audio/ogg, audio/aac, audio/flac — 50 Mo maximum.
        - name: Video
          type: string
          required: false
          description: video/mp4, video/quicktime, video/webm — 500 Mo maximum.
    - title: Réponse
      fields:
        - name: url
          type: string
          required: true
          description: URL du média stocké, à transmettre à une entrée de modèle prise en charge.
        - name: filename · size
          type: string · integer
          required: true
          description: Nom du fichier multipart d'origine et taille du fichier en octets.
        - name: type · content_type
          type: string
          required: true
          description: Type MIME détecté, utilisé lors du stockage du fichier.
        - name: duration_seconds
          type: number
          required: false
          description: "Audio et vidéo uniquement : durée du média en secondes, lorsqu'elle peut être lue dans le fichier."
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
    - title: Détection MIME
      description: Le serveur détecte le type de fichier à partir de ses octets et de son nom. Le champ facultatif type n'impose pas de type MIME.
---

<ApiReferencePage />
