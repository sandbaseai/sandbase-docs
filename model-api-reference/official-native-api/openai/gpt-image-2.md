---
title: GPT Image 2 Native API Reference
description: Generate images with GPT Image 2 through SandBase's native OpenAI Images API.
aside: false
outline: false
apiReference:
  title: GPT Image 2
  operation: OpenAI Images
  method: POST
  path: /v1/images/generations
  description: Generate images with the provider-compatible OpenAI Images API. This synchronous endpoint returns image data directly.
  signature: client.images.generate(params)
  groups:
    - title: Request body
      schema: ImageGenerateParams
      description: Use the native OpenAI Images request shape. The model must be gpt-image-2.
      fields:
        - { name: model, type: string, required: true, description: Use gpt-image-2 on this endpoint., default: gpt-image-2 }
        - { name: prompt, type: string, required: true, description: Text description of the image to generate. }
        - { name: n, type: integer, required: false, description: Number of images to generate when supported. }
        - { name: size, type: string, required: false, description: Output dimensions supported by the model. }
        - { name: quality, type: string, required: false, description: Output quality such as low, medium, high, or auto. }
        - { name: background, type: string, required: false, description: Background setting such as transparent, opaque, or auto. }
        - { name: output_format, type: string, required: false, description: Output encoding such as png, webp, or jpeg. }
        - { name: output_compression, type: integer, required: false, description: Output compression level from 0 to 100. }
        - { name: moderation, type: string, required: false, description: Provider-compatible moderation setting. }
        - { name: user, type: string, required: false, description: Provider-compatible end-user identifier. }
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
        "usage": {"input_tokens": 12, "output_tokens": 4096, "total_tokens": 4108}
      }
---

<ApiReferencePage />

## Native protocol notes

This model uses the OpenAI Images API contract, not the general SandBase `/v1/run` model endpoint. Requests are synchronous and return the generated image in `data` as `b64_json` or a URL.

Use the shared [image generation reference](/api-reference/images/generations) for authentication, response details, limits, and error handling. The SandBase catalog entry is `openai/gpt-image-2-official`; because this endpoint preserves the OpenAI Images protocol, send the provider model name `gpt-image-2` in the request body.

## Official OpenAI resources

- [Images API guide](https://platform.openai.com/docs/guides/images)
- [Images API reference](https://platform.openai.com/docs/api-reference/images)
- [OpenAI API quickstart](https://platform.openai.com/docs/quickstart)
