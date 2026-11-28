---
i18nSource: 4916ed90816680e4
title: Asset Kaydetme
description: Bir medya URL'sini yeniden kullanılabilir bir SandBase Asset'i olarak kaydedin.
aside: false
outline: false
apiReference:
  title: Asset Kaydetme
  operation: Assets
  method: POST
  path: /v1/assets
  description: Herkese açık erişilebilen bir medya URL'sini kaydedin ve kalıcı bir asset:// referansı alın.
  groups:
    - title: İstek gövdesi
      fields:
        - name: url
          type: string
          required: true
          description: Asset sağlayıcısına iletilen, boş olmayan kaynak URL'si. Sağlayıcının bu URL'yi çekebilmesi gerekir.
        - name: asset_type
          type: Image | Video | Audio
          required: true
          description: Büyük/küçük harfe duyarlı asset türü.
        - name: name
          type: string
          required: false
          description: İsteğe bağlı görünen ad.
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
