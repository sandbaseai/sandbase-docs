---
i18nSource: 99170a141af66587
title: Sessions API
description: 保存済みの Agent バージョンを実行し、入力を送信し、イベントをストリーミングし、Session の履歴を読み取ります。
---

# Sessions API {#sessions-api}

Session は、保存済みの [Agent](/api-reference/agents/) のバージョンを 1 つ、SandBase のホスト型クラウドで実行します。実行環境を選ぶ必要はありません。Session ID には `ses_` プレフィックスが付きます。Session は Agents のサブリソースで、すべてのパスは `/v1/agents/sessions` で始まります。

標準の操作は OpenAI Agents プロトコル（`client.beta.agents.sessions`）に準拠しています。公式 SDK でできることとできないことについては [OpenAI 互換性](/agents/openai-compatibility) を参照してください。SandBase 拡張機能として、名前の変更、アーカイブ状態、キャンセル、添付ファイル、ワークスペースファイルのメタデータ、変更不可のアーティファクト、再接続可能なプロダクトストリームが追加されています。

::: info Session の作成元
Session は `POST /v1/agents/sessions` で直接作成します。その Session は `source: "direct"` と `source_id: null` を返します。
:::

## 推奨フロー {#recommended-flow}

1. 保存済みの Agent に対して [Session を作成](./create) します。Session は選択した Agent バージョンと MCP 接続を固定し、その Agent バージョンにすでに固定されている Skill のバージョンを使用します。
2. `GET /v1/agents/sessions/{session_id}/events` で [イベントストリームを開きます](./stream)。ストリームはライブ配信のみのため、入力を送信する前に開いてください。
3. `POST /v1/agents/sessions/{session_id}/events` と `agent.session.input.message` イベントで [入力を送信](./send-events) します。呼び出しは 202 を返します。
4. 結果をストリームから読み取るか、後から [items](./items) と [turns](./turns) で読み取ります。

## Session の操作 {#session-operations}

| メソッド | パス | 用途 |
|---|---|---|
| `POST` | `/v1/agents/sessions` | [Session を作成](./create) |
| `GET` | `/v1/agents/sessions` | [Session を一覧表示](./list) |
| `GET` | `/v1/agents/sessions/{session_id}` | [Session を取得](./get) |
| `POST` | `/v1/agents/sessions/{session_id}` | [メタデータを置き換え](./update) |
| `PATCH` | `/v1/agents/sessions/{session_id}` | `row_version` を使って [名前を変更](./rename) |
| `DELETE` | `/v1/agents/sessions/{session_id}` | [削除](./delete)（Session をアーカイブ） |
| `POST` | `/v1/agents/sessions/{session_id}/events` | [入力イベントまたはキャンセルイベントを 1 件送信](./send-events) |
| `GET` | `/v1/agents/sessions/{session_id}/events` | [ライブイベントをストリーミング](./stream)（SSE） |
| `GET` | `/v1/agents/sessions/{session_id}/items` | [items を一覧表示](./items) |
| `GET` | `/v1/agents/sessions/{session_id}/turns` | [turns を一覧表示](./turns) |
| `GET` | `/v1/agents/sessions/{session_id}/turns/{turn_id}` | [turn を 1 件取得](./get-turn) |
| `POST` | `/v1/agents/sessions/{session_id}/cancel` | [実行中のターンをキャンセル](./cancel) |
| `POST` | `/v1/agents/sessions/{session_id}/archive` | [アーカイブ](./archive) |
| `POST` | `/v1/agents/sessions/{session_id}/unarchive` | [アーカイブ解除](./unarchive) |
| `POST` | `/v1/agents/sessions/{session_id}/reconnect` | ストリームが切断された後に [再接続](./reconnect) |
| `GET` | `/v1/agents/sessions/{session_id}/events/stream` | [スナップショット後にライブ配信するストリーム](./stream-snapshot)（SSE） |
| `POST` | `/v1/agents/sessions/{session_id}/files` | [添付ファイルをアップロード](./upload-file) |
| `GET` | `/v1/agents/sessions/{session_id}/files` | [添付ファイルを一覧表示](./list-files) |
| `GET` | `/v1/agents/sessions/{session_id}/files/{file_id}/content` | [添付ファイルをダウンロード](./download-file) |
| `DELETE` | `/v1/agents/sessions/{session_id}/files/{file_id}` | [添付ファイルを削除](./delete-file) |
| `GET` | `/v1/agents/sessions/{session_id}/workspace-files` | [ワークスペースファイルのメタデータを一覧表示](./list-workspace-files) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts` | [変更不可のアーティファクトを一覧表示](./list-artifacts) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` | [アーティファクトをダウンロード](./download-artifact) |

## ステータスフィールド {#status-fields}

- `status` は実行ステータスで、`idle`、`in_progress`、または `failed` です。クライアントの結果を必要とする function ツール（`requires_action`）はまだサポートされていません。そのような Session を読み取ると `502 executor_contract_error` を返します。
- `lifecycle_status` は `active` または `archived` です。アーカイブ済みの Session は、入力、メタデータの更新、ストリームを拒否します。`DELETE` でアーカイブし、`unarchive` で元に戻します。
- `failure` は `null`、または `code`、`message`、`action`、場合によっては `retryable` を含むオブジェクトです。

| `failure.code` | 意味 | 推奨される `action` |
|---|---|---|
| `session_creation_rejected` | 実行レイヤーが Session を拒否しました | `create_new_session` |
| `model_authentication_failed` | モデルプロバイダーがキーを拒否しました | `create_session_with_updated_model_provider` |
| `model_rate_limited` | モデルプロバイダーがレート制限中です（リトライ可能） | `retry_later` |
| `model_quota_exceeded` | モデルアカウントにクォータがありません | `check_model_account` |
| `context_limit_exceeded` | 会話がモデルのコンテキストを超えています | `create_new_session` |
| `environment_connection_timeout` | 環境が時間内に接続されませんでした（リトライ可能） | `retry_later` |
| `runtime_unavailable` | 実行環境を利用できません（リトライ可能） | `retry_later` |
| `model_request_failed` | モデルリクエストが完了しませんでした | `inspect_history` |
| `model_configuration_rejected` | モデルまたは実行レイヤーが設定を拒否しました | `create_session_with_updated_model_provider` |
| `execution_failed` | より具体的な公開原因のない失敗 | `inspect_history` |

Session をライブで読み取れない場合、一覧の結果には `session_not_ready`、`session_execution_unavailable`、`session_configuration_unavailable`、または `session_snapshot_unavailable` を含むプレースホルダー行が含まれることもあります。

## モデルの認証情報 {#model-credentials}

デフォルトでは、Session は作成に使用したものと同じ SandBase API キーでモデルを呼び出します。明示的に選択するには `model_provider` を送信します。

- `{"type": "sandbase"}` は呼び出し元のキーを使用します。`base_url` は指定できません。
- `{"type": "custom", "base_url": "https://…", "api_key": "…"}` は独自の OpenAI 互換 HTTPS エンドポイントを呼び出します。URL に認証情報、クエリ、フラグメントを含めることはできません。SandBase が SandBase キーにフォールバックすることはありません。

`model_provider` は書き込み専用で、レスポンスには含まれません。

## 実行の受け入れとエラー {#admission-and-errors}

Session の作成と入力の送信では、実行の受け入れ条件がチェックされます。キーの上限または組織の残高を使い切った場合は `402 spending_limit_exceeded`、組織が Agent を実行できない場合は `403 org_disabled`、チェックを完了できない場合は `503 admission_unavailable` を返します。読み取り、キャンセル、アーカイブは残高によってブロックされません。

入力の送信では、`409 session_input_pending`（以前の入力がまだ配信中です。待機し、新しいキーで再送信しないでください）、`409 session_input_expired`（再送信する前に履歴を確認してください）、`409 session_environment_unavailable`（待機するか、新しい Session を作成してください）が返されることもあります。[エラー](/api-reference/errors#agents-platform-errors) を参照してください。

## ページネーション {#pagination}

Session、items、turns、アーティファクトはカーソルページネーション（`limit` 1-100、`after`、`order`）を使用します。添付ファイルはオフセットページネーション（`limit` 1-100、`offset`）を使用します。

ワークスペースファイルは代わりに `page` / `next` ページネーションを使用します。[ワークスペースファイルの一覧](./list-workspace-files) を参照してください。
