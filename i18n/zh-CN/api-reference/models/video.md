---
i18nSource: 9fd64c100b1d8b20
title: 统一视频运行 API
description: 通过 SandBase 统一模型 API 运行视频生成和编辑能力。
aside: false
outline: false
apiReference:
  title: 视频生成
  operation: Models
  method: POST
  path: /v1/run
  description: 使用 AI 模型生成视频。视频生成是异步的：提交请求后轮询获取结果。
  groups:
    - title: 请求体
      fields:
        - name: model
          type: string
          required: true
          description: 当前模型标识符，例如 kwaivgi/kling-video/v3/standard/text-to-video。
        - name: prompt
          type: string
          required: true
          description: 视频的文字描述
        - name: duration
          type: number
          required: false
          description: 视频时长（秒）
        - name: image_url
          type: string
          required: false
          description: 图生视频的参考图像
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
          -d '{"model":"kwaivgi/kling-video/v3/standard/text-to-video","prompt":"A cat playing piano","duration":5}'
    - label: Python
      language: python
      code: |-
        # 1. Submit generation request
        response = client.post("/v1/run", json={
            "model": "kwaivgi/kling-video/v3/standard/text-to-video",
            "prompt": "A cat playing piano",
            "duration": 5,
            "webhook_url": "https://hooks.example.com/sandbase/task?token=opaque-token"
        })
        generation_id = response.json()["id"]

        # 2. SandBase posts the terminal event to webhook_url.
        # You may still poll the existing result endpoint as a fallback.
        import time
        while True:
            result = client.get(f"/v1/run/{generation_id}").json()
            if result["status"] in ("completed", "failed", "timeout"):
                print(result)
                break
            time.sleep(5)
  response:
    status: 202 Accepted
    code: |-
      {
        "id": "run_01...",
        "status": "pending",
        "model": "kwaivgi/kling-video/v3/standard/text-to-video"
      }
---

<ApiReferencePage />
