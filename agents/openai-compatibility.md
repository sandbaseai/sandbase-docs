---
title: OpenAI compatibility
description: Use the official OpenAI SDK with SandBase Agents, Sessions, and Skills, and see where SandBase differs from the OpenAI Agents API.
---

# OpenAI compatibility

SandBase Agents implement the [OpenAI Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview) protocol for Agents, Sessions, session events, items, turns, and Skills. For those resources you can use the official OpenAI SDK directly: point `base_url` at `https://api.sandbase.ai/v1` and pass a SandBase API key.

Services, Schedules, MCP connections, Secrets, and the catalogs are SandBase-only resources. The SDK has no methods for them, so call them over HTTP (or with the SDK's generic `client.post` / `client.get`).

Verified SDK versions:

| SDK | Versions | Notes |
|---|---|---|
| openai-python | 3.13.0, 3.24.0 | `sessions.update(agent=...)` and `sessions.traces` do not exist in 3.13.0 |
| openai-node | 7.28.0 (Node.js 26) | Use an HTTP/1.1 dispatcher for streaming, see [below](#node-js-and-http-2) |

## Set up the client

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

The SDK sends `OpenAI-Beta: agents=v1` automatically. SandBase accepts that value, or no header at all; any other value returns `400`.

## Run an Agent end to end

Create an Agent, create a Session, open the live event stream, send one input, and read the history. The stream is live-only, so open it before you send input.

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

`events.create` returns `202` with no body. Each request carries exactly one event. Reusing the same `Idempotency-Key` with the same body does not start a second turn. To stop the running turn, send `{"type": "agent.session.input.cancel"}` as the single event.

### Node.js and HTTP/2

Node.js 26 `fetch` may negotiate HTTP/2 with the SandBase API. If it does, on a shared HTTP/2 connection `events.create` can stall while `events.stream` is open on the same connection, until the stream closes. The `undici` dispatcher with `allowH2: false` above avoids this. The Python SDK uses HTTP/1.1 by default and needs no change.

## Skills with the SDK

`client.skills` works as in OpenAI, except that deleting a single Skill version is not available. The ZIP must contain one top-level folder with `SKILL.md` inside it (`zip -r release-notes.zip release-notes/`). A `SKILL.md` at the ZIP root returns `400 invalid_request`.

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

`skills.retrieve`, `skills.list`, `skills.update(default_version=...)`, `skills.versions.create / list / retrieve`, `skills.versions.content.retrieve`, and `skills.delete` work as well. A Skill referenced by any Agent version cannot be deleted (`409`); set `status` to `disabled` with Update Skill instead.

## MCP connections with the SDK

OpenAI declares MCP servers inline as `tools: [{"type": "mcp", ...}]`. SandBase returns `400` for that form. Register the server once with [`POST /v1/mcp-connections`](/api-reference/mcp-connections/) and reference it from the Agent's `mcp_connections`. The SDK's generic request methods and extra body fields cover both steps:

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

The Node.js call passes `mcp_connections` in plain JavaScript; in TypeScript the field is not part of the SDK types. Bearer tokens for MCP servers are stored as [Secrets](/agents/api-credentials), not OpenAI vaults.

## Execution environment

SandBase runs every Session in its hosted cloud; there is no environment to choose or manage.

- Direct HTTP calls omit `environment`.
- The OpenAI SDK requires an `environment` argument on `sessions.create` (Python raises `TypeError` without it, and the Node.js types require it). Pass `{"type": "openai_hosted"}`; SandBase accepts it. Any other value, such as `self_hosted`, returns `400`.
- Session responses include an `environment` object for SDK compatibility. You do not need to read or act on it.

## Compatibility at a glance

| Area | Status | Details |
|---|---|---|
| `beta.agents.create / retrieve / update / list / delete` | Compatible, with extensions | Responses add `status`, `version`, `row_version`, `projection_status`, `runtime_profile`, `skills`, `mcp_connections`, and more. `delete` archives the Agent and returns `agent.deleted`. |
| `beta.agents.sessions.create / retrieve / update / list / delete` | Compatible, with limits | Requires a saved `agent_id`; `agent` only accepts `{"model": ...}`. `update` only accepts `metadata`. `delete` archives the Session. |
| `sessions.events.stream` | Compatible | Live-only, like OpenAI. `Last-Event-ID` or `?after=` returns `400`. |
| `sessions.events.create` | Compatible, with limits | Exactly one `agent.session.input.message` or `agent.session.input.cancel` event per request; the message has one user `input_text` part or a plain string. |
| `sessions.items.list`, `sessions.turns.list / retrieve` | Compatible | Cursor pagination with `limit` 1-100, `after`, `order`. |
| `client.skills` and `skills.versions` | Compatible, except version delete | `skills.versions.delete` returns `404`. |
| Error envelope | Compatible | `{"error": {"type", "code", "param", "message"}}`; SDK exceptions expose it as `exc.body`. |
| Agent versions, restore, archive, catalog, Session rename/archive/reconnect/files | SandBase only | See the [Agents](/api-reference/agents/) and [Sessions](/api-reference/sessions/) API reference. |
| Services, Schedules, MCP connections, Secrets | SandBase only | Use HTTP or `client.post` / `client.get`. |

### Not supported

These OpenAI SDK calls fail against SandBase. The message is the actual `error.message` returned.

| SDK call | Result |
|---|---|
| `sessions.create(...)` with `agent` but no `agent_id` (inline Agent) | `400`: `a saved SandBase agent_id and openai_hosted environment are required; standalone inline agents are unsupported` |
| `sessions.create(..., stream=True)` (also `with_result_collection()`) | `400`: `creation streaming is not supported; create the session then subscribe to events before sending input` |
| `sessions.create(..., environment={"type": "self_hosted"})` | `400`, same message as the inline Agent case |
| `sessions.create(..., vault_ids=[...])` | `400 invalid_request` |
| `sessions.update(..., agent={...})` | `400` (openai-python 3.13.0 has no `agent` parameter and raises `TypeError`) |
| `agents.create(..., multi_agent={"enabled": True})` | `400`: `multi_agent is not supported` |
| `agents.create(..., tools=[{"type": "mcp", ...}])`; `tool_search`, `programmatic_tool_calling`, and `computer_use` tools | `400 invalid_request`. Only `function` and one `web_search` tool are accepted |
| `events.create` with a `tool_result` or computer-use approval event | `400 invalid_request`. Sessions that reach `requires_action` are not supported |
| `events.create` with more than one event | `400`: `exactly one text input or cancel event is supported per request` |
| `sessions.artifacts`, `sessions.traces`, `sessions.subagents`, `environments.templates` | `404 not_found` (openai-python 3.13.0 has no `traces`) |
| `beta.agents.vaults` | `404` with a plain-text body (`404 page not found`), not the JSON error envelope |
| `skills.versions.delete` | `404 not_found` |

### Field differences

- Sessions report failures in `failure` (`{code, message, action, retryable?}`), not OpenAI's `error`. With the SDK, `session.error` is `None`; read `session.failure` instead.
- `required_actions` and `vault_ids` are always empty arrays.
- Agent and Session timestamps are Unix seconds. Agent version `created_at`, MCP connections, Secrets, and Runs use ISO 8601 strings.
- `402 spending_limit_exceeded` has no dedicated SDK exception class; it surfaces as a generic `APIStatusError`.
- An unsupported method on a known path (for example `PUT` on `/v1/agents`) returns `404` with the JSON error envelope, not `405`.

## Next steps

- [Sessions](/agents/sessions)
- [Skills and MCP tools](/agents/mcp-tools)
- [Agents API reference](/api-reference/agents/)
