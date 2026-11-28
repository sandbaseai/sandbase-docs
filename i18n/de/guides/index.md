---
i18nSource: c922bd433deabf32
title: Guides
description: Praxisnahe Guides zu SandBase Models, APIs, Agents, Setup, Abrechnung, Streaming und Zuverlässigkeit in Produktion.
---

# Guides {#guides}

Diese Guides beschreiben gängige Muster für den Einsatz von SandBase in Produktion.

## Modelle aufrufen {#call-models}
| Guide | Beschreibung |
|-------|-------------|
| [Chat Completions](./chat-completions) | SandBase über das OpenAI-kompatible Chat-Protokoll aufrufen |
| [OpenAI Responses](./openai-responses) | GPT-Modelle über das OpenAI-kompatible Responses-Protokoll aufrufen |
| [Anthropic Messages](./anthropic-messages) | SandBase über das Anthropic-kompatible Messages-Protokoll aufrufen |
| [Google Gemini](../api-reference/gemini-generate-content) | SandBase über das Google-Gemini-kompatible GenerateContent-Protokoll aufrufen |
| [Bild und Video](./image-video) | Bilder und Videos über die gemeinsame asynchrone Run API generieren |
| [Streaming](./streaming) | Ausgaben kompatibler Modelle an deine Anwendung streamen |
| [API-Katalog](https://www.sandbase.ai/apis) | API-Funktionen und ihre anbieterspezifischen Endpunkte durchsuchen |

## In Produktion betreiben {#run-in-production}
| Guide | Beschreibung |
|-------|-------------|
| [Fehler und Wiederholungen](./error-handling) | Fehler einordnen und nur wiederholen, wenn eine Operation gefahrlos erneut ausgeführt werden kann |
| [Rate Limits](./rate-limiting) | 429-Antworten behandeln und Anfragespitzen glätten |
| [Concurrency-Limits](./concurrency-limits) | Wie viele Tasks deine Organisation gleichzeitig ausführen kann |
| [Preise und Nutzung](./billing) | Credits, Nutzung und Kostenkontrollen verstehen |

## Kurztipps {#quick-tips}

- Nutze [Setup](/setup/), wenn der Nutzer Tools in Codex, Claude, Cursor oder Kiro verwenden möchte.
- Nutze [Models](https://www.sandbase.ai/models) oder [APIs](https://www.sandbase.ai/apis), wenn deine App eine einzelne Funktion braucht.
- Nutze [Build Agent](/agents/), wenn die Arbeit mehrere Schritte umfasst oder wiederverwendet werden soll.
- Nutze [Activities](https://www.sandbase.ai/console/activities) in der Console, um Anfragen und Nutzung gemeinsam zu prüfen.
