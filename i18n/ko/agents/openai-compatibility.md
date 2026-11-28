---
i18nSource: d637409019c8109d
title: OpenAI 호환성
description: 공식 OpenAI SDK를 SandBase Agent, Session, Skill과 함께 사용하고, SandBase가 OpenAI Agents API와 다른 점을 확인합니다.
---

# OpenAI 호환성 {#openai-compatibility}

SandBase Agents는 Agent, Session, Session 이벤트, items, turns, Skill에 대해 [OpenAI Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview) 프로토콜을 구현합니다. 이 리소스들에는 공식 OpenAI SDK를 그대로 사용할 수 있습니다. `base_url`을 `https://api.sandbase.ai/v1`로 지정하고 SandBase API 키를 전달하세요.

MCP 연결, Secret, 카탈로그는 SandBase 전용 리소스입니다. SDK에는 이에 대한 메서드가 없으므로 HTTP로(또는 SDK의 범용 `client.post` / `client.get`으로) 호출하세요.

검증된 SDK 버전:

| SDK | 버전 | 참고 |
|---|---|---|
| openai-python | 3.13.0, 3.24.0 | 3.13.0에는 `sessions.update(agent=...)`와 `sessions.traces`가 없습니다 |
| openai-node | 7.28.0 (Node.js 26) | 스트리밍에는 HTTP/1.1 dispatcher를 사용하세요. [아래](#node-js-and-http-2)를 참고하세요 |

## 클라이언트 설정 {#set-up-the-client}

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

SDK는 `OpenAI-Beta: agents=v1`을 자동으로 보냅니다. SandBase는 이 값을 허용하며 헤더가 없어도 됩니다. 다른 값은 `400`을 반환합니다.

## Agent 전체 흐름 실행 {#run-an-agent-end-to-end}

Agent를 생성하고, Session을 생성하고, 실시간 이벤트 스트림을 열고, 입력 하나를 보낸 뒤 기록을 읽습니다. 스트림은 실시간 전용이므로 입력을 보내기 전에 열어야 합니다.

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

`events.create`는 본문 없이 `202`를 반환합니다. 각 요청은 정확히 하나의 이벤트를 전달합니다. 같은 `Idempotency-Key`를 같은 본문과 함께 재사용하면 두 번째 turn이 시작되지 않습니다. 실행 중인 turn을 멈추려면 `{"type": "agent.session.input.cancel"}`을 단일 이벤트로 보내세요.

### Node.js와 HTTP/2 {#node-js-and-http-2}

Node.js 26의 `fetch`는 SandBase API와 HTTP/2를 협상할 수 있습니다. 이 경우 공유 HTTP/2 연결에서 같은 연결에 `events.stream`이 열려 있는 동안 스트림이 닫힐 때까지 `events.create`가 멈출 수 있습니다. 위의 `allowH2: false`가 설정된 `undici` dispatcher를 사용하면 이 문제를 피할 수 있습니다. Python SDK는 기본적으로 HTTP/1.1을 사용하므로 변경할 필요가 없습니다.

## SDK에서 Skill 사용 {#skills-with-the-sdk}

`client.skills`는 OpenAI와 동일하게 동작하지만, 단일 Skill 버전 삭제는 지원되지 않습니다. ZIP에는 `SKILL.md`가 들어 있는 최상위 폴더가 하나 있어야 합니다(`zip -r release-notes.zip release-notes/`). ZIP 루트에 `SKILL.md`가 있으면 `400 invalid_request`를 반환합니다.

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

`skills.retrieve`, `skills.list`, `skills.update(default_version=...)`, `skills.versions.create / list / retrieve`, `skills.versions.content.retrieve`, `skills.delete`도 동작합니다. 어떤 Agent 버전에서든 참조하는 Skill은 삭제할 수 없습니다(`409`). 대신 Update Skill로 `status`를 `disabled`로 설정하세요.

## SDK에서 MCP 연결 사용 {#mcp-connections-with-the-sdk}

OpenAI는 MCP 서버를 `tools: [{"type": "mcp", ...}]`처럼 인라인으로 선언합니다. SandBase는 이 형식에 `400`을 반환합니다. [`POST /v1/mcp-connections`](/api-reference/mcp-connections/)로 서버를 한 번 등록하고 Agent의 `mcp_connections`에서 참조하세요. SDK의 범용 요청 메서드와 추가 본문 필드로 두 단계를 모두 처리할 수 있습니다:

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

Node.js 호출은 일반 JavaScript로 `mcp_connections`를 전달합니다. TypeScript에서는 이 필드가 SDK 타입에 포함되어 있지 않습니다. MCP 서버용 Bearer 토큰은 OpenAI vault가 아닌 [Secret](/agents/api-credentials)으로 저장됩니다.

## 실행 환경 {#execution-environment}

SandBase는 모든 Session을 호스팅 클라우드에서 실행하므로, 선택하거나 관리할 환경이 없습니다.

- 직접 HTTP를 호출할 때는 `environment`를 생략합니다.
- OpenAI SDK는 `sessions.create`에 `environment` 인수를 요구합니다(Python은 이 인수가 없으면 `TypeError`를 발생시키고, Node.js 타입에서도 필수입니다). `{"type": "openai_hosted"}`를 전달하면 SandBase가 이를 허용합니다. `self_hosted` 같은 다른 값은 `400`을 반환합니다.
- Session 응답에는 SDK 호환성을 위해 `environment` 객체가 포함됩니다. 이 값을 읽거나 처리할 필요는 없습니다.

## 호환성 한눈에 보기 {#compatibility-at-a-glance}

| 영역 | 상태 | 세부 사항 |
|---|---|---|
| `beta.agents.create / retrieve / update / list / delete` | 호환, 확장 포함 | 응답에 `status`, `version`, `row_version`, `projection_status`, `runtime_profile`, `skills`, `mcp_connections` 등이 추가됩니다. `delete`는 Agent를 보관하고 `agent.deleted`를 반환합니다. |
| `beta.agents.sessions.create / retrieve / update / list / delete` | 호환, 제한 있음 | 저장된 `agent_id`, 인라인 `agent` 또는 둘 다 허용합니다. `agent`는 `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning`, `multi_agent`를 허용합니다. `stream=True`는 첫 turn을 스트리밍하며 초기 `input`이 필요합니다. `update`는 `metadata`만 허용합니다. `delete`는 Session을 보관합니다. |
| `sessions.events.stream` | 호환 | OpenAI와 마찬가지로 실시간 전용입니다. `Last-Event-ID` 또는 `?after=`는 `400`을 반환합니다. |
| `sessions.events.create` | 호환, 제한 있음 | 요청마다 정확히 하나의 `agent.session.input.message` 또는 `agent.session.input.cancel` 이벤트를 보냅니다. 메시지는 user `input_text` 파트 하나 또는 일반 문자열입니다. |
| `sessions.items.list`, `sessions.turns.list / retrieve` | 호환 | `limit` 1~100, `after`, `order`를 사용하는 커서 페이지네이션입니다. |
| `client.skills` 및 `skills.versions` | 호환, 버전 삭제 제외 | `skills.versions.delete`는 `404`를 반환합니다. |
| 오류 엔벨로프 | 호환 | `{"error": {"type", "code", "param", "message"}}`. SDK 예외에서는 `exc.body`로 확인할 수 있습니다. |
| Agent 버전, 복원, 보관, 카탈로그, Session 이름 변경/보관/재연결/files/workspace-files/artifacts | SandBase 전용 | [Agents](/api-reference/agents/) 및 [Sessions](/api-reference/sessions/) API 레퍼런스를 참고하세요. |
| MCP 연결, Secret | SandBase 전용 | HTTP 또는 `client.post` / `client.get`을 사용하세요. |

SandBase는 [아티팩트 목록 조회](/api-reference/sessions/list-artifacts)와 [콘텐츠 다운로드](/api-reference/sessions/download-artifact)를 HTTP로 제공합니다. 아티팩트 ID는 불투명하며 Session 범위입니다. 그렇다고 모든 SDK 아티팩트 메서드를 지원하는 것은 아니며, 별도의 아티팩트 메타데이터 엔드포인트는 제공되지 않습니다.

### 지원되지 않는 기능 {#not-supported}

다음 OpenAI SDK 호출은 SandBase에서 실패합니다. 메시지는 실제로 반환되는 `error.message`입니다.

| SDK 호출 | 결과 |
|---|---|
| 초기 `input` 없이 `sessions.create(..., stream=True)` | `400 invalid_request` |
| `sessions.create(..., environment={"type": "self_hosted"})` | `400`: `only openai_hosted environment is supported` |
| `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning`, `multi_agent` 이외의 필드가 있는 `sessions.create(..., agent={...})` | `400 invalid_request` |
| `sessions.create(..., vault_ids=[...])` | `400 invalid_request` |
| `sessions.update(..., agent={...})` | `400`(openai-python 3.13.0에는 `agent` 파라미터가 없어 `TypeError` 발생) |
| `agents.create(..., multi_agent={"enabled": True})` | `400`: `multi_agent is not supported` |
| `agents.create(..., tools=[{"type": "mcp", ...}])`, `tool_search`, `programmatic_tool_calling`, `computer_use` 도구 | `400 invalid_request`. `function` 도구와 `web_search` 도구 하나만 허용됩니다 |
| `tool_result` 또는 computer-use 승인 이벤트가 있는 `events.create` | `400 invalid_request`. `requires_action`에 도달하는 Session은 지원되지 않습니다 |
| 이벤트가 둘 이상인 `events.create` | `400`: `exactly one text input or cancel event is supported per request` |
| `sessions.traces`, `sessions.subagents`, `environments.templates` | `404 not_found`(openai-python 3.13.0에는 `traces`가 없음) |
| `beta.agents.vaults` | JSON 오류 엔벨로프가 아닌 일반 텍스트 본문(`404 page not found`)과 함께 `404` |
| `skills.versions.delete` | `404 not_found` |

### 필드 차이 {#field-differences}

- Session은 OpenAI의 `error`가 아닌 `failure`(`{code, message, action, retryable?}`)로 실패를 보고합니다. SDK에서는 `session.error`가 `None`이므로 `session.failure`를 읽으세요.
- `required_actions`와 `vault_ids`는 항상 빈 배열입니다.
- Agent와 Session 타임스탬프는 Unix 초 단위입니다. Agent 버전의 `created_at`, MCP 연결, Secret은 ISO 8601 문자열을 사용합니다.
- `402 spending_limit_exceeded`에는 전용 SDK 예외 클래스가 없으며, 범용 `APIStatusError`로 나타납니다.
- 알려진 경로에서 지원되지 않는 메서드(예: `/v1/agents`에 `PUT`)는 `405`가 아니라 JSON 오류 엔벨로프와 함께 `404`를 반환합니다.

## 다음 단계 {#next-steps}

- [Session](/agents/sessions)
- [Skill과 MCP 도구](/agents/mcp-tools)
- [Agents API 레퍼런스](/api-reference/agents/)
