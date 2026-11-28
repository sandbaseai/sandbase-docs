---
i18nSource: 9fd64c100b1d8b20
title: Birleşik Video Run API
description: Video üretim ve düzenleme yeteneklerini SandBase'in birleşik model API'si üzerinden çalıştırın.
aside: false
outline: false
apiReference:
  title: Video üretimi
  operation: Models
  method: POST
  path: /v1/run
  description: "Yapay zekâ modelleriyle video üretin. Video üretimi eşzamansızdır: bir istek gönderir ve sonuçlar için yoklama yaparsınız."
  groups:
    - title: İstek gövdesi
      fields:
        - name: model
          type: string
          required: true
          description: Geçerli model tanımlayıcısı, örneğin kwaivgi/kling-video/v3/standard/text-to-video.
        - name: prompt
          type: string
          required: true
          description: Videonun metin açıklaması
        - name: duration
          type: number
          required: false
          description: Saniye cinsinden video süresi
        - name: image_url
          type: string
          required: false
          description: Görüntüden videoya üretim için referans görüntü
        - name: webhook_url
          type: string
          required: false
          description: Yalnızca bu eşzamansız görev için herkese açık HTTPS geri çağırma URL'si
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
