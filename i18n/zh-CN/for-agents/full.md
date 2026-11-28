---
i18nSource: e566962f42a5f6b0
title: SandBase AI API 指南
description: 面向 AI Agent 的 SandBase API 扩展指南，包含核心工作流、请求示例以及权威 OpenAPI 规范的链接。
---

# AI API 指南 {#ai-api-guide}

::: info Session 约定
Session（`ses_*`）运行一个已保存的 Agent 版本，通过 `POST /v1/agents/sessions` 直接创建。内部 Runtime Session ID 不对外公开。
:::

> 最常用 API 工作流的单页指南。完整的机器可读契约请使用 [OpenAPI 规范](https://www.sandbase.ai/docs/openapi.yaml)。纯文本版本：[`llms-full.txt`](https://www.sandbase.ai/docs/llms-full.txt)。

## 认证 {#authentication}

所有请求都需要：

```
Authorization: Bearer sk-YOUR_KEY
```

Base URL：`https://api.sandbase.ai/v1`

---

## 术语 {#terminology}

| 术语 | 含义 |
|------|---------|
| **Task** | 模型推理等操作的计费执行记录。并非每个 API 操作都会创建 Task。 |
| **Run** | 通过 `POST /v1/run` 发起的媒体生成请求。可以是同步或异步。使用 `GET /v1/run/{id}` 轮询。 |
| **Session** | 通过 `POST /v1/agents/sessions` 发起的 Agent 执行，包含对话、工具活动和输出。使用 `GET /v1/agents/sessions/{session_id}` 查询。 |
> **run 与 session**：模型“run”（`/v1/run`）是一次模型生成任务。“Session”（`/v1/agents/sessions`）是一次 Agent 执行。所有 ID 都是不透明的，不得解析。
>
> **task 与 run**：“run”或“session”是你发起的请求；“task”是计费执行记录。当操作返回 task ID 时，使用
> `GET /v1/tasks/{task_id}/cost` 查询。并非每个 API 操作都会创建 task。

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- GENERATION APIs                                          -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Chat Completions {#chat-completions}

### POST /v1/chat/completions {#post-v1-chat-completions}

兼容 OpenAI。流式输出、工具、视觉、推理和结构化输出的支持情况取决于所选模型及其声明的 schema。

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Explain quantum computing in one paragraph."}
    ],
    "temperature": 0.7,
    "max_tokens": 500,
    "stream": false
  }'
```

**响应：**

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "model": "openai/gpt-5.6-luna",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Quantum computing leverages quantum mechanical phenomena..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 89,
    "total_tokens": 113
  }
}
```

> 部分计费操作可能返回 `x-task-id: f3d2e8a1-7c4b-4a12-9d2e-123456789abc`；如有返回，可用它查询
> `GET /v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost`。

---

## Anthropic Messages {#anthropic-messages}

### POST /v1/messages {#post-v1-messages}

兼容 Anthropic 的 Messages API。缓存和其他可选功能取决于所选模型和请求 schema。

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-sonnet-5",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "What is SandBase?"}]
  }'
```

**响应：**

```json
{
  "id": "msg_abc123",
  "type": "message",
  "role": "assistant",
  "content": [
    { "type": "text", "text": "SandBase is an AI agent infrastructure platform..." }
  ],
  "model": "anthropic/claude-sonnet-5",
  "stop_reason": "end_turn",
  "usage": { "input_tokens": 12, "output_tokens": 64 }
}
```

---

## 图像生成 {#image-generation}

### POST /v1/run {#post-v1-run}

`/v1/run` 端点是一个**统一生成端点**，由 `model` 字段决定输出类型（图像、视频或音频）。

> **如何处理响应：**检查 `status` 字段。
> - `"completed"` → 结果在 `outputs` 中，完成。
> - `"pending"` 或 `"running"` → 每 2–5 秒轮询一次 `GET /v1/run/{id}`，直到进入终态（`completed`、`failed` 或 `timeout`）。

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bfl/flux-2/flash",
    "prompt": "A futuristic city at sunset, cyberpunk style",
    "aspect_ratio": "1:1"
  }'
```

**响应（同步）：**

```json
{
  "id": "f3d2e8a1-7c4b-4a12-9d2e-123456789abc",
  "status": "completed",
  "model": "bfl/flux-2/flash",
  "created_at": "2026-08-02T12:00:00Z",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/f3d2e8a1-7c4b-4a12-9d2e-123456789abc.png",
    "content_type": "image/png",
    "width": 1024,
    "height": 1024
  }]
}
```

---

## 视频生成 {#video-generation}

### POST /v1/run {#post-v1-run-1}

检查所选模型的 `execution_mode`。当提交返回 `pending` 或 `running` 时，轮询 `GET /v1/run/{id}` 直到进入终态。

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kwaivgi/kling-video/v3/standard/text-to-video",
    "prompt": "A drone flying over mountains at golden hour",
    "duration": 5
  }'
```

**响应（异步，初始）：**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "running",
  "model": "kwaivgi/kling-video/v3/standard/text-to-video",
  "created_at": "2026-08-02T12:00:00Z"
}
```

**轮询状态：`GET /v1/run/{id}`**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "completed",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/6a7b9c10-2d3e-4f50-8a61-23456789abcd.mp4",
    "content_type": "video/mp4",
    "duration": 5
  }]
}
```

---

## 音频（文本转语音） {#audio-text-to-speech}

### POST /v1/run {#post-v1-run-2}

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seed-speech/tts/2.0",
    "text": "Hello world, this is a test of text to speech."
  }'
```

**响应：**

```json
{
  "id": "7b8c0d21-3e4f-5061-9b72-3456789abcde",
  "status": "completed",
  "model": "bytedance/seed-speech/tts/2.0",
  "created_at": "2026-08-02T12:00:00Z",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/7b8c0d21-3e4f-5061-9b72-3456789abcde.mp3",
    "content_type": "audio/mpeg",
    "duration_seconds": 3.2
  }]
}
```

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- DISCOVERY APIs                                           -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## 列出模型 {#list-models}

### GET /v1/models {#get-v1-models}

以兼容 OpenAI 的模型列表格式返回已启用的逻辑模型。该端点不分页，默认 `type=llm`。有意省略了详细的能力和定价信息。

```bash
curl https://api.sandbase.ai/v1/models \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

响应包含 `object: "list"` 和 `data` 数组。每一项包含 `id`、`object`、`created` 和 `owned_by`；将 `id` 用作逻辑模型名称。如需能力和定价元数据，请获取该模型的详情。

---

## 获取模型 {#get-model}

### GET /v1/models/{id_or_name} {#get-v1-models-1}

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

详情响应额外包含 `unified_schema`、`supported_modes` 和 `model_card`。详细价格位于 `model_card` 中；没有顶层的 `pricing` 对象。

---

## 获取任务费用 {#get-task-cost}

### GET /v1/tasks/{task_id}/cost {#get-v1-tasks-task-id-cost}

使用 API 操作返回的 task ID 查询该任务记录的费用。

```bash
curl https://api.sandbase.ai/v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

**响应：**

```json
{
  "id": "f3d2e8a1-7c4b-4a12-9d2e-123456789abc",
  "status": "completed",
  "settled": true,
  "currency": "USD",
  "cost": "0.000325",
  "estimated_cost": "0.000325",
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 89,
    "total_tokens": 113,
    "cached_tokens": 0,
    "cache_creation_tokens": 0,
    "reasoning_tokens": 0
  }
}
```

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- PLATFORM APIs                                            -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Agents 平台约定 {#agents-platform-conventions}

- Base URL 为 `https://api.sandbase.ai/v1`。发送 `Authorization: Bearer sk-YOUR_KEY` 或 `X-API-Key: sk-YOUR_KEY`（两者都发送时值必须相同）。`OpenAI-Beta` 为可选项；如发送，其值必须为 `agents=v1`。官方 OpenAI SDK（`client.beta.agents`、`client.skills`）可配合 `base_url="https://api.sandbase.ai/v1"` 使用；差异见 [OpenAI 兼容性](/agents/openai-compatibility)。

- 请求体为严格 JSON，最大 1 MiB；未知字段返回 400。

- 错误格式：`{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}`。请根据 `code` 分支处理；参见[错误指南](./errors#agents-platform-errors)。

- `row_version` 是 PATCH、archive、restore 和 rotate 使用的比较并设置令牌。遇到 409 时请重新读取。

- 游标分页列表（Agents、Sessions、items、turns、Skills）：`limit` 1-100、`after`、`order`；响应为 `{object:"list", data, has_more, first_id, last_id}`。

- 偏移分页列表（Agent 版本、附件、MCP 连接、Secrets）：`limit`、`offset`；响应为 `{data, total, limit, offset}`。

- ID 前缀：Agent 为 `agt_`，Session 为 `ses_`，Skill 为 `skl_`，MCP 连接为 `mcp_`，Secret 为 `sec_`，附件为 `fil_`。请将其视为不透明值。

---

## Agents {#agents}

### POST /v1/agents — 创建 Agent {#post-v1-agents-—-create-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: create-research-agent-1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research assistant",
    "model": "deepseek/deepseek-v4-flash",
    "instructions": "Research the question and cite sources."
  }'
```

必填：`model`。可选：`name`、`instructions`、`description`、`runtime_profile`（默认 `codex`，可选 `claude`、`mcode`）、`skills`（`[{"skill_id","version"}]`）、`mcp_connections`（`[{"connection_id","server_label","allowed_tools","required"}]`）、`tools`、`text`、`reasoning`、`service_tier`、`metadata`、`note`。返回 `201`，包含 `id`（`agt_`）、`version`、`row_version`、`status` 和 `projection_status`；当 `projection_status` 为 `ready` 时再启动 Session。`web_search` 工具必须使用 `mode: "disabled"`，且不支持客户端 function 结果（`requires_action`）。

### GET /v1/agents — 列出 Agents {#get-v1-agents-—-list-agents}

查询参数 `status`（默认 `active`，可选 `archived`、`all`），并支持游标分页。

### GET /v1/agents/{agent_id} — 获取 Agent {#get-v1-agents-agent-id-—-get-agent}

### POST /v1/agents/{agent_id} — 更新 Agent（SDK 风格） {#post-v1-agents-agent-id-—-update-agent-sdk-style}

部分更新 `name`、`instructions`、`model`、`metadata`、`service_tier`、`tools`、`text`、`reasoning`、`runtime_profile`、`mcp_connections`、`skills`。无需 `row_version`；会创建新版本。

### PATCH /v1/agents/{agent_id} — 更新 Agent（比较并设置） {#patch-v1-agents-agent-id-—-update-agent-compare-and-set}

字段同上，另外支持 `description` 和 `note`；`row_version` 为必填项。显式传入 `null` 返回 400。

### 版本、归档、恢复与目录 {#versions-archive-restore-catalog}

- `GET /v1/agents/{agent_id}/versions` 和 `GET /v1/agents/{agent_id}/versions/{version}` 读取不可变快照。

- `POST /v1/agents/{agent_id}/archive`、`POST /v1/agents/{agent_id}/unarchive` 接受 `{"row_version"}`。`DELETE /v1/agents/{agent_id}` 同样执行归档。

- `POST /v1/agents/{agent_id}/restore` 接受 `{"source_version","row_version"}`。

- `GET /v1/agents/catalog` 列出公开的 Agents；`POST /v1/agents/catalog/{agent_id}/clone` 将其中一个复制到你的组织中（`201`，新的 `agt_`）。

---

## Sessions {#sessions}

Session 运行一个已保存的 Agent 版本。路径位于 `/v1/agents/sessions` 下。Agent 版本、Skill 版本和 MCP 连接在创建时冻结。

### POST /v1/agents/sessions — 创建 Session {#post-v1-agents-sessions-—-create-session}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_..."}'
```

发送 `agent_id`（已保存的 Agent）、`agent`（内联 Agent，或针对单个 Session 覆盖 `model`、`instructions`、`runtime_profile`、`service_tier`、`tools`、`text`、`reasoning` 和 `multi_agent`），或两者都发送。可选：`version`（仅限已保存的 Agent）、`title`、`input`（字符串，或恰好包含一条 user 消息且该消息只含一个 `input_text` 部分的数组）、`model` 或 `agent.model`、`metadata`、`model_provider`（`{"type":"custom","base_url":"https://...","api_key":"..."}`；省略时使用你的调用密钥）。`stream: true` 搭配非空 `input` 时，返回 `201`，并以 Server-Sent Events 流的形式返回第一个轮次，首个事件为 `agent.session.created`。Session 始终运行在 SandBase 托管云中，因此无需选择环境；但 OpenAI SDK 仍要求传入 `environment={"type": "openai_hosted"}`。返回 `201`，包含 `status`（`idle`、`in_progress`、`failed`）、`lifecycle_status`（`active`、`archived`）、`failure`、`source`（`direct`、`service`、`schedule`）和 `row_version`。

### GET /v1/agents/sessions/{session_id}/events — 流式获取事件（SSE） {#get-v1-agents-sessions-session-id-events-—-stream-events-sse}

仅提供实时事件。请在发送输入之前打开。使用 `Last-Event-ID` 或 `after` 返回 400；事件不会重放。事件 `type` 值以 `agent.session.` 开头。

### POST /v1/agents/sessions/{session_id}/events — 发送输入 {#post-v1-agents-sessions-session-id-events-—-send-input}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_.../events \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "Summarize the findings."}]}'
```

每个请求恰好包含一个事件：`agent.session.input.message` 或 `agent.session.input.cancel`。返回 `202`，无响应体。扩展形式：`{"input": "...", "file_ids": ["fil_..."]}`（最多 10 个已就绪附件）。`409 session_input_pending` 表示之前的输入仍在投递中；请等待，不要使用新键重新发送。

### 历史记录及其他 Session 操作 {#history-and-other-session-operations}

- `GET /v1/agents/sessions`（查询参数 `lifecycle_status`、`agent_id`）、`GET /v1/agents/sessions/{session_id}`。

- `GET /v1/agents/sessions/{session_id}/items`、`GET /v1/agents/sessions/{session_id}/turns`、`GET /v1/agents/sessions/{session_id}/turns/{turn_id}` 读取历史记录。

- `POST /v1/agents/sessions/{session_id}` 替换 `metadata`；`PATCH /v1/agents/sessions/{session_id}` 使用 `{"title","row_version"}` 重命名。

- `POST /v1/agents/sessions/{session_id}/cancel`（需要 `Idempotency-Key`）取消正在运行的轮次。

- `DELETE /v1/agents/sessions/{session_id}` 执行归档；`POST /v1/agents/sessions/{session_id}/unarchive` 取消归档。

- `POST /v1/agents/sessions/{session_id}/files` 上传一个附件（multipart `file`，5 MiB，需要 `Idempotency-Key`）。

- `POST /v1/agents/sessions/{session_id}/reconnect` 返回用于 `GET /v1/agents/sessions/{session_id}/events/stream` 的 `stream_url`，该流会先发送 `session.snapshot`，再发送实时事件。

---

### 工作区文件与输出产物 {#workspace-files-and-output-artifacts}

- `GET /v1/agents/sessions/{session_id}/workspace-files` 列出 `path`（默认 `/workspace`）下当前文件的元数据。查询参数 `limit`（1-100，默认 20）、`order`（默认 `asc`，或 `desc`）和 `page`（上一次返回的 `next` 游标）。返回 `{object:"page", data:[{path,size_bytes}], next, has_more}`。游标无效时需从第一页重新开始。
- `GET /v1/agents/sessions/{session_id}/artifacts` 列出在 `/workspace/outputs/` 下捕获的不可变输出。查询参数 `limit`（默认 20）、`order`（默认 `desc`）和 `after`（当 `has_more` 为 true 时使用 `last_id`）。
- `GET /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` 使用返回的不透明 `art_` ID 下载完整产物。下载上限为 200 MiB；不支持 `Range`（`416`）。工作区元数据、上传的附件和捕获的产物是相互独立的资源。

---

## Skills、MCP 连接与 Secrets {#skills-mcp-connections-and-secrets}

### POST /v1/skills — 创建 Skill {#post-v1-skills-—-create-skill}

```bash
curl -X POST https://api.sandbase.ai/v1/skills \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -F "files=@release-notes.zip;type=application/zip"
```

一个 ZIP 部分 `files`（5 MiB）。ZIP 中必须只有一个顶层文件夹，且其中包含 `SKILL.md`（frontmatter 含 `name` 和 `description`），例如 `zip -r release-notes.zip release-notes/`；`SKILL.md` 位于 ZIP 根目录时返回 `400 invalid_request`。被任何 Agent 版本（包括已归档的 Agent）引用的 Skill 无法删除（`409`）；请改用 `POST /v1/skills/{skill_id}` 并传入 `{"status": "disabled"}` 将其禁用。返回 `201`，包含 `id`（`skl_`）和 `default_version`。使用 `POST /v1/skills/{skill_id}/versions` 添加版本；使用 `GET /v1/skills` 列出。在 Agent 中以 `{"skill_id": "skl_...", "version": null}` 引用。

### POST /v1/mcp-connections — 注册 MCP 服务器 {#post-v1-mcp-connections-—-register-an-mcp-server}

请求体 `{"name", "server_url" (HTTPS), "secret_id"?}`；需要 `Idempotency-Key`。在 Agent 的 `mcp_connections` 中引用。禁用后会阻止新 Session 和后续输入。

### POST /v1/secrets — 存储 MCP Bearer token {#post-v1-secrets-—-store-an-mcp-bearer-token}

请求体 `{"name", "kind": "mcp_bearer", "server_url", "token"}`；需要 `Idempotency-Key`。token 只写不读，并绑定到该确切 URL。Secret 不是环境变量。使用 `POST /v1/secrets/{secret_id}/rotate` 轮换；使用 `DELETE /v1/secrets/{secret_id}`（204）吊销。

---

## 账单与费用 {#billing-cost}

### 费用计算方式 {#how-costs-are-calculated}

- 从所选模型的 `model_card` 中读取其当前的定价公式和计量单位。
- 按 token 计价的模型在声明时可包含输入、输出、缓存或推理等计费项。
- 媒体模型和其他模型可能按请求次数、时长、分辨率或其他模型特定单位计价。
- 数据 API（搜索、社交、抓取、电商、金融）每个组织每个 UTC 日有 100 次免费调用，由符合条件的数据 API 共享，并在 UTC 00:00 重置。超出后按次计费，不会被拒绝。余额为零的组织仍可使用免费调用。
- 不适用免费额度：LLM、媒体模型，以及价格较高或按公式计价的数据 API（例如部分批量端点、crawl、小红书蒲公英以及抖音星图 `kol-*` 路由），这些从第一次调用起就计费。以 `sandbase_inspect` 中的 `pricing.free_quota` 为准。
- MCP：`sandbase_inspect` 会在符合条件的工具上显示 `pricing.free_quota`；`sandbase_account` 返回 `free_api_quota`（`daily_limit`、`used_today`、`remaining`、`resets_at`）；已结算的 `sandbase_run` 和 `sandbase_run_get` 结果包含 `free_quota_status`（`free`、`overage` 或 `degraded`）。
- 当计费操作返回 task ID（包括 `x-task-id` 响应头）时，使用 `GET /v1/tasks/{task_id}/cost` 查询结算和用量。
- 对于异步的 `POST /v1/run` 响应，使用 `GET /v1/run/{id}` 查询生成结果；run ID 不是 task ID，不得发送到费用端点。

### 预算控制 {#budget-control}

- 在 [Developer → API Keys](https://www.sandbase.ai/console/keys) 下创建或编辑标准密钥时，可设置可选的支出上限。
- 在 **Developer → Activities → Usage** 下监控请求和费用。
- 在 [Developer → Billing](https://www.sandbase.ai/console/billing) 下查看余额和额度交易记录。

---

## 另请参阅 {#see-also}

- [模型与定价](./models)：实时模型发现、能力和定价说明
- [错误指南](./errors)：文档化的响应格式、HTTP 处理和重试安全性
- [OpenAPI 规范](https://www.sandbase.ai/docs/openapi.yaml)：机器可读的 schema


## Agent Skill 版本绑定 {#agent-skill-version-bindings}

保存 Agent 时，每个新的 Skill 引用都会固定到一个明确的版本。对于新绑定，`version: null` 会选择保存时的当前默认版本。对于已有绑定，`version: null` 会保留其已固定的版本。更改 Skill 的默认版本不会升级已保存的 Agent 或现有 Session；如需让后续 Session 使用新版本，请在 Agent 上保存一个明确的版本。
