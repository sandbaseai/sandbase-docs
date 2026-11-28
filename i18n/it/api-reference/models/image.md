---
i18nSource: 88501841ea0abd9d
title: API unificata di esecuzione per immagini
description: Esegui funzionalità di generazione e modifica di immagini tramite l'API unificata dei modelli di SandBase.
aside: false
outline: false
apiReference:
  title: Generazione di immagini
  operation: Models
  method: POST
  path: /v1/run
  description: Genera immagini con modelli AI come FLUX, Stable Diffusion, DALL-E e altri.
  groups:
    - title: Corpo della richiesta
      fields:
        - name: model
          type: string
          required: true
          description: Identificatore attuale del modello, ad esempio bfl/flux-1/schnell.
        - name: prompt
          type: string
          required: true
          description: Descrizione testuale dell'immagine
        - name: aspect_ratio
          type: string
          required: false
          description: Proporzioni dell'output. Per Flux 1 Schnell il valore predefinito è 16:9.
        - name: guidance_scale
          type: number
          required: false
          description: Intensità della guida del prompt da 1 a 20.
        - name: output_format
          type: jpeg | png
          required: false
          description: Formato dell'immagine di output. Per Flux 1 Schnell il valore predefinito è jpeg.
        - name: mode
          type: string
          required: false
          description: Imposta async solo se il modello selezionato supporta l'esecuzione asincrona
        - name: webhook_url
          type: string
          required: false
          description: URL di callback HTTPS pubblico, solo per questo task asincrono
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
