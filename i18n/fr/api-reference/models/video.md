---
i18nSource: 9fd64c100b1d8b20
title: API Run unifiée pour la vidéo
description: Exécutez les capacités de génération et d'édition vidéo via l'API de modèles unifiée de SandBase.
aside: false
outline: false
apiReference:
  title: Génération vidéo
  operation: Models
  method: POST
  path: /v1/run
  description: "Générez des vidéos avec des modèles d'IA. La génération vidéo est asynchrone : vous soumettez une requête, puis vous interrogez régulièrement l'API pour obtenir les résultats."
  groups:
    - title: Corps de la requête
      fields:
        - name: model
          type: string
          required: true
          description: Identifiant du modèle actuel, par exemple kwaivgi/kling-video/v3/standard/text-to-video.
        - name: prompt
          type: string
          required: true
          description: Description textuelle de la vidéo
        - name: duration
          type: number
          required: false
          description: Durée de la vidéo en secondes
        - name: image_url
          type: string
          required: false
          description: Image de référence pour l'image-to-video
        - name: webhook_url
          type: string
          required: false
          description: URL de callback HTTPS publique, pour cette tâche asynchrone uniquement
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
