---
i18nSource: 88501841ea0abd9d
title: API unificada de ejecución de imágenes
description: Ejecuta capacidades de generación y edición de imágenes a través de la API unificada de modelos de SandBase.
aside: false
outline: false
apiReference:
  title: Generación de imágenes
  operation: Models
  method: POST
  path: /v1/run
  description: Genera imágenes con modelos de IA como FLUX, Stable Diffusion, DALL-E y otros.
  groups:
    - title: Cuerpo de la solicitud
      fields:
        - name: model
          type: string
          required: true
          description: Identificador actual del modelo, por ejemplo bfl/flux-1/schnell.
        - name: prompt
          type: string
          required: true
          description: Descripción en texto de la imagen
        - name: aspect_ratio
          type: string
          required: false
          description: Relación de aspecto de la salida. Flux 1 Schnell usa 16:9 por defecto.
        - name: guidance_scale
          type: number
          required: false
          description: Intensidad de la guía del prompt, de 1 a 20.
        - name: output_format
          type: jpeg | png
          required: false
          description: Formato de la imagen de salida. Flux 1 Schnell usa jpeg por defecto.
        - name: mode
          type: string
          required: false
          description: Establécelo en async solo cuando el modelo seleccionado admita ejecución asíncrona
        - name: webhook_url
          type: string
          required: false
          description: URL de callback HTTPS pública solo para esta tarea asíncrona
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
