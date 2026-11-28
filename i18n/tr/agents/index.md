---
i18nSource: 7b24f4b0b5cd2c33
title: Build Agent
description: Yeniden kullanılabilir, sürümlenmiş Agent'ları SandBase Session'larında tanımlayın, test edin ve çalıştırın.
---

# Build Agent {#build-agent}

Build Agent, bir Agent'ı tanımlayıp test ettiğiniz ve ardından nasıl çalışacağına karar verdiğiniz yerdir.

Agent, kaydedilmiş ve sürümlenmiş bir yapılandırmadır: bir Model, talimatlar, bir çalışma ortamı profili, Skills ve harici araçlara MCP bağlantıları. Bir Agent'ı kaydetmek onu çalıştırmaz.

## Agent nedir {#what-an-agent-is}

| Soru | Nerede tanımlanır |
|---|---|
| Ne yapmalı? | `instructions` |
| İşi hangi model yapar? | `model`, [Models API](/api-reference/models/) üzerinden alınan bir model kimliği |
| Neleri yapmayı bilir? | [Skills](/agents/mcp-tools#skills), sürümlenmiş talimat paketleri |
| Hangi harici araçları çağırabilir? | [MCP bağlantıları](/agents/mcp-tools#mcp-connections); sunucu token gerektiriyorsa [kimlik bilgileriyle](/agents/api-credentials) |
| Nasıl çalışır? | Bir [Session](/agents/sessions) içinde |

Etkili olan her değişiklik yeni ve değiştirilemez bir sürüm oluşturur. Sürümleri listeleyebilir ve istediğiniz zaman önceki bir sürümü geri yükleyebilirsiniz.

## Agent nasıl çalışır {#how-an-agent-runs}

Bir Agent'ı bir [Session](/agents/sessions) içinde çalıştırırsınız. Session, girdi gönderdiğiniz ve olayları stream ettiğiniz bir `ses_` kaynağıdır; etkileşimli bir konuşma, bir test çalıştırması veya uygulamanızdan gelen bir çağrı için kullanılabilir. Her Session başladığı Agent sürümünü dondurur; böylece mevcut Session'ları değiştirmeden Agent'ı düzenlemeye devam edebilirsiniz.

## Agent yaşam döngüsü: Taslak → Session'da test → Uygulamanızdan çalıştırma → Session'ları inceleme {#agent-lifecycle-draft-→-test-in-a-session-→-run-from-your-app-→-inspect-sessions}

### 1. Taslak {#_1-draft}

Console'da **Build → Agents** altında veya [`POST /v1/agents`](/agents/agent-api) ile bir Agent oluşturun. İşe yarayan en küçük iş akışıyla başlayın; Skills ve MCP bağlantılarını yalnızca talimatlar bunlara ihtiyaç duyduğunda ekleyin.

### 2. Session'da test {#_2-test-in-a-session}

Agent için bir Session oluşturun, temsili bir girdi gönderin ve çıktıyı, araç etkinliğini ve hataları okuyun. Yalnızca sorunsuz senaryoyu değil; eksik girdiyi, kullanılamayan araçları, boş sonuçları ve çıktı biçimi gereksinimlerini de test edin.

### 3. Uygulamanızdan çalıştırma {#_3-run-from-your-app}

Test edilmiş Agent için uygulamanızdan [Sessions API](/api-reference/sessions/) ile Session'lar oluşturun.

### 4. Session'ları inceleme {#_4-inspect-sessions}

Konuşmanın tamamını, araç etkinliğini ve hataları incelemek için Sessions API ile her Session'ın item'larını ve turn'lerini okuyun.

## Production kontrol listesi {#production-checklist}

- `model`, Models API'den alınan güncel bir model kimliği kullanır.
- Davranışın sessizce değişmemesi gereken durumlarda Skills bir sürüme sabitlenir.
- MCP bağlantıları `allowed_tools` kullanarak yalnızca Agent'ın ihtiyaç duyduğu araçları sunar.
- Token'lar [Secret](/agents/api-credentials) olarak saklanır; talimatlara, girdiye veya metadata'ya asla yazılmaz.
- Session oluşturma isteği bir `Idempotency-Key` gönderir ve yeniden denemeler aynı anahtarı kullanır.
- Başlatmadan sonra Session durumu ve hatalar kontrol edilir.

## Katalog Agent'ları {#catalog-agents}

Herkese açık [Agent kataloğu](/api-reference/agents/catalog), SandBase tarafından yayımlanan Agent'ları listeler. Bir katalog Agent'ını okuyabilirsiniz; ancak değiştirmek için önce `POST /v1/agents/catalog/{agent_id}/clone` ile kuruluşunuza klonlamanız gerekir. Klon, sahibi olduğunuz ve çalıştırabileceğiniz yeni bir özel Agent'tır.

::: tip OpenAI SDK kullanımı
Agents, Sessions ve Skills, OpenAI Agents API'sini izler; bu nedenle resmi OpenAI SDK `base_url="https://api.sandbase.ai/v1"` ile çalışır. Doğrulanmış örnekler ve farklar için [OpenAI uyumluluğu](/agents/openai-compatibility) sayfasına bakın.
:::

## Sonraki adımlar {#next-steps}

- [Agent tanımlama](/agents/agent-api)
- [OpenAI uyumluluğu](/agents/openai-compatibility)
- [Skills ve MCP araçları](/agents/mcp-tools)
- [Sessions](/agents/sessions)
