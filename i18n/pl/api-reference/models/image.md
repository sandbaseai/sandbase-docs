---
i18nSource: 88501841ea0abd9d
title: Ujednolicone Image Run API
description: Uruchamiaj generowanie i edycję obrazów przez ujednolicone API modeli SandBase.
aside: false
outline: false
apiReference:
  title: Generowanie obrazów
  operation: Models
  method: POST
  path: /v1/run
  description: Generuj obrazy za pomocą modeli AI, takich jak FLUX, Stable Diffusion, DALL-E i innych.
  groups:
    - title: Treść żądania
      fields:
        - name: model
          type: string
          required: true
          description: Bieżący identyfikator modelu, np. bfl/flux-1/schnell.
        - name: prompt
          type: string
          required: true
          description: Tekstowy opis obrazu
        - name: aspect_ratio
          type: string
          required: false
          description: Proporcje obrazu wyjściowego. Flux 1 Schnell domyślnie używa 16:9.
        - name: guidance_scale
          type: number
          required: false
          description: Siła dopasowania do promptu od 1 do 20.
        - name: output_format
          type: jpeg | png
          required: false
          description: Format obrazu wyjściowego. Flux 1 Schnell domyślnie używa jpeg.
        - name: mode
          type: string
          required: false
          description: Ustaw async tylko wtedy, gdy wybrany model obsługuje wykonanie asynchroniczne
        - name: webhook_url
          type: string
          required: false
          description: Publiczny URL wywołania zwrotnego HTTPS tylko dla tego zadania asynchronicznego
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
