---
i18nSource: d637409019c8109d
title: OpenAI 兼容性
description: 通过官方 OpenAI SDK 使用 SandBase Agent、Session 和 Skill，并了解 SandBase 与 OpenAI Agents API 的差异。
---

# OpenAI 兼容性 {#openai-compatibility}

SandBase Agents 针对 Agent、Session、Session 事件、items、turns 和 Skill 实现了 [OpenAI Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview) 协议。对于这些资源，你可以直接使用官方 OpenAI SDK：将 `base_url` 指向 `https://api.sandbase.ai/v1`，并传入 SandBase API 密钥。

MCP 连接、Secrets 和目录是 SandBase 独有的资源。SDK 没有对应的方法，请通过 HTTP 调用（或使用 SDK 的通用方法 `client.post` / `client.get`）。

已验证的 SDK 版本：

| SDK | 版本 | 说明 |
|---|---|---|
| openai-python | 3.13.0, 3.24.0 | 3.13.0 中没有 `sessions.update(agent=...)` 和 `sessions.traces` |
| openai-node | 7.28.0 (Node.js 26) | 流式传输请使用 HTTP/1.1 dispatcher，见[下文](#node-js-and-http-2) |

## 设置客户端 {#set-up-the-client}

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

SDK 会自动发送 `OpenAI-Beta: agents=v1`。SandBase 接受该值，也接受不带此请求头；其他任何值都会返回 `400`。

## 端到端运行 Agent {#run-an-agent-end-to-end}

创建 Agent，创建 Session，打开实时事件流，发送一条输入，然后读取历史记录。事件流仅推送实时事件，因此请在发送输入之前打开它。

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

`events.create` 返回 `202` 且无响应体。每个请求恰好携带一个事件。使用相同的 `Idempotency-Key` 和相同的请求体重复发送，不会启动第二个 turn。要停止正在运行的 turn，请将 `{"type": "agent.session.input.cancel"}` 作为唯一事件发送。

### Node.js 与 HTTP/2 {#node-js-and-http-2}

Node.js 26 的 `fetch` 可能会与 SandBase API 协商使用 HTTP/2。在这种情况下，如果同一个共享 HTTP/2 连接上已打开 `events.stream`，`events.create` 可能会一直阻塞，直到事件流关闭。上文中带 `allowH2: false` 的 `undici` dispatcher 可以避免这一问题。Python SDK 默认使用 HTTP/1.1，无需修改。

## 通过 SDK 使用 Skill {#skills-with-the-sdk}

`client.skills` 的用法与 OpenAI 相同，只是不支持删除单个 Skill 版本。ZIP 中必须包含一个顶层文件夹，且 `SKILL.md` 位于该文件夹内（`zip -r release-notes.zip release-notes/`）。如果 `SKILL.md` 位于 ZIP 根目录，将返回 `400 invalid_request`。

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

`skills.retrieve`、`skills.list`、`skills.update(default_version=...)`、`skills.versions.create / list / retrieve`、`skills.versions.content.retrieve` 和 `skills.delete` 同样可用。被任何 Agent 版本引用的 Skill 无法删除（`409`）；请改用 Update Skill 将 `status` 设为 `disabled`。

## 通过 SDK 使用 MCP 连接 {#mcp-connections-with-the-sdk}

OpenAI 以内联方式声明 MCP 服务器：`tools: [{"type": "mcp", ...}]`。SandBase 对这种写法返回 `400`。请先通过 [`POST /v1/mcp-connections`](/api-reference/mcp-connections/) 注册一次服务器，然后在 Agent 的 `mcp_connections` 中引用它。SDK 的通用请求方法和额外请求体字段可以完成这两步：

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

Node.js 调用以普通 JavaScript 传入 `mcp_connections`；在 TypeScript 中，该字段不在 SDK 类型定义里。MCP 服务器的 Bearer 令牌存储为 [Secrets](/agents/api-credentials)，而非 OpenAI vaults。

## 执行环境 {#execution-environment}

SandBase 在其托管云中运行每个 Session，无需选择或管理环境。

- 直接调用 HTTP 时省略 `environment`。
- OpenAI SDK 要求在 `sessions.create` 上传入 `environment` 参数（缺少该参数时 Python 会抛出 `TypeError`，Node.js 类型定义也要求提供）。传入 `{"type": "openai_hosted"}` 即可，SandBase 会接受。其他任何值（例如 `self_hosted`）都会返回 `400`。
- 为兼容 SDK，Session 响应中包含 `environment` 对象。你无需读取或处理它。

## 兼容性概览 {#compatibility-at-a-glance}

| 范围 | 状态 | 详情 |
|---|---|---|
| `beta.agents.create / retrieve / update / list / delete` | 兼容，含扩展 | 响应中额外包含 `status`、`version`、`row_version`、`projection_status`、`runtime_profile`、`skills`、`mcp_connections` 等字段。`delete` 会归档 Agent 并返回 `agent.deleted`。 |
| `beta.agents.sessions.create / retrieve / update / list / delete` | 兼容，有限制 | 接受已保存的 `agent_id`、内联 `agent` 或两者同时提供；`agent` 接受 `model`、`instructions`、`runtime_profile`、`service_tier`、`tools`、`text`、`reasoning` 和 `multi_agent`。`stream=True` 会以流式返回第一个 turn，且需要提供初始 `input`。`update` 只接受 `metadata`。`delete` 会归档 Session。 |
| `sessions.events.stream` | 兼容 | 与 OpenAI 一样仅推送实时事件。`Last-Event-ID` 或 `?after=` 返回 `400`。 |
| `sessions.events.create` | 兼容，有限制 | 每个请求恰好一个 `agent.session.input.message` 或 `agent.session.input.cancel` 事件；消息包含一个用户 `input_text` 部分或一个纯字符串。 |
| `sessions.items.list`、`sessions.turns.list / retrieve` | 兼容 | 游标分页，支持 `limit` 1-100、`after`、`order`。 |
| `client.skills` 和 `skills.versions` | 兼容，版本删除除外 | `skills.versions.delete` 返回 `404`。 |
| 错误结构 | 兼容 | `{"error": {"type", "code", "param", "message"}}`；SDK 异常通过 `exc.body` 暴露它。 |
| Agent 版本、恢复、归档、目录，Session 重命名/归档/重连/文件/工作区文件/产物 | 仅 SandBase | 参见 [Agents](/api-reference/agents/) 和 [Sessions](/api-reference/sessions/) API 参考。 |
| MCP 连接、Secrets | 仅 SandBase | 使用 HTTP 或 `client.post` / `client.get`。 |

SandBase 通过 HTTP 提供[产物列表](/api-reference/sessions/list-artifacts)和[内容下载](/api-reference/sessions/download-artifact)。产物 ID 是不透明的，且限定在 Session 范围内。这并不意味着支持所有 SDK 产物方法；SandBase 未提供单独的产物元数据端点。

### 不支持的调用 {#not-supported}

以下 OpenAI SDK 调用在 SandBase 上会失败。消息为实际返回的 `error.message`。

| SDK 调用 | 结果 |
|---|---|
| 不带初始 `input` 的 `sessions.create(..., stream=True)` | `400 invalid_request` |
| `sessions.create(..., environment={"type": "self_hosted"})` | `400`：`only openai_hosted environment is supported` |
| `sessions.create(..., agent={...})` 中包含 `model`、`instructions`、`runtime_profile`、`service_tier`、`tools`、`text`、`reasoning` 和 `multi_agent` 以外的字段 | `400 invalid_request` |
| `sessions.create(..., vault_ids=[...])` | `400 invalid_request` |
| `sessions.update(..., agent={...})` | `400`（openai-python 3.13.0 没有 `agent` 参数，会抛出 `TypeError`） |
| `agents.create(..., multi_agent={"enabled": True})` | `400`：`multi_agent is not supported` |
| `agents.create(..., tools=[{"type": "mcp", ...}])`；`tool_search`、`programmatic_tool_calling` 和 `computer_use` 工具 | `400 invalid_request`。仅接受 `function` 和一个 `web_search` 工具 |
| 带 `tool_result` 或 computer-use 审批事件的 `events.create` | `400 invalid_request`。不支持进入 `requires_action` 状态的 Session |
| 带多个事件的 `events.create` | `400`：`exactly one text input or cancel event is supported per request` |
| `sessions.traces`、`sessions.subagents`、`environments.templates` | `404 not_found`（openai-python 3.13.0 没有 `traces`） |
| `beta.agents.vaults` | `404`，响应体为纯文本（`404 page not found`），而非 JSON 错误结构 |
| `skills.versions.delete` | `404 not_found` |

### 字段差异 {#field-differences}

- Session 在 `failure`（`{code, message, action, retryable?}`）中报告失败，而不是 OpenAI 的 `error`。使用 SDK 时，`session.error` 为 `None`；请改为读取 `session.failure`。
- `required_actions` 和 `vault_ids` 始终为空数组。
- Agent 和 Session 的时间戳为 Unix 秒。Agent 版本的 `created_at`、MCP 连接和 Secrets 使用 ISO 8601 字符串。
- `402 spending_limit_exceeded` 没有专门的 SDK 异常类，会以通用的 `APIStatusError` 抛出。
- 对已知路径使用不支持的方法（例如对 `/v1/agents` 使用 `PUT`）会返回带 JSON 错误结构的 `404`，而不是 `405`。

## 后续步骤 {#next-steps}

- [Sessions](/agents/sessions)
- [Skill 与 MCP 工具](/agents/mcp-tools)
- [Agents API 参考](/api-reference/agents/)
