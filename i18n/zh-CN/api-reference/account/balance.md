---
i18nSource: 38d39c933364402c
title: 获取账户余额
description: 获取 API 密钥所属组织的当前余额及可选的信用设置。
aside: false
outline: false
apiReference:
  title: 获取账户余额
  operation: Account
  method: GET
  path: /v1/account/balance
  description: 返回根据 API 密钥解析出的组织的当前美元余额及可选的信用设置。
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
