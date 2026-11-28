---
i18nSource: e904f2b8bbd0ccc4
title: Sessions
description: 在 Session 中執行 Agent、串流其事件、讀取歷史記錄、附加檔案，以及處理失敗。
---

# Sessions {#sessions}

**Session** 會在 SandBase 的託管雲端中執行一個已儲存的 Agent 版本；您不需要選擇執行環境。其 ID 以 `ses_` 開頭，所有 Session 路徑都位於 `/v1/agents/sessions` 之下。Session 會凍結其啟動時的 Agent 版本、Skill 版本與 MCP 連線設定。

## Session 如何啟動 {#how-sessions-start}

使用 `POST /v1/agents/sessions` 建立 Session。該 Session 會回報 `source: "direct"`。

## 執行 Session {#run-a-session}

原生事件串流為**僅限即時**：中斷連線後不會重播事件。請在傳送輸入前先開啟串流，並從 items 或 turns 讀取歷史記錄。

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

以下是使用官方 OpenAI Python SDK 的相同流程。先開啟串流，從另一個執行緒傳送輸入，並在收到結束回合事件時停止。Node.js 版本與 SDK 差異請參閱 [OpenAI 相容性](/agents/openai-compatibility)。

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

每次傳送只能攜帶一個事件。`input` 為文字字串，或是只包含一則 user 訊息的陣列，且該訊息只包含一個 `input_text` 部分：`[{"role": "user", "content": [{"type": "input_text", "text": "…"}]}]`。其他任何形式都會回傳 `400 invalid_request`。若要停止執行中的回合，請傳送 `{"type": "agent.session.input.cancel"}`，或使用 `Idempotency-Key` 呼叫 `POST /v1/agents/sessions/{session_id}/cancel`。取消閒置的 Session 仍會回傳 `202 {"accepted": true}`，且不會變更任何內容。您也可以在建立 Session 時傳入第一個 `input`。建立時不支援 `stream: true`。

## 狀態與失敗 {#status-and-failures}

| 欄位 | 值 | 意義 |
|---|---|---|
| `status` | `idle`、`in_progress`、`failed` | Session 的執行狀態 |
| `lifecycle_status` | `active`、`archived` | Session 是否接受輸入 |
| `failure` | `null` 或 `{code, message, action, retryable?}` | 公開的失敗原因與建議的下一步 |

`failure.action` 會告訴您該怎麼做：`retry_later`、`inspect_history`、`create_new_session`、`check_model_account` 或 `create_session_with_updated_model_provider`。請參閱[失敗代碼表](/api-reference/sessions/#status-fields)。

尚未支援向用戶端要求結果的 function 工具（`requires_action`）；讀取此類 Session 會回傳 `502 executor_contract_error`。

如果傳送時回傳 `409 session_input_pending`，表示先前的輸入仍在傳遞中。請等待並讀取 Session；不要使用新的 `Idempotency-Key` 重新傳送，否則輸入可能會執行兩次。

## 封存 {#archive}

`DELETE /v1/agents/sessions/{session_id}` 會封存 Session；Session 不會被永久刪除。`POST /v1/agents/sessions/{session_id}/archive` 與 `/unarchive` 接受 `{"row_version": …}`。已封存的 Session 會保留歷史記錄，但會拒絕輸入、中繼資料更新與串流。

## 附件 {#attachments}

使用 `POST /v1/agents/sessions/{session_id}/files` 將檔案上傳到 Session 工作區（multipart 欄位 `file`，最大 5 MiB，必須提供 `Idempotency-Key`）。支援的類型為 `.txt`、`.md`、`.csv`、`.log`、`.json`、`.pdf`、`.png`、`.jpg`、`.jpeg` 與 `.webp`。當檔案的 `status` 為 `ready` 時，即可連同最多九個其他檔案一起傳送：

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-2" \
  -H "Content-Type: application/json" \
  -d '{"input": "Summarize the attached report.", "file_ids": ["fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72"]}'
```

## 重新連線的用戶端 {#reconnecting-clients}

需要在連線中斷後取得一致檢視的瀏覽器類用戶端，可以呼叫 `POST /v1/agents/sessions/{session_id}/reconnect`。它會回傳 Session 以及用於 `GET /v1/agents/sessions/{session_id}/events/stream` 的 `stream_url`；該串流會先傳送 `session.snapshot`，接著傳送即時事件與 `heartbeat`。如果該串流發出 `stream.interrupted`，請再次重新連線，而不要重新傳送輸入。

## GitHub 儲存庫 {#github-repository}

在建立時傳送 `github_workspace`，即可將 GitHub 儲存庫複製到 `/workspace`，並讓 Agent 推送到其專屬的 Session 分支。請參閱 [GitHub 儲存庫工作區](/agents/github-workspace)。

## 模型憑證 {#model-credentials}

除非您傳送 `model_provider`，否則 Session 會使用建立它的 API 金鑰呼叫模型。使用 `{"type": "custom", "base_url": "https://…", "api_key": "…"}` 即可改用您自己的 OpenAI 相容 HTTPS 端點。`model_provider` 為唯寫欄位。

## ID {#ids}

| 前綴 | 資源 |
|---|---|
| `agt_` | Agent |
| `ses_` | Session |
| `skl_` | Skill |
| `mcp_` | MCP 連線 |
| `sec_` | Secret |
| `fil_` | Session 附件 |

請將 ID 視為不透明字串。

## 後續步驟 {#next-steps}

- [Sessions API 參考](/api-reference/sessions/)
- [OpenAI 相容性](/agents/openai-compatibility)

## 工作區檔案與生成的成品 {#workspace-files-and-generated-artifacts}

這三種資源各有不同用途：

| 資源 | 用途 | 分頁方式 |
|---|---|---|
| [附件](/api-reference/sessions/list-files) | 您上傳的檔案，可在輸入中以 `file_id` 參照 | `limit` / `offset` |
| [工作區檔案](/api-reference/sessions/list-workspace-files) | 工作區目錄中目前的檔案路徑與大小 | `page` / `next` |
| [成品](/api-reference/sessions/list-artifacts) | 可供下載、不可變更的生成輸出 | `after` / `last_id` |

列出成品以取得 `art_` ID，然後將該 ID 原樣傳給[下載成品](/api-reference/sessions/download-artifact)。工作區路徑或附件 `file_id` 無法取代它。工作區清單只回傳中繼資料，並不是可下載任意路徑的 API。成品可以完整檔案形式下載，最大 200 MiB；不支援以 `Range` 進行部分下載。
