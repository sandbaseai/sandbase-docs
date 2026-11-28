---
i18nSource: a4db28360a2974cd
title: Image edit करें
description: synchronous OpenAI Images-compatible API से upload की गई images edit करें।
aside: false
outline: false
apiReference:
  title: Image edit करें
  operation: Images
  method: POST
  path: /v1/images/edits
  description: SandBase के synchronous OpenAI Images-compatible multipart endpoint से एक या अधिक upload की गई images edit करें।
  signature: client.images.edit(params)
  groups:
    - title: Request body
      schema: ImageEditParams
      fields:
        - name: model
          type: string
          required: true
          description: gpt-image-2, gpt-image-2.5-flare या gpt-image-2.5-sunburst में से एक।
        - name: prompt
          type: string
          required: true
          description: अनुरोधित edit का text विवरण।
        - name: image
          type: file | file[]
          required: true
          description: एक या अधिक source image files। कई images के लिए multipart field दोहराएँ।
        - name: mask
          type: file
          required: false
          description: inpainting के लिए वैकल्पिक mask image।
        - name: n
          type: integer
          required: false
          description: समर्थित होने पर लौटाई जाने वाली edited images की संख्या।
        - name: size
          type: string
          required: false
          description: Model द्वारा समर्थित output dimensions।
        - name: quality
          type: string
          required: false
          description: Model द्वारा समर्थित output quality।
        - name: background
          type: string
          required: false
          description: Output background setting।
        - name: input_fidelity
          type: string
          required: false
          description: समर्थित models को source image के details कितनी बारीकी से बनाए रखने चाहिए।
        - name: output_format
          type: string
          required: false
          description: Output encoding, जैसे png, webp या jpeg।
        - name: output_compression
          type: integer
          required: false
          description: 0 से 100 तक output compression level।
        - name: user
          type: string
          required: false
          description: Provider-compatible end-user identifier।
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/images/edits \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -F model=gpt-image-2 \
          -F 'prompt=Turn the daytime sky into a starry night' \
          -F image=@landscape.png
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-...", base_url="https://api.sandbase.ai/v1")
        with open("landscape.png", "rb") as image:
            result = client.images.edit(
                model="gpt-image-2",
                image=image,
                prompt="Turn the daytime sky into a starry night",
            )
        print(result.data[0].b64_json or result.data[0].url)
  response:
    status: 200 OK
    code: |-
      {
        "created": 1787529600,
        "data": [{"b64_json": "iVBORw0KGgo..."}],
        "usage": {
          "input_tokens": 1024,
          "output_tokens": 4096,
          "total_tokens": 5120,
          "input_tokens_details": {"text_tokens": 12, "image_tokens": 1012}
        }
      }
  notes:
    - title: Multipart uploads
      description: model, prompt और image को multipart/form-data के रूप में भेजें। image field दोहराने से कई source files बनी रहती हैं।
    - title: केवल synchronous
      description: stream=true, mode=stream और mode=async अस्वीकार किए जाते हैं।
  errors:
    - status: "400"
      description: अमान्य multipart body, असमर्थित model, streaming mode या provider request।
    - status: "401"
      description: API key मौजूद नहीं है या अमान्य है।
    - status: "402"
      description: Organization या API Key की spending limit पूरी हो गई है।
    - status: "403"
      description: API key scope इस endpoint की अनुमति नहीं देता।
    - status: "404"
      description: Routed image-edit model उपलब्ध नहीं है।
    - status: "429"
      description: Rate limit पार हो गई।
    - status: "500"
      description: Request persistence या response processing विफल रही।
    - status: "502"
      description: Provider ने अमान्य native response लौटाया।
    - status: "503"
      description: कोई भी provider route सफल नहीं हुआ।
---

<ApiReferencePage />

## समर्थित models {#supported-models}
ये OpenAI image models इस endpoint पर और [`/v1/images/generations`](/api-reference/images/generations) पर native Images API का उपयोग करते हैं। `model` में public model name भेजें:

| `model` | किसके लिए सबसे अच्छा |
| --- | --- |
| `gpt-image-2.5-flare` | रोज़मर्रा के creative काम के लिए तेज़, उच्च-गुणवत्ता वाला generation और editing |
| `gpt-image-2.5-sunburst` | ऐसा काम जहाँ visual fidelity और precision सबसे ज़्यादा मायने रखते हैं |
| `gpt-image-2` | पिछली GPT Image generation |

Requests synchronous होते हैं और image data को `data` में `b64_json` या URL के रूप में लौटाते हैं। यह endpoint सामान्य asynchronous `/v1/run` model endpoint से अलग है; [model catalog](https://www.sandbase.ai/models/image-video) में हर model का page उस contract और उसकी pricing का विवरण देता है।

`model`, `prompt` और कम से कम एक `image` file दें। कई source images को compose या edit करने के लिए `image` field दोहराएँ:

```bash
curl https://api.sandbase.ai/v1/images/edits \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -F "model=gpt-image-2.5-flare" \
  -F "prompt=Turn this product photo into a warm editorial scene" \
  -F "image=@product.png" \
  -F "quality=high"
```
