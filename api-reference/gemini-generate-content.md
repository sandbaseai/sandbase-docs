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

- [Nano Banana Pro (Gemini 3 Pro Image)](/model-api-reference/official-native-api/google/gemini-3-pro-image)
- [Nano Banana 2 (Gemini 3.1 Flash Image)](/model-api-reference/official-native-api/google/gemini-3.1-flash-image)

For these mappings, SandBase forwards the request and response payloads without converting them through Chat
Completions. This preserves image parts, response modalities, and provider-defined fields. Use the bare model name in
the URL; for example, `google/gemini-3.1-flash-image` becomes `gemini-3.1-flash-image` in the path.

## Routing and translation boundaries

SandBase selects only providers that support the requested native Gemini protocol. If the selected model has no
compatible native mapping, the request fails instead of falling back to a provider with a different protocol.

Models that use the translated GenerateContent path support text, function calls and responses, inline `image/*` data,
and public HTTP(S) image references. That translated path rejects unsupported inline MIME types, private Google Files or
`gs://` references, multiple candidates, and unsupported response modalities with a Google-style `400 INVALID_ARGUMENT`
response. The image-generation mappings listed above use raw passthrough and are not subject to those translation-only
limits; validate the returned media fields according to the selected provider's response.
