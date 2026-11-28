---
i18nSource: 88501841ea0abd9d
title: 統一圖片執行 API
description: 透過 SandBase 的統一模型 API 執行圖片生成與編輯功能。
aside: false
outline: false
apiReference:
  title: 圖片生成
  operation: Models
  method: POST
  path: /v1/run
  description: 使用 FLUX、Stable Diffusion、DALL-E 等 AI 模型生成圖片。
  groups:
    - title: 請求本文
      fields:
        - name: model
          type: string
          required: true
          description: 目前的模型識別碼，例如 bfl/flux-1/schnell。
        - name: prompt
          type: string
          required: true
          description: 圖片的文字描述
        - name: aspect_ratio
          type: string
          required: false
          description: 輸出長寬比。Flux 1 Schnell 預設為 16:9。
        - name: guidance_scale
          type: number
          required: false
          description: 提示詞引導強度，範圍 1 到 20。
        - name: output_format
          type: jpeg | png
          required: false
          description: 輸出圖片格式。Flux 1 Schnell 預設為 jpeg。
        - name: mode
          type: string
          required: false
          description: 僅在所選模型支援非同步執行時設為 async
        - name: webhook_url
          type: string
          required: false
          description: 僅用於此非同步任務的公開 HTTPS 回呼 URL
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
