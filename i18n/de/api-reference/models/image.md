---
i18nSource: 88501841ea0abd9d
title: Einheitliche Image Run API
description: Führe Bildgenerierung und -bearbeitung über die einheitliche Modell-API von SandBase aus.
aside: false
outline: false
apiReference:
  title: Bildgenerierung
  operation: Models
  method: POST
  path: /v1/run
  description: Generiere Bilder mit KI-Modellen wie FLUX, Stable Diffusion, DALL-E und weiteren.
  groups:
    - title: Request-Body
      fields:
        - name: model
          type: string
          required: true
          description: Aktuelle Modell-ID, zum Beispiel bfl/flux-1/schnell.
        - name: prompt
          type: string
          required: true
          description: Textbeschreibung des Bildes
        - name: aspect_ratio
          type: string
          required: false
          description: Seitenverhältnis der Ausgabe. Flux 1 Schnell verwendet standardmäßig 16:9.
        - name: guidance_scale
          type: number
          required: false
          description: Stärke der Prompt-Führung von 1 bis 20.
        - name: output_format
          type: jpeg | png
          required: false
          description: Bildformat der Ausgabe. Flux 1 Schnell verwendet standardmäßig jpeg.
        - name: mode
          type: string
          required: false
          description: Nur auf async setzen, wenn das gewählte Modell asynchrone Ausführung unterstützt
        - name: webhook_url
          type: string
          required: false
          description: Öffentliche HTTPS-Callback-URL, nur für diese asynchrone Aufgabe
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
