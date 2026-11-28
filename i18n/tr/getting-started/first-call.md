---
i18nSource: 0ca53876f04eb96d
title: İlk API çağrısı
description: İlk SandBase API çağrınızı yapmanın, isteğin yapısının, yanıt yapısının ve streaming'in ayrıntılı anlatımı.
---

# İlk API çağrısı {#first-api-call}

Bu kılavuz, bir SandBase API isteğinin ve yanıtının yapısını ayrıntılı olarak ele alır. Sonunda istek gövdesindeki her alanı, yanıtın nasıl okunacağını ve streaming'in nasıl kullanılacağını öğrenmiş olacaksınız.

## Başlamadan önce {#before-you-start}

Etkin bir SandBase kuruluşuna, bir [API anahtarına](/getting-started/api-keys) ve [Models kataloğundan](https://www.sandbase.ai/models) bir model kimliğine ihtiyacınız var. Örneklerin kaynak koda gizli bilgi yerleştirmemesi için anahtarı export edin:

```bash
export SANDBASE_API_KEY="sk-YOUR_API_KEY"
```

Streaming olmayan bir istekle başlayın. Kimlik doğrulama ve yanıt işleme çalıştıktan sonra streaming ve production yeniden deneme davranışını ekleyin.

## İsteğin yapısı {#request-anatomy}

Bu adım adım anlatım, OpenAI uyumlu Chat Completions yolunu kullanır:

```bash
POST https://api.sandbase.ai/v1/chat/completions
```

### Zorunlu header'lar {#required-headers}

| Header | Değer | Açıklama |
|--------|-------|-------------|
| `Authorization` | `Bearer sk-YOUR_API_KEY` | SandBase API anahtarınız |
| `Content-Type` | `application/json` | İstek gövdesi biçimi |

### İstek gövdesi {#request-body}

```json
{
  "model": "deepseek/deepseek-v4-flash",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is the capital of France?"}
  ],
  "temperature": 0.7,
  "max_tokens": 256
}
```

### Gövde parametreleri {#body-parameters}

| Parametre | Tür | Zorunlu | Açıklama |
|-----------|------|----------|-------------|
| `model` | string | Evet | `GET /v1/models` tarafından döndürülen etkin bir model kimliği (örneğin `deepseek/deepseek-v4-flash`) |
| `messages` | array | Evet | Mesaj nesnelerinden oluşan bir dizi olarak konuşma geçmişi |
| `temperature` | number | Hayır | Örnekleme sıcaklığı (0–2). Destek ve varsayılanlar modele göre değişebilir. |
| `max_tokens` | integer | Hayır | Yanıtta üretilecek en fazla token sayısı |
| `top_p` | number | Hayır | Nucleus sampling parametresi (0–1) |
| `stream` | boolean | Hayır | Yanıtın stream edilip edilmeyeceği. Varsayılan: `false` |
| `stop` | string veya array | Hayır | Durdurma dizileri; bunlarla karşılaşıldığında üretim durur |
| `frequency_penalty` | number | Hayır | Destekleniyorsa sağlayıcı uyumlu tekrar cezası |
| `presence_penalty` | number | Hayır | Destekleniyorsa sağlayıcı uyumlu varlık cezası |

### Mesaj rolleri {#message-roles}

| Rol | Amaç |
|------|---------|
| `system` | Asistanın davranışını ve kişiliğini belirler |
| `user` | Kullanıcının girdisi |
| `assistant` | Önceki asistan yanıtları (çok turlu konuşmalar için) |
| `developer`, `tool` | Seçilen model ve yol destekliyorsa ek OpenAI uyumlu roller |

## Tam istek örneği {#full-request-example}

::: code-group

```bash [cURL]
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is the capital of France?"}
    ],
    "temperature": 0.7,
    "max_tokens": 256
  }'
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)

response = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is the capital of France?"}
    ],
    temperature=0.7,
    max_tokens=256
)

print(response.choices[0].message.content)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});

const response = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' },
  ],
  temperature: 0.7,
  max_tokens: 256,
});

console.log(response.choices[0].message.content);
```

:::

## Yanıt yapısı {#response-structure}

### Tipik streaming olmayan yanıt {#typical-non-streaming-response}

```json
{
  "id": "chatcmpl-abc123def456",
  "object": "chat.completion",
  "created": 1719000000,
  "model": "deepseek/deepseek-v4-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The capital of France is Paris."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 8,
    "total_tokens": 32
  }
}
```

### Yanıt alanlarının açıklaması {#response-fields-explained}

| Alan | Açıklama |
|-------|-------------|
| `id` | Bu completion için benzersiz tanımlayıcı |
| `object` | OpenAI uyumlu yanıt nesnesi; bu yolda normalde `"chat.completion"` |
| `created` | Yanıtın üretildiği zamanın Unix zaman damgası |
| `model` | Yanıtı üreten model |
| `choices` | Completion seçeneklerinden oluşan dizi (genellikle bir tane) |
| `choices[].index` | Bu seçeneğin dizideki sırası |
| `choices[].message.role` | Üretilen mesaj için döndürülen rol; normalde `"assistant"` |
| `choices[].message.content` | Üretilen metin |
| `choices[].finish_reason` | Üretimin neden durduğu (aşağıya bakın) |
| `usage.prompt_tokens` | Girdinizdeki token sayısı |
| `usage.completion_tokens` | Üretilen çıktıdaki token sayısı |
| `usage.total_tokens` | Prompt ve completion token'larının toplamı |

### Bitiş nedenleri {#finish-reasons}

Bitiş nedenleri sağlayıcıya bağlıdır. Yaygın OpenAI uyumlu değerler şunlardır:

| Değer | Tipik anlamı |
|-------|---------|
| `stop` | Yanıt doğal olarak sona erdi veya bir durdurma dizisine ulaşıldı |
| `length` | `max_tokens` sınırına ulaşıldı; yanıt kesildi |

Bilinmeyen değerleri, yanıtı reddetmek yerine geçerli sağlayıcı çıktısı olarak ele alın.

## Streaming yanıtlar {#streaming-responses}

Gerçek zamanlı çıktı için (yazmakta olan bir sohbet botu gibi) streaming kullanın. Yanıt Server-Sent Events (SSE) olarak gelir:

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)

stream = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[{"role": "user", "content": "Write a haiku about coding."}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()  # newline at the end
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});

const stream = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [{ role: 'user', content: 'Write a haiku about coding.' }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) process.stdout.write(content);
}
console.log();
```

```bash [cURL]
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -N \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Write a haiku about coding."}],
    "stream": true
  }'
```

:::

### Streaming SSE biçimi {#streaming-sse-format}

Uyumlu bir stream genellikle şuna benzer Server-Sent Events yayar:

```
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":"The"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":" capital"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

Önemli noktalar:

- parçaları sırayla işleyin ve tüm `delta.content` parçalarını ekleyin
- yalnızca metadata içeren parçaları, boş delta'ları ve tanımadığınız sağlayıcı uyumlu alanları tolere edin
- stream kapandığında veya son işaretçisi geldiğinde durun; Chat Completions genellikle `data: [DONE]` kullanır
- her modelin tam olarak aynı ilk veya son parça yapısını yaydığını varsaymayın

## Anthropic SDK kullanımı {#using-the-anthropic-sdk}

SandBase, `POST /v1/messages` adresinde Anthropic uyumlu bir endpoint de sunar. `base_url` değerini değiştirerek Anthropic SDK'yı kullanın:

::: code-group

```python [Python]
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai"
)

message = client.messages.create(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What is the capital of France?"}
    ]
)
print(message.content[0].text)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai',
});

const message = await client.messages.create({
  model: 'anthropic/claude-sonnet-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'What is the capital of France?' }],
});
console.log(message.content[0].text);
```

:::

### Anthropic yanıt yapısı {#anthropic-response-structure}

Anthropic uyumlu endpoint, Anthropic tarzı bir yanıt döndürür. Tipik bir metin yanıtı şöyle görünür:

```json
{
  "id": "msg_abc123",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "The capital of France is Paris."
    }
  ],
  "model": "anthropic/claude-sonnet-5",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 14,
    "output_tokens": 8
  }
}
```

| Alan | Açıklama |
|-------|-------------|
| `id` | Mesaj kimliği (`msg_` önekli) |
| `type` | Mesaj nesnesi türü; normalde `"message"` |
| `role` | Üretilen mesajın rolü; normalde `"assistant"` |
| `content` | Türlendirilmiş içerik bloklarından oluşan dizi; her bloğun metin olduğunu varsaymayın |
| `model` | Yanıtı üreten model |
| `stop_reason` | `"end_turn"` (doğal duruş), `"max_tokens"` (sınıra ulaşıldı) veya `"stop_sequence"` |
| `usage.input_tokens` | Girdinizdeki token sayısı |
| `usage.output_tokens` | Üretilen çıktıdaki token sayısı |

### Anthropic streaming {#anthropic-streaming}

Anthropic SDK ile streaming aynı şekilde çalışır; yalnızca `stream=True` gönderin:

```python
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai"
)

with client.messages.stream(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a haiku about coding."}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
print()
```

## Model seçimi {#choosing-a-model}

Bir model seçerken kullanılabilirlik, fiyatlandırma, bağlam uzunluğu, desteklenen girdiler ve yetenekler için modelin canlı model kartını kontrol edin. Bu değerler birbirinden bağımsız olarak değişir; bu nedenle kopyalanmış bir model karşılaştırmasına güvenmeyin.

- Güncel [Models kataloğuna](https://www.sandbase.ai/models) göz atın.
- Modele özgü istek alanları için katalogda modelin sayfasını açın.
- Bir entegrasyonun güncel model metadata'sına programatik olarak ihtiyacı olduğunda `GET /v1/models` sorgulayın.

Aynı uyumlu arayüzü paylaşan modeller arasında geçiş genellikle `model` parametresiyle başlar. İsteğe bağlı alanları, araçları, medya girdilerini veya yapılandırılmış çıktı ayarlarını taşımadan önce seçilen modelin yeteneklerini ve şemasını yeniden kontrol edin.

## Sonraki adımlar {#next-steps}

Production'a geçmeden önce istek zaman aşımlarını ayarlayın, yalnızca geçici hataları sınırlı üstel geri çekilmeyle yeniden deneyin, mevcutsa istek kimliklerini loglayın ve prompt'ları veya API anahtarlarını loglamadan kullanımı izleyin.

- [**API referansı**](/api-reference/): Çıkarım endpoint'leri ve Platform API sözleşmeleri
- [**Streaming kılavuzu**](/guides/streaming): Gelişmiş streaming kalıpları ve hata yönetimi
- [**Modeller**](https://www.sandbase.ai/models): Model keşfi, yetenekler ve güncel fiyatlandırma
- [**Hatalar**](/guides/error-handling): Hataları ve yeniden denemeleri yönetin
