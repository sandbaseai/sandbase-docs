---
i18nSource: 071e97a48f9c4f4c
title: Riferimento API
description: Chiama i modelli SandBase e gestisci Agents, Sessions, Skills, connessioni MCP, Secrets e risorse dell'account.
---

# Riferimento API {#api-reference}

Usa l'API per chiamare direttamente i modelli, oppure per definire Agent riutilizzabili, eseguirli nelle Session e collegarli a Skills e strumenti MCP.

::: tip Cerchi l'inferenza dei modelli?
I contratti di inferenza (Chat Completions, Responses, Anthropic Messages, Gemini, Images e video Seedance) si trovano nella sezione **Model inference** di questo riferimento. I campi e i prezzi specifici di ogni modello sono nella sua pagina del [Catalogo dei modelli](https://www.sandbase.ai/models).
:::

## Scegli da dove iniziare {#choose-a-starting-point}

| Obiettivo | Inizia da | Cosa succede dopo |
|---|---|---|
| Definire un comportamento riutilizzabile | [Agents](/api-reference/agents/) | Crea una configurazione di Agent e gestiscine le versioni |
| Eseguire direttamente un Agent | [Sessions](/api-reference/sessions/) | Invia input, ricevi eventi in streaming e leggi la cronologia |
| Riutilizzare bundle di istruzioni | [Skills](/api-reference/skills/) | Carica bundle ZIP con versioni e collegali agli Agent |
| Chiamare strumenti esterni | [MCP Connections](/api-reference/mcp-connections/) | Registra server MCP remoti HTTPS per gli Agent |
| Autenticare strumenti esterni | [Secrets](/agents/api-credentials#with-the-api) | Archivia token Bearer di sola scrittura per le connessioni MCP |

## Ciclo di vita delle risorse {#resource-lifecycle}

```text
Agent + version ─── direct ──→ Session ─→ events, items, turns
Agent ─ skills[] → Skill version      Agent ─ mcp_connections[] → MCP connection ─ secret_id → Secret
```

- Un **Agent** (`agt_`) è una configurazione salvata e con versioni; crearlo non lo esegue.
- Una **Session** (`ses_`) esegue una versione di un Agent e ne congela Skills e connessioni MCP. I percorsi delle Session si trovano sotto `/v1/agents/sessions`.
- Una **Skill** (`skl_`) è un bundle di istruzioni con versioni. Una **connessione MCP** (`mcp_`) registra un server di strumenti remoto e un **Secret** (`sec_`) ne archivia il token Bearer.

## Convenzioni per le risorse della piattaforma Agents {#conventions-for-agents-platform-resources}

Agents, Sessions, Skills, connessioni MCP e Secrets sono serviti sotto `https://api.sandbase.ai/v1` e condividono queste regole:

- Autenticati con `Authorization: Bearer` o `X-API-Key`. Vedi [Autenticazione](/api-reference/authentication#agents-platform-resources).
- I body delle richieste sono JSON rigoroso fino a 1 MiB; i campi sconosciuti restituiscono 400.
- Le scritture che creano connessioni MCP o Secrets richiedono un `Idempotency-Key`. Le altre scritture lo accettano.
- La concorrenza ottimistica usa `row_version`: invia il valore letto per ultimo e gestisci un 409 rileggendo la risorsa.
- Agents, Sessions, elementi, turni e Skills usano la paginazione a cursore (`limit`, `after`, `order`; le risposte contengono `has_more` e `last_id`). Versioni degli Agent, allegati, connessioni MCP e Secrets usano la paginazione a offset (`limit`, `offset`; le risposte contengono `total`).
- Gli errori usano `{"error": {"type", "code", "param", "message"}}`. Vedi [Errori della piattaforma Agents](/api-reference/errors#agents-platform-errors).

## Autenticazione {#authentication}

Invia una chiave API SandBase come token Bearer:

```http
Authorization: Bearer sk-YOUR_KEY
```

Tratta la chiave come un segreto opaco, conservala sul server e non includerla mai nel codice del browser o nei log. Vedi [Autenticazione](/api-reference/authentication) per i dettagli di compatibilità ed [Errori](/api-reference/errors) per gli envelope di errore pubblici.

## Organizzazione e utilizzo {#organization-and-usage}

Le risorse della piattaforma appartengono all'organizzazione associata alla chiave API. Usa la [Account API](/api-reference/account/) per consultare il saldo supportato e le viste della cronologia delle esecuzioni recenti. L'amministrazione dell'organizzazione e la gestione della fatturazione restano flussi della Console, salvo che qui sia documentato un endpoint pubblico.

## Formati di riferimento {#reference-formats}

- Sfoglia le operazioni dalla barra laterale per esempi e dettagli delle risposte.
- Scarica la [specifica OpenAPI](/openapi.yaml) leggibile dalle macchine.
- Apri la pagina di un modello nel [Catalogo dei modelli](https://www.sandbase.ai/models) o la pagina di un'API nel [Catalogo delle API](https://www.sandbase.ai/apis) per i suoi campi di richiesta esatti.

## Passaggi successivi {#next-steps}

- Se gli Agent gestiti sono una novità per te: [Crea un Agent](/agents/)
- Chiama direttamente un modello: [Chat Completions](/api-reference/llm-gateway) o il [Catalogo dei modelli](https://www.sandbase.ai/models)
