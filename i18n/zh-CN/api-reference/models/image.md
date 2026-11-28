---
i18nSource: 88501841ea0abd9d
title: 统一图像运行 API
description: 通过 SandBase 统一模型 API 运行图像生成与编辑能力。
aside: false
outline: false
apiReference:
  title: 图像生成
  operation: Models
  method: POST
  path: /v1/run
  description: 使用 FLUX、Stable Diffusion、DALL-E 等 AI 模型生成图像。
  groups:
    - title: 请求体
      fields:
        - name: model
          type: string
          required: true
          description: 当前模型标识符，例如 bfl/flux-1/schnell。
        - name: prompt
          type: string
          required: true
          description: 图像的文字描述
        - name: aspect_ratio
          type: string
          required: false
          description: 输出宽高比。Flux 1 Schnell 默认为 16:9。
        - name: guidance_scale
          type: number
          required: false
          description: 提示词引导强度，取值 1 到 20。
        - name: output_format
          type: jpeg | png
          required: false
          description: 输出图像格式。Flux 1 Schnell 默认为 jpeg。
        - name: mode
          type: string
          required: false
          description: 仅当所选模型支持异步执行时才设为 async
        - name: webhook_url
          type: string
          required: false
          description: 仅用于此异步任务的公开 HTTPS 回调 URL
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/run \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"bfl/flux-1/schnell","prompt":"A futuristic city at sunset","aspect_ratio":"1:1"}'
    - label: Python
      language: python
      code: |-
        response = client.post("/v1/run", json={
            "model": "bfl/flux-1/schnell",
            "prompt": "A futuristic city at sunset, cyberpunk style",
            "aspect_ratio": "1:1"
        })
        print(response.json()["outputs"][0]["url"])
  response:
    status: 200 OK
    code: |-
      {
        "id": "run_01...",
        "status": "completed",
        "outputs": [{ "url": "https://media.sandbase.ai/images/output.png" }]
      }
---

<ApiReferencePage />
