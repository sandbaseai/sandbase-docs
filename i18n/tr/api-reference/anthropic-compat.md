---
i18nSource: 04f3657850b71e58
title: Anthropic Mesajı Oluştur
description: Bir SandBase modeliyle Anthropic uyumlu bir mesaj oluşturun.
aside: false
outline: false
apiReference:
  title: Anthropic Mesajı Oluştur
  operation: Inference
  method: POST
  path: /v1/messages
  description: SandBase'in Anthropic uyumlu Messages endpoint'i üzerinden bir mesaj oluşturun. SandBase, modeli seçilen sağlayıcıya eşler ve uyumlu istek ve yanıt alanlarını korur.
  signature: client.messages.create(params)
  groups:
    - title: İstek header'ları
      fields:
        - name: x-api-key
          type: string
          required: false
          description: "SandBase API anahtarı. Authorization: Bearer da kabul edilir; ikisi birlikte gönderilirse x-api-key önceliklidir."
        - name: anthropic-version
          type: string
          required: false
          default: 2023-06-01
          description: Upstream'e iletilen Anthropic API sürümü. Gönderilmezse SandBase 2023-06-01 değerini kullanır.
        - name: anthropic-beta
          type: string
          required: false
          description: Virgülle ayrılmış beta özellik tanımlayıcıları; sağlayıcı uyumluluğuna bağlıdır.
    - title: İstek gövdesi
      schema: MessageCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Anthropic uyumlu model tanımlayıcısı.
        - name: messages
          type: object[]
          required: true
          description: Metin veya türlendirilmiş içerik blokları içeren user ve assistant mesajları.
        - name: max_tokens
          type: integer
          required: true
          description: En fazla çıktı token sayısı.
        - name: system
          type: string | object[]
          required: false
          description: Üst düzey sistem talimatı.
        - name: temperature
          type: number
          required: false
          default: "1"
          description: 0 ile 1 arasında örnekleme sıcaklığı.
        - name: top_p
          type: number
          required: false
          description: Nucleus sampling eşiği.
        - name: top_k
          type: integer
          required: false
          description: Örneklemeyi en olası K token ile sınırlar.
        - name: stop_sequences
          type: string[]
          required: false
          description: Üretimi durduran özel diziler.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Anthropic tarzı Server-Sent Events döndürür.
        - name: metadata
          type: object
          required: false
          description: İsteğe bağlı bir user_id dahil istek metadata'sı.
        - name: tools
          type: object[]
          required: false
          description: Modelin kullanabileceği araç tanımları.
        - name: tool_choice
          type: object
          required: false
          description: Araç seçimi davranışını kontrol eder.
        - name: thinking
          type: object
          required: false
          description: Desteklenen modeller için genişletilmiş düşünme (extended thinking) yapılandırması.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/messages \
          -H "x-api-key: $SANDBASE_API_KEY" \
          -H "anthropic-version: 2023-06-01" \
          -H "Content-Type: application/json" \
          -d '{"model":"anthropic/claude-sonnet-4","max_tokens":256,"messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from anthropic import Anthropic

        client = Anthropic(api_key="sk-sb-...", base_url="https://api.sandbase.ai")
        message = client.messages.create(
            model="anthropic/claude-sonnet-4",
            max_tokens=256,
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(message.content[0].text)
    - label: TypeScript
      language: typescript
      code: |-
        import Anthropic from "@anthropic-ai/sdk";

        const client = new Anthropic({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai" });
        const message = await client.messages.create({
          model: "anthropic/claude-sonnet-4",
          max_tokens: 256,
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "msg_01...",
        "type": "message",
        "role": "assistant",
        "model": "anthropic/claude-sonnet-4",
        "content": [{ "type": "text", "text": "Hello! How can I help?" }],
        "stop_reason": "end_turn",
        "usage": { "input_tokens": 8, "output_tokens": 7 }
      }
  notes:
    - title: Kimlik doğrulama
      description: "x-api-key veya Authorization: Bearer kullanın. İkisi birlikte gönderilirse x-api-key önceliklidir."
    - title: Şeffaf protokol
      description: Model eşleme ve yapılandırılmış sağlayıcı uyumluluk kuralları dışında SandBase, uyumlu istek alanlarını, stream olmayan yanıtları ve SSE olaylarını protokol dönüşümü yapmadan iletir.
    - title: Beta özellikleri
      description: anthropic-beta gönderildiğinde iletilir. Bir adayın uyumluluk kuralları desteklenmeyen beta alanlarını kaldırabilir veya o adayı atlayabilir.
  errors:
    - status: "400"
      description: Geçersiz istek gövdesi veya desteklenmeyen özellik.
    - status: "401"
      description: Eksik veya geçersiz API anahtarı.
    - status: "402"
      description: Kuruluş harcama sınırına ulaşıldı.
    - status: "403"
      description: API Key harcama sınırı veya kuruluş izni hatası.
    - status: "404"
      description: Model bulunamadı veya kullanılamıyor.
    - status: "413"
      description: Sağlayıcı isteği çok büyük olduğu için reddetti.
    - status: "429"
      description: Sağlayıcı hız sınırı aşıldı.
    - status: "500"
      description: Tahmin yaşam döngüsü veya sağlayıcı hatası.
    - status: "502"
      description: Upstream stream, kullanılabilir içerik gelmeden sona erdi.
    - status: "503"
      description: Yönlendirme başarısız oldu veya tüm sağlayıcı adayları kullanılamıyordu.
---

<ApiReferencePage />
