---
i18nSource: 9fd64c100b1d8b20
title: एकीकृत वीडियो Run API
description: SandBase के unified model API से video generation और editing capabilities चलाएँ।
aside: false
outline: false
apiReference:
  title: Video Generation
  operation: Models
  method: POST
  path: /v1/run
  description: AI models से videos बनाएँ। Video generation asynchronous है — आप request submit करते हैं और results के लिए poll करते हैं।
  groups:
    - title: Request body
      fields:
        - name: model
          type: string
          required: true
          description: वर्तमान model identifier, उदाहरण के लिए kwaivgi/kling-video/v3/standard/text-to-video।
        - name: prompt
          type: string
          required: true
          description: Video का text विवरण
        - name: duration
          type: number
          required: false
          description: Video की अवधि seconds में
        - name: image_url
          type: string
          required: false
          description: image-to-video के लिए reference image
        - name: webhook_url
          type: string
          required: false
          description: केवल इस async task के लिए public HTTPS callback URL
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
