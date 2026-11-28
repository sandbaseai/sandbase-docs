---
i18nSource: 9ee3d6d77d12e944
title: Chat Completions API
description: SandBase dil ve görü modelleriyle OpenAI uyumlu chat completion'lar oluşturun.
aside: false
outline: false
apiReference:
  title: Chat Completion Oluştur
  operation: Inference
  method: POST
  path: /v1/chat/completions
  description: Desteklenen herhangi bir SandBase sohbet modeliyle OpenAI uyumlu bir chat completion oluşturun. Sağlayıcı uyumlu alanlar, seçilen rota destekliyorsa korunur.
  signature: client.chat.completions.create(params)
  groups:
    - title: İstek gövdesi
      schema: ChatCompletionCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Models API'den model tanımlayıcısı.
        - name: messages
          type: object[]
          required: true
          description: Seçilen sağlayıcının desteklediği rolleri kullanan konuşma mesajları; genellikle system, developer, user, assistant veya tool.
        - name: temperature
          type: number
          required: false
          default: "1"
          description: 0 ile 2 arasında örnekleme sıcaklığı.
        - name: top_p
          type: number
          required: false
          default: "1"
          description: Nucleus örnekleme eşiği.
        - name: max_tokens
          type: integer
          required: false
          description: Maksimum çıktı token sayısı.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Artımlı Server-Sent Events döndürür.
        - name: stop
          type: string | string[]
          required: false
          description: Üretimi durduran dizi veya diziler.
        - name: tools
          type: object[]
          required: false
          description: Modelin kullanabileceği fonksiyon tanımları.
        - name: tool_choice
          type: string | object
          required: false
          default: auto
          description: Bir aracın seçilip seçilmeyeceğini ve hangisinin seçileceğini denetler.
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: Desteklenen modellerin tek bir turda birden fazla araç çağrısı üretmesine izin verir.
        - name: user
          type: string
          required: false
          description: Sağlayıcı uyumlu son kullanıcı tanımlayıcısı.
        - name: response_format
          type: object
          required: false
          description: JSON nesnesi veya JSON Schema çıktı yapılandırması.
        - name: reasoning_effort
          type: string
          required: false
          description: Sağlayıcı uyumlu akıl yürütme çabası ayarı.
        - name: reasoning
          type: object
          required: false
          description: effort veya max_tokens gibi akıl yürütme yapılandırması.
        - name: thinking
          type: object
          required: false
          description: type veya budget_tokens gibi düşünme yapılandırması.
        - name: extra_body
          type: object
          required: false
          description: Protokol dönüşümü gerektiren rotalar için sağlayıcıya özgü parametreler.
        - name: n
          type: integer
          required: false
          default: "1"
          description: Üretilecek completion seçeneği sayısı.
        - name: presence_penalty
          type: number
          required: false
          default: "0"
          description: -2 ile 2 arasında presence penalty.
        - name: frequency_penalty
          type: number
          required: false
          default: "0"
          description: -2 ile 2 arasında frequency penalty.
        - name: stream_options
          type: object
          required: false
          description: include_usage gibi akış seçenekleri.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/chat/completions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"deepseek/deepseek-v4-flash","messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(response.choices[0].message.content)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.chat.completions.create({
          model: "deepseek/deepseek-v4-flash",
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(response.choices[0].message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "chatcmpl_01...",
        "object": "chat.completion",
        "model": "deepseek/deepseek-v4-flash",
        "choices": [{
          "index": 0,
          "message": { "role": "assistant", "content": "Hello! How can I help?" },
          "finish_reason": "stop"
        }],
        "usage": { "prompt_tokens": 8, "completion_tokens": 7, "total_tokens": 15 }
      }
  notes:
    - title: Akış ve araçlar
      description: "SSE için stream değerini true yapın; akış data: [DONE] ile biter. Son kullanım parçası için stream_options.include_usage ekleyin. Araç çağrıları ve çok modlu içerik OpenAI uyumlu şemayı izler."
    - title: Sağlayıcı uyumluluğu
      description: SandBase, aynı protokollü rotalarda ek uyumlu alanları korur. Protokoller arası ve sağlayıcıya özgü alan desteği değişkenlik gösterir; uygun olduğunda extra_body kullanın.
  errors:
    - status: "400"
      description: Geçersiz istek gövdesi veya desteklenmeyen parametre.
    - status: "401"
      description: API anahtarı eksik veya geçersiz.
    - status: "402"
      description: Organizasyonun harcama limitine ulaşıldı.
    - status: "404"
      description: Model bulunamadı veya kullanılamıyor.
    - status: "429"
      description: Hız limiti aşıldı.
    - status: "500"
      description: İsteğin kalıcı olarak kaydedilmesi veya organizasyon araması başarısız oldu.
    - status: "502"
      description: Seçilen sağlayıcı geçersiz bir yanıt döndürdü.
    - status: "503"
      description: Hiçbir sağlayıcı rotası başarılı olmadı.
---

<ApiReferencePage />
