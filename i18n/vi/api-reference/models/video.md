---
i18nSource: 9fd64c100b1d8b20
title: Unified Video Run API
description: Chạy các khả năng tạo và chỉnh sửa video qua API model hợp nhất của SandBase.
aside: false
outline: false
apiReference:
  title: Tạo video
  operation: Models
  method: POST
  path: /v1/run
  description: Tạo video bằng các model AI. Việc tạo video là bất đồng bộ — bạn gửi yêu cầu rồi poll để lấy kết quả.
  groups:
    - title: Body của request
      fields:
        - name: model
          type: string
          required: true
          description: Định danh model hiện tại, ví dụ kwaivgi/kling-video/v3/standard/text-to-video.
        - name: prompt
          type: string
          required: true
          description: Mô tả bằng văn bản cho video
        - name: duration
          type: number
          required: false
          description: Thời lượng video tính bằng giây
        - name: image_url
          type: string
          required: false
          description: Ảnh tham chiếu cho image-to-video
        - name: webhook_url
          type: string
          required: false
          description: URL callback HTTPS công khai chỉ dành cho tác vụ bất đồng bộ này
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
