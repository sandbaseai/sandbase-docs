---
i18nSource: efa205ed7505643c
title: Model या API capability run करें
description: Unified run endpoint से SandBase model या API capability submit करें।
aside: false
outline: false
apiReference:
  title: Model या API capability run करें
  operation: Models
  method: POST
  path: /v1/run
  description: Enabled SandBase model या API capability execute करें। Request fields हर capability के लिए अलग होते हैं; चुनी गई capability के schema के लिए SandBase वेबसाइट पर model या API reference पेज देखें।
  groups:
    - title: Request body
      fields:
        - name: model
          type: string
          required: true
          description: Enabled logical model या API capability identifier।
        - name: mode
          type: auto | sync | async | stream
          required: false
          description: Execution mode का संकेत। `auto` चुनी गई capability का कॉन्फ़िगर किया गया डिफ़ॉल्ट इस्तेमाल करता है; दूसरे values के लिए capability का support ज़रूरी है।
        - name: stream
          type: boolean
          required: false
          description: "चुनी गई capability सपोर्ट करे तो streaming output मांगें। `mode: stream` के बराबर।"
        - name: webhook_url
          type: string
          required: false
          description: सपोर्टेड asynchronous image के लिए वैकल्पिक HTTPS callback
          video: null
          or audio tasks. See the Webhooks reference for validation and delivery behavior.: null
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/run \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-image-2","prompt":"A studio product photo on a clean white background"}'
  response:
    status: 200 OK or 202 Accepted
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "pending"
      }
---

<ApiReferencePage />

## Execution और results {#execution-and-results}

Synchronous capabilities मूल request में ही पूरा response लौटाती हैं। Asynchronous capabilities एक opaque `id` के साथ `202 Accepted` लौटाती हैं; status terminal होने तक [Get an asynchronous run](./run-get) को poll करें।

Capability के अपने request fields और output shapes चुने गए model या API operation के पेज पर दिए गए हैं। इन fields को JSON body के top level पर भेजें; इन्हें किसी `input` object में न लपेटें। यह न मानें कि हर capability एक जैसे parameters स्वीकार करती है।

## वेबहुक कॉलबैक {#webhook-callbacks}

`webhook_url` सिर्फ़ सपोर्टेड asynchronous image, video या audio tasks के लिए सेट करें। पूरा होने या विफल होने के बाद SandBase अंतिम run event को HTTPS endpoint पर भेजता है; callback सिर्फ़ delivery का संकेत है, `GET /v1/run/{id}` का विकल्प नहीं। प्रामाणिक status के लिए run endpoint को हमेशा poll करते रहें, और callback देर से आने या दोहराए जाने पर सुरक्षित रूप से retry करें। Synchronous model responses और provider-native endpoints इस callback field का इस्तेमाल नहीं करते।
