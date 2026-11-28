---
i18nSource: e566962f42a5f6b0
title: SandBase AI API ガイド
description: AI エージェント向けの SandBase API 詳細ガイドです。主要なワークフロー、リクエスト例、正式な OpenAPI 仕様へのリンクを掲載しています。
---

# AI API ガイド {#ai-api-guide}

::: info Session の仕様
Session（`ses_*`）は保存された Agent バージョンを 1 つ実行するもので、`POST /v1/agents/sessions` で直接作成します。内部の Runtime Session ID は公開されません。
:::

> よく使われる API ワークフローを 1 ページにまとめたガイドです。機械可読な完全な仕様については、[OpenAPI 仕様](https://www.sandbase.ai/docs/openapi.yaml)を使ってください。プレーンテキスト版: [`llms-full.txt`](https://www.sandbase.ai/docs/llms-full.txt)。

## 認証 {#authentication}

すべてのリクエストに次のものが必要です。

```
Authorization: Bearer sk-YOUR_KEY
```

ベース URL: `https://api.sandbase.ai/v1`

---

## 用語 {#terminology}

| 用語 | 意味 |
|------|---------|
| **Task** | モデル推論などの操作に対する課金対象の実行記録です。すべての API 操作で作成されるわけではありません。 |
| **Run** | `POST /v1/run` によるメディア生成リクエストです。同期または非同期で処理されます。`GET /v1/run/{id}` でポーリングします。 |
| **Session** | `POST /v1/agents/sessions` による Agent の実行で、会話、ツールの動作、出力を保持します。`GET /v1/agents/sessions/{session_id}` で照会します。 |
> **run と session の違い**: モデルの「run」（`/v1/run`）はモデルの生成タスクです。「Session」（`/v1/agents/sessions`）は Agent の実行です。すべての ID は不透明な値であり、パースしてはいけません。
>
> **task と run の違い**: 「run」や「session」はあなたが送信するリクエストで、「task」は課金対象の実行記録です。操作がタスク ID を返した場合は、`GET /v1/tasks/{task_id}/cost` を使います。すべての API 操作でタスクが作成されるわけではありません。

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- GENERATION APIs                                          -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Chat Completions {#chat-completions}

### POST /v1/chat/completions {#post-v1-chat-completions}

OpenAI 互換です。ストリーミング、ツール、画像認識、推論、構造化出力のサポートは、選択したモデルとその宣言されたスキーマによって異なります。

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

**レスポンス:**

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

> 一部の課金対象の操作では `x-task-id: f3d2e8a1-7c4b-4a12-9d2e-123456789abc` が返されることがあります。返された場合は、それを使って `GET /v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost` を照会します。

---

## Anthropic Messages {#anthropic-messages}

### POST /v1/messages {#post-v1-messages}

Anthropic 互換の Messages API です。キャッシュやその他の任意機能は、選択したモデルとリクエストのスキーマによって異なります。

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

**レスポンス:**

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

## 画像生成 {#image-generation}

### POST /v1/run {#post-v1-run}

`/v1/run` エンドポイントは**統合された生成エンドポイント**で、`model` フィールドによって出力の種類（画像、動画、音声）が決まります。

> **レスポンスの扱い方:** `status` フィールドを確認します。
> - `"completed"` → 結果は `outputs` に含まれており、完了です。
> - `"pending"` または `"running"` → 終了状態（`completed`、`failed`、`timeout`）になるまで、2～5 秒ごとに `GET /v1/run/{id}` をポーリングします。

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

**レスポンス（同期）:**

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

## 動画生成 {#video-generation}

### POST /v1/run {#post-v1-run-1}

選択したモデルの `execution_mode` を確認してください。送信時に `pending` または `running` が返された場合は、終了状態になるまで `GET /v1/run/{id}` をポーリングします。

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

**レスポンス（非同期、初回）:**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "running",
  "model": "kwaivgi/kling-video/v3/standard/text-to-video",
  "created_at": "2026-08-02T12:00:00Z"
}
```

**ステータスのポーリング: `GET /v1/run/{id}`**

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

## 音声（テキスト読み上げ） {#audio-text-to-speech}

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

**レスポンス:**

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

## モデルの一覧 {#list-models}

### GET /v1/models {#get-v1-models}

有効な論理モデルを、OpenAI 互換のモデル一覧形式で返します。このエンドポイントはページネーションされず、デフォルトは `type=llm` です。詳細な機能と料金は意図的に省略されています。

```bash
curl https://api.sandbase.ai/v1/models \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

レスポンスには `object: "list"` と `data` 配列が含まれます。各項目には `id`、`object`、`created`、`owned_by` が含まれます。`id` を論理モデル名として使ってください。機能と料金のメタデータは、そのモデルを個別に取得して確認します。

---

## モデルの取得 {#get-model}

### GET /v1/models/{id_or_name} {#get-v1-models-1}

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

詳細レスポンスには、`unified_schema`、`supported_modes`、`model_card` が追加されます。詳細な料金は `model_card` 内にあり、トップレベルの `pricing` オブジェクトはありません。

---

## タスクコストの取得 {#get-task-cost}

### GET /v1/tasks/{task_id}/cost {#get-v1-tasks-task-id-cost}

API 操作が返したタスク ID を使って、タスクの記録済みコストを確認します。

```bash
curl https://api.sandbase.ai/v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

**レスポンス:**

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

## Agents プラットフォームの規約 {#agents-platform-conventions}

- ベース URL は `https://api.sandbase.ai/v1` です。`Authorization: Bearer sk-YOUR_KEY` または `X-API-Key: sk-YOUR_KEY` を送信します（両方送る場合は同じ値）。`OpenAI-Beta` は任意で、送信する場合は `agents=v1` である必要があります。公式の OpenAI SDK（`client.beta.agents`、`client.skills`）は `base_url="https://api.sandbase.ai/v1"` で動作します。相違点は [OpenAI 互換性](/agents/openai-compatibility)に記載されています。

- ボディは最大 1 MiB の厳密な JSON です。不明なフィールドは 400 を返します。

- エラー: `{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}`。`code` で分岐してください。[エラーガイド](./errors#agents-platform-errors)を参照してください。

- `row_version` は、PATCH、archive、restore、rotate 用の compare-and-set トークンです。409 の場合は再度読み取ってください。

- カーソル形式の一覧（Agents、Sessions、items、turns、Skills）: `limit` 1～100、`after`、`order`。レスポンスは `{object:"list", data, has_more, first_id, last_id}` です。

- オフセット形式の一覧（Agent バージョン、添付ファイル、MCP 接続、Secret）: `limit`、`offset`。レスポンスは `{data, total, limit, offset}` です。

- ID: Agent は `agt_`、Session は `ses_`、Skill は `skl_`、MCP 接続は `mcp_`、Secret は `sec_`、添付ファイルは `fil_`。不透明な値として扱ってください。

---

## Agents {#agents}

### POST /v1/agents — Agent の作成 {#post-v1-agents-—-create-agent}

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

必須: `model`。任意: `name`、`instructions`、`description`、`runtime_profile`（デフォルトは `codex`、ほかに `claude`、`mcode`）、`skills`（`[{"skill_id","version"}]`）、`mcp_connections`（`[{"connection_id","server_label","allowed_tools","required"}]`）、`tools`、`text`、`reasoning`、`service_tier`、`metadata`、`note`。`201` とともに `id`（`agt_`）、`version`、`row_version`、`status`、`projection_status` を返します。`projection_status` が `ready` になったら Session を開始してください。`web_search` ツールは `mode: "disabled"` を使う必要があり、クライアント側の関数結果（`requires_action`）はサポートされていません。

### GET /v1/agents — Agent の一覧 {#get-v1-agents-—-list-agents}

クエリ `status`（デフォルトは `active`、ほかに `archived`、`all`）とカーソルページネーションを使います。

### GET /v1/agents/{agent_id} — Agent の取得 {#get-v1-agents-agent-id-—-get-agent}

### POST /v1/agents/{agent_id} — Agent の更新（SDK 形式） {#post-v1-agents-agent-id-—-update-agent-sdk-style}

`name`、`instructions`、`model`、`metadata`、`service_tier`、`tools`、`text`、`reasoning`、`runtime_profile`、`mcp_connections`、`skills` を部分的に更新します。`row_version` は不要で、新しいバージョンが作成されます。

### PATCH /v1/agents/{agent_id} — Agent の更新（compare-and-set） {#patch-v1-agents-agent-id-—-update-agent-compare-and-set}

同じフィールドに加えて `description` と `note` を使えます。`row_version` は必須です。明示的な `null` は 400 を返します。

### バージョン、アーカイブ、復元、カタログ {#versions-archive-restore-catalog}

- `GET /v1/agents/{agent_id}/versions` と `GET /v1/agents/{agent_id}/versions/{version}` は、変更不可のスナップショットを読み取ります。

- `POST /v1/agents/{agent_id}/archive` と `POST /v1/agents/{agent_id}/unarchive` は `{"row_version"}` を受け取ります。`DELETE /v1/agents/{agent_id}` もアーカイブを行います。

- `POST /v1/agents/{agent_id}/restore` は `{"source_version","row_version"}` を受け取ります。

- `GET /v1/agents/catalog` は公開 Agent を一覧表示します。`POST /v1/agents/catalog/{agent_id}/clone` はそのうちの 1 つを組織にコピーします（`201`、新しい `agt_`）。

---

## Sessions {#sessions}

Session は保存された Agent バージョンを 1 つ実行します。パスは `/v1/agents/sessions` の配下にあります。Agent バージョン、Skill バージョン、MCP 接続は作成時に固定されます。

### POST /v1/agents/sessions — Session の作成 {#post-v1-agents-sessions-—-create-session}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_..."}'
```

`agent_id`（保存済みの Agent）、`agent`（インラインの Agent、または `model`、`instructions`、`runtime_profile`、`service_tier`、`tools`、`text`、`reasoning`、`multi_agent` の Session ごとの上書き）、またはその両方を送信します。任意: `version`（保存済みの Agent のみ）、`title`、`input`（文字列、または `input_text` パートを 1 つ含む user メッセージをちょうど 1 つ持つ配列）、`model` または `agent.model`、`metadata`、`model_provider`（`{"type":"custom","base_url":"https://...","api_key":"..."}`。省略すると呼び出しに使ったキーが使われます）。空でない `input` とともに `stream: true` を指定すると、`201` を返し、最初のターンを `agent.session.created` から始まる Server-Sent Events のストリームとして返します。Session は常に SandBase のホスト型クラウドで実行されるため、環境を選ぶ必要はありません。ただし OpenAI SDK では引き続き `environment={"type": "openai_hosted"}` が必要です。`201` とともに `status`（`idle`、`in_progress`、`failed`）、`lifecycle_status`（`active`、`archived`）、`failure`、`source`（`direct`、`service`、`schedule`）、`row_version` を返します。

### GET /v1/agents/sessions/{session_id}/events — イベントのストリーミング（SSE） {#get-v1-agents-sessions-session-id-events-—-stream-events-sse}

ライブ専用です。入力を送信する前に開いてください。`Last-Event-ID` または `after` を指定すると 400 を返し、イベントは再送されません。イベントの `type` の値は `agent.session.` で始まります。

### POST /v1/agents/sessions/{session_id}/events — 入力の送信 {#post-v1-agents-sessions-session-id-events-—-send-input}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_.../events \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "Summarize the findings."}]}'
```

1 回のリクエストで送れるイベントはちょうど 1 つで、`agent.session.input.message` または `agent.session.input.cancel` です。`202` を返し、ボディはありません。拡張形式: `{"input": "...", "file_ids": ["fil_..."]}`（準備完了の添付ファイルを最大 10 個）。`409 session_input_pending` は、以前の入力がまだ配信中であることを意味します。待機し、新しいキーで再送しないでください。

### 履歴とその他の Session 操作 {#history-and-other-session-operations}

- `GET /v1/agents/sessions`（クエリ `lifecycle_status`、`agent_id`）、`GET /v1/agents/sessions/{session_id}`。

- `GET /v1/agents/sessions/{session_id}/items`、`GET /v1/agents/sessions/{session_id}/turns`、`GET /v1/agents/sessions/{session_id}/turns/{turn_id}` は履歴を読み取ります。

- `POST /v1/agents/sessions/{session_id}` は `metadata` を置き換えます。`PATCH /v1/agents/sessions/{session_id}` は `{"title","row_version"}` で名前を変更します。

- `POST /v1/agents/sessions/{session_id}/cancel`（`Idempotency-Key` が必要）は実行中のターンをキャンセルします。

- `DELETE /v1/agents/sessions/{session_id}` はアーカイブし、`POST /v1/agents/sessions/{session_id}/unarchive` は復元します。

- `POST /v1/agents/sessions/{session_id}/files` は添付ファイルを 1 つアップロードします（multipart の `file`、5 MiB、`Idempotency-Key` が必要）。

- `POST /v1/agents/sessions/{session_id}/reconnect` は `GET /v1/agents/sessions/{session_id}/events/stream` 用の `stream_url` を返します。このストリームは `session.snapshot` を送信した後、ライブイベントを送信します。

---

### ワークスペースファイルと出力成果物 {#workspace-files-and-output-artifacts}

- `GET /v1/agents/sessions/{session_id}/workspace-files` は、`path`（デフォルトは `/workspace`）配下の現在のファイルのメタデータを一覧表示します。クエリは `limit`（1～100、デフォルト 20）、`order`（デフォルトは `asc`、または `desc`）、`page`（前回の `next` カーソル）です。`{object:"page", data:[{path,size_bytes}], next, has_more}` を返します。カーソルが無効な場合は、最初のページからやり直す必要があります。
- `GET /v1/agents/sessions/{session_id}/artifacts` は、`/workspace/outputs/` 配下で取得された変更不可の出力を一覧表示します。クエリは `limit`（デフォルト 20）、`order`（デフォルトは `desc`）、`after`（`has_more` が true の場合は `last_id` を使う）です。
- `GET /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` は、返された不透明な `art_` ID を使って成果物全体をダウンロードします。ダウンロードの上限は 200 MiB で、`Range` はサポートされていません（`416`）。ワークスペースのメタデータ、アップロードされた添付ファイル、取得された成果物は、それぞれ別のリソースです。

---

## Skills、MCP 接続、Secret {#skills-mcp-connections-and-secrets}

### POST /v1/skills — Skill の作成 {#post-v1-skills-—-create-skill}

```bash
curl -X POST https://api.sandbase.ai/v1/skills \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -F "files=@release-notes.zip;type=application/zip"
```

ZIP パート `files` を 1 つ（5 MiB）。ZIP には、`SKILL.md`（`name` と `description` のフロントマター付き）を含むトップレベルのフォルダーが 1 つ必要です。例: `zip -r release-notes.zip release-notes/`。ZIP のルートに `SKILL.md` がある場合は `400 invalid_request` を返します。いずれかの Agent バージョン（アーカイブ済みの Agent を含む）から参照されている Skill は削除できません（`409`）。代わりに `POST /v1/skills/{skill_id}` と `{"status": "disabled"}` で無効にしてください。`201` とともに `id`（`skl_`）と `default_version` を返します。バージョンは `POST /v1/skills/{skill_id}/versions` で追加し、一覧は `GET /v1/skills` で取得します。Agent からは `{"skill_id": "skl_...", "version": null}` として参照します。

### POST /v1/mcp-connections — MCP サーバーの登録 {#post-v1-mcp-connections-—-register-an-mcp-server}

ボディは `{"name", "server_url" (HTTPS), "secret_id"?}` で、`Idempotency-Key` が必要です。Agent の `mcp_connections` から参照します。無効にすると、新しい Session と追加の入力がブロックされます。

### POST /v1/secrets — MCP Bearer トークンの保存 {#post-v1-secrets-—-store-an-mcp-bearer-token}

ボディは `{"name", "kind": "mcp_bearer", "server_url", "token"}` で、`Idempotency-Key` が必要です。トークンは書き込み専用で、指定した URL に完全一致で紐付けられます。Secret は環境変数ではありません。ローテーションは `POST /v1/secrets/{secret_id}/rotate`、失効は `DELETE /v1/secrets/{secret_id}`（204）で行います。

---

## 請求とコスト {#billing-cost}

### コストの計算方法 {#how-costs-are-calculated}

- 選択したモデルの現在の料金計算式と単位は、その `model_card` で確認します。
- トークン課金のモデルでは、宣言されている場合、入力、出力、キャッシュ、推論の各要素が含まれることがあります。
- メディアなどのモデルでは、リクエスト単位、長さ、解像度、その他モデル固有の単位が使われることがあります。
- データ API（検索、ソーシャル、スクレイピング、EC、金融）には、組織ごとに UTC の 1 日あたり 100 回の無料呼び出しが含まれます。対象のデータ API 間で共有され、00:00 UTC にリセットされます。それ以降の呼び出しは 1 回ごとに課金され、拒否はされません。残高がゼロの組織でも無料呼び出しは使えます。
- 対象外: LLM、メディアモデル、および高額または計算式で課金されるデータ API（一部のバッチエンドポイント、クロール、Xiaohongshu PGY、Douyin Xingtu の `kol-*` ルートなど）。これらは最初の呼び出しから課金されます。`sandbase_inspect` の `pricing.free_quota` で確認できます。
- MCP: `sandbase_inspect` は対象ツールで `pricing.free_quota` を表示します。`sandbase_account` は `free_api_quota`（`daily_limit`、`used_today`、`remaining`、`resets_at`）を返します。精算済みの `sandbase_run` と `sandbase_run_get` の結果には `free_quota_status`（`free`、`overage`、`degraded`）が含まれます。
- 課金対象の操作がタスク ID を返した場合（`x-task-id` レスポンスヘッダーを含む）、精算と使用量の確認には `GET /v1/tasks/{task_id}/cost` を使います。
- 非同期の `POST /v1/run` レスポンスでは、`GET /v1/run/{id}` で生成結果を照会します。run ID はタスク ID ではないため、コストのエンドポイントに送信しないでください。

### 予算の管理 {#budget-control}

- [Developer → API Keys](https://www.sandbase.ai/console/keys) で標準のキーを作成または編集するときに、任意で支出上限を設定できます。
- リクエストとコストは **Developer → Activities → Usage** で監視します。
- 残高とクレジットの取引は [Developer → Billing](https://www.sandbase.ai/console/billing) で確認します。

---

## 関連項目 {#see-also}

- [モデルと料金](./models): 最新のモデルの検索、機能、料金のガイド
- [エラーガイド](./errors): ドキュメント化されたレスポンスの形式、HTTP の処理、リトライの安全性
- [OpenAPI 仕様](https://www.sandbase.ai/docs/openapi.yaml): 機械可読なスキーマ


## Agent の Skill バージョンのバインディング {#agent-skill-version-bindings}

Agent を保存すると、新しい Skill の参照はそれぞれ明示的なバージョンに固定されます。新しいバインディングでは、`version: null` を指定すると保存時点の現在のデフォルトが選ばれます。既存のバインディングでは、`version: null` を指定すると固定済みのバージョンが維持されます。Skill のデフォルトを変更しても、保存済みの Agent や既存の Session はアップグレードされません。今後の Session をアップグレードするには、Agent に明示的なバージョンを保存してください。
