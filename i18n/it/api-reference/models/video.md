---
i18nSource: 9fd64c100b1d8b20
title: API Run unificata per i video
description: Esegui funzionalità di generazione e modifica video tramite l'API unificata dei modelli di SandBase.
aside: false
outline: false
apiReference:
  title: Generazione video
  operation: Models
  method: POST
  path: /v1/run
  description: "Genera video con modelli AI. La generazione video è asincrona: invii una richiesta ed esegui il polling dei risultati."
  groups:
    - title: Body della richiesta
      fields:
        - name: model
          type: string
          required: true
          description: Identificatore attuale del modello, ad esempio kwaivgi/kling-video/v3/standard/text-to-video.
        - name: prompt
          type: string
          required: true
          description: Descrizione testuale del video
        - name: duration
          type: number
          required: false
          description: Durata del video in secondi
        - name: image_url
          type: string
          required: false
          description: Immagine di riferimento per image-to-video
        - name: webhook_url
          type: string
          required: false
          description: URL di callback HTTPS pubblico valido solo per questo task asincrono
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
