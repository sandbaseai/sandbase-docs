---
i18nSource: efd4d5f7b8980661
title: Webhooks
description: 비동기 모델 이벤트용 SandBase webhook을 등록하고 관리합니다.
---

# Webhooks {#webhooks}

SandBase는 두 가지 아웃바운드 콜백 모드를 지원합니다.

- **등록된 webhook**은 조직 범위로 동작하며, 비동기 Model 이벤트를 구독하고 HMAC `X-Signature`를 포함합니다.
- **작업별 모델 콜백**은 비동기 이미지, 동영상, 오디오 요청 하나에 `webhook_url`을 사용합니다. 등록이 필요 없으며 `X-Signature`를 포함하지 않습니다.

두 모드 모두 최소 1회 전달(at-least-once)을 사용합니다. 이벤트 ID를 사용해 핸들러를 멱등적으로 만드세요.

## webhook 등록하기 {#register-a-webhook}

Events API는 API 키로 사용하는 공개 인터페이스입니다.

```text
POST https://api.sandbase.ai/events/webhooks
```

[Console Webhooks 페이지](https://www.sandbase.ai/console/webhooks)에서 webhook을 생성하고 관리할 수도 있습니다.

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

| 필드 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| `name` | string | 예 | 사람이 읽을 수 있는 이름. |
| `url` | string | 예 | 유효한 HTTP(S) 엔드포인트. 프로덕션에서는 HTTPS를 사용하세요. |
| `resourceType` | `model` | 예 | 아래의 비동기 Model 이벤트를 선택합니다. 지원되는 값은 `model`뿐입니다. |
| `events` | string[] | 아니요 | 비어 있거나 생략하면 선택한 리소스 유형의 현재 및 향후 모든 이벤트를 의미합니다. |
| `enabled` | boolean | 아니요 | 기본값은 `true`입니다. |
| `signatureSecret` | string | 아니요 | 이 필드를 생략하면 SandBase가 엔트로피가 높은 시크릿을 생성합니다. 기존 클라이언트는 비어 있지 않은 자체 값을 계속 제공할 수 있습니다. |

`session`, `sandbox`, `template` 리소스 유형은 지원이 종료되었으며, 이 중 하나로 webhook을 생성하면 HTTP 400을 반환합니다. 이러한 유형의 기존 등록은 정리할 수 있도록 목록에 표시됩니다. 같은 요청에서 `resourceType`을 `model`로 변경하고 결과 구독이 유효하지 않은 한 이들에 대한 `PATCH`는 HTTP 400을 반환하므로, 삭제하거나 `model`로 전환하세요. `model` 구독은 아래에 나열된 비동기 이미지, 동영상, 오디오 최종 이벤트에만 사용할 수 있습니다. API는 다른 리소스 유형의 이벤트와 알 수 없는 이벤트 이름을 거부합니다.

### 성공 응답 {#successful-response}

Events API는 등록된 webhook을 그대로 반환합니다. 최종 `signatureSecret`은 이 생성 응답에만 포함됩니다. 지금 안전하게 저장하세요. 목록 및 편집 응답에서는 반환되지 않으며 나중에 복구할 수 없습니다.

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

[Console Webhooks 페이지](https://www.sandbase.ai/console/webhooks)는 등록 후 생성된 시크릿을 한 번 보여 주며, 대화 상자를 닫기 전에 저장해야 합니다.

### 목록 조회, 편집, 삭제 {#list-edit-and-delete}

```text
GET    https://api.sandbase.ai/events/webhooks
PATCH  https://api.sandbase.ai/events/webhooks/{webhookID}
DELETE https://api.sandbase.ai/events/webhooks/{webhookID}
```

같은 API 키 인증을 사용합니다. `PATCH`에는 `name`, `url`, `resourceType`, `events`, `enabled` 중 하나 이상을 포함할 수 있으며, 생략한 필드는 변경되지 않습니다. 최종적으로 적용되는 `resourceType`과 `events` 구독 전체가 유효해야 합니다. 빈 `events` 배열은 여전히 해당 리소스 유형의 모든 이벤트를 의미합니다.

```bash
curl -X PATCH https://api.sandbase.ai/events/webhooks/wh_01... \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["model.generation.completed", "model.generation.timeout"],
    "enabled": true
  }'
```

`signatureSecret`은 `PATCH`로 조회하거나 변경할 수 없으며, 이를 포함한 요청은 거부됩니다. 시크릿을 분실했다면 webhook을 삭제하고 다시 생성하세요. [Console Webhooks 페이지](https://www.sandbase.ai/console/webhooks)에서 등록을 조회, 편집, 활성화 또는 비활성화, 삭제할 수도 있습니다.

`GET`은 webhook의 JSON 배열(`signatureSecret` 제외)을 반환하고, `PATCH`는 업데이트된 webhook을 반환하며, `DELETE`는
`204 No Content`를 반환합니다.

### 인증과 오류 {#authentication-and-errors}

Events API는 API 키를 `Authorization: Bearer $SANDBASE_API_KEY` 또는 `X-API-Key: $SANDBASE_API_KEY`로 받습니다. 둘 다
보내면 Bearer 헤더가 사용됩니다.

오류는 별도의 본문 형식을 사용하며, `code`에 HTTP 상태가 반복됩니다.

```json
{"code": 400, "message": "resourceType must be \"model\""}
```

HTTP 상태를 기준으로 분기하세요. `401`은 키가 없거나 유효하지 않거나 폐기되었음을, `400`은 요청 본문이나
구독이 유효하지 않음을, `404`(`webhook not found`)는 조직에 해당 webhook이 없음을 의미합니다.

## 작업별 모델 콜백 {#per-task-model-callback}

비동기 이미지, 동영상, 오디오 작업 하나에 대해서는 새 webhook을 등록하는 대신 `POST /v1/run`에 `webhook_url`을 추가하세요.

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

이 필드는 선택한 모델이 이미지, 동영상, 오디오이고 요청이 비동기 실행으로 처리될 때만 파싱 및 검증됩니다. 이 경우 유효하고 안전한 공개 HTTPS URL을 담은 비어 있지 않은 문자열이어야 하며, 그렇지 않으면 요청은 HTTP 400을 반환합니다. 동기식, 스트리밍, LLM 또는 기타 지원되지 않는 요청에서는 JSON 값과 관계없이 SandBase가 `webhook_url`을 무시합니다. 콜백을 예약하지 않고, 콜백 URL을 저장하지 않으며, 모델 제공업체에 이 필드를 전달하지 않습니다. 이 필드를 생략하면 기존 폴링 흐름이 유지됩니다.

대상은 공개 HTTPS URL이어야 합니다. SandBase는 completed, failed, timeout, cancelled에 대해 아래에 설명된 것과 동일한 Model 최종 이벤트 envelope를 `Content-Type: application/json` 및 `X-Event-ID`와 함께 보냅니다. 실패한 전달은 재시도될 수 있으므로 `id` 또는 `X-Event-ID`로 중복을 제거하고 2xx를 빠르게 반환하세요.

작업별 콜백에는 공유 SandBase 시크릿이 없으므로 `X-Signature`를 **포함하지 않습니다**. 엔드포인트에서 HMAC 검증이 필요하다면 `webhook_url`을 생략하고 조직 Model Webhook을 등록하세요. 자체 시스템에서 생성한 불투명한 capability 토큰을 HTTPS URL 쿼리에 넣고 엔드포인트에서 검증할 수도 있습니다. 이 URL은 민감 정보로 취급하세요.

각 비동기 모델 작업에서 대상 선택은 배타적입니다. 요청에 유효한 `webhook_url`이 포함되어 있으면 SandBase는 해당 Prediction의 최종 이벤트를 작업별 URL로만 보내고, 그 이벤트에 대해서는 등록된 모든 조직 Model Webhook을 건너뜁니다. 요청에 `webhook_url`이 없으면 등록된 조직 Model Webhook이 일치하는 이벤트를 평소처럼 계속 받습니다. 작업별 전달이 실패하면 같은 작업 URL로 재시도하며, 등록된 webhook으로 대체 전송하지 않습니다. 이 우선순위는 등록을 생성, 교체, 비활성화, 수정하지 않으며 다른 Model 이벤트에도 영향을 주지 않습니다.

## 이벤트 유형 {#event-types}

### 모델 생성 {#model-generation}

Model webhook은 비동기 이미지, 동영상, 오디오 생성에만 사용할 수 있습니다. 동기식 이미지/동영상/오디오 요청이나 동기식 LLM 요청에서는 발생하지 않으며, 이러한 결과는 원래 HTTP 응답으로 반환됩니다.

| 이벤트 | 설명 |
|---|---|
| `model.generation.completed` | 비동기 이미지, 동영상, 오디오 생성이 완료되었습니다. |
| `model.generation.failed` | 비동기 이미지, 동영상, 오디오 생성이 실패했습니다. |
| `model.generation.timeout` | 비동기 이미지, 동영상, 오디오 생성이 시간 초과되었습니다. |
| `model.generation.cancelled` | 비동기 이미지, 동영상, 오디오 생성이 취소되었습니다. |

## 전달 페이로드 {#delivery-payload}

SandBase는 `Content-Type: application/json`과 다음 JSON envelope를 보냅니다. `data`는 이벤트마다 다르며 시간이 지나면서 필드가 추가될 수 있습니다.

### 모델 완료 예시 {#model-completion-example}

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

실패 및 시간 초과 이벤트에는 출력이 없으며, 정제된 오류 범주만 포함됩니다.

| 필드 | 설명 |
|---|---|
| `id` | 고유한 이벤트 ID. 이 값이나 `X-Event-ID`를 멱등성 키로 사용하세요. |
| `resourceType` | `model`. |
| `resourceID` | 영향을 받은 Prediction ID. |
| `type` | 위 표의 이벤트 유형. |
| `data` | 이벤트별 데이터. |
| `createdAt` | RFC 3339 UTC 형식의 이벤트 생성 시간. |

## 등록된 webhook 서명 검증하기 {#verify-a-registered-webhook-signature}

등록된 webhook의 모든 전달에는 다음 헤더가 포함됩니다.

| 헤더 | 값 |
|---|---|
| `X-Event-ID` | 페이로드의 `id`. |
| `X-Signature` | `signatureSecret`을 키로 사용한 원시 요청 본문의 HMAC-SHA256 값(소문자 16진수). |

JSON을 파싱하기 전에 원시 요청 바이트로 서명을 검증하세요. 작업별 `webhook_url` 콜백에는 이 헤더가 없으므로 이 검증 흐름을 사용할 수 없습니다. 다음 핸들러는 등록된 webhook용입니다. 먼저 검증하고, 그다음 파싱하며, `id`를 멱등성 키로 사용하고, 작업을 비동기 함수에 넘깁니다. 자리 표시자 큐 호출은 자체 영속 큐나 워커로 바꾸세요.

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

HMAC 입력은 정확한 원시 본문입니다. 계산하기 전에 JSON 파서를 호출하거나 페이로드를 다시 직렬화하지 마세요.

```text
X-Signature = hex(HMAC-SHA256(signatureSecret, rawRequestBody))
```

## 전달 동작 {#delivery-behavior}

- 10초 이내에 `2xx` 범위의 응답을 받으면 성공입니다.
- 네트워크 오류, 시간 초과, 2xx가 아닌 응답은 실패입니다. 기존 이벤트 디스패처가 실패한 전달을 재시도할 수 있으므로 수신 측은 중복 전달을 처리할 수 있어야 합니다.
- 영속적으로 수신을 확정한 뒤 2xx 응답을 반환하고, 오래 걸리는 작업은 비동기로 처리하세요. 예시는 실행 가능한 상태를 유지하기 위해 메모리 내 중복 제거만 사용합니다. 프로덕션 수신 측에서는 이를 데이터베이스 고유 키나 영속 큐로 대체해야 합니다. 정확히 1회 전달이나 이벤트 순서를 가정하지 마세요.
