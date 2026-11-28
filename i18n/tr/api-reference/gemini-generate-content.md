---
i18nSource: d4dc2aeab688ab05
title: Google Gemini GenerateContent
description: SandBase'i yerel Google Gemini GenerateContent protokolüyle çağırın.
aside: false
outline: false
apiReference:
  title: Google Gemini GenerateContent
  operation: Gemini
  method: POST
  path: /v1beta/models/{model}:generateContent
  description: Yerel bir Gemini isteği gönderin ve Gemini uyumlu bir yanıt alın. Streaming için streamGenerateContent kullanın.
  groups:
    - title: Yol parametreleri
      fields:
        - name: model
          type: string
          required: true
          description: gemini-3.5-flash gibi yalın Google model adı. SandBase bunu google/{model} olarak çözümler.
    - title: İstek gövdesi
      fields:
        - name: contents
          type: array
          required: false
          description: role ve parts'tan oluşan Gemini konuşma içerikleri.
        - name: systemInstruction
          type: object
          required: false
          description: Gemini Content biçiminde metin sistem talimatı.
        - name: generationConfig
          type: object
          required: false
          description: Örnekleme, çıktı uzunluğu, yapılandırılmış çıktı ve düşünme ayarları.
        - name: tools
          type: array
          required: false
          description: Fonksiyon bildirimleri veya desteklenen Gemini yerleşik araç yapılandırması.
        - name: toolConfig
          type: object
          required: false
          description: Gemini fonksiyon çağırma politikası.
        - name: safetySettings
          type: array
          required: false
          description: Gemini güvenlik kategorileri ve eşikleri.
        - name: cachedContent
          type: string
          required: false
          description: Desteklendiğinde olduğu gibi iletilen Gemini önbelleğe alınmış içerik kaynağı.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST \
          "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:generateContent" \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"contents":[{"role":"user","parts":[{"text":"Explain immutable infrastructure in one sentence."}]}]}'
  response:
    status: 200 OK
    code: |-
      {
        "candidates": [
          {
            "content": {
              "role": "model",
              "parts": [{"text": "Immutable infrastructure replaces servers from versioned images instead of modifying them in place."}]
            },
            "finishReason": "STOP",
            "index": 0
          }
        ],
        "usageMetadata": {
          "promptTokenCount": 8,
          "candidatesTokenCount": 15,
          "totalTokenCount": 23
        }
      }
---

<ApiReferencePage />

## Kimlik doğrulama {#authentication}

Google uyumlu istekler SandBase API anahtarını bu öncelik sırasıyla `x-goog-api-key`, `Authorization: Bearer …` veya `key` sorgu parametresinde taşıyabilir. Header kullanmayı tercih edin: sorgu dizesindeki kimlik bilgileri proxy loglarında ve tarayıcı geçmişinde görünebilir.

## Streaming {#streaming}

Yöntem sonekini `:streamGenerateContent` ile değiştirin. Sorgu parametresi olmadan SandBase, Google uyumlu yanıt nesnelerini stream edilen bir JSON dizisi olarak döndürür. Server-Sent Events için `?alt=sse` ekleyin:

```bash
curl -N -X POST \
  "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:streamGenerateContent?alt=sse" \
  -H "x-goog-api-key: $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Write a short greeting."}]}]}'
```

## Yerel görsel üretimi {#native-image-generation}

Aşağıdaki görsel modellerinin özel yerel GenerateContent eşlemeleri vardır:

- [Gemini 3 Pro Image（Nano Banana Pro）](https://www.sandbase.ai/models/google/gemini-3-pro-image/docs): `gemini-3-pro-image`
- [Gemini 3.1 Flash Image（Nano Banana 2）](https://www.sandbase.ai/models/google/gemini-3.1-flash-image/docs): `gemini-3.1-flash-image`
- [Gemini Nano Banana 2.1（Nano Banana 2.1）](https://www.sandbase.ai/models/google/gemini-nano-banana-2.1/docs): `gemini-nano-banana-2.1`

Her model sayfası, token fiyatlarını ve görsel başına maliyeti listeler.

Bu eşlemelerde SandBase, istek ve yanıt payload'larını Chat Completions üzerinden dönüştürmeden
iletir. Böylece görsel parçaları, yanıt modaliteleri ve sağlayıcı tanımlı alanlar korunur. URL'de yalın model adını
kullanın; örneğin `google/gemini-3.1-flash-image`, yolda `gemini-3.1-flash-image` olur.
### Görsel düzenleme {#edit-an-image}

Kaynak görseli, metin talimatının yanına bir `inlineData` parçası olarak ekleyin. Gönderdiğiniz baytların MIME türünü kullanın:

```json
{
  "contents": [{
    "role": "user",
    "parts": [
      {"text": "Keep the subject unchanged and turn the background into a paper-cut landscape."},
      {"inlineData": {"mimeType": "image/png", "data": "<base64-input-image>"}}
    ]
  }],
  "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"imageSize": "1K"}}
}
```

### Google Gen AI SDK kullanımı {#use-the-google-gen-ai-sdk}

Resmi SDK'yı SandBase'e yönlendirin ve SandBase API anahtarınızı kullanın:

```python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="YOUR_SANDBASE_API_KEY",
    http_options=types.HttpOptions(base_url="https://api.sandbase.ai"),
)

response = client.models.generate_content(
    model="gemini-nano-banana-2.1",
    contents="Create a wide editorial illustration of a solar-powered city at sunrise.",
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE"],
        image_config=types.ImageConfig(aspect_ratio="16:9", image_size="1K"),
    ),
)

for part in response.candidates[0].content.parts:
    if part.inline_data:
        with open("output.jpg", "wb") as f:
            f.write(part.inline_data.data)
```

Streaming için aynı gövdeyle `:streamGenerateContent?alt=sse` çağırın (SDK: `generate_content_stream`).

### Yanıtın işlenmesi {#response-handling}
Üretilen medyayı döndürülen candidate parçalarından okuyun. Bu modeller yerel passthrough kullandığından, sağlayıcı tanımlı
alan adı büyük/küçük harf kullanımı ve MIME metadata'sı alındığı gibi döndürülür. Base64 payload'ını çözün ve dosya uzantısını
seçmeden önce gerçek medya baytlarını doğrulayın.

## Yönlendirme ve dönüştürme sınırları {#routing-and-translation-boundaries}

SandBase yalnızca istenen yerel Gemini protokolünü destekleyen sağlayıcıları seçer. Seçilen modelin uyumlu bir yerel
eşlemesi yoksa istek, farklı protokol kullanan bir sağlayıcıya geri düşmek yerine başarısız olur.

Dönüştürülmüş GenerateContent yolunu kullanan modeller metni, fonksiyon çağrılarını ve yanıtlarını, satır içi `image/*` verisini
ve herkese açık HTTP(S) görsel referanslarını destekler. Bu dönüştürülmüş yol; desteklenmeyen satır içi MIME türlerini, özel Google Files veya
`gs://` referanslarını, birden fazla candidate'ı ve desteklenmeyen yanıt modalitelerini Google tarzı bir `400 INVALID_ARGUMENT`
yanıtıyla reddeder. Yukarıda listelenen görsel üretimi eşlemeleri ham passthrough kullanır ve yalnızca dönüştürmeye özgü bu
sınırlara tabi değildir; döndürülen medya alanlarını seçilen sağlayıcının yanıtına göre doğrulayın.
