---
i18nSource: 38d39c933364402c
title: ดูยอดคงเหลือบัญชี
description: ดูยอดคงเหลือปัจจุบันและการตั้งค่าเครดิต (ถ้ามี) ขององค์กรที่เป็นเจ้าของ API key
aside: false
outline: false
apiReference:
  title: ดูยอดคงเหลือบัญชี
  operation: Account
  method: GET
  path: /v1/account/balance
  description: แสดงยอดคงเหลือปัจจุบันเป็น USD และการตั้งค่าเครดิต (ถ้ามี) ขององค์กรที่ระบุได้จาก API key
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
