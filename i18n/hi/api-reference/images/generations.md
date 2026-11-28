---
i18nSource: 39ce638efc41350d
title: Image generate करें
description: Synchronous OpenAI Images-compatible API से image generate करें।
aside: false
outline: false
apiReference:
  title: Image generate करें
  operation: Images
  method: POST
  path: /v1/images/generations
  description: SandBase के synchronous OpenAI Images-compatible endpoint से images generate करें। यह endpoint सामान्य /v1/run model API से अलग है।
  signature: client.images.generate(params)
  groups:
    - title: Request body
      schema: ImageGenerateParams
      fields:
        - name: model
          type: string
          required: true
          description: gpt-image-2, gpt-image-2.5-flare, या gpt-image-2.5-sunburst में से एक।
        - name: prompt
          type: string
          required: true
          description: Generate की जाने वाली image का text विवरण।
        - name: n
          type: integer
          required: false
          description: समर्थित होने पर generate की जाने वाली images की संख्या।
        - name: size
          type: string
          required: false
          description: Model द्वारा समर्थित output dimensions।
        - name: quality
          type: string
          required: false
          description: Output quality, जैसे low, medium, high, या auto।
        - name: background
          type: string
          required: false
          description: Background setting, जैसे transparent, opaque, या auto।
        - name: output_format
          type: string
          required: false
          description: Output encoding, जैसे png, webp, या jpeg।
        - name: output_compression
          type: integer
          required: false
          description: 0 से 100 तक output compression level।
        - name: moderation
          type: string
          required: false
          description: Provider-compatible moderation setting।
        - name: user
          type: string
          required: false
          description: Provider-compatible end-user identifier।
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/images/generations \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"gpt-image-2","prompt":"A paper-cut city floating above the clouds","size":"1024x1024"}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-...", base_url="https://api.sandbase.ai/v1")
        result = client.images.generate(
            model="gpt-image-2",
            prompt="A paper-cut city floating above the clouds",
            size="1024x1024",
        )
        print(result.data[0].b64_json or result.data[0].url)
  response:
    status: 200 OK
    code: |-
      {
        "created": 1787529600,
        "data": [{"b64_json": "iVBORw0KGgo..."}],
        "usage": {
          "input_tokens": 12,
          "output_tokens": 4096,
          "total_tokens": 4108,
          "input_tokens_details": {"text_tokens": 12, "image_tokens": 0}
        }
      }
  notes:
    - title: केवल synchronous
      description: stream=true, mode=stream और mode=async अस्वीकार किए जाते हैं। लौटाए गए data array का सीधे उपयोग करें।
    - title: Compatible fields
      description: अतिरिक्त JSON fields बिना बदलाव के आगे भेजे जाते हैं, लेकिन उनका समर्थन model और provider पर निर्भर करता है।
  errors:
    - status: "400"
      description: अमान्य JSON, असमर्थित model, streaming mode, या provider request।
    - status: "401"
      description: API key नहीं है या अमान्य है।
    - status: "402"
      description: Organization या API Key की spending limit पूरी हो गई।
    - status: "403"
      description: API key scope इस endpoint की अनुमति नहीं देता।
    - status: "404"
      description: Route किया गया image model उपलब्ध नहीं है।
    - status: "429"
      description: Rate limit पार हो गई।
    - status: "500"
      description: Request persistence या response processing विफल हुआ।
    - status: "502"
      description: Provider ने अमान्य native response लौटाया।
    - status: "503"
      description: कोई भी provider route सफल नहीं हुआ।
---

<ApiReferencePage />

## समर्थित models {#supported-models}
ये OpenAI image models इस endpoint पर native Images API का उपयोग करते हैं। `model` में public model name भेजें:

| `model` | किसके लिए सबसे उपयुक्त |
| --- | --- |
| `gpt-image-2.5-flare` | रोज़मर्रा के creative काम के लिए तेज़, उच्च-गुणवत्ता वाला generation और editing |
| `gpt-image-2.5-sunburst` | ऐसा काम जहाँ visual fidelity और सटीकता सबसे ज़्यादा मायने रखती है |
| `gpt-image-2` | पिछली GPT Image generation |

Requests synchronous होते हैं और image data को `data` में `b64_json` या URL के रूप में लौटाते हैं। यह endpoint सामान्य asynchronous `/v1/run` model endpoint से अलग है; [model catalog](https://www.sandbase.ai/models/image-video) में हर model का page उस contract और उसकी pricing का विवरण देता है।

Images edit करने के लिए, उन्हीं model names के साथ [`POST /v1/images/edits`](/api-reference/images/edits) पर `multipart/form-data` भेजें।

