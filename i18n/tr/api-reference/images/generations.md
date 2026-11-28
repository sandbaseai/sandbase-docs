---
i18nSource: 39ce638efc41350d
title: Görüntü Oluştur
description: Senkron, OpenAI Images uyumlu API ile görüntü oluşturun.
aside: false
outline: false
apiReference:
  title: Görüntü Oluştur
  operation: Images
  method: POST
  path: /v1/images/generations
  description: SandBase'in senkron, OpenAI Images uyumlu uç noktası üzerinden görüntü oluşturun. Bu uç nokta genel /v1/run model API'sinden ayrıdır.
  signature: client.images.generate(params)
  groups:
    - title: İstek gövdesi
      schema: ImageGenerateParams
      fields:
        - name: model
          type: string
          required: true
          description: gpt-image-2, gpt-image-2.5-flare veya gpt-image-2.5-sunburst modellerinden biri.
        - name: prompt
          type: string
          required: true
          description: Oluşturulacak görüntünün metin açıklaması.
        - name: n
          type: integer
          required: false
          description: Destekleniyorsa oluşturulacak görüntü sayısı.
        - name: size
          type: string
          required: false
          description: Modelin desteklediği çıktı boyutları.
        - name: quality
          type: string
          required: false
          description: low, medium, high veya auto gibi çıktı kalitesi.
        - name: background
          type: string
          required: false
          description: transparent, opaque veya auto gibi arka plan ayarı.
        - name: output_format
          type: string
          required: false
          description: png, webp veya jpeg gibi çıktı kodlaması.
        - name: output_compression
          type: integer
          required: false
          description: 0 ile 100 arasında çıktı sıkıştırma düzeyi.
        - name: moderation
          type: string
          required: false
          description: Sağlayıcı uyumlu moderasyon ayarı.
        - name: user
          type: string
          required: false
          description: Sağlayıcı uyumlu son kullanıcı tanımlayıcısı.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/images/generations \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"gpt-image-2","prompt":"A paper-cut city floating above the clouds","size":"1024x1024"}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-...", base_url="https://api.sandbase.ai/v1")
        result = client.images.generate(
            model="gpt-image-2",
            prompt="A paper-cut city floating above the clouds",
            size="1024x1024",
        )
        print(result.data[0].b64_json or result.data[0].url)
  response:
    status: 200 OK
    code: |-
      {
        "created": 1787529600,
        "data": [{"b64_json": "iVBORw0KGgo..."}],
        "usage": {
          "input_tokens": 12,
          "output_tokens": 4096,
          "total_tokens": 4108,
          "input_tokens_details": {"text_tokens": 12, "image_tokens": 0}
        }
      }
  notes:
    - title: Yalnızca senkron
      description: stream=true, mode=stream ve mode=async reddedilir. Dönen data dizisini doğrudan kullanın.
    - title: Uyumlu alanlar
      description: Ek JSON alanları değiştirilmeden iletilir, ancak destek modele ve sağlayıcıya göre değişir.
  errors:
    - status: "400"
      description: Geçersiz JSON, desteklenmeyen model, akış modu veya sağlayıcı isteği.
    - status: "401"
      description: API anahtarı eksik veya geçersiz.
    - status: "402"
      description: Organizasyonun veya API Key'in harcama limitine ulaşıldı.
    - status: "403"
      description: API anahtarının kapsamı bu uç noktaya izin vermiyor.
    - status: "404"
      description: Yönlendirilen görüntü modeli kullanılamıyor.
    - status: "429"
      description: Hız limiti aşıldı.
    - status: "500"
      description: İsteğin kalıcı olarak kaydedilmesi veya yanıtın işlenmesi başarısız oldu.
    - status: "502"
      description: Sağlayıcı geçersiz bir yerel yanıt döndürdü.
    - status: "503"
      description: Hiçbir sağlayıcı rotası başarılı olmadı.
---

<ApiReferencePage />

## Desteklenen modeller {#supported-models}
Bu OpenAI görüntü modelleri, bu uç noktada yerel Images API'sini kullanır. Herkese açık model adını `model` alanında gönderin:

| `model` | En uygun kullanım |
| --- | --- |
| `gpt-image-2.5-flare` | Günlük yaratıcı işler için hızlı, yüksek kaliteli oluşturma ve düzenleme |
| `gpt-image-2.5-sunburst` | Görsel doğruluğun ve hassasiyetin en çok önem taşıdığı işler |
| `gpt-image-2` | Önceki GPT Image nesli |

İstekler senkrondur ve görüntü verisini `data` içinde `b64_json` veya URL olarak döndürür. Bu uç nokta, genel asenkron `/v1/run` model uç noktasından ayrıdır; [model kataloğundaki](https://www.sandbase.ai/models/image-video) her modelin sayfası bu sözleşmeyi ve fiyatlandırmasını belgeler.

Görüntüleri düzenlemek için aynı model adlarıyla [`POST /v1/images/edits`](/api-reference/images/edits) uç noktasına `multipart/form-data` gönderin.
