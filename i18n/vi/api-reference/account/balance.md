---
i18nSource: 38d39c933364402c
title: Lấy số dư tài khoản
description: Lấy số dư hiện tại và các thiết lập credit tùy chọn của tổ chức sở hữu API key.
aside: false
outline: false
apiReference:
  title: Lấy số dư tài khoản
  operation: Account
  method: GET
  path: /v1/account/balance
  description: Trả về số dư USD hiện tại và các thiết lập credit tùy chọn của tổ chức được xác định từ API key.
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
