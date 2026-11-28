---
i18nSource: 734fcbef88ff9c50
title: Unified Audio Run API
description: เรียกใช้ความสามารถด้านการสร้างและประมวลผลเสียงผ่าน API โมเดลแบบรวมศูนย์ของ SandBase
aside: false
outline: false
apiReference:
  title: เสียง (TTS/STT)
  operation: Models
  method: POST
  path: /v1/run
  description: เรียกใช้โมเดลแปลงข้อความเป็นเสียงหรือแปลงเสียงเป็นข้อความ โมเดลเสียงแบบอะซิงโครนัสอาจระบุ webhook_url สำหรับ callback ของงานได้
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
