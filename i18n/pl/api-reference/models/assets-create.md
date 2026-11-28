---
i18nSource: 4916ed90816680e4
title: Zarejestruj Asset
description: Zarejestruj adres URL multimediów jako wielokrotnego użytku Asset w SandBase.
aside: false
outline: false
apiReference:
  title: Zarejestruj Asset
  operation: Assets
  method: POST
  path: /v1/assets
  description: Rejestruje publicznie dostępny adres URL multimediów i zwraca trwałe odwołanie asset://.
  groups:
    - title: Treść żądania
      fields:
        - name: url
          type: string
          required: true
          description: Niepusty źródłowy adres URL przekazywany dostawcy Asset. Dostawca musi mieć możliwość jego pobrania.
        - name: asset_type
          type: Image | Video | Audio
          required: true
          description: Typ zasobu, z rozróżnianiem wielkości liter.
        - name: name
          type: string
          required: false
          description: Opcjonalna nazwa wyświetlana.
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
