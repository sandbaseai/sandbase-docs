---
i18nSource: 0314b37a870481ae
title: AI 向けドキュメント
description: AI エージェントが SandBase API を見つけて使うために必要な情報を 1 ページにまとめた概要です。
---

# AI フレンドリーな API の概要 {#ai-friendly-api-overview}

::: info Session の仕様
Session（`ses_*`）は、保存済みの Agent バージョンを 1 つ実行します。`POST /v1/agents/sessions` で直接作成します。ランタイムインスタンスは内部に留まり、返されることはありません。
:::

> 人間と AI エージェントの両方に向けた簡潔なリファレンスです。LLM での取り込みに最適化したプレーンテキスト版は [`llms.txt`](https://www.sandbase.ai/docs/llms.txt) を参照してください。

## SandBase とは {#what-is-sandbase}

SandBase は AI エージェント向けのインフラプラットフォームです。1 つの API キーで、言語、画像、動画、音声、検索、データにわたる有効なモデルと API、さらに Agent ワークフローにアクセスできます。固定の数に頼らず、現在のカタログを検索して確認してください。

## API ベース URL {#api-base-url}

```
https://api.sandbase.ai/v1
```

## 認証 {#authentication}

すべてのリクエストに Bearer トークンが必要です。

```
Authorization: Bearer sk-YOUR_KEY
```

キーは [Developer → API Keys](https://www.sandbase.ai/console/keys) で取得できます。

## 簡単な例 {#quick-example}

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## コア API {#core-apis}

| メソッド | ルート | 説明 |
|--------|----------|-------------|
| `POST` | `/v1/chat/completions` | OpenAI 互換のチャット。利用できるオプション機能は選択したモデルによって異なります |
| `POST` | `/v1/messages` | Anthropic 互換の Messages API |
| `POST` | `/v1/run` | モデル固有のスキーマでモデル生成を送信します |
| `GET` | `/v1/run/{id}` | 非同期生成のステータスをポーリングし、結果を取得します |
| `GET` | `/v1/models` | 有効な論理モデルを一覧表示します。デフォルトは LLM タイプです |
| `GET` | `/v1/models/{id_or_name}` | モデルの詳細、スキーマ、機能、料金を取得します |
| `GET` | `/v1/tasks/{task_id}/cost` | タスクのコストと使用量を取得します |

## その他の API グループ {#additional-api-groups}

コアの生成 API に加えて、SandBase はエージェントのライフサイクル管理用の API を提供しています。一般的なワークフローは [AI API ガイド](./full) を、完全な仕様は [OpenAPI 仕様](https://www.sandbase.ai/docs/openapi.yaml) を参照してください。

| グループ | 主なルート | 用途 |
|-------|---------------|---------|
| **Agents** | `POST /v1/agents`、`GET /v1/agents`、`POST /v1/agents/{agent_id}` | 保存済みの Agent 定義を作成し、バージョン管理します |
| **Sessions** | `POST /v1/agents/sessions`、`POST /v1/agents/sessions/{session_id}/events`、`GET /v1/agents/sessions/{session_id}/events` | Agent を実行し、入力を送信し、ライブイベントをストリーミングします |
| **Skills** | `POST /v1/skills`、`GET /v1/skills` | Agent がマウントする、バージョン管理された指示バンドル |
| **MCP 接続と Secret** | `POST /v1/mcp-connections`、`POST /v1/secrets` | リモート HTTPS の MCP ツールと、その書き込み専用 Bearer トークン |

Agents プラットフォームのリソースは `Authorization: Bearer` または `X-API-Key` を受け付け、失敗時には `{"error":{"type","code","param","message"}}` を返します。

## 料金モデル {#pricing-model}

従量課金制です。料金はモデルごとに異なり、このページとは独立して変更される場合があります。

- **モデルの料金**：選択したモデルの現在の計算式と単位を `model_card` から読み取ります
- **トークンの料金**：モデルが宣言している場合、入力、出力、キャッシュ、推論の各要素を含むことがあります
- **メディアやその他の操作**：リクエスト単位、長さ、解像度、その他のモデル固有の単位を使用する場合があります
- **データ API**（検索、ソーシャル、スクレイピング、EC、金融）：各組織には UTC の 1 日あたり 100 回の無料呼び出しがあり、対象のデータ API 間で共有されます。それを超えると呼び出しはブロックされず、呼び出しごとに課金されます。MCP では、対象のツールは `sandbase_inspect` に `pricing.free_quota` を表示し、`sandbase_account` は `free_api_quota`（`daily_limit`、`used_today`、`remaining`、`resets_at`）を返します。[1 日あたりの無料 API 呼び出し](/guides/billing#daily-free-api-calls) を参照してください。

`GET /v1/models` で現在のモデル ID を確認し、リクエストを送信する前に `GET /v1/models/{id_or_name}` で詳細を確認してください。料金やキャッシュ割引がプロバイダー間で共通だと想定しないでください。

操作がタスク ID を返した場合は、記録されたコストを確認します。

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

## レート制限 {#rate-limits}

公開されている共通の数値上限はありません。リクエストには、組織に割り当てられた任意の 1 分あたりリクエスト数の制限が適用され、
組織のすべての API キーで共有されます。`429` レスポンスにはクォータや `Retry-After` ヘッダーが含まれないため、ジッター付きの上限ありエクスポネンシャルバックオフを使用してください。
[エラーガイド](./errors) を参照してください。

---

## 関連資料 {#further-reading}

- [AI API ガイド](./full) — コアワークフロー、リクエスト・レスポンスの形式、curl の例
- [モデルと料金](./models) — ライブのモデル検索、料金、機能に関するガイダンス
- [エラーガイド](./errors) — 文書化されたレスポンス形式、HTTP の処理、リトライの安全性
- [OpenAPI 仕様](https://www.sandbase.ai/docs/openapi.yaml) — 機械可読な OpenAPI 3.1

## プレーンテキスト版（AI エージェント向け） {#plain-text-versions-for-ai-agents}

| ファイル | URL | 内容 |
|------|-----|---------|
| `llms.txt` | [/docs/llms.txt](https://www.sandbase.ai/docs/llms.txt) | 簡潔な概要（約 60 行） |
| `llms-full.txt` | [/docs/llms-full.txt](https://www.sandbase.ai/docs/llms-full.txt) | AI 向けの詳細な API ガイド |
| `openapi.yaml` | [/docs/openapi.yaml](https://www.sandbase.ai/docs/openapi.yaml) | 機械可読な OpenAPI 3.1 仕様 |
