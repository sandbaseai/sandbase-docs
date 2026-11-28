---
i18nSource: dab112fdbbc56799
title: MCP ツールの認証情報
description: 書き込み専用の Bearer トークンを Secret として保存し、Agent が認証付きの MCP サーバーを呼び出せるようにします。
---

# MCP ツールの認証情報 {#credentials-for-mcp-tools}

MCP サーバーが認証を必要とする場合は、その Bearer トークンを **Secret** として保存し、Secret を [MCP 接続](/agents/mcp-tools#mcp-connections)に関連付けます。実行環境は、トークンをそのサーバーにのみ送信します。

## Secret の仕組み {#how-secrets-work}

- `kind` は常に `mcp_bearer` で、1 つの MCP サーバー用の Bearer トークンを表します。
- 各 Secret は、1 つの `server_url` に完全一致で紐付けられます。接続がその Secret を使えるのは、接続の `server_url` が一致する場合だけです。別の URL で使うには、別の Secret を作成してください。
- トークンは書き込み専用です。API は Secret の名前、URL、ステータス、`row_version` を返しますが、トークンは返しません。
- Secret は環境変数ではありません。Agent のランタイムには注入されず、Agent が読み取ることもできません。

以前のバージョンの SandBase では、ワークスペース単位または Agent 単位の認証情報を保存し、`GITHUB_TOKEN` などの環境変数として注入していました。この方式は廃止され、そのレコードは移行されません。引き続き必要な値は、MCP 接続の Secret として作成し直してください。

## API での操作 {#with-the-api}
Secret の作成、ローテーション、失効は API で行います。このガイドが API の仕様です。Agent エディターから開く Console の Credentials ページは、Secret の動作に関するリファレンスではありません。これらのエンドポイントは SandBase API キーと平文のトークンを受け取るため、ブラウザーのコードからではなく、信頼できるバックエンドから呼び出してください。

| メソッド | パス | 用途 |
|---|---|---|
| `POST` | `/v1/secrets` | [Secret を作成する](#create-a-secret) |
| `GET` | `/v1/secrets` | [Secret を一覧表示する](#list-secrets) |
| `GET` | `/v1/secrets/{secret_id}` | [Secret を取得する](#get-a-secret) |
| `POST` | `/v1/secrets/{secret_id}/rotate` | [トークンをローテーションする](#rotate-a-secret) |
| `DELETE` | `/v1/secrets/{secret_id}` | [Secret を失効させる](#revoke-a-secret) |

すべての書き込みには `Idempotency-Key`（1～128 バイト、先頭と末尾に空白なし）が必要です。Secret オブジェクトには `id`（`sec_` プレフィックス）、`name`、`kind`、`server_url`、`status`、`row_version`、`created_at`、`updated_at` があります。`status` は、トークンの保存中は `pending`、使用可能になると `active`、失効後は `disabled` になります。`created_at` と `updated_at` は RFC 3339 形式のタイムスタンプ文字列です。

### Secret を作成する {#create-a-secret}

```bash
python3 -c 'import json, os; print(json.dumps({"name": "GitHub MCP token", "kind": "mcp_bearer", "server_url": "https://mcp.example.com/github", "token": os.environ["GITHUB_MCP_TOKEN"]}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

- `kind` は `mcp_bearer` である必要があります。
- `server_url` は、ユーザー情報、クエリ、フラグメントを含まない HTTPS である必要があります。Secret はこの URL に完全一致する場合にのみ機能します。
- `name` と `token` は必須で、空にはできません。`name` は最大 128 バイト、`token` は最大 16384 バイト、`server_url` は最大 2048 バイトです。

レスポンスは `201 Created` で、トークンは含まれません。[MCP 接続を作成する](/api-reference/mcp-connections/#create-a-connection)ときに、`sec_` ID を `secret_id` として使います。

### Secret を一覧表示する {#list-secrets}

```bash
curl "https://api.sandbase.ai/v1/secrets?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`data`、`total`、`limit`、`offset` を使ったオフセットページネーションです。`limit` のデフォルトは 20 で、上限は 200 です。指定がない場合、無効な値、0 以下の値の場合は 20 が使われます。`offset` のデフォルトは 0 で、無効な値や 0 以下の値の場合は 0 が使われます。`offset + data.length >= total` になるまで、返された `limit` の分ずつ進めてください。無効化された Secret も一覧に残ります。

### Secret を取得する {#get-a-secret}

```bash
curl https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

### Secret をローテーションする {#rotate-a-secret}

`SECRET_ROW_VERSION` には、Secret の取得で得た最新の `row_version` を設定します。

```bash
python3 -c 'import json, os; print(json.dumps({"token": os.environ["GITHUB_MCP_TOKEN"], "row_version": int(os.environ["SECRET_ROW_VERSION"])}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61/rotate \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token-rotate-1" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

ローテーションではトークンが置き換えられ、Secret と `server_url` はそのまま維持されます。`token` と正の整数の `row_version` が必須で、Secret は `active` である必要があり、`row_version` は最新の値と一致している必要があります。`201 Created` を返します。新しい Session では新しいトークンが使われます。すでに開始している Session は、固定した認証情報を引き続き使います。

### Secret を失効させる {#revoke-a-secret}

```bash
curl -X DELETE https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-token-revoke"
```

`204 No Content` を返し、`status` を `disabled` に設定します。この Secret を使う接続は、新しい Session でも、既存 Session への追加入力でも機能しなくなります。失効は取り消せません。新しい Secret を作成し、接続を置き換えてください。

### エラーとリトライ {#errors-and-retries}

エラーは [Agents のエラーエンベロープ](/api-reference/errors#agents-platform-errors)を使います。フィールドが無効な場合や書き込みの冪等キーがない場合は `400 invalid_request`、Secret が存在しないかアクセスできない場合は `404 not_found` を返します。`row_version` が古い場合、ライフサイクルの状態が適合しない場合、作成時のキーを異なる入力で再利用した場合は `409 conflict` を返します。リトライの前に Secret を読み直し、新しい書き込みごとに新しいキーを使ってください。

## セキュリティ {#security}

- Secret の作成とローテーションは、ブラウザーのコードからではなく、信頼できるバックエンドから行います。
- トークンはスクリプトに貼り付けず、上の例の `$GITHUB_MCP_TOKEN` のように、独自のシークレットストアや環境から読み込みます。
- トークンを instructions、Session の入力、メタデータ、Skill バンドルに含めないでください。
- トークンが漏えいした可能性がある場合はすぐに Secret を失効させ、新しい Secret を作成して接続を置き換えてください。

## 次のステップ {#next-steps}

- [Skills と MCP ツール](/agents/mcp-tools)
- [MCP Connections API](/api-reference/mcp-connections/)
