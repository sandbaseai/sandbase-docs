---
title: "Gemini Nano Banana 2.1（Nano Banana 2.1）Native API Reference"
description: "Native Gemini GenerateContent API reference for google/gemini-nano-banana-2.1 (Nano Banana 2.1) on AGRouter."
aside: false
outline: false
apiReference:
  title: Gemini Nano Banana 2.1（Nano Banana 2.1）
  operation: Gemini GenerateContent
  method: POST
  path: /v1beta/models/gemini-nano-banana-2.1:generateContent
  description: Generate or edit images with Nano Banana 2.1 through the native Google Gemini protocol. AGRouter preserves the provider request and response payload instead of converting it to Chat Completions.
  groups:
    - title: Request body
      description: Send a native Gemini GenerateContent body. Provider-defined fields are passed through for this model.
      fields:
        - { name: contents, type: array, required: true, description: Gemini Content objects containing the prompt and optional input images. }
        - { name: generationConfig.responseModalities, type: "array<string>", required: true, description: "Requested output modalities. Include IMAGE; include TEXT when you also want a text part." }
        - { name: generationConfig.imageConfig.aspectRatio, type: string, required: false, description: "Output aspect ratio, for example 1:1, 16:9, 9:16, 21:9, 4:1 or 1:8." }
        - { name: generationConfig.imageConfig.imageSize, type: string, required: false, description: "Output resolution: 1K, 2K or 4K. Nano Banana 2.1 has no 0.5K tier." }
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST \
          "https://api.agrouter.ai/v1beta/models/gemini-nano-banana-2.1:generateContent" \
          -H "x-goog-api-key: $AGROUTER_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "contents": [{
              "role": "user",
              "parts": [{"text": "Create a wide editorial illustration of a solar-powered city at sunrise."}]
            }],
            "generationConfig": {
              "responseModalities": ["IMAGE"],
              "imageConfig": {"aspectRatio": "16:9", "imageSize": "1K"}
            }
          }'
  response:
    status: 200 OK
    code: |-
      {
        "candidates": [{
          "content": {
            "role": "model",
            "parts": [
              {"inlineData": {"mimeType": "image/jpeg", "data": "<base64-image>"}, "thoughtSignature": "<signature>"}
            ]
          },
          "finishReason": "STOP",
          "index": 0
        }],
        "usageMetadata": {
          "promptTokenCount": 14,
          "candidatesTokenCount": 1120,
          "candidatesTokensDetails": [{"modality": "IMAGE", "tokenCount": 1120}],
          "totalTokenCount": 1134
        }
      }
seo:
  modelName: "Gemini Nano Banana 2.1（Nano Banana 2.1）"
  modelId: "google/gemini-nano-banana-2.1"
  vendor: "Google"
  vendorSlug: "google"
  modelSlug: "gemini-nano-banana-2.1"
  protocol: "Gemini GenerateContent API"
  endpoint: "/v1beta/models/gemini-nano-banana-2.1:generateContent"
  publishedAt: "2026-10-08T00:00:00Z"
  capabilities: ["image_generation", "image_editing"]
  category: "Official Native API"
---

<ApiReferencePage />

## Edit an image

Add the source image as an `inlineData` part next to the text instruction. Use the MIME type of the bytes you send:

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

## Use the Google Gen AI SDK

Point the official SDK at AGRouter and use your AGRouter API key:

```python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="YOUR_AGROUTER_API_KEY",
    http_options=types.HttpOptions(base_url="https://api.agrouter.ai"),
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

For streaming, call `:streamGenerateContent?alt=sse` (SDK: `generate_content_stream`) with the same body.


## Response handling

Read generated media from the returned candidate parts. Because this model uses native passthrough, provider-defined
field casing and MIME metadata are returned as received. The output is usually JPEG; decode the base64 payload and
verify the actual media bytes before choosing a file extension. Keep `thoughtSignature` when you send the turn back in
multi-turn editing.

## Official Google resources

- [Gemini API documentation](https://ai.google.dev/gemini-api/docs)
- [Image generation documentation](https://ai.google.dev/gemini-api/docs/image-generation)
- [GenerateContent API reference](https://ai.google.dev/api/generate-content)
- [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)
