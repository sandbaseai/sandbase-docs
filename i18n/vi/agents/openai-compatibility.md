---
i18nSource: d637409019c8109d
title: Tương thích OpenAI
description: Dùng OpenAI SDK chính thức với SandBase Agents, Sessions và Skills, đồng thời xem SandBase khác OpenAI Agents API ở những điểm nào.
---

# Tương thích OpenAI {#openai-compatibility}

SandBase Agents triển khai giao thức [OpenAI Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview) cho Agent, Session, sự kiện session, item, turn và Skill. Với các tài nguyên này, bạn có thể dùng trực tiếp OpenAI SDK chính thức: trỏ `base_url` tới `https://api.sandbase.ai/v1` và truyền SandBase API key.

MCP connection, Secret và các catalog là tài nguyên chỉ có trên SandBase. SDK không có phương thức cho chúng, vì vậy hãy gọi qua HTTP (hoặc dùng các phương thức chung `client.post` / `client.get` của SDK).

Các phiên bản SDK đã được kiểm chứng:

| SDK | Phiên bản | Ghi chú |
|---|---|---|
| openai-python | 3.13.0, 3.24.0 | `sessions.update(agent=...)` và `sessions.traces` không có trong 3.13.0 |
| openai-node | 7.28.0 (Node.js 26) | Dùng dispatcher HTTP/1.1 cho streaming, xem [bên dưới](#node-js-and-http-2) |

## Thiết lập client {#set-up-the-client}

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

SDK tự động gửi `OpenAI-Beta: agents=v1`. SandBase chấp nhận giá trị này hoặc không có header; mọi giá trị khác trả về `400`.

## Chạy một Agent từ đầu đến cuối {#run-an-agent-end-to-end}

Tạo Agent, tạo Session, mở luồng sự kiện trực tiếp, gửi một input và đọc lịch sử. Luồng chỉ phát trực tiếp, vì vậy hãy mở nó trước khi gửi input.

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

`events.create` trả về `202` không có body. Mỗi request mang đúng một sự kiện. Dùng lại cùng `Idempotency-Key` với cùng body sẽ không bắt đầu turn thứ hai. Để dừng turn đang chạy, hãy gửi `{"type": "agent.session.input.cancel"}` làm sự kiện duy nhất.

### Node.js và HTTP/2 {#node-js-and-http-2}

`fetch` của Node.js 26 có thể thương lượng HTTP/2 với SandBase API. Khi đó, trên một kết nối HTTP/2 dùng chung, `events.create` có thể bị treo trong khi `events.stream` đang mở trên cùng kết nối, cho đến khi luồng đóng. Dispatcher `undici` với `allowH2: false` ở trên giúp tránh tình trạng này. Python SDK mặc định dùng HTTP/1.1 và không cần thay đổi.

## Skill với SDK {#skills-with-the-sdk}

`client.skills` hoạt động như trong OpenAI, ngoại trừ việc không thể xóa riêng một phiên bản Skill. File ZIP phải chứa một thư mục cấp cao nhất có `SKILL.md` bên trong (`zip -r release-notes.zip release-notes/`). Một `SKILL.md` nằm ở thư mục gốc của ZIP sẽ trả về `400 invalid_request`.

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

`skills.retrieve`, `skills.list`, `skills.update(default_version=...)`, `skills.versions.create / list / retrieve`, `skills.versions.content.retrieve` và `skills.delete` cũng hoạt động. Không thể xóa Skill đang được bất kỳ phiên bản Agent nào tham chiếu (`409`); thay vào đó, hãy đặt `status` thành `disabled` bằng Update Skill.

## MCP connection với SDK {#mcp-connections-with-the-sdk}

OpenAI khai báo MCP server trực tiếp dưới dạng `tools: [{"type": "mcp", ...}]`. SandBase trả về `400` cho dạng này. Hãy đăng ký server một lần bằng [`POST /v1/mcp-connections`](/api-reference/mcp-connections/) và tham chiếu nó từ `mcp_connections` của Agent. Các phương thức request chung và trường body bổ sung của SDK đáp ứng được cả hai bước:

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

Lệnh gọi Node.js truyền `mcp_connections` bằng JavaScript thuần; trong TypeScript, trường này không thuộc kiểu dữ liệu của SDK. Bearer token cho MCP server được lưu dưới dạng [Secret](/agents/api-credentials), không phải OpenAI vault.

## Môi trường thực thi {#execution-environment}

SandBase chạy mọi Session trên cloud được lưu trữ của mình; bạn không cần chọn hay quản lý môi trường.

- Lệnh gọi HTTP trực tiếp bỏ qua `environment`.
- OpenAI SDK yêu cầu tham số `environment` trên `sessions.create` (Python báo `TypeError` nếu thiếu, và kiểu dữ liệu Node.js bắt buộc có nó). Hãy truyền `{"type": "openai_hosted"}`; SandBase chấp nhận giá trị này. Mọi giá trị khác, chẳng hạn `self_hosted`, trả về `400`.
- Response của Session có đối tượng `environment` để tương thích với SDK. Bạn không cần đọc hay xử lý nó.

## Tổng quan về khả năng tương thích {#compatibility-at-a-glance}

| Lĩnh vực | Trạng thái | Chi tiết |
|---|---|---|
| `beta.agents.create / retrieve / update / list / delete` | Tương thích, có mở rộng | Response bổ sung `status`, `version`, `row_version`, `projection_status`, `runtime_profile`, `skills`, `mcp_connections` và các trường khác. `delete` lưu trữ Agent và trả về `agent.deleted`. |
| `beta.agents.sessions.create / retrieve / update / list / delete` | Tương thích, có giới hạn | Chấp nhận `agent_id` đã lưu, `agent` inline hoặc cả hai; `agent` chấp nhận `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` và `multi_agent`. `stream=True` stream turn đầu tiên và cần `input` ban đầu. `update` chỉ chấp nhận `metadata`. `delete` lưu trữ Session. |
| `sessions.events.stream` | Tương thích | Chỉ phát trực tiếp, giống OpenAI. `Last-Event-ID` hoặc `?after=` trả về `400`. |
| `sessions.events.create` | Tương thích, có giới hạn | Đúng một sự kiện `agent.session.input.message` hoặc `agent.session.input.cancel` mỗi request; message có một phần `input_text` của người dùng hoặc một chuỗi thuần. |
| `sessions.items.list`, `sessions.turns.list / retrieve` | Tương thích | Phân trang bằng cursor với `limit` 1-100, `after`, `order`. |
| `client.skills` và `skills.versions` | Tương thích, trừ xóa phiên bản | `skills.versions.delete` trả về `404`. |
| Cấu trúc lỗi | Tương thích | `{"error": {"type", "code", "param", "message"}}`; exception của SDK cung cấp nó qua `exc.body`. |
| Phiên bản Agent, khôi phục, lưu trữ, catalog, đổi tên/lưu trữ/kết nối lại/file/file workspace/artifact của Session | Chỉ có trên SandBase | Xem tài liệu tham khảo API [Agents](/api-reference/agents/) và [Sessions](/api-reference/sessions/). |
| MCP connection, Secret | Chỉ có trên SandBase | Dùng HTTP hoặc `client.post` / `client.get`. |

SandBase cung cấp [liệt kê artifact](/api-reference/sessions/list-artifacts) và [tải nội dung](/api-reference/sessions/download-artifact) qua HTTP. ID artifact là chuỗi mờ và có phạm vi trong Session. Điều này không có nghĩa là mọi phương thức artifact của SDK đều được hỗ trợ; không có endpoint metadata artifact riêng.

### Không được hỗ trợ {#not-supported}

Các lệnh gọi OpenAI SDK sau sẽ thất bại với SandBase. Thông báo là `error.message` thực tế được trả về.

| Lệnh gọi SDK | Kết quả |
|---|---|
| `sessions.create(..., stream=True)` không có `input` ban đầu | `400 invalid_request` |
| `sessions.create(..., environment={"type": "self_hosted"})` | `400`: `only openai_hosted environment is supported` |
| `sessions.create(..., agent={...})` với trường khác ngoài `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` và `multi_agent` | `400 invalid_request` |
| `sessions.create(..., vault_ids=[...])` | `400 invalid_request` |
| `sessions.update(..., agent={...})` | `400` (openai-python 3.13.0 không có tham số `agent` và báo `TypeError`) |
| `agents.create(..., multi_agent={"enabled": True})` | `400`: `multi_agent is not supported` |
| `agents.create(..., tools=[{"type": "mcp", ...}])`; các tool `tool_search`, `programmatic_tool_calling` và `computer_use` | `400 invalid_request`. Chỉ chấp nhận `function` và một tool `web_search` |
| `events.create` với sự kiện `tool_result` hoặc sự kiện phê duyệt computer-use | `400 invalid_request`. Session chuyển sang `requires_action` không được hỗ trợ |
| `events.create` với nhiều hơn một sự kiện | `400`: `exactly one text input or cancel event is supported per request` |
| `sessions.traces`, `sessions.subagents`, `environments.templates` | `404 not_found` (openai-python 3.13.0 không có `traces`) |
| `beta.agents.vaults` | `404` với body dạng văn bản thuần (`404 page not found`), không phải cấu trúc lỗi JSON |
| `skills.versions.delete` | `404 not_found` |

### Khác biệt về trường {#field-differences}

- Session báo lỗi trong `failure` (`{code, message, action, retryable?}`), không phải `error` như OpenAI. Với SDK, `session.error` là `None`; hãy đọc `session.failure`.
- `required_actions` và `vault_ids` luôn là mảng rỗng.
- Timestamp của Agent và Session tính bằng giây Unix. `created_at` của phiên bản Agent, MCP connection và Secret dùng chuỗi ISO 8601.
- `402 spending_limit_exceeded` không có lớp exception riêng trong SDK; nó xuất hiện dưới dạng `APIStatusError` chung.
- Phương thức không được hỗ trợ trên một path đã biết (ví dụ `PUT` trên `/v1/agents`) trả về `404` với cấu trúc lỗi JSON, không phải `405`.

## Bước tiếp theo {#next-steps}

- [Sessions](/agents/sessions)
- [Skill và MCP tool](/agents/mcp-tools)
- [Tài liệu tham khảo Agents API](/api-reference/agents/)
