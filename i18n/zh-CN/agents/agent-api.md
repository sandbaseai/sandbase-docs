---
i18nSource: 2ba7f0f41847d04f
title: 定义 Agent
description: 使用 Agents API 创建和更新带版本的 Agent，包括字段、限制、版本和归档。
---

# 定义 Agent {#define-an-agent}

使用 `POST /v1/agents` 创建 Agent。该 API 遵循 OpenAI Agents 协议，因此你可以直接发送 HTTP 请求，也可以使用 OpenAI SDK 的 `client.beta.agents` 并设置 `base_url="https://api.sandbase.ai/v1"`。`OpenAI-Beta` 请求头是可选的；如果发送，其值必须为 `agents=v1`。SDK 支持的功能请参阅 [OpenAI 兼容性](/agents/openai-compatibility)。

## 创建 Agent {#create-an-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: create-research-agent-1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research assistant",
    "model": "deepseek/deepseek-v4-flash",
    "instructions": "Research the question, compare at least two sources, and cite them.",
    "metadata": {"team": "research"}
  }'
```

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
agent = client.beta.agents.create(
    model="deepseek/deepseek-v4-flash",
    name="Research assistant",
    instructions="Research the question, compare at least two sources, and cite them.",
    metadata={"team": "research"},
)
print(agent.id, agent.version)  # agt_..., 1
```

响应为 `201 Created`，并返回该 Agent：包括 `agt_` ID、`version: 1`、`row_version`、`status: "active"` 和 `projection_status`。新版本会在后台准备执行环境；待 `projection_status` 变为 `ready` 后再启动 Session。

`Idempotency-Key` 是可选的。省略时服务会自动生成一个，因此重试请求可能会创建第二个 Agent。重试时请发送你自己的固定键。

## 字段 {#fields}

请求体为严格 JSON（最大 1 MiB）。未知字段会返回 400。

| 字段 | 必填 | 限制与取值 |
|---|---|---|
| `model` | 是 | 模型 ID，最多 200 个字符 |
| `name` | 否 | 最多 128 个字符 |
| `instructions` | 否 | 最大 256 KiB |
| `description` | 否 | 最多 4096 个字符 |
| `runtime_profile` | 否 | `codex`（默认）、`claude` 或 `mcode` |
| `skills` | 否 | 最多 32 个引用。新绑定若为 `version: null`，保存时会固定为当前默认版本；已有绑定保留其固定版本。如需升级，请指定明确版本；参阅 [Skills](/agents/mcp-tools#skills) |
| `mcp_connections` | 否 | 最多 32 个引用；参阅 [MCP 连接](/agents/mcp-tools#mcp-connections) |
| `tools` | 否 | 最多 64 个 `function` 工具，以及最多一个 `web_search` 工具 |
| `text` | 否 | `format.type` 为 `text` 或 `json_schema`（对象 schema）；`verbosity` 为 `low`、`medium` 或 `high` |
| `reasoning` | 否 | `effort` 为 `none`、`minimal`、`low`、`medium`、`high`、`xhigh` 或 `max`；`summary` 为 `concise`、`detailed` 或 `auto` |
| `service_tier` | 否 | `auto`（默认）、`default`、`flex`、`priority` 或 `fast` |
| `metadata` | 否 | 最多 16 个字符串键值对；键最多 64 个字符，值最多 512 个字符 |
| `note` | 否 | 存储在该版本上的变更说明 |

## 当前限制 {#current-limits}

- `web_search` 必须使用 `"mode": "disabled"`，Session 才能启动。
- `function` 工具可以保存，但暂不支持需要客户端返回工具结果（`requires_action`）的 Run。处于该状态的 Session 会返回 `502 executor_contract_error`。请改用 [MCP 连接](/agents/mcp-tools#mcp-connections) 为 Agent 提供外部能力。
- `multi_agent` 必须省略或设为 `null`。

## 更新 Agent {#update-an-agent}

有两种更新方式，都会创建新版本。

- `POST /v1/agents/{agent_id}` 是 OpenAI SDK 风格的更新。只需发送要修改的字段。无需 `row_version`，因此以最后一次写入为准。此方式不接受 `description` 和 `note`。
- `PATCH /v1/agents/{agent_id}` 是比较并设置（compare-and-set）更新。它要求提供你最近一次读取到的 `row_version`，如果期间 Agent 已被修改，则返回 409。显式的 `null` 值会被拒绝。

```bash
curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 2, "instructions": "Answer in five bullet points with cited sources.", "note": "Shorter answers"}'
```

## 版本、归档与恢复 {#versions-archive-and-restore}

- `GET /v1/agents/{agent_id}/versions` 列出不可变的版本快照；`GET /v1/agents/{agent_id}/versions/{version}` 读取单个版本。
- `POST /v1/agents/{agent_id}/restore` 配合 `{"source_version": 1, "row_version": 3}`，会将较早的配置复制为新的当前版本。
- `POST /v1/agents/{agent_id}/archive` 和 `/unarchive` 接受 `{"row_version": …}`。已归档的 Agent 无法启动新的 Session。
- `DELETE /v1/agents/{agent_id}` 会归档该 Agent。Agent 永远不会被硬删除。

## 后续步骤 {#next-steps}

- [Skills 与 MCP 工具](/agents/mcp-tools)
- [在 Session 中运行 Agent](/agents/sessions)
- [Agents API 参考](/api-reference/agents/)
