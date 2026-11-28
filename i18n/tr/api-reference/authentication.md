---
i18nSource: 5b94f91222d138de
title: API kimlik doğrulaması
description: SandBase API'lerinde Bearer token'lar ve desteklenen protokol uyumlu API anahtarı header'larıyla kimlik doğrulayın.
---

# Kimlik doğrulama {#authentication}

SandBase, herkese açık API isteklerinin kimliğini doğrulamak için API anahtarları kullanır. Bu sayfa desteklenen entegrasyon yöntemlerini ve
anahtar yönetimi uygulamalarını anlatır. Console kimlik doğrulaması ve iç API'leri, herkese açık API sözleşmesinin parçası değildir.

## Kimlik doğrulama yöntemleri {#authentication-methods}

Standart SandBase `/v1/*` endpoint'leri bir Bearer token gerektirir. Anthropic Messages ve Google Gemini uyumlu işlemler, kendi yerel SDK'larıyla uyumlu API anahtarı konumlarını da kabul eder.

### Bearer token {#bearer-token}

Anahtarı `Authorization` header'ına ekleyin:

```http
Authorization: Bearer sk-your-api-key
```

Bu, OpenAI uyumlu SDK'ların kullandığı standart yöntemdir.

### Anthropic Messages: x-api-key header'ı {#anthropic-messages-x-api-key-header}

Anahtarı `x-api-key` header'ına ekleyin:

```http
x-api-key: sk-your-api-key
```

Bu header yalnızca `POST /v1/messages` tarafından desteklenir. Diğer herkese açık endpoint'ler bu header'ı okumaz; Chat Completions, `/v1/run`
ve kaynak API'leri için Bearer kimlik doğrulaması kullanın.

### Öncelik {#priority}

Yalnızca `POST /v1/messages` için, iki header birlikte gönderilirse `x-api-key` önceliklidir.

### Google Gemini uyumlu API anahtarları {#google-gemini-compatible-api-keys}

Gemini GenerateContent ve Interactions işlemleri, bu öncelik sırasıyla `x-goog-api-key`, `Authorization: Bearer …` veya `key` sorgu parametresini kabul eder. Sorgu dizesindeki kimlik bilgileri loglarda ve tarayıcı geçmişinde görünebileceği için header kullanmayı tercih edin. Desteklenen yollar için [Google Gemini](/api-reference/gemini-generate-content) ve [Gemini Interactions](/api-reference/gemini-interactions) sayfalarına bakın.

### Anahtarın okunma mantığı {#extraction-logic}

Standart endpoint'ler yalnızca `Authorization: Bearer <key>` değerini okur. Anthropic Messages middleware'i önce `x-api-key` değerini okur,
ardından Bearer header'ına geri döner. Agents platformu kaynakları `Authorization: Bearer` veya
`X-API-Key` kabul eder (aşağıya bakın). [Webhook Events API](/api-reference/webhooks) (`/events/webhooks*`) da iki header'dan birini
kabul eder ve ikisi birlikte gönderilirse Bearer header'ını kullanır. Desteklenen bir kimlik bilgisi eksikse `401 Unauthorized` döner.

### Agents platformu kaynakları {#agents-platform-resources}

`/v1/agents*` (`/v1/agents/sessions*` dahil), `/v1/mcp-connections*`, `/v1/secrets*`
ve `/v1/skills*`, anahtarı iki header'dan birinde kabul eder:

```bash
curl https://api.sandbase.ai/v1/agents \
  -H "X-API-Key: $SANDBASE_API_KEY"
```

- Hem `Authorization: Bearer` hem `X-API-Key` gönderilirse aynı anahtarı taşımaları gerekir; farklı değerler `401 unauthorized` döndürür. Header'lardan birini tekrarlamak da 401 döndürür.
- `OpenAI-Beta` isteğe bağlıdır. Gönderilirse değeri `agents=v1` olmalıdır.
- Okuma istekleri `agents.read` iznine, yazma istekleri `agents.write` iznine ihtiyaç duyar. Console'da oluşturulan standart anahtarlarda ikisi de bulunur. CLI Login anahtarları gibi kapsamı kısıtlı, SandBase tarafından verilen anahtarlar `403 insufficient_scope` döndürür.
- `402 spending_limit_exceeded`, anahtarın harcama sınırının veya kuruluş bakiyesinin tükendiği anlamına gelir.
- Hatalar, aşağıda gösterilen düz `{"error": "…"}` biçimini değil, [Agents hata zarfını](/api-reference/errors#agents-platform-errors) kullanır.

## API anahtarı biçimi {#api-key-format}

Console'da oluşturulan yeni API anahtarları şu biçimdedir:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| Bileşen | Açıklama |
|-----------|-------------|
| `sk-` | Standart "secret key" öneki |
| `xxxx...` | 32 rastgele bayttan üretilen 64 onaltılık karakter |

Eski `sk-sb-...` anahtarları süreleri dolana veya iptal edilene kadar kullanılabilir. İstemciler anahtarları opak dizeler olarak ele almalı,
bir kimlik bilgisini önekine veya uzunluğuna göre reddetmemelidir.

::: warning
API anahtarınızı asla istemci tarafı kodda, herkese açık depolarda veya loglarda açığa çıkarmayın. Ona bir parola gibi davranın.
:::

## API anahtarı oluşturma {#create-api-keys}

### Console üzerinden {#via-console}

1. [SandBase Console](https://www.sandbase.ai/console)'a giriş yapın
2. **Developer → API Keys** sayfasını açın
3. **New key** düğmesine tıklayın
4. Anahtara açıklayıcı bir ad verin (ör. "Production Backend", "Development")
5. Anahtarı hemen kopyalayın; bir daha gösterilmeyecektir

### Anahtar özellikleri {#key-properties}

| Özellik | Açıklama |
|----------|-------------|
| Name | Tanımlama için okunabilir etiket |
| Organization | Anahtarın ait olduğu kuruluş |
| Enabled | Anahtarın etkin olup olmadığı |
| Spending Limit | İsteğe bağlı, anahtar başına harcama sınırı |
| Expires At | İsteğe bağlı son kullanma tarihi |
| Created At | Anahtarın oluşturulduğu zaman |

Console'da oluşturulan standart anahtarlar, belgelenmiş herkese açık API'ye kuruluş düzeyinde erişim sağlar. CLI Login anahtarları gibi SandBase tarafından verilen kimlik bilgileri kısıtlı bir kapsam taşıyabilir. Console, standart anahtarlar için kullanıcının seçebileceği kapsamlar sunmaz.

## Anahtar yaşam döngüsü {#key-lifecycle}

### Yenileme {#rotation}

Bir anahtarı yenilemek için:

1. Console'da yeni bir anahtar oluşturun
2. Uygulamanızı yeni anahtarı kullanacak şekilde güncelleyin
3. Yeni anahtarın production'da çalıştığını doğrulayın
4. Eski anahtarı iptal edin

::: tip
Kesintiyi önlemek için eski anahtarı iptal etmeden önce her zaman yeni anahtarı oluşturun.
:::

### İptal {#revocation}

İptal edilmiş anahtarlar yeni isteklerin kimliğini doğrulayamaz. API şu mesajla `401 Unauthorized` döndürür:

```json
{"error":"API key has been revoked"}
```

### Son kullanma {#expiration}

Anahtarlara isteğe bağlı olarak bir son kullanma tarihi verilebilir. Süresi dolmuş anahtarlar şu mesajla `401 Unauthorized` döndürür:

```json
{"error":"API key has expired"}
```

## Endpoint kimlik doğrulama gereksinimleri {#endpoint-authentication-requirements}

| Endpoint | Kimlik doğrulama yöntemi | Açıklama |
|----------|-------------|-------------|
| `POST /v1/chat/completions` | API anahtarı (Bearer) | Chat Completions |
| `POST /v1/responses` | API anahtarı (Bearer) | OpenAI uyumlu Responses API |
| `POST /v1/messages` | API anahtarı (Bearer veya x-api-key) | Anthropic Messages |
| `/v1beta/models/*` | API anahtarı (x-goog-api-key, Bearer veya sorgu parametresi key) | Gemini GenerateContent |
| `/v1beta/interactions*` | API anahtarı (x-goog-api-key, Bearer veya sorgu parametresi key) | Gemini Interactions |
| `/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*` | API anahtarı (Bearer veya X-API-Key) | Agents platformu kaynakları |

SandBase Console ayrı bir tarayıcı kimlik doğrulama akışı kullanır. Console'un iç istekleri desteklenen herkese açık
endpoint'ler değildir ve entegrasyonlar tarafından kullanılmamalıdır.

## Kuruluş yalıtımı {#organization-isolation}

API anahtarları bir kuruluş kapsamındadır. Bir anahtarla kimlik doğruladığınızda:

- Yalnızca kuruluşunuza ait kaynaklara erişebilirsiniz
- Kullanım ve faturalandırma kuruluş bazında izlenir

## Hata yanıtları {#error-responses}

| HTTP durumu | Mesaj | Neden |
|-------------|---------|-------|
| 401 | `missing API key in Authorization header` | Anahtar gönderilmedi |
| 401 | `invalid API key` | Anahtar veritabanında bulunamadı |
| 401 | `API key has been revoked` | Anahtar devre dışı bırakıldı |
| 401 | `API key has expired` | Anahtarın son kullanma tarihi geçti |
| 402 veya protokole özgü 403 | `API key spending limit exceeded` | Anahtar düzeyindeki harcama sınırına ulaşıldı; endpoint'in belgelenmiş hata sözleşmesine bakın |
| 403 | `API key is not authorized for this endpoint` | Kapsamı kısıtlı bir anahtar, kapsamı dışındaki bir endpoint'te kullanıldı |

Bu mesajlar, `403` kapsam hataları dışında düz `{"error":"<message>"}` gövdesiyle gelir. Model ve hesap
endpoint'lerinde kapsam hataları `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}` biçimini kullanır;
Agents platformu kaynaklarında ise `code` değeri `insufficient_scope` olan [Agents hata zarfını](/api-reference/errors#agents-platform-errors)
kullanır.

## Güvenlik için en iyi uygulamalar {#security-best-practices}

### Yapın {#do}

- **Anahtarları ortam değişkenlerinde saklayın**: Anahtarları asla kaynak koda gömmeyin
- **Her ortam için ayrı anahtar kullanın**: dev, staging ve production için farklı anahtarlar
- **Son kullanma tarihi belirleyin**: Güvenlik politikanıza uygun bir yenileme aralığı seçin
- **Kullanımı izleyin**: Beklenmedik etkinlik için Console'u kontrol edin
- **Standart anahtarları yalnızca herkese açık API erişimi gereken iş yükleri için kullanın**: Kapsamı kısıtlı CLI Login kimlik bilgilerini kendi yönetilen akışlarında tutun

### Yapmayın {#don-t}

- **Anahtarları sürüm kontrolüne commit etmeyin**: `.env` dosyasını `.gitignore`'a ekleyin
- **Tek bir anahtarı birbiriyle ilgisiz uygulamalar arasında paylaşmayın**: Ayrı anahtarlar, yenilemeyi ve olay müdahalesini daha güvenli hale getirir
- **Anahtarları istemci tarafı kodda açığa çıkarmayın**: İstekleri her zaman backend'iniz üzerinden proxy'leyin
- **API anahtarlarını loglamayın**: Uygulama loglarında anahtarları maskeleyin

### Ortam değişkeni örneği {#environment-variable-example}

::: code-group

```bash [.env]
SANDBASE_API_KEY=sk-your-api-key
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

:::

## Anahtar bazında hız sınırlama {#rate-limiting-by-key}

İstek sınırları kuruluş başına atanır ve kuruluşun tüm API anahtarları tarafından paylaşılır; bu nedenle daha fazla anahtar oluşturmak
sınırı artırmaz. API, evrensel bir sayısal
varsayılan değer veya kalan kota header'ları yayımlamaz.

Sınırlar ve 429 yanıtlarının ele alınması hakkında ayrıntılar için [Hız sınırlama](/guides/rate-limiting) sayfasına bakın.
