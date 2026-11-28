---
i18nSource: 8ddefa727d909bc8
title: Google Gemini Interactions
description: native Google protocol के ज़रिए model Interactions बनाएँ, stream करें और poll करें।
aside: false
outline: false
apiReference:
  title: Google Gemini Interactions
  operation: Gemini
  method: POST
  path: /v1beta/interactions
  description: native Google Interaction बनाएँ। HTTP 200 पर भी status जाँचें; in_progress response को poll करना ज़रूरी है।
  groups:
    - title: Request body
      fields:
        - name: model
          type: string
          required: true
          description: Logical SandBase model name।
        - name: input
          type: string | object | array
          required: true
          description: Native Google Interaction input।
        - name: stream
          type: boolean
          required: false
          description: Model द्वारा समर्थित होने पर Google Interactions SSE events लौटाएँ।
        - name: background
          type: boolean
          required: false
          description: Durable रूप से submit करें और तुरंत poll किया जा सकने वाला Interaction लौटाएँ। stream के साथ नहीं मिलाया जा सकता।
        - name: previous_interaction_id
          type: string
          required: false
          description: provider affinity बनाए रखते हुए किसी upstream Interaction से आगे जारी रखें।
        - name: store
          type: boolean
          required: false
          description: upstream storage preference को बिना बदले आगे भेजें।
        - name: system_instruction
          type: string
          required: false
          description: Native system instruction।
        - name: tools
          type: array
          required: false
          description: Native Google tool definitions।
        - name: generation_config
          type: object
          required: false
          description: Native generation configuration।
        - name: response_format
          type: object | array
          required: false
          description: अनुरोधित response format।
        - name: response_modalities
          type: array
          required: false
          description: अनुरोधित output modalities।
  examples:
    - label: Background request
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1beta/interactions \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "google/gemini-omni-flash-preview",
            "input": "A red ball rolls across a table, 3 seconds.",
            "background": true,
            "response_format": {"type": "video"}
          }'
  response:
    status: 200 OK
    code: |-
      {
        "id": "job_75b74acd12534b01baba820b",
        "object": "interaction",
        "model": "google/gemini-omni-flash-preview",
        "status": "in_progress"
      }
---

<ApiReferencePage />

## प्रमाणीकरण {#authentication}

`x-goog-api-key`, `Authorization: Bearer …`, या `key` query parameter इसी प्राथमिकता क्रम में इस्तेमाल करें। Header को प्राथमिकता दें, क्योंकि query-string credentials log हो सकते हैं।

## समर्थित models {#supported-models}

Interactions endpoint हर उस model के लिए generic route नहीं है जिसका catalog name `google/` से शुरू होता है। Model का
Interactions-compatible provider mapping होना चाहिए। SandBase अभी इन compatible models को document करता है:

- Gemini Omni Flash Preview: `google/gemini-omni-flash-preview`
- Gemini Omni 1.1 Flash Preview: `google/gemini-omni-1.1-flash-preview`

अन्य Google models दूसरे endpoints इस्तेमाल करते हैं। उदाहरण के लिए, Nano Banana Pro और Nano Banana 2
[`/v1beta/models/{model}:generateContent`](/api-reference/gemini-generate-content) इस्तेमाल करते हैं, `/v1beta/interactions` नहीं। असमर्थित model किसी अलग Google protocol से route होने
के बजाय विफल हो जाता है।

## सफलता और polling {#success-and-polling}

सफल submissions HTTP `200` लौटाते हैं, जिसमें background work और वे synchronous requests भी शामिल हैं जिनका सीमित इंतज़ार समाप्त हो जाता है। हमेशा `status` जाँचें:

- `completed`, `failed`, `cancelled` और `incomplete` terminal हैं।
- `in_progress` अभी चल रहा है। `GET /v1beta/interactions/{id}` को poll करें; response में यह path `Location` header में भी हो सकता है।
- `requires_action` एक protocol status है, लेकिन SandBase अभी वह tool-confirmation endpoint उपलब्ध नहीं कराता जो इसे आगे बढ़ाने के लिए ज़रूरी है।

Polling ID वह upstream Interaction `id` है जो `POST` लौटाता है, SandBase prediction ID नहीं। Interaction बनाने वाली उसी SandBase API key से ही उसे retrieve करना होगा।

```bash
curl https://api.sandbase.ai/v1beta/interactions/job_75b74acd12534b01baba820b \
  -H "x-goog-api-key: $SANDBASE_API_KEY"
```

Non-terminal GET responses में partial output और usage नहीं होते। Terminal responses में inline image, audio या video data हो सकता है और वे कई megabytes के हो सकते हैं। ज़रूरी media को तुरंत download करें और सहेजें: upstream retention समाप्त होने के बाद, SandBase केवल structure और metadata वाला lossy terminal fallback लौटा सकता है, मूल media bytes नहीं।

## स्ट्रीमिंग {#streaming}

Request body में `stream: true` सेट करें। Response `text/event-stream` होता है; इस protocol में `?alt=sse` इस्तेमाल नहीं होता। Event और delta types open-ended हैं और बिना किसी fixed allowlist के आगे भेजे जाते हैं, इसलिए clients को अज्ञात मानों को सहन करना चाहिए। Streaming headers लिखे जाने के बाद, failures अलग HTTP status के बजाय `error` event के रूप में आते हैं।

Streaming model पर निर्भर है। Protocol के समर्थन के बावजूद कोई upstream provider `stream: true` को अस्वीकार कर सकता है।

## मौजूदा सीमाएँ {#current-limits}

SandBase अभी केवल create और get उपलब्ध कराता है:

- Agent Interactions अस्वीकार किए जाते हैं; `model` इस्तेमाल करें।
- `background: true` और `stream: true` को साथ नहीं इस्तेमाल किया जा सकता।
- Interaction list, delete और cancel उपलब्ध नहीं हैं।
- URI delivery और GET-based stream reconnection उपलब्ध नहीं हैं।
- `previous_interaction_id` के लिए live provider-affinity mapping और upstream support ज़रूरी है। Affinity उपलब्ध न होने पर SandBase चुपचाप provider बदलने के बजाय विफल हो जाता है।

Errors Google envelope `{ "error": { "code", "message", "status" } }` इस्तेमाल करते हैं। HTTP status को स्थिर मानें; `message` में sanitized upstream text बदल सकता है।
