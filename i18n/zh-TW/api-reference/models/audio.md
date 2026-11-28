---
i18nSource: 734fcbef88ff9c50
title: 統一音訊執行 API
description: 透過 SandBase 統一模型 API 執行音訊生成與處理功能。
aside: false
outline: false
apiReference:
  title: 音訊（TTS/STT）
  operation: Models
  method: POST
  path: /v1/run
  description: 執行文字轉語音或語音轉文字模型。非同步音訊模型可加入 webhook_url 以接收任務回呼。
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
