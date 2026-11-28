---
i18nSource: c922bd433deabf32
title: Przewodniki
description: Praktyczne przewodniki po Models, APIs, Agents i Setup w SandBase, rozliczeniach, strumieniowaniu i niezawodności produkcyjnej.
---

# Przewodniki {#guides}

Te przewodniki opisują typowe wzorce korzystania z SandBase w środowisku produkcyjnym.

## Wywoływanie modeli {#call-models}
| Przewodnik | Opis |
|-------|-------------|
| [Chat Completions](./chat-completions) | Wywołuj SandBase przez protokół czatu zgodny z OpenAI |
| [OpenAI Responses](./openai-responses) | Wywołuj modele GPT przez protokół Responses zgodny z OpenAI |
| [Anthropic Messages](./anthropic-messages) | Wywołuj SandBase przez protokół wiadomości zgodny z Anthropic |
| [Google Gemini](../api-reference/gemini-generate-content) | Wywołuj SandBase przez protokół GenerateContent zgodny z Google Gemini |
| [Obrazy i wideo](./image-video) | Generuj obrazy i wideo przez wspólne asynchroniczne Run API |
| [Strumieniowanie](./streaming) | Strumieniuj wyjście zgodnych modeli do swojej aplikacji |
| [Katalog API](https://www.sandbase.ai/apis) | Przeglądaj możliwości API i ich endpointy z przypisanymi dostawcami |

## Działanie produkcyjne {#run-in-production}
| Przewodnik | Opis |
|-------|-------------|
| [Błędy i ponawianie](./error-handling) | Klasyfikuj błędy i ponawiaj tylko te operacje, które można bezpiecznie powtórzyć |
| [Limity żądań](./rate-limiting) | Obsługuj odpowiedzi 429 i wygładzaj skoki liczby żądań |
| [Limity równoległości](./concurrency-limits) | Ile zadań Twoja organizacja może uruchomić jednocześnie |
| [Cennik i zużycie](./billing) | Kredyty, zużycie i kontrola kosztów |

## Szybkie wskazówki {#quick-tips}

- Użyj [Setup](/setup/), gdy użytkownik chce mieć narzędzia w Codex, Claude, Cursor lub Kiro.
- Użyj [Modeli](https://www.sandbase.ai/models) lub [API](https://www.sandbase.ai/apis), gdy Twoja aplikacja potrzebuje jednej możliwości.
- Użyj [Build Agent](/agents/), gdy praca ma wiele kroków lub ma być używana wielokrotnie.
- Użyj [Activities](https://www.sandbase.ai/console/activities) w Console, aby przeglądać żądania i zużycie razem.
