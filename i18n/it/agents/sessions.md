---
i18nSource: e904f2b8bbd0ccc4
title: Session
description: Esegui un Agent in una Session, segui in streaming i suoi eventi, leggi la cronologia, allega file e gestisci gli errori.
---

# Session {#sessions}

Una **Session** esegue una versione salvata di un Agent nel cloud ospitato di SandBase; non scegli tu un ambiente di esecuzione. Il suo ID inizia con `ses_` e tutti i percorsi delle Session si trovano sotto `/v1/agents/sessions`. La Session congela la versione dell'Agent, le versioni delle Skill e la configurazione delle connessioni MCP con cui è stata avviata.

## Come si avviano le Session {#how-sessions-start}

Crea una Session con `POST /v1/agents/sessions`. La Session riporta `source: "direct"`.

## Eseguire una Session {#run-a-session}

Lo stream di eventi nativo è **solo live**: dopo una disconnessione gli eventi non vengono riprodotti. Aprilo prima di inviare l'input e leggi la cronologia da items o turns.

```bash
# 1. Create the Session
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-2026-10-06" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60"}'

# 2. In another terminal, follow live events (server-sent events)
curl -N https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY"

# 3. Send input (202 Accepted, no body)
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "List three notable launches this week."}]}'

# 4. Read the history afterwards
curl "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Lo stesso flusso con l'SDK Python ufficiale di OpenAI. Apri prima lo stream, invia l'input da un altro thread e fermati all'evento di turn terminale. Vedi [Compatibilità con OpenAI](/agents/openai-compatibility) per la versione Node.js e le differenze dell'SDK.

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
import threading
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
session = client.beta.agents.sessions.create(
    agent_id="agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
    environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
)

def send_input():
    client.beta.agents.sessions.events.create(
        session.id,
        events=[{
            "type": "agent.session.input.message",
            "input": [{"role": "user", "content": [{"type": "input_text", "text": "List three notable launches this week."}]}],
        }],
        idempotency_key="market-scan-input-1",
    )

with client.beta.agents.sessions.events.stream(session.id) as stream:
    threading.Thread(target=send_input).start()
    for event in stream:
        print(event.type)
        if event.type in ("agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"):
            break
```

Ogni invio contiene esattamente un evento. `input` è una stringa di testo, oppure un array con esattamente un messaggio user che ha esattamente una parte `input_text`: `[{"role": "user", "content": [{"type": "input_text", "text": "…"}]}]`. Qualsiasi altra forma restituisce `400 invalid_request`. Per fermare il turn in esecuzione, invia `{"type": "agent.session.input.cancel"}` oppure chiama `POST /v1/agents/sessions/{session_id}/cancel` con un `Idempotency-Key`. Annullare una Session inattiva restituisce comunque `202 {"accepted": true}` e non modifica nulla. Puoi anche passare un primo `input` quando crei la Session. `stream: true` in fase di creazione non è supportato.

## Stato ed errori {#status-and-failures}

| Campo | Valori | Significato |
|---|---|---|
| `status` | `idle`, `in_progress`, `failed` | Stato di esecuzione della Session |
| `lifecycle_status` | `active`, `archived` | Indica se la Session accetta input |
| `failure` | `null` o `{code, message, action, retryable?}` | Motivo pubblico di un errore e passo successivo consigliato |

`failure.action` ti dice cosa fare: `retry_later`, `inspect_history`, `create_new_session`, `check_model_account` o `create_session_with_updated_model_provider`. Vedi la [tabella dei codici di errore](/api-reference/sessions/#status-fields).

I function tool che chiedono un risultato al client (`requires_action`) non sono ancora supportati; leggere una Session di questo tipo restituisce `502 executor_contract_error`.

Se un invio restituisce `409 session_input_pending`, un input precedente è ancora in consegna. Attendi e leggi la Session; non reinviarlo con un nuovo `Idempotency-Key`, altrimenti l'input potrebbe essere eseguito due volte.

## Archiviazione {#archive}

`DELETE /v1/agents/sessions/{session_id}` archivia una Session; le Session non vengono eliminate definitivamente. `POST /v1/agents/sessions/{session_id}/archive` e `/unarchive` accettano `{"row_version": …}`. Le Session archiviate mantengono la cronologia ma rifiutano input, aggiornamenti dei metadati e stream.

## Allegati {#attachments}

Carica un file nel workspace della Session con `POST /v1/agents/sessions/{session_id}/files` (campo multipart `file`, fino a 5 MiB, `Idempotency-Key` obbligatorio). I tipi supportati sono `.txt`, `.md`, `.csv`, `.log`, `.json`, `.pdf`, `.png`, `.jpg`, `.jpeg` e `.webp`. Quando lo `status` del file è `ready`, invialo insieme ad altri nove al massimo:

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-2" \
  -H "Content-Type: application/json" \
  -d '{"input": "Summarize the attached report.", "file_ids": ["fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72"]}'
```

## Riconnessione dei client {#reconnecting-clients}

I client in stile browser che hanno bisogno di una vista coerente dopo una connessione interrotta possono chiamare `POST /v1/agents/sessions/{session_id}/reconnect`. Restituisce la Session e uno `stream_url` per `GET /v1/agents/sessions/{session_id}/events/stream`, che invia prima un `session.snapshot` e poi gli eventi live e `heartbeat`. Se quello stream emette `stream.interrupted`, riconnettiti di nuovo invece di reinviare l'input.

## Repository GitHub {#github-repository}

Invia `github_workspace` in fase di creazione per clonare un repository GitHub in `/workspace` e consentire all'Agent di fare push sui propri branch di Session. Vedi [Workspace con repository GitHub](/agents/github-workspace).

## Credenziali dei modelli {#model-credentials}

Una Session chiama i modelli con la chiave API che l'ha creata, a meno che tu non invii `model_provider`. Usa `{"type": "custom", "base_url": "https://…", "api_key": "…"}` per usare un tuo endpoint HTTPS compatibile con OpenAI. `model_provider` è di sola scrittura.

## ID {#ids}

| Prefisso | Risorsa |
|---|---|
| `agt_` | Agent |
| `ses_` | Session |
| `skl_` | Skill |
| `mcp_` | Connessione MCP |
| `sec_` | Secret |
| `fil_` | Allegato della Session |

Tratta gli ID come stringhe opache.

## Passi successivi {#next-steps}

- [Riferimento API delle Session](/api-reference/sessions/)
- [Compatibilità con OpenAI](/agents/openai-compatibility)

## File del workspace e artifact generati {#workspace-files-and-generated-artifacts}

Queste tre risorse hanno scopi diversi:

| Risorsa | Usala per | Paginazione |
|---|---|---|
| [Allegati](/api-reference/sessions/list-files) | File che hai caricato e puoi referenziare nell'input con un `file_id` | `limit` / `offset` |
| [File del workspace](/api-reference/sessions/list-workspace-files) | Percorsi e dimensioni attuali dei file in una directory del workspace | `page` / `next` |
| [Artifact](/api-reference/sessions/list-artifacts) | Output generati immutabili disponibili per il download | `after` / `last_id` |

Elenca gli artifact per ottenere un ID `art_`, poi passa esattamente quell'ID a [Download Artifact](/api-reference/sessions/download-artifact). Un percorso del workspace o il `file_id` di un allegato non possono sostituirlo. L'elenco del workspace restituisce solo metadati e non è un'API per scaricare percorsi arbitrari. Gli artifact si possono scaricare come file completi fino a 200 MiB; i download parziali con `Range` non sono supportati.
