---
i18nSource: d637409019c8109d
title: OpenAI-Kompatibilität
description: Verwende das offizielle OpenAI SDK mit SandBase Agents, Sessions und Skills, und erfahre, wo SandBase von der OpenAI Agents API abweicht.
---

# OpenAI-Kompatibilität {#openai-compatibility}

SandBase Agents implementieren das Protokoll der [OpenAI Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview) für Agents, Sessions, Session-Events, Items, Turns und Skills. Für diese Ressourcen kannst du das offizielle OpenAI SDK direkt verwenden: Setze `base_url` auf `https://api.sandbase.ai/v1` und übergib einen SandBase-API-Schlüssel.

MCP-Verbindungen, Secrets und die Kataloge sind Ressourcen, die es nur bei SandBase gibt. Das SDK hat dafür keine Methoden, daher rufst du sie über HTTP auf (oder mit den generischen SDK-Methoden `client.post` / `client.get`).

Geprüfte SDK-Versionen:

| SDK | Versionen | Hinweise |
|---|---|---|
| openai-python | 3.13.0, 3.24.0 | `sessions.update(agent=...)` und `sessions.traces` gibt es in 3.13.0 nicht |
| openai-node | 7.28.0 (Node.js 26) | Verwende für Streaming einen HTTP/1.1-Dispatcher, siehe [unten](#node-js-and-http-2) |

## Client einrichten {#set-up-the-client}

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

Das SDK sendet `OpenAI-Beta: agents=v1` automatisch. SandBase akzeptiert diesen Wert oder gar keinen Header; jeder andere Wert liefert `400`.

## Agent vollständig ausführen {#run-an-agent-end-to-end}

Erstelle einen Agent, erstelle eine Session, öffne den Live-Event-Stream, sende eine Eingabe und lies den Verlauf. Der Stream ist nur live, öffne ihn also, bevor du die Eingabe sendest.

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

`events.create` liefert `202` ohne Body. Jede Anfrage enthält genau ein Event. Wird derselbe `Idempotency-Key` mit demselben Body wiederverwendet, startet kein zweiter Turn. Um den laufenden Turn zu stoppen, sende `{"type": "agent.session.input.cancel"}` als einziges Event.

### Node.js und HTTP/2 {#node-js-and-http-2}

`fetch` in Node.js 26 kann mit der SandBase API HTTP/2 aushandeln. In diesem Fall kann `events.create` auf einer gemeinsam genutzten HTTP/2-Verbindung hängen bleiben, solange `events.stream` auf derselben Verbindung offen ist, bis der Stream geschlossen wird. Der oben gezeigte `undici`-Dispatcher mit `allowH2: false` verhindert das. Das Python SDK verwendet standardmäßig HTTP/1.1 und braucht keine Änderung.

## Skills mit dem SDK {#skills-with-the-sdk}

`client.skills` funktioniert wie bei OpenAI, nur das Löschen einer einzelnen Skill-Version ist nicht verfügbar. Das ZIP muss genau einen Ordner auf oberster Ebene enthalten, in dem `SKILL.md` liegt (`zip -r release-notes.zip release-notes/`). Eine `SKILL.md` im ZIP-Stammverzeichnis liefert `400 invalid_request`.

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

`skills.retrieve`, `skills.list`, `skills.update(default_version=...)`, `skills.versions.create / list / retrieve`, `skills.versions.content.retrieve` und `skills.delete` funktionieren ebenfalls. Ein Skill, auf den eine beliebige Agent-Version verweist, kann nicht gelöscht werden (`409`); setze stattdessen mit Update Skill `status` auf `disabled`.

## MCP-Verbindungen mit dem SDK {#mcp-connections-with-the-sdk}

OpenAI deklariert MCP-Server inline als `tools: [{"type": "mcp", ...}]`. SandBase liefert für diese Form `400`. Registriere den Server einmal mit [`POST /v1/mcp-connections`](/api-reference/mcp-connections/) und referenziere ihn in `mcp_connections` des Agents. Die generischen Request-Methoden und zusätzlichen Body-Felder des SDK decken beide Schritte ab:

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

Der Node.js-Aufruf übergibt `mcp_connections` in reinem JavaScript; in TypeScript ist das Feld nicht Teil der SDK-Typen. Bearer-Tokens für MCP-Server werden als [Secrets](/agents/api-credentials) gespeichert, nicht in OpenAI-Vaults.

## Ausführungsumgebung {#execution-environment}

SandBase führt jede Session in seiner gehosteten Cloud aus; es gibt keine Umgebung, die du auswählen oder verwalten musst.

- Direkte HTTP-Aufrufe lassen `environment` weg.
- Das OpenAI SDK verlangt bei `sessions.create` ein `environment`-Argument (Python wirft ohne es einen `TypeError`, und die Node.js-Typen setzen es voraus). Übergib `{"type": "openai_hosted"}`; SandBase akzeptiert das. Jeder andere Wert, etwa `self_hosted`, liefert `400`.
- Session-Antworten enthalten aus Gründen der SDK-Kompatibilität ein `environment`-Objekt. Du musst es weder lesen noch darauf reagieren.

## Kompatibilität auf einen Blick {#compatibility-at-a-glance}

| Bereich | Status | Details |
|---|---|---|
| `beta.agents.create / retrieve / update / list / delete` | Kompatibel, mit Erweiterungen | Antworten enthalten zusätzlich `status`, `version`, `row_version`, `projection_status`, `runtime_profile`, `skills`, `mcp_connections` und mehr. `delete` archiviert den Agent und liefert `agent.deleted`. |
| `beta.agents.sessions.create / retrieve / update / list / delete` | Kompatibel, mit Einschränkungen | Akzeptiert eine gespeicherte `agent_id`, einen inline `agent` oder beides; `agent` akzeptiert `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` und `multi_agent`. `stream=True` streamt den ersten Turn und benötigt ein initiales `input`. `update` akzeptiert nur `metadata`. `delete` archiviert die Session. |
| `sessions.events.stream` | Kompatibel | Nur live, wie bei OpenAI. `Last-Event-ID` oder `?after=` liefert `400`. |
| `sessions.events.create` | Kompatibel, mit Einschränkungen | Genau ein `agent.session.input.message`- oder `agent.session.input.cancel`-Event pro Anfrage; die Nachricht hat einen `input_text`-Teil der Rolle user oder ist ein einfacher String. |
| `sessions.items.list`, `sessions.turns.list / retrieve` | Kompatibel | Cursor-Paginierung mit `limit` 1–100, `after`, `order`. |
| `client.skills` und `skills.versions` | Kompatibel, außer Löschen von Versionen | `skills.versions.delete` liefert `404`. |
| Error-Envelope | Kompatibel | `{"error": {"type", "code", "param", "message"}}`; SDK-Exceptions stellen es als `exc.body` bereit. |
| Agent-Versionen, Wiederherstellen, Archivieren, Katalog, Session umbenennen/archivieren/neu verbinden/Dateien/Workspace-Dateien/Artefakte | Nur SandBase | Siehe die API-Referenz zu [Agents](/api-reference/agents/) und [Sessions](/api-reference/sessions/). |
| MCP-Verbindungen, Secrets | Nur SandBase | HTTP oder `client.post` / `client.get` verwenden. |

SandBase stellt die [Auflistung von Artefakten](/api-reference/sessions/list-artifacts) und den [Download von Inhalten](/api-reference/sessions/download-artifact) über HTTP bereit. Artefakt-IDs sind opak und auf die Session beschränkt. Das bedeutet nicht, dass jede Artefakt-Methode des SDK unterstützt wird; ein separater Endpunkt für Artefakt-Metadaten ist nicht verfügbar.

### Nicht unterstützt {#not-supported}

Diese Aufrufe des OpenAI SDK schlagen bei SandBase fehl. Die Meldung ist die tatsächlich zurückgegebene `error.message`.

| SDK-Aufruf | Ergebnis |
|---|---|
| `sessions.create(..., stream=True)` ohne initiales `input` | `400 invalid_request` |
| `sessions.create(..., environment={"type": "self_hosted"})` | `400`: `only openai_hosted environment is supported` |
| `sessions.create(..., agent={...})` mit einem anderen Feld als `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` und `multi_agent` | `400 invalid_request` |
| `sessions.create(..., vault_ids=[...])` | `400 invalid_request` |
| `sessions.update(..., agent={...})` | `400` (openai-python 3.13.0 hat keinen Parameter `agent` und wirft `TypeError`) |
| `agents.create(..., multi_agent={"enabled": True})` | `400`: `multi_agent is not supported` |
| `agents.create(..., tools=[{"type": "mcp", ...}])`; Tools `tool_search`, `programmatic_tool_calling` und `computer_use` | `400 invalid_request`. Nur `function` und ein `web_search`-Tool werden akzeptiert |
| `events.create` mit einem `tool_result`- oder Computer-Use-Freigabe-Event | `400 invalid_request`. Sessions, die `requires_action` erreichen, werden nicht unterstützt |
| `events.create` mit mehr als einem Event | `400`: `exactly one text input or cancel event is supported per request` |
| `sessions.traces`, `sessions.subagents`, `environments.templates` | `404 not_found` (openai-python 3.13.0 hat kein `traces`) |
| `beta.agents.vaults` | `404` mit einem Klartext-Body (`404 page not found`), nicht mit dem JSON-Error-Envelope |
| `skills.versions.delete` | `404 not_found` |

### Unterschiede bei Feldern {#field-differences}

- Sessions melden Fehler in `failure` (`{code, message, action, retryable?}`), nicht in OpenAIs `error`. Mit dem SDK ist `session.error` `None`; lies stattdessen `session.failure`.
- `required_actions` und `vault_ids` sind immer leere Arrays.
- Zeitstempel von Agents und Sessions sind Unix-Sekunden. `created_at` von Agent-Versionen, MCP-Verbindungen und Secrets verwenden ISO-8601-Strings.
- `402 spending_limit_exceeded` hat keine eigene Exception-Klasse im SDK; der Fehler erscheint als generischer `APIStatusError`.
- Eine nicht unterstützte Methode auf einem bekannten Pfad (zum Beispiel `PUT` auf `/v1/agents`) liefert `404` mit dem JSON-Error-Envelope, nicht `405`.

## Nächste Schritte {#next-steps}

- [Sessions](/agents/sessions)
- [Skills und MCP-Tools](/agents/mcp-tools)
- [Agents-API-Referenz](/api-reference/agents/)
