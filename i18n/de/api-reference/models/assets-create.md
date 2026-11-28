---
i18nSource: 4916ed90816680e4
title: Asset registrieren
description: Registriere eine Medien-URL als wiederverwendbares SandBase-Asset.
aside: false
outline: false
apiReference:
  title: Asset registrieren
  operation: Assets
  method: POST
  path: /v1/assets
  description: Registriert eine öffentlich erreichbare Medien-URL und liefert eine dauerhafte asset://-Referenz.
  groups:
    - title: Request-Body
      fields:
        - name: url
          type: string
          required: true
          description: Nicht leere Quell-URL, die an den Asset-Anbieter weitergegeben wird. Der Anbieter muss sie abrufen können.
        - name: asset_type
          type: Image | Video | Audio
          required: true
          description: Asset-Typ (Groß-/Kleinschreibung beachten).
        - name: name
          type: string
          required: false
          description: Optionaler Anzeigename.
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
