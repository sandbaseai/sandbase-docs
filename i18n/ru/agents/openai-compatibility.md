---
i18nSource: d637409019c8109d
title: Совместимость с OpenAI
description: Используйте официальный OpenAI SDK с SandBase Agents, сессиями и Skills и узнайте, чем SandBase отличается от OpenAI Agents API.
---

# Совместимость с OpenAI {#openai-compatibility}

SandBase Agents реализуют протокол [OpenAI Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview) для Agents, сессий, событий сессий, items, turns и Skills. Для этих ресурсов можно напрямую использовать официальный OpenAI SDK: укажите в `base_url` адрес `https://api.sandbase.ai/v1` и передайте API-ключ SandBase.

MCP-подключения, секреты и каталоги — ресурсы, которые есть только в SandBase. В SDK для них нет методов, поэтому вызывайте их по HTTP (или через универсальные `client.post` / `client.get` из SDK).

Проверенные версии SDK:

| SDK | Версии | Примечания |
|---|---|---|
| openai-python | 3.13.0, 3.24.0 | В 3.13.0 нет `sessions.update(agent=...)` и `sessions.traces` |
| openai-node | 7.28.0 (Node.js 26) | Для потоковой передачи используйте диспетчер HTTP/1.1, см. [ниже](#node-js-and-http-2) |

## Настройка клиента {#set-up-the-client}

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

SDK автоматически отправляет `OpenAI-Beta: agents=v1`. SandBase принимает это значение или отсутствие заголовка; любое другое значение возвращает `400`.

## Полный запуск Agent {#run-an-agent-end-to-end}

Создайте Agent, создайте сессию, откройте поток событий в реальном времени, отправьте один ввод и прочитайте историю. Поток работает только в реальном времени, поэтому откройте его до отправки ввода.

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

`events.create` возвращает `202` без тела. Каждый запрос содержит ровно одно событие. Повторное использование того же `Idempotency-Key` с тем же телом не запускает второй ход. Чтобы остановить текущий ход, отправьте единственным событием `{"type": "agent.session.input.cancel"}`.

### Node.js и HTTP/2 {#node-js-and-http-2}

`fetch` в Node.js 26 может согласовать с API SandBase протокол HTTP/2. В этом случае на общем HTTP/2-соединении `events.create` может зависать, пока на том же соединении открыт `events.stream`, до закрытия потока. Диспетчер `undici` с `allowH2: false` из примера выше предотвращает это. Python SDK по умолчанию использует HTTP/1.1, и менять ничего не нужно.

## Skills через SDK {#skills-with-the-sdk}

`client.skills` работает так же, как в OpenAI, за исключением того, что удалить отдельную версию Skill нельзя. ZIP-архив должен содержать одну папку верхнего уровня с `SKILL.md` внутри (`zip -r release-notes.zip release-notes/`). `SKILL.md` в корне архива возвращает `400 invalid_request`.

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

`skills.retrieve`, `skills.list`, `skills.update(default_version=...)`, `skills.versions.create / list / retrieve`, `skills.versions.content.retrieve` и `skills.delete` тоже работают. Skill, на который ссылается любая версия Agent, удалить нельзя (`409`); вместо этого установите `status` в `disabled` через Update Skill.

## MCP-подключения через SDK {#mcp-connections-with-the-sdk}

В OpenAI MCP-серверы объявляются встроенно как `tools: [{"type": "mcp", ...}]`. Для такой формы SandBase возвращает `400`. Зарегистрируйте сервер один раз через [`POST /v1/mcp-connections`](/api-reference/mcp-connections/) и ссылайтесь на него из `mcp_connections` в Agent. Оба шага покрываются универсальными методами запросов SDK и дополнительными полями тела:

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

Вызов в Node.js передаёт `mcp_connections` в обычном JavaScript; в TypeScript этого поля нет в типах SDK. Bearer-токены для MCP-серверов хранятся как [секреты](/agents/api-credentials), а не в хранилищах (vaults) OpenAI.

## Среда выполнения {#execution-environment}

SandBase запускает каждую сессию в своём облаке; выбирать среду или управлять ею не нужно.

- Прямые HTTP-вызовы не передают `environment`.
- OpenAI SDK требует аргумент `environment` в `sessions.create` (Python без него выбрасывает `TypeError`, а типы Node.js делают его обязательным). Передайте `{"type": "openai_hosted"}`; SandBase его принимает. Любое другое значение, например `self_hosted`, возвращает `400`.
- Ответы сессий содержат объект `environment` для совместимости с SDK. Читать его или реагировать на него не нужно.

## Краткая сводка совместимости {#compatibility-at-a-glance}

| Область | Статус | Подробности |
|---|---|---|
| `beta.agents.create / retrieve / update / list / delete` | Совместимо, с расширениями | Ответы дополнительно содержат `status`, `version`, `row_version`, `projection_status`, `runtime_profile`, `skills`, `mcp_connections` и другие поля. `delete` архивирует Agent и возвращает `agent.deleted`. |
| `beta.agents.sessions.create / retrieve / update / list / delete` | Совместимо, с ограничениями | Принимает сохранённый `agent_id`, встроенный `agent` или оба; `agent` принимает `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` и `multi_agent`. `stream=True` передаёт в потоке первый ход и требует начального `input`. `update` принимает только `metadata`. `delete` архивирует сессию. |
| `sessions.events.stream` | Совместимо | Только в реальном времени, как в OpenAI. `Last-Event-ID` или `?after=` возвращают `400`. |
| `sessions.events.create` | Совместимо, с ограничениями | Ровно одно событие `agent.session.input.message` или `agent.session.input.cancel` на запрос; сообщение содержит одну пользовательскую часть `input_text` или обычную строку. |
| `sessions.items.list`, `sessions.turns.list / retrieve` | Совместимо | Курсорная пагинация с `limit` 1-100, `after`, `order`. |
| `client.skills` и `skills.versions` | Совместимо, кроме удаления версий | `skills.versions.delete` возвращает `404`. |
| Формат ошибок | Совместимо | `{"error": {"type", "code", "param", "message"}}`; исключения SDK предоставляют его как `exc.body`. |
| Версии Agent, restore, archive, catalog, rename/archive/reconnect/files/workspace-files/artifacts для сессий | Только SandBase | См. справочник API [Agents](/api-reference/agents/) и [Sessions](/api-reference/sessions/). |
| MCP-подключения, секреты | Только SandBase | Используйте HTTP или `client.post` / `client.get`. |

SandBase предоставляет по HTTP [список артефактов](/api-reference/sessions/list-artifacts) и [скачивание их содержимого](/api-reference/sessions/download-artifact). ID артефактов непрозрачны и действуют в пределах сессии. Это не означает поддержку всех методов SDK для артефактов; отдельный эндпоинт метаданных артефакта не предоставляется.

### Не поддерживается {#not-supported}

Эти вызовы OpenAI SDK завершаются ошибкой в SandBase. Сообщение — фактическое значение `error.message` из ответа.

| Вызов SDK | Результат |
|---|---|
| `sessions.create(..., stream=True)` без начального `input` | `400 invalid_request` |
| `sessions.create(..., environment={"type": "self_hosted"})` | `400`: `only openai_hosted environment is supported` |
| `sessions.create(..., agent={...})` с полем, отличным от `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` и `multi_agent` | `400 invalid_request` |
| `sessions.create(..., vault_ids=[...])` | `400 invalid_request` |
| `sessions.update(..., agent={...})` | `400` (в openai-python 3.13.0 нет параметра `agent`, и выбрасывается `TypeError`) |
| `agents.create(..., multi_agent={"enabled": True})` | `400`: `multi_agent is not supported` |
| `agents.create(..., tools=[{"type": "mcp", ...}])`; инструменты `tool_search`, `programmatic_tool_calling` и `computer_use` | `400 invalid_request`. Принимаются только `function` и один инструмент `web_search` |
| `events.create` с событием `tool_result` или подтверждением computer use | `400 invalid_request`. Сессии, переходящие в `requires_action`, не поддерживаются |
| `events.create` с несколькими событиями | `400`: `exactly one text input or cancel event is supported per request` |
| `sessions.traces`, `sessions.subagents`, `environments.templates` | `404 not_found` (в openai-python 3.13.0 нет `traces`) |
| `beta.agents.vaults` | `404` с текстовым телом (`404 page not found`), а не в JSON-формате ошибок |
| `skills.versions.delete` | `404 not_found` |

### Различия в полях {#field-differences}

- Сессии сообщают о сбоях в `failure` (`{code, message, action, retryable?}`), а не в `error`, как OpenAI. В SDK `session.error` равно `None`; читайте `session.failure`.
- `required_actions` и `vault_ids` всегда пустые массивы.
- Временные метки Agent и сессий указываются в секундах Unix. `created_at` версии Agent, MCP-подключения и секреты используют строки ISO 8601.
- У `402 spending_limit_exceeded` нет отдельного класса исключения в SDK; ошибка приходит как общий `APIStatusError`.
- Неподдерживаемый метод на известном пути (например, `PUT` на `/v1/agents`) возвращает `404` в JSON-формате ошибок, а не `405`.

## Дальнейшие шаги {#next-steps}

- [Сессии](/agents/sessions)
- [Skills и MCP-инструменты](/agents/mcp-tools)
- [Справочник Agents API](/api-reference/agents/)
