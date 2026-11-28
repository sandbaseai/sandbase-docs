---
i18nSource: 0314b37a870481ae
title: Yapay zekâ tarafından okunabilir dokümantasyon
description: Bir yapay zekâ agent'ının SandBase API'sini keşfetmek ve kullanmak için ihtiyaç duyduğu her şey; tek sayfalık özet.
---

# Yapay zekâ dostu API'ye genel bakış {#ai-friendly-api-overview}

::: info Session sözleşmesi
Bir Session (`ses_*`), kayıtlı bir Agent sürümünü çalıştırır; onu doğrudan `POST /v1/agents/sessions` ile oluşturun. Çalışma zamanı örnekleri dahili kalır ve hiçbir zaman döndürülmez.
:::

> Hem insanlar hem de yapay zekâ agent'ları için kısa bir referans. LLM tarafından işlenmek üzere optimize edilmiş düz metin sürümleri için [`llms.txt`](https://www.sandbase.ai/docs/llms.txt) dosyasına bakın.

## SandBase nedir? {#what-is-sandbase}

SandBase, bir yapay zekâ agent altyapı platformudur. Tek bir API anahtarı; dil, görüntü, video, ses, arama ve veri alanlarındaki etkin Models ve API'lere ve ayrıca Agent iş akışlarına erişebilir. Sabit bir sayıya güvenmek yerine güncel kataloğu keşfedin.

## API temel URL'si {#api-base-url}

```
https://api.sandbase.ai/v1
```

## Kimlik doğrulama {#authentication}

Tüm istekler bir Bearer token gerektirir:

```
Authorization: Bearer sk-YOUR_KEY
```

Anahtarınızı [Developer → API Keys](https://www.sandbase.ai/console/keys) sayfasından alın.

## Hızlı örnek {#quick-example}

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## Temel API'ler {#core-apis}

| Yöntem | Rota | Açıklama |
|--------|----------|-------------|
| `POST` | `/v1/chat/completions` | OpenAI uyumlu sohbet; isteğe bağlı yetenekler seçilen modele bağlıdır |
| `POST` | `/v1/messages` | Anthropic uyumlu mesajlar API'si |
| `POST` | `/v1/run` | Modele özgü şemasını kullanarak bir model üretimi gönderme |
| `GET` | `/v1/run/{id}` | Eşzamansız üretim durumunu yoklama ve sonuçları alma |
| `GET` | `/v1/models` | Etkin mantıksal modelleri listeleme; varsayılan tür LLM'dir |
| `GET` | `/v1/models/{id_or_name}` | Model ayrıntılarını, şemasını, yeteneklerini ve fiyatlandırmasını alma |
| `GET` | `/v1/tasks/{task_id}/cost` | Görev maliyetini ve kullanımını alma |

## Ek API grupları {#additional-api-groups}

SandBase, temel üretim API'lerinin ötesinde agent yaşam döngüsü yönetimi için API'ler sunar. Yaygın iş akışları için [Yapay zekâ API kılavuzuna](./full), sözleşmenin tamamı için [OpenAPI belirtimine](https://www.sandbase.ai/docs/openapi.yaml) bakın.

| Grup | Temel rotalar | Amaç |
|-------|---------------|---------|
| **Agents** | `POST /v1/agents`, `GET /v1/agents`, `POST /v1/agents/{agent_id}` | Kayıtlı Agent tanımlarını oluşturma ve sürümleme |
| **Sessions** | `POST /v1/agents/sessions`, `POST /v1/agents/sessions/{session_id}/events`, `GET /v1/agents/sessions/{session_id}/events` | Bir Agent'ı çalıştırma, girdi gönderme ve canlı olayları akış halinde alma |
| **Skills** | `POST /v1/skills`, `GET /v1/skills` | Agent'ların bağladığı sürümlü talimat paketleri |
| **MCP Connections ve Secrets** | `POST /v1/mcp-connections`, `POST /v1/secrets` | Uzak HTTPS MCP araçları ve bunların yalnızca yazılabilir Bearer token'ları |

Agents platformu kaynakları `Authorization: Bearer` veya `X-API-Key` kabul eder ve hata durumunda `{"error":{"type","code","param","message"}}` döndürür.

## Fiyatlandırma modeli {#pricing-model}

Kullandıkça ödersiniz. Fiyatlandırma modele özgüdür ve bu sayfadan bağımsız olarak değişebilir:

- **Model fiyatlandırması**: seçilen modelin güncel formülünü ve birimlerini `model_card` alanından okuyun
- **Token fiyatlandırması**: model tarafından belirtildiğinde girdi, çıktı, önbellek veya akıl yürütme bileşenlerini içerebilir
- **Medya ve diğer işlemler**: istek başına, süre, çözünürlük veya modele özgü diğer birimleri kullanabilir
- **Veri API'leri** (arama, sosyal medya, kazıma, e-ticaret, finans): her kuruluş, uygun veri API'leri arasında paylaşılan, UTC günü başına 100 ücretsiz çağrı alır; bundan sonra çağrılar engellenmez, çağrı başına faturalandırılır. MCP'de uygun araçlar `sandbase_inspect` içinde `pricing.free_quota` gösterir ve `sandbase_account`, `free_api_quota` (`daily_limit`, `used_today`, `remaining`, `resets_at`) döndürür. Bkz. [Günlük ücretsiz API çağrıları](/guides/billing#daily-free-api-calls).

Güncel model kimliğini `GET /v1/models` ile keşfedin, ardından istek göndermeden önce `GET /v1/models/{id_or_name}` ile inceleyin. Fiyatlandırmanın veya önbellek indirimlerinin sağlayıcılar arasında ortak olduğunu varsaymayın.

Bir işlem görev kimliği döndürdüğünde kaydedilen maliyetini inceleyin:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

## Hız sınırları {#rate-limits}

Yayımlanmış evrensel bir sayısal varsayılan yoktur. İstekler, kuruluşunuza atanmış ve tüm API anahtarlarınızca paylaşılan isteğe bağlı bir
dakika başına istek sınırına tabidir. Bir `429` yanıtı kota veya `Retry-After` başlıkları içermez; jitter ile sınırlı
üstel geri çekilme kullanın. Bkz. [Hata kılavuzu](./errors).

---

## Ek okumalar {#further-reading}

- [Yapay zekâ API kılavuzu](./full) — temel iş akışları, istek/yanıt yapıları ve curl örnekleri
- [Modeller ve fiyatlandırma](./models) — canlı model keşfi, fiyatlandırma ve yetenek rehberliği
- [Hata kılavuzu](./errors) — belgelenmiş yanıt yapıları, HTTP işleme ve yeniden deneme güvenliği
- [OpenAPI belirtimi](https://www.sandbase.ai/docs/openapi.yaml) — makine tarafından okunabilir OpenAPI 3.1

## Düz metin sürümleri (yapay zekâ agent'ları için) {#plain-text-versions-for-ai-agents}

| Dosya | URL | İçerik |
|------|-----|---------|
| `llms.txt` | [/docs/llms.txt](https://www.sandbase.ai/docs/llms.txt) | Kısa özet (~60 satır) |
| `llms-full.txt` | [/docs/llms-full.txt](https://www.sandbase.ai/docs/llms-full.txt) | Yapay zekâya yönelik genişletilmiş API kılavuzu |
| `openapi.yaml` | [/docs/openapi.yaml](https://www.sandbase.ai/docs/openapi.yaml) | Makine tarafından okunabilir OpenAPI 3.1 belirtimi |
