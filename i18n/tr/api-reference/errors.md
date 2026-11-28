---
i18nSource: ac4e3b9b9eef4c7d
title: API Hataları
description: SandBase API hatalarını HTTP durumuna, uç nokta ailesine, belgelenen yanıt biçimine ve yeniden deneme güvenliğine göre işleyin.
---

# API Hataları {#api-errors}

SandBase standart HTTP durum kodlarını kullanır, ancak tek bir evrensel hata gövdesi sunmaz. Önce HTTP durumuna göre dallanın, ardından çağırdığınız uç nokta için belgelenen yanıt şemasını ayrıştırın. Her hatanın `code`, `param`, `message` veya `request_id` içermesini beklemeyin.

## Yanıt biçimleri {#response-shapes}

Çekirdek ara katman ve bazı `/v1/*` uç noktaları düz bir hata döndürür:

```json
{"error":"organization rate limit exceeded"}
```

Agents platformu kaynakları (`/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*`), sabit bir `code` içeren OpenAI tarzı bir nesne döndürür. Bkz. [Agents platformu hataları](#agents-platform-errors):

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

Webhook Events API (`/events/webhooks*`), `{"code":<http status>,"message":"..."}` döndürür. Bkz. [Webhooks](/api-reference/webhooks#authentication-and-errors).

OpenAI uyumlu uç noktalar OpenAI uyumlu bir zarfı korur. `POST /v1/messages`, Anthropic uyumlu bir zarfı korur:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

Herkese açık bir işlemin kesin durum kodları ve şemaları için [OpenAPI belirtimini](/openapi.yaml) kullanın.

## HTTP durumlarını işleme {#http-status-handling}

| Durum | Genel anlamı | İstemcinin yapması gereken |
|---|---|---|
| `400` | Geçersiz girdi veya desteklenmeyen parametre | İsteği uç noktaya ve seçilen model şemasına göre düzeltin. |
| `401` | Eksik, geçersiz, iptal edilmiş veya süresi dolmuş kimlik bilgisi | Kimlik bilgisini değiştirin veya yenileyin; isteği değiştirmeden yeniden denemeyin. |
| `402` | İstek karşılanamıyor veya bir harcama limitine ulaşıldı | Yeniden denemeden önce bakiye veya anahtar limiti sorununu çözün. |
| `403` | Kimlik bilgisinin izni yok veya bir uyumluluk uç noktası harcama hatasını 403 ile eşliyor | Uç noktaya özgü zarfı inceleyin ve yetkili bir anahtar kullanın. |
| `404` | Model veya kaynak çağıran için kullanılamıyor | Güncel model kimliğini veya kaynak kimliğini doğrulayın. |
| `409` | Kaynak durumu çakışması | Yeniden denemenin güvenli olup olmadığına karar vermeden önce en güncel durumu okuyun. |
| `422` | Anlamsal olarak geçersiz kaynak girdisi | Belgelenen alan değerlerini düzeltin. |
| `429` | Organizasyon istek limiti veya video eşzamanlılık limiti | İşlemin tekrarlanması güvenliyse sınırlı geri çekilme (backoff) ve jitter ile yeniden deneyin. |
| `500`, `502`, `503`, `504` | SandBase veya üst akış hatası | Yalnızca işlemin tekrarlanması güvenliyse yeniden deneyin. |

Her uç nokta bu tablodaki tüm durumları belgelemez. İşlemin OpenAPI yanıt eşlemesi esas kaynaktır.

## Kimlik doğrulama hataları {#authentication-errors}

Belgelenen kimlik doğrulama mesajları şunlardır:

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

Kapsamı dışında kullanılan kapsamlı bir anahtar bunun yerine iç içe bir gövdeyle `403` döndürür: `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`. Agents platformu kaynakları aynı `code` değerini kendi zarflarında döndürür.

Standart uç noktalar için `Authorization: Bearer $SANDBASE_API_KEY` kullanın. `POST /v1/messages` ayrıca `x-api-key` kabul eder; protokol uyumlu Google uç noktaları kendi desteklenen anahtar başlıklarını belgeler.

İptal edilmiş bir anahtar yeniden etkinleştirilemez. Yerine yeni bir anahtar oluşturun, onu kullanan uygulamayı güncelleyin, doğrulayın ve ardından eski anahtara kalan tüm referansları kaldırın.

## Hız limitleri {#rate-limits}

`organization rate limit exceeded` (`429`), organizasyonunuzun tüm API anahtarlarınca paylaşılan, atanmış dakika başına istek limitine ulaştığı anlamına gelir. Protokol uyumlu uç noktalar bunu kendi zarflarında döndürür. Limit organizasyon başına atandığı için SandBase tek bir evrensel sayısal limit yayımlamaz.

Yanıt `Retry-After` içeriyorsa ona uyun. Aksi halde jitter ile sınırlı üstel geri çekilme kullanın. İstekleri dengeleme yöntemleri için [Hız limitleri](/guides/rate-limiting) sayfasına bakın.

Görev gönderimlerinde iki ek denetim vardır. `organization concurrency limit exceeded` (`429`), organizasyonunuzda hesap seviyesinin izin verdiği kadar görevin zaten devam ettiği anlamına gelir; çalışan bir görev bittiğinde ortadan kalkar. `POST /v1/run` ve `/v1/api/*` üzerindeki tüm model türlerine ve diğer uç noktalardaki video gönderimlerine uygulanır. `insufficient credit for estimated video cost` (`402`), tahmini maliyetin bakiyeniz ile kredi limitinizin toplamından fazla olduğu anlamına gelir; yeniden denemeden önce bakiye yükleyin. Bkz. [Eşzamanlılık limitleri](/guides/concurrency-limits).

## Yeniden deneme güvenliği {#retry-safety}

Şu karar sırasını kullanın:

1. İşlemin dışarıdan görülebilir bir etki üretip üretmediğini belirleyin.
2. Değiştirilmemiş bir `400`, `401`, `402`, `403`, `404` veya `422` isteğini yeniden denemeyin.
3. `409` için yeniden denemeden önce kaynağın güncel durumunu okuyun.
4. `429` ve geçici `5xx` yanıtlarını yalnızca az ve sınırlı sayıda yeniden deneyin.
5. Bir oluşturma, tetikleme, yükleme veya harici eylem isteğini tekrarlamadan önce işlemin idempotent olduğunu ya da uygulamanızın kopyaları uzlaştırabildiğini doğrulayın.

Uygun bir bekleme süresi şöyledir:

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

## Agents platformu hataları {#agents-platform-errors}

Agents, Sessions, Skills, MCP bağlantıları ve Secrets tek bir zarf döndürür. Çoğu kod için `message` sabit ve güvenli bir cümledir; `invalid_request` ise hangi girdi biçiminin veya seçeneğin desteklenmediği gibi kısa bir açıklama içerebilir. `message` değerine göre değil, `code` değerine göre dallanın.

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type`, 401 için `authentication_error`, 5xx için `server_error`, diğer durumlarda `invalid_request_error` olur.

| HTTP | `code` | Anlamı | Ne yapmalı |
|---|---|---|---|
| 400 | `invalid_request` | Hatalı biçimli veya bilinmeyen alanlar, başarısız doğrulama ya da desteklenmeyen bir seçenek | İsteği düzeltin; değiştirmeden yeniden denemeyin |
| 400 | `skill_not_found` | Başvurulan bir Skill veya sürüm kullanılamıyor | Agent'ın `skills` alanını düzeltin |
| 401 | `unauthorized` | Eksik, geçersiz veya çelişen API anahtarı başlıkları | `Authorization` / `X-API-Key` değerini kontrol edin |
| 402 | `spending_limit_exceeded` | Anahtar harcama limiti veya organizasyon bakiyesi tükendi | Kredi ekleyin veya limiti yükseltin |
| 403 | `insufficient_scope` | Anahtar kapsamlı ve Agents kaynaklarını kullanamıyor | Console'da oluşturulmuş standart bir anahtar kullanın |
| 403 | `org_disabled` | Organizasyonun Agents çalıştırmasına izin verilmiyor | Destek ekibiyle iletişime geçin |
| 404 | `not_found` | Kaynak organizasyonunuzda mevcut değil | Kimliği kontrol edin |
| 409 | `conflict` | Eskimiş `row_version`, değişikliğe izin vermeyen bir durum ya da farklı bir gövdeyle yeniden kullanılan `Idempotency-Key` | Kaynağı yeniden okuyun, sonra karar verin |
| 409 | `session_input_pending` | Önceki girdi hâlâ iletiliyor | Bekleyin; yeni bir anahtarla yeniden göndermeyin |
| 409 | `session_input_expired` | Girdi kabulünün süresi doldu | Yeniden göndermeden önce geçmişi inceleyin |
| 409 | `session_environment_unavailable` | Yürütme ortamı kullanılamıyor | Bekleyin veya yeni bir Session oluşturun |
| 413 | `request_too_large` | İstek gövdesi veya ondan dondurulan Session yapılandırması boyut limitini aşıyor | Daha küçük bir gövde gönderin; değiştirmeden yeniden denemeyin |
| 429 | `quota_exceeded` | Agents kotası aşıldı | Daha sonra yeniden deneyin |
| 502 | `executor_rejected`, `executor_contract_error` | Yürütme katmanı isteği reddetti veya beklenmedik bir yanıt verdi | Agent yapılandırmasını kontrol edin, sonra yeniden deneyin |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | Bir bağımlılık geçici olarak kullanılamıyor | Geri çekilmeyle ve aynı `Idempotency-Key` ile yeniden deneyin |

`skill_runtime_incompatible` de görünebilir; `internal error` mesajıyla 503 olarak döndürülür.

## Akış hataları {#streaming-failures}

Bir akış başladıktan sonra hata, yeni bir HTTP yanıtı yerine ilgili protokolün akış biçiminde gelebilir. Akışı eksik kabul edin, uygulamanızın ihtiyaç duyduğu kısmi çıktıyı saklayın ve yalnızca isteği yeniden üretmek güvenliyse yeniden deneyin. Her sağlayıcının aynı son olayı veya bitiş nedenini gönderdiğini varsaymayın.

## Operasyonel hata ayıklama {#operational-debugging}

Uç noktayı, HTTP durumunu, seçilen model veya kaynak kimliğini, zaman damgasını ve sunucunun döndürdüğü güvenli istek tanımlayıcılarını kaydedin. Yetkilendirme başlıklarını, API anahtarlarını, kimlik bilgisi değerlerini veya hassas istem içeriğini asla günlüğe yazmayın.

Organizasyonun istek geçmişini incelemek için [Developer → Activities](https://www.sandbase.ai/console/activities) sayfasını kullanın. Kalıcı bir hatayı bildirirken arındırılmış istek meta verilerini ve hatayı yeniden üreten en küçük isteği ekleyin.

## Ayrıca bakın {#see-also}

- [Kimlik doğrulama](/api-reference/authentication)
- [Hatalar ve yeniden denemeler](/guides/error-handling)
- [Hız limitleri](/guides/rate-limiting)
- [Yapay zekâ tarafından okunabilir hata kılavuzu](/for-agents/errors)
