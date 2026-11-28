---
i18nSource: 88501841ea0abd9d
title: API unificada de execução de imagens
description: Execute recursos de geração e edição de imagens pela API unificada de modelos do SandBase.
aside: false
outline: false
apiReference:
  title: Geração de imagens
  operation: Models
  method: POST
  path: /v1/run
  description: Gere imagens usando modelos de IA como FLUX, Stable Diffusion, DALL-E e outros.
  groups:
    - title: Corpo da requisição
      fields:
        - name: model
          type: string
          required: true
          description: Identificador atual do modelo, por exemplo bfl/flux-1/schnell.
        - name: prompt
          type: string
          required: true
          description: Descrição em texto da imagem
        - name: aspect_ratio
          type: string
          required: false
          description: Proporção da saída. O padrão do Flux 1 Schnell é 16:9.
        - name: guidance_scale
          type: number
          required: false
          description: Intensidade de orientação do prompt, de 1 a 20.
        - name: output_format
          type: jpeg | png
          required: false
          description: Formato da imagem de saída. O padrão do Flux 1 Schnell é jpeg.
        - name: mode
          type: string
          required: false
          description: Defina como async apenas quando o modelo selecionado suportar execução assíncrona
        - name: webhook_url
          type: string
          required: false
          description: URL pública HTTPS de callback apenas para esta tarefa assíncrona
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
