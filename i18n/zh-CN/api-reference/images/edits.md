---
i18nSource: a4db28360a2974cd
title: 编辑图像
description: 使用兼容 OpenAI Images 的同步 API 编辑上传的图像。
aside: false
outline: false
apiReference:
  title: 编辑图像
  operation: Images
  method: POST
  path: /v1/images/edits
  description: 通过 SandBase 兼容 OpenAI Images 的同步 multipart 端点编辑一张或多张上传的图像。
  signature: client.images.edit(params)
  groups:
    - title: 请求体
      schema: ImageEditParams
      fields:
        - name: model
          type: string
          required: true
          description: gpt-image-2、gpt-image-2.5-flare 或 gpt-image-2.5-sunburst 之一。
        - name: prompt
          type: string
          required: true
          description: 对所需编辑的文字描述。
        - name: image
          type: file | file[]
          required: true
          description: 一个或多个源图像文件。如有多张图像，请重复该 multipart 字段。
        - name: mask
          type: file
          required: false
          description: 用于局部重绘（inpainting）的可选蒙版图像。
        - name: n
          type: integer
          required: false
          description: 要返回的编辑后图像数量（如模型支持）。
        - name: size
          type: string
          required: false
          description: 模型支持的输出尺寸。
        - name: quality
          type: string
          required: false
          description: 模型支持的输出质量。
        - name: background
          type: string
          required: false
          description: 输出背景设置。
        - name: input_fidelity
          type: string
          required: false
          description: 支持的模型保留源图像细节的程度。
        - name: output_format
          type: string
          required: false
          description: 输出编码格式，如 png、webp 或 jpeg。
        - name: output_compression
          type: integer
          required: false
          description: 输出压缩级别，0 到 100。
        - name: user
          type: string
          required: false
          description: 与服务商兼容的终端用户标识符。
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
    - title: Multipart 上传
      description: 以 multipart/form-data 发送 model、prompt 和 image。重复 image 字段可保留多个源文件。
    - title: 仅支持同步
      description: stream=true、mode=stream 和 mode=async 会被拒绝。
  errors:
    - status: "400"
      description: multipart 请求体无效、模型不受支持、使用了流式模式，或服务商请求无效。
    - status: "401"
      description: API 密钥缺失或无效。
    - status: "402"
      description: 已达到组织或 API Key 的消费限额。
    - status: "403"
      description: API 密钥的权限范围未授权此端点。
    - status: "404"
      description: 路由到的图像编辑模型不可用。
    - status: "429"
      description: 超出速率限制。
    - status: "500"
      description: 请求持久化或响应处理失败。
    - status: "502"
      description: 服务商返回了无效的原生响应。
    - status: "503"
      description: 所有服务商路由均未成功。
---

<ApiReferencePage />

## 支持的模型 {#supported-models}
以下 OpenAI 图像模型在此端点和 [`/v1/images/generations`](/api-reference/images/generations) 上使用原生 Images API。请在 `model` 中传入公开模型名称：

| `model` | 适用场景 |
| --- | --- |
| `gpt-image-2.5-flare` | 快速、高质量的生成与编辑，适合日常创作 |
| `gpt-image-2.5-sunburst` | 对视觉保真度和精确度要求最高的工作 |
| `gpt-image-2` | 上一代 GPT Image 模型 |

请求为同步模式，在 `data` 中以 `b64_json` 或 URL 形式返回图像数据。该端点独立于通用的异步 `/v1/run` 模型端点；[模型目录](https://www.sandbase.ai/models/image-video)中每个模型的页面都记录了相应的调用约定和价格。

请提供 `model`、`prompt` 以及至少一个 `image` 文件。重复 `image` 字段即可合成或编辑多张源图像：

```bash
curl https://api.sandbase.ai/v1/images/edits \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -F "model=gpt-image-2.5-flare" \
  -F "prompt=Turn this product photo into a warm editorial scene" \
  -F "image=@product.png" \
  -F "quality=high"
```
