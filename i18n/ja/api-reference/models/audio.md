---
i18nSource: 734fcbef88ff9c50
title: 統合 Audio Run API
description: SandBase の統合モデル API で、音声の生成と処理の機能を実行します。
aside: false
outline: false
apiReference:
  title: 音声（TTS/STT）
  operation: Models
  method: POST
  path: /v1/run
  description: テキスト読み上げまたは音声認識のモデルを実行します。非同期の音声モデルでは、タスクのコールバック用に webhook_url を指定できます。
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
