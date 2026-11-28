---
i18nSource: 9fd64c100b1d8b20
title: Einheitliche Video-Run-API
description: Videogenerierung und -bearbeitung über die einheitliche Modell-API von SandBase ausführen.
aside: false
outline: false
apiReference:
  title: Videogenerierung
  operation: Models
  method: POST
  path: /v1/run
  description: "Erzeuge Videos mit KI-Modellen. Die Videogenerierung läuft asynchron: Du sendest eine Anfrage und fragst die Ergebnisse per Polling ab."
  groups:
    - title: Request-Body
      fields:
        - name: model
          type: string
          required: true
          description: Aktuelle Modell-ID, zum Beispiel kwaivgi/kling-video/v3/standard/text-to-video.
        - name: prompt
          type: string
          required: true
          description: Textbeschreibung des Videos
        - name: duration
          type: number
          required: false
          description: Videodauer in Sekunden
        - name: image_url
          type: string
          required: false
          description: Referenzbild für Image-to-Video
        - name: webhook_url
          type: string
          required: false
          description: Öffentliche HTTPS-Callback-URL nur für diese asynchrone Aufgabe
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
