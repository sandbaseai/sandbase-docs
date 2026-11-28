---
i18nSource: d637409019c8109d
title: OpenAI uyumluluğu
description: Resmi OpenAI SDK'sını SandBase Agents, Sessions ve Skills ile kullanın ve SandBase'in OpenAI Agents API'sinden nerelerde ayrıldığını görün.
---

# OpenAI uyumluluğu {#openai-compatibility}

SandBase Agents; Agents, Sessions, oturum olayları, item'lar, turlar ve Skills için [OpenAI Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview) protokolünü uygular. Bu kaynaklar için resmi OpenAI SDK'sını doğrudan kullanabilirsiniz: `base_url` değerini `https://api.sandbase.ai/v1` adresine yönlendirin ve bir SandBase API anahtarı verin.

MCP bağlantıları, Secrets ve kataloglar yalnızca SandBase'e özgü kaynaklardır. SDK'da bunlar için metot olmadığından bunları HTTP üzerinden (veya SDK'nın genel `client.post` / `client.get` metotlarıyla) çağırın.

Doğrulanmış SDK sürümleri:

| SDK | Sürümler | Notlar |
|---|---|---|
| openai-python | 3.13.0, 3.24.0 | `sessions.update(agent=...)` ve `sessions.traces` 3.13.0'da yoktur |
| openai-node | 7.28.0 (Node.js 26) | Akış için bir HTTP/1.1 dispatcher kullanın, [aşağıya](#node-js-and-http-2) bakın |

## İstemciyi kurun {#set-up-the-client}

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

SDK `OpenAI-Beta: agents=v1` başlığını otomatik olarak gönderir. SandBase bu değeri veya başlığın hiç gönderilmemesini kabul eder; başka herhangi bir değer `400` döndürür.

## Bir Agent'ı uçtan uca çalıştırın {#run-an-agent-end-to-end}

Bir Agent oluşturun, bir Session oluşturun, canlı olay akışını açın, bir girdi gönderin ve geçmişi okuyun. Akış yalnızca canlıdır, bu yüzden girdi göndermeden önce açın.

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

`events.create` gövdesiz `202` döndürür. Her istek tam olarak bir olay taşır. Aynı `Idempotency-Key` değerini aynı gövdeyle yeniden kullanmak ikinci bir tur başlatmaz. Çalışan turu durdurmak için tek olay olarak `{"type": "agent.session.input.cancel"}` gönderin.

### Node.js ve HTTP/2 {#node-js-and-http-2}

Node.js 26 `fetch`, SandBase API ile HTTP/2 üzerinde anlaşabilir. Bu durumda paylaşılan bir HTTP/2 bağlantısında, aynı bağlantı üzerinde `events.stream` açıkken `events.create` akış kapanana kadar takılabilir. Yukarıdaki `allowH2: false` ayarlı `undici` dispatcher bunu önler. Python SDK'sı varsayılan olarak HTTP/1.1 kullanır ve değişiklik gerektirmez.

## SDK ile Skills {#skills-with-the-sdk}

`client.skills`, tek bir Skill sürümünü silmenin mümkün olmaması dışında OpenAI'daki gibi çalışır. ZIP, içinde `SKILL.md` bulunan tek bir üst düzey klasör içermelidir (`zip -r release-notes.zip release-notes/`). ZIP kök dizinindeki bir `SKILL.md` `400 invalid_request` döndürür.

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

`skills.retrieve`, `skills.list`, `skills.update(default_version=...)`, `skills.versions.create / list / retrieve`, `skills.versions.content.retrieve` ve `skills.delete` de çalışır. Herhangi bir Agent sürümünün başvurduğu bir Skill silinemez (`409`); bunun yerine Update Skill ile `status` değerini `disabled` yapın.

## SDK ile MCP bağlantıları {#mcp-connections-with-the-sdk}

OpenAI, MCP sunucularını satır içinde `tools: [{"type": "mcp", ...}]` olarak tanımlar. SandBase bu biçim için `400` döndürür. Sunucuyu [`POST /v1/mcp-connections`](/api-reference/mcp-connections/) ile bir kez kaydedin ve Agent'ın `mcp_connections` alanından ona başvurun. SDK'nın genel istek metotları ve ek gövde alanları her iki adımı da karşılar:

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

Node.js çağrısı `mcp_connections` alanını düz JavaScript'te iletir; TypeScript'te bu alan SDK türlerinin bir parçası değildir. MCP sunucuları için Bearer token'lar OpenAI vault'larında değil, [Secrets](/agents/api-credentials) olarak saklanır.

## Yürütme ortamı {#execution-environment}

SandBase her Session'ı kendi barındırılan bulutunda çalıştırır; seçilecek veya yönetilecek bir ortam yoktur.

- Doğrudan HTTP çağrılarında `environment` gönderilmez.
- OpenAI SDK'sı `sessions.create` üzerinde bir `environment` argümanı gerektirir (Python bu argüman olmadan `TypeError` fırlatır, Node.js türleri de bunu zorunlu kılar). `{"type": "openai_hosted"}` iletin; SandBase bunu kabul eder. `self_hosted` gibi başka herhangi bir değer `400` döndürür.
- Session yanıtları SDK uyumluluğu için bir `environment` nesnesi içerir. Bunu okumanız veya buna göre işlem yapmanız gerekmez.

## Bir bakışta uyumluluk {#compatibility-at-a-glance}

| Alan | Durum | Ayrıntılar |
|---|---|---|
| `beta.agents.create / retrieve / update / list / delete` | Uyumlu, uzantılarla | Yanıtlara `status`, `version`, `row_version`, `projection_status`, `runtime_profile`, `skills`, `mcp_connections` ve daha fazlası eklenir. `delete` Agent'ı arşivler ve `agent.deleted` döndürür. |
| `beta.agents.sessions.create / retrieve / update / list / delete` | Uyumlu, sınırlamalarla | Kayıtlı bir `agent_id`, satır içi bir `agent` veya her ikisini kabul eder; `agent`, `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` ve `multi_agent` alanlarını kabul eder. `stream=True` ilk turu akış olarak verir ve bir başlangıç `input` değeri gerektirir. `update` yalnızca `metadata` kabul eder. `delete` Session'ı arşivler. |
| `sessions.events.stream` | Uyumlu | OpenAI'daki gibi yalnızca canlı. `Last-Event-ID` veya `?after=` `400` döndürür. |
| `sessions.events.create` | Uyumlu, sınırlamalarla | İstek başına tam olarak bir `agent.session.input.message` veya `agent.session.input.cancel` olayı; mesaj bir user `input_text` parçası veya düz bir dize içerir. |
| `sessions.items.list`, `sessions.turns.list / retrieve` | Uyumlu | `limit` 1-100, `after`, `order` ile cursor sayfalama. |
| `client.skills` ve `skills.versions` | Sürüm silme dışında uyumlu | `skills.versions.delete` `404` döndürür. |
| Hata zarfı | Uyumlu | `{"error": {"type", "code", "param", "message"}}`; SDK istisnaları bunu `exc.body` olarak sunar. |
| Agent sürümleri, geri yükleme, arşivleme, katalog, Session yeniden adlandırma/arşivleme/yeniden bağlanma/dosyalar/çalışma alanı dosyaları/yapıtlar | Yalnızca SandBase | [Agents](/api-reference/agents/) ve [Sessions](/api-reference/sessions/) API referansına bakın. |
| MCP bağlantıları, Secrets | Yalnızca SandBase | HTTP veya `client.post` / `client.get` kullanın. |

SandBase, [yapıt listelemeyi](/api-reference/sessions/list-artifacts) ve [içerik indirmelerini](/api-reference/sessions/download-artifact) HTTP üzerinden sunar. Yapıt kimlikleri opaktır ve Session kapsamındadır. Bu, her SDK yapıt metodunun desteklendiği anlamına gelmez; ayrı bir yapıt meta veri uç noktası sunulmaz.

### Desteklenmeyenler {#not-supported}

Aşağıdaki OpenAI SDK çağrıları SandBase'de başarısız olur. Mesaj, döndürülen gerçek `error.message` değeridir.

| SDK çağrısı | Sonuç |
|---|---|
| Başlangıç `input` değeri olmadan `sessions.create(..., stream=True)` | `400 invalid_request` |
| `sessions.create(..., environment={"type": "self_hosted"})` | `400`: `only openai_hosted environment is supported` |
| `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` ve `multi_agent` dışında bir alan içeren `sessions.create(..., agent={...})` | `400 invalid_request` |
| `sessions.create(..., vault_ids=[...])` | `400 invalid_request` |
| `sessions.update(..., agent={...})` | `400` (openai-python 3.13.0'da `agent` parametresi yoktur ve `TypeError` fırlatır) |
| `agents.create(..., multi_agent={"enabled": True})` | `400`: `multi_agent is not supported` |
| `agents.create(..., tools=[{"type": "mcp", ...}])`; `tool_search`, `programmatic_tool_calling` ve `computer_use` araçları | `400 invalid_request`. Yalnızca `function` ve bir `web_search` aracı kabul edilir |
| `tool_result` veya computer-use onay olayı içeren `events.create` | `400 invalid_request`. `requires_action` durumuna ulaşan Sessions desteklenmez |
| Birden fazla olay içeren `events.create` | `400`: `exactly one text input or cancel event is supported per request` |
| `sessions.traces`, `sessions.subagents`, `environments.templates` | `404 not_found` (openai-python 3.13.0'da `traces` yoktur) |
| `beta.agents.vaults` | JSON hata zarfı yerine düz metin gövdeli (`404 page not found`) `404` |
| `skills.versions.delete` | `404 not_found` |

### Alan farkları {#field-differences}

- Sessions hataları OpenAI'ın `error` alanında değil, `failure` alanında (`{code, message, action, retryable?}`) bildirir. SDK ile `session.error` değeri `None` olur; bunun yerine `session.failure` değerini okuyun.
- `required_actions` ve `vault_ids` her zaman boş dizilerdir.
- Agent ve Session zaman damgaları Unix saniyesidir. Agent sürümü `created_at`, MCP bağlantıları ve Secrets ISO 8601 dizeleri kullanır.
- `402 spending_limit_exceeded` için özel bir SDK istisna sınıfı yoktur; genel bir `APIStatusError` olarak ortaya çıkar.
- Bilinen bir yolda desteklenmeyen bir metot (örneğin `/v1/agents` üzerinde `PUT`), `405` yerine JSON hata zarfıyla `404` döndürür.

## Sonraki adımlar {#next-steps}

- [Sessions](/agents/sessions)
- [Skills ve MCP araçları](/agents/mcp-tools)
- [Agents API referansı](/api-reference/agents/)
