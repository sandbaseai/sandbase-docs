---
i18nSource: 9fd64c100b1d8b20
title: 統一影片 Run API
description: 透過 SandBase 統一的模型 API 執行影片生成與編輯能力。
aside: false
outline: false
apiReference:
  title: 影片生成
  operation: Models
  method: POST
  path: /v1/run
  description: 使用 AI 模型生成影片。影片生成為非同步作業 — 您提交請求後再輪詢取得結果。
  groups:
    - title: 請求主體
      fields:
        - name: model
          type: string
          required: true
          description: 目前的模型識別碼，例如 kwaivgi/kling-video/v3/standard/text-to-video。
        - name: prompt
          type: string
          required: true
          description: 影片的文字描述
        - name: duration
          type: number
          required: false
          description: 影片長度（秒）
        - name: image_url
          type: string
          required: false
          description: 圖生影片所用的參考圖片
        - name: webhook_url
          type: string
          required: false
          description: 僅適用於此非同步任務的公開 HTTPS 回呼 URL
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
