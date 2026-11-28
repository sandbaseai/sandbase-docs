---
i18nSource: aebee42034285529
title: Récupérer un Asset
description: Récupérer les métadonnées d'un Asset et une URL de téléchargement signée.
aside: false
outline: false
apiReference:
  title: Récupérer un Asset
  operation: Assets
  method: GET
  path: /v1/assets/{asset_id}
  description: Récupère les métadonnées d'un Asset et une URL de téléchargement signée temporaire.
  groups:
    - title: Paramètres de chemin
      fields:
        - name: asset_id
          type: string
          required: true
          description: ID externe de l'Asset, sans le préfixe asset://.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/assets/asset-20260710150403-hx4hf \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "external_id": "asset-20260710150403-hx4hf",
        "asset_url": "asset://asset-20260710150403-hx4hf",
        "status": "Active",
        "asset_type": "Video",
        "download_url": "https://cdn.example.com/signed-url",
        "created_at": "2026-07-10T15:04:03Z"
      }
  notes:
    - title: URL gérée par le fournisseur
      description: La valeur asset:// est la référence réutilisable de l'Asset. download_url est gérée par le fournisseur et peut être vide ; interrogez de nouveau cet endpoint pour obtenir sa valeur actuelle.
---

<ApiReferencePage />
