---
i18nSource: 39ce638efc41350d
title: 生成图像
description: 使用兼容 OpenAI Images 的同步 API 生成图像。
aside: false
outline: false
apiReference:
  title: 生成图像
  operation: Images
  method: POST
  path: /v1/images/generations
  description: 通过 SandBase 兼容 OpenAI Images 的同步端点生成图像。此端点不同于通用的 /v1/run 模型 API。
  signature: client.images.generate(params)
  groups:
    - title: 请求体
      schema: ImageGenerateParams
      fields:
        - name: model
          type: string
          required: true
          description: gpt-image-2、gpt-image-2.5-flare 或 gpt-image-2.5-sunburst 之一。
        - name: prompt
          type: string
          required: true
          description: 要生成的图像的文字描述。
        - name: n
          type: integer
          required: false
          description: 要生成的图像数量（如支持）。
        - name: size
          type: string
          required: false
          description: 模型支持的输出尺寸。
        - name: quality
          type: string
          required: false
          description: 输出质量，例如 low、medium、high 或 auto。
        - name: background
          type: string
          required: false
          description: 背景设置，例如 transparent、opaque 或 auto。
        - name: output_format
          type: string
          required: false
          description: 输出编码，例如 png、webp 或 jpeg。
        - name: output_compression
          type: integer
          required: false
          description: 输出压缩级别，取值 0 到 100。
        - name: moderation
          type: string
          required: false
          description: 提供商兼容的内容审核设置。
        - name: user
          type: string
          required: false
          description: 提供商兼容的终端用户标识符。
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
    - title: 仅支持同步
      description: stream=true、mode=stream 和 mode=async 会被拒绝。请直接使用返回的 data 数组。
    - title: 兼容字段
      description: 其他 JSON 字段会原样转发，但是否支持仍取决于具体模型和提供商。
  errors:
    - status: "400"
      description: JSON 无效、模型不受支持、使用了流式模式，或提供商请求无效。
    - status: "401"
      description: API 密钥缺失或无效。
    - status: "402"
      description: 已达到组织或 API 密钥的支出上限。
    - status: "403"
      description: API 密钥的权限范围不允许访问此端点。
    - status: "404"
      description: 路由到的图像模型不可用。
    - status: "429"
      description: 超出速率限制。
    - status: "500"
      description: 请求持久化或响应处理失败。
    - status: "502"
      description: 提供商返回了无效的原生响应。
    - status: "503"
      description: 所有提供商路由均未成功。
---

<ApiReferencePage />

## 支持的模型 {#supported-models}
以下 OpenAI 图像模型在此端点上使用原生 Images API。请在 `model` 中传入公开的模型名称：

| `model` | 适用场景 |
| --- | --- |
| `gpt-image-2.5-flare` | 快速、高质量的生成与编辑，适合日常创意工作 |
| `gpt-image-2.5-sunburst` | 对视觉保真度和精确度要求最高的工作 |
| `gpt-image-2` | 上一代 GPT Image 模型 |

请求为同步请求，会在 `data` 中以 `b64_json` 或 URL 形式返回图像数据。此端点独立于通用的异步模型端点 `/v1/run`；[模型目录](https://www.sandbase.ai/models/image-video)中每个模型的页面都记录了该接口约定及其定价。

如需编辑图像，请使用相同的模型名称，以 `multipart/form-data` 格式发送到 [`POST /v1/images/edits`](/api-reference/images/edits)。
