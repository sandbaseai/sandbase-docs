---
i18nSource: aebee42034285529
title: Asset getirme
description: Asset meta verilerini ve imzalı bir indirme URL'sini alın.
aside: false
outline: false
apiReference:
  title: Asset getirme
  operation: Assets
  method: GET
  path: /v1/assets/{asset_id}
  description: Asset meta verilerini ve geçici, imzalı bir indirme URL'sini alın.
  groups:
    - title: Yol parametreleri
      fields:
        - name: asset_id
          type: string
          required: true
          description: asset:// öneki olmadan harici Asset kimliği.
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
    - title: Sağlayıcı tarafından yönetilen URL
      description: asset:// değeri yeniden kullanılabilir Asset referansıdır. download_url sağlayıcı tarafından yönetilir ve boş olabilir; güncel değeri için bu uç noktayı yeniden sorgulayın.
---

<ApiReferencePage />
