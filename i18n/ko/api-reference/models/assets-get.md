---
i18nSource: aebee42034285529
title: Asset 조회
description: Asset 메타데이터와 서명된 다운로드 URL을 조회합니다.
aside: false
outline: false
apiReference:
  title: Asset 조회
  operation: Assets
  method: GET
  path: /v1/assets/{asset_id}
  description: Asset 메타데이터와 임시 서명된 다운로드 URL을 조회합니다.
  groups:
    - title: 경로 파라미터
      fields:
        - name: asset_id
          type: string
          required: true
          description: asset:// 접두사를 제외한 외부 Asset ID.
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
    - title: 제공업체 관리 URL
      description: asset:// 값은 재사용 가능한 Asset 참조입니다. download_url은 제공업체가 관리하며 비어 있을 수 있으므로, 현재 값이 필요하면 이 엔드포인트를 다시 조회하세요.
---

<ApiReferencePage />
