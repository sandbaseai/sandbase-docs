---
i18nSource: 38d39c933364402c
title: 계정 잔액 조회
description: API 키가 속한 조직의 현재 잔액과 선택적 신용 설정을 조회합니다.
aside: false
outline: false
apiReference:
  title: 계정 잔액 조회
  operation: Account
  method: GET
  path: /v1/account/balance
  description: API 키로 확인된 조직의 현재 USD 잔액과 선택적 신용 설정을 반환합니다.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/account/balance \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "org_id": "550e8400-e29b-41d4-a716-446655440000",
        "balance": "42.125",
        "credit_limit": "10",
        "alert_threshold": "5"
      }
---

<ApiReferencePage />
