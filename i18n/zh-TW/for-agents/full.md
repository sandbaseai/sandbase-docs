---
i18nSource: e566962f42a5f6b0
title: SandBase AI API 指南
description: 為 AI Agent 撰寫的 SandBase API 延伸指南，涵蓋核心工作流程、請求範例，以及權威 OpenAPI 規格的連結。
---

# AI API 指南 {#ai-api-guide}

::: info Session 合約
Session（`ses_*`）執行一個已儲存的 Agent 版本，並直接以 `POST /v1/agents/sessions` 建立。內部 Runtime Session ID 不會公開。
:::

> 這是一份涵蓋最常見 API 工作流程的單頁指南。完整的機器可讀合約請使用 [OpenAPI 規格](https://www.sandbase.ai/docs/openapi.yaml)。純文字版本：[`llms-full.txt`](https://www.sandbase.ai/docs/llms-full.txt)。

## 驗證 {#authentication}

所有請求都需要：

```
Authorization: Bearer sk-YOUR_KEY
```

基礎 URL：`https://api.sandbase.ai/v1`

---

## 術語 {#terminology}

| 術語 | 意義 |
|------|---------|
| **Task** | 模型推論等操作的計費執行紀錄。並非每個 API 操作都會建立 Task。 |
| **Run** | 透過 `POST /v1/run` 發出的媒體生成請求。可能為同步或非同步。以 `GET /v1/run/{id}` 輪詢。 |
| **Session** | 透過 `POST /v1/agents/sessions` 進行的 Agent 執行，保存對話、工具活動與輸出。以 `GET /v1/agents/sessions/{session_id}` 查詢。 |
> **run 與 session**：模型「run」（`/v1/run`）是模型生成任務。「Session」（`/v1/agents/sessions`）是 Agent 執行。所有 ID 都是不透明的，不得解析。
>
> **task 與 run**：「run」或「session」是您發出的請求；「task」是計費執行紀錄。當操作回傳 task ID 時，
> 請使用 `GET /v1/tasks/{task_id}/cost`。並非每個 API 操作都會建立 task。

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- GENERATION APIs                                          -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Chat Completions {#chat-completions}

### POST /v1/chat/completions {#post-v1-chat-completions}

與 OpenAI 相容。串流、工具、視覺、推理與結構化輸出的支援情況，取決於所選模型及其宣告的結構描述。

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

**回應：**

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

> 部分計費操作可能會回傳 `x-task-id: f3d2e8a1-7c4b-4a12-9d2e-123456789abc`；若有此標頭，請用它查詢
> `GET /v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost`。

---

## Anthropic Messages {#anthropic-messages}

### POST /v1/messages {#post-v1-messages}

與 Anthropic 相容的 Messages API。快取與其他選用功能取決於所選模型與請求結構描述。

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

**回應：**

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

## 圖片生成 {#image-generation}

### POST /v1/run {#post-v1-run}

`/v1/run` 端點是**統一生成端點**：`model` 欄位決定輸出類型（圖片、影片或音訊）。

> **如何處理回應**：檢查 `status` 欄位。
> - `"completed"` → 結果在 `outputs` 中，完成。
> - `"pending"` 或 `"running"` → 每 2–5 秒輪詢一次 `GET /v1/run/{id}`，直到進入終止狀態（`completed`、`failed` 或 `timeout`）。

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

**回應（同步）：**

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

## 影片生成 {#video-generation}

### POST /v1/run {#post-v1-run-1}

請檢查所選模型的 `execution_mode`。提交後若回傳 `pending` 或 `running`，請輪詢 `GET /v1/run/{id}` 直到進入終止狀態。

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

**回應（非同步，初始）：**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "running",
  "model": "kwaivgi/kling-video/v3/standard/text-to-video",
  "created_at": "2026-08-02T12:00:00Z"
}
```

**輪詢狀態：`GET /v1/run/{id}`**

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

## 音訊（文字轉語音） {#audio-text-to-speech}

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

**回應：**

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

以 OpenAI 相容的模型清單格式回傳已啟用的邏輯模型。此端點不分頁，
預設為 `type=llm`。刻意不包含詳細功能與定價。

```bash
curl https://api.sandbase.ai/v1/models \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

回應包含 `object: "list"` 與 `data` 陣列。每個項目包含 `id`、`object`、`created` 與
`owned_by`；請將 `id` 當作邏輯模型名稱使用。若需功能與定價中繼資料，請取得該模型的詳細資料。

---

## 取得模型 {#get-model}

### GET /v1/models/{id_or_name} {#get-v1-models-1}

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

詳細回應會額外包含 `unified_schema`、`supported_modes` 與 `model_card`。詳細價格位於
`model_card` 中；沒有最上層的 `pricing` 物件。

---

## 取得任務費用 {#get-task-cost}

### GET /v1/tasks/{task_id}/cost {#get-v1-tasks-task-id-cost}

使用 API 操作回傳的 task ID，查詢該任務的記錄費用。

```bash
curl https://api.sandbase.ai/v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

**回應：**

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

## Agents 平台慣例 {#agents-platform-conventions}

- 基礎 URL 為 `https://api.sandbase.ai/v1`。傳送 `Authorization: Bearer sk-YOUR_KEY` 或 `X-API-Key: sk-YOUR_KEY`（兩者都傳時值必須相同）。`OpenAI-Beta` 為選用；若有傳送，值必須為 `agents=v1`。官方 OpenAI SDK（`client.beta.agents`、`client.skills`）可搭配 `base_url="https://api.sandbase.ai/v1"` 使用；差異列於 [OpenAI 相容性](/agents/openai-compatibility)。

- 本文為嚴格 JSON，最大 1 MiB；未知欄位會回傳 400。

- 錯誤格式：`{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}`。請依 `code` 分支處理；請參閱[錯誤指南](./errors#agents-platform-errors)。

- `row_version` 是 PATCH、archive、restore 與 rotate 使用的比較並設定（compare-and-set）權杖。遇到 409 時請重新讀取。

- 游標清單（Agents、Sessions、items、turns、Skills）：`limit` 1-100、`after`、`order`；回應為 `{object:"list", data, has_more, first_id, last_id}`。

- 位移清單（Agent 版本、附件、MCP 連線、Secret）：`limit`、`offset`；回應為 `{data, total, limit, offset}`。

- ID：Agent 為 `agt_`、Session 為 `ses_`、Skill 為 `skl_`、MCP 連線為 `mcp_`、Secret 為 `sec_`、附件為 `fil_`。請將它們視為不透明值。

---

## Agents {#agents}

### POST /v1/agents — 建立 Agent {#post-v1-agents-—-create-agent}

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

必填：`model`。選用：`name`、`instructions`、`description`、`runtime_profile`（預設 `codex`，另有 `claude`、`mcode`）、`skills`（`[{"skill_id","version"}]`）、`mcp_connections`（`[{"connection_id","server_label","allowed_tools","required"}]`）、`tools`、`text`、`reasoning`、`service_tier`、`metadata`、`note`。回傳 `201`，包含 `id`（`agt_`）、`version`、`row_version`、`status` 與 `projection_status`；請在 `projection_status` 為 `ready` 時再啟動 Session。`web_search` 工具必須使用 `mode: "disabled"`，且不支援用戶端函式結果（`requires_action`）。

### GET /v1/agents — 列出 Agent {#get-v1-agents-—-list-agents}

查詢參數 `status`（預設 `active`，另有 `archived`、`all`），並搭配游標分頁。

### GET /v1/agents/{agent_id} — 取得 Agent {#get-v1-agents-agent-id-—-get-agent}

### POST /v1/agents/{agent_id} — 更新 Agent（SDK 風格） {#post-v1-agents-agent-id-—-update-agent-sdk-style}

部分更新 `name`、`instructions`、`model`、`metadata`、`service_tier`、`tools`、`text`、`reasoning`、`runtime_profile`、`mcp_connections`、`skills`。不需要 `row_version`；會建立新版本。

### PATCH /v1/agents/{agent_id} — 更新 Agent（比較並設定） {#patch-v1-agents-agent-id-—-update-agent-compare-and-set}

欄位相同，另加 `description` 與 `note`；`row_version` 為必填。明確傳送 `null` 會回傳 400。

### 版本、封存、還原與目錄 {#versions-archive-restore-catalog}

- `GET /v1/agents/{agent_id}/versions` 與 `GET /v1/agents/{agent_id}/versions/{version}` 讀取不可變的快照。

- `POST /v1/agents/{agent_id}/archive`、`POST /v1/agents/{agent_id}/unarchive` 接受 `{"row_version"}`。`DELETE /v1/agents/{agent_id}` 也會封存。

- `POST /v1/agents/{agent_id}/restore` 接受 `{"source_version","row_version"}`。

- `GET /v1/agents/catalog` 列出公開的 Agent；`POST /v1/agents/catalog/{agent_id}/clone` 將其中一個複製到您的組織（`201`，新的 `agt_`）。

---

## Sessions {#sessions}

Session 執行一個已儲存的 Agent 版本。路徑位於 `/v1/agents/sessions` 之下。Agent 版本、Skill 版本與 MCP 連線會在建立時凍結。

### POST /v1/agents/sessions — 建立 Session {#post-v1-agents-sessions-—-create-session}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_..."}'
```

傳送 `agent_id`（已儲存的 Agent）、`agent`（內嵌 Agent，或針對單一 Session 覆寫 `model`、`instructions`、`runtime_profile`、`service_tier`、`tools`、`text`、`reasoning` 與 `multi_agent`），或兩者皆傳。選用：`version`（僅限已儲存的 Agent）、`title`、`input`（字串，或一個陣列，其中恰好有一則使用者訊息，並包含一個 `input_text` 部分）、`model` 或 `agent.model`、`metadata`、`model_provider`（`{"type":"custom","base_url":"https://...","api_key":"..."}`；省略時使用您呼叫時的金鑰）。`stream: true` 搭配非空的 `input` 時，會回傳 `201`，並以 Server-Sent Events 串流第一個回合，從 `agent.session.created` 開始。Session 一律在 SandBase 的託管雲端中執行，因此不需選擇環境；但 OpenAI SDK 仍需要 `environment={"type": "openai_hosted"}`。回傳 `201`，包含 `status`（`idle`、`in_progress`、`failed`）、`lifecycle_status`（`active`、`archived`）、`failure`、`source`（`direct`、`service`、`schedule`）與 `row_version`。

### GET /v1/agents/sessions/{session_id}/events — 串流事件（SSE） {#get-v1-agents-sessions-session-id-events-—-stream-events-sse}

僅提供即時事件。請在傳送輸入前開啟。`Last-Event-ID` 或 `after` 會回傳 400；事件不會重播。事件的 `type` 值以 `agent.session.` 開頭。

### POST /v1/agents/sessions/{session_id}/events — 傳送輸入 {#post-v1-agents-sessions-session-id-events-—-send-input}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_.../events \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "Summarize the findings."}]}'
```

每個請求恰好一個事件：`agent.session.input.message` 或 `agent.session.input.cancel`。回傳 `202`，無本文。擴充格式：`{"input": "...", "file_ids": ["fil_..."]}`（最多 10 個已就緒的附件）。`409 session_input_pending` 表示先前的輸入仍在傳遞中；請等待，不要用新的金鑰重新傳送。

### 歷史紀錄與其他 Session 操作 {#history-and-other-session-operations}

- `GET /v1/agents/sessions`（查詢參數 `lifecycle_status`、`agent_id`）、`GET /v1/agents/sessions/{session_id}`。

- `GET /v1/agents/sessions/{session_id}/items`、`GET /v1/agents/sessions/{session_id}/turns`、`GET /v1/agents/sessions/{session_id}/turns/{turn_id}` 讀取歷史紀錄。

- `POST /v1/agents/sessions/{session_id}` 取代 `metadata`；`PATCH /v1/agents/sessions/{session_id}` 以 `{"title","row_version"}` 重新命名。

- `POST /v1/agents/sessions/{session_id}/cancel`（需要 `Idempotency-Key`）取消執行中的回合。

- `DELETE /v1/agents/sessions/{session_id}` 封存；`POST /v1/agents/sessions/{session_id}/unarchive` 還原。

- `POST /v1/agents/sessions/{session_id}/files` 上傳一個附件（multipart `file`，5 MiB，需要 `Idempotency-Key`）。

- `POST /v1/agents/sessions/{session_id}/reconnect` 回傳 `stream_url`，用於 `GET /v1/agents/sessions/{session_id}/events/stream`，該端點會先傳送 `session.snapshot`，再傳送即時事件。

---

### 工作區檔案與輸出成品 {#workspace-files-and-output-artifacts}

- `GET /v1/agents/sessions/{session_id}/workspace-files` 列出 `path`（預設 `/workspace`）下目前的檔案中繼資料。查詢參數為 `limit`（1-100，預設 20）、`order`（預設 `asc`，或 `desc`）與 `page`（上一次的 `next` 游標）。回傳 `{object:"page", data:[{path,size_bytes}], next, has_more}`。游標無效時必須從第一頁重新開始。
- `GET /v1/agents/sessions/{session_id}/artifacts` 列出在 `/workspace/outputs/` 下擷取的不可變輸出。查詢參數為 `limit`（預設 20）、`order`（預設 `desc`）與 `after`（`has_more` 為 true 時使用 `last_id`）。
- `GET /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` 使用回傳的不透明 `art_` ID 下載完整成品。下載上限為 200 MiB；不支援 `Range`（`416`）。工作區中繼資料、上傳的附件與擷取的成品是彼此獨立的資源。

---

## Skills、MCP 連線與 Secret {#skills-mcp-connections-and-secrets}

### POST /v1/skills — 建立 Skill {#post-v1-skills-—-create-skill}

```bash
curl -X POST https://api.sandbase.ai/v1/skills \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -F "files=@release-notes.zip;type=application/zip"
```

一個名為 `files` 的 ZIP 部分（5 MiB）。ZIP 內必須有一個最上層資料夾，其中包含 `SKILL.md`（含 `name` 與 `description` frontmatter），例如 `zip -r release-notes.zip release-notes/`；`SKILL.md` 若位於 ZIP 根目錄，會回傳 `400 invalid_request`。被任何 Agent 版本（包括已封存的 Agent）參照的 Skill 無法刪除（`409`）；請改用 `POST /v1/skills/{skill_id}` 搭配 `{"status": "disabled"}` 將其停用。回傳 `201`，包含 `id`（`skl_`）與 `default_version`。以 `POST /v1/skills/{skill_id}/versions` 新增版本；以 `GET /v1/skills` 列出。在 Agent 中以 `{"skill_id": "skl_...", "version": null}` 參照。

### POST /v1/mcp-connections — 註冊 MCP 伺服器 {#post-v1-mcp-connections-—-register-an-mcp-server}

本文為 `{"name", "server_url" (HTTPS), "secret_id"?}`；需要 `Idempotency-Key`。在 Agent 的 `mcp_connections` 中參照。停用後會阻擋新的 Session 與後續輸入。

### POST /v1/secrets — 儲存 MCP Bearer 權杖 {#post-v1-secrets-—-store-an-mcp-bearer-token}

本文為 `{"name", "kind": "mcp_bearer", "server_url", "token"}`；需要 `Idempotency-Key`。權杖為唯寫，並綁定該確切 URL。Secret 不是環境變數。以 `POST /v1/secrets/{secret_id}/rotate` 輪替；以 `DELETE /v1/secrets/{secret_id}` 撤銷（204）。

---

## 帳單與費用 {#billing-cost}

### 費用計算方式 {#how-costs-are-calculated}

- 從所選模型的 `model_card` 讀取其目前的定價公式與單位。
- 以 token 計價的模型在有宣告時，可能包含輸入、輸出、快取或推理等計價項目。
- 媒體與其他模型可能以每次請求、時長、解析度或其他模型專屬單位計價。
- 資料 API（搜尋、社群、擷取、電商、金融）每個組織每個 UTC 日有 100 次免費呼叫，由符合資格的資料 API 共用，並於 00:00 UTC 重設。超過後的呼叫按次計費，不會被拒絕。餘額為零的組織仍可使用免費呼叫。
- 不適用：LLM、媒體模型，以及價格較高或以公式計價的資料 API（例如部分批次端點、crawl、Xiaohongshu PGY 與 Douyin Xingtu `kol-*` 路由），這些從第一次呼叫起就計費。請以 `sandbase_inspect` 上的 `pricing.free_quota` 確認。
- MCP：`sandbase_inspect` 會在符合資格的工具上顯示 `pricing.free_quota`；`sandbase_account` 回傳 `free_api_quota`（`daily_limit`、`used_today`、`remaining`、`resets_at`）；已結算的 `sandbase_run` 與 `sandbase_run_get` 結果包含 `free_quota_status`（`free`、`overage` 或 `degraded`）。
- 當計費操作回傳 task ID（包括 `x-task-id` 回應標頭）時，請使用 `GET /v1/tasks/{task_id}/cost` 查詢結算與用量。
- 對於非同步的 `POST /v1/run` 回應，請以 `GET /v1/run/{id}` 查詢生成結果；run ID 不是 task ID，不得傳送到費用端點。

### 預算控管 {#budget-control}

- 在 [Developer → API Keys](https://www.sandbase.ai/console/keys) 建立或編輯標準金鑰時，可設定選用的支出上限。
- 在 **Developer → Activities → Usage** 中監控請求與費用。
- 在 [Developer → Billing](https://www.sandbase.ai/console/billing) 中查看餘額與點數交易。

---

## 另請參閱 {#see-also}

- [模型與定價](./models)：即時模型探索、功能與定價說明
- [錯誤指南](./errors)：文件記載的回應格式、HTTP 處理與重試安全性
- [OpenAPI 規格](https://www.sandbase.ai/docs/openapi.yaml)：機器可讀的結構描述


## Agent 的 Skill 版本綁定 {#agent-skill-version-bindings}

儲存 Agent 時，每個新的 Skill 參照都會固定到明確的版本。對於新的綁定，`version: null` 會選取儲存當下的預設版本。對於既有的綁定，`version: null` 會保留其已固定的版本。變更 Skill 的預設版本不會升級已儲存的 Agent 或既有的 Session；若要讓日後的 Session 升級，請在 Agent 上儲存明確的版本。
