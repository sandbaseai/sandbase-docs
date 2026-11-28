---
i18nSource: efd4d5f7b8980661
title: Webhooks
description: Đăng ký và quản lý webhook SandBase cho các sự kiện model bất đồng bộ.
---

# Webhooks {#webhooks}

SandBase hỗ trợ hai chế độ callback gửi đi:

- **Webhook đã đăng ký** thuộc phạm vi tổ chức của bạn, đăng ký nhận các sự kiện Model bất đồng bộ và có kèm HMAC `X-Signature`.
- **Callback model theo từng tác vụ** dùng `webhook_url` trên một yêu cầu ảnh, video hoặc âm thanh bất đồng bộ. Chúng không cần đăng ký và không có `X-Signature`.

Cả hai chế độ đều giao ít nhất một lần (at-least-once). Hãy làm cho handler idempotent bằng event ID.

## Đăng ký webhook {#register-a-webhook}

Events API là giao diện công khai dùng API key:

```text
POST https://api.sandbase.ai/events/webhooks
```

Bạn cũng có thể tạo và quản lý webhook từ [trang Webhooks của Console](https://www.sandbase.ai/console/webhooks).

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

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---:|---|
| `name` | string | Có | Tên dễ đọc. |
| `url` | string | Có | Một endpoint HTTP(S) hợp lệ. Dùng HTTPS trong môi trường production. |
| `resourceType` | `model` | Có | Chọn các sự kiện Model bất đồng bộ bên dưới. `model` là giá trị duy nhất được hỗ trợ. |
| `events` | string[] | Không | Rỗng hoặc bỏ qua nghĩa là mọi sự kiện hiện tại và tương lai trong loại tài nguyên đã chọn. |
| `enabled` | boolean | Không | Mặc định là `true`. |
| `signatureSecret` | string | Không | Bỏ qua trường này để SandBase tạo một secret có entropy cao. Các client hiện có vẫn có thể tiếp tục cung cấp giá trị không rỗng của riêng họ. |

Các loại tài nguyên `session`, `sandbox` và `template` đã ngừng sử dụng: tạo webhook với bất kỳ loại nào trong số đó sẽ trả về HTTP 400. Các đăng ký hiện có thuộc những loại này vẫn được liệt kê để dọn dẹp: `PATCH` trên chúng trả về HTTP 400 trừ khi cùng request đó đổi `resourceType` thành `model` (và đăng ký kết quả là hợp lệ), vì vậy hãy xóa chúng hoặc chuyển chúng sang `model`. Đăng ký `model` chỉ khả dụng cho các sự kiện kết thúc của ảnh, video và âm thanh bất đồng bộ được liệt kê bên dưới. API từ chối sự kiện thuộc loại tài nguyên khác và tên sự kiện không xác định.

### Phản hồi thành công {#successful-response}

Events API trả về trực tiếp webhook đã đăng ký. `signatureSecret` cuối cùng chỉ có trong phản hồi tạo này. Hãy lưu nó an toàn ngay bây giờ: phản hồi liệt kê và chỉnh sửa không bao giờ trả về nó, và không thể khôi phục nó sau này.

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

[Trang Webhooks của Console](https://www.sandbase.ai/console/webhooks) hiển thị secret được tạo một lần sau khi đăng ký và yêu cầu bạn lưu nó trước khi đóng hộp thoại.

### Liệt kê, chỉnh sửa và xóa {#list-edit-and-delete}

```text
GET    https://api.sandbase.ai/events/webhooks
PATCH  https://api.sandbase.ai/events/webhooks/{webhookID}
DELETE https://api.sandbase.ai/events/webhooks/{webhookID}
```

Dùng cùng cách xác thực bằng API key. Một `PATCH` có thể chứa một hoặc nhiều trường `name`, `url`, `resourceType`, `events` và `enabled`; các trường bị bỏ qua giữ nguyên. Đăng ký `resourceType` và `events` hoàn chỉnh sau khi cập nhật phải hợp lệ. Mảng `events` rỗng vẫn có nghĩa là mọi sự kiện trong loại tài nguyên đó.

```bash
curl -X PATCH https://api.sandbase.ai/events/webhooks/wh_01... \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["model.generation.completed", "model.generation.timeout"],
    "enabled": true
  }'
```

Không thể xem hoặc thay đổi `signatureSecret` qua `PATCH`; request chứa trường này sẽ bị từ chối. Nếu mất secret, hãy xóa và tạo lại webhook. Bạn cũng có thể xem, chỉnh sửa, bật hoặc tắt và xóa đăng ký từ [trang Webhooks của Console](https://www.sandbase.ai/console/webhooks).

`GET` trả về một mảng JSON các webhook (không có `signatureSecret`), `PATCH` trả về webhook đã cập nhật, và `DELETE`
trả về `204 No Content`.

### Xác thực và lỗi {#authentication-and-errors}

Events API chấp nhận API key dưới dạng `Authorization: Bearer $SANDBASE_API_KEY` hoặc `X-API-Key: $SANDBASE_API_KEY`. Khi
gửi cả hai, header Bearer sẽ được dùng.

Lỗi dùng body riêng, với mã trạng thái HTTP được lặp lại trong `code`:

```json
{"code": 400, "message": "resourceType must be \"model\""}
```

Hãy rẽ nhánh theo mã trạng thái HTTP. `401` nghĩa là key bị thiếu, không hợp lệ hoặc đã bị thu hồi; `400` nghĩa là body request hoặc
đăng ký không hợp lệ; `404` (`webhook not found`) nghĩa là webhook không tồn tại trong tổ chức của bạn.

## Callback model theo từng tác vụ {#per-task-model-callback}

Với một tác vụ ảnh, video hoặc âm thanh bất đồng bộ, hãy thêm `webhook_url` vào `POST /v1/run` thay vì đăng ký webhook mới:

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

Trường này chỉ được phân tích và kiểm tra khi model được chọn là ảnh, video hoặc âm thanh và request được thực thi bất đồng bộ. Khi đó, nó phải là một chuỗi không rỗng chứa URL HTTPS công khai hợp lệ và an toàn; nếu không, request trả về HTTP 400. Với các request đồng bộ, streaming, LLM hoặc không được hỗ trợ khác, SandBase bỏ qua `webhook_url` bất kể giá trị JSON của nó: không lên lịch callback, không lưu URL callback và không chuyển trường này tới nhà cung cấp model. Bỏ qua trường này sẽ giữ nguyên luồng polling hiện có.

Đích phải là URL HTTPS công khai. SandBase gửi cùng envelope sự kiện kết thúc Model được mô tả bên dưới, với `Content-Type: application/json` và `X-Event-ID`, cho các trạng thái completed, failed, timeout hoặc cancelled. SandBase có thể thử lại lần giao thất bại, vì vậy hãy khử trùng lặp theo `id` hoặc `X-Event-ID` và trả về 2xx nhanh chóng.

Callback theo từng tác vụ không có secret SandBase dùng chung, do đó **không** có `X-Signature`. Nếu endpoint của bạn yêu cầu xác minh HMAC, hãy bỏ qua `webhook_url` và đăng ký một Model Webhook của tổ chức. Bạn có thể đặt một capability token không trong suốt do hệ thống của bạn tạo vào query của URL HTTPS và kiểm tra nó tại endpoint. Hãy coi URL đó là thông tin nhạy cảm.

Với mỗi tác vụ model bất đồng bộ, việc chọn đích là loại trừ lẫn nhau. Nếu request có `webhook_url` hợp lệ, SandBase chỉ gửi sự kiện kết thúc của Prediction đó tới URL theo tác vụ và bỏ qua mọi Model Webhook đã đăng ký của tổ chức cho sự kiện đó. Nếu request không có `webhook_url`, các Model Webhook đã đăng ký của tổ chức tiếp tục nhận sự kiện khớp như bình thường. Lần giao theo tác vụ thất bại sẽ thử lại cùng URL tác vụ và không bao giờ chuyển sang webhook đã đăng ký. Thứ tự ưu tiên này không tạo, thay thế, vô hiệu hóa hay sửa đổi đăng ký nào, và không ảnh hưởng tới các sự kiện Model khác.

## Loại sự kiện {#event-types}

### Tạo nội dung bằng model {#model-generation}

Model webhook chỉ khả dụng cho việc tạo ảnh, video và âm thanh bất đồng bộ. Chúng không được phát ra cho các request ảnh/video/âm thanh đồng bộ hay bất kỳ request LLM đồng bộ nào: kết quả của những request đó được trả về trong phản hồi HTTP ban đầu.

| Sự kiện | Mô tả |
|---|---|
| `model.generation.completed` | Một tác vụ tạo ảnh, video hoặc âm thanh bất đồng bộ đã hoàn tất. |
| `model.generation.failed` | Một tác vụ tạo ảnh, video hoặc âm thanh bất đồng bộ đã thất bại. |
| `model.generation.timeout` | Một tác vụ tạo ảnh, video hoặc âm thanh bất đồng bộ đã hết thời gian. |
| `model.generation.cancelled` | Một tác vụ tạo ảnh, video hoặc âm thanh bất đồng bộ đã bị hủy. |

## Payload được giao {#delivery-payload}

SandBase gửi `Content-Type: application/json` và envelope JSON sau. `data` phụ thuộc vào từng sự kiện và có thể được bổ sung trường theo thời gian.

### Ví dụ hoàn tất của Model {#model-completion-example}

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

Sự kiện thất bại và hết thời gian không có outputs và chỉ chứa nhóm lỗi đã được làm sạch.

| Trường | Mô tả |
|---|---|
| `id` | Event ID duy nhất. Dùng giá trị này, hoặc `X-Event-ID`, làm idempotency key. |
| `resourceType` | `model`. |
| `resourceID` | ID của Prediction bị ảnh hưởng. |
| `type` | Loại sự kiện từ bảng ở trên. |
| `data` | Dữ liệu riêng của sự kiện. |
| `createdAt` | Thời điểm tạo sự kiện theo RFC 3339 UTC. |

## Xác minh chữ ký của webhook đã đăng ký {#verify-a-registered-webhook-signature}

Mỗi lần giao webhook đã đăng ký đều có các header sau:

| Header | Giá trị |
|---|---|
| `X-Event-ID` | `id` của payload. |
| `X-Signature` | HMAC-SHA256 dạng hex chữ thường của body request thô, dùng khóa `signatureSecret`. |

Hãy xác minh chữ ký trên các byte request thô trước khi phân tích JSON. Callback `webhook_url` theo từng tác vụ không có header này và không thể dùng quy trình xác minh này. Các handler sau dành cho webhook đã đăng ký: chúng xác minh trước, phân tích sau, dùng `id` làm idempotency key và chuyển công việc cho một hàm bất đồng bộ. Hãy thay lệnh gọi hàng đợi giữ chỗ bằng hàng đợi bền vững hoặc worker của riêng bạn.

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

Đầu vào HMAC là chính xác body thô. Đừng gọi trình phân tích JSON hay tuần tự hóa lại payload trước khi tính toán.

```text
X-Signature = hex(HMAC-SHA256(signatureSecret, rawRequestBody))
```

## Hành vi giao {#delivery-behavior}

- Phản hồi trong khoảng `2xx` trong vòng 10 giây được coi là thành công.
- Lỗi mạng, hết thời gian và phản hồi không phải 2xx là thất bại. Bộ điều phối sự kiện hiện có có thể thử lại lần giao thất bại; bên nhận phải chịu được việc giao trùng lặp.
- Trả về phản hồi 2xx sau khi đã tiếp nhận bền vững, rồi thực hiện công việc chậm một cách bất đồng bộ. Các ví dụ dùng khử trùng lặp trong bộ nhớ chỉ để chạy được; bên nhận trong production phải thay bằng khóa duy nhất trong cơ sở dữ liệu hoặc hàng đợi bền vững. Đừng giả định việc giao đúng một lần hay thứ tự sự kiện.
