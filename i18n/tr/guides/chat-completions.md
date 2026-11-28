---
i18nSource: 1fdcd80dbbac0247
title: Chat Completions
description: SandBase ile OpenAI uyumlu chat completions, streaming, araçlar, çok modlu girdi ve yapılandırılmış çıktı kullanın.
---

# Chat Completions {#chat-completions}

SandBase, `POST /v1/chat/completions` adresinde OpenAI uyumlu bir Chat Completions endpoint'i sunar. Mevcut OpenAI SDK uygulamaları, API anahtarını ve base URL'yi değiştirerek SandBase'i kullanabilir.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1",
)
```

## Mesajlar ve çok modlu içerik {#messages-and-multimodal-content}

Mesajları, seçilen sağlayıcının desteklediği rolleri kullanarak konuşma sırasıyla gönderin; bunlar genellikle `system`, `developer`, `user`, `assistant` ve `tool` rolleridir. Metin bir dize olabilir. Görüntü işlemeyi destekleyen modeller `text` ve `image_url` gibi içerik parçalarını da kabul eder.

## Streaming {#streaming}

Server-Sent Events almak için `stream: true` ayarlayın. Her `data:` olayını sırayla okuyun ve `choices[0].delta.content` değerlerini birleştirin. Stream `data: [DONE]` ile sona erer. Seçilen sağlayıcı streaming sırasında kullanım bilgisi sağlıyorsa `stream_options: {"include_usage": true}` ekleyin; aksi halde kullanım bilgisi bulunmayabilir.

## Araçlar {#tools}

Çağrılabilir fonksiyonları `tools` içinde tanımlayın. Asistan `tool_calls` döndürdüğünde her fonksiyonu uygulamanızda çalıştırın, ardından devam etmeden önce eşleşen `tool_call_id` değerini içeren bir `tool` mesajı ekleyin.

## Yapılandırılmış çıktı {#structured-output}

Bir JSON nesnesi veya JSON Schema yanıtı istemek için `response_format` kullanın. Destek modele göre değişir; bu nedenle katı şema doğrulamasına güvenmeden önce seçilen modelin yeteneklerini kontrol edin.

## Sağlayıcıya özgü parametreler {#provider-specific-parameters}

SandBase yönlendirme için `model` ve `stream` kullanır. Seçilen sağlayıcı aynı protokolü kullandığında ek OpenAI uyumlu istek alanları korunur. SandBase protokoller arasında dönüştürme yaptığında belgelenmiş alanları veya `extra_body` kullanın; destek sağlayıcıya göre değişir.

## Hatalar ve yeniden denemeler {#errors-and-retries}

Yeniden denenebilir `429` ve geçici sunucu yanıtları için, yalnızca yeniden üretim güvenliyse sınırlı geri çekilme kullanın. Hatalı biçimlendirilmiş istekleri, kimlik doğrulama hatalarını veya araç yan etkileri zaten gerçekleşmiş olabilecek istekleri otomatik olarak yeniden denemeyin. [Hatalar ve yeniden denemeler](/guides/error-handling) sayfasına bakın. Alanların ve yanıtın tam şeması için [Chat Completions API](/api-reference/llm-gateway) sayfasına bakın.
