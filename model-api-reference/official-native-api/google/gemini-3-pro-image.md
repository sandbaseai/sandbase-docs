---
title: "Nano Banana Pro Native API Reference"
description: "Native Gemini GenerateContent API reference for google/gemini-3-pro-image (Nano Banana Pro) on SandBase."
aside: false
outline: false
apiReference:
  title: Nano Banana Pro (Gemini 3 Pro Image)
  operation: Gemini GenerateContent
  method: POST
  path: /v1beta/models/gemini-3-pro-image:generateContent
  description: Generate or edit images with Nano Banana Pro through the native Google Gemini protocol. SandBase preserves the provider request and response payload instead of converting it to Chat Completions.
  groups:
    - title: Request body
      description: Send a native Gemini GenerateContent body. Provider-defined fields are passed through for this model.
      fields:
        - { name: contents, type: array, required: true, description: Gemini Content objects containing the prompt and optional input images. }
        - { name: generationConfig.responseModalities, type: "array<string>", required: true, description: "Requested output modalities. Include IMAGE; include TEXT when you also want a text part." }
        - { name: generationConfig.imageConfig, type: object, required: false, description: "Image options such as aspectRatio, when supported by the provider." }
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST \
          "https://api.sandbase.ai/v1beta/models/gemini-3-pro-image:generateContent" \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "contents": [{
              "role": "user",
              "parts": [{"text": "Create a studio product photo of a translucent blue perfume bottle on white marble."}]
            }],
            "generationConfig": {
              "responseModalities": ["TEXT", "IMAGE"],
              "imageConfig": {"aspectRatio": "1:1"}
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
              {"text": "Here is the generated image."},
              {"inlineData": {"mimeType": "image/png", "data": "<base64-image>"}}
            ]
          },
          "finishReason": "STOP",
          "index": 0
        }],
        "usageMetadata": {"totalTokenCount": 1290}
      }
seo:
  modelName: "Nano Banana Pro (Gemini 3 Pro Image)"
  modelId: "google/gemini-3-pro-image"
  vendor: "Google"
  vendorSlug: "google"
  modelSlug: "gemini-3-pro-image"
  protocol: "Gemini GenerateContent API"
  endpoint: "/v1beta/models/gemini-3-pro-image:generateContent"
  publishedAt: "2026-08-31T00:00:00Z"
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
      {"text": "Replace the background with a warm sunset gradient."},
      {"inlineData": {"mimeType": "image/jpeg", "data": "<base64-input-image>"}}
    ]
  }],
  "generationConfig": {"responseModalities": ["IMAGE"]}
}
```

## Response handling

Read generated media from the returned candidate parts. Because this model uses native passthrough, provider-defined
field casing and MIME metadata are returned as received. Decode the base64 payload and verify the actual media bytes
before choosing a file extension.

## Official Google resources

- [Gemini API documentation](https://ai.google.dev/gemini-api/docs)
- [Image generation documentation](https://ai.google.dev/gemini-api/docs/image-generation)
- [GenerateContent API reference](https://ai.google.dev/api/generate-content)
