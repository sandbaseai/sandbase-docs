---
i18nSource: efd4d5f7b8980661
title: Webhooks
description: 非同期モデルイベント用の SandBase Webhook を登録・管理します。
---

# Webhooks {#webhooks}

SandBase は 2 種類の送信コールバックモードをサポートしています。

- **登録済み Webhook** は組織単位で、非同期 Model イベントをサブスクライブし、HMAC の `X-Signature` を含みます。
- **タスク単位のモデルコールバック** は、1 件の非同期画像・動画・音声リクエストで `webhook_url` を使用します。登録は不要で、`X-Signature` は含まれません。

どちらのモードも at-least-once 配信です。イベント ID を使ってハンドラーを冪等にしてください。

## Webhook を登録する {#register-a-webhook}

Events API は API キーで利用できる公開インターフェースです。

```text
POST https://api.sandbase.ai/events/webhooks
```

[Console の Webhooks ページ](https://www.sandbase.ai/console/webhooks) から Webhook を作成・管理することもできます。

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

| フィールド | 型 | 必須 | 説明 |
|---|---|---:|---|
| `name` | string | はい | わかりやすい名前。 |
| `url` | string | はい | 有効な HTTP(S) エンドポイント。本番環境では HTTPS を使用してください。 |
| `resourceType` | `model` | はい | 下記の非同期 Model イベントを選択します。サポートされる値は `model` のみです。 |
| `events` | string[] | いいえ | 空または省略した場合、選択したリソースタイプの現在および将来のすべてのイベントが対象になります。 |
| `enabled` | boolean | いいえ | デフォルトは `true` です。 |
| `signatureSecret` | string | いいえ | このフィールドを省略すると、SandBase が高エントロピーのシークレットを生成します。既存のクライアントは、引き続き空でない独自の値を指定できます。 |

`session`、`sandbox`、`template` のリソースタイプは廃止されました。これらのいずれかで Webhook を作成すると HTTP 400 を返します。これらのタイプの既存の登録はクリーンアップのために一覧に表示されます。同じリクエストで `resourceType` を `model` に変更しない限り（かつ変更後のサブスクリプションが有効でない限り）、それらへの `PATCH` は HTTP 400 を返すため、削除するか `model` に変換してください。`model` サブスクリプションは、下記の非同期画像・動画・音声の終了イベントでのみ利用できます。API は他のリソースタイプのイベントや不明なイベント名を拒否します。

### 成功時のレスポンス {#successful-response}

Events API は登録された Webhook を直接返します。最終的な `signatureSecret` は、この作成レスポンスにのみ含まれます。今すぐ安全に保存してください。一覧や編集のレスポンスでは返されず、後から復元することもできません。

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

[Console の Webhooks ページ](https://www.sandbase.ai/console/webhooks) では、登録後に生成されたシークレットが一度だけ表示され、ダイアログを閉じる前に保存する必要があります。

### 一覧、編集、削除 {#list-edit-and-delete}

```text
GET    https://api.sandbase.ai/events/webhooks
PATCH  https://api.sandbase.ai/events/webhooks/{webhookID}
DELETE https://api.sandbase.ai/events/webhooks/{webhookID}
```

同じ API キー認証を使用します。`PATCH` には `name`、`url`、`resourceType`、`events`、`enabled` のうち 1 つ以上を含められます。省略したフィールドは変更されません。変更後の `resourceType` と `events` のサブスクリプション全体が有効である必要があります。空の `events` 配列は、引き続きそのリソースタイプのすべてのイベントを意味します。

```bash
curl -X PATCH https://api.sandbase.ai/events/webhooks/wh_01... \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["model.generation.completed", "model.generation.timeout"],
    "enabled": true
  }'
```

`signatureSecret` は `PATCH` で表示も変更もできず、これを含むリクエストは拒否されます。シークレットを紛失した場合は、Webhook を削除して作り直してください。[Console の Webhooks ページ](https://www.sandbase.ai/console/webhooks) から登録の表示、編集、有効化・無効化、削除を行うこともできます。

`GET` は Webhook の JSON 配列（`signatureSecret` を除く）を返し、`PATCH` は更新後の Webhook を返し、`DELETE` は
`204 No Content` を返します。

### 認証とエラー {#authentication-and-errors}

Events API は、API キーを `Authorization: Bearer $SANDBASE_API_KEY` または `X-API-Key: $SANDBASE_API_KEY` として受け付けます。
両方を送信した場合は Bearer ヘッダーが使用されます。

エラーは独自のボディを使用し、HTTP ステータスが `code` に繰り返されます。

```json
{"code": 400, "message": "resourceType must be \"model\""}
```

HTTP ステータスで分岐してください。`401` はキーがない、無効、または失効していることを意味し、`400` はリクエストボディまたは
サブスクリプションが無効であることを、`404`（`webhook not found`）は組織内にその Webhook が存在しないことを意味します。

## タスク単位のモデルコールバック {#per-task-model-callback}

1 件の非同期画像・動画・音声タスクでは、新しい Webhook を登録する代わりに `POST /v1/run` に `webhook_url` を追加します。

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

このフィールドは、選択したモデルが画像・動画・音声で、かつリクエストが非同期実行に解決される場合にのみ解析・検証されます。その場合、有効で安全な公開 HTTPS URL を含む空でない文字列である必要があり、そうでなければリクエストは HTTP 400 を返します。同期、ストリーミング、LLM、その他のサポート対象外のリクエストでは、SandBase は JSON の値にかかわらず `webhook_url` を無視します。コールバックはスケジュールされず、コールバック URL も保存されず、このフィールドがモデルプロバイダーに転送されることもありません。フィールドを省略すると、既存のポーリングフローがそのまま使われます。

送信先は公開 HTTPS URL である必要があります。SandBase は、completed、failed、timeout、cancelled の場合に、下記の Model 終了エンベロープを `Content-Type: application/json` と `X-Event-ID` 付きで送信します。失敗した配信はリトライされる場合があるため、`id` または `X-Event-ID` で重複を排除し、すぐに 2xx を返してください。

タスク単位のコールバックには SandBase と共有するシークレットがないため、`X-Signature` は**含まれません**。エンドポイントで HMAC 検証が必要な場合は、`webhook_url` を省略し、代わりに組織の Model Webhook を登録してください。自社システムで生成した不透明な権限トークンを HTTPS URL のクエリに含め、エンドポイントで検証することもできます。その URL は機密情報として扱ってください。

各非同期モデルタスクでは、送信先の選択は排他的です。リクエストに有効な `webhook_url` が含まれる場合、SandBase はその Prediction の終了イベントをタスク単位の URL にのみ送信し、そのイベントについては登録済みの組織 Model Webhook をすべてスキップします。リクエストで `webhook_url` を省略した場合、登録済みの組織 Model Webhook は通常どおり一致するイベントを受信します。タスク単位の配信が失敗した場合は同じタスク URL にリトライされ、登録済み Webhook にフォールバックすることはありません。この優先順位によって登録が作成、置換、無効化、変更されることはなく、他の Model イベントにも影響しません。

## イベントタイプ {#event-types}

### モデル生成 {#model-generation}

Model Webhook は、非同期の画像・動画・音声生成でのみ利用できます。同期の画像・動画・音声リクエストや同期の LLM リクエストでは発行されません。それらの結果は元の HTTP レスポンスで返されます。

| イベント | 説明 |
|---|---|
| `model.generation.completed` | 非同期の画像・動画・音声生成が完了しました。 |
| `model.generation.failed` | 非同期の画像・動画・音声生成が失敗しました。 |
| `model.generation.timeout` | 非同期の画像・動画・音声生成がタイムアウトしました。 |
| `model.generation.cancelled` | 非同期の画像・動画・音声生成がキャンセルされました。 |

## 配信ペイロード {#delivery-payload}

SandBase は `Content-Type: application/json` と以下の JSON エンベロープを送信します。`data` はイベントごとに異なり、今後フィールドが追加される可能性があります。

### モデル完了の例 {#model-completion-example}

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

失敗イベントとタイムアウトイベントには outputs が含まれず、サニタイズされたエラーカテゴリのみが含まれます。

| フィールド | 説明 |
|---|---|
| `id` | 一意のイベント ID。これまたは `X-Event-ID` を冪等キーとして使用してください。 |
| `resourceType` | `model`。 |
| `resourceID` | 対象の Prediction ID。 |
| `type` | 上記の表のイベントタイプ。 |
| `data` | イベント固有のデータ。 |
| `createdAt` | RFC 3339 UTC 形式のイベント作成日時。 |

## 登録済み Webhook の署名を検証する {#verify-a-registered-webhook-signature}

登録済み Webhook のすべての配信には、以下のヘッダーが含まれます。

| ヘッダー | 値 |
|---|---|
| `X-Event-ID` | ペイロードの `id`。 |
| `X-Signature` | `signatureSecret` をキーとした、生のリクエストボディの HMAC-SHA256（小文字の 16 進数）。 |

JSON を解析する前に、生のリクエストバイトに対して署名を検証してください。タスク単位の `webhook_url` コールバックにはこのヘッダーが含まれないため、この検証フローは使用できません。以下のハンドラーは登録済み Webhook 用で、まず検証し、次に解析し、`id` を冪等キーとして使用し、処理を非同期関数に渡します。プレースホルダーのキュー呼び出しは、独自の永続キューまたはワーカーに置き換えてください。

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

HMAC の入力は生のボディそのものです。計算前に JSON パーサーを呼び出したり、ペイロードを再シリアライズしたりしないでください。

```text
X-Signature = hex(HMAC-SHA256(signatureSecret, rawRequestBody))
```

## 配信の動作 {#delivery-behavior}

- 10 秒以内に `2xx` 範囲のレスポンスを返すと成功です。
- ネットワークエラー、タイムアウト、2xx 以外のレスポンスは失敗です。既存のイベントディスパッチャーは失敗した配信をリトライする場合があるため、受信側は重複配信を許容する必要があります。
- 永続的に受け付けた後に 2xx レスポンスを返し、時間のかかる処理は非同期で実行してください。例では実行可能な状態を保つためにメモリ内の重複排除のみを使用していますが、本番の受信側ではデータベースの一意キーまたは永続キューに置き換える必要があります。exactly-once 配信やイベントの順序を前提にしないでください。
