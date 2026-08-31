---
title: "Nano Banana 2 Native API Reference"
description: "Native Gemini GenerateContent API reference for google/gemini-3.1-flash-image (Nano Banana 2) on SandBase."
aside: false
outline: false
apiReference:
  title: Nano Banana 2 (Gemini 3.1 Flash Image)
  operation: Gemini GenerateContent
  method: POST
  path: /v1beta/models/gemini-3.1-flash-image:generateContent
  description: Generate or edit images with Nano Banana 2 through the native Google Gemini protocol. SandBase preserves the provider request and response payload instead of converting it to Chat Completions.
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
          "https://api.sandbase.ai/v1beta/models/gemini-3.1-flash-image:generateContent" \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "contents": [{
              "role": "user",
              "parts": [{"text": "Create a wide editorial illustration of a solar-powered city at sunrise."}]
            }],
            "generationConfig": {
              "responseModalities": ["IMAGE"],
              "imageConfig": {"aspectRatio": "16:9"}
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
              {"inline_data": {"mime_type": "image/png", "data": "<base64-image>"}}
            ]
          },
          "finishReason": "STOP",
          "index": 0
        }],
        "usageMetadata": {"totalTokenCount": 980}
      }
seo:
  modelName: "Nano Banana 2 (Gemini 3.1 Flash Image)"
  modelId: "google/gemini-3.1-flash-image"
  vendor: "Google"
  vendorSlug: "google"
  modelSlug: "gemini-3.1-flash-image"
  protocol: "Gemini GenerateContent API"
  endpoint: "/v1beta/models/gemini-3.1-flash-image:generateContent"
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
      {"text": "Keep the subject unchanged and turn the background into a paper-cut landscape."},
      {"inlineData": {"mimeType": "image/png", "data": "<base64-input-image>"}}
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
