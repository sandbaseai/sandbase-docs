---
i18nSource: 38d39c933364402c
title: 取得帳戶餘額
description: 取得 API 金鑰所屬組織的目前餘額與選用的信用額度設定。
aside: false
outline: false
apiReference:
  title: 取得帳戶餘額
  operation: Account
  method: GET
  path: /v1/account/balance
  description: 傳回依 API 金鑰解析出的組織之目前美元餘額與選用的信用額度設定。
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
