---
i18nSource: a4db28360a2974cd
title: Görüntü düzenleme
description: Yüklenen görüntüleri eşzamanlı, OpenAI Images uyumlu API ile düzenleyin.
aside: false
outline: false
apiReference:
  title: Görüntü düzenleme
  operation: Images
  method: POST
  path: /v1/images/edits
  description: Bir veya daha fazla yüklenmiş görüntüyü SandBase'in eşzamanlı, OpenAI Images uyumlu multipart uç noktası üzerinden düzenleyin.
  signature: client.images.edit(params)
  groups:
    - title: İstek gövdesi
      schema: ImageEditParams
      fields:
        - name: model
          type: string
          required: true
          description: gpt-image-2, gpt-image-2.5-flare veya gpt-image-2.5-sunburst modellerinden biri.
        - name: prompt
          type: string
          required: true
          description: İstenen düzenlemenin metin açıklaması.
        - name: image
          type: file | file[]
          required: true
          description: Bir veya daha fazla kaynak görüntü dosyası. Birden çok görüntü için multipart alanını tekrarlayın.
        - name: mask
          type: file
          required: false
          description: Inpainting için isteğe bağlı maske görüntüsü.
        - name: n
          type: integer
          required: false
          description: Destekleniyorsa döndürülecek düzenlenmiş görüntü sayısı.
        - name: size
          type: string
          required: false
          description: Modelin desteklediği çıktı boyutları.
        - name: quality
          type: string
          required: false
          description: Modelin desteklediği çıktı kalitesi.
        - name: background
          type: string
          required: false
          description: Çıktı arka plan ayarı.
        - name: input_fidelity
          type: string
          required: false
          description: Destekleyen modellerin kaynak görüntü ayrıntılarını ne kadar yakından koruyacağı.
        - name: output_format
          type: string
          required: false
          description: png, webp veya jpeg gibi çıktı kodlaması.
        - name: output_compression
          type: integer
          required: false
          description: 0 ile 100 arasında çıktı sıkıştırma düzeyi.
        - name: user
          type: string
          required: false
          description: Sağlayıcı uyumlu son kullanıcı tanımlayıcısı.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/images/edits \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -F model=gpt-image-2 \
          -F 'prompt=Turn the daytime sky into a starry night' \
          -F image=@landscape.png
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-...", base_url="https://api.sandbase.ai/v1")
        with open("landscape.png", "rb") as image:
            result = client.images.edit(
                model="gpt-image-2",
                image=image,
                prompt="Turn the daytime sky into a starry night",
            )
        print(result.data[0].b64_json or result.data[0].url)
  response:
    status: 200 OK
    code: |-
      {
        "created": 1787529600,
        "data": [{"b64_json": "iVBORw0KGgo..."}],
        "usage": {
          "input_tokens": 1024,
          "output_tokens": 4096,
          "total_tokens": 5120,
          "input_tokens_details": {"text_tokens": 12, "image_tokens": 1012}
        }
      }
  notes:
    - title: Multipart yüklemeler
      description: model, prompt ve image alanlarını multipart/form-data olarak gönderin. image alanını tekrarlamak birden çok kaynak dosyayı korur.
    - title: Yalnızca eşzamanlı
      description: stream=true, mode=stream ve mode=async reddedilir.
  errors:
    - status: "400"
      description: Geçersiz multipart gövdesi, desteklenmeyen model, akış modu veya sağlayıcı isteği.
    - status: "401"
      description: Eksik veya geçersiz API anahtarı.
    - status: "402"
      description: Kuruluş veya API Key harcama sınırına ulaşıldı.
    - status: "403"
      description: API anahtarı kapsamı bu uç noktaya yetki vermiyor.
    - status: "404"
      description: Yönlendirilen görüntü düzenleme modeli kullanılamıyor.
    - status: "429"
      description: Hız sınırı aşıldı.
    - status: "500"
      description: İsteğin kalıcı olarak kaydedilmesi veya yanıtın işlenmesi başarısız oldu.
    - status: "502"
      description: Sağlayıcı geçersiz bir yerel yanıt döndürdü.
    - status: "503"
      description: Hiçbir sağlayıcı rotası başarılı olmadı.
---

<ApiReferencePage />

## Desteklenen modeller {#supported-models}
Bu OpenAI görüntü modelleri, bu uç noktada ve [`/v1/images/generations`](/api-reference/images/generations) üzerinde yerel Images API'yi kullanır. Herkese açık model adını `model` alanında gönderin:

| `model` | En uygun kullanım |
| --- | --- |
| `gpt-image-2.5-flare` | Günlük yaratıcı işler için hızlı, yüksek kaliteli üretim ve düzenleme |
| `gpt-image-2.5-sunburst` | Görsel doğruluğun ve hassasiyetin en önemli olduğu işler |
| `gpt-image-2` | Önceki GPT Image nesli |

İstekler eşzamanlıdır ve görüntü verisini `data` içinde `b64_json` veya URL olarak döndürür. Bu uç nokta, genel eşzamansız `/v1/run` model uç noktasından ayrıdır; [model kataloğundaki](https://www.sandbase.ai/models/image-video) her model sayfası o sözleşmeyi ve fiyatlandırmasını belgeler.

`model`, `prompt` ve en az bir `image` dosyası sağlayın. Birden çok kaynak görüntüyü birleştirmek veya düzenlemek için `image` alanını tekrarlayın:

```bash
curl https://api.sandbase.ai/v1/images/edits \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -F "model=gpt-image-2.5-flare" \
  -F "prompt=Turn this product photo into a warm editorial scene" \
  -F "image=@product.png" \
  -F "quality=high"
```
