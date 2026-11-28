---
i18nSource: 88501841ea0abd9d
title: Birleşik Görüntü Run API
description: Görüntü oluşturma ve düzenleme yeteneklerini SandBase'in birleşik model API'si üzerinden çalıştırın.
aside: false
outline: false
apiReference:
  title: Görüntü Oluşturma
  operation: Models
  method: POST
  path: /v1/run
  description: FLUX, Stable Diffusion, DALL-E ve diğer yapay zekâ modelleriyle görüntü oluşturun.
  groups:
    - title: İstek gövdesi
      fields:
        - name: model
          type: string
          required: true
          description: Geçerli model tanımlayıcısı, örneğin bfl/flux-1/schnell.
        - name: prompt
          type: string
          required: true
          description: Görüntünün metin açıklaması
        - name: aspect_ratio
          type: string
          required: false
          description: Çıktı en-boy oranı. Flux 1 Schnell için varsayılan 16:9'dur.
        - name: guidance_scale
          type: number
          required: false
          description: 1 ile 20 arasında prompt yönlendirme gücü.
        - name: output_format
          type: jpeg | png
          required: false
          description: Çıktı görüntü biçimi. Flux 1 Schnell için varsayılan jpeg'dir.
        - name: mode
          type: string
          required: false
          description: Yalnızca seçilen model asenkron yürütmeyi destekliyorsa async olarak ayarlayın
        - name: webhook_url
          type: string
          required: false
          description: Yalnızca bu asenkron görev için herkese açık HTTPS geri çağırma URL'si
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
