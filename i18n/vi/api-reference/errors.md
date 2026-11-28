---
i18nSource: ac4e3b9b9eef4c7d
title: Lỗi API
description: Xử lý lỗi SandBase API theo trạng thái HTTP, nhóm endpoint, dạng response được mô tả và mức an toàn khi thử lại.
---

# Lỗi API {#api-errors}

SandBase dùng mã trạng thái HTTP tiêu chuẩn, nhưng không có một body lỗi chung cho mọi endpoint. Hãy rẽ nhánh theo trạng thái HTTP trước, sau đó phân tích response theo schema được mô tả cho endpoint bạn đã gọi. Đừng giả định mọi lỗi đều chứa `code`, `param`, `message` hoặc `request_id`.

## Dạng response {#response-shapes}

Middleware lõi và một số endpoint `/v1/*` trả về lỗi dạng phẳng:

```json
{"error":"organization rate limit exceeded"}
```

Các tài nguyên của nền tảng Agents (`/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*`) trả về đối tượng theo kiểu OpenAI với `code` ổn định. Xem [Lỗi nền tảng Agents](#agents-platform-errors):

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

Webhook Events API (`/events/webhooks*`) trả về `{"code":<http status>,"message":"..."}`. Xem [Webhooks](/api-reference/webhooks#authentication-and-errors).

Các endpoint tương thích OpenAI giữ envelope tương thích OpenAI. `POST /v1/messages` giữ envelope tương thích Anthropic:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

Hãy dùng [đặc tả OpenAPI](/openapi.yaml) để biết chính xác mã trạng thái và schema của từng thao tác công khai.

## Xử lý trạng thái HTTP {#http-status-handling}

| Trạng thái | Ý nghĩa thường gặp | Việc client cần làm |
|---|---|---|
| `400` | Đầu vào không hợp lệ hoặc tham số không được hỗ trợ | Sửa request theo schema của endpoint và model đã chọn. |
| `401` | Thiếu thông tin xác thực, hoặc thông tin không hợp lệ, đã bị thu hồi hay hết hạn | Thay thế hoặc xoay vòng thông tin xác thực; không thử lại nguyên trạng. |
| `402` | Request không đủ tiền để thực hiện hoặc đã chạm hạn mức chi tiêu | Xử lý số dư hoặc hạn mức của key trước khi thử lại. |
| `403` | Thông tin xác thực thiếu quyền, hoặc một endpoint tương thích ánh xạ lỗi chi tiêu thành 403 | Kiểm tra envelope riêng của endpoint và dùng key có quyền. |
| `404` | Model hoặc tài nguyên không khả dụng với bên gọi | Kiểm tra lại ID model hoặc ID tài nguyên hiện tại. |
| `409` | Xung đột trạng thái tài nguyên | Đọc trạng thái mới nhất trước khi quyết định có nên thử lại hay không. |
| `422` | Đầu vào tài nguyên không hợp lệ về mặt ngữ nghĩa | Sửa giá trị các trường theo tài liệu. |
| `429` | Giới hạn request của tổ chức hoặc giới hạn đồng thời của video | Thử lại với backoff có giới hạn và jitter khi thao tác có thể lặp lại an toàn. |
| `500`, `502`, `503`, `504` | Lỗi của SandBase hoặc upstream | Chỉ thử lại khi thao tác có thể lặp lại an toàn. |

Không phải endpoint nào cũng mô tả mọi trạng thái trong bảng này. Bản đồ response OpenAPI của thao tác là nguồn chính xác.

## Lỗi xác thực {#authentication-errors}

Các thông báo xác thực được mô tả gồm:

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

Key có phạm vi khi được dùng ngoài phạm vi sẽ trả về `403` với body lồng nhau: `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`. Các tài nguyên nền tảng Agents trả về cùng `code` đó trong envelope riêng của chúng.

Dùng `Authorization: Bearer $SANDBASE_API_KEY` cho các endpoint tiêu chuẩn. `POST /v1/messages` cũng chấp nhận `x-api-key`; các endpoint tương thích giao thức Google có mô tả riêng về header key được hỗ trợ.

Key đã bị thu hồi không thể bật lại. Hãy tạo key thay thế, cập nhật ứng dụng sử dụng key, kiểm tra, rồi xóa mọi tham chiếu còn lại đến key cũ.

## Giới hạn tốc độ {#rate-limits}

`organization rate limit exceeded` (`429`) nghĩa là tổ chức của bạn đã chạm giới hạn số request mỗi phút được cấp, giới hạn này dùng chung cho mọi API key của tổ chức. Các endpoint tương thích giao thức trả về lỗi này trong envelope riêng. SandBase không công bố một con số giới hạn chung vì giới hạn được cấp theo từng tổ chức.

Nếu response có `Retry-After`, hãy tuân theo giá trị đó. Nếu không, hãy dùng exponential backoff có giới hạn kèm jitter. Xem [Giới hạn tốc độ](/guides/rate-limiting) để biết các cách làm mượt request.

Việc gửi tác vụ có thêm hai bước kiểm tra. `organization concurrency limit exceeded` (`429`) nghĩa là tổ chức của bạn đã có số tác vụ đang chạy bằng mức cấp tài khoản cho phép; lỗi sẽ hết khi một tác vụ đang chạy hoàn thành. Kiểm tra này áp dụng cho mọi loại model trên `POST /v1/run` và `/v1/api/*`, và cho việc gửi video trên các endpoint khác. `insufficient credit for estimated video cost` (`402`) nghĩa là chi phí ước tính lớn hơn số dư cộng hạn mức credit của bạn; hãy nạp tiền trước khi thử lại. Xem [Giới hạn đồng thời](/guides/concurrency-limits).

## An toàn khi thử lại {#retry-safety}

Hãy quyết định theo thứ tự sau:

1. Xác định thao tác đã tạo ra tác động nhìn thấy được từ bên ngoài hay chưa.
2. Không thử lại nguyên trạng các request `400`, `401`, `402`, `403`, `404` hoặc `422`.
3. Với `409`, hãy đọc trạng thái hiện tại của tài nguyên trước khi thử lại.
4. Chỉ thử lại response `429` và `5xx` tạm thời với số lần nhỏ, có giới hạn.
5. Trước khi lặp lại request tạo, kích hoạt, tải lên hoặc thực hiện hành động bên ngoài, hãy xác nhận thao tác là idempotent hoặc ứng dụng của bạn có thể đối soát bản trùng lặp.

Độ trễ phù hợp là:

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

## Lỗi nền tảng Agents {#agents-platform-errors}

Agents, Sessions, Skills, kết nối MCP và Secrets trả về cùng một envelope. Với hầu hết mã lỗi, `message` là một câu cố định và an toàn; `invalid_request` có thể kèm giải thích ngắn, chẳng hạn dạng đầu vào hoặc tùy chọn nào không được hỗ trợ. Hãy rẽ nhánh theo `code`, không theo `message`.

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type` là `authentication_error` với 401, `server_error` với 5xx và `invalid_request_error` trong các trường hợp còn lại.

| HTTP | `code` | Ý nghĩa | Cách xử lý |
|---|---|---|---|
| 400 | `invalid_request` | Trường sai định dạng hoặc không xác định, xác thực thất bại, hoặc tùy chọn không được hỗ trợ | Sửa request; không thử lại nguyên trạng |
| 400 | `skill_not_found` | Skill hoặc phiên bản được tham chiếu không khả dụng | Sửa `skills` của Agent |
| 401 | `unauthorized` | Header API key bị thiếu, không hợp lệ hoặc xung đột | Kiểm tra `Authorization` / `X-API-Key` |
| 402 | `spending_limit_exceeded` | Đã hết hạn mức chi tiêu của key hoặc số dư của tổ chức | Nạp thêm credit hoặc tăng hạn mức |
| 403 | `insufficient_scope` | Key có phạm vi và không thể dùng tài nguyên Agents | Dùng key tiêu chuẩn được tạo trong Console |
| 403 | `org_disabled` | Tổ chức không được phép chạy Agents | Liên hệ bộ phận hỗ trợ |
| 404 | `not_found` | Tài nguyên không tồn tại trong tổ chức của bạn | Kiểm tra ID |
| 409 | `conflict` | `row_version` đã cũ, trạng thái không cho phép thay đổi, hoặc `Idempotency-Key` được dùng lại với body khác | Đọc lại tài nguyên rồi quyết định |
| 409 | `session_input_pending` | Đầu vào trước đó vẫn đang được chuyển đi | Chờ; không gửi lại với key mới |
| 409 | `session_input_expired` | Việc tiếp nhận đầu vào đã hết hạn | Kiểm tra lịch sử trước khi gửi lại |
| 409 | `session_environment_unavailable` | Môi trường thực thi không khả dụng | Chờ hoặc tạo Session mới |
| 413 | `request_too_large` | Body của request, hoặc cấu hình Session được cố định từ body đó, vượt quá giới hạn kích thước | Gửi body nhỏ hơn; không thử lại nguyên trạng |
| 429 | `quota_exceeded` | Vượt quá hạn ngạch Agents | Thử lại sau |
| 502 | `executor_rejected`, `executor_contract_error` | Lớp thực thi từ chối request hoặc phản hồi ngoài dự kiến | Kiểm tra cấu hình Agent rồi thử lại |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | Một thành phần phụ thuộc tạm thời không khả dụng | Thử lại với backoff và cùng `Idempotency-Key` |

`skill_runtime_incompatible` cũng có thể xuất hiện; mã này được trả về dưới dạng 503 với thông báo `internal error`.

## Lỗi khi streaming {#streaming-failures}

Sau khi stream bắt đầu, lỗi có thể đến theo định dạng stream của giao thức đó thay vì dưới dạng một response HTTP mới. Hãy coi stream là chưa hoàn tất, giữ lại phần đầu ra từng phần mà ứng dụng cần, và chỉ thử lại khi việc tạo lại request là an toàn. Đừng giả định mọi nhà cung cấp đều phát ra cùng một sự kiện kết thúc hoặc finish reason.

## Gỡ lỗi khi vận hành {#operational-debugging}

Hãy ghi lại endpoint, trạng thái HTTP, ID model hoặc tài nguyên đã chọn, thời điểm và mọi mã định danh request an toàn mà server trả về. Không bao giờ ghi log header xác thực, API key, giá trị thông tin xác thực hoặc nội dung prompt nhạy cảm.

Dùng [Developer → Activities](https://www.sandbase.ai/console/activities) để xem lịch sử request của tổ chức. Khi báo cáo lỗi kéo dài, hãy kèm metadata request đã được làm sạch và request nhỏ nhất có thể tái hiện lỗi.

## Xem thêm {#see-also}

- [Xác thực](/api-reference/authentication)
- [Lỗi và thử lại](/guides/error-handling)
- [Giới hạn tốc độ](/guides/rate-limiting)
- [Hướng dẫn lỗi cho AI](/for-agents/errors)
