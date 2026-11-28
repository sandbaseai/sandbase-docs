---
i18nSource: 335b45fb98c53890
title: Streaming yanıtlar
description: SandBase model çıktısını OpenAI veya Anthropic uyumlu SDK'larla stream edin ve kısmi sonuçları güvenli şekilde yönetin.
---

# Streaming yanıtlar {#streaming-responses}

Streaming, model çıktısını kullanılabilir hale geldikçe döndürür. SandBase, çağırdığınız uyumlu API'nin olay biçimini korur:
OpenAI Chat Completions yalnızca veri içeren Server-Sent Events (SSE) kullanırken Anthropic Messages adlandırılmış SSE olayları kullanır.

Mümkün olduğunda resmi uyumlu bir SDK kullanın. SDK; olay çerçevelemeyi, artımlı araç çağrısı argümanlarını ve protokol
sonlandırmasını ham yanıt metnini kendiniz bölmekten daha güvenli şekilde ele alır.

## OpenAI Chat Completions {#openai-chat-completions}

`POST /v1/chat/completions` isteğinde `stream: true` ayarlayın.

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
)

stream = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[{"role": "user", "content": "Explain quantum computing briefly."}],
    stream=True,
)

for chunk in stream:
    text = chunk.choices[0].delta.content
    if text:
        print(text, end="", flush=True)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: process.env.SANDBASE_API_KEY,
});

const stream = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [{ role: 'user', content: 'Explain quantum computing briefly.' }],
  stream: true,
});

for await (const chunk of stream) {
  const text = chunk.choices[0]?.delta?.content;
  if (text) process.stdout.write(text);
}
```

```bash [cURL]
curl -N https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Explain quantum computing briefly."}],
    "stream": true
  }'
```

:::

OpenAI uyumlu parçalar artımlı metni `choices[0].delta.content` içine yerleştirir. Seçilen model destekliyorsa araç çağrısı argümanları
`delta.tool_calls` içinde dize parçaları olarak gelir; tamamlanan JSON'u ayrıştırmadan önce parçaları choice ve araç çağrısı
indeksine göre birleştirin. Stream normalde `data: [DONE]` ile sona erer.

Her sağlayıcının stream içinde token kullanımı döndürdüğünü varsaymayın. Seçtiğiniz model OpenAI'nin
`stream_options.include_usage` seçeneğini destekliyorsa kullanım bilgisi sona doğru görünebilir; aksi halde streaming olmayan yanıtı veya
ilgili görev maliyeti akışını kullanın.

## Anthropic Messages {#anthropic-messages}

Anthropic SDK'yı `POST /v1/messages` ile kullanın. SDK'nın stream yardımcısı adlandırılmış olayları ve içerik bloklarını birleştirir.

::: code-group

```python [Python]
import os
import anthropic

client = anthropic.Anthropic(
    base_url="https://api.sandbase.ai",
    api_key=os.environ["SANDBASE_API_KEY"],
)

with client.messages.stream(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain quantum computing briefly."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  baseURL: 'https://api.sandbase.ai',
  apiKey: process.env.SANDBASE_API_KEY,
});

const stream = client.messages.stream({
  model: 'anthropic/claude-sonnet-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Explain quantum computing briefly.' }],
});

stream.on('text', (text) => process.stdout.write(text));
await stream.finalMessage();
```

:::

Ham Anthropic stream'leri `message_start`, `content_block_start`, `content_block_delta`,
`content_block_stop`, `message_delta` ve `message_stop` gibi olay adları kullanır. Metin `text_delta` bloklarıyla taşınır. Araç girdisi
artımlı JSON blokları kullanır ve ayrıştırmadan önce birleştirilmelidir.

## Kesinti ve iptali yönetme {#handle-interruption-and-cancellation}

Streaming başlamadan önce döndürülen bir HTTP hatası, endpoint'in normal hata gövdesini kullanır. Yanıt başladıktan sonra
bir ağ hatası, son olay gelmeden kısmi metin bırakabilir. Çıktıyı yalnızca protokolün normal
sonlandırma sinyalinden sonra tamamlanmış kabul edin.

- Kısmi çıktıyı, kalıcı hale getirilmiş uygulama durumundan ayrı tutun.
- Kendi istemcinizde veya proxy'nizde bağlantı ve hareketsizlik zaman aşımlarını iş yüküne göre sınırlayın.
- Kullanıcı üretimi durdurduğunda SDK'nın iptal mekanizmasını veya JavaScript'te bir `AbortController` kullanın.
- Yeniden denenen bir stream'i kısmi çıktıya otomatik olarak eklemeyin; yeniden deneme yeni bir üretimdir.
- Kontrolünüzdeki reverse proxy'lerde SSE'yi tamponlamaktan kaçının.

```javascript
const controller = new AbortController();

const response = await fetch('https://api.sandbase.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'deepseek/deepseek-v4-flash',
    messages: [{ role: 'user', content: 'Write a short story.' }],
    stream: true,
  }),
  signal: controller.signal,
});

// Call controller.abort() when the user cancels.
```

Ham SSE okurken boş satırlarla ayrılmış tam olay çerçevelerini ayrıştırın. Ağ parçaları SSE olaylarıyla birebir
örtüşmez ve bir UTF-8 karakteri birden fazla parçaya yayılabilir. Streaming metin çözücü kullanın ve daha fazla bayt gelene kadar
tamamlanmamış çerçeveleri tutun.

## İlgili kılavuzlar {#related-guidance}

- [Chat Completions](/guides/chat-completions)
- [Anthropic Messages](/guides/anthropic-messages)
- [Hata yönetimi](/guides/error-handling)
- [Hız sınırları](/guides/rate-limiting)
