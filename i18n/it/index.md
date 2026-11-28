---
i18nSource: c063864501452a7b
title: Documentazione SandBase
description: Sviluppa direttamente con Models e API, oppure definisci Agents riutilizzabili che girano su infrastruttura gestita.
---

# Documentazione SandBase {#sandbase-docs}

Sviluppa direttamente con Models e API, oppure definisci Agents riutilizzabili che girano su infrastruttura gestita.

SandBase offre due modi complementari per creare applicazioni AI. Parti dalla superficie più piccola adatta al lavoro; puoi combinarle man mano che l'applicazione cresce.

## Scegli come sviluppare {#choose-how-to-build}

| | Models e API | Agents gestiti |
|---|---|---|
| **Cos'è** | Accesso diretto ad API di linguaggio, immagini, video, audio e di terze parti | Configurazioni di Agent riutilizzabili e versionate, eseguite da SandBase |
| **Ideale per** | Cicli applicativi personalizzati e controllo dettagliato delle richieste | Lavoro in più passaggi, asincrono o ripetibile |
| **Cosa gestisci tu** | Prompt, orchestrazione, retry e stato dell'applicazione | Definizione dell'Agent, funzionalità abilitate, input e modalità di consegna |
| **Inizia qui** | [Models e API](https://www.sandbase.ai/models) | [Build Agent](/agents/) |

::: tip Un'unica chiave API SandBase
La stessa chiave API può chiamare Models, API e Agents. Tieni le chiavi sul server e non esporle mai nel codice del browser.
:::

## Concetti fondamentali {#core-concepts}

### Models e API {#models-and-apis}

Usa i Models per carichi di lavoro di linguaggio, immagini, video e audio. Usa le API quando l'applicazione ha bisogno di dati o azioni esterne. Il catalogo sul sito di SandBase mostra le funzionalità disponibili, i prezzi, gli schemi di input ed esempi funzionanti.

- [Sfoglia i Models](https://www.sandbase.ai/models)
- [Sfoglia le API](https://www.sandbase.ai/apis)
- [Fai la tua prima chiamata API](/getting-started/first-call)
- [Apri il riferimento API](/api-reference/)

### Agents {#agents}

Un Agent è una configurazione riutilizzabile e versionata che contiene un modello, istruzioni, Skills e connessioni MCP. Definiscilo una volta, poi eseguilo nelle Session.

- [Capire gli Agents](/agents/)
- [Definire un Agent](/agents/agent-api)
- [Aggiungere Skills e tool MCP](/agents/mcp-tools)

### Session {#sessions}
Una Session esegue una versione di un Agent. Creala con `POST /v1/agents/sessions`, invia l'input, segui gli eventi in streaming e leggi poi l'intera conversazione.

- [Guida alle Session](/agents/sessions)
- [API delle Session](/api-reference/sessions/)

## Primi passi {#first-steps}

1. Crea un'organizzazione e una [chiave API](/getting-started/api-keys).
2. Scegli un modello, un'API o un Agent dal [catalogo](https://www.sandbase.ai/models).
3. Fai una richiesta diretta oppure definisci e prova un Agent.
4. Esegui l'Agent testato nelle Session dalla tua applicazione.
5. Esamina Session, errori, latenza e costi nella Console.

## Indicazioni operative {#operational-guidance}

- [Risposte in streaming](/guides/streaming)
- [Gestione degli errori e retry](/guides/error-handling)
- [Limiti di frequenza](/guides/rate-limiting)
- [Fatturazione e prezzi](/guides/billing)
- [Amministrazione del workspace](/admin/)

## Passi successivi {#next-steps}

- Creare con Skills locali: [Tutorial sulle Skill](/guides/skills/)

- Nuovo su SandBase: [Per iniziare](/getting-started/)
- Chiamare un modello o un'API: [catalogo dei Models](https://www.sandbase.ai/models) e [catalogo delle API](https://www.sandbase.ai/apis)
- API di inferenza e degli Agents: [Riferimento API](/api-reference/)
- Creare lavoro riutilizzabile: [Build Agent](/agents/)
- Collegare un tool AI: [Setup](/setup/)
