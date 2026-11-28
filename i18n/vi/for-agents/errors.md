---
i18nSource: 95410ff7ea741f64
title: Hướng dẫn lỗi cho AI
description: Xử lý lỗi SandBase API theo nhóm endpoint, HTTP status, mức an toàn khi thử lại và cấu trúc response được mô tả.
---

# Xử lý lỗi cho AI client {#error-handling-for-ai-clients}

SandBase không cung cấp một schema lỗi chung duy nhất. Hãy phân nhánh theo HTTP status trước, sau đó phân tích cấu trúc response
được mô tả cho nhóm endpoint đó. Đừng giả định rằng mọi response đều chứa `code`, `param`, `request_id` hoặc một
chuỗi thông báo cụ thể.

## Cấu trúc response công khai {#public-response-shapes}

Middleware `/v1/*` lõi và một số endpoint model hoặc tài nguyên trả về lỗi dạng phẳng:

```json
{"error":"organization rate limit exceeded"}
```

Các tài nguyên nền tảng Agents (`/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`,
`/v1/skills*`) trả về đối tượng kiểu OpenAI với `code` ổn định. Xem [Lỗi nền tảng Agents](#agents-platform-errors):

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

Các gateway tương thích OpenAI giữ cấu trúc lỗi tương thích OpenAI. `POST /v1/messages` giữ cấu trúc lỗi
tương thích Anthropic:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

## Xử lý HTTP status {#http-status-handling}

| Status | Ý nghĩa | Hành động của client |
|---|---|---|
| `400` | Input không hợp lệ hoặc tham số không được hỗ trợ | Sửa request theo schema của endpoint và model đã chọn. |
| `401` | Thông tin xác thực bị thiếu, không hợp lệ, đã thu hồi hoặc hết hạn | Thay thế hoặc xoay vòng thông tin xác thực; đừng thử lại khi chưa thay đổi gì. |
| `402` | Không thể thanh toán cho request hoặc đã đạt giới hạn chi tiêu | Giải quyết vấn đề thanh toán hoặc giới hạn key trước khi thử lại. |
| `403` | Thông tin xác thực không có quyền, hoặc một lớp tương thích ánh xạ lỗi chi tiêu thành 403 | Kiểm tra cấu trúc lỗi được mô tả và dùng key có quyền. |
| `404` | Không tìm thấy model hoặc tài nguyên | Xác minh tên model hoặc ID tài nguyên hiện tại. |
| `409` | Xung đột trạng thái tài nguyên | Đọc trạng thái mới nhất của tài nguyên trước khi quyết định có thể thử lại an toàn hay không. |
| `429` | Giới hạn request của tổ chức hoặc giới hạn đồng thời video | Thử lại với exponential backoff có giới hạn và jitter. |
| `500`, `502`, `503`, `504` | Lỗi tạm thời của SandBase hoặc upstream | Chỉ thử lại khi thao tác có thể lặp lại an toàn. |

## Thông báo xác thực và giới hạn tốc độ {#authentication-and-rate-limit-messages}

Các thông báo xác thực được mô tả gồm:

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

Key có phạm vi được dùng ngoài phạm vi của nó sẽ trả về `403` với body lồng nhau: `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`. Các tài nguyên nền tảng Agents trả về cùng `code` trong cấu trúc lỗi riêng của chúng.

Thông báo giới hạn tốc độ được mô tả là `organization rate limit exceeded` (giới hạn số request mỗi phút được cấp cho tổ chức,
dùng chung cho tất cả API key của tổ chức). Response `429` hiện không có header `Retry-After` hoặc
`X-RateLimit-*`, và không có giá trị mặc định RPM hay giới hạn đồng thời chung nào được công bố.

## Tra cứu model và tài nguyên {#model-and-resource-lookup}

Dùng `GET /v1/models` để tìm các ID model đang bật và `GET /v1/models/{id_or_name}` để kiểm tra một model trước khi
thực thi. Hãy coi ID tài nguyên là chuỗi mờ và xác minh nó bằng thao tác list hoặc get tương ứng. Đừng tự dựng
URL poll khác dựa trên tiền tố ID.

## Thuật toán thử lại {#retry-algorithm}

Dùng exponential backoff có giới hạn kèm jitter:

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

Áp dụng các quy tắc sau:

- thử lại `429` sau một khoảng chờ do client tính toán;
- chỉ thử lại các response `5xx` tạm thời một số lần nhỏ, có giới hạn;
- không thử lại request `400`, `401`, `402`, `403` hoặc `404` khi chưa thay đổi gì;
- kiểm tra tính idempotent trước khi lặp lại bất kỳ request tạo, kích hoạt hoặc hành động bên ngoài nào;
- giữ lại đầu ra từng phần khi stream thất bại và quyết định việc tiếp tục hay bắt đầu lại có an toàn không;
- trả về cho bên gọi HTTP status cuối cùng và lỗi đã làm sạch dành riêng cho endpoint.

## Lỗi nền tảng Agents {#agents-platform-errors}

Agents, Sessions, Skills, MCP connection và Secret trả về cùng một cấu trúc lỗi. Với hầu hết các code, `message` là một câu cố định, an toàn; `invalid_request` có thể kèm giải thích ngắn, chẳng hạn cấu trúc input hoặc tùy chọn nào không được hỗ trợ. Hãy phân nhánh theo `code`, không theo `message`.

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type` là `authentication_error` với 401, `server_error` với 5xx và `invalid_request_error` trong các trường hợp còn lại.

| HTTP | `code` | Ý nghĩa | Việc cần làm |
|---|---|---|---|
| 400 | `invalid_request` | Trường sai định dạng hoặc không xác định, kiểm tra hợp lệ thất bại hoặc tùy chọn không được hỗ trợ | Sửa request; đừng thử lại khi chưa thay đổi gì |
| 400 | `skill_not_found` | Skill hoặc phiên bản được tham chiếu không khả dụng | Sửa `skills` của Agent |
| 401 | `unauthorized` | Header API key bị thiếu, không hợp lệ hoặc xung đột | Kiểm tra `Authorization` / `X-API-Key` |
| 402 | `spending_limit_exceeded` | Đã hết giới hạn chi tiêu của key hoặc số dư của tổ chức | Nạp thêm credit hoặc tăng giới hạn |
| 403 | `insufficient_scope` | Key có phạm vi giới hạn và không thể dùng tài nguyên Agents | Dùng key tiêu chuẩn được tạo trong Console |
| 403 | `org_disabled` | Tổ chức không được phép chạy Agent | Liên hệ bộ phận hỗ trợ |
| 404 | `not_found` | Tài nguyên không tồn tại trong tổ chức của bạn | Kiểm tra ID |
| 409 | `conflict` | `row_version` đã cũ, trạng thái không cho phép thay đổi, hoặc `Idempotency-Key` được dùng lại với body khác | Đọc lại tài nguyên rồi quyết định |
| 409 | `session_input_pending` | Input trước đó vẫn đang được chuyển đi | Chờ; đừng gửi lại với key mới |
| 409 | `session_input_expired` | Việc tiếp nhận input đã hết hạn | Kiểm tra lịch sử trước khi gửi lại |
| 409 | `session_environment_unavailable` | Môi trường thực thi không khả dụng | Chờ hoặc tạo Session mới |
| 413 | `request_too_large` | Body request, hoặc cấu hình Session được cố định từ body đó, vượt quá giới hạn kích thước | Gửi body nhỏ hơn; đừng thử lại khi chưa thay đổi gì |
| 429 | `quota_exceeded` | Vượt quá hạn mức Agents | Thử lại sau |
| 502 | `executor_rejected`, `executor_contract_error` | Lớp thực thi từ chối request hoặc phản hồi không như mong đợi | Kiểm tra cấu hình Agent rồi thử lại |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | Một phụ thuộc tạm thời không khả dụng | Thử lại với backoff và cùng `Idempotency-Key` |

`skill_runtime_incompatible` cũng có thể xuất hiện; nó được trả về dưới dạng 503 với thông báo `internal error`.

## Lỗi khi streaming {#streaming-failures}

Sau khi response streaming đã bắt đầu, lỗi có thể đến theo định dạng stream của giao thức thay vì dưới dạng một
HTTP status mới. Hãy coi stream là chưa hoàn chỉnh, đóng nó, giữ lại mọi nội dung từng phần mà ứng dụng cần, và
chỉ thử lại khi request có thể lặp lại an toàn.

## Xem thêm {#see-also}

- [Mã lỗi](/api-reference/errors): định dạng response công khai và các HTTP status phổ biến
- [Giới hạn tốc độ](/guides/rate-limiting): xử lý 429 và làm mượt request
- [Lỗi và thử lại](/guides/error-handling): các mẫu triển khai
- [Xác thực](/api-reference/authentication): thông tin xác thực được hỗ trợ và vòng đời key
