---
i18nSource: 99170a141af66587
title: API Sessions
description: Esegui una versione salvata di un Agent, invia input, ricevi gli eventi in streaming e leggi la cronologia della Session.
---

# API Sessions {#sessions-api}

Una Session esegue una versione salvata di un [Agent](/api-reference/agents/) nel cloud gestito di SandBase; non c'è un ambiente di esecuzione da scegliere. Gli ID delle Session usano il prefisso `ses_`. Le Sessions sono una sotto-risorsa degli Agents: ogni percorso inizia con `/v1/agents/sessions`.

Le operazioni standard seguono il protocollo OpenAI Agents (`client.beta.agents.sessions`); vedi [Compatibilità con OpenAI](/agents/openai-compatibility) per sapere cosa può e non può fare l'SDK ufficiale. Le estensioni SandBase aggiungono rinomina, stato di archiviazione, annullamento, allegati, metadata dei file del workspace, artifact immutabili e uno stream di prodotto riconnettibile.

::: info Da dove nascono le Sessions
Crei una Session direttamente con `POST /v1/agents/sessions`. La Session riporta `source: "direct"` e `source_id: null`.
:::

## Flusso consigliato {#recommended-flow}

1. [Crea una Session](./create) per un Agent salvato. La Session congela la versione dell'Agent selezionata e le connessioni MCP, e usa le versioni delle Skills già fissate su quella versione dell'Agent.
2. [Apri lo stream degli eventi](./stream) con `GET /v1/agents/sessions/{session_id}/events`. Lo stream è solo live, quindi aprilo prima di inviare input.
3. [Invia l'input](./send-events) con `POST /v1/agents/sessions/{session_id}/events` e un evento `agent.session.input.message`. La chiamata restituisce 202.
4. Leggi i risultati dallo stream oppure, in seguito, dagli [item](./items) e dai [turni](./turns).

## Operazioni sulle Session {#session-operations}

| Metodo | Percorso | Scopo |
|---|---|---|
| `POST` | `/v1/agents/sessions` | [Creare una Session](./create) |
| `GET` | `/v1/agents/sessions` | [Elencare le Sessions](./list) |
| `GET` | `/v1/agents/sessions/{session_id}` | [Ottenere una Session](./get) |
| `POST` | `/v1/agents/sessions/{session_id}` | [Sostituire i metadata](./update) |
| `PATCH` | `/v1/agents/sessions/{session_id}` | [Rinominare](./rename) con `row_version` |
| `DELETE` | `/v1/agents/sessions/{session_id}` | [Eliminare](./delete), cioè archiviare la Session |
| `POST` | `/v1/agents/sessions/{session_id}/events` | [Inviare un evento di input o di annullamento](./send-events) |
| `GET` | `/v1/agents/sessions/{session_id}/events` | [Stream degli eventi live](./stream) (SSE) |
| `GET` | `/v1/agents/sessions/{session_id}/items` | [Elencare gli item](./items) |
| `GET` | `/v1/agents/sessions/{session_id}/turns` | [Elencare i turni](./turns) |
| `GET` | `/v1/agents/sessions/{session_id}/turns/{turn_id}` | [Ottenere un turno](./get-turn) |
| `POST` | `/v1/agents/sessions/{session_id}/cancel` | [Annullare il turno in esecuzione](./cancel) |
| `POST` | `/v1/agents/sessions/{session_id}/archive` | [Archiviare](./archive) |
| `POST` | `/v1/agents/sessions/{session_id}/unarchive` | [Ripristinare dall'archivio](./unarchive) |
| `POST` | `/v1/agents/sessions/{session_id}/reconnect` | [Riconnettersi](./reconnect) dopo un'interruzione dello stream |
| `GET` | `/v1/agents/sessions/{session_id}/events/stream` | [Stream con snapshot e poi live](./stream-snapshot) (SSE) |
| `POST` | `/v1/agents/sessions/{session_id}/files` | [Caricare un allegato](./upload-file) |
| `GET` | `/v1/agents/sessions/{session_id}/files` | [Elencare gli allegati](./list-files) |
| `GET` | `/v1/agents/sessions/{session_id}/files/{file_id}/content` | [Scaricare un allegato](./download-file) |
| `DELETE` | `/v1/agents/sessions/{session_id}/files/{file_id}` | [Eliminare un allegato](./delete-file) |
| `GET` | `/v1/agents/sessions/{session_id}/workspace-files` | [Elencare i metadata dei file del workspace](./list-workspace-files) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts` | [Elencare gli artifact immutabili](./list-artifacts) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` | [Scaricare un artifact](./download-artifact) |

## Campi di stato {#status-fields}

- `status` è lo stato di esecuzione: `idle`, `in_progress` o `failed`. I function tool che richiedono un risultato dal client (`requires_action`) non sono ancora supportati; la lettura di una Session in questo stato restituisce `502 executor_contract_error`.
- `lifecycle_status` è `active` o `archived`. Le Sessions archiviate rifiutano input, aggiornamenti dei metadata e stream. `DELETE` archivia; `unarchive` ripristina.
- `failure` è `null` oppure un oggetto con `code`, `message`, `action` e talvolta `retryable`.

| `failure.code` | Significato | `action` suggerita |
|---|---|---|
| `session_creation_rejected` | Il livello di esecuzione ha rifiutato la Session | `create_new_session` |
| `model_authentication_failed` | Il provider del modello ha rifiutato la chiave | `create_session_with_updated_model_provider` |
| `model_rate_limited` | Il provider del modello sta applicando un rate limit (ritentabile) | `retry_later` |
| `model_quota_exceeded` | L'account del modello non ha quota | `check_model_account` |
| `context_limit_exceeded` | La conversazione supera il contesto del modello | `create_new_session` |
| `environment_connection_timeout` | L'ambiente non si è connesso in tempo (ritentabile) | `retry_later` |
| `runtime_unavailable` | L'ambiente di esecuzione non è disponibile (ritentabile) | `retry_later` |
| `model_request_failed` | La richiesta al modello non è stata completata | `inspect_history` |
| `model_configuration_rejected` | Il modello o il livello di esecuzione ha rifiutato la configurazione | `create_session_with_updated_model_provider` |
| `execution_failed` | Errore senza una causa pubblica più specifica | `inspect_history` |

I risultati degli elenchi possono contenere anche righe segnaposto con `session_not_ready`, `session_execution_unavailable`, `session_configuration_unavailable` o `session_snapshot_unavailable` quando una Session non può essere letta in tempo reale.

## Credenziali del modello {#model-credentials}

Per impostazione predefinita una Session chiama i modelli con la stessa API key SandBase che l'ha creata. Invia `model_provider` per scegliere esplicitamente:

- `{"type": "sandbase"}` usa la chiave con cui effettui la chiamata. `base_url` non è consentito.
- `{"type": "custom", "base_url": "https://…", "api_key": "…"}` chiama un tuo endpoint HTTPS compatibile con OpenAI. L'URL non può contenere credenziali, query o fragment, e SandBase non ripiega mai sulla tua chiave SandBase.

`model_provider` è di sola scrittura e non compare mai nelle risposte.

## Ammissione ed errori {#admission-and-errors}

La creazione di una Session e l'invio di input verificano l'ammissione all'esecuzione: `402 spending_limit_exceeded` quando il limite della chiave o il saldo dell'organizzazione è esaurito, `403 org_disabled` quando l'organizzazione non può eseguire Agents e `503 admission_unavailable` quando la verifica non può essere completata. Letture, annullamento e archiviazione non sono bloccati dal saldo.

L'invio di input può restituire anche `409 session_input_pending` (un input precedente è ancora in consegna; attendi e non reinviarlo con una nuova chiave), `409 session_input_expired` (controlla la cronologia prima di inviare di nuovo) o `409 session_environment_unavailable` (attendi o crea una nuova Session). Vedi [Errori](/api-reference/errors#agents-platform-errors).

## Paginazione {#pagination}

Sessions, item, turni e artifact usano la paginazione a cursore (`limit` 1-100, `after`, `order`). Gli allegati usano la paginazione a offset (`limit` 1-100, `offset`).

I file del workspace usano invece la paginazione `page` / `next`. Vedi [Elencare i file del workspace](./list-workspace-files).
