---
i18nSource: 95410ff7ea741f64
title: Yapay Zekâ Tarafından Okunabilir Hata Kılavuzu
description: SandBase API hatalarını uç nokta ailesine, HTTP durumuna, yeniden deneme güvenliğine ve belgelenmiş yanıt yapısına göre ele alın.
---

# Yapay zekâ istemcileri için hata yönetimi {#error-handling-for-ai-clients}

SandBase tek bir evrensel hata şeması sunmaz. Önce HTTP durumuna göre dallanın, ardından uç nokta ailesi için belgelenen
yanıt yapısını ayrıştırın. Her yanıtın `code`, `param`, `request_id` veya belirli bir mesaj dizesi içerdiğini
varsaymayın.

## Herkese açık yanıt yapıları {#public-response-shapes}

Temel `/v1/*` ara katmanı ve bazı model veya kaynak uç noktaları düz bir hata döndürür:

```json
{"error":"organization rate limit exceeded"}
```

Agents platformu kaynakları (`/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`,
`/v1/skills*`) sabit bir `code` içeren OpenAI tarzı bir nesne döndürür. [Agents platformu hataları](#agents-platform-errors) bölümüne bakın:

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

OpenAI uyumlu ağ geçitleri OpenAI uyumlu bir zarfı korur. `POST /v1/messages`
Anthropic uyumlu zarfı korur:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

## HTTP durumlarını ele alma {#http-status-handling}

| Durum | Anlamı | İstemci eylemi |
|---|---|---|
| `400` | Geçersiz girdi veya desteklenmeyen parametre | İsteği seçilen uç noktanın ve modelin şemasına göre düzeltin. |
| `401` | Eksik, geçersiz, iptal edilmiş veya süresi dolmuş kimlik bilgisi | Kimlik bilgisini değiştirin veya yenileyin; değiştirmeden yeniden denemeyin. |
| `402` | İstek karşılanamıyor veya bir harcama limitine ulaşıldı | Yeniden denemeden önce faturalandırma veya anahtar limitlerini çözün. |
| `403` | Kimlik bilgisinin izni yok veya bir uyumluluk yüzeyi harcama hatasını 403'e eşliyor | Belgelenmiş zarfı inceleyin ve yetkili bir anahtar kullanın. |
| `404` | Model veya kaynak bulunamadı | Güncel model adını veya kaynak kimliğini doğrulayın. |
| `409` | Kaynak durumu çakışması | Yeniden denemenin güvenli olup olmadığına karar vermeden önce kaynağın en son durumunu okuyun. |
| `429` | Organizasyon istek limiti veya video eşzamanlılık limiti | Sınırlı üstel geri çekilme ve jitter ile yeniden deneyin. |
| `500`, `502`, `503`, `504` | SandBase'de veya upstream'de geçici hata | Yalnızca işlemin tekrarlanması güvenliyse yeniden deneyin. |

## Kimlik doğrulama ve hız limiti mesajları {#authentication-and-rate-limit-messages}

Belgelenmiş kimlik doğrulama mesajları şunlardır:

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

Kapsamı dışında kullanılan kapsamlı bir anahtar bunun yerine iç içe bir gövdeyle `403` döndürür: `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`. Agents platformu kaynakları aynı `code` değerini kendi zarflarında döndürür.

Belgelenmiş hız limiti mesajı `organization rate limit exceeded` şeklindedir (organizasyonun tüm API anahtarlarınca paylaşılan,
organizasyona atanmış dakika başına istek limiti). Bir `429` yanıtı şu anda `Retry-After` veya
`X-RateLimit-*` başlıkları içermez ve yayımlanmış evrensel bir RPM veya eşzamanlılık varsayılanı yoktur.

## Model ve kaynak sorgulama {#model-and-resource-lookup}

Etkin model kimliklerini keşfetmek için `GET /v1/models`, yürütmeden önce bir modeli incelemek için `GET /v1/models/{id_or_name}`
kullanın. Bir kaynak kimliğini opak olarak ele alın ve ilgili list veya get işlemiyle doğrulayın. Bir kimlik önekinden
farklı bir sorgulama URL'si oluşturmayın.

## Yeniden deneme algoritması {#retry-algorithm}

Jitter ile sınırlı üstel geri çekilme kullanın:

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

Şu kuralları uygulayın:

- `429` yanıtını istemci tarafından hesaplanan bir gecikmeden sonra yeniden deneyin;
- geçici `5xx` yanıtlarını yalnızca az ve sınırlı sayıda yeniden deneyin;
- değiştirilmemiş bir `400`, `401`, `402`, `403` veya `404` isteğini yeniden denemeyin;
- herhangi bir oluşturma, tetikleme veya harici eylem isteğini tekrarlamadan önce idempotency'yi kontrol edin;
- bir akış başarısız olduğunda kısmi çıktıyı koruyun ve devam etmenin mi yoksa yeniden başlatmanın mı güvenli olduğuna karar verin;
- son HTTP durumunu ve temizlenmiş, uç noktaya özgü hatayı çağırana iletin.

## Agents platformu hataları {#agents-platform-errors}

Agents, Sessions, Skills, MCP bağlantıları ve Secrets tek bir zarf döndürür. Çoğu kod için `message` sabit ve güvenli bir cümledir; `invalid_request` ise hangi girdi yapısının veya seçeneğin desteklenmediği gibi kısa bir açıklama taşıyabilir. `message` değerine göre değil, `code` değerine göre dallanın.

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type`, 401 için `authentication_error`, 5xx için `server_error`, diğer durumlarda `invalid_request_error` olur.

| HTTP | `code` | Anlamı | Ne yapılmalı |
|---|---|---|---|
| 400 | `invalid_request` | Hatalı biçimlendirilmiş veya bilinmeyen alanlar, başarısız doğrulama ya da desteklenmeyen bir seçenek | İsteği düzeltin; değiştirmeden yeniden denemeyin |
| 400 | `skill_not_found` | Başvurulan bir Skill veya sürüm kullanılamıyor | Agent'ın `skills` alanını düzeltin |
| 401 | `unauthorized` | Eksik, geçersiz veya çakışan API anahtarı başlıkları | `Authorization` / `X-API-Key` başlıklarını kontrol edin |
| 402 | `spending_limit_exceeded` | Anahtar harcama limiti veya organizasyon bakiyesi tükendi | Kredi ekleyin veya limiti yükseltin |
| 403 | `insufficient_scope` | Anahtar kapsamlıdır ve Agents kaynaklarını kullanamaz | Console'da oluşturulmuş standart bir anahtar kullanın |
| 403 | `org_disabled` | Organizasyonun Agents çalıştırma izni yok | Destek ekibiyle iletişime geçin |
| 404 | `not_found` | Kaynak organizasyonunuzda mevcut değil | Kimliği kontrol edin |
| 409 | `conflict` | Güncel olmayan `row_version`, değişikliğe izin vermeyen bir durum veya farklı bir gövdeyle yeniden kullanılan bir `Idempotency-Key` | Kaynağı yeniden okuyun, sonra karar verin |
| 409 | `session_input_pending` | Önceki girdi hâlâ iletiliyor | Bekleyin; yeni bir anahtarla yeniden göndermeyin |
| 409 | `session_input_expired` | Girdi kabulünün süresi doldu | Yeniden göndermeden önce geçmişi inceleyin |
| 409 | `session_environment_unavailable` | Yürütme ortamı kullanılamıyor | Bekleyin veya yeni bir Session oluşturun |
| 413 | `request_too_large` | İstek gövdesi veya ondan sabitlenen Session yapılandırması boyut limitini aşıyor | Daha küçük bir gövde gönderin; değiştirmeden yeniden denemeyin |
| 429 | `quota_exceeded` | Agents kotası aşıldı | Daha sonra yeniden deneyin |
| 502 | `executor_rejected`, `executor_contract_error` | Yürütme katmanı isteği reddetti veya beklenmedik şekilde yanıt verdi | Agent yapılandırmasını kontrol edin, ardından yeniden deneyin |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | Bir bağımlılık geçici olarak kullanılamıyor | Geri çekilme ve aynı `Idempotency-Key` ile yeniden deneyin |

`skill_runtime_incompatible` de görünebilir; `internal error` mesajıyla 503 olarak döndürülür.

## Akış hataları {#streaming-failures}

Bir akış yanıtı başladıktan sonra hata, yeni bir HTTP durumu yerine protokolün akış biçiminde gelebilir. Akışı
eksik olarak kabul edin, kapatın, uygulamanın ihtiyaç duyduğu kısmi içeriği koruyun ve yalnızca isteğin tekrarlanması
güvenliyse yeniden deneyin.

## Ayrıca bakın {#see-also}

- [Hata Kodları](/api-reference/errors) — herkese açık yanıt biçimleri ve yaygın HTTP durumları
- [Hız limitleri](/guides/rate-limiting) — 429 yönetimi ve isteklerin yumuşatılması
- [Hatalar ve yeniden denemeler](/guides/error-handling) — uygulama kalıpları
- [Kimlik doğrulama](/api-reference/authentication) — desteklenen kimlik bilgileri ve anahtar yaşam döngüsü
