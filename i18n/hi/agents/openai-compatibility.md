---
i18nSource: d637409019c8109d
title: OpenAI संगतता
description: SandBase Agents, Sessions और Skills के साथ आधिकारिक OpenAI SDK का उपयोग करें, और देखें कि SandBase, OpenAI Agents API से कहाँ अलग है।
---

# OpenAI संगतता {#openai-compatibility}

SandBase Agents, Agents, Sessions, session events, items, turns और Skills के लिए [OpenAI Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview) protocol लागू करते हैं। इन resources के लिए आप आधिकारिक OpenAI SDK सीधे उपयोग कर सकते हैं: `base_url` को `https://api.sandbase.ai/v1` पर सेट करें और SandBase API key पास करें।

MCP connections, Secrets और catalogs केवल SandBase के resources हैं। SDK में इनके लिए कोई method नहीं है, इसलिए इन्हें HTTP से call करें (या SDK के generic `client.post` / `client.get` से)।

जाँचे गए SDK versions:

| SDK | Versions | नोट्स |
|---|---|---|
| openai-python | 3.13.0, 3.24.0 | `sessions.update(agent=...)` और `sessions.traces` 3.13.0 में मौजूद नहीं हैं |
| openai-node | 7.28.0 (Node.js 26) | streaming के लिए HTTP/1.1 dispatcher का उपयोग करें, [नीचे](#node-js-and-http-2) देखें |

## Client सेट अप करें {#set-up-the-client}

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

SDK `OpenAI-Beta: agents=v1` अपने-आप भेजता है। SandBase यह value स्वीकार करता है, या बिना header के भी काम करता है; कोई और value `400` लौटाती है।

## Agent को शुरू से अंत तक चलाएँ {#run-an-agent-end-to-end}

एक Agent बनाएँ, एक Session बनाएँ, live event stream खोलें, एक input भेजें और history पढ़ें। Stream केवल live है, इसलिए input भेजने से पहले उसे खोलें।

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

`events.create` बिना body के `202` लौटाता है। हर request में ठीक एक event होता है। उसी body के साथ वही `Idempotency-Key` दोबारा उपयोग करने से दूसरा turn शुरू नहीं होता। चल रहे turn को रोकने के लिए, एकमात्र event के रूप में `{"type": "agent.session.input.cancel"}` भेजें।

### Node.js और HTTP/2 {#node-js-and-http-2}

Node.js 26 का `fetch` SandBase API के साथ HTTP/2 negotiate कर सकता है। ऐसा होने पर, साझा HTTP/2 connection पर `events.create` तब तक अटक सकता है जब तक उसी connection पर खुला `events.stream` बंद न हो जाए। ऊपर दिया गया `allowH2: false` वाला `undici` dispatcher इससे बचाता है। Python SDK default रूप से HTTP/1.1 का उपयोग करता है और उसमें कोई बदलाव ज़रूरी नहीं है।

## SDK के साथ Skills {#skills-with-the-sdk}

`client.skills` OpenAI की तरह ही काम करता है, सिवाय इसके कि किसी एक Skill version को delete करना उपलब्ध नहीं है। ZIP में एक top-level folder होना चाहिए जिसके अंदर `SKILL.md` हो (`zip -r release-notes.zip release-notes/`)। ZIP root पर रखा `SKILL.md` `400 invalid_request` लौटाता है।

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

`skills.retrieve`, `skills.list`, `skills.update(default_version=...)`, `skills.versions.create / list / retrieve`, `skills.versions.content.retrieve` और `skills.delete` भी काम करते हैं। जिस Skill को कोई भी Agent version reference करता है, उसे delete नहीं किया जा सकता (`409`); इसके बजाय Update Skill से `status` को `disabled` पर सेट करें।

## SDK के साथ MCP connections {#mcp-connections-with-the-sdk}

OpenAI, MCP servers को inline रूप में `tools: [{"type": "mcp", ...}]` की तरह declare करता है। SandBase इस रूप के लिए `400` लौटाता है। Server को एक बार [`POST /v1/mcp-connections`](/api-reference/mcp-connections/) से register करें और Agent के `mcp_connections` से उसे reference करें। SDK के generic request methods और अतिरिक्त body fields दोनों चरणों को कवर करते हैं:

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

Node.js call सामान्य JavaScript में `mcp_connections` पास करता है; TypeScript में यह field SDK types का हिस्सा नहीं है। MCP servers के Bearer tokens [Secrets](/agents/api-credentials) के रूप में संग्रहीत होते हैं, OpenAI vaults के रूप में नहीं।

## एक्ज़ीक्यूशन एनवायरनमेंट {#execution-environment}

SandBase हर Session को अपने hosted cloud में चलाता है; चुनने या मैनेज करने के लिए कोई environment नहीं है।

- Direct HTTP calls में `environment` नहीं दिया जाता।
- OpenAI SDK को `sessions.create` पर `environment` argument चाहिए (इसके बिना Python `TypeError` देता है, और Node.js types में यह ज़रूरी है)। `{"type": "openai_hosted"}` पास करें; SandBase इसे स्वीकार करता है। कोई अन्य value, जैसे `self_hosted`, `400` लौटाती है।
- SDK compatibility के लिए Session responses में एक `environment` object शामिल होता है। आपको इसे पढ़ने या इस पर कार्रवाई करने की ज़रूरत नहीं है।

## Compatibility एक नज़र में {#compatibility-at-a-glance}

| क्षेत्र | स्थिति | विवरण |
|---|---|---|
| `beta.agents.create / retrieve / update / list / delete` | Compatible, extensions के साथ | Responses में `status`, `version`, `row_version`, `projection_status`, `runtime_profile`, `skills`, `mcp_connections` और अन्य fields जुड़ते हैं। `delete` Agent को archive करता है और `agent.deleted` लौटाता है। |
| `beta.agents.sessions.create / retrieve / update / list / delete` | Compatible, सीमाओं के साथ | सहेजा गया `agent_id`, inline `agent`, या दोनों स्वीकार करता है; `agent` में `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` और `multi_agent` स्वीकार होते हैं। `stream=True` पहले turn को stream करता है और इसके लिए शुरुआती `input` चाहिए। `update` केवल `metadata` स्वीकार करता है। `delete` Session को archive करता है। |
| `sessions.events.stream` | Compatible | OpenAI की तरह केवल live। `Last-Event-ID` या `?after=` `400` लौटाता है। |
| `sessions.events.create` | Compatible, सीमाओं के साथ | प्रति request ठीक एक `agent.session.input.message` या `agent.session.input.cancel` event; message में एक user `input_text` part या साधारण string होती है। |
| `sessions.items.list`, `sessions.turns.list / retrieve` | Compatible | `limit` 1-100, `after`, `order` के साथ cursor pagination। |
| `client.skills` और `skills.versions` | Compatible, version delete को छोड़कर | `skills.versions.delete` `404` लौटाता है। |
| Error envelope | Compatible | `{"error": {"type", "code", "param", "message"}}`; SDK exceptions इसे `exc.body` के रूप में देती हैं। |
| Agent versions, restore, archive, catalog, Session rename/archive/reconnect/files/workspace-files/artifacts | केवल SandBase | [Agents](/api-reference/agents/) और [Sessions](/api-reference/sessions/) API reference देखें। |
| MCP connections, Secrets | केवल SandBase | HTTP या `client.post` / `client.get` का उपयोग करें। |

SandBase HTTP पर [artifact listing](/api-reference/sessions/list-artifacts) और [content downloads](/api-reference/sessions/download-artifact) उपलब्ध कराता है। Artifact IDs opaque होते हैं और Session तक सीमित होते हैं। इसका मतलब यह नहीं कि हर SDK artifact method समर्थित है; अलग artifact metadata endpoint उपलब्ध नहीं है।

### समर्थित नहीं {#not-supported}

ये OpenAI SDK calls SandBase पर विफल होती हैं। Message वही वास्तविक `error.message` है जो लौटाया जाता है।

| SDK call | परिणाम |
|---|---|
| शुरुआती `input` के बिना `sessions.create(..., stream=True)` | `400 invalid_request` |
| `sessions.create(..., environment={"type": "self_hosted"})` | `400`: `only openai_hosted environment is supported` |
| `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` और `multi_agent` के अलावा किसी field के साथ `sessions.create(..., agent={...})` | `400 invalid_request` |
| `sessions.create(..., vault_ids=[...])` | `400 invalid_request` |
| `sessions.update(..., agent={...})` | `400` (openai-python 3.13.0 में `agent` parameter नहीं है और यह `TypeError` देता है) |
| `agents.create(..., multi_agent={"enabled": True})` | `400`: `multi_agent is not supported` |
| `agents.create(..., tools=[{"type": "mcp", ...}])`; `tool_search`, `programmatic_tool_calling` और `computer_use` tools | `400 invalid_request`। केवल `function` और एक `web_search` tool स्वीकार होते हैं |
| `tool_result` या computer-use approval event के साथ `events.create` | `400 invalid_request`। `requires_action` तक पहुँचने वाले Sessions समर्थित नहीं हैं |
| एक से अधिक event के साथ `events.create` | `400`: `exactly one text input or cancel event is supported per request` |
| `sessions.traces`, `sessions.subagents`, `environments.templates` | `404 not_found` (openai-python 3.13.0 में `traces` नहीं है) |
| `beta.agents.vaults` | plain-text body (`404 page not found`) के साथ `404`, JSON error envelope नहीं |
| `skills.versions.delete` | `404 not_found` |

### Field अंतर {#field-differences}

- Sessions विफलताओं को `failure` (`{code, message, action, retryable?}`) में बताते हैं, OpenAI के `error` में नहीं। SDK के साथ `session.error` `None` होता है; इसके बजाय `session.failure` पढ़ें।
- `required_actions` और `vault_ids` हमेशा खाली arrays होते हैं।
- Agent और Session timestamps Unix seconds में होते हैं। Agent version का `created_at`, MCP connections और Secrets ISO 8601 strings का उपयोग करते हैं।
- `402 spending_limit_exceeded` के लिए कोई समर्पित SDK exception class नहीं है; यह generic `APIStatusError` के रूप में सामने आता है।
- किसी ज्ञात path पर असमर्थित method (जैसे `/v1/agents` पर `PUT`) JSON error envelope के साथ `404` लौटाता है, `405` नहीं।

## अगले कदम {#next-steps}

- [Sessions](/agents/sessions)
- [Skills और MCP tools](/agents/mcp-tools)
- [Agents API reference](/api-reference/agents/)

