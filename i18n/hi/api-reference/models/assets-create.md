---
i18nSource: 4916ed90816680e4
title: Asset register करें
description: किसी media URL को दोबारा इस्तेमाल होने वाले SandBase Asset के रूप में register करें।
aside: false
outline: false
apiReference:
  title: Asset register करें
  operation: Assets
  method: POST
  path: /v1/assets
  description: सार्वजनिक रूप से उपलब्ध media URL register करें और एक स्थायी asset:// reference पाएं।
  groups:
    - title: Request body
      fields:
        - name: url
          type: string
          required: true
          description: Asset provider को भेजा जाने वाला non-empty source URL। Provider को इसे fetch कर पाना चाहिए।
        - name: asset_type
          type: Image | Video | Audio
          required: true
          description: Case-sensitive asset type।
        - name: name
          type: string
          required: false
          description: वैकल्पिक display name।
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
