---
i18nSource: 38d39c933364402c
title: アカウント残高の取得
description: API キーの組織の現在の残高と、任意のクレジット設定を取得します。
aside: false
outline: false
apiReference:
  title: アカウント残高の取得
  operation: Account
  method: GET
  path: /v1/account/balance
  description: API キーから特定された組織の現在の USD 残高と、任意のクレジット設定を返します。
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
