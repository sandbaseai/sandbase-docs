---
i18nSource: d637409019c8109d
title: OpenAI 相容性
description: 搭配 SandBase Agents、Sessions 與 Skills 使用官方 OpenAI SDK，並了解 SandBase 與 OpenAI Agents API 的差異。
---

# OpenAI 相容性 {#openai-compatibility}

SandBase Agents 針對 Agent、Session、Session 事件、items、turns 與 Skills 實作了 [OpenAI Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview) 協定。對於這些資源，您可以直接使用官方 OpenAI SDK：將 `base_url` 指向 `https://api.sandbase.ai/v1`，並傳入 SandBase API 金鑰。

MCP 連線、Secret 與目錄是 SandBase 專屬的資源。SDK 沒有對應的方法，因此請透過 HTTP 呼叫（或使用 SDK 的通用 `client.post` / `client.get`）。

已驗證的 SDK 版本：

| SDK | 版本 | 備註 |
|---|---|---|
| openai-python | 3.13.0、3.24.0 | 3.13.0 中沒有 `sessions.update(agent=...)` 與 `sessions.traces` |
| openai-node | 7.28.0（Node.js 26） | 串流時請使用 HTTP/1.1 dispatcher，請參閱[下文](#node-js-and-http-2) |

## 設定用戶端 {#set-up-the-client}

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

SDK 會自動傳送 `OpenAI-Beta: agents=v1`。SandBase 接受此值，也接受完全不帶此標頭；其他任何值都會回傳 `400`。

## 端對端執行 Agent {#run-an-agent-end-to-end}

建立 Agent、建立 Session、開啟即時事件串流、傳送一個輸入，然後讀取歷史記錄。串流僅限即時，因此請在傳送輸入前先開啟。

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

`events.create` 會回傳 `202` 且不含本文。每個請求只攜帶一個事件。以相同本文重複使用同一個 `Idempotency-Key` 不會啟動第二個回合。若要停止執行中的回合，請以單一事件傳送 `{"type": "agent.session.input.cancel"}`。

### Node.js 與 HTTP/2 {#node-js-and-http-2}

Node.js 26 的 `fetch` 可能會與 SandBase API 協商使用 HTTP/2。若是如此，在共用的 HTTP/2 連線上，當 `events.stream` 在同一連線上開啟時，`events.create` 可能會停滯，直到串流關閉為止。上方使用 `allowH2: false` 的 `undici` dispatcher 可避免此問題。Python SDK 預設使用 HTTP/1.1，不需要任何變更。

## 透過 SDK 使用 Skills {#skills-with-the-sdk}

`client.skills` 的運作方式與 OpenAI 相同，唯一的差異是無法刪除單一 Skill 版本。ZIP 必須包含一個頂層資料夾，且 `SKILL.md` 位於其中（`zip -r release-notes.zip release-notes/`）。若 `SKILL.md` 位於 ZIP 根目錄，會回傳 `400 invalid_request`。

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

`skills.retrieve`、`skills.list`、`skills.update(default_version=...)`、`skills.versions.create / list / retrieve`、`skills.versions.content.retrieve` 與 `skills.delete` 也都可以使用。被任何 Agent 版本參照的 Skill 無法刪除（`409`）；請改用 Update Skill 將 `status` 設為 `disabled`。

## 透過 SDK 使用 MCP 連線 {#mcp-connections-with-the-sdk}

OpenAI 以 `tools: [{"type": "mcp", ...}]` 的形式內嵌宣告 MCP 伺服器。SandBase 對此形式會回傳 `400`。請使用 [`POST /v1/mcp-connections`](/api-reference/mcp-connections/) 註冊伺服器一次，然後在 Agent 的 `mcp_connections` 中參照它。SDK 的通用請求方法與額外本文欄位可涵蓋這兩個步驟：

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

Node.js 的呼叫以純 JavaScript 傳入 `mcp_connections`；在 TypeScript 中，此欄位不屬於 SDK 型別。MCP 伺服器的 Bearer token 會儲存為 [Secret](/agents/api-credentials)，而非 OpenAI vault。

## 執行環境 {#execution-environment}

SandBase 會在其託管雲端中執行每個 Session；沒有需要選擇或管理的環境。

- 直接的 HTTP 呼叫可省略 `environment`。
- OpenAI SDK 的 `sessions.create` 需要 `environment` 參數（Python 缺少時會拋出 `TypeError`，Node.js 型別也要求此參數）。請傳入 `{"type": "openai_hosted"}`；SandBase 會接受。其他任何值（例如 `self_hosted`）都會回傳 `400`。
- 為了 SDK 相容性，Session 回應會包含 `environment` 物件。您不需要讀取或處理它。

## 相容性一覽 {#compatibility-at-a-glance}

| 範圍 | 狀態 | 詳細資訊 |
|---|---|---|
| `beta.agents.create / retrieve / update / list / delete` | 相容，並有擴充 | 回應額外包含 `status`、`version`、`row_version`、`projection_status`、`runtime_profile`、`skills`、`mcp_connections` 等欄位。`delete` 會封存 Agent 並回傳 `agent.deleted`。 |
| `beta.agents.sessions.create / retrieve / update / list / delete` | 相容，但有限制 | 接受已儲存的 `agent_id`、內嵌的 `agent`，或兩者皆有；`agent` 接受 `model`、`instructions`、`runtime_profile`、`service_tier`、`tools`、`text`、`reasoning` 與 `multi_agent`。`stream=True` 會串流第一個回合，且需要初始 `input`。`update` 只接受 `metadata`。`delete` 會封存 Session。 |
| `sessions.events.stream` | 相容 | 與 OpenAI 相同，僅限即時。`Last-Event-ID` 或 `?after=` 會回傳 `400`。 |
| `sessions.events.create` | 相容，但有限制 | 每個請求只能有一個 `agent.session.input.message` 或 `agent.session.input.cancel` 事件；訊息包含一個 user `input_text` 部分或純字串。 |
| `sessions.items.list`、`sessions.turns.list / retrieve` | 相容 | 使用 cursor 分頁，`limit` 為 1-100，並支援 `after`、`order`。 |
| `client.skills` 與 `skills.versions` | 相容，但不支援刪除版本 | `skills.versions.delete` 會回傳 `404`。 |
| 錯誤封裝格式 | 相容 | `{"error": {"type", "code", "param", "message"}}`；SDK 例外會以 `exc.body` 公開它。 |
| Agent 版本、還原、封存、目錄，以及 Session 重新命名／封存／重新連線／檔案／工作區檔案／成品 | SandBase 專屬 | 請參閱 [Agents](/api-reference/agents/) 與 [Sessions](/api-reference/sessions/) API 參考。 |
| MCP 連線、Secret | SandBase 專屬 | 請使用 HTTP 或 `client.post` / `client.get`。 |

SandBase 透過 HTTP 提供[成品清單](/api-reference/sessions/list-artifacts)與[內容下載](/api-reference/sessions/download-artifact)。成品 ID 是不透明的，且範圍限於 Session。這並不代表支援所有 SDK 成品方法；目前未提供獨立的成品中繼資料端點。

### 不支援的功能 {#not-supported}

以下 OpenAI SDK 呼叫在 SandBase 上會失敗。訊息為實際回傳的 `error.message`。

| SDK 呼叫 | 結果 |
|---|---|
| 沒有初始 `input` 的 `sessions.create(..., stream=True)` | `400 invalid_request` |
| `sessions.create(..., environment={"type": "self_hosted"})` | `400`：`only openai_hosted environment is supported` |
| `sessions.create(..., agent={...})` 包含 `model`、`instructions`、`runtime_profile`、`service_tier`、`tools`、`text`、`reasoning` 與 `multi_agent` 以外的欄位 | `400 invalid_request` |
| `sessions.create(..., vault_ids=[...])` | `400 invalid_request` |
| `sessions.update(..., agent={...})` | `400`（openai-python 3.13.0 沒有 `agent` 參數，會拋出 `TypeError`） |
| `agents.create(..., multi_agent={"enabled": True})` | `400`：`multi_agent is not supported` |
| `agents.create(..., tools=[{"type": "mcp", ...}])`；`tool_search`、`programmatic_tool_calling` 與 `computer_use` 工具 | `400 invalid_request`。僅接受 `function` 與一個 `web_search` 工具 |
| 含有 `tool_result` 或 computer-use 核准事件的 `events.create` | `400 invalid_request`。不支援進入 `requires_action` 的 Session |
| 含有多個事件的 `events.create` | `400`：`exactly one text input or cancel event is supported per request` |
| `sessions.traces`、`sessions.subagents`、`environments.templates` | `404 not_found`（openai-python 3.13.0 沒有 `traces`） |
| `beta.agents.vaults` | `404`，本文為純文字（`404 page not found`），而非 JSON 錯誤封裝格式 |
| `skills.versions.delete` | `404 not_found` |

### 欄位差異 {#field-differences}

- Session 會在 `failure`（`{code, message, action, retryable?}`）中回報失敗，而非 OpenAI 的 `error`。使用 SDK 時，`session.error` 為 `None`；請改為讀取 `session.failure`。
- `required_actions` 與 `vault_ids` 一律為空陣列。
- Agent 與 Session 的時間戳記為 Unix 秒數。Agent 版本的 `created_at`、MCP 連線與 Secret 使用 ISO 8601 字串。
- `402 spending_limit_exceeded` 沒有專屬的 SDK 例外類別；它會以通用的 `APIStatusError` 呈現。
- 在已知路徑上使用不支援的方法（例如對 `/v1/agents` 使用 `PUT`）會回傳帶有 JSON 錯誤封裝格式的 `404`，而非 `405`。

## 後續步驟 {#next-steps}

- [Sessions](/agents/sessions)
- [Skills 與 MCP 工具](/agents/mcp-tools)
- [Agents API 參考](/api-reference/agents/)
