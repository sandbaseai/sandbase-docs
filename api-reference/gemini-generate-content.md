---
title: Google Gemini GenerateContent
description: Call SandBase with the native Google Gemini GenerateContent protocol.
aside: false
outline: false
apiReference:
  title: Google Gemini GenerateContent
  operation: Gemini
  method: POST
  path: /v1beta/models/{model}:generateContent
  description: Send a native Gemini request and receive a Gemini-compatible response. Use streamGenerateContent for streaming.
  groups:
    - title: Path parameters
      fields:
        - { name: model, type: string, required: true, description: "Bare Google model name, such as gemini-3.5-flash. SandBase resolves it as google/{model}." }
    - title: Request body
      fields:
        - { name: contents, type: array, required: false, description: Gemini conversation contents made of role and parts. }
        - { name: systemInstruction, type: object, required: false, description: Text system instruction in Gemini Content form. }
        - { name: generationConfig, type: object, required: false, description: "Sampling, output length, structured output, and thinking settings." }
        - { name: tools, type: array, required: false, description: Function declarations or supported Gemini built-in tool configuration. }
        - { name: toolConfig, type: object, required: false, description: Gemini function-calling policy. }
        - { name: safetySettings, type: array, required: false, description: Gemini safety categories and thresholds. }
        - { name: cachedContent, type: string, required: false, description: Gemini cached-content resource passed through when supported. }
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

## Authentication

Google-compatible requests can carry the SandBase API key in `x-goog-api-key`, `Authorization: Bearer …`, or the `key` query parameter, in that priority order. Prefer a header: query-string credentials can appear in proxy logs and browser history.

## Streaming

Replace the method suffix with `:streamGenerateContent`. Without a query parameter, SandBase returns Google-compatible response objects as a streamed JSON array. Add `?alt=sse` for Server-Sent Events:

```bash
curl -N -X POST \
  "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:streamGenerateContent?alt=sse" \
  -H "x-goog-api-key: $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Write a short greeting."}]}]}'
```

## Native image generation

These image models have dedicated native GenerateContent mappings:

- [Gemini 3 Pro Image（Nano Banana Pro）](https://www.sandbase.ai/models/google/gemini-3-pro-image/docs): `gemini-3-pro-image`
- [Gemini 3.1 Flash Image（Nano Banana 2）](https://www.sandbase.ai/models/google/gemini-3.1-flash-image/docs): `gemini-3.1-flash-image`
- [Gemini Nano Banana 2.1（Nano Banana 2.1）](https://www.sandbase.ai/models/google/gemini-nano-banana-2.1/docs): `gemini-nano-banana-2.1`

Each model page lists its token prices and per-image cost.

For these mappings, SandBase forwards the request and response payloads without converting them through Chat
Completions. This preserves image parts, response modalities, and provider-defined fields. Use the bare model name in
the URL; for example, `google/gemini-3.1-flash-image` becomes `gemini-3.1-flash-image` in the path.
### Edit an image

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

### Use the Google Gen AI SDK

Point the official SDK at SandBase and use your SandBase API key:

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

For streaming, call `:streamGenerateContent?alt=sse` (SDK: `generate_content_stream`) with the same body.

### Response handling
Read generated media from the returned candidate parts. Because these models use native passthrough, provider-defined
field casing and MIME metadata are returned as received. Decode the base64 payload and verify the actual media bytes
before choosing a file extension.

## Routing and translation boundaries

SandBase selects only providers that support the requested native Gemini protocol. If the selected model has no
compatible native mapping, the request fails instead of falling back to a provider with a different protocol.

Models that use the translated GenerateContent path support text, function calls and responses, inline `image/*` data,
and public HTTP(S) image references. That translated path rejects unsupported inline MIME types, private Google Files or
`gs://` references, multiple candidates, and unsupported response modalities with a Google-style `400 INVALID_ARGUMENT`
response. The image-generation mappings listed above use raw passthrough and are not subject to those translation-only
limits; validate the returned media fields according to the selected provider's response.
