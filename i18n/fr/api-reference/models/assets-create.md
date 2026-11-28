---
i18nSource: 4916ed90816680e4
title: Enregistrer un Asset
description: Enregistrez une URL de média en tant qu'Asset SandBase réutilisable.
aside: false
outline: false
apiReference:
  title: Enregistrer un Asset
  operation: Assets
  method: POST
  path: /v1/assets
  description: Enregistre une URL de média accessible publiquement et renvoie une référence asset:// persistante.
  groups:
    - title: Corps de la requête
      fields:
        - name: url
          type: string
          required: true
          description: URL source non vide transmise au fournisseur d'Assets. Le fournisseur doit pouvoir la récupérer.
        - name: asset_type
          type: Image | Video | Audio
          required: true
          description: Type d'Asset, sensible à la casse.
        - name: name
          type: string
          required: false
          description: Nom d'affichage facultatif.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/assets \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "url": "https://example.com/tea-ad.mp4",
            "asset_type": "Video",
            "name": "Tea ad reference video"
          }'
  response:
    status: 200 OK
    code: |-
      {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "asset_url": "asset://asset-20260710150403-hx4hf",
        "asset_type": "Video",
        "name": "Tea ad reference video",
        "created_at": "2026-07-10T15:04:03Z"
      }
---

<ApiReferencePage />
