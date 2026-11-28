---
i18nSource: 2ba7f0f41847d04f
title: Definire un Agent
description: "Crea e aggiorna un Agent con versioni tramite l'API Agents: campi, limiti, versioni e archiviazione."
---

# Definire un Agent {#define-an-agent}

Crea un Agent con `POST /v1/agents`. L'API segue il protocollo OpenAI Agents, quindi puoi usare semplici richieste HTTP oppure `client.beta.agents` dell'SDK OpenAI con `base_url="https://api.sandbase.ai/v1"`. L'header `OpenAI-Beta` è facoltativo; se lo invii, deve essere `agents=v1`. Consulta [Compatibilità con OpenAI](/agents/openai-compatibility) per sapere cosa supporta l'SDK.

## Creare un Agent {#create-an-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: create-research-agent-1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research assistant",
    "model": "deepseek/deepseek-v4-flash",
    "instructions": "Research the question, compare at least two sources, and cite them.",
    "metadata": {"team": "research"}
  }'
```

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
agent = client.beta.agents.create(
    model="deepseek/deepseek-v4-flash",
    name="Research assistant",
    instructions="Research the question, compare at least two sources, and cite them.",
    metadata={"team": "research"},
)
print(agent.id, agent.version)  # agt_..., 1
```

La risposta è `201 Created` e contiene l'Agent: un ID `agt_`, `version: 1`, `row_version`, `status: "active"` e `projection_status`. Una nuova versione viene preparata per l'esecuzione in background; avvia le Sessions quando `projection_status` è `ready`.

`Idempotency-Key` è facoltativo. Se lo ometti, il servizio ne genera uno, quindi una richiesta ritentata può creare un secondo Agent. Quando ritenti, invia una tua chiave stabile.

## Campi {#fields}

Il body è JSON rigoroso (fino a 1 MiB). I campi sconosciuti restituiscono 400.

| Campo | Obbligatorio | Limiti e valori |
|---|---|---|
| `model` | Sì | ID del modello, fino a 200 caratteri |
| `name` | No | Fino a 128 caratteri |
| `instructions` | No | Fino a 256 KiB |
| `description` | No | Fino a 4096 caratteri |
| `runtime_profile` | No | `codex` (predefinito), `claude` o `mcode` |
| `skills` | No | Fino a 32 riferimenti. Un nuovo binding con `version: null` fissa la versione predefinita corrente al salvataggio; i binding esistenti mantengono la versione fissata. Indica una versione esplicita per aggiornare; vedi [Skills](/agents/mcp-tools#skills) |
| `mcp_connections` | No | Fino a 32 riferimenti; vedi [Connessioni MCP](/agents/mcp-tools#mcp-connections) |
| `tools` | No | Fino a 64 tool `function` e al massimo un tool `web_search` |
| `text` | No | `format.type` `text` o `json_schema` (schema di tipo object); `verbosity` `low`, `medium` o `high` |
| `reasoning` | No | `effort` `none`, `minimal`, `low`, `medium`, `high`, `xhigh` o `max`; `summary` `concise`, `detailed` o `auto` |
| `service_tier` | No | `auto` (predefinito), `default`, `flex`, `priority` o `fast` |
| `metadata` | No | Fino a 16 coppie di stringhe; chiavi fino a 64 e valori fino a 512 caratteri |
| `note` | No | Nota di modifica salvata sulla versione |

## Limiti attuali {#current-limits}

- `web_search` deve usare `"mode": "disabled"` perché le Sessions possano avviarsi.
- I tool `function` possono essere salvati, ma i Run che richiedono al client di restituire il risultato di un tool (`requires_action`) non sono ancora supportati. Una Session in questo stato restituisce `502 executor_contract_error`. Fornisci invece all'Agent capacità esterne tramite le [connessioni MCP](/agents/mcp-tools#mcp-connections).
- `multi_agent` deve essere omesso o `null`.

## Aggiornare un Agent {#update-an-agent}

Esistono due forme di aggiornamento. Entrambe creano una nuova versione.

- `POST /v1/agents/{agent_id}` è l'aggiornamento dell'SDK OpenAI. Invia solo i campi che vuoi modificare. Non serve `row_version`, quindi prevale l'ultima scrittura. In questa forma `description` e `note` non sono accettati.
- `PATCH /v1/agents/{agent_id}` è l'aggiornamento compare-and-set. Richiede l'ultimo `row_version` che hai letto e restituisce 409 se nel frattempo l'Agent è cambiato. I valori `null` espliciti vengono rifiutati.

```bash
curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 2, "instructions": "Answer in five bullet points with cited sources.", "note": "Shorter answers"}'
```

## Versioni, archiviazione e ripristino {#versions-archive-and-restore}

- `GET /v1/agents/{agent_id}/versions` elenca gli snapshot immutabili; `GET /v1/agents/{agent_id}/versions/{version}` ne legge uno.
- `POST /v1/agents/{agent_id}/restore` con `{"source_version": 1, "row_version": 3}` copia una configurazione precedente in una nuova versione corrente.
- `POST /v1/agents/{agent_id}/archive` e `/unarchive` accettano `{"row_version": …}`. Gli Agents archiviati non possono avviare nuove Sessions.
- `DELETE /v1/agents/{agent_id}` archivia l'Agent. Gli Agents non vengono mai eliminati definitivamente.

## Passaggi successivi {#next-steps}

- [Skills e tool MCP](/agents/mcp-tools)
- [Eseguire l'Agent in una Session](/agents/sessions)
- [Riferimento API Agents](/api-reference/agents/)
