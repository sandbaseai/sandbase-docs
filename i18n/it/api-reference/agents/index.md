---
i18nSource: 8524e8b4d6f5ab97
title: Agents API
description: Crea, gestisci le versioni, archivia e clona configurazioni di Agent salvate.
---

# Agents API {#agents-api}

Un Agent è una configurazione salvata e con versioni: un modello, istruzioni, un profilo di runtime, Skills, connessioni MCP e impostazioni di output. Creare o aggiornare un Agent non lo esegue. Eseguilo in una [Session](/api-reference/sessions/).

La Agents API segue il protocollo OpenAI Agents (`client.beta.agents` nell'SDK Python di OpenAI). L'header `OpenAI-Beta` è facoltativo; se lo invii, deve essere `agents=v1`. SandBase aggiunge versioni, aggiornamenti compare-and-set, archiviazione e ripristino e un catalogo pubblico.

## Operazioni sugli Agent {#agent-operations}

| Metodo | Percorso | Scopo |
|---|---|---|
| `POST` | `/v1/agents` | [Crea un Agent](./create) alla versione 1 |
| `GET` | `/v1/agents` | [Elenca gli Agent](./list) |
| `GET` | `/v1/agents/{agent_id}` | [Ottieni un Agent](./get) |
| `POST` | `/v1/agents/{agent_id}` | [Aggiorna un Agent](./update) (aggiornamento parziale in stile SDK) |
| `PATCH` | `/v1/agents/{agent_id}` | [Sostituisci con compare-and-set](./replace) su `row_version` |
| `DELETE` | `/v1/agents/{agent_id}` | [Elimina](./delete), cioè archivia l'Agent |
| `POST` | `/v1/agents/{agent_id}/archive` | [Archivia un Agent](./archive) |
| `POST` | `/v1/agents/{agent_id}/unarchive` | [Ripristina un Agent dall'archivio](./unarchive) |
| `POST` | `/v1/agents/{agent_id}/restore` | [Ripristina una versione precedente](./restore) come nuova versione |
| `GET` | `/v1/agents/{agent_id}/versions` | [Elenca le versioni](./versions) |
| `GET` | `/v1/agents/{agent_id}/versions/{version}` | [Ottieni una versione](./get-version) |
| `GET` | `/v1/agents/catalog` | [Sfoglia il catalogo pubblico](./catalog) |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | [Clona un Agent del catalogo](./catalog#clone-a-catalog-agent) nella tua organizzazione |

Gli ID degli Agent usano il prefisso `agt_`. I body delle richieste sono JSON rigoroso fino a 1 MiB; i campi sconosciuti restituiscono 400.

## Versioni e aggiornamenti {#versions-and-updates}

- Ogni scrittura effettiva (create, update, replace, restore) produce una versione immutabile. `version` è il numero della versione corrente.
- `POST /v1/agents/{agent_id}` è l'aggiornamento dell'SDK OpenAI. Non richiede `row_version`, quindi vince l'ultima scrittura.
- `PATCH /v1/agents/{agent_id}` richiede il `row_version` letto per ultimo e restituisce 409 se qualcun altro ha modificato l'Agent prima di te. Usalo da editor e automazioni che possono essere eseguiti in parallelo.
- Ogni Session congela la versione dell'Agent, le versioni delle Skill e la configurazione delle connessioni MCP con cui è stata avviata.

## Prontezza {#readiness}

Una versione appena scritta riporta `projection_status` mentre viene preparata per l'esecuzione. Le Session richiedono un Agent attivo il cui `projection_status` sia `ready`; altrimenti restituiscono 409. Anche gli Agent archiviati restituiscono 409 per le nuove esecuzioni.

## Limiti attuali {#current-limits}

- `tools` accetta strumenti `function` e al massimo uno strumento `web_search`. Al momento l'esecuzione richiede che `web_search.mode` sia `disabled`.
- Gli strumenti function possono essere salvati, ma i Run che chiedono al client di restituire il risultato di uno strumento (`requires_action`) non sono ancora supportati e si presentano come `502 executor_contract_error`.
- `multi_agent` deve essere omesso o `null`.

## Paginazione {#pagination}

`GET /v1/agents` e il catalogo usano la paginazione a cursore: `limit` (1-100, predefinito 20), `after` e `order` (`asc` o `desc`, predefinito `desc`). Le risposte contengono `object: "list"`, `data`, `has_more`, `first_id` e `last_id`; passa `last_id` come `after` per la pagina successiva.

`GET /v1/agents/{agent_id}/versions` usa la paginazione a offset: `limit` e `offset`, con `data`, `total`, `limit` e `offset` nella risposta.

## Errori {#errors}

Gli errori usano l'envelope degli Agents `{"error":{"type","code","param":null,"message"}}`. Vedi [Errori](/api-reference/errors#agents-platform-errors) per l'elenco dei codici.
