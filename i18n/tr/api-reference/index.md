---
i18nSource: 071e97a48f9c4f4c
title: API Referansı
description: SandBase modellerini çağırın; Agents, Sessions, Skills, MCP bağlantıları, Secrets ve hesap kaynaklarını yönetin.
---

# API Referansı {#api-reference}

API'yi modelleri doğrudan çağırmak veya yeniden kullanılabilir Agents tanımlayıp bunları Sessions içinde çalıştırmak ve Skills ile MCP araçlarına bağlamak için kullanın.

::: tip Model çıkarımı mı arıyorsunuz?
Çıkarım sözleşmeleri (Chat Completions, Responses, Anthropic Messages, Gemini, Images ve Seedance video) bu referansın **Model inference** bölümündedir. Her modelin kendine özgü alanları ve fiyatlandırması, [Models kataloğundaki](https://www.sandbase.ai/models) sayfasında yer alır.
:::

## Bir başlangıç noktası seçin {#choose-a-starting-point}

| Hedef | Başlangıç | Sonrasında ne olur |
|---|---|---|
| Yeniden kullanılabilir davranış tanımlama | [Agents](/api-reference/agents/) | Bir Agent yapılandırması oluşturup sürümlersiniz |
| Bir Agent'ı doğrudan çalıştırma | [Sessions](/api-reference/sessions/) | Girdi gönderir, olayları akışla alır ve geçmişi okursunuz |
| Talimat paketlerini yeniden kullanma | [Skills](/api-reference/skills/) | Sürümlü ZIP paketleri yükleyip Agents'a eklersiniz |
| Harici araçları çağırma | [MCP Connections](/api-reference/mcp-connections/) | Agents için uzak HTTPS MCP sunucularını kaydedersiniz |
| Harici araçlarda kimlik doğrulama | [Secrets](/agents/api-credentials#with-the-api) | MCP bağlantıları için yalnızca yazılabilir Bearer belirteçleri saklarsınız |

## Kaynak yaşam döngüsü {#resource-lifecycle}

```text
Agent + version ─── direct ──→ Session ─→ events, items, turns
Agent ─ skills[] → Skill version      Agent ─ mcp_connections[] → MCP connection ─ secret_id → Secret
```

- **Agent** (`agt_`), kayıtlı ve sürümlü bir yapılandırmadır; oluşturulması onu çalıştırmaz.
- **Session** (`ses_`), bir Agent sürümünü çalıştırır ve onun Skills ile MCP bağlantılarını dondurur. Session yolları `/v1/agents/sessions` altındadır.
- **Skill** (`skl_`), sürümlü bir talimat paketidir. **MCP bağlantısı** (`mcp_`) uzak bir araç sunucusunu kaydeder; **Secret** (`sec_`) ise onun Bearer belirtecini saklar.

## Agents platformu kaynakları için kurallar {#conventions-for-agents-platform-resources}

Agents, Sessions, Skills, MCP bağlantıları ve Secrets, `https://api.sandbase.ai/v1` altında sunulur ve şu kuralları paylaşır:

- `Authorization: Bearer` veya `X-API-Key` ile kimlik doğrulayın. Bkz. [Kimlik doğrulama](/api-reference/authentication#agents-platform-resources).
- İstek gövdeleri en fazla 1 MiB boyutunda katı JSON'dur; bilinmeyen alanlar 400 döndürür.
- MCP bağlantısı veya Secret oluşturan yazma işlemleri `Idempotency-Key` gerektirir. Diğer yazma işlemleri bunu isteğe bağlı olarak kabul eder.
- İyimser eşzamanlılık `row_version` kullanır: en son okuduğunuz değeri gönderin ve 409 aldığınızda yeniden okuyun.
- Agents, Sessions, öğeler, turlar ve Skills imleç tabanlı sayfalama kullanır (`limit`, `after`, `order`; yanıtlarda `has_more` ve `last_id` bulunur). Agent sürümleri, ekler, MCP bağlantıları ve Secrets ofset tabanlı sayfalama kullanır (`limit`, `offset`; yanıtlarda `total` bulunur).
- Hatalar `{"error": {"type", "code", "param", "message"}}` biçimini kullanır. Bkz. [Agents platformu hataları](/api-reference/errors#agents-platform-errors).

## Kimlik doğrulama {#authentication}

SandBase API anahtarını Bearer belirteci olarak gönderin:

```http
Authorization: Bearer sk-YOUR_KEY
```

Anahtarı opak bir gizli değer olarak ele alın, sunucuda tutun ve asla tarayıcı koduna veya günlüklere eklemeyin. Uyumluluk ayrıntıları için [Kimlik doğrulama](/api-reference/authentication), herkese açık hata zarfları için [Hatalar](/api-reference/errors) sayfasına bakın.

## Organizasyon ve kullanım {#organization-and-usage}

Platform kaynakları, API anahtarıyla ilişkili organizasyona aittir. Desteklenen bakiye ve son yürütme geçmişi görünümlerini incelemek için [Account API](/api-reference/account/) kullanın. Burada herkese açık bir uç nokta belgelenmedikçe organizasyon yönetimi ve faturalandırma yönetimi Console üzerinden yapılır.

## Referans biçimleri {#reference-formats}

- Örnekler ve yanıt ayrıntıları için işlemlere kenar çubuğundan göz atın.
- Makine tarafından okunabilir [OpenAPI belirtimini](/openapi.yaml) indirin.
- Kesin istek alanları için bir modelin [Models kataloğundaki](https://www.sandbase.ai/models) veya bir API'nin [APIs kataloğundaki](https://www.sandbase.ai/apis) sayfasını açın.

## Sonraki adımlar {#next-steps}

- Yönetilen Agents'ta yeniyseniz: [Agent Oluşturma](/agents/)
- Bir modeli doğrudan çağırın: [Chat Completions](/api-reference/llm-gateway) veya [Models kataloğu](https://www.sandbase.ai/models)
