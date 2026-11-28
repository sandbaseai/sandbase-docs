---
i18nSource: aebee42034285529
title: Asset प्राप्त करें
description: Asset metadata और signed download URL प्राप्त करें।
aside: false
outline: false
apiReference:
  title: Asset प्राप्त करें
  operation: Assets
  method: GET
  path: /v1/assets/{asset_id}
  description: Asset metadata और एक अस्थायी signed download URL प्राप्त करें।
  groups:
    - title: Path parameters
      fields:
        - name: asset_id
          type: string
          required: true
          description: External Asset ID, asset:// prefix के बिना।
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
    - title: Provider-managed URL
      description: asset:// मान दोबारा इस्तेमाल किया जा सकने वाला Asset reference है। download_url provider-managed है और खाली हो सकता है; इसका वर्तमान मान जानने के लिए इस endpoint को फिर से query करें।
---

<ApiReferencePage />
