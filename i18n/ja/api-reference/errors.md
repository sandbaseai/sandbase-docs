---
i18nSource: ac4e3b9b9eef4c7d
title: API エラー
description: HTTP ステータス、エンドポイントの種類、ドキュメント化されたレスポンス形式、再試行の安全性に基づいて SandBase API のエラーを処理します。
---

# API エラー {#api-errors}

SandBase は標準の HTTP ステータスコードを使用しますが、すべてに共通するエラーボディは公開していません。まず HTTP ステータスで分岐し、次に呼び出したエンドポイントでドキュメント化されているレスポンススキーマを解析してください。すべてのエラーに `code`、`param`、`message`、`request_id` が含まれることを前提にしないでください。

## レスポンスの形式 {#response-shapes}

コアミドルウェアと一部の `/v1/*` エンドポイントは、フラットなエラーを返します。

```json
{"error":"organization rate limit exceeded"}
```

Agents プラットフォームのリソース（`/v1/agents*`、`/v1/mcp-connections*`、`/v1/secrets*`、`/v1/skills*`）は、安定した `code` を持つ OpenAI 形式のオブジェクトを返します。[Agents プラットフォームのエラー](#agents-platform-errors) を参照してください。

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

Webhook Events API（`/events/webhooks*`）は `{"code":<http status>,"message":"..."}` を返します。[Webhooks](/api-reference/webhooks#authentication-and-errors) を参照してください。

OpenAI 互換エンドポイントは OpenAI 互換のエンベロープを維持します。`POST /v1/messages` は Anthropic 互換のエンベロープを維持します。

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

公開されている各操作の正確なステータスコードとスキーマについては、[OpenAPI 仕様](/openapi.yaml) を参照してください。

## HTTP ステータスの扱い {#http-status-handling}

| ステータス | 主な意味 | クライアントの対応 |
|---|---|---|
| `400` | 入力が無効、またはパラメーターがサポートされていない | エンドポイントと選択したモデルのスキーマに従ってリクエストを修正します。 |
| `401` | 認証情報がない、無効、失効済み、または期限切れ | 認証情報を差し替えるかローテーションします。そのまま再試行しないでください。 |
| `402` | リクエストの資金が不足している、または利用上限に達した | 残高またはキーの上限を解決してから再試行します。 |
| `403` | 認証情報に権限がない、または互換エンドポイントが利用額の問題を 403 にマッピングしている | エンドポイント固有のエンベロープを確認し、権限のあるキーを使用します。 |
| `404` | 呼び出し元がモデルまたはリソースを利用できない | 現在のモデル ID またはリソース ID を確認します。 |
| `409` | リソースの状態の競合 | 最新の状態を読み取ってから、再試行しても安全か判断します。 |
| `422` | リソースの入力が意味的に無効 | ドキュメントに記載されたフィールド値に修正します。 |
| `429` | 組織のリクエスト上限、または動画の同時実行上限 | 操作を繰り返しても安全な場合は、上限付きのバックオフとジッターで再試行します。 |
| `500`、`502`、`503`、`504` | SandBase または上流での障害 | 操作を繰り返しても安全な場合にのみ再試行します。 |

すべてのエンドポイントが、この表のすべてのステータスをドキュメント化しているわけではありません。各操作の OpenAPI レスポンスマップが正式な情報です。

## 認証エラー {#authentication-errors}

ドキュメント化されている認証メッセージは次のとおりです。

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

スコープ付きキーをスコープ外で使用すると、代わりにネストされたボディで `403` が返されます: `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`。Agents プラットフォームのリソースは、独自のエンベロープで同じ `code` を返します。

標準エンドポイントでは `Authorization: Bearer $SANDBASE_API_KEY` を使用します。`POST /v1/messages` は `x-api-key` も受け付けます。プロトコル互換の Google エンドポイントについては、それぞれサポートするキーヘッダーがドキュメント化されています。

失効したキーは再度有効にできません。代わりのキーを作成し、利用側のアプリケーションを更新して動作を確認したうえで、古いキーへの参照をすべて削除してください。

## レート制限 {#rate-limits}

`organization rate limit exceeded`（`429`）は、組織に割り当てられた 1 分あたりのリクエスト上限に達したことを意味します。この上限は組織のすべての API キーで共有されます。プロトコル互換エンドポイントは、独自のエンベロープでこのエラーを返します。上限は組織ごとに割り当てられるため、SandBase は共通の数値上限を公開していません。

レスポンスに `Retry-After` が含まれる場合はそれに従ってください。含まれない場合は、ジッター付きの上限ありエクスポネンシャルバックオフを使用します。リクエストを平準化する方法については [レート制限](/guides/rate-limiting) を参照してください。

タスクの送信には、さらに 2 つのチェックがあります。`organization concurrency limit exceeded`（`429`）は、組織で実行中のタスク数がアカウントレベルで許可される上限に達していることを意味します。実行中のタスクが完了すると解消されます。これは `POST /v1/run` と `/v1/api/*` のすべてのモデルタイプ、およびその他のエンドポイントでの動画の送信に適用されます。`insufficient credit for estimated video cost`（`402`）は、推定コストが残高とクレジットラインの合計を超えていることを意味します。チャージしてから再試行してください。[同時実行数の上限](/guides/concurrency-limits) を参照してください。

## 再試行の安全性 {#retry-safety}

次の順序で判断してください。

1. 操作がすでに外部から見える影響を生じさせたかどうかを確認します。
2. `400`、`401`、`402`、`403`、`404`、`422` のリクエストを変更せずに再試行しないでください。
3. `409` の場合は、再試行する前にリソースの現在の状態を読み取ります。
4. `429` と一時的な `5xx` レスポンスは、少ない上限付きの回数だけ再試行します。
5. 作成、トリガー、アップロード、外部アクションのリクエストを繰り返す前に、操作がべき等であるか、アプリケーションで重複を調整できることを確認します。

適切な待機時間は次のとおりです。

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

## Agents プラットフォームのエラー {#agents-platform-errors}

Agents、Sessions、Skills、MCP 接続、Secrets は共通のエンベロープを返します。ほとんどのコードでは `message` は固定の安全な文になります。`invalid_request` には、どの入力形式やオプションがサポートされていないかなど、短い説明が含まれる場合があります。`message` ではなく `code` で分岐してください。

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type` は、401 では `authentication_error`、5xx では `server_error`、それ以外では `invalid_request_error` です。

| HTTP | `code` | 意味 | 対応 |
|---|---|---|---|
| 400 | `invalid_request` | フィールドの形式が不正または不明、検証の失敗、またはサポートされていないオプション | リクエストを修正します。そのまま再試行しないでください |
| 400 | `skill_not_found` | 参照している Skill またはバージョンが利用できない | Agent の `skills` を修正します |
| 401 | `unauthorized` | API キーヘッダーがない、無効、または競合している | `Authorization` / `X-API-Key` を確認します |
| 402 | `spending_limit_exceeded` | キーの利用上限または組織の残高を使い切った | クレジットを追加するか上限を引き上げます |
| 403 | `insufficient_scope` | キーがスコープ付きで、Agents のリソースを使用できない | Console で作成した標準のキーを使用します |
| 403 | `org_disabled` | 組織が Agents の実行を許可されていない | サポートに問い合わせます |
| 404 | `not_found` | リソースが組織内に存在しない | ID を確認します |
| 409 | `conflict` | `row_version` が古い、変更を許可しない状態、または異なるボディで `Idempotency-Key` を再利用した | リソースを再度読み取ってから判断します |
| 409 | `session_input_pending` | 以前の入力をまだ配信中 | 待機します。新しいキーで再送信しないでください |
| 409 | `session_input_expired` | 入力の受け付けが期限切れになった | 再送信する前に履歴を確認します |
| 409 | `session_environment_unavailable` | 実行環境が利用できない | 待機するか、新しい Session を作成します |
| 413 | `request_too_large` | リクエストボディ、またはそこから固定された Session 設定がサイズ上限を超えている | より小さいボディを送信します。そのまま再試行しないでください |
| 429 | `quota_exceeded` | Agents のクォータを超過した | 後で再試行します |
| 502 | `executor_rejected`、`executor_contract_error` | 実行レイヤーがリクエストを拒否したか、想定外の応答を返した | Agent の設定を確認してから再試行します |
| 503 | `executor_unavailable`、`storage_unavailable`、`skill_unavailable`、`tenant_unavailable`、`tenant_provisioning_failed`、`authorization_unavailable`、`admission_unavailable`、`internal_error` | 依存先が一時的に利用できない | バックオフを入れ、同じ `Idempotency-Key` で再試行します |

`skill_runtime_incompatible` が返されることもあります。これはメッセージ `internal error` とともに 503 として返されます。

## ストリーミング中の失敗 {#streaming-failures}

ストリームの開始後は、エラーが新しい HTTP レスポンスではなく、そのプロトコルのストリーム形式で届くことがあります。ストリームは不完全なものとして扱い、アプリケーションに必要な部分出力を保持し、リクエストを再生成しても安全な場合にのみ再試行してください。すべてのプロバイダーが同じ終了イベントや終了理由を出力するとは限りません。

## 運用時のデバッグ {#operational-debugging}

エンドポイント、HTTP ステータス、選択したモデルまたはリソースの ID、タイムスタンプ、サーバーが返した安全なリクエスト識別子を記録してください。認証ヘッダー、API キー、認証情報の値、機密性の高いプロンプト内容は決してログに記録しないでください。

組織のリクエスト履歴は [Developer → Activities](https://www.sandbase.ai/console/activities) で確認できます。継続的な障害を報告する際は、機密情報を除いたリクエストのメタデータと、再現可能な最小のリクエストを添えてください。

## 関連項目 {#see-also}

- [認証](/api-reference/authentication)
- [エラーと再試行](/guides/error-handling)
- [レート制限](/guides/rate-limiting)
- [AI 向けエラーガイド](/for-agents/errors)
