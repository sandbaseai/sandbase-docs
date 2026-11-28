---
i18nSource: 95410ff7ea741f64
title: AI が読めるエラーガイド
description: エンドポイントの種類、HTTP ステータス、リトライの安全性、文書化されたレスポンス形式ごとに SandBase API のエラーを処理します。
---

# AI クライアント向けのエラー処理 {#error-handling-for-ai-clients}

SandBase には、すべてに共通する単一のエラースキーマはありません。まず HTTP ステータスで分岐し、次にエンドポイントの種類ごとに
文書化されたレスポンス形式を解析してください。すべてのレスポンスに `code`、`param`、`request_id`、または
特定のメッセージ文字列が含まれるとは想定しないでください。

## 公開レスポンスの形式 {#public-response-shapes}

コアの `/v1/*` ミドルウェアと、いくつかのモデルまたはリソースのエンドポイントは、フラットなエラーを返します。

```json
{"error":"organization rate limit exceeded"}
```

Agents プラットフォームのリソース（`/v1/agents*`、`/v1/mcp-connections*`、`/v1/secrets*`、
`/v1/skills*`）は、安定した `code` を持つ OpenAI 形式のオブジェクトを返します。[Agents プラットフォームのエラー](#agents-platform-errors)を参照してください。

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

OpenAI 互換のゲートウェイは OpenAI 互換のエンベロープを維持します。`POST /v1/messages` は
Anthropic 互換のエンベロープを維持します。

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

## HTTP ステータスの処理 {#http-status-handling}

| ステータス | 意味 | クライアントの対応 |
|---|---|---|
| `400` | 無効な入力、または未対応のパラメータ | 選択したエンドポイントとモデルのスキーマに従ってリクエストを修正します。 |
| `401` | 認証情報がない、無効、取り消し済み、または期限切れ | 認証情報を差し替えるかローテーションします。変更せずにリトライしないでください。 |
| `402` | リクエストの費用を賄えない、または利用上限に達した | 課金またはキーの上限を解決してからリトライします。 |
| `403` | 認証情報に権限がない、または互換インターフェースが支出の失敗を 403 にマッピングしている | 文書化されたエンベロープを確認し、権限のあるキーを使用します。 |
| `404` | モデルまたはリソースが見つからない | 現在のモデル名またはリソース ID を確認します。 |
| `409` | リソースの状態の競合 | 最新のリソースの状態を読み取ってから、リトライしても安全かを判断します。 |
| `429` | 組織のリクエスト制限、または動画の同時実行数の制限 | 上限付きの指数バックオフとジッターでリトライします。 |
| `500`, `502`, `503`, `504` | SandBase または上流の一時的な障害 | 操作を繰り返しても安全な場合にのみリトライします。 |

## 認証とレート制限のメッセージ {#authentication-and-rate-limit-messages}

文書化されている認証メッセージは次のとおりです。

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

スコープ付きのキーをスコープ外で使用すると、代わりにネストされたボディで `403` が返されます：`{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`。Agents プラットフォームのリソースは、独自のエンベロープで同じ `code` を返します。

文書化されているレート制限のメッセージは `organization rate limit exceeded` です（組織に割り当てられた 1 分あたりのリクエスト数の
制限で、組織のすべての API キーで共有されます）。`429` レスポンスには現在 `Retry-After` や
`X-RateLimit-*` ヘッダーは含まれず、公開されている共通の RPM や同時実行数のデフォルト値もありません。

## モデルとリソースの検索 {#model-and-resource-lookup}

有効なモデル ID を探すには `GET /v1/models` を、実行前にモデルを確認するには `GET /v1/models/{id_or_name}` を使用します。
リソース ID は不透明な値として扱い、該当する一覧取得または取得操作で確認してください。ID のプレフィックスから
別のポーリング URL を組み立てないでください。

## リトライのアルゴリズム {#retry-algorithm}

上限付きの指数バックオフとジッターを使用します。

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

次のルールを適用します。

- `429` は、クライアントで計算した遅延の後にリトライする。
- 一時的な `5xx` レスポンスは、少ない上限付きの回数だけリトライする。
- 変更していない `400`、`401`、`402`、`403`、`404` のリクエストはリトライしない。
- 作成、トリガー、外部アクションのリクエストを繰り返す前に、冪等性を確認する。
- ストリームが失敗した場合は部分的な出力を保持し、続行と再開始のどちらが安全かを判断する。
- 最終的な HTTP ステータスと、サニタイズしたエンドポイント固有のエラーを呼び出し元に返す。

## Agents プラットフォームのエラー {#agents-platform-errors}

Agents、Sessions、Skills、MCP 接続、Secrets は 1 種類のエンベロープを返します。ほとんどのコードでは `message` は固定の安全な文です。`invalid_request` には、どの入力形式やオプションに対応していないかなど、短い説明が含まれる場合があります。`message` ではなく `code` で分岐してください。

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type` は、401 では `authentication_error`、5xx では `server_error`、それ以外では `invalid_request_error` です。

| HTTP | `code` | 意味 | 対応 |
|---|---|---|---|
| 400 | `invalid_request` | 形式が不正または不明なフィールド、検証の失敗、または未対応のオプション | リクエストを修正します。変更せずにリトライしないでください |
| 400 | `skill_not_found` | 参照している Skill またはバージョンが利用できない | Agent の `skills` を修正します |
| 401 | `unauthorized` | API キーのヘッダーがない、無効、または競合している | `Authorization` / `X-API-Key` を確認します |
| 402 | `spending_limit_exceeded` | キーの利用上限または組織の残高を使い切った | クレジットを追加するか、上限を引き上げます |
| 403 | `insufficient_scope` | キーにスコープが設定されており、Agents のリソースを使用できない | Console で作成した標準のキーを使用します |
| 403 | `org_disabled` | 組織に Agents の実行が許可されていない | サポートにお問い合わせください |
| 404 | `not_found` | リソースが組織内に存在しない | ID を確認します |
| 409 | `conflict` | 古い `row_version`、変更を許可しない状態、または異なるボディでの `Idempotency-Key` の再利用 | リソースを再度読み取ってから判断します |
| 409 | `session_input_pending` | 以前の入力がまだ配信中 | 待ちます。新しいキーで再送しないでください |
| 409 | `session_input_expired` | 入力の受け付けが期限切れになった | 再送する前に履歴を確認します |
| 409 | `session_environment_unavailable` | 実行環境が利用できない | 待つか、新しい Session を作成します |
| 413 | `request_too_large` | リクエストボディ、またはそこから固定された Session の設定がサイズ上限を超えている | より小さいボディを送信します。変更せずにリトライしないでください |
| 429 | `quota_exceeded` | Agents のクォータを超えた | 後でリトライします |
| 502 | `executor_rejected`, `executor_contract_error` | 実行レイヤーがリクエストを拒否した、または想定外の応答をした | Agent の設定を確認してからリトライします |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | 依存先が一時的に利用できない | 同じ `Idempotency-Key` を使い、バックオフしながらリトライします |

`skill_runtime_incompatible` が返されることもあります。この場合は、メッセージ `internal error` とともに 503 として返されます。

## ストリーミングの失敗 {#streaming-failures}

ストリーミングレスポンスが始まった後は、失敗が新しい HTTP ステータスではなく、プロトコルのストリーム形式で届くことがあります。
ストリームは不完全なものとして扱って閉じ、アプリケーションに必要な部分的なコンテンツを保持し、
リクエストを繰り返しても安全な場合にのみリトライしてください。

## 関連項目 {#see-also}

- [エラーコード](/api-reference/errors) — 公開レスポンスの形式と一般的な HTTP ステータス
- [レート制限](/guides/rate-limiting) — 429 の処理とリクエストの平準化
- [エラーとリトライ](/guides/error-handling) — 実装パターン
- [認証](/api-reference/authentication) — 対応する認証情報とキーのライフサイクル
