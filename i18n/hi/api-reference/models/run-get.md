---
i18nSource: 2ffb24dad49b9c79
title: Asynchronous run प्राप्त करें
description: SandBase के asynchronous model या API run को poll करें और उसका वर्तमान या अंतिम result प्राप्त करें।
aside: false
outline: false
apiReference:
  title: Asynchronous run प्राप्त करें
  operation: Models
  method: GET
  path: /v1/run/{id}
  description: POST /v1/run से बने asynchronous run की वर्तमान या अंतिम स्थिति प्राप्त करें।
  groups:
    - title: Path parameters
      fields:
        - name: id
          type: string
          required: true
          description: POST /v1/run द्वारा लौटाया गया opaque run identifier। इसे ठीक वैसे ही इस्तेमाल करें जैसा लौटाया गया है; किसी prefix की गारंटी नहीं है।
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/run/opaque-run-id \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "completed",
        "outputs": [{"url":"https://media.sandbase.ai/files/result.png","content_type":"image/png"}]
      }
---

<ApiReferencePage />

## पोलिंग {#polling}

लंबे समय तक चलने वाले media या API tasks के लिए हर 5–10 seconds पर poll करें। `status` के `completed`, `failed` या `timeout` होने पर रुक जाएँ। Non-terminal response में `outputs` नहीं भी हो सकता है; run ID को opaque मानें और कोई अलग status URL न बनाएँ।
