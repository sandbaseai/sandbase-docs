---
i18nSource: 9fd64c100b1d8b20
title: 통합 동영상 Run API
description: SandBase의 통합 모델 API로 동영상 생성 및 편집 기능을 실행합니다.
aside: false
outline: false
apiReference:
  title: 동영상 생성
  operation: Models
  method: POST
  path: /v1/run
  description: AI 모델로 동영상을 생성합니다. 동영상 생성은 비동기식이므로 요청을 제출한 뒤 결과를 폴링합니다.
  groups:
    - title: 요청 본문
      fields:
        - name: model
          type: string
          required: true
          description: "현재 모델 식별자. 예: kwaivgi/kling-video/v3/standard/text-to-video."
        - name: prompt
          type: string
          required: true
          description: 동영상에 대한 텍스트 설명
        - name: duration
          type: number
          required: false
          description: 동영상 길이(초)
        - name: image_url
          type: string
          required: false
          description: 이미지-동영상 변환용 참조 이미지
        - name: webhook_url
          type: string
          required: false
          description: 이 비동기 작업에만 사용할 공개 HTTPS 콜백 URL
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
