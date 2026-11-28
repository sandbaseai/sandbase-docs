---
i18nSource: fc051d55a0cfa8bd
title: Eşzamanlılık limitleri
description: Organizasyonunuzun aynı anda kaç görev çalıştırabileceği, limitin hesap seviyenize göre nasıl ölçeklendiği ve video gönderimlerinde 429 ile 402 hatalarının nasıl işleneceği.
---

# Eşzamanlılık limitleri {#concurrency-limits}

Eşzamanlılık limitleri, organizasyonunuzun aynı anda kaç görevi devam ettirebileceğini belirler. Her organizasyonun bir hesap seviyesi vardır ve eşzamanlılık limitini bu seviye belirler. Limite ulaştığınızda, aşağıdaki denetlenen uç noktalara yapılan yeni gönderimler, çalışan görevlerinizden biri bitene kadar `429` ile reddedilir. Bu gönderimler kuyruğa alınmaz.

Limit, tüm API anahtarları genelinde organizasyonun tamamına uygulanır. Hangi gönderimlerin denetleneceği uç noktaya bağlıdır:

- `POST /v1/run` ve `/v1/api/{vendor}/...` üzerinden yapılan Platform API çağrıları; görüntü, ses, LLM ve veri API işlemleri dahil tüm model türleri için denetlenir.
- Chat Completions, Responses, Messages, OpenAI Images ve protokol uyumlu Gemini ve Volcengine uç noktaları gibi diğer uç noktalar yalnızca video gönderimlerini denetler.

## Nasıl çalışır {#how-it-works}

Denetlenen bir görev gönderdiğinizde SandBase, organizasyonunuzda o anda devam eden, yani `pending` veya `running` durumundaki görevleri sayar. Bu sayı zaten limitinizdeyse gönderim hemen `429` ile reddedilir. Hiçbir görev oluşturulmaz ve ücret alınmaz.

Sayım yalnızca videoyu değil, organizasyonunuzdaki devam eden tüm istekleri kapsar. Denetlenen bir görevi gönderdiğinizde hâlâ açık olan akışlı bir chat completion bir yuva kullanır. Aynı organizasyon uzun akışlı sohbetler ve video işleri çalıştırıyorsa kapasite planlarken bunların hepsini hesaba katın.

Bir görev son duruma (`completed`, `failed` veya `timeout`) ulaştığı anda yuva boşalır. Sizin tarafınızda serbest bırakılacak bir şey yoktur. Yuvalar bir zamanlayıcıyla değil görevler bittiğinde boşaldığı için bu `429`, dakika başına [hız limitinden](/guides/rate-limiting) farklıdır. Sabit bir süre beklemek yuva garantisi vermez. Bunun yerine kendi görevlerinizden birinin bitmesini bekleyin.

## Varsayılan limitler {#default-limits}

Her yeni organizasyon 2 eşzamanlı görev limitiyle **Bronze** seviyesinde başlar. Seviyeniz, tek bir başarılı yüklemenin tutarına göre otomatik olarak yükselir.

| Seviye | Tek yükleme | Eşzamanlı görevler |
|-------|---------------|------------------|
| Bronze | Varsayılan | 2 |
| Silver | 10 $ veya üzeri | 10 |
| Gold | 100 $ veya üzeri | 100 |
| Platinum | 500 $ veya üzeri | 500 |
| Diamond | Satış ekibiyle iletişime geçin | Sınırsız |

- **Toplam değil, tek yükleme.** İki adet 60 $'lık yükleme sizi Silver seviyesinde tutar. Tek bir 100 $'lık yükleme sizi Gold seviyesine taşır.
- **Yalnızca yükseltme.** Sonradan yapılan daha küçük bir yükleme seviyenizi asla düşürmez.
- **Yalnızca ücretli yüklemeler.** Promosyon kredileri, kayıt kredileri ve kuponlar seviyenizi değiştirmez.
- **Hemen geçerli olur.** Ödeme başarılı olduğunda yeni limit bir sonraki video gönderiminize uygulanır.

## Limitinizi artırma {#increasing-your-limit}

Limitinizi yükseltmenin en doğrudan yolu, yukarıdaki tabloda bir sonraki eşiğe ulaşan tek bir yüklemedir.

500'den fazla eşzamanlı görev veya aylık kredi limiti için **Diamond** seviyesi hakkında [contact@sandbase.ai](mailto:contact@sandbase.ai) adresine yazın. Diamond'ın eşzamanlılık limiti yoktur. SandBase ekibi tarafından ayarlanır ve yüklemelerle asla değişmez.

## Video gönderimlerinde kredi denetimi {#credit-check-on-video-submissions}

SandBase, eşzamanlılık denetiminin yanı sıra her video görevini kabul etmeden önce maliyetini tahmin eder. Tahmin kullanılabilir kredinizden (bakiye ile varsa kredi limitinin toplamı) fazlaysa gönderim `402` ile reddedilir. Hiçbir görev oluşturulmaz ve ücret alınmaz.

- Her gönderim güncel bakiyenize göre denetlenir. Hâlâ çalışan görevler henüz ücretlendirilmemiştir; bu nedenle aynı anda birden fazla video gönderirken pay bırakın.
- Bir modelin fiyatı yalnızca çalıştıktan sonra oluşan çıktıya bağlıysa maliyet önceden tahmin edilemez. Gönderim kabul edilir ve görev bittiğinde normal şekilde faturalandırılır.

## Eşzamanlılık hatalarını işleme {#handling-concurrency-errors}

### 429: eşzamanlılık limitine ulaşıldı {#_429-concurrency-limit-reached}

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "error": "organization concurrency limit exceeded"
}
```

`Retry-After` başlığı gönderilmez. Limit önceden bilindiği için en güvenilir yaklaşım onu hiç aşmamaktır. Devam eden video görevlerinin sayısını istemci tarafında sınırlayın ve bir sonrakini yalnızca önceki görevlerden biri bittikten sonra gönderin:

::: code-group

```python [Python]
import asyncio

MAX_CONCURRENT_VIDEOS = 2  # set to your level's limit
slots = asyncio.Semaphore(MAX_CONCURRENT_VIDEOS)

async def generate_video(submit, wait_for_result, payload):
    # Hold a slot for the whole lifetime of the task, not just the submit call.
    async with slots:
        task = await submit(payload)
        return await wait_for_result(task)

async def main(submit, wait_for_result, payloads):
    return await asyncio.gather(
        *(generate_video(submit, wait_for_result, p) for p in payloads)
    )
```

```javascript [JavaScript]
const MAX_CONCURRENT_VIDEOS = 2; // set to your level's limit

async function runAll(payloads, submit, waitForResult) {
  const results = [];
  const queue = [...payloads.entries()];

  async function worker() {
    for (let next = queue.shift(); next; next = queue.shift()) {
      const [index, payload] = next;
      // Each worker holds one slot until its task finishes.
      const task = await submit(payload);
      results[index] = await waitForResult(task);
    }
  }

  await Promise.all(
    Array.from({ length: MAX_CONCURRENT_VIDEOS }, worker)
  );
  return results;
}
```

:::

Örneğin aynı organizasyondaki başka bir hizmet de gönderim yaptığı için yine `429` alırsanız geri çekilip yeniden deneyin. Jitter ile üstel geri çekilme kullanın ve sıkı bir döngüde yeniden denemek yerine sınırlı sayıda denemeden sonra vazgeçin.

### 402: bu video için yeterli kredi yok {#_402-not-enough-credit-for-this-video}

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "error": "insufficient credit for estimated video cost"
}
```

Yeniden denemeyin. Bakiye yükleyin ya da daha az maliyetli, daha kısa bir süre veya daha düşük bir çözünürlük seçin.

### Uyumlu API'ler {#compatible-apis}

Protokol uyumlu uç noktalar bu hataları kendi yerel biçimlerinde döndürür. Örneğin Volcengine uyumlu `/api/v3/contents/generations/tasks` uç noktası `429` için `RateLimitExceeded`, `402` için `AccountOverdueError` döndürür.

## İlgili sayfalar {#related}

- [Hız limitleri](/guides/rate-limiting): dakika başına istek limitleri
- [Fiyatlandırma](/guides/billing): krediler ve yüklemeler
- [Hatalar](/api-reference/errors): tüm hata kodları
