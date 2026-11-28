---
i18nSource: b5cf676d897d17a3
title: Response Oluşturma
description: Akışlı ve araç etkin istekler dahil OpenAI uyumlu bir model yanıtı oluşturun.
aside: false
outline: false
apiReference:
  title: Response Oluşturma
  operation: Inference
  method: POST
  path: /v1/responses
  description: OpenAI uyumlu bir model yanıtı oluşturur. SandBase, model eşlemesinden sonra istek alanlarını korur ve ardından yanıtları herkese açık OpenAI alanlarına göre arındırır.
  signature: client.responses.create(params)
  groups:
    - title: İstek gövdesi
      schema: ResponseCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Models API'den alınan model tanımlayıcısı.
        - name: input
          type: string | object[]
          required: false
          description: Metin, mesaj öğeleri veya seçilen model ve sağlayıcının desteklediği diğer girdiler.
        - name: instructions
          type: string
          required: false
          description: Yanıt için sistem veya geliştirici talimatı.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: OpenAI uyumlu Server-Sent Events döndürür.
        - name: background
          type: boolean
          required: false
          description: Seçilen sağlayıcı destekliyorsa arka planda yürütme ister.
        - name: include
          type: string[]
          required: false
          description: Destekleniyorsa eklenecek ek herkese açık yanıt verileri.
        - name: max_output_tokens
          type: integer
          required: false
          description: Üretilecek en fazla token sayısı.
        - name: max_tool_calls
          type: integer
          required: false
          description: Destekleniyorsa en fazla yerleşik araç çağrısı sayısı.
        - name: metadata
          type: object
          required: false
          description: Sağlayıcıya iletilen istek meta verileri.
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: Desteklenen modellerin araçları paralel çağırmasına izin verir.
        - name: previous_response_id
          type: string
          required: false
          description: Seçilen rota destekliyorsa devam edilecek önceki yanıt.
        - name: reasoning
          type: object
          required: false
          description: Desteklenen modeller için akıl yürütme yapılandırması.
        - name: store
          type: boolean
          required: false
          description: Destekleniyorsa sağlayıcı tarafında yanıt saklama ister.
        - name: text
          type: object
          required: false
          description: Metin çıktısı ve yapılandırılmış biçim yapılandırması.
        - name: tool_choice
          type: string | object
          required: false
          description: Araç seçimini denetler.
        - name: tools
          type: object[]
          required: false
          description: Modelin kullanabileceği araçlar.
        - name: truncation
          type: string
          required: false
          description: Girdi kırpma davranışı.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/responses \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-5.2","input":"Explain immutable infrastructure in one sentence."}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.responses.create(
            model="openai/gpt-5.2",
            input="Explain immutable infrastructure in one sentence.",
        )
        print(response.output_text)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.responses.create({
          model: "openai/gpt-5.2",
          input: "Explain immutable infrastructure in one sentence.",
        });
        console.log(response.output_text);
  response:
    status: 200 OK
    code: |-
      {
        "id": "resp_01...",
        "object": "response",
        "status": "completed",
        "model": "openai/gpt-5.2",
        "output": [],
        "usage": {
          "input_tokens": 18,
          "output_tokens": 12,
          "total_tokens": 30,
          "input_tokens_details": {"cached_tokens": 0},
          "output_tokens_details": {"reasoning_tokens": 0}
        }
      }
  notes:
    - title: İstek uyumluluğu
      description: SandBase, model değerini seçilen üst akış modeliyle değiştirir ve diğer istek alanlarını korur. Sağlayıcı desteği yine de farklılık gösterebilir.
    - title: Arındırılmış yanıtlar
      description: Yalnızca herkese açık OpenAI yanıt alanları ve token kullanımı döndürülür. Sağlayıcı faturalandırma, hesap, yönlendirme bilgileri ve bilinmeyen üst düzey uzantılar kaldırılır; çıktı öğesi içeriği korunur.
    - title: Akış
      description: Herkese açık response.* ve error SSE olayları arındırılıp iletilir. Bilinmeyen özel olaylar atılır; hatalı biçimli veriler güvenli olmayan içerik iletmek yerine akışı kapatır.
  errors:
    - status: "400"
      description: Geçersiz JSON, eksik model veya geçersiz bir sağlayıcı isteği.
    - status: "401"
      description: Eksik veya geçersiz API anahtarı.
    - status: "402"
      description: Organizasyon veya API anahtarı harcama limitine ulaşıldı.
    - status: "403"
      description: API anahtarı kapsamı veya üst akış izni reddi.
    - status: "413"
      description: Üst akış sağlayıcısı isteği çok büyük olduğu için reddetti.
    - status: "500"
      description: Tahmin yaşam döngüsü veya organizasyon sorgulaması başarısız oldu.
    - status: "502"
      description: Üst akış yanıtı güvenli şekilde ayrıştırılıp arındırılamadı.
    - status: "503"
      description: Yönlendirme başarısız oldu veya tüm sağlayıcı adayları tükendi.
---

<ApiReferencePage />
