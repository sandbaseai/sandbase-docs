---
i18nSource: a86346e2696c732c
title: SSS
description: Yapay zekâ araçlarını bağlama, SandBase kataloğu, Models, API'ler, Agents, Sessions ve faturalandırma hakkında sık sorulan sorular.
---

# Sık sorulan sorular {#frequently-asked-questions}

## SandBase nedir? {#what-is-sandbase}

SandBase, Agent'ların gerçek dünyaya bağlanmasına yardımcı olur.

Hazır Models ve API'leri kullanabilir, AI tools'ta bağladıktan sonra bunları yapay zekâ araçlarınızdan kullanabilir veya yeniden kullanılabilir Agent'lar oluşturup Session'larda çalıştırabilirsiniz.

## SandBase kimler için? {#who-is-sandbase-for}

SandBase başlıca üç grup içindir:

- Codex, Claude, Cursor veya Kiro içinde kullanışlı yetenekler isteyen **yapay zekâ aracı kullanıcıları**
- Models ve API'leri doğrudan çağırmak isteyen **geliştiriciler**
- Müşteriler veya şirket içi iş akışları için yeniden kullanılabilir Agent'lar oluşturan **FDE'ler ve ekipler**

## Yeteneklere nereden göz atabilirim? {#where-do-i-browse-capabilities}
SandBase web sitesi yetenek kataloğunu listeler:

- [Models](https://www.sandbase.ai/models) ve [görüntü ve video modelleri](https://www.sandbase.ai/models/image-video)
- [API'ler](https://www.sandbase.ai/apis)
- [Agents](https://www.sandbase.ai/agents)
- [Skills](https://www.sandbase.ai/skills)
Yeteneğin türüne bağlı olarak inceleyebilir, test edebilir, kurabilir, çağırabilir veya klonlayabilirsiniz.

## AI tools nedir? {#what-is-ai-tools}

Console'daki **Build → AI tools**, SandBase'i Claude Code, Codex, Cursor veya Kiro gibi zaten kullandığınız yapay zekâ aracına bağlar. Agent'ınıza `set up https://www.sandbase.ai/SKILL.md` yapıştırın veya `npx -y @sandbaseai/cli@latest connect` komutunu çalıştırın. Bağlanan araç, SandBase'in Models ve API kataloğunda arama yapabilir ve bunları çalıştırabilir; ücretler çalışma alanınıza yansıtılır. Bkz. [AI tools bağlama](/setup/).

## Build Agent nedir? {#what-is-build-agent}

Build Agent, bir Agent'ı tanımladığınız ve test ettiğiniz yerdir.

Bir Agent; talimatları, bir Model'i, Skills'i ve MCP araçlarını yeniden kullanılabilir, sürümlü tek bir iş akışında birleştirir.

## Agent, API'den farklı mıdır? {#is-an-agent-different-from-an-api}
Evet. Agent, düzenleyip test ettiğiniz sürümlü bir yapılandırmadır ve onu bir Session oluşturarak çalıştırırsınız. Siz Agent'ı düzenlemeye devam ederken uygulamanız [Sessions API](/api-reference/sessions/) ile Session oluşturabilir.

## Session nedir? {#what-are-sessions}
Session, konuşması, araç etkinliği ve çıktısıyla birlikte tek bir Agent yürütmesidir.

## Bir Agent'a harici API'lere nasıl erişim veririm? {#how-do-i-give-an-agent-access-to-external-apis}

Harici sistemi bir MCP sunucusu olarak bağlayın ve Agent'ın MCP bağlantılarına ekleyin. Sunucu bir Bearer token gerektiriyorsa, token'ı [Secrets API](/agents/api-credentials#with-the-api) ile o sunucu URL'sine bağlı, yalnızca yazılabilir bir Secret olarak saklayın. Token'lar yalnızca o sunucuya gönderilir ve hiçbir zaman istemlerde veya Agent çalışma zamanında görünmez. Bkz. [MCP araçları için kimlik bilgileri](/agents/api-credentials).

## Models nerede bulunur? {#where-do-models-live}

Models, önemli yapı taşları olduğu için kendi [kataloglarına](https://www.sandbase.ai/models) sahiptir.

Bir Model'i doğrudan çağırabilir, bağlı bir yapay zekâ aracından kullanabilir veya bir Agent içinde kullanabilirsiniz.

## Kod yazmam gerekir mi? {#do-i-need-to-write-code}

Her zaman değil.

Kod yazmadan yapay zekâ aracınızın içinde yetenekler istiyorsanız [aracınızı bağlayın](/setup/).

SandBase'i uygulamanızdan çağırmak istiyorsanız API Reference'ı kullanın.

Yeniden kullanılabilir çok adımlı işler istiyorsanız Build Agent'ı kullanın.

## API anahtarını nasıl alırım? {#how-do-i-get-an-api-key}

Console'u açın, **Developer → API Keys** bölümüne gidin ve **New key** seçeneğini seçin.

Anahtarı şu şekilde kullanın:

```http
Authorization: Bearer sk-YOUR_KEY
```

## Faturalandırma nasıl çalışır? {#how-does-billing-work}

SandBase kredi ve kullanıma dayalı faturalandırma kullanır.

Models, API'ler, Agents ve çalışma zamanı işlerinin maliyetleri farklı olabilir. Güncel kullanım ve fiyatlandırma için Console'u kontrol edin.

## Sonraki adımlar {#next-steps}

- [Başlarken](/getting-started/)
- [Models ve API kataloğu](https://www.sandbase.ai/models)
- [AI tools bağlama](/setup/)
- [Build Agent](/agents/)
- [API Reference](/api-reference/)
