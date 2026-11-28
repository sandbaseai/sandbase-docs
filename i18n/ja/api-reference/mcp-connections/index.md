---
i18nSource: ee126767f58b111b
title: MCP Connections API
description: Agents が呼び出せるリモート HTTPS MCP サーバーを登録します。
---

# MCP Connections API {#mcp-connections-api}

MCP 接続は、HTTPS で到達可能なリモート MCP サーバーを登録するものです。Agents は `mcp_connections` で接続を参照し、各 Session は開始時に接続の設定を固定します。接続 ID には `mcp_` プレフィックスが付きます。Bearer トークンでサーバーに認証するには、先に同じ URL の [Secret](/agents/api-credentials#with-the-api) を作成してください。

| メソッド | パス | 目的 |
|---|---|---|
| `POST` | `/v1/mcp-connections` | [接続を作成する](#create-a-connection) |
| `GET` | `/v1/mcp-connections` | [接続を一覧表示する](#list-connections) |
| `GET` | `/v1/mcp-connections/{connection_id}` | [接続を取得する](#get-a-connection) |
| `PUT` | `/v1/mcp-connections/{connection_id}` | [接続を置き換える](#replace-a-connection) |
| `POST` | `/v1/mcp-connections/{connection_id}/enable` | [接続を有効にする](#enable-a-connection) |
| `DELETE` | `/v1/mcp-connections/{connection_id}` | [接続を無効にする](#disable-a-connection) |

すべての書き込みには `Idempotency-Key`（1〜128 バイト、先頭と末尾の空白なし）が必要です。接続オブジェクトには `id`、`name`、`server_url`、`secret_id`（設定時）、`status`（`active` または `disabled`）、`row_version`、`created_at`、`updated_at` があります。

## 接続を作成する {#create-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
```

- `name` は必須で、空白以外の文字を含む最大 128 バイトの値です。
- `server_url` は HTTPS である必要があり、ユーザー情報、クエリ、フラグメントを含めることはできません（最大 2048 バイト）。
- `secret_id` は任意です。匿名のサーバーでは省略してください。設定する場合、Secret は `active` であり、その `server_url` がこの `server_url` と完全に一致している必要があります。そうでない場合、リクエストは失敗します（Secret が非アクティブなら 409、URL が一致しなければ 400）。

`201 Created` を返します。

## 接続を一覧表示する {#list-connections}

```bash
curl "https://api.sandbase.ai/v1/mcp-connections?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`data`、`total`、`limit`、`offset` によるオフセットページネーションです。`limit` のデフォルトは 20、上限は 200 で、未指定、無効、または 0 以下の値の場合は 20 が使われます。`offset` のデフォルトは 0 で、無効または 0 以下の値の場合は 0 が使われます。`offset + data.length >= total` になるまで、返された `limit` の分だけ進めてください。無効化されたリソースも一覧に表示されます。

## 接続を取得する {#get-a-connection}

```bash
curl https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

## 接続を置き換える {#replace-a-connection}

```bash
curl -X PUT https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-v2" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "row_version": 1}'
```

`PUT` は `name`、`server_url`、`secret_id` をまとめて置き換えます。`secret_id` を省略すると、接続は匿名になります。`row_version` は必須で、Get Connection が返す現在の値と一致している必要があります。更新された接続とともに `200 OK` を返します。無効化された接続は、置き換え後も有効にするまで無効のままです。

## 接続を有効にする {#enable-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13/enable \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-enable" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 3}'
```

`row_version` は必須で、現在のリソースと一致する正の整数である必要があります。接続とともに `200 OK` を返します。有効化しても接続 ID は変わりません。取り消された Secret は復元されないため、先に新しいアクティブな Secret で接続を置き換えてください。

## 接続を無効にする {#disable-a-connection}

```bash
curl -X DELETE https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-disable"
```

`204 No Content` を返し、`status` を `disabled` に設定します。新しい Session ではこの接続を使用できなくなり、この接続を固定した既存の Session はそれ以降の入力を拒否します。すでに実行中のツール呼び出しは中断されません。

## 変更と実行中の Session {#changes-and-running-sessions}

Session は開始時に接続の設定を固定します。接続を置き換えたり Secret をローテーションしたりすると、新しい Session は新しい設定を使用し、既存の Session はスナップショットを保持します。接続を無効にしたり Secret を取り消したりすると、新しい Session と既存の Session への以降の入力の両方がブロックされます。

## エラーとリトライ {#errors-and-retries}

エラーには [Agents エラーエンベロープ](/api-reference/errors#agents-platform-errors) が使われます。無効なフィールドや、書き込み時の冪等性キーの欠落は `400 invalid_request` を返します。不明またはアクセスできないリソースは `404 not_found` を返します。古い `row_version`、互換性のないライフサイクル状態、または作成/更新のキーを異なる入力で再利用した場合は `409 conflict` が返されます。新しい更新を行う前にリソースを再度読み取り、新しい書き込み操作ごとに新しいキーを使用してください。

`created_at` と `updated_at` は RFC 3339 形式のタイムスタンプ文字列です。
