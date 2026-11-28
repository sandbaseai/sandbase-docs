---
i18nSource: efa205ed7505643c
title: Bir model veya API yeteneğini çalıştırma
description: Bir SandBase modelini veya API yeteneğini birleşik run uç noktası üzerinden gönderin.
aside: false
outline: false
apiReference:
  title: Bir model veya API yeteneğini çalıştırma
  operation: Models
  method: POST
  path: /v1/run
  description: Etkin bir SandBase modelini veya API yeteneğini yürütür. İstek alanları yeteneğe özgüdür; seçilen yeteneğin şeması için SandBase web sitesindeki model veya API referans sayfasını kullanın.
  groups:
    - title: İstek gövdesi
      fields:
        - name: model
          type: string
          required: true
          description: Etkin mantıksal model veya API yeteneği tanımlayıcısı.
        - name: mode
          type: auto | sync | async | stream
          required: false
          description: Yürütme modu ipucu. `auto`, seçilen yeteneğin yapılandırılmış varsayılanını kullanır; diğer değerler yetenek desteği gerektirir.
        - name: stream
          type: boolean
          required: false
          description: "Seçilen yetenek destekliyorsa akışlı çıktı ister. `mode: stream` ile eşdeğerdir."
        - name: webhook_url
          type: string
          required: false
          description: Desteklenen asenkron görüntü için isteğe bağlı HTTPS geri çağrısı
          video: null
          or audio tasks. See the Webhooks reference for validation and delivery behavior.: null
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/run \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-image-2","prompt":"A studio product photo on a clean white background"}'
  response:
    status: 200 OK or 202 Accepted
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "pending"
      }
---

<ApiReferencePage />

## Yürütme ve sonuçlar {#execution-and-results}

Senkron yetenekler, tamamlanmış yanıtı orijinal istekte döndürür. Asenkron yetenekler opak bir `id` ile `202 Accepted` döndürür; durum son duruma ulaşana kadar [asenkron bir run'ı alma](./run-get) uç noktasını yoklayın.

Yeteneğe özgü istek alanları ve çıktı biçimleri, seçilen modelin veya API işleminin sayfasında tanımlanır. Bu alanları JSON gövdesinin en üst düzeyinde gönderin; bir `input` nesnesine sarmalamayın. Her yeteneğin aynı parametreleri kabul ettiğini varsaymayın.

## Webhook geri çağrıları {#webhook-callbacks}

`webhook_url` değerini yalnızca desteklenen asenkron görüntü, video veya ses görevleri için ayarlayın. SandBase, tamamlanma veya başarısızlık sonrasında son run olayını HTTPS uç noktasına gönderir; geri çağrı bir teslim ipucudur ve `GET /v1/run/{id}` uç noktasının yerini tutmaz. Kesin durum için run uç noktasını yoklamaya her zaman devam edin ve bir geri çağrı geciktiğinde veya yinelendiğinde güvenli şekilde yeniden deneyin. Senkron model yanıtları ve sağlayıcıya özgü uç noktalar bu geri çağrı alanını kullanmaz.
