---
i18nSource: d4dc2aeab688ab05
title: Google Gemini GenerateContent
description: 使用原生 Google Gemini GenerateContent 协议调用 SandBase。
aside: false
outline: false
apiReference:
  title: Google Gemini GenerateContent
  operation: Gemini
  method: POST
  path: /v1beta/models/{model}:generateContent
  description: 发送原生 Gemini 请求并接收 Gemini 兼容的响应。流式输出请使用 streamGenerateContent。
  groups:
    - title: 路径参数
      fields:
        - name: model
          type: string
          required: true
          description: 不带前缀的 Google 模型名称，例如 gemini-3.5-flash。SandBase 会将其解析为 google/{model}。
    - title: 请求体
      fields:
        - name: contents
          type: array
          required: false
          description: 由 role 和 parts 组成的 Gemini 对话内容。
        - name: systemInstruction
          type: object
          required: false
          description: Gemini Content 形式的文本系统指令。
        - name: generationConfig
          type: object
          required: false
          description: 采样、输出长度、结构化输出和思考设置。
        - name: tools
          type: array
          required: false
          description: 函数声明或受支持的 Gemini 内置工具配置。
        - name: toolConfig
          type: object
          required: false
          description: Gemini 函数调用策略。
        - name: safetySettings
          type: array
          required: false
          description: Gemini 安全类别和阈值。
        - name: cachedContent
          type: string
          required: false
          description: 在支持时透传的 Gemini 缓存内容资源。
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

## 认证 {#authentication}

Google 兼容请求可以通过 `x-goog-api-key`、`Authorization: Bearer …` 或 `key` 查询参数携带 SandBase API 密钥，优先级依次递减。建议使用请求头：查询字符串中的凭据可能出现在代理日志和浏览器历史记录中。

## 流式输出 {#streaming}

将方法后缀替换为 `:streamGenerateContent`。不带查询参数时，SandBase 以流式 JSON 数组形式返回 Google 兼容的响应对象。添加 `?alt=sse` 可使用 Server-Sent Events：

```bash
curl -N -X POST \
  "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:streamGenerateContent?alt=sse" \
  -H "x-goog-api-key: $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Write a short greeting."}]}]}'
```

## 原生图像生成 {#native-image-generation}

以下图像模型具有专用的原生 GenerateContent 映射：

- [Gemini 3 Pro Image（Nano Banana Pro）](https://www.sandbase.ai/models/google/gemini-3-pro-image/docs)：`gemini-3-pro-image`
- [Gemini 3.1 Flash Image（Nano Banana 2）](https://www.sandbase.ai/models/google/gemini-3.1-flash-image/docs)：`gemini-3.1-flash-image`
- [Gemini Nano Banana 2.1（Nano Banana 2.1）](https://www.sandbase.ai/models/google/gemini-nano-banana-2.1/docs)：`gemini-nano-banana-2.1`

每个模型页面都列出了其 token 价格和单张图像费用。

对于这些映射，SandBase 会直接转发请求和响应负载，不经过 Chat Completions 转换。这样可以保留图像部分、响应模态以及提供商定义的字段。在 URL 中使用不带前缀的模型名称，例如 `google/gemini-3.1-flash-image` 在路径中写作 `gemini-3.1-flash-image`。
### 编辑图像 {#edit-an-image}

将源图像作为 `inlineData` 部分放在文本指令旁边。使用与所发送字节相符的 MIME 类型：

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

### 使用 Google Gen AI SDK {#use-the-google-gen-ai-sdk}

将官方 SDK 指向 SandBase，并使用你的 SandBase API 密钥：

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

如需流式输出，使用相同的请求体调用 `:streamGenerateContent?alt=sse`（SDK 中为 `generate_content_stream`）。

### 响应处理 {#response-handling}
从返回的 candidate parts 中读取生成的媒体。由于这些模型使用原生透传，提供商定义的字段大小写和 MIME 元数据会原样返回。请先解码 base64 负载并检查实际的媒体字节，再决定文件扩展名。

## 路由与转换边界 {#routing-and-translation-boundaries}

SandBase 只会选择支持所请求的原生 Gemini 协议的提供商。如果所选模型没有兼容的原生映射，请求会直接失败，而不会回退到使用其他协议的提供商。

使用转换式 GenerateContent 路径的模型支持文本、函数调用与响应、内联 `image/*` 数据以及公开的 HTTP(S) 图像引用。该转换路径会以 Google 风格的 `400 INVALID_ARGUMENT` 响应拒绝不受支持的内联 MIME 类型、私有 Google Files 或 `gs://` 引用、多个 candidate 以及不受支持的响应模态。上面列出的图像生成映射使用原始透传，不受这些仅适用于转换路径的限制；请根据所选提供商的响应校验返回的媒体字段。
