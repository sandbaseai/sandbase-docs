---
i18nSource: e904f2b8bbd0ccc4
title: Sessions
description: 在 Session 中运行 Agent，流式获取其事件，读取历史记录，附加文件并处理失败。
---

# Sessions {#sessions}

**Session** 在 SandBase 托管云中运行一个已保存的 Agent 版本，你无需选择执行环境。Session ID 以 `ses_` 开头，所有 Session 路径都位于 `/v1/agents/sessions` 下。Session 会冻结其启动时的 Agent 版本、Skill 版本和 MCP 连接配置。

## Session 如何启动 {#how-sessions-start}

使用 `POST /v1/agents/sessions` 创建 Session。该 Session 会报告 `source: "direct"`。

## 运行 Session {#run-a-session}

原生事件流**仅推送实时事件**：断开连接后事件不会重放。请在发送输入之前打开事件流，并通过 items 或 turns 读取历史记录。

```bash
# 1. Create the Session
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-2026-10-06" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60"}'

# 2. In another terminal, follow live events (server-sent events)
curl -N https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY"

# 3. Send input (202 Accepted, no body)
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "List three notable launches this week."}]}'

# 4. Read the history afterwards
curl "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

下面是使用官方 OpenAI Python SDK 的相同流程。先打开事件流，在另一个线程中发送输入，并在收到终止 turn 事件时停止。Node.js 版本和 SDK 差异请参见 [OpenAI 兼容性](/agents/openai-compatibility)。

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
import threading
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
session = client.beta.agents.sessions.create(
    agent_id="agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
    environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
)

def send_input():
    client.beta.agents.sessions.events.create(
        session.id,
        events=[{
            "type": "agent.session.input.message",
            "input": [{"role": "user", "content": [{"type": "input_text", "text": "List three notable launches this week."}]}],
        }],
        idempotency_key="market-scan-input-1",
    )

with client.beta.agents.sessions.events.stream(session.id) as stream:
    threading.Thread(target=send_input).start()
    for event in stream:
        print(event.type)
        if event.type in ("agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"):
            break
```

每次发送恰好携带一个事件。`input` 是一个文本字符串，或是一个只包含一条用户消息的数组，且该消息只包含一个 `input_text` 部分：`[{"role": "user", "content": [{"type": "input_text", "text": "…"}]}]`。其他任何结构都会返回 `400 invalid_request`。要停止正在运行的 turn，请发送 `{"type": "agent.session.input.cancel"}`，或携带 `Idempotency-Key` 调用 `POST /v1/agents/sessions/{session_id}/cancel`。取消空闲的 Session 仍会返回 `202 {"accepted": true}`，且不会做任何更改。你也可以在创建 Session 时传入第一条 `input`。创建时不支持 `stream: true`。

## 状态与失败 {#status-and-failures}

| 字段 | 取值 | 含义 |
|---|---|---|
| `status` | `idle`、`in_progress`、`failed` | Session 的执行状态 |
| `lifecycle_status` | `active`、`archived` | Session 是否接受输入 |
| `failure` | `null` 或 `{code, message, action, retryable?}` | 失败的公开原因及建议的下一步操作 |

`failure.action` 告诉你接下来该怎么做：`retry_later`、`inspect_history`、`create_new_session`、`check_model_account` 或 `create_session_with_updated_model_provider`。参见[失败代码表](/api-reference/sessions/#status-fields)。

目前尚不支持向客户端请求结果的函数工具（`requires_action`）；读取此类 Session 会返回 `502 executor_contract_error`。

如果发送返回 `409 session_input_pending`，说明之前的输入仍在投递中。请等待并读取 Session；不要使用新的 `Idempotency-Key` 重新发送，否则输入可能会执行两次。

## 归档 {#archive}

`DELETE /v1/agents/sessions/{session_id}` 会归档 Session；Session 不会被硬删除。`POST /v1/agents/sessions/{session_id}/archive` 和 `/unarchive` 接受 `{"row_version": …}`。已归档的 Session 保留其历史记录，但会拒绝输入、元数据更新和事件流。

## 附件 {#attachments}

使用 `POST /v1/agents/sessions/{session_id}/files` 将文件上传到 Session 工作区（multipart 字段 `file`，最大 5 MiB，必须提供 `Idempotency-Key`）。支持的类型为 `.txt`、`.md`、`.csv`、`.log`、`.json`、`.pdf`、`.png`、`.jpg`、`.jpeg` 和 `.webp`。当文件的 `status` 为 `ready` 时，可将其与最多九个其他文件一起发送：

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-2" \
  -H "Content-Type: application/json" \
  -d '{"input": "Summarize the attached report.", "file_ids": ["fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72"]}'
```

## 客户端重连 {#reconnecting-clients}

浏览器类客户端如需在连接中断后获得一致的视图，可以调用 `POST /v1/agents/sessions/{session_id}/reconnect`。它会返回 Session 以及指向 `GET /v1/agents/sessions/{session_id}/events/stream` 的 `stream_url`，该事件流会先发送 `session.snapshot`，然后发送实时事件和 `heartbeat`。如果该事件流发出 `stream.interrupted`，请再次重连，而不是重新发送输入。

## GitHub 仓库 {#github-repository}

在创建时发送 `github_workspace`，即可将 GitHub 仓库克隆到 `/workspace`，并允许 Agent 推送到其专属的 Session 分支。参见 [GitHub 仓库工作区](/agents/github-workspace)。

## 模型凭据 {#model-credentials}

除非你发送 `model_provider`，否则 Session 会使用创建它的 API 密钥调用模型。使用 `{"type": "custom", "base_url": "https://…", "api_key": "…"}` 可以改为调用你自己的兼容 OpenAI 的 HTTPS 端点。`model_provider` 为只写字段。

## ID {#ids}

| 前缀 | 资源 |
|---|---|
| `agt_` | Agent |
| `ses_` | Session |
| `skl_` | Skill |
| `mcp_` | MCP 连接 |
| `sec_` | Secret |
| `fil_` | Session 附件 |

请将 ID 视为不透明字符串。

## 后续步骤 {#next-steps}

- [Sessions API 参考](/api-reference/sessions/)
- [OpenAI 兼容性](/agents/openai-compatibility)

## 工作区文件与生成的产物 {#workspace-files-and-generated-artifacts}

这三类资源用途各不相同：

| 资源 | 用途 | 分页 |
|---|---|---|
| [附件](/api-reference/sessions/list-files) | 你上传的文件，可在输入中通过 `file_id` 引用 | `limit` / `offset` |
| [工作区文件](/api-reference/sessions/list-workspace-files) | 工作区目录中当前的文件路径和大小 | `page` / `next` |
| [产物](/api-reference/sessions/list-artifacts) | 可供下载的不可变生成输出 | `after` / `last_id` |

先列出产物以获取 `art_` ID，再将该 ID 原样传给[下载产物](/api-reference/sessions/download-artifact)。工作区路径或附件的 `file_id` 不能替代它。工作区列表只返回元数据，不是任意路径的下载 API。产物可作为完整文件下载，最大 200 MiB；不支持 `Range` 部分下载。
