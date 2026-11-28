---
i18nSource: aebee42034285529
title: Pobierz Asset
description: Pobierz metadane Asset i podpisany URL pobierania.
aside: false
outline: false
apiReference:
  title: Pobierz Asset
  operation: Assets
  method: GET
  path: /v1/assets/{asset_id}
  description: Pobiera metadane Asset i tymczasowy podpisany URL pobierania.
  groups:
    - title: Parametry ścieżki
      fields:
        - name: asset_id
          type: string
          required: true
          description: Zewnętrzny identyfikator Asset, bez prefiksu asset://.
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
    - title: URL zarządzany przez dostawcę
      description: Wartość asset:// to odwołanie do Asset wielokrotnego użytku. download_url jest zarządzany przez dostawcę i może być pusty; aby uzyskać jego bieżącą wartość, ponownie wywołaj ten endpoint.
---

<ApiReferencePage />
