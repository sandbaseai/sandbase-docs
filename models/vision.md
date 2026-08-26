---
title: Vision
description: Send image inputs to currently available SandBase vision models.
---

# Vision

Vision models accept images together with text. Availability, image limits, accepted formats, context limits, and pricing are model-specific, so select a current model from the live catalog before sending a request.

## Choose a vision model

- Browse [Models](https://www.sandbase.ai/models) and filter for the required image-input capability.
- Verify the exact model ID and request fields in the [Model API Reference](/model-api-reference/llm-models).
- Use [`GET /v1/models`](/api-reference/models/list) and the detailed model endpoint when selecting a model programmatically.

Do not maintain a fixed list of vision models in application code. A model can be renamed, disabled, rerouted, or updated independently of this guide.

## Send an image

For an OpenAI-compatible vision model, send text and image content parts in the same message. Replace `$MODEL_ID` with an enabled model ID whose model card declares image-input support.

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "'"$MODEL_ID"'",
    "messages": [{
      "role": "user",
      "content": [
        {"type": "text", "text": "What is shown in this image?"},
        {"type": "image_url", "image_url": {"url": "https://example.com/photo.jpg"}}
      ]
    }]
  }'
```

Depending on the selected model, image inputs may accept an HTTPS URL, a data URL, or an uploaded media asset. Follow that model's generated reference rather than assuming every vision model accepts the same transport.

## Production guidance

- Validate media type, size, count, and accessibility before sending the request.
- Avoid placing private images at publicly accessible URLs; use the supported upload or asset flow when appropriate.
- Set request timeouts that account for image download and processing.
- Treat image and prompt contents as sensitive application data.
- Handle unsupported-input and unavailable-model errors explicitly.

## Next steps

- [Capabilities](/models/capabilities)
- [Supported Models](/models/supported)
- [Upload Media](/api-reference/models/upload)
- [Model API Reference](/model-api-reference/)
