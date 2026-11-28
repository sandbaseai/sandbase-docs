---
i18nSource: d637409019c8109d
title: Compatibilità con OpenAI
description: Usa l'SDK ufficiale di OpenAI con Agents, Session e Skills di SandBase, e scopri dove SandBase differisce dalla OpenAI Agents API.
---

# Compatibilità con OpenAI {#openai-compatibility}

Gli Agents di SandBase implementano il protocollo della [OpenAI Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview) per Agents, Session, eventi di sessione, items, turns e Skills. Per queste risorse puoi usare direttamente l'SDK ufficiale di OpenAI: imposta `base_url` su `https://api.sandbase.ai/v1` e passa una chiave API di SandBase.

Connessioni MCP, Secrets e cataloghi sono risorse esclusive di SandBase. L'SDK non ha metodi per queste risorse, quindi chiamale via HTTP (oppure con i metodi generici dell'SDK `client.post` / `client.get`).

Versioni dell'SDK verificate:

| SDK | Versioni | Note |
|---|---|---|
| openai-python | 3.13.0, 3.24.0 | `sessions.update(agent=...)` e `sessions.traces` non esistono nella 3.13.0 |
| openai-node | 7.28.0 (Node.js 26) | Usa un dispatcher HTTP/1.1 per lo streaming, vedi [sotto](#node-js-and-http-2) |

## Configurare il client {#set-up-the-client}

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],  # your SandBase API key
    base_url="https://api.sandbase.ai/v1",
)
```

```js [Node.js]
// npm install openai@7.28.0 undici
import OpenAI from 'openai'
import { Agent } from 'undici'

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY, // your SandBase API key
  baseURL: 'https://api.sandbase.ai/v1',
  // HTTP/1.1 keeps the live event stream and the input request on separate connections.
  fetchOptions: { dispatcher: new Agent({ allowH2: false }) },
})
```

:::

L'SDK invia automaticamente `OpenAI-Beta: agents=v1`. SandBase accetta quel valore, oppure nessun header; qualsiasi altro valore restituisce `400`.

## Eseguire un Agent dall'inizio alla fine {#run-an-agent-end-to-end}

Crea un Agent, crea una Session, apri lo stream di eventi live, invia un input e leggi la cronologia. Lo stream è solo live, quindi aprilo prima di inviare l'input.

::: code-group

```python [Python]
import os
import threading
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")

agent = client.beta.agents.create(
    model="deepseek/deepseek-v4-flash",
    name="Research assistant",
    instructions="Keep output brief.",
    metadata={"team": "research"},
)
session = client.beta.agents.sessions.create(
    agent_id=agent.id,
    environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
)

def send_input():
    client.beta.agents.sessions.events.create(
        session.id,
        events=[{
            "type": "agent.session.input.message",
            "input": [{"role": "user", "content": [{"type": "input_text", "text": "Reply with exactly: ok"}]}],
        }],
        idempotency_key="research-input-1",
    )

with client.beta.agents.sessions.events.stream(session.id) as stream:
    threading.Thread(target=send_input).start()
    for event in stream:
        print(event.type)
        if event.type in ("agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"):
            break

for item in client.beta.agents.sessions.items.list(session.id, order="asc", limit=100).data:
    print(item.type, getattr(item, "role", None))

# Clean up: both calls archive the resource.
client.beta.agents.sessions.delete(session.id)
client.beta.agents.delete(agent.id)
```

```js [Node.js]
import OpenAI from 'openai'
import { Agent } from 'undici'

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
  fetchOptions: { dispatcher: new Agent({ allowH2: false }) },
})

const agent = await client.beta.agents.create({
  model: 'deepseek/deepseek-v4-flash',
  name: 'Research assistant',
  instructions: 'Keep output brief.',
  metadata: { team: 'research' },
})
const session = await client.beta.agents.sessions.create({
  agent_id: agent.id,
  environment: { type: 'openai_hosted' }, // Required by the SDK types; SandBase always runs in its hosted cloud.
})

const stream = await client.beta.agents.sessions.events.stream(session.id)
const done = (async () => {
  for await (const event of stream) {
    console.log(event.type)
    if (/^agent\.session\.turn\.(completed|failed|cancelled)$/.test(event.type)) break
  }
})()

await client.beta.agents.sessions.events.create(session.id, {
  events: [{ type: 'agent.session.input.message', input: 'Reply with exactly: ok' }],
  'Idempotency-Key': 'research-input-1',
})
await done

const items = await client.beta.agents.sessions.items.list(session.id, { order: 'asc', limit: 100 })
for (const item of items.data) console.log(item.type, item.role)

// Clean up: both calls archive the resource.
await client.beta.agents.sessions.delete(session.id)
await client.beta.agents.delete(agent.id)
```

:::

`events.create` restituisce `202` senza corpo. Ogni richiesta contiene esattamente un evento. Riusare lo stesso `Idempotency-Key` con lo stesso corpo non avvia un secondo turn. Per fermare il turn in esecuzione, invia `{"type": "agent.session.input.cancel"}` come unico evento.

### Node.js e HTTP/2 {#node-js-and-http-2}

In Node.js 26 `fetch` può negoziare HTTP/2 con l'API di SandBase. In quel caso, su una connessione HTTP/2 condivisa, `events.create` può bloccarsi mentre `events.stream` è aperto sulla stessa connessione, finché lo stream non si chiude. Il dispatcher `undici` con `allowH2: false` mostrato sopra evita il problema. L'SDK Python usa HTTP/1.1 per impostazione predefinita e non richiede modifiche.

## Skills con l'SDK {#skills-with-the-sdk}

`client.skills` funziona come in OpenAI, tranne per il fatto che non è possibile eliminare una singola versione di una Skill. Lo ZIP deve contenere una sola cartella di primo livello con `SKILL.md` al suo interno (`zip -r release-notes.zip release-notes/`). Un `SKILL.md` nella radice dello ZIP restituisce `400 invalid_request`.

::: code-group

```python [Python]
with open("release-notes.zip", "rb") as bundle:
    skill = client.skills.create(files=[("release-notes.zip", bundle.read(), "application/zip")])
print(skill.id, skill.default_version)

zip_bytes = client.skills.content.retrieve(skill.id).read()
```

```js [Node.js]
import fs from 'node:fs'

const skill = await client.skills.create({ files: fs.createReadStream('release-notes.zip') })
console.log(skill.id, skill.default_version)

const zip = Buffer.from(await (await client.skills.content.retrieve(skill.id)).arrayBuffer())
```

:::

Funzionano anche `skills.retrieve`, `skills.list`, `skills.update(default_version=...)`, `skills.versions.create / list / retrieve`, `skills.versions.content.retrieve` e `skills.delete`. Una Skill referenziata da una qualsiasi versione di un Agent non può essere eliminata (`409`); in alternativa imposta `status` su `disabled` con Update Skill.

## Connessioni MCP con l'SDK {#mcp-connections-with-the-sdk}

OpenAI dichiara i server MCP inline come `tools: [{"type": "mcp", ...}]`. SandBase restituisce `400` per questa forma. Registra il server una volta con [`POST /v1/mcp-connections`](/api-reference/mcp-connections/) e referenzialo da `mcp_connections` dell'Agent. I metodi di richiesta generici dell'SDK e i campi extra del corpo coprono entrambi i passaggi:

::: code-group

```python [Python]
import uuid

connection = client.post(
    "/mcp-connections",
    cast_to=object,
    body={"name": "DeepWiki", "server_url": "https://mcp.deepwiki.com/mcp"},
    options={"headers": {"Idempotency-Key": str(uuid.uuid4())}},  # Use a new key per create; reusing one returns the original (possibly disabled) connection.
)
agent = client.beta.agents.update(
    agent.id,
    extra_body={"mcp_connections": [
        {"connection_id": connection["id"], "server_label": "deepwiki", "allowed_tools": None, "required": False},
    ]},
)
```

```js [Node.js]
const connection = await client.post('/mcp-connections', {
  body: { name: 'DeepWiki', server_url: 'https://mcp.deepwiki.com/mcp' },
  headers: { 'Idempotency-Key': crypto.randomUUID() }, // Use a new key per create; reusing one returns the original (possibly disabled) connection.
})
await client.beta.agents.update(agent.id, {
  mcp_connections: [
    { connection_id: connection.id, server_label: 'deepwiki', allowed_tools: null, required: false },
  ],
})
```

:::

La chiamata Node.js passa `mcp_connections` in JavaScript semplice; in TypeScript il campo non fa parte dei tipi dell'SDK. I token Bearer per i server MCP sono salvati come [Secrets](/agents/api-credentials), non come vault di OpenAI.

## Ambiente di esecuzione {#execution-environment}

SandBase esegue ogni Session nel proprio cloud ospitato; non c'è alcun ambiente da scegliere o gestire.

- Le chiamate HTTP dirette omettono `environment`.
- L'SDK di OpenAI richiede un argomento `environment` in `sessions.create` (Python solleva `TypeError` se manca e i tipi Node.js lo rendono obbligatorio). Passa `{"type": "openai_hosted"}`; SandBase lo accetta. Qualsiasi altro valore, come `self_hosted`, restituisce `400`.
- Le risposte delle Session includono un oggetto `environment` per compatibilità con l'SDK. Non devi leggerlo né usarlo.

## Compatibilità in sintesi {#compatibility-at-a-glance}

| Area | Stato | Dettagli |
|---|---|---|
| `beta.agents.create / retrieve / update / list / delete` | Compatibile, con estensioni | Le risposte aggiungono `status`, `version`, `row_version`, `projection_status`, `runtime_profile`, `skills`, `mcp_connections` e altro. `delete` archivia l'Agent e restituisce `agent.deleted`. |
| `beta.agents.sessions.create / retrieve / update / list / delete` | Compatibile, con limiti | Accetta un `agent_id` salvato, un `agent` inline o entrambi; `agent` accetta `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` e `multi_agent`. `stream=True` trasmette in streaming il primo turn e richiede un `input` iniziale. `update` accetta solo `metadata`. `delete` archivia la Session. |
| `sessions.events.stream` | Compatibile | Solo live, come in OpenAI. `Last-Event-ID` o `?after=` restituiscono `400`. |
| `sessions.events.create` | Compatibile, con limiti | Esattamente un evento `agent.session.input.message` o `agent.session.input.cancel` per richiesta; il messaggio ha una sola parte user `input_text` oppure è una stringa semplice. |
| `sessions.items.list`, `sessions.turns.list / retrieve` | Compatibile | Paginazione a cursore con `limit` 1-100, `after`, `order`. |
| `client.skills` e `skills.versions` | Compatibile, tranne l'eliminazione delle versioni | `skills.versions.delete` restituisce `404`. |
| Envelope di errore | Compatibile | `{"error": {"type", "code", "param", "message"}}`; le eccezioni dell'SDK lo espongono come `exc.body`. |
| Versioni, ripristino, archiviazione e catalogo degli Agent; rename/archive/reconnect/files/workspace-files/artifacts delle Session | Solo SandBase | Vedi il riferimento API di [Agents](/api-reference/agents/) e [Session](/api-reference/sessions/). |
| Connessioni MCP, Secrets | Solo SandBase | Usa HTTP oppure `client.post` / `client.get`. |

SandBase espone via HTTP l'[elenco degli artifact](/api-reference/sessions/list-artifacts) e il [download dei contenuti](/api-reference/sessions/download-artifact). Gli ID degli artifact sono opachi e limitati alla Session. Questo non implica il supporto di tutti i metodi dell'SDK per gli artifact; non è esposto un endpoint separato per i metadati degli artifact.

### Non supportato {#not-supported}

Queste chiamate dell'SDK di OpenAI falliscono su SandBase. Il messaggio è l'`error.message` effettivamente restituito.

| Chiamata SDK | Risultato |
|---|---|
| `sessions.create(..., stream=True)` senza un `input` iniziale | `400 invalid_request` |
| `sessions.create(..., environment={"type": "self_hosted"})` | `400`: `only openai_hosted environment is supported` |
| `sessions.create(..., agent={...})` con un campo diverso da `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` e `multi_agent` | `400 invalid_request` |
| `sessions.create(..., vault_ids=[...])` | `400 invalid_request` |
| `sessions.update(..., agent={...})` | `400` (openai-python 3.13.0 non ha il parametro `agent` e solleva `TypeError`) |
| `agents.create(..., multi_agent={"enabled": True})` | `400`: `multi_agent is not supported` |
| `agents.create(..., tools=[{"type": "mcp", ...}])`; tool `tool_search`, `programmatic_tool_calling` e `computer_use` | `400 invalid_request`. Sono accettati solo `function` e un tool `web_search` |
| `events.create` con un evento `tool_result` o di approvazione computer-use | `400 invalid_request`. Le Session che arrivano a `requires_action` non sono supportate |
| `events.create` con più di un evento | `400`: `exactly one text input or cancel event is supported per request` |
| `sessions.traces`, `sessions.subagents`, `environments.templates` | `404 not_found` (openai-python 3.13.0 non ha `traces`) |
| `beta.agents.vaults` | `404` con corpo in testo semplice (`404 page not found`), non con l'envelope di errore JSON |
| `skills.versions.delete` | `404 not_found` |

### Differenze nei campi {#field-differences}

- Le Session riportano gli errori in `failure` (`{code, message, action, retryable?}`), non nel campo `error` di OpenAI. Con l'SDK, `session.error` è `None`; leggi invece `session.failure`.
- `required_actions` e `vault_ids` sono sempre array vuoti.
- I timestamp di Agent e Session sono in secondi Unix. `created_at` delle versioni degli Agent, le connessioni MCP e i Secrets usano stringhe ISO 8601.
- `402 spending_limit_exceeded` non ha una classe di eccezione dedicata nell'SDK; si presenta come un generico `APIStatusError`.
- Un metodo non supportato su un percorso noto (ad esempio `PUT` su `/v1/agents`) restituisce `404` con l'envelope di errore JSON, non `405`.

## Passi successivi {#next-steps}

- [Session](/agents/sessions)
- [Skills e tool MCP](/agents/mcp-tools)
- [Riferimento API degli Agents](/api-reference/agents/)
