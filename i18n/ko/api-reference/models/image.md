---
i18nSource: 88501841ea0abd9d
title: 통합 이미지 실행 API
description: SandBase 통합 모델 API로 이미지 생성 및 편집 기능을 실행합니다.
aside: false
outline: false
apiReference:
  title: 이미지 생성
  operation: Models
  method: POST
  path: /v1/run
  description: FLUX, Stable Diffusion, DALL-E 등의 AI 모델로 이미지를 생성합니다.
  groups:
    - title: 요청 본문
      fields:
        - name: model
          type: string
          required: true
          description: "현재 모델 식별자입니다(예: bfl/flux-1/schnell)."
        - name: prompt
          type: string
          required: true
          description: 이미지에 대한 텍스트 설명
        - name: aspect_ratio
          type: string
          required: false
          description: 출력 종횡비입니다. Flux 1 Schnell의 기본값은 16:9입니다.
        - name: guidance_scale
          type: number
          required: false
          description: 프롬프트 가이던스 강도(1~20)입니다.
        - name: output_format
          type: jpeg | png
          required: false
          description: 출력 이미지 형식입니다. Flux 1 Schnell의 기본값은 jpeg입니다.
        - name: mode
          type: string
          required: false
          description: 선택한 모델이 비동기 실행을 지원하는 경우에만 async로 설정
        - name: webhook_url
          type: string
          required: false
          description: 이 비동기 작업에만 사용되는 공개 HTTPS 콜백 URL
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
