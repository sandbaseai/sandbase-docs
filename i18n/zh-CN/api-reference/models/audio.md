---
i18nSource: 734fcbef88ff9c50
title: 统一音频运行 API
description: 通过 SandBase 统一模型 API 运行音频生成和处理能力。
aside: false
outline: false
apiReference:
  title: 音频（TTS/STT）
  operation: Models
  method: POST
  path: /v1/run
  description: 运行文本转语音或语音转文本模型。异步音频模型可以附带 webhook_url 用于任务回调。
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
