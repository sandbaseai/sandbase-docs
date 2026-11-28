---
i18nSource: 8524e8b4d6f5ab97
title: Agents API
description: 保存済みの Agent 設定を作成、バージョン管理、アーカイブ、クローンします。
---

# Agents API {#agents-api}

Agent は、保存されバージョン管理される設定です。モデル、指示、ランタイムプロファイル、Skills、MCP 接続、出力設定で構成されます。Agent を作成・更新しても実行はされません。実行は [Session](/api-reference/sessions/) で行います。

Agents API は OpenAI Agents プロトコル（OpenAI Python SDK の `client.beta.agents`）に準拠しています。`OpenAI-Beta` ヘッダーは任意ですが、送信する場合は `agents=v1` である必要があります。SandBase は、バージョン、compare-and-set による更新、アーカイブと復元、公開カタログを追加で提供します。

## Agent の操作 {#agent-operations}

| メソッド | パス | 用途 |
|---|---|---|
| `POST` | `/v1/agents` | バージョン 1 として [Agent を作成](./create) |
| `GET` | `/v1/agents` | [Agent を一覧表示](./list) |
| `GET` | `/v1/agents/{agent_id}` | [Agent を取得](./get) |
| `POST` | `/v1/agents/{agent_id}` | [Agent を更新](./update)（SDK 形式の部分更新） |
| `PATCH` | `/v1/agents/{agent_id}` | `row_version` に対する [compare-and-set で置換](./replace) |
| `DELETE` | `/v1/agents/{agent_id}` | [削除](./delete)（Agent をアーカイブ） |
| `POST` | `/v1/agents/{agent_id}/archive` | [Agent をアーカイブ](./archive) |
| `POST` | `/v1/agents/{agent_id}/unarchive` | [Agent のアーカイブを解除](./unarchive) |
| `POST` | `/v1/agents/{agent_id}/restore` | [以前のバージョンを復元](./restore)し、新しいバージョンとして保存 |
| `GET` | `/v1/agents/{agent_id}/versions` | [バージョンを一覧表示](./versions) |
| `GET` | `/v1/agents/{agent_id}/versions/{version}` | [バージョンを 1 件取得](./get-version) |
| `GET` | `/v1/agents/catalog` | [公開カタログを閲覧](./catalog) |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | [カタログの Agent を組織にクローン](./catalog#clone-a-catalog-agent) |

Agent ID には `agt_` プレフィックスが付きます。リクエストボディは最大 1 MiB の厳密な JSON で、不明なフィールドは 400 を返します。

## バージョンと更新 {#versions-and-updates}

- 実質的な書き込み（作成、更新、置換、復元）のたびに、変更不可のバージョンが作成されます。`version` は現在のバージョン番号です。
- `POST /v1/agents/{agent_id}` は OpenAI SDK の更新操作です。`row_version` は不要なため、最後に書き込んだ内容が優先されます。
- `PATCH /v1/agents/{agent_id}` には最後に読み取った `row_version` が必要で、先に他の誰かが Agent を変更していた場合は 409 を返します。同時に実行される可能性があるエディターや自動化処理ではこちらを使用してください。
- 各 Session は、開始時の Agent バージョン、Skill バージョン、MCP 接続設定を固定します。

## 準備状態 {#readiness}

新しく書き込まれたバージョンは、実行の準備中に `projection_status` を報告します。Session には、`projection_status` が `ready` のアクティブな Agent が必要です。そうでない場合は 409 を返します。アーカイブ済みの Agent も、新しい実行に対して 409 を返します。

## 現在の制限 {#current-limits}

- `tools` には `function` ツールと、最大 1 つの `web_search` ツールを指定できます。現在、実行時には `web_search.mode` が `disabled` である必要があります。
- 関数ツールは保存できますが、クライアントにツール結果の返却を求める Run（`requires_action`）はまだサポートされておらず、`502 executor_contract_error` として返されます。
- `multi_agent` は省略するか `null` にする必要があります。

## ページネーション {#pagination}

`GET /v1/agents` とカタログはカーソルページネーションを使用します。パラメーターは `limit`（1-100、デフォルト 20）、`after`、`order`（`asc` または `desc`、デフォルト `desc`）です。レスポンスには `object: "list"`、`data`、`has_more`、`first_id`、`last_id` が含まれます。次のページを取得するには、`last_id` を `after` に渡します。

`GET /v1/agents/{agent_id}/versions` はオフセットページネーションを使用します。パラメーターは `limit` と `offset` で、レスポンスには `data`、`total`、`limit`、`offset` が含まれます。

## エラー {#errors}

エラーは Agents のエンベロープ `{"error":{"type","code","param":null,"message"}}` を使用します。コードの一覧は [エラー](/api-reference/errors#agents-platform-errors) を参照してください。
