---
i18nSource: c922bd433deabf32
title: Kılavuzlar
description: SandBase Models, API'ler, Agents, Setup, faturalandırma, akış ve üretim güvenilirliği için pratik kılavuzlar.
---

# Kılavuzlar {#guides}

Bu kılavuzlar, SandBase'i üretimde kullanmaya yönelik yaygın kalıpları kapsar.

## Modelleri çağırma {#call-models}
| Kılavuz | Açıklama |
|-------|-------------|
| [Chat Completions](./chat-completions) | SandBase'i OpenAI uyumlu sohbet protokolü üzerinden çağırın |
| [OpenAI Responses](./openai-responses) | GPT modellerini OpenAI uyumlu Responses protokolü üzerinden çağırın |
| [Anthropic Messages](./anthropic-messages) | SandBase'i Anthropic uyumlu messages protokolü üzerinden çağırın |
| [Google Gemini](../api-reference/gemini-generate-content) | SandBase'i Google Gemini uyumlu GenerateContent protokolü üzerinden çağırın |
| [Görüntü ve video](./image-video) | Ortak asenkron Run API üzerinden görüntü ve video oluşturun |
| [Akış](./streaming) | Uyumlu model çıktısını uygulamanıza akış olarak iletin |
| [API Kataloğu](https://www.sandbase.ai/apis) | API yeteneklerine ve sağlayıcıya göre nitelenmiş uç noktalarına göz atın |

## Üretimde çalıştırma {#run-in-production}
| Kılavuz | Açıklama |
|-------|-------------|
| [Hatalar ve yeniden denemeler](./error-handling) | Hataları sınıflandırın ve yalnızca işlemin tekrarlanması güvenliyse yeniden deneyin |
| [Hız limitleri](./rate-limiting) | 429 yanıtlarını ele alın ve ani istek yüklerini yumuşatın |
| [Eşzamanlılık limitleri](./concurrency-limits) | Organizasyonunuzun aynı anda kaç görev çalıştırabileceği |
| [Fiyatlandırma ve kullanım](./billing) | Kredileri, kullanımı ve maliyet denetimlerini anlayın |

## Kısa İpuçları {#quick-tips}

- Kullanıcı araçları Codex, Claude, Cursor veya Kiro içinde istiyorsa [Setup](/setup/) kullanın.
- Uygulamanızın tek bir yeteneğe ihtiyacı varsa [Models](https://www.sandbase.ai/models) veya [APIs](https://www.sandbase.ai/apis) kullanın.
- İş birden fazla adımdan oluşuyorsa veya yeniden kullanılacaksa [Build Agent](/agents/) kullanın.
- İstekleri ve kullanımı birlikte incelemek için Console'daki [Activities](https://www.sandbase.ai/console/activities) sayfasını kullanın.
