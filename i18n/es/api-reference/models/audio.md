---
i18nSource: 734fcbef88ff9c50
title: API unificada de ejecución de audio
description: Ejecuta capacidades de generación y procesamiento de audio con la API unificada de modelos de SandBase.
aside: false
outline: false
apiReference:
  title: Audio (TTS/STT)
  operation: Models
  method: POST
  path: /v1/run
  description: Ejecuta un modelo de texto a voz o de voz a texto. Los modelos de audio asíncronos pueden incluir webhook_url para recibir un callback de la tarea.
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
