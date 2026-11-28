---
i18nSource: c063864501452a7b
title: SandBase Belgeleri
description: Models ve API'lerle doğrudan geliştirin ya da yönetilen altyapıda çalışan yeniden kullanılabilir Agent'lar tanımlayın.
---

# SandBase Belgeleri {#sandbase-docs}

Models ve API'lerle doğrudan geliştirin ya da yönetilen altyapıda çalışan yeniden kullanılabilir Agent'lar tanımlayın.

SandBase, yapay zekâ uygulamaları geliştirmek için birbirini tamamlayan iki yol sunar. İşe uyan en küçük yüzeyle başlayın; uygulama büyüdükçe ikisini birleştirebilirsiniz.

## Nasıl geliştireceğinizi seçin {#choose-how-to-build}

| | Models ve API'ler | Yönetilen Agents |
|---|---|---|
| **Nedir** | Dil, görüntü, video, ses ve üçüncü taraf API'lere doğrudan erişim | SandBase tarafından yürütülen, yeniden kullanılabilir ve sürümlenmiş Agent yapılandırmaları |
| **En uygun kullanım** | Özel uygulama döngüleri ve ayrıntılı istek denetimi | Çok adımlı, asenkron veya tekrarlanabilir işler |
| **Sizin yönettikleriniz** | Prompt'lar, orkestrasyon, yeniden denemeler ve uygulama durumu | Agent tanımı, etkin yetenekler, girdiler ve teslim davranışı |
| **Buradan başlayın** | [Models ve API'ler](https://www.sandbase.ai/models) | [Build Agent](/agents/) |

::: tip Tek SandBase API anahtarı
Aynı API anahtarı Models, API'ler ve Agents çağırabilir. Anahtarları sunucuda tutun ve asla tarayıcı kodunda açığa çıkarmayın.
:::

## Temel kavramlar {#core-concepts}

### Models ve API'ler {#models-and-apis}

Dil, görüntü, video ve ses iş yükleri için Models kullanın. Uygulamanın harici verilere veya eylemlere ihtiyacı olduğunda API'leri kullanın. SandBase web sitesindeki katalog; mevcut yetenekleri, fiyatlandırmayı, girdi şemalarını ve çalışan örnekleri gösterir.

- [Modellere göz atın](https://www.sandbase.ai/models)
- [API'lere göz atın](https://www.sandbase.ai/apis)
- [İlk API çağrınızı yapın](/getting-started/first-call)
- [API Referansını açın](/api-reference/)

### Agents {#agents}

Agent; bir Model, talimatlar, Skills ve MCP bağlantıları içeren, yeniden kullanılabilir ve sürümlenmiş bir yapılandırmadır. Bir kez tanımlayın, ardından Sessions içinde çalıştırın.

- [Agents'ı anlayın](/agents/)
- [Bir Agent tanımlayın](/agents/agent-api)
- [Skills ve MCP araçları ekleyin](/agents/mcp-tools)

### Sessions {#sessions}
Bir Session tek bir Agent sürümünü çalıştırır. `POST /v1/agents/sessions` ile oluşturun, girdi gönderin, olayları akış olarak alın ve ardından konuşmanın tamamını okuyun.

- [Sessions kılavuzu](/agents/sessions)
- [Sessions API](/api-reference/sessions/)

## İlk adımlar {#first-steps}

1. Bir organizasyon ve [API anahtarı](/getting-started/api-keys) oluşturun.
2. [Katalogdan](https://www.sandbase.ai/models) bir Model, API veya Agent seçin.
3. Doğrudan bir istek yapın veya bir Agent tanımlayıp test edin.
4. Test edilen Agent'ı uygulamanızdan Sessions içinde çalıştırın.
5. Sessions, hatalar, gecikme ve maliyeti Console'da inceleyin.

## Operasyonel kılavuzlar {#operational-guidance}

- [Akış yanıtları](/guides/streaming)
- [Hata yönetimi ve yeniden denemeler](/guides/error-handling)
- [Hız sınırlama](/guides/rate-limiting)
- [Faturalandırma ve fiyatlandırma](/guides/billing)
- [Çalışma alanı yönetimi](/admin/)

## Sonraki adımlar {#next-steps}

- Yerel Skills ile üretim: [Skill eğitimleri](/guides/skills/)

- SandBase'de yeniyseniz: [Başlarken](/getting-started/)
- Bir Model veya API çağırma: [Models kataloğu](https://www.sandbase.ai/models) ve [API kataloğu](https://www.sandbase.ai/apis)
- Çıkarım ve Agent API'leri: [API Referansı](/api-reference/)
- Yeniden kullanılabilir işler geliştirme: [Build Agent](/agents/)
- Bir yapay zekâ aracını bağlama: [Setup](/setup/)
