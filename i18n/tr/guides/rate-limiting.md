---
i18nSource: d326fdb78ea64bdf
title: Hız limitleri
description: SandBase API hız limitlerini sınırlı yeniden denemeler, jitter, kuyruklar ve idempotency'yi gözeten istek işleme ile güvenle yönetin.
---

# Hız limitleri {#rate-limits}

SandBase organizasyonunuza dakika başına istek limiti atayabilir. Bu limit organizasyondaki tüm API anahtarları tarafından paylaşılır
ve bir dakikalık kayan pencere üzerinden sayılır. Upstream model sağlayıcıları da kendi
`429 Too Many Requests` yanıtlarını döndürebilir. SandBase iş yükünüze bir kota atamadıkça kotayı koda sabit olarak yazmayın.

## Organizasyonunuzun limiti {#your-organization-s-limit}
Limit organizasyon başına atandığından SandBase sabit bir dakika başına istek sayısı yayımlamaz. Organizasyondaki her
API anahtarı aynı limite sayılır, bu yüzden daha fazla anahtar oluşturmak limiti artırmaz. Limit şu anda herkese açık
API'de veya Console'da gösterilmez.

İş yükünüz garantili veya daha yüksek bir limite ihtiyaç duyuyorsa organizasyon, uygulama, beklenen sabit hız ve beklenen
ani yük hızı bilgileriyle SandBase desteğine başvurun. Bir üretim istemcisini belgelenmemiş sayısal bir varsayılana göre tasarlamayın.

## 429 yanıtını ele alma {#handle-a-429-response}

Platformun ürettiği `/v1/*` hız limiti yanıtları düz bir hata gövdesi kullanır:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{"error":"organization rate limit exceeded"}
```

Organizasyon limiti `POST /v1/run`, `POST /v1/chat/completions`, `POST /v1/responses`, `POST /v1/messages`, `POST /v1/upload` ile Gemini `generateContent`, `streamGenerateContent` ve `POST /v1beta/interactions` uç noktalarına uygulanır. `GET /v1/run/{id}` gibi
sorgulama uç noktaları sayılmaz. Protokol uyumlu uç noktalar aynı `429` yanıtını Anthropic veya Google hata yapısı gibi
kendi hata zarflarında döndürür. Sağlayıcı kaynaklı bir yanıt, uyumlu uç noktanın hata yapısını kullanabilir ve
sağlayıcının hız limiti başlıklarını içerebilir.

`Retry-After` ve kalan kota başlıkları garanti edilmez. `Retry-After` varsa ona uyun. Yoksa jitter ve
maksimum deneme sayısıyla üstel geri çekilme kullanın.

```python
import os
import random
import time

from openai import OpenAI, RateLimitError

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def create_with_backoff(**request):
    for attempt in range(5):
        try:
            return client.chat.completions.create(**request)
        except RateLimitError:
            if attempt == 4:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

OpenAI SDK'sı `max_retries` ile yerleşik yeniden denemeleri de destekler. Yeniden denemelerin katmanlar arasında katlanmaması için
SDK yeniden denemelerini veya bir uygulama yeniden deneme döngüsünü bilinçli olarak seçin.

## Yalnızca güvenli işlemleri yeniden deneyin {#retry-only-safe-operations}

Tekrarlanan bir çıkarım isteği ikinci bir üretim oluşturabilir ve ek maliyete yol açabilir. Bunu yalnızca uygulamanız
yeniden üretimi kabul ediyorsa yeniden deneyin. İşlem idempotency'yi belgelemiyorsa veya uygulamanız ilk denemenin başarılı
olmadığını kanıtlayamıyorsa durumu değiştiren bir isteği otomatik olarak yeniden denemeyin.

Akış isteklerinde `429` genellikle akış başlamadan önce gelir. Baytlar gelmeye başladıktan sonra bir bağlantı kopmasını
hız limiti hatası olarak varsaymak yerine kesintiye uğramış bir üretim olarak ele alın. Kısmi çıktıyı ürün gereksinimlerinize
göre koruyun veya atın; yeniden başlatmak yeni bir üretim oluşturur.

## Verimi denetleme {#control-throughput}

- Sınırsız bir toplu işi tek seferde göndermek yerine eşzamanlılığı sınırlayın.
- Ani yük oluşturan işleri kuyruğa alın ve gönderim hızını yumuşatın.
- Yinelenen isteklerden kaçının ve gizlilik ile güncellik gereksinimleri izin verdiğinde yeniden kullanılabilir sonuçları önbelleğe alın.
- Ayrı anahtarları platform limitlerini aşmak için değil, sahiplik, harcama denetimi ve iptal için kullanın.
- Sorun giderme için uç noktayı, modeli, HTTP durumunu ve temizlenmiş hata gövdesini kaydedin.
- Bir iş yükü atanmış veya daha yüksek bir kapasite limiti gerektiriyorsa SandBase desteğine başvurun.

```python
import asyncio

semaphore = asyncio.Semaphore(8)

async def run_one(client, prompt):
    async with semaphore:
        return await client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": prompt}],
        )
```

Eşzamanlılık, dakika başına istekle aynı şey değildir. Her ikisini de gözlemlenen gecikmeye ve uygulamanıza atanan
kapasiteye göre ayarlayın.

::: info Günlük ücretsiz API çağrıları
Organizasyonun UTC günü başına 100 ücretsiz veri API çağrısı bir hız limiti değil, bir faturalandırma hakkıdır. Bunu aşan çağrılar
reddedilmez, çağrı başına ücretlendirilir. [Günlük ücretsiz API çağrıları](/guides/billing#daily-free-api-calls) bölümüne bakın.
:::

::: tip Video görevleri
Video gönderimleri, organizasyonunuzun hesap seviyesine göre aynı anda çalıştırabileceği görev sayısıyla da sınırlıdır.
Bu `429` yanıtı `organization concurrency limit exceeded` der ve bir zamanlayıcıyla değil, çalışan bir görev bittiğinde ortadan kalkar.
[Eşzamanlılık limitleri](/guides/concurrency-limits) sayfasına bakın.
:::

## İlgili kılavuzlar {#related-guidance}

- [Hata yönetimi](/guides/error-handling)
- [Akış](/guides/streaming)
- [API hata referansı](/api-reference/errors)
- [API anahtarları](/getting-started/api-keys)
