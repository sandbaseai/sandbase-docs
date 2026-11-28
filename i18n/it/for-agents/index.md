---
i18nSource: 0314b37a870481ae
title: Documentazione leggibile dall'AI
description: Tutto ciò che serve a un agente AI per scoprire e usare l'API SandBase, in un riepilogo di una pagina.
---

# Panoramica dell'API per l'AI {#ai-friendly-api-overview}

::: info Contratto delle Session
Una Session (`ses_*`) esegue una versione salvata di un Agent; creala direttamente con `POST /v1/agents/sessions`. Le istanze di runtime restano interne e non vengono mai restituite.
:::

> Un riferimento sintetico sia per le persone sia per gli agenti AI. Per le versioni in testo semplice ottimizzate per l'ingestione da parte degli LLM, vedi [`llms.txt`](https://www.sandbase.ai/docs/llms.txt).

## Che cos'è SandBase? {#what-is-sandbase}

SandBase è una piattaforma di infrastruttura per agenti AI. Una sola API key dà accesso ai Models e alle API abilitati per linguaggio, immagini, video, audio, ricerca e dati, oltre ai flussi di lavoro degli Agents. Consulta il catalogo aggiornato invece di affidarti a un numero fisso.

## URL di base dell'API {#api-base-url}

```
https://api.sandbase.ai/v1
```

## Autenticazione {#authentication}

Tutte le richieste richiedono un token Bearer:

```
Authorization: Bearer sk-YOUR_KEY
```

Ottieni la tua chiave in [Developer → API Keys](https://www.sandbase.ai/console/keys).

## Esempio rapido {#quick-example}

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## API principali {#core-apis}

| Metodo | Route | Descrizione |
|--------|----------|-------------|
| `POST` | `/v1/chat/completions` | Chat compatibile con OpenAI; le funzionalità opzionali dipendono dal modello selezionato |
| `POST` | `/v1/messages` | API messages compatibile con Anthropic |
| `POST` | `/v1/run` | Invia una generazione usando lo schema specifico del modello |
| `GET` | `/v1/run/{id}` | Interroga lo stato di una generazione asincrona e recuperane i risultati |
| `GET` | `/v1/models` | Elenca i modelli logici abilitati; per impostazione predefinita il tipo LLM |
| `GET` | `/v1/models/{id_or_name}` | Ottiene dettagli, schema, funzionalità e prezzi del modello |
| `GET` | `/v1/tasks/{task_id}/cost` | Ottiene costo e utilizzo di un task |

## Altri gruppi di API {#additional-api-groups}

Oltre alle API principali di generazione, SandBase offre API per la gestione del ciclo di vita degli agenti. Vedi la [Guida all'API per l'AI](./full) per i flussi di lavoro comuni e la [specifica OpenAPI](https://www.sandbase.ai/docs/openapi.yaml) per il contratto completo.

| Gruppo | Route principali | Scopo |
|-------|---------------|---------|
| **Agents** | `POST /v1/agents`, `GET /v1/agents`, `POST /v1/agents/{agent_id}` | Creare e versionare le definizioni salvate degli Agents |
| **Sessions** | `POST /v1/agents/sessions`, `POST /v1/agents/sessions/{session_id}/events`, `GET /v1/agents/sessions/{session_id}/events` | Eseguire un Agent, inviare input e ricevere gli eventi live in streaming |
| **Skills** | `POST /v1/skills`, `GET /v1/skills` | Bundle di istruzioni con versioni che gli Agents montano |
| **MCP Connections e Secrets** | `POST /v1/mcp-connections`, `POST /v1/secrets` | Tool MCP remoti via HTTPS e i relativi token Bearer di sola scrittura |

Le risorse della piattaforma Agents accettano `Authorization: Bearer` o `X-API-Key` e in caso di errore restituiscono `{"error":{"type","code","param","message"}}`.

## Modello di prezzo {#pricing-model}

Paghi in base all'utilizzo. I prezzi sono specifici per modello e possono cambiare indipendentemente da questa pagina:

- **Prezzi dei modelli**: leggi la formula e le unità correnti del modello selezionato da `model_card`
- **Prezzi a token**: possono includere componenti di input, output, cache o reasoning, se dichiarate dal modello
- **Media e altre operazioni**: possono usare unità per richiesta, per durata, per risoluzione o altre unità specifiche del modello
- **API dati** (ricerca, social, scraping, e-commerce, finanza): ogni organizzazione ha 100 chiamate gratuite per giorno UTC, condivise tra le API dati idonee; oltre questa soglia le chiamate vengono addebitate per chiamata, non bloccate. In MCP, i tool idonei mostrano `pricing.free_quota` in `sandbase_inspect`, e `sandbase_account` restituisce `free_api_quota` (`daily_limit`, `used_today`, `remaining`, `resets_at`). Vedi [Chiamate API gratuite giornaliere](/guides/billing#daily-free-api-calls).

Individua l'ID del modello corrente con `GET /v1/models`, poi esamina `GET /v1/models/{id_or_name}` prima di inviare una richiesta. Non dare per scontato che prezzi o sconti sulla cache siano condivisi tra provider.

Quando un'operazione restituisce un ID di task, controllane il costo registrato:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

## Rate limit {#rate-limits}

Non esiste un valore numerico predefinito universale pubblicato. Le richieste sono soggette a un limite facoltativo di richieste al minuto
assegnato alla tua organizzazione e condiviso da tutte le sue API key. Una risposta `429` non include header di quota né `Retry-After`; usa un backoff
esponenziale limitato con jitter. Vedi la [Guida agli errori](./errors).

---

## Approfondimenti {#further-reading}

- [Guida all'API per l'AI](./full) — flussi di lavoro principali, struttura di richieste e risposte ed esempi curl
- [Models e prezzi](./models) — individuazione dei modelli in tempo reale, prezzi e indicazioni sulle funzionalità
- [Guida agli errori](./errors) — strutture di risposta documentate, gestione HTTP e sicurezza dei retry
- [Specifica OpenAPI](https://www.sandbase.ai/docs/openapi.yaml) — OpenAPI 3.1 leggibile dalle macchine

## Versioni in testo semplice (per agenti AI) {#plain-text-versions-for-ai-agents}

| File | URL | Contenuto |
|------|-----|---------|
| `llms.txt` | [/docs/llms.txt](https://www.sandbase.ai/docs/llms.txt) | Riepilogo compatto (~60 righe) |
| `llms-full.txt` | [/docs/llms-full.txt](https://www.sandbase.ai/docs/llms-full.txt) | Guida estesa all'API orientata all'AI |
| `openapi.yaml` | [/docs/openapi.yaml](https://www.sandbase.ai/docs/openapi.yaml) | Specifica OpenAPI 3.1 leggibile dalle macchine |
