---
i18nSource: 7b24f4b0b5cd2c33
title: Build Agent
description: Definisci, testa ed esegui Agent riutilizzabili e versionati nelle Session di SandBase.
---

# Build Agent {#build-agent}

Build Agent è il punto in cui definisci e testi un Agent, per poi decidere come viene eseguito.

Un Agent è una configurazione salvata e versionata: un modello, istruzioni, un profilo di runtime, Skill e connessioni MCP verso tool esterni. Salvare un Agent non lo esegue.

## Che cos'è un Agent {#what-an-agent-is}

| Domanda | Dove si trova |
|---|---|
| Che cosa deve fare? | `instructions` |
| Quale modello svolge il lavoro? | `model`, un ID modello dalla [Models API](/api-reference/models/) |
| Che cosa sa fare? | [Skill](/agents/mcp-tools#skills), bundle di istruzioni versionati |
| Quali tool esterni può chiamare? | [Connessioni MCP](/agents/mcp-tools#mcp-connections), con [credenziali](/agents/api-credentials) quando il server richiede un token |
| Come viene eseguito? | In una [Session](/agents/sessions) |

Ogni modifica effettiva crea una nuova versione immutabile. Puoi elencare le versioni e ripristinarne una precedente in qualsiasi momento.

## Come viene eseguito un Agent {#how-an-agent-runs}

Esegui un Agent in una [Session](/agents/sessions). Una Session è una risorsa `ses_` a cui invii input e da cui ricevi eventi in streaming, che si tratti di una conversazione interattiva, di un'esecuzione di test o di una chiamata dalla tua applicazione. Ogni Session congela la versione dell'Agent con cui è partita, quindi puoi continuare a modificare l'Agent senza cambiare le Session già esistenti.

## Ciclo di vita dell'Agent: Bozza → Test in una Session → Esecuzione dalla tua app → Ispezione delle Session {#agent-lifecycle-draft-→-test-in-a-session-→-run-from-your-app-→-inspect-sessions}

### 1. Bozza {#_1-draft}

Crea un Agent nella Console in **Build → Agents**, oppure con [`POST /v1/agents`](/agents/agent-api). Parti dal flusso di lavoro utile più piccolo e aggiungi Skill e connessioni MCP solo quando le istruzioni ne hanno bisogno.

### 2. Test in una Session {#_2-test-in-a-session}

Crea una Session per l'Agent, invia input rappresentativi e leggi l'output, l'attività dei tool e gli errori. Testa input mancanti, tool non disponibili, risultati vuoti e requisiti sul formato dell'output, non solo il caso ideale.

### 3. Esecuzione dalla tua app {#_3-run-from-your-app}

Crea Session per l'Agent testato dalla tua applicazione con la [Sessions API](/api-reference/sessions/).

### 4. Ispezione delle Session {#_4-inspect-sessions}

Leggi gli item e i turni di ogni Session con la Sessions API per esaminare l'intera conversazione, l'attività dei tool e gli errori.

## Checklist per la produzione {#production-checklist}

- `model` usa un ID modello attuale dalla Models API.
- Le Skill sono fissate a una versione quando il comportamento non deve cambiare in modo silenzioso.
- Le connessioni MCP espongono solo i tool di cui l'Agent ha bisogno, tramite `allowed_tools`.
- I token sono salvati come [Secret](/agents/api-credentials), mai scritti in istruzioni, input o metadati.
- La creazione delle Session invia un `Idempotency-Key` e i retry lo riutilizzano.
- Lo stato e gli errori delle Session vengono controllati dopo l'avvio.

## Agent del catalogo {#catalog-agents}

Il [catalogo degli Agent](/api-reference/agents/catalog) pubblico elenca gli Agent pubblicati da SandBase. Puoi leggere un Agent del catalogo, ma per modificarlo devi prima clonarlo nella tua organizzazione con `POST /v1/agents/catalog/{agent_id}/clone`. Il clone è un nuovo Agent privato di tua proprietà che puoi eseguire.

::: tip Usare l'SDK OpenAI
Agent, Session e Skill seguono la OpenAI Agents API, quindi l'SDK ufficiale OpenAI funziona con `base_url="https://api.sandbase.ai/v1"`. Consulta [Compatibilità con OpenAI](/agents/openai-compatibility) per esempi verificati e differenze.
:::

## Passaggi successivi {#next-steps}

- [Definire un Agent](/agents/agent-api)
- [Compatibilità con OpenAI](/agents/openai-compatibility)
- [Skill e tool MCP](/agents/mcp-tools)
- [Session](/agents/sessions)
