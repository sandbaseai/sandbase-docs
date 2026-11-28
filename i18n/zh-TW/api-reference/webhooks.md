---
i18nSource: efd4d5f7b8980661
title: Webhooks
description: 為非同步模型事件註冊並管理 SandBase webhook。
---

# Webhooks {#webhooks}

SandBase 支援兩種對外回呼模式：

- **已註冊的 webhook** 以您的組織為範圍，訂閱非同步 Model 事件，並帶有 HMAC `X-Signature`。
- **單一任務的模型回呼** 在單一非同步圖片、影片或音訊請求中使用 `webhook_url`。無須註冊，也不帶 `X-Signature`。

兩種模式都採用至少一次（at-least-once）傳遞。請以事件 ID 讓處理程式具備冪等性。

## 註冊 webhook {#register-a-webhook}

Events API 是提供給 API 金鑰使用的公開介面：

```text
POST https://api.sandbase.ai/events/webhooks
```

您也可以在 [Console Webhooks 頁面](https://www.sandbase.ai/console/webhooks) 建立與管理 webhook。

```bash
curl -X POST https://api.sandbase.ai/events/webhooks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Model generation monitor",
    "url": "https://example.com/hooks/sandbase",
    "resourceType": "model",
    "events": ["model.generation.completed", "model.generation.failed"]
  }'
```

| 欄位 | 類型 | 必填 | 說明 |
|---|---|---:|---|
| `name` | string | 是 | 易於辨識的名稱。 |
| `url` | string | 是 | 有效的 HTTP(S) 端點。正式環境請使用 HTTPS。 |
| `resourceType` | `model` | 是 | 選擇下方的非同步 Model 事件。`model` 是唯一支援的值。 |
| `events` | string[] | 否 | 空值或省略表示所選資源類型中所有現有與未來的事件。 |
| `enabled` | boolean | 否 | 預設為 `true`。 |
| `signatureSecret` | string | 否 | 省略此欄位可讓 SandBase 產生高熵的密鑰。既有的用戶端可繼續提供自己的非空值。 |

`session`、`sandbox` 與 `template` 資源類型已停用：以其中任一類型建立 webhook 會回傳 HTTP 400。這些類型的既有註冊仍會列出以便清理：對它們執行 `PATCH` 會回傳 HTTP 400，除非同一個請求將 `resourceType` 改為 `model`（且產生的訂閱有效），因此請刪除它們或將其轉換為 `model`。`model` 訂閱僅適用於下方列出的非同步圖片、影片與音訊終止事件。API 會拒絕其他資源類型的事件與未知的事件名稱。

### 成功回應 {#successful-response}

Events API 會直接回傳已註冊的 webhook。最終的 `signatureSecret` 只會包含在這次建立回應中。請立即妥善保存：列表與編輯回應永遠不會回傳它，之後也無法復原。

```json
{
  "id": "wh_01...",
  "name": "Model generation monitor",
  "url": "https://example.com/hooks/sandbase",
  "resourceType": "model",
  "events": ["model.generation.completed", "model.generation.failed"],
  "enabled": true,
  "createdAt": "2026-07-15T12:00:00Z",
  "signatureSecret": "whsec_<one-time-value>"
}
```

[Console Webhooks 頁面](https://www.sandbase.ai/console/webhooks) 會在註冊後顯示一次產生的密鑰，並要求您在關閉對話框前先儲存。

### 列出、編輯與刪除 {#list-edit-and-delete}

```text
GET    https://api.sandbase.ai/events/webhooks
PATCH  https://api.sandbase.ai/events/webhooks/{webhookID}
DELETE https://api.sandbase.ai/events/webhooks/{webhookID}
```

請使用相同的 API 金鑰驗證。`PATCH` 可包含 `name`、`url`、`resourceType`、`events` 與 `enabled` 其中一個或多個；省略的欄位維持不變。變更後完整的 `resourceType` 與 `events` 訂閱必須有效。空的 `events` 陣列仍表示該資源類型中的所有事件。

```bash
curl -X PATCH https://api.sandbase.ai/events/webhooks/wh_01... \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["model.generation.completed", "model.generation.timeout"],
    "enabled": true
  }'
```

`signatureSecret` 無法透過 `PATCH` 檢視或變更；包含它的請求會被拒絕。若遺失密鑰，請刪除並重新建立 webhook。您也可以在 [Console Webhooks 頁面](https://www.sandbase.ai/console/webhooks) 檢視、編輯、啟用或停用，以及刪除註冊。

`GET` 會回傳 webhook 的 JSON 陣列（不含 `signatureSecret`），`PATCH` 會回傳更新後的 webhook，`DELETE`
則回傳 `204 No Content`。

### 驗證與錯誤 {#authentication-and-errors}

Events API 接受以 `Authorization: Bearer $SANDBASE_API_KEY` 或 `X-API-Key: $SANDBASE_API_KEY` 傳送 API 金鑰。兩者
同時傳送時，會使用 Bearer 標頭。

錯誤使用專屬的主體格式，並在 `code` 中重複 HTTP 狀態：

```json
{"code": 400, "message": "resourceType must be \"model\""}
```

請依 HTTP 狀態分支處理。`401` 表示金鑰遺失、無效或已撤銷；`400` 表示請求主體或
訂閱無效；`404`（`webhook not found`）表示該 webhook 不存在於您的組織中。

## 單一任務的模型回呼 {#per-task-model-callback}

對於單一非同步圖片、影片或音訊任務，請在 `POST /v1/run` 中加入 `webhook_url`，而不必註冊新的 webhook：

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "example/async-image-model",
    "mode": "async",
    "prompt": "A lighthouse at night",
    "webhook_url": "https://hooks.example.com/sandbase/task?token=opaque-token"
  }'
```

只有當所選模型為圖片、影片或音訊，且請求解析為非同步執行時，才會解析並驗證此欄位。此時它必須是非空字串，且為有效、安全的公開 HTTPS URL；否則請求會回傳 HTTP 400。對於同步、串流、LLM 或其他不支援的請求，無論 JSON 值為何，SandBase 都會忽略 `webhook_url`：不會排程回呼、不會儲存回呼 URL，也不會將此欄位轉送給模型供應商。省略此欄位則維持既有的輪詢流程。

目標必須是公開的 HTTPS URL。對於 completed、failed、timeout 或 cancelled，SandBase 會傳送與下方說明相同的 Model 終止信封，並帶有 `Content-Type: application/json` 與 `X-Event-ID`。失敗的傳遞可能會重試，因此請依 `id` 或 `X-Event-ID` 去除重複，並盡快回傳 2xx。

單一任務回呼沒有共用的 SandBase 密鑰，因此**不會**帶有 `X-Signature`。若您的端點需要 HMAC 驗證，請省略 `webhook_url`，改為註冊組織的 Model Webhook。您可以將自己系統產生的不透明能力權杖放在 HTTPS URL 的查詢字串中，並在端點驗證它。請將該 URL 視為敏感資料。

對於每個非同步模型任務，目標的選擇是互斥的。若請求包含有效的 `webhook_url`，SandBase 只會將該 Prediction 的終止事件傳送到此單一任務 URL，並在該事件上略過所有已註冊的組織 Model Webhook。若請求省略 `webhook_url`，已註冊的組織 Model Webhook 會照常接收符合的事件。單一任務的傳遞失敗只會重試同一個任務 URL，絕不會退回已註冊的 webhook。此優先順序不會建立、取代、停用或修改任何註冊，也不影響其他 Model 事件。

## 事件類型 {#event-types}

### 模型生成 {#model-generation}

Model webhook 僅適用於非同步的圖片、影片與音訊生成。同步的圖片／影片／音訊請求或任何同步 LLM 請求都不會發出這些事件：其結果由原始的 HTTP 回應回傳。

| 事件 | 說明 |
|---|---|
| `model.generation.completed` | 非同步的圖片、影片或音訊生成已完成。 |
| `model.generation.failed` | 非同步的圖片、影片或音訊生成失敗。 |
| `model.generation.timeout` | 非同步的圖片、影片或音訊生成逾時。 |
| `model.generation.cancelled` | 非同步的圖片、影片或音訊生成已取消。 |

## 傳遞內容 {#delivery-payload}

SandBase 會傳送 `Content-Type: application/json` 與以下 JSON 信封。`data` 依事件而定，日後可能新增欄位。

### 模型完成範例 {#model-completion-example}

```json
{
  "id": "model_pred_01_completed",
  "resourceType": "model",
  "resourceID": "pred_01...",
  "type": "model.generation.completed",
  "data": {
    "predictionID": "pred_01...",
    "model": "example-image-model",
    "generationType": "image",
    "status": "completed",
    "completedAt": "2026-07-14T09:30:38Z",
    "outputs": ["https://.../generated-image.png"]
  },
  "createdAt": "2026-07-14T09:30:38Z"
}
```

失敗與逾時事件不含輸出，只包含經過清理的錯誤類別。

| 欄位 | 說明 |
|---|---|
| `id` | 唯一的事件 ID。請以此值或 `X-Event-ID` 作為冪等鍵。 |
| `resourceType` | `model`。 |
| `resourceID` | 受影響的 Prediction ID。 |
| `type` | 上表中的事件類型。 |
| `data` | 事件專屬的資料。 |
| `createdAt` | 事件建立時間，格式為 RFC 3339 UTC。 |

## 驗證已註冊 webhook 的簽章 {#verify-a-registered-webhook-signature}

每次已註冊 webhook 的傳遞都包含以下標頭：

| 標頭 | 值 |
|---|---|
| `X-Event-ID` | 內容中的 `id`。 |
| `X-Signature` | 以 `signatureSecret` 為金鑰、對原始請求主體計算的 HMAC-SHA256，以小寫十六進位表示。 |

請在解析 JSON 之前，先以原始請求位元組驗證簽章。單一任務的 `webhook_url` 回呼不含此標頭，無法使用此驗證流程。以下處理程式適用於已註冊的 webhook：先驗證、再解析，以 `id` 作為冪等鍵，並將工作交給非同步函式處理。請將佔位的佇列呼叫替換為您自己的持久性佇列或 worker。

::: code-group

```javascript [Node.js + Express]
import crypto from 'node:crypto'
import express from 'express'

const app = express()
const webhookSecret = process.env.SANDBASE_WEBHOOK_SECRET
if (!webhookSecret) throw new Error('SANDBASE_WEBHOOK_SECRET is required')
const acceptedEventIDs = new Set() // Use a DB unique key in production.

function enqueueSandBaseEvent(event) {
  setImmediate(() => {
    console.log(`processing ${event.type} (${event.id})`)
    // Perform slow business work here or publish to your durable queue.
  })
}

// This route must be registered before express.json() for the webhook path.
app.post('/hooks/sandbase', express.raw({ type: 'application/json' }), (req, res) => {
  const rawBody = req.body
  const signature = req.get('X-Signature') || ''

  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex')

  const received = Buffer.from(signature, 'utf8')
  const expectedBuffer = Buffer.from(expected, 'utf8')
  if (received.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, received)) {
    return res.status(401).json({ error: 'invalid signature' })
  }

  const event = JSON.parse(rawBody.toString('utf8'))
  if (acceptedEventIDs.has(event.id)) return res.sendStatus(204)
  acceptedEventIDs.add(event.id)
  enqueueSandBaseEvent(event)
  return res.sendStatus(204)
})

app.listen(3000)
```

```python [Python + Flask]
import hashlib
import hmac
import json
import os
import threading

from flask import Flask, abort, request

app = Flask(__name__)
webhook_secret = os.environ["SANDBASE_WEBHOOK_SECRET"].encode()
accepted_event_ids = set()  # Use a DB unique key in production.
accepted_event_ids_lock = threading.Lock()

def process_sandbase_event(event):
    print(f"processing {event['type']} ({event['id']})")
    # Perform slow business work here or publish to your durable queue.

@app.post("/hooks/sandbase")
def sandbase_webhook():
    raw_body = request.get_data(cache=True)
    received = request.headers.get("X-Signature", "")
    expected = hmac.new(webhook_secret, raw_body, hashlib.sha256).hexdigest()

    if not hmac.compare_digest(expected, received):
        abort(401, "invalid signature")

    event = json.loads(raw_body)
    with accepted_event_ids_lock:
        if event["id"] in accepted_event_ids:
            return "", 204
        accepted_event_ids.add(event["id"])
    threading.Thread(target=process_sandbase_event, args=(event,), daemon=True).start()
    return "", 204
```

:::

HMAC 的輸入是完全原始的主體。計算前請勿呼叫 JSON 解析器或重新序列化內容。

```text
X-Signature = hex(HMAC-SHA256(signatureSecret, rawRequestBody))
```

## 傳遞行為 {#delivery-behavior}

- 在 10 秒內回傳 `2xx` 範圍的回應即視為成功。
- 網路錯誤、逾時與非 2xx 回應都視為失敗。現有的事件分派器可能會重試失敗的傳遞；接收端必須能容忍重複傳遞。
- 請在持久化接收後回傳 2xx 回應，再以非同步方式執行耗時的工作。範例僅為了能直接執行而使用記憶體內的去重；正式環境的接收端必須改用資料庫唯一鍵或持久性佇列。請勿假設事件只會傳遞一次或依序抵達。
