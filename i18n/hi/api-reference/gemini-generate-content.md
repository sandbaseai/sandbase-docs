---
i18nSource: d4dc2aeab688ab05
title: Google Gemini GenerateContent
description: native Google Gemini GenerateContent protocol से SandBase को call करें।
aside: false
outline: false
apiReference:
  title: Google Gemini GenerateContent
  operation: Gemini
  method: POST
  path: /v1beta/models/{model}:generateContent
  description: native Gemini request भेजें और Gemini-compatible response पाएँ। Streaming के लिए streamGenerateContent इस्तेमाल करें।
  groups:
    - title: Path parameters
      fields:
        - name: model
          type: string
          required: true
          description: Bare Google model name, जैसे gemini-3.5-flash। SandBase इसे google/{model} के रूप में resolve करता है।
    - title: Request body
      fields:
        - name: contents
          type: array
          required: false
          description: role और parts से बने Gemini conversation contents।
        - name: systemInstruction
          type: object
          required: false
          description: Gemini Content रूप में text system instruction।
        - name: generationConfig
          type: object
          required: false
          description: Sampling, output length, structured output और thinking settings।
        - name: tools
          type: array
          required: false
          description: Function declarations या समर्थित Gemini built-in tool configuration।
        - name: toolConfig
          type: object
          required: false
          description: Gemini function-calling policy।
        - name: safetySettings
          type: array
          required: false
          description: Gemini safety categories और thresholds।
        - name: cachedContent
          type: string
          required: false
          description: समर्थित होने पर आगे भेजा जाने वाला Gemini cached-content resource।
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST \
          "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:generateContent" \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"contents":[{"role":"user","parts":[{"text":"Explain immutable infrastructure in one sentence."}]}]}'
  response:
    status: 200 OK
    code: |-
      {
        "candidates": [
          {
            "content": {
              "role": "model",
              "parts": [{"text": "Immutable infrastructure replaces servers from versioned images instead of modifying them in place."}]
            },
            "finishReason": "STOP",
            "index": 0
          }
        ],
        "usageMetadata": {
          "promptTokenCount": 8,
          "candidatesTokenCount": 15,
          "totalTokenCount": 23
        }
      }
---

<ApiReferencePage />

## प्रमाणीकरण {#authentication}

Google-compatible requests SandBase API key को `x-goog-api-key`, `Authorization: Bearer …`, या `key` query parameter में, इसी प्राथमिकता क्रम में, भेज सकते हैं। Header को प्राथमिकता दें: query-string credentials proxy logs और browser history में दिख सकते हैं।

## स्ट्रीमिंग {#streaming}

Method suffix को `:streamGenerateContent` से बदलें। Query parameter के बिना, SandBase Google-compatible response objects को streamed JSON array के रूप में लौटाता है। Server-Sent Events के लिए `?alt=sse` जोड़ें:

```bash
curl -N -X POST \
  "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:streamGenerateContent?alt=sse" \
  -H "x-goog-api-key: $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Write a short greeting."}]}]}'
```

## नेटिव इमेज जनरेशन {#native-image-generation}

इन image models के लिए dedicated native GenerateContent mappings हैं:

- [Gemini 3 Pro Image（Nano Banana Pro）](https://www.sandbase.ai/models/google/gemini-3-pro-image/docs): `gemini-3-pro-image`
- [Gemini 3.1 Flash Image（Nano Banana 2）](https://www.sandbase.ai/models/google/gemini-3.1-flash-image/docs): `gemini-3.1-flash-image`
- [Gemini Nano Banana 2.1（Nano Banana 2.1）](https://www.sandbase.ai/models/google/gemini-nano-banana-2.1/docs): `gemini-nano-banana-2.1`

हर model पेज पर उसकी token कीमतें और प्रति image लागत दी गई है।

इन mappings के लिए, SandBase request और response payloads को Chat Completions के ज़रिए convert किए बिना
आगे भेजता है। इससे image parts, response modalities और provider-defined fields बने रहते हैं। URL में bare model name
इस्तेमाल करें; उदाहरण के लिए, path में `google/gemini-3.1-flash-image` `gemini-3.1-flash-image` बन जाता है।
### Image edit करें {#edit-an-image}

Source image को text instruction के बगल में एक `inlineData` part के रूप में जोड़ें। भेजे जा रहे bytes का MIME type इस्तेमाल करें:

```json
{
  "contents": [{
    "role": "user",
    "parts": [
      {"text": "Keep the subject unchanged and turn the background into a paper-cut landscape."},
      {"inlineData": {"mimeType": "image/png", "data": "<base64-input-image>"}}
    ]
  }],
  "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"imageSize": "1K"}}
}
```

### Google Gen AI SDK इस्तेमाल करें {#use-the-google-gen-ai-sdk}

आधिकारिक SDK को SandBase की ओर point करें और अपनी SandBase API key इस्तेमाल करें:

```python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="YOUR_SANDBASE_API_KEY",
    http_options=types.HttpOptions(base_url="https://api.sandbase.ai"),
)

response = client.models.generate_content(
    model="gemini-nano-banana-2.1",
    contents="Create a wide editorial illustration of a solar-powered city at sunrise.",
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE"],
        image_config=types.ImageConfig(aspect_ratio="16:9", image_size="1K"),
    ),
)

for part in response.candidates[0].content.parts:
    if part.inline_data:
        with open("output.jpg", "wb") as f:
            f.write(part.inline_data.data)
```

Streaming के लिए, उसी body के साथ `:streamGenerateContent?alt=sse` (SDK: `generate_content_stream`) call करें।

### प्रतिक्रिया प्रबंधन {#response-handling}
Generated media को लौटाए गए candidate parts से पढ़ें। चूँकि ये models native passthrough इस्तेमाल करते हैं, provider-defined
field casing और MIME metadata वैसे ही लौटाए जाते हैं जैसे मिले थे। File extension चुनने से पहले base64 payload को decode करें
और असली media bytes की पुष्टि करें।

## Routing और translation की सीमाएँ {#routing-and-translation-boundaries}

SandBase केवल वही providers चुनता है जो अनुरोधित native Gemini protocol का समर्थन करते हैं। अगर चुने गए model का कोई
compatible native mapping नहीं है, तो request किसी अलग protocol वाले provider पर fallback करने के बजाय विफल हो जाता है।

Translated GenerateContent path इस्तेमाल करने वाले models text, function calls और responses, inline `image/*` data,
और public HTTP(S) image references का समर्थन करते हैं। वह translated path असमर्थित inline MIME types, private Google Files या
`gs://` references, multiple candidates, और असमर्थित response modalities को Google-style `400 INVALID_ARGUMENT`
response के साथ अस्वीकार करता है। ऊपर सूचीबद्ध image-generation mappings raw passthrough इस्तेमाल करती हैं और इन translation-only
limits के अधीन नहीं हैं; लौटाए गए media fields को चुने गए provider के response के अनुसार validate करें।
