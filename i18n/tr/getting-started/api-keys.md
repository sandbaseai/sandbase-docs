---
i18nSource: 3dc57d405dbf561d
title: API anahtarları
description: API isteklerinin kimliğini doğrulamak için SandBase API anahtarlarınızı oluşturma, yönetme ve güvence altına alma.
---

# API anahtarları {#api-keys}

API anahtarları, SandBase'e gönderdiğiniz isteklerin kimliğini doğrular. Bu kılavuz anahtar oluşturmayı, anahtarları isteklerde kullanmayı ve güvende tutmayı anlatır.

## API anahtarı oluşturma {#create-an-api-key}

1. [SandBase Console](https://www.sandbase.ai/console)'a giriş yapın
2. **Developer → API Keys** sayfasını açın (veya doğrudan [API Keys](https://www.sandbase.ai/console/keys) sayfasına gidin)
3. **New key** düğmesine tıklayın
4. Açıklayıcı bir **Name** girin (ör. "Production Server", "Local Development")
5. İsteğe bağlı olarak bir **Spending limit** (boş bırakılırsa sınırsız) ve bir **Expires** tarihi (boş bırakılırsa süresiz) ayarlayın
6. **Create key** düğmesine tıklayın
7. Anahtarı **API key created** bandından hemen kopyalayın — yalnızca bir kez gösterilir

::: danger Önemli
API anahtarınız yalnızca oluşturulduğu anda bir kez gösterilir. Kaybederseniz yeni bir anahtar oluşturmanız gerekir. İletişim kutusunu kapatmadan önce anahtarı güvenli bir yere kaydedin.
:::

## Anahtar biçimi {#key-format}

Console'da oluşturulan yeni API anahtarları `sk-` önekini ve ardından 64 onaltılık karakteri kullanır:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Mevcut `sk-sb-...` anahtarları süreleri dolana veya iptal edilene kadar geçerli kalır. Bir kimlik bilgisini doğrulamak için
yalnızca öneki kullanmayın; değerin tamamını her zaman opak bir gizli değer olarak ele alın.

## Kimlik doğrulama yöntemleri {#authentication-methods}

SandBase, API anahtarınızı isteklerde iletmenin iki yolunu destekler:

### Authorization başlığı (önerilen) {#authorization-header-recommended}

Standart `Authorization: Bearer` başlığını kullanın. Bu yöntem OpenAI ve Anthropic SDK'larıyla uyumludur:

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek/deepseek-v4-flash", "messages": [{"role": "user", "content": "Hi"}]}'
```

### Anthropic Messages: x-api-key başlığı {#anthropic-messages-x-api-key-header}

`POST /v1/messages`, Anthropic'in yerel `x-api-key` başlığını da kabul eder:

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "x-api-key: sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "anthropic/claude-sonnet-5", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hi"}]}'
```

::: tip
Model ağ geçitleri arasında yalnızca `POST /v1/messages` `x-api-key` başlığını okur ve desteklenen iki başlık birlikte
gönderildiğinde öncelik bu başlıktadır. [Agents platformu kaynakları](/api-reference/authentication#agents-platform-resources) da
`X-API-Key` kabul eder. Diğer tüm herkese açık uç noktalarda Bearer başlığını kullanın.
:::

## Anahtar izinleri {#key-permissions}

SandBase API anahtarlarının kapsamı **organizasyon düzeyindedir**:

- Console'da oluşturulan standart bir anahtar, organizasyonun erişebildiği herkese açık API kaynaklarını çağırabilir
- Kullanım, anahtarın sahibi olan organizasyona faturalandırılır
- Bir anahtarın isteğe bağlı bir son kullanma tarihi ve harcama limiti olabilir
- CLI Login anahtarları gibi SandBase tarafından verilen kimlik bilgileri kısıtlı bir kapsam taşıyabilir ve bu kapsam dışında `403` döndürür

Console şu anda standart bir anahtar için kullanıcının seçebileceği kapsamlar sunmaz. CLI Login anahtarları bir yapay zekâ aracını bağladığınızda oluşturulur. API Keys sayfası bunları genişletilebilir tek bir **CLI Login** satırında gruplar ve standart anahtarlar gibi düzenlenemezler. SandBase'in sizin için oluşturduğu anahtarlar **Auto-created** rozeti taşır; anahtar düzeyinde limitleri yoktur ve hesap bakiyesiyle sınırlıdırlar.

Anahtar listesi her anahtar için **Name**, **Key Prefix**, **Spent**, **Limit**, **Expires** ve **Status** değerlerini gösterir. Standart bir anahtarın adını, harcama limitini veya son kullanma tarihini değiştirmek için **Edit** seçeneğini kullanın.

Her anahtarı kişisel bir parola olarak değil, bir uygulama kimlik bilgisi olarak ele alın. İnsan erişimi için organizasyon üyeliğini, iş yükleri için API anahtarlarını kullanın.

## Ortam stratejisi {#environment-strategy}

Her uygulama ve ortam için farklı bir anahtar oluşturun:

| Anahtar | Örnek ad | Neden |
|---|---|---|
| Yerel geliştirme | `research-app-dev` | Üretimi kesintiye uğratmadan yenileyebilirsiniz |
| Hazırlık (staging) | `research-app-staging` | Test kullanımını ve olayları yalıtır |
| Üretim | `research-app-production` | Üretime net bir sahip ve sınırlı bir maruziyet sağlar |
| Geçici otomasyon | `release-check-2026-08` | Son kullanma tarihi ayarlayıp bağımsız olarak iptal edebilirsiniz |

Her anahtarı kullanan sahibi ve dağıtımı kaydedin. Yenileme sırasında yeni anahtarı dağıtın, isteklerin başarılı olduğunu doğrulayın ve ancak ondan sonra eski anahtarı iptal edin.

## Anahtarların süresinin dolması ve iptali {#key-expiration-and-revocation}

### Süre sonu {#expiration}

Bir anahtar oluştururken isteğe bağlı olarak bir son kullanma tarihi ayarlayabilirsiniz. Süresi dolan anahtar çalışmayı durdurur ve istekler `401 Unauthorized` hatası döndürür.

Son kullanma tarihi olmayan anahtarlar elle iptal edilene kadar geçerli kalır.

### Anahtar iptal etme {#revoking-a-key}

Bir anahtarı iptal etmek (devre dışı bırakmak) için:

1. [Developer → API Keys](https://www.sandbase.ai/console/keys) sayfasına gidin
2. İptal etmek istediğiniz anahtarı bulun
3. **Revoke** düğmesine tıklayın
4. İşlemi onaylayın

İptal edilen anahtarlar yeni isteklerin kimliğini doğrulayamaz. İptal geri alınamaz — yanlışlıkla bir anahtarı iptal ederseniz yeni bir anahtar oluşturun.

## Güvenlik için en iyi uygulamalar {#security-best-practices}

### Anahtarları asla sürüm denetimine eklemeyin {#never-commit-keys-to-version-control}

Bunun yerine ortam değişkenleri veya bir gizli değer yöneticisi kullanın:

```bash
# .env file (add to .gitignore!)
SANDBASE_API_KEY=sk-your-key-here
```

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

### Farklı ortamlar için ayrı anahtarlar kullanın {#use-separate-keys-for-different-environments}

Geliştirme, hazırlık ve üretim için ayrı anahtarlar oluşturun. Böylece güvenliği ihlal edilmiş bir geliştirme anahtarını üretimi etkilemeden iptal edebilirsiniz.

### Anahtarları düzenli olarak yenileyin {#rotate-keys-regularly}

Düzenli aralıklarla yeni anahtarlar oluşturup eskilerini kullanımdan kaldırın. Bu, bir anahtar sızdığında maruziyet süresini sınırlar.

### Etkinliği izleyin {#monitor-activity}

Güvenliği ihlal edilmiş bir anahtara işaret edebilecek beklenmedik istek veya kullanım artışları için **Developer → Activities** sayfasını düzenli olarak kontrol edin. **Request History**, API anahtarına göre filtrelenebilir.

Bir anahtar açığa çıkarsa hemen iptal edin, yerine yeni bir anahtar oluşturun, onu kullanan uygulamayı güncelleyin ve beklenmedik kullanım için Activities ile faturalandırmayı inceleyin. Planlı yenilemeyi beklemeyin.

### Son kullanma tarihleri ayarlayın {#set-expiration-dates}

Geçici erişim için (CI/CD işlem hatları, yüklenici erişimi, demolar), anahtarın otomatik olarak çalışmayı durdurması için bir son kullanma tarihi ayarlayın.

## Sorun giderme {#troubleshooting}

| Hata | Neden | Çözüm |
|-------|-------|-----|
| `401 - missing API key` | İstekte anahtar sağlanmamış | Bir `Authorization: Bearer <key>` başlığı ekleyin |
| `401 - invalid API key` | Anahtar mevcut değil | Yazım hatalarını kontrol edin ve anahtarın tamamının eklendiğinden emin olun |
| `401 - API key has been revoked` | Anahtar Console'da kalıcı olarak iptal edilmiş | Yerine yeni bir anahtar oluşturun |
| `401 - API key has expired` | Anahtarın son kullanma tarihi geçmiş | Yeni bir anahtar oluşturun veya süreyi uzatın |
| `402 - API key spending limit exceeded` | Anahtar yapılandırılmış harcama limitine ulaşmış | Limiti yükseltin veya yetkili başka bir anahtar kullanın |
| `403 - insufficient_scope` | Kapsamlı bir kimlik bilgisi bu uç noktayı çağıramaz | Uç nokta için yetkilendirilmiş bir anahtar kullanın |

## Sonraki adımlar {#next-steps}

- [**İlk API Çağrısı**](/getting-started/first-call) — Tam istek/yanıt açıklamasıyla ayrıntılı bir API çağrısı yapın
- [**Kimlik doğrulama**](/api-reference/authentication) — Desteklenen başlıklar, yaşam döngüsü ve protokole özgü hatalar
- [**API Referansı**](/api-reference/) — Uç noktaların eksiksiz belgeleri
