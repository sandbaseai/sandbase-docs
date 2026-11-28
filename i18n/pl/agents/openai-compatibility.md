---
i18nSource: d637409019c8109d
title: Zgodność z OpenAI
description: Używaj oficjalnego SDK OpenAI z SandBase Agents, sesjami i Skills oraz sprawdź, czym SandBase różni się od OpenAI Agents API.
---

# Zgodność z OpenAI {#openai-compatibility}

SandBase Agents implementują protokół [OpenAI Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview) dla Agents, sesji, zdarzeń sesji, elementów (items), tur (turns) i Skills. Dla tych zasobów możesz bezpośrednio używać oficjalnego SDK OpenAI: ustaw `base_url` na `https://api.sandbase.ai/v1` i przekaż klucz API SandBase.

Połączenia MCP, sekrety (Secrets) i katalogi to zasoby dostępne tylko w SandBase. SDK nie ma dla nich metod, więc wywołuj je przez HTTP (lub ogólnymi metodami SDK `client.post` / `client.get`).

Zweryfikowane wersje SDK:

| SDK | Wersje | Uwagi |
|---|---|---|
| openai-python | 3.13.0, 3.24.0 | `sessions.update(agent=...)` i `sessions.traces` nie istnieją w 3.13.0 |
| openai-node | 7.28.0 (Node.js 26) | Do strumieniowania użyj dispatchera HTTP/1.1, zobacz [poniżej](#node-js-and-http-2) |

## Konfiguracja klienta {#set-up-the-client}

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

SDK automatycznie wysyła `OpenAI-Beta: agents=v1`. SandBase akceptuje tę wartość lub brak nagłówka; każda inna wartość zwraca `400`.

## Uruchomienie Agent od początku do końca {#run-an-agent-end-to-end}

Utwórz Agent, utwórz sesję, otwórz strumień zdarzeń na żywo, wyślij jedno wejście i odczytaj historię. Strumień działa tylko na żywo, więc otwórz go przed wysłaniem wejścia.

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

`events.create` zwraca `202` bez treści. Każde żądanie zawiera dokładnie jedno zdarzenie. Ponowne użycie tego samego `Idempotency-Key` z tą samą treścią nie uruchamia drugiej tury. Aby zatrzymać trwającą turę, wyślij `{"type": "agent.session.input.cancel"}` jako jedyne zdarzenie.

### Node.js i HTTP/2 {#node-js-and-http-2}

`fetch` w Node.js 26 może wynegocjować z API SandBase protokół HTTP/2. Jeśli tak się stanie, na współdzielonym połączeniu HTTP/2 wywołanie `events.create` może się zawiesić, gdy na tym samym połączeniu jest otwarty `events.stream`, aż do zamknięcia strumienia. Dispatcher `undici` z `allowH2: false` pokazany wyżej zapobiega temu problemowi. SDK dla Pythona domyślnie używa HTTP/1.1 i nie wymaga zmian.

## Skills w SDK {#skills-with-the-sdk}

`client.skills` działa tak jak w OpenAI, z wyjątkiem tego, że usunięcie pojedynczej wersji Skill nie jest dostępne. Archiwum ZIP musi zawierać jeden folder najwyższego poziomu z plikiem `SKILL.md` w środku (`zip -r release-notes.zip release-notes/`). Plik `SKILL.md` w katalogu głównym ZIP zwraca `400 invalid_request`.

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

Działają również `skills.retrieve`, `skills.list`, `skills.update(default_version=...)`, `skills.versions.create / list / retrieve`, `skills.versions.content.retrieve` i `skills.delete`. Skill, do którego odwołuje się dowolna wersja Agent, nie może zostać usunięty (`409`); zamiast tego ustaw `status` na `disabled` przez Update Skill.

## Połączenia MCP w SDK {#mcp-connections-with-the-sdk}

OpenAI deklaruje serwery MCP bezpośrednio jako `tools: [{"type": "mcp", ...}]`. SandBase zwraca dla tej formy `400`. Zarejestruj serwer raz przez [`POST /v1/mcp-connections`](/api-reference/mcp-connections/) i odwołuj się do niego w polu `mcp_connections` Agent. Ogólne metody żądań SDK i dodatkowe pola treści obsługują oba kroki:

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

Wywołanie w Node.js przekazuje `mcp_connections` w zwykłym JavaScripcie; w TypeScripcie to pole nie należy do typów SDK. Tokeny Bearer dla serwerów MCP są przechowywane jako [sekrety](/agents/api-credentials), a nie w sejfach (vaults) OpenAI.

## Środowisko wykonawcze {#execution-environment}

SandBase uruchamia każdą sesję w swojej hostowanej chmurze; nie ma środowiska do wyboru ani zarządzania.

- Bezpośrednie wywołania HTTP pomijają `environment`.
- SDK OpenAI wymaga argumentu `environment` w `sessions.create` (Python bez niego zgłasza `TypeError`, a typy Node.js go wymagają). Przekaż `{"type": "openai_hosted"}`; SandBase to akceptuje. Każda inna wartość, np. `self_hosted`, zwraca `400`.
- Odpowiedzi sesji zawierają obiekt `environment` dla zgodności z SDK. Nie musisz go odczytywać ani na niego reagować.

## Zgodność w skrócie {#compatibility-at-a-glance}

| Obszar | Status | Szczegóły |
|---|---|---|
| `beta.agents.create / retrieve / update / list / delete` | Zgodne, z rozszerzeniami | Odpowiedzi zawierają dodatkowo `status`, `version`, `row_version`, `projection_status`, `runtime_profile`, `skills`, `mcp_connections` i inne pola. `delete` archiwizuje Agent i zwraca `agent.deleted`. |
| `beta.agents.sessions.create / retrieve / update / list / delete` | Zgodne, z ograniczeniami | Akceptuje zapisany `agent_id`, wbudowany `agent` lub oba; `agent` akceptuje `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` i `multi_agent`. `stream=True` strumieniuje pierwszą turę i wymaga początkowego `input`. `update` akceptuje tylko `metadata`. `delete` archiwizuje sesję. |
| `sessions.events.stream` | Zgodne | Tylko na żywo, jak w OpenAI. `Last-Event-ID` lub `?after=` zwraca `400`. |
| `sessions.events.create` | Zgodne, z ograniczeniami | Dokładnie jedno zdarzenie `agent.session.input.message` lub `agent.session.input.cancel` na żądanie; wiadomość ma jedną część użytkownika `input_text` lub jest zwykłym ciągiem znaków. |
| `sessions.items.list`, `sessions.turns.list / retrieve` | Zgodne | Paginacja kursorowa z `limit` 1-100, `after`, `order`. |
| `client.skills` i `skills.versions` | Zgodne, z wyjątkiem usuwania wersji | `skills.versions.delete` zwraca `404`. |
| Koperta błędu | Zgodne | `{"error": {"type", "code", "param", "message"}}`; wyjątki SDK udostępniają ją jako `exc.body`. |
| Wersje Agent, przywracanie, archiwizacja, katalog, zmiana nazwy/archiwizacja/ponowne łączenie/pliki/pliki przestrzeni roboczej/artefakty sesji | Tylko SandBase | Zobacz dokumentację API [Agents](/api-reference/agents/) i [sesji](/api-reference/sessions/). |
| Połączenia MCP, sekrety | Tylko SandBase | Użyj HTTP lub `client.post` / `client.get`. |

SandBase udostępnia przez HTTP [listę artefaktów](/api-reference/sessions/list-artifacts) i [pobieranie zawartości](/api-reference/sessions/download-artifact). Identyfikatory artefaktów są nieprzezroczyste i należą do zakresu sesji. Nie oznacza to obsługi każdej metody SDK dotyczącej artefaktów; osobny endpoint metadanych artefaktu nie jest udostępniony.

### Nieobsługiwane {#not-supported}

Te wywołania SDK OpenAI kończą się błędem w SandBase. Komunikat to faktycznie zwracany `error.message`.

| Wywołanie SDK | Wynik |
|---|---|
| `sessions.create(..., stream=True)` bez początkowego `input` | `400 invalid_request` |
| `sessions.create(..., environment={"type": "self_hosted"})` | `400`: `only openai_hosted environment is supported` |
| `sessions.create(..., agent={...})` z polem innym niż `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` i `multi_agent` | `400 invalid_request` |
| `sessions.create(..., vault_ids=[...])` | `400 invalid_request` |
| `sessions.update(..., agent={...})` | `400` (openai-python 3.13.0 nie ma parametru `agent` i zgłasza `TypeError`) |
| `agents.create(..., multi_agent={"enabled": True})` | `400`: `multi_agent is not supported` |
| `agents.create(..., tools=[{"type": "mcp", ...}])`; narzędzia `tool_search`, `programmatic_tool_calling` i `computer_use` | `400 invalid_request`. Akceptowane są tylko narzędzia `function` i jedno narzędzie `web_search` |
| `events.create` ze zdarzeniem `tool_result` lub zatwierdzeniem computer use | `400 invalid_request`. Sesje, które osiągają `requires_action`, nie są obsługiwane |
| `events.create` z więcej niż jednym zdarzeniem | `400`: `exactly one text input or cancel event is supported per request` |
| `sessions.traces`, `sessions.subagents`, `environments.templates` | `404 not_found` (openai-python 3.13.0 nie ma `traces`) |
| `beta.agents.vaults` | `404` z treścią w postaci zwykłego tekstu (`404 page not found`), a nie z kopertą błędu JSON |
| `skills.versions.delete` | `404 not_found` |

### Różnice w polach {#field-differences}

- Sesje zgłaszają błędy w `failure` (`{code, message, action, retryable?}`), a nie w polu `error` jak w OpenAI. W SDK `session.error` ma wartość `None`; zamiast tego odczytuj `session.failure`.
- `required_actions` i `vault_ids` są zawsze pustymi tablicami.
- Znaczniki czasu Agent i sesji są w sekundach Unix. `created_at` wersji Agent, połączenia MCP i sekrety używają ciągów ISO 8601.
- `402 spending_limit_exceeded` nie ma dedykowanej klasy wyjątku w SDK; pojawia się jako ogólny `APIStatusError`.
- Nieobsługiwana metoda na znanej ścieżce (np. `PUT` na `/v1/agents`) zwraca `404` z kopertą błędu JSON, a nie `405`.

## Kolejne kroki {#next-steps}

- [Sesje](/agents/sessions)
- [Skills i narzędzia MCP](/agents/mcp-tools)
- [Dokumentacja Agents API](/api-reference/agents/)
