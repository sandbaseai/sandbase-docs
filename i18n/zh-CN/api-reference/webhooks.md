---
i18nSource: efd4d5f7b8980661
title: Webhooks
description: 注册和管理用于异步模型事件的 SandBase webhook。
---

# Webhooks {#webhooks}

SandBase 支持两种出站回调方式：

- **已注册的 webhook** 作用于你的组织，订阅异步模型事件，并带有 HMAC `X-Signature`。
- **单任务模型回调**在单个异步图像、视频或音频请求上使用 `webhook_url`。无需注册，也不带 `X-Signature`。

两种方式都采用至少一次投递。请使用事件 ID 让处理程序保持幂等。

## 注册 webhook {#register-a-webhook}

Events API 是面向 API 密钥的公开接口：

```text
POST https://api.sandbase.ai/events/webhooks
```

你也可以在 [Console Webhooks 页面](https://www.sandbase.ai/console/webhooks)创建和管理 webhook。

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

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| `name` | string | 是 | 便于识别的名称。 |
| `url` | string | 是 | 有效的 HTTP(S) 端点。生产环境请使用 HTTPS。 |
| `resourceType` | `model` | 是 | 选择下文的异步模型事件。`model` 是唯一支持的值。 |
| `events` | string[] | 否 | 为空或省略表示订阅所选资源类型下当前及未来的所有事件。 |
| `enabled` | boolean | 否 | 默认为 `true`。 |
| `signatureSecret` | string | 否 | 省略此字段时，SandBase 会生成一个高熵密钥。已有客户端可以继续提供自己的非空值。 |

`session`、`sandbox` 和 `template` 资源类型已停用：使用其中任何一种创建 webhook 都会返回 HTTP 400。这些类型的已有注册仍会列出以便清理：对它们执行 `PATCH` 会返回 HTTP 400，除非同一请求将 `resourceType` 改为 `model`（且得到的订阅有效），因此请删除它们或将其转换为 `model`。`model` 订阅仅适用于下文列出的异步图像、视频和音频终态事件。API 会拒绝其他资源类型的事件和未知的事件名称。

### 成功响应 {#successful-response}

Events API 直接返回已注册的 webhook。最终的 `signatureSecret` 只会出现在这次创建响应中。请立即妥善保存：列表和编辑响应都不会返回它，之后也无法找回。

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

[Console Webhooks 页面](https://www.sandbase.ai/console/webhooks)会在注册后显示一次生成的密钥，并要求你在关闭对话框之前保存。

### 列出、编辑和删除 {#list-edit-and-delete}

```text
GET    https://api.sandbase.ai/events/webhooks
PATCH  https://api.sandbase.ai/events/webhooks/{webhookID}
DELETE https://api.sandbase.ai/events/webhooks/{webhookID}
```

使用相同的 API 密钥认证。`PATCH` 可以包含 `name`、`url`、`resourceType`、`events` 和 `enabled` 中的一个或多个；省略的字段保持不变。最终得到的完整 `resourceType` 和 `events` 订阅必须有效。空的 `events` 数组仍表示该资源类型下的所有事件。

```bash
curl -X PATCH https://api.sandbase.ai/events/webhooks/wh_01... \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["model.generation.completed", "model.generation.timeout"],
    "enabled": true
  }'
```

`signatureSecret` 无法通过 `PATCH` 查看或修改；包含该字段的请求会被拒绝。如果密钥丢失，请删除并重新创建 webhook。你也可以在 [Console Webhooks 页面](https://www.sandbase.ai/console/webhooks)查看、编辑、启用或停用以及删除注册。

`GET` 返回 webhook 的 JSON 数组（不含 `signatureSecret`），`PATCH` 返回更新后的 webhook，`DELETE`
返回 `204 No Content`。

### 认证与错误 {#authentication-and-errors}

Events API 接受以 `Authorization: Bearer $SANDBASE_API_KEY` 或 `X-API-Key: $SANDBASE_API_KEY` 形式提供的 API 密钥。
两者同时发送时，使用 Bearer 请求头。

错误使用独立的响应体，并在 `code` 中重复 HTTP 状态码：

```json
{"code": 400, "message": "resourceType must be \"model\""}
```

请根据 HTTP 状态码分支处理。`401` 表示密钥缺失、无效或已吊销；`400` 表示请求体或
订阅无效；`404`（`webhook not found`）表示该 webhook 在你的组织中不存在。

## 单任务模型回调 {#per-task-model-callback}

对于单个异步图像、视频或音频任务，可以在 `POST /v1/run` 中添加 `webhook_url`，而无需注册新的 webhook：

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

只有当所选模型为图像、视频或音频，且请求最终以异步方式执行时，才会解析和校验该字段。此时它必须是非空字符串，且为有效、安全的公开 HTTPS URL；否则请求返回 HTTP 400。对于同步、流式、LLM 或其他不支持的请求，无论 JSON 值是什么，SandBase 都会忽略 `webhook_url`：不会安排回调、不会存储回调 URL，也不会将该字段转发给模型服务商。省略该字段时，保持现有的轮询流程。

目标必须是公开的 HTTPS URL。对于 completed、failed、timeout 或 cancelled，SandBase 会发送与下文相同的模型终态信封，并带有 `Content-Type: application/json` 和 `X-Event-ID`。投递失败时可能会重试，因此请按 `id` 或 `X-Event-ID` 去重，并尽快返回 2xx。

单任务回调没有共享的 SandBase 密钥，因此**不**包含 `X-Signature`。如果你的端点需要 HMAC 校验，请省略 `webhook_url`，改为注册组织级模型 Webhook。你可以在 HTTPS URL 的查询参数中放置由你自己系统生成的不透明能力令牌，并在端点中校验。请将该 URL 视为敏感信息。

对于每个异步模型任务，目标选择是互斥的。如果请求包含有效的 `webhook_url`，SandBase 只会将该 Prediction 的终态事件发送到单任务 URL，并跳过该事件的所有已注册组织级模型 Webhook。如果请求省略 `webhook_url`，已注册的组织级模型 Webhook 会照常接收匹配的事件。单任务投递失败时会重试同一个任务 URL，永远不会回退到已注册的 webhook。这一优先级不会创建、替换、停用或修改任何注册，也不影响其他模型事件。

## 事件类型 {#event-types}

### 模型生成 {#model-generation}

模型 webhook 仅适用于异步图像、视频和音频生成。同步的图像/视频/音频请求以及任何同步 LLM 请求都不会触发：这些结果由原始 HTTP 响应返回。

| 事件 | 说明 |
|---|---|
| `model.generation.completed` | 异步图像、视频或音频生成已完成。 |
| `model.generation.failed` | 异步图像、视频或音频生成失败。 |
| `model.generation.timeout` | 异步图像、视频或音频生成超时。 |
| `model.generation.cancelled` | 异步图像、视频或音频生成已取消。 |

## 投递载荷 {#delivery-payload}

SandBase 发送 `Content-Type: application/json` 以及以下 JSON 信封。`data` 因事件而异，并可能随时间增加字段。

### 模型完成示例 {#model-completion-example}

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

失败和超时事件不包含输出，只包含经过脱敏的错误类别。

| 字段 | 说明 |
|---|---|
| `id` | 唯一事件 ID。请将它或 `X-Event-ID` 用作幂等键。 |
| `resourceType` | `model`。 |
| `resourceID` | 相关的 Prediction ID。 |
| `type` | 上表中的事件类型。 |
| `data` | 事件相关数据。 |
| `createdAt` | 事件创建时间，RFC 3339 UTC 格式。 |

## 校验已注册 webhook 的签名 {#verify-a-registered-webhook-signature}

每次已注册 webhook 的投递都包含以下请求头：

| 请求头 | 值 |
|---|---|
| `X-Event-ID` | 载荷中的 `id`。 |
| `X-Signature` | 以 `signatureSecret` 为密钥、对原始请求体计算的 HMAC-SHA256，小写十六进制。 |

请在解析 JSON 之前，基于原始请求字节校验签名。单任务 `webhook_url` 回调不包含此请求头，无法使用此校验流程。以下处理程序适用于已注册的 webhook：先校验、再解析，使用 `id` 作为幂等键，并将工作交给异步函数处理。请将占位的队列调用替换为你自己的持久化队列或 worker。

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

HMAC 的输入是原样的原始请求体。计算前不要调用 JSON 解析器，也不要重新序列化载荷。

```text
X-Signature = hex(HMAC-SHA256(signatureSecret, rawRequestBody))
```

## 投递行为 {#delivery-behavior}

- 10 秒内返回 `2xx` 范围的响应即视为成功。
- 网络错误、超时和非 2xx 响应均视为失败。现有的事件分发器可能会重试失败的投递；接收方必须能容忍重复投递。
- 在持久化接收后返回 2xx 响应，再异步执行耗时的工作。示例仅为保持可运行而使用了内存去重；生产环境的接收方必须将其替换为数据库唯一键或持久化队列。不要假设投递恰好一次或事件有序。
