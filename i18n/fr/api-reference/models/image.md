---
i18nSource: 88501841ea0abd9d
title: API unifiée d'exécution d'images
description: Exécutez des fonctions de génération et d'édition d'images via l'API unifiée des modèles de SandBase.
aside: false
outline: false
apiReference:
  title: Génération d'images
  operation: Models
  method: POST
  path: /v1/run
  description: Générez des images avec des modèles d'IA comme FLUX, Stable Diffusion, DALL-E, et d'autres.
  groups:
    - title: Corps de la requête
      fields:
        - name: model
          type: string
          required: true
          description: Identifiant actuel du modèle, par exemple bfl/flux-1/schnell.
        - name: prompt
          type: string
          required: true
          description: Description textuelle de l'image
        - name: aspect_ratio
          type: string
          required: false
          description: Format d'image de sortie (rapport largeur/hauteur). Flux 1 Schnell utilise 16:9 par défaut.
        - name: guidance_scale
          type: number
          required: false
          description: Intensité du guidage par le prompt, de 1 à 20.
        - name: output_format
          type: jpeg | png
          required: false
          description: Format de fichier de l'image de sortie. Flux 1 Schnell utilise jpeg par défaut.
        - name: mode
          type: string
          required: false
          description: Définissez async uniquement si le modèle sélectionné prend en charge l'exécution asynchrone
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
