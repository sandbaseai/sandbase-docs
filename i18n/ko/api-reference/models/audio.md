---
i18nSource: 734fcbef88ff9c50
title: 통합 오디오 실행 API
description: SandBase 통합 모델 API로 오디오 생성 및 처리 기능을 실행합니다.
aside: false
outline: false
apiReference:
  title: 오디오(TTS/STT)
  operation: Models
  method: POST
  path: /v1/run
  description: 텍스트 음성 변환 또는 음성 텍스트 변환 모델을 실행합니다. 비동기 오디오 모델은 작업 콜백용 webhook_url을 포함할 수 있습니다.
  groups: []
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/run \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"bytedance/seed-speech/tts/2.0","text":"Hello, welcome to SandBase!"}'
    - label: Python
      language: python
      code: |-
        response = client.post("/v1/run", json={
            "model": "bytedance/seed-speech/tts/2.0",
            "text": "Hello, welcome to SandBase!"
        })
        print(response.json()["outputs"][0]["url"])
  response:
    status: 200 OK
    code: |-
      {
        "id": "run_01...",
        "status": "completed",
        "outputs": [{ "url": "https://media.sandbase.ai/audio/output.mp3" }]
      }
---

<ApiReferencePage />
