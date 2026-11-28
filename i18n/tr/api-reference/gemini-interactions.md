---
i18nSource: 8ddefa727d909bc8
title: Google Gemini Interactions
description: Model Interaction'larını yerel Google protokolüyle oluşturun, stream edin ve yoklayın.
aside: false
outline: false
apiReference:
  title: Google Gemini Interactions
  operation: Gemini
  method: POST
  path: /v1beta/interactions
  description: Yerel bir Google Interaction oluşturun. HTTP 200 döndüğünde bile status değerini kontrol edin; in_progress yanıtı yoklanmalıdır.
  groups:
    - title: İstek gövdesi
      fields:
        - name: model
          type: string
          required: true
          description: Mantıksal SandBase model adı.
        - name: input
          type: string | object | array
          required: true
          description: Yerel Google Interaction girdisi.
        - name: stream
          type: boolean
          required: false
          description: Model destekliyorsa Google Interactions SSE olaylarını döndürür.
        - name: background
          type: boolean
          required: false
          description: Kalıcı olarak gönderir ve hemen yoklanabilen bir Interaction döndürür. stream ile birlikte kullanılamaz.
        - name: previous_interaction_id
          type: string
          required: false
          description: Sağlayıcı benzeşimini koruyarak bir upstream Interaction'dan devam eder.
        - name: store
          type: boolean
          required: false
          description: Upstream depolama tercihini değiştirmeden iletir.
        - name: system_instruction
          type: string
          required: false
          description: Yerel sistem talimatı.
        - name: tools
          type: array
          required: false
          description: Yerel Google araç tanımları.
        - name: generation_config
          type: object
          required: false
          description: Yerel üretim yapılandırması.
        - name: response_format
          type: object | array
          required: false
          description: İstenen yanıt biçimi.
        - name: response_modalities
          type: array
          required: false
          description: İstenen çıktı modaliteleri.
  examples:
    - label: Background request
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1beta/interactions \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "google/gemini-omni-flash-preview",
            "input": "A red ball rolls across a table, 3 seconds.",
            "background": true,
            "response_format": {"type": "video"}
          }'
  response:
    status: 200 OK
    code: |-
      {
        "id": "job_75b74acd12534b01baba820b",
        "object": "interaction",
        "model": "google/gemini-omni-flash-preview",
        "status": "in_progress"
      }
---

<ApiReferencePage />

## Kimlik doğrulama {#authentication}

Bu öncelik sırasıyla `x-goog-api-key`, `Authorization: Bearer …` veya `key` sorgu parametresini kullanın. Sorgu dizesindeki kimlik bilgileri loglanabileceği için header kullanmayı tercih edin.

## Desteklenen modeller {#supported-models}

Interactions endpoint'i, katalog adı `google/` ile başlayan her model için genel bir yol değildir. Modelin
Interactions uyumlu bir sağlayıcı eşlemesi olmalıdır. SandBase şu anda şu uyumlu modelleri belgelemektedir:

- Gemini Omni Flash Preview: `google/gemini-omni-flash-preview`
- Gemini Omni 1.1 Flash Preview: `google/gemini-omni-1.1-flash-preview`

Diğer Google modelleri başka endpoint'ler kullanır. Örneğin Nano Banana Pro ve Nano Banana 2, `/v1beta/interactions` değil,
[`/v1beta/models/{model}:generateContent`](/api-reference/gemini-generate-content) kullanır. Desteklenmeyen bir model, farklı bir Google protokolü
üzerinden yönlendirilmek yerine başarısız olur.

## Başarı ve yoklama {#success-and-polling}

Başarılı gönderimler HTTP `200` döndürür; buna arka plan işleri ve sınırlı bekleme süresi dolan senkron istekler de dahildir. Her zaman `status` değerini kontrol edin:

- `completed`, `failed`, `cancelled` ve `incomplete` son durumlardır.
- `in_progress` hâlâ çalışıyor demektir. `GET /v1beta/interactions/{id}` ile yoklayın; yanıt bu yolu `Location` header'ında da içerebilir.
- `requires_action` bir protokol durumudur; ancak SandBase, bu durumu ilerletmek için gereken araç onayı endpoint'ini şu anda sunmaz.

Yoklama kimliği, `POST` tarafından döndürülen upstream Interaction `id` değeridir; bir SandBase tahmin kimliği değildir. Interaction'ı oluşturan SandBase API anahtarıyla alınması gerekir.

```bash
curl https://api.sandbase.ai/v1beta/interactions/job_75b74acd12534b01baba820b \
  -H "x-goog-api-key: $SANDBASE_API_KEY"
```

Son durumda olmayan GET yanıtları kısmi çıktıyı ve kullanımı içermez. Son durum yanıtları satır içi görsel, ses veya video verisi içerebilir ve birkaç megabayt boyutunda olabilir. Gerekli medyayı hemen indirip saklayın: upstream saklama süresi dolduktan sonra SandBase yalnızca yapı ve metadata içeren kayıplı bir son durum yedeği döndürebilir, orijinal medya baytlarını döndüremez.

## Streaming {#streaming}

İstek gövdesinde `stream: true` ayarlayın. Yanıt `text/event-stream` olur; bu protokolde `?alt=sse` kullanılmaz. Olay ve delta türleri açık uçludur ve sabit bir izin listesi olmadan iletilir; bu nedenle istemciler bilinmeyen değerleri tolere etmelidir. Streaming header'ları yazıldıktan sonra hatalar farklı bir HTTP durumu yerine bir `error` olayı olarak gelir.

Streaming desteği modele bağlıdır. Protokol desteklese bile bir upstream sağlayıcı `stream: true` isteğini reddedebilir.

## Mevcut sınırlar {#current-limits}

SandBase şu anda yalnızca create ve get işlemlerini sunar:

- Agent Interactions reddedilir; `model` kullanın.
- `background: true` ve `stream: true` birlikte kullanılamaz.
- Interaction listeleme, silme ve iptal etme sunulmaz.
- URI ile teslim ve GET tabanlı stream yeniden bağlanması sunulmaz.
- `previous_interaction_id`, canlı bir sağlayıcı benzeşimi (affinity) eşlemesi ve upstream desteği gerektirir. Benzeşim kullanılamadığında SandBase sessizce sağlayıcı değiştirmek yerine başarısız olur.

Hatalar Google zarfını kullanır: `{ "error": { "code", "message", "status" } }`. HTTP durumunu kararlı kabul edin; `message` içindeki temizlenmiş upstream metni değişebilir.
