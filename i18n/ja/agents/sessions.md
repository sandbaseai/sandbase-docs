---
i18nSource: e904f2b8bbd0ccc4
title: Sessions
description: Session で Agent を実行し、イベントのストリーミング、履歴の読み取り、ファイルの添付、エラー処理を行います。
---

# Sessions {#sessions}

**Session** は、保存済みの Agent バージョンを 1 つ、SandBase のホスト型クラウドで実行します。実行環境を選択する必要はありません。ID は `ses_` で始まり、Session のパスはすべて `/v1/agents/sessions` 以下にあります。Session は、開始時の Agent バージョン、Skill バージョン、MCP 接続の設定を固定します。

## Session の開始方法 {#how-sessions-start}

`POST /v1/agents/sessions` で Session を作成します。この Session は `source: "direct"` を報告します。

## Session を実行する {#run-a-session}

ネイティブのイベントストリームは**ライブ専用**です。切断後にイベントが再送されることはありません。入力を送信する前にストリームを開き、履歴はアイテムまたはターンから読み取ってください。

```bash
# 1. Create the Session
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-2026-10-06" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60"}'

# 2. In another terminal, follow live events (server-sent events)
curl -N https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY"

# 3. Send input (202 Accepted, no body)
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "List three notable launches this week."}]}'

# 4. Read the history afterwards
curl "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

公式の OpenAI Python SDK で同じフローを実行する例です。先にストリームを開き、別のスレッドから入力を送信して、ターンの終了イベントで停止します。Node.js 版と SDK の違いについては [OpenAI 互換性](/agents/openai-compatibility) を参照してください。

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
import threading
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
session = client.beta.agents.sessions.create(
    agent_id="agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
    environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
)

def send_input():
    client.beta.agents.sessions.events.create(
        session.id,
        events=[{
            "type": "agent.session.input.message",
            "input": [{"role": "user", "content": [{"type": "input_text", "text": "List three notable launches this week."}]}],
        }],
        idempotency_key="market-scan-input-1",
    )

with client.beta.agents.sessions.events.stream(session.id) as stream:
    threading.Thread(target=send_input).start()
    for event in stream:
        print(event.type)
        if event.type in ("agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"):
            break
```

1 回の送信にはイベントをちょうど 1 件含めます。`input` はテキスト文字列、または `input_text` パートをちょうど 1 つ持つ user メッセージをちょうど 1 件含む配列です：`[{"role": "user", "content": [{"type": "input_text", "text": "…"}]}]`。それ以外の形式の場合は `400 invalid_request` が返されます。実行中のターンを停止するには、`{"type": "agent.session.input.cancel"}` を送信するか、`Idempotency-Key` を付けて `POST /v1/agents/sessions/{session_id}/cancel` を呼び出します。アイドル状態の Session をキャンセルしても `202 {"accepted": true}` が返され、何も変更されません。Session の作成時に最初の `input` を渡すこともできます。作成時の `stream: true` には対応していません。

## ステータスと失敗 {#status-and-failures}

| フィールド | 値 | 意味 |
|---|---|---|
| `status` | `idle`, `in_progress`, `failed` | Session の実行状態 |
| `lifecycle_status` | `active`, `archived` | Session が入力を受け付けるかどうか |
| `failure` | `null` または `{code, message, action, retryable?}` | 失敗の公開理由と推奨される次の手順 |

`failure.action` は次に行うべきことを示します：`retry_later`、`inspect_history`、`create_new_session`、`check_model_account`、または `create_session_with_updated_model_provider`。[失敗コードの表](/api-reference/sessions/#status-fields)を参照してください。

クライアントに結果を求める function ツール（`requires_action`）にはまだ対応していません。そのような Session を読み取ると `502 executor_contract_error` が返されます。

送信で `409 session_input_pending` が返された場合、以前の入力がまだ配信中です。待ってから Session を読み取ってください。新しい `Idempotency-Key` で再送すると、入力が 2 回実行される可能性があります。

## アーカイブ {#archive}

`DELETE /v1/agents/sessions/{session_id}` は Session をアーカイブします。Session が完全に削除されることはありません。`POST /v1/agents/sessions/{session_id}/archive` と `/unarchive` は `{"row_version": …}` を受け取ります。アーカイブされた Session は履歴を保持しますが、入力、メタデータの更新、ストリームを拒否します。

## 添付ファイル {#attachments}

`POST /v1/agents/sessions/{session_id}/files` でファイルを Session のワークスペースにアップロードします（マルチパートフィールド `file`、最大 5 MiB、`Idempotency-Key` 必須）。対応する形式は `.txt`、`.md`、`.csv`、`.log`、`.json`、`.pdf`、`.png`、`.jpg`、`.jpeg`、`.webp` です。ファイルの `status` が `ready` になったら、他の最大 9 件のファイルと一緒に送信できます。

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-2" \
  -H "Content-Type: application/json" \
  -d '{"input": "Summarize the attached report.", "file_ids": ["fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72"]}'
```

## クライアントの再接続 {#reconnecting-clients}

接続が切れた後に一貫したビューが必要なブラウザ型のクライアントは、`POST /v1/agents/sessions/{session_id}/reconnect` を呼び出せます。これは Session と、`GET /v1/agents/sessions/{session_id}/events/stream` 用の `stream_url` を返します。このストリームは最初に `session.snapshot` を送信し、その後ライブイベントと `heartbeat` を送信します。このストリームが `stream.interrupted` を送信した場合は、入力を再送せずに再接続してください。

## GitHub リポジトリ {#github-repository}

作成時に `github_workspace` を送信すると、GitHub リポジトリが `/workspace` にクローンされ、Agent が Session 専用のブランチにプッシュできるようになります。[GitHub リポジトリワークスペース](/agents/github-workspace)を参照してください。

## モデルの認証情報 {#model-credentials}

`model_provider` を送信しない限り、Session は自身を作成した API キーでモデルを呼び出します。独自の OpenAI 互換 HTTPS エンドポイントで実行するには、`{"type": "custom", "base_url": "https://…", "api_key": "…"}` を使用します。`model_provider` は書き込み専用です。

## ID {#ids}

| プレフィックス | リソース |
|---|---|
| `agt_` | Agent |
| `ses_` | Session |
| `skl_` | Skill |
| `mcp_` | MCP 接続 |
| `sec_` | Secret |
| `fil_` | Session の添付ファイル |

ID は不透明な文字列として扱ってください。

## 次のステップ {#next-steps}

- [Sessions API リファレンス](/api-reference/sessions/)
- [OpenAI 互換性](/agents/openai-compatibility)

## ワークスペースファイルと生成された成果物 {#workspace-files-and-generated-artifacts}

以下の 3 つのリソースは、それぞれ異なる目的で使います。

| リソース | 用途 | ページネーション |
|---|---|---|
| [添付ファイル](/api-reference/sessions/list-files) | アップロードしたファイルで、入力から `file_id` で参照できるもの | `limit` / `offset` |
| [ワークスペースファイル](/api-reference/sessions/list-workspace-files) | ワークスペースディレクトリ内の現在のファイルパスとサイズ | `page` / `next` |
| [成果物](/api-reference/sessions/list-artifacts) | ダウンロード可能な、変更不可の生成出力 | `after` / `last_id` |

成果物を一覧表示して `art_` ID を取得し、その ID をそのまま [Download Artifact](/api-reference/sessions/download-artifact) に渡します。ワークスペースのパスや添付ファイルの `file_id` で代用することはできません。ワークスペースの一覧はメタデータのみを返し、任意のパスをダウンロードする API ではありません。成果物は最大 200 MiB の完全なファイルとしてダウンロードできます。`Range` による部分ダウンロードには対応していません。
