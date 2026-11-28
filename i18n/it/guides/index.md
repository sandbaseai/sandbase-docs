---
i18nSource: c922bd433deabf32
title: Guide
description: Guide pratiche per usare Models, API, Agents, Setup, fatturazione, streaming e affidabilità in produzione di SandBase.
---

# Guide {#guides}

Queste guide coprono i pattern più comuni per usare SandBase in produzione.

## Chiamare i modelli {#call-models}
| Guida | Descrizione |
|-------|-------------|
| [Chat Completions](./chat-completions) | Chiama SandBase tramite il protocollo di chat compatibile con OpenAI |
| [OpenAI Responses](./openai-responses) | Chiama i modelli GPT tramite il protocollo Responses compatibile con OpenAI |
| [Anthropic Messages](./anthropic-messages) | Chiama SandBase tramite il protocollo messages compatibile con Anthropic |
| [Google Gemini](../api-reference/gemini-generate-content) | Chiama SandBase tramite il protocollo GenerateContent compatibile con Google Gemini |
| [Immagini e video](./image-video) | Genera immagini e video tramite la Run API asincrona condivisa |
| [Streaming](./streaming) | Trasmetti in streaming l'output dei modelli compatibili alla tua applicazione |
| [Catalogo API](https://www.sandbase.ai/apis) | Sfoglia le funzionalità API e i relativi endpoint qualificati per vendor |

## Esecuzione in produzione {#run-in-production}
| Guida | Descrizione |
|-------|-------------|
| [Errori e retry](./error-handling) | Classifica gli errori e riprova solo quando un'operazione può essere ripetuta in sicurezza |
| [Limiti di frequenza](./rate-limiting) | Gestisci le risposte 429 e attenua i picchi di richieste |
| [Limiti di concorrenza](./concurrency-limits) | Quanti task la tua organizzazione può eseguire contemporaneamente |
| [Prezzi e utilizzo](./billing) | Comprendi crediti, utilizzo e controlli dei costi |

## Suggerimenti rapidi {#quick-tips}

- Usa [Setup](/setup/) quando l'utente vuole i tool dentro Codex, Claude, Cursor o Kiro.
- Usa [Models](https://www.sandbase.ai/models) o [API](https://www.sandbase.ai/apis) quando la tua app ha bisogno di una sola funzionalità.
- Usa [Build Agent](/agents/) quando il lavoro ha più passaggi o deve essere riutilizzato.
- Usa [Activities](https://www.sandbase.ai/console/activities) nella Console per esaminare insieme richieste e utilizzo.
