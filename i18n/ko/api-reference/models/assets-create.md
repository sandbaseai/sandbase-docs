---
i18nSource: 4916ed90816680e4
title: 에셋 등록
description: 미디어 URL을 재사용 가능한 SandBase 에셋으로 등록합니다.
aside: false
outline: false
apiReference:
  title: 에셋 등록
  operation: Assets
  method: POST
  path: /v1/assets
  description: 공개적으로 접근 가능한 미디어 URL을 등록하고 영구적인 asset:// 참조를 받습니다.
  groups:
    - title: 요청 본문
      fields:
        - name: url
          type: string
          required: true
          description: 에셋 제공업체에 전달되는 비어 있지 않은 소스 URL입니다. 제공업체가 가져올 수 있어야 합니다.
        - name: asset_type
          type: Image | Video | Audio
          required: true
          description: 대소문자를 구분하는 에셋 유형입니다.
        - name: name
          type: string
          required: false
          description: 선택적 표시 이름입니다.
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
