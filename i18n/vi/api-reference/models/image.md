---
i18nSource: 88501841ea0abd9d
title: Unified Image Run API
description: Chạy các tính năng tạo và chỉnh sửa ảnh qua API model hợp nhất của SandBase.
aside: false
outline: false
apiReference:
  title: Tạo ảnh
  operation: Models
  method: POST
  path: /v1/run
  description: Tạo ảnh bằng các model AI như FLUX, Stable Diffusion, DALL-E và nhiều model khác.
  groups:
    - title: Body request
      fields:
        - name: model
          type: string
          required: true
          description: Định danh model hiện tại, ví dụ bfl/flux-1/schnell.
        - name: prompt
          type: string
          required: true
          description: Mô tả bằng văn bản cho ảnh
        - name: aspect_ratio
          type: string
          required: false
          description: Tỷ lệ khung hình đầu ra. Flux 1 Schnell mặc định là 16:9.
        - name: guidance_scale
          type: number
          required: false
          description: Mức độ bám sát prompt từ 1 đến 20.
        - name: output_format
          type: jpeg | png
          required: false
          description: Định dạng ảnh đầu ra. Flux 1 Schnell mặc định là jpeg.
        - name: mode
          type: string
          required: false
          description: Chỉ đặt thành async khi model đã chọn hỗ trợ thực thi bất đồng bộ
        - name: webhook_url
          type: string
          required: false
          description: URL callback HTTPS công khai chỉ dành cho tác vụ async này
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
