---
i18nSource: d637409019c8109d
title: Compatibilidade com a OpenAI
description: Use o SDK oficial da OpenAI com Agents, Sessions e Skills do SandBase e veja onde o SandBase difere da OpenAI Agents API.
---

# Compatibilidade com a OpenAI {#openai-compatibility}

Os SandBase Agents implementam o protocolo da [OpenAI Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview) para Agents, Sessions, eventos de sessão, itens, turns e Skills. Para esses recursos, você pode usar o SDK oficial da OpenAI diretamente: aponte `base_url` para `https://api.sandbase.ai/v1` e passe uma API key do SandBase.

Conexões MCP, Secrets e os catálogos são recursos exclusivos do SandBase. O SDK não tem métodos para eles, então chame-os via HTTP (ou com os métodos genéricos `client.post` / `client.get` do SDK).

Versões de SDK verificadas:

| SDK | Versões | Observações |
|---|---|---|
| openai-python | 3.13.0, 3.24.0 | `sessions.update(agent=...)` e `sessions.traces` não existem na 3.13.0 |
| openai-node | 7.28.0 (Node.js 26) | Use um dispatcher HTTP/1.1 para streaming; veja [abaixo](#node-js-and-http-2) |

## Configurar o cliente {#set-up-the-client}

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

O SDK envia `OpenAI-Beta: agents=v1` automaticamente. O SandBase aceita esse valor ou a ausência do header; qualquer outro valor retorna `400`.

## Executar um Agent de ponta a ponta {#run-an-agent-end-to-end}

Crie um Agent, crie uma Session, abra o stream de eventos ao vivo, envie um input e leia o histórico. O stream é apenas ao vivo, então abra-o antes de enviar o input.

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

`events.create` retorna `202` sem corpo. Cada requisição carrega exatamente um evento. Reutilizar o mesmo `Idempotency-Key` com o mesmo corpo não inicia um segundo turn. Para interromper o turn em execução, envie `{"type": "agent.session.input.cancel"}` como evento único.

### Node.js e HTTP/2 {#node-js-and-http-2}

O `fetch` do Node.js 26 pode negociar HTTP/2 com a API do SandBase. Se isso acontecer, em uma conexão HTTP/2 compartilhada o `events.create` pode travar enquanto `events.stream` estiver aberto na mesma conexão, até o stream ser fechado. O dispatcher `undici` com `allowH2: false` mostrado acima evita isso. O SDK de Python usa HTTP/1.1 por padrão e não precisa de alteração.

## Skills com o SDK {#skills-with-the-sdk}

`client.skills` funciona como na OpenAI, exceto que não é possível excluir uma única versão de Skill. O ZIP deve conter uma pasta de nível superior com o `SKILL.md` dentro dela (`zip -r release-notes.zip release-notes/`). Um `SKILL.md` na raiz do ZIP retorna `400 invalid_request`.

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

`skills.retrieve`, `skills.list`, `skills.update(default_version=...)`, `skills.versions.create / list / retrieve`, `skills.versions.content.retrieve` e `skills.delete` também funcionam. Uma Skill referenciada por qualquer versão de Agent não pode ser excluída (`409`); em vez disso, defina `status` como `disabled` com Update Skill.

## Conexões MCP com o SDK {#mcp-connections-with-the-sdk}

A OpenAI declara servidores MCP inline como `tools: [{"type": "mcp", ...}]`. O SandBase retorna `400` para esse formato. Registre o servidor uma vez com [`POST /v1/mcp-connections`](/api-reference/mcp-connections/) e referencie-o em `mcp_connections` do Agent. Os métodos genéricos de requisição e os campos extras de corpo do SDK cobrem as duas etapas:

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

A chamada em Node.js passa `mcp_connections` em JavaScript puro; em TypeScript, o campo não faz parte dos tipos do SDK. Bearer tokens de servidores MCP são armazenados como [Secrets](/agents/api-credentials), não em vaults da OpenAI.

## Ambiente de execução {#execution-environment}

O SandBase executa cada Session em sua nuvem hospedada; não há ambiente para escolher ou gerenciar.

- Chamadas HTTP diretas omitem `environment`.
- O SDK da OpenAI exige um argumento `environment` em `sessions.create` (o Python lança `TypeError` sem ele, e os tipos do Node.js o exigem). Passe `{"type": "openai_hosted"}`; o SandBase aceita esse valor. Qualquer outro valor, como `self_hosted`, retorna `400`.
- As respostas de Session incluem um objeto `environment` para compatibilidade com o SDK. Você não precisa lê-lo nem agir com base nele.

## Compatibilidade em resumo {#compatibility-at-a-glance}

| Área | Status | Detalhes |
|---|---|---|
| `beta.agents.create / retrieve / update / list / delete` | Compatível, com extensões | As respostas adicionam `status`, `version`, `row_version`, `projection_status`, `runtime_profile`, `skills`, `mcp_connections` e mais. `delete` arquiva o Agent e retorna `agent.deleted`. |
| `beta.agents.sessions.create / retrieve / update / list / delete` | Compatível, com limites | Aceita um `agent_id` salvo, um `agent` inline ou ambos; `agent` aceita `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` e `multi_agent`. `stream=True` faz streaming do primeiro turn e exige um `input` inicial. `update` aceita apenas `metadata`. `delete` arquiva a Session. |
| `sessions.events.stream` | Compatível | Apenas ao vivo, como na OpenAI. `Last-Event-ID` ou `?after=` retorna `400`. |
| `sessions.events.create` | Compatível, com limites | Exatamente um evento `agent.session.input.message` ou `agent.session.input.cancel` por requisição; a mensagem tem uma parte `input_text` de usuário ou uma string simples. |
| `sessions.items.list`, `sessions.turns.list / retrieve` | Compatível | Paginação por cursor com `limit` de 1 a 100, `after`, `order`. |
| `client.skills` e `skills.versions` | Compatível, exceto exclusão de versão | `skills.versions.delete` retorna `404`. |
| Envelope de erro | Compatível | `{"error": {"type", "code", "param", "message"}}`; as exceções do SDK o expõem como `exc.body`. |
| Versões de Agent, restore, archive, catálogo, rename/archive/reconnect/files/workspace-files/artifacts de Session | Apenas SandBase | Consulte a referência de API de [Agents](/api-reference/agents/) e [Sessions](/api-reference/sessions/). |
| Conexões MCP, Secrets | Apenas SandBase | Use HTTP ou `client.post` / `client.get`. |

O SandBase expõe a [listagem de artifacts](/api-reference/sessions/list-artifacts) e o [download de conteúdo](/api-reference/sessions/download-artifact) via HTTP. Os IDs de artifact são opacos e restritos à Session. Isso não implica suporte a todos os métodos de artifact do SDK; não há um endpoint separado de metadados de artifact.

### Não suportado {#not-supported}

Estas chamadas do SDK da OpenAI falham no SandBase. A mensagem é o `error.message` real retornado.

| Chamada do SDK | Resultado |
|---|---|
| `sessions.create(..., stream=True)` sem um `input` inicial | `400 invalid_request` |
| `sessions.create(..., environment={"type": "self_hosted"})` | `400`: `only openai_hosted environment is supported` |
| `sessions.create(..., agent={...})` com um campo diferente de `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` e `multi_agent` | `400 invalid_request` |
| `sessions.create(..., vault_ids=[...])` | `400 invalid_request` |
| `sessions.update(..., agent={...})` | `400` (o openai-python 3.13.0 não tem o parâmetro `agent` e lança `TypeError`) |
| `agents.create(..., multi_agent={"enabled": True})` | `400`: `multi_agent is not supported` |
| `agents.create(..., tools=[{"type": "mcp", ...}])`; ferramentas `tool_search`, `programmatic_tool_calling` e `computer_use` | `400 invalid_request`. Apenas ferramentas `function` e uma ferramenta `web_search` são aceitas |
| `events.create` com um evento `tool_result` ou de aprovação de computer use | `400 invalid_request`. Sessions que chegam a `requires_action` não são suportadas |
| `events.create` com mais de um evento | `400`: `exactly one text input or cancel event is supported per request` |
| `sessions.traces`, `sessions.subagents`, `environments.templates` | `404 not_found` (o openai-python 3.13.0 não tem `traces`) |
| `beta.agents.vaults` | `404` com corpo em texto simples (`404 page not found`), não o envelope de erro JSON |
| `skills.versions.delete` | `404 not_found` |

### Diferenças de campos {#field-differences}

- As Sessions informam falhas em `failure` (`{code, message, action, retryable?}`), não no `error` da OpenAI. Com o SDK, `session.error` é `None`; leia `session.failure`.
- `required_actions` e `vault_ids` são sempre arrays vazios.
- Os timestamps de Agent e Session são em segundos Unix. O `created_at` de versões de Agent, as conexões MCP e os Secrets usam strings ISO 8601.
- `402 spending_limit_exceeded` não tem uma classe de exceção dedicada no SDK; ele aparece como um `APIStatusError` genérico.
- Um método não suportado em um caminho conhecido (por exemplo, `PUT` em `/v1/agents`) retorna `404` com o envelope de erro JSON, não `405`.

## Próximos passos {#next-steps}

- [Sessions](/agents/sessions)
- [Skills e ferramentas MCP](/agents/mcp-tools)
- [Referência da API de Agents](/api-reference/agents/)

