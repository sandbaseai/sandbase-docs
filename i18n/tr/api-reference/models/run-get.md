---
i18nSource: 2ffb24dad49b9c79
title: Eşzamansız bir run'ı getirme
description: Bir SandBase eşzamansız model veya API run'ını yoklayın ve güncel ya da nihai sonucunu alın.
aside: false
outline: false
apiReference:
  title: Eşzamansız bir run'ı getirme
  operation: Models
  method: GET
  path: /v1/run/{id}
  description: POST /v1/run ile oluşturulan eşzamansız bir run'ın güncel veya nihai durumunu alın.
  groups:
    - title: Yol parametreleri
      fields:
        - name: id
          type: string
          required: true
          description: POST /v1/run tarafından döndürülen opak run tanımlayıcısı. Döndürüldüğü haliyle kullanın; herhangi bir önek garanti edilmez.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/run/opaque-run-id \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "completed",
        "outputs": [{"url":"https://media.sandbase.ai/files/result.png","content_type":"image/png"}]
      }
---

<ApiReferencePage />

## Yoklama {#polling}

Uzun süren medya veya API görevleri için her 5–10 saniyede bir yoklayın. `status` değeri `completed`, `failed` veya `timeout` olduğunda durun. Son durumda olmayan bir yanıt `outputs` alanını içermeyebilir; run kimliğini opak olarak ele alın ve farklı bir durum URL'si oluşturmayın.
