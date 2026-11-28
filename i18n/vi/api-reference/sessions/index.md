---
i18nSource: 99170a141af66587
title: Sessions API
description: Chạy một phiên bản Agent đã lưu, gửi input, stream sự kiện và đọc lịch sử Session.
---

# Sessions API {#sessions-api}

Một Session chạy một phiên bản [Agent](/api-reference/agents/) đã lưu trên cloud do SandBase lưu trữ; bạn không cần chọn môi trường thực thi. ID của Session dùng tiền tố `ses_`. Session là tài nguyên con của Agents: mọi đường dẫn đều bắt đầu bằng `/v1/agents/sessions`.

Các thao tác chuẩn tuân theo giao thức OpenAI Agents (`client.beta.agents.sessions`); xem [Tương thích OpenAI](/agents/openai-compatibility) để biết SDK chính thức làm được và không làm được gì. Các phần mở rộng của SandBase bổ sung đổi tên, trạng thái lưu trữ, hủy, tệp đính kèm, metadata tệp workspace, artifact bất biến và một luồng sản phẩm có thể kết nối lại.

::: info Session đến từ đâu
Bạn tạo Session trực tiếp bằng `POST /v1/agents/sessions`. Session báo cáo `source: "direct"` và `source_id: null`.
:::

## Quy trình khuyến nghị {#recommended-flow}

1. [Tạo Session](./create) cho một Agent đã lưu. Session cố định phiên bản Agent và kết nối MCP được chọn, đồng thời dùng các phiên bản Skill đã được ghim vào phiên bản Agent đó.
2. [Mở luồng sự kiện](./stream) bằng `GET /v1/agents/sessions/{session_id}/events`. Luồng chỉ phát trực tiếp, nên hãy mở nó trước khi gửi input.
3. [Gửi input](./send-events) bằng `POST /v1/agents/sessions/{session_id}/events` với một sự kiện `agent.session.input.message`. Lệnh gọi trả về 202.
4. Đọc kết quả từ luồng, hoặc sau đó từ [items](./items) và [turns](./turns).

## Thao tác trên Session {#session-operations}

| Phương thức | Đường dẫn | Mục đích |
|---|---|---|
| `POST` | `/v1/agents/sessions` | [Tạo Session](./create) |
| `GET` | `/v1/agents/sessions` | [Liệt kê Session](./list) |
| `GET` | `/v1/agents/sessions/{session_id}` | [Lấy một Session](./get) |
| `POST` | `/v1/agents/sessions/{session_id}` | [Thay thế metadata](./update) |
| `PATCH` | `/v1/agents/sessions/{session_id}` | [Đổi tên](./rename) bằng `row_version` |
| `DELETE` | `/v1/agents/sessions/{session_id}` | [Xóa](./delete), thao tác này lưu trữ Session |
| `POST` | `/v1/agents/sessions/{session_id}/events` | [Gửi một sự kiện input hoặc hủy](./send-events) |
| `GET` | `/v1/agents/sessions/{session_id}/events` | [Stream sự kiện trực tiếp](./stream) (SSE) |
| `GET` | `/v1/agents/sessions/{session_id}/items` | [Liệt kê items](./items) |
| `GET` | `/v1/agents/sessions/{session_id}/turns` | [Liệt kê turns](./turns) |
| `GET` | `/v1/agents/sessions/{session_id}/turns/{turn_id}` | [Lấy một turn](./get-turn) |
| `POST` | `/v1/agents/sessions/{session_id}/cancel` | [Hủy turn đang chạy](./cancel) |
| `POST` | `/v1/agents/sessions/{session_id}/archive` | [Lưu trữ](./archive) |
| `POST` | `/v1/agents/sessions/{session_id}/unarchive` | [Bỏ lưu trữ](./unarchive) |
| `POST` | `/v1/agents/sessions/{session_id}/reconnect` | [Kết nối lại](./reconnect) sau khi luồng bị ngắt |
| `GET` | `/v1/agents/sessions/{session_id}/events/stream` | [Luồng snapshot rồi trực tiếp](./stream-snapshot) (SSE) |
| `POST` | `/v1/agents/sessions/{session_id}/files` | [Tải lên tệp đính kèm](./upload-file) |
| `GET` | `/v1/agents/sessions/{session_id}/files` | [Liệt kê tệp đính kèm](./list-files) |
| `GET` | `/v1/agents/sessions/{session_id}/files/{file_id}/content` | [Tải xuống tệp đính kèm](./download-file) |
| `DELETE` | `/v1/agents/sessions/{session_id}/files/{file_id}` | [Xóa tệp đính kèm](./delete-file) |
| `GET` | `/v1/agents/sessions/{session_id}/workspace-files` | [Liệt kê metadata tệp workspace](./list-workspace-files) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts` | [Liệt kê artifact bất biến](./list-artifacts) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` | [Tải xuống artifact](./download-artifact) |

## Các trường trạng thái {#status-fields}

- `status` là trạng thái thực thi: `idle`, `in_progress` hoặc `failed`. Công cụ function cần kết quả từ client (`requires_action`) chưa được hỗ trợ; đọc một Session như vậy sẽ trả về `502 executor_contract_error`.
- `lifecycle_status` là `active` hoặc `archived`. Session đã lưu trữ từ chối input, cập nhật metadata và luồng. `DELETE` lưu trữ; `unarchive` khôi phục.
- `failure` là `null` hoặc một object có `code`, `message`, `action` và đôi khi có `retryable`.

| `failure.code` | Ý nghĩa | `action` đề xuất |
|---|---|---|
| `session_creation_rejected` | Lớp thực thi đã từ chối Session | `create_new_session` |
| `model_authentication_failed` | Nhà cung cấp model đã từ chối key | `create_session_with_updated_model_provider` |
| `model_rate_limited` | Nhà cung cấp model đang giới hạn tốc độ (có thể thử lại) | `retry_later` |
| `model_quota_exceeded` | Tài khoản model đã hết hạn mức | `check_model_account` |
| `context_limit_exceeded` | Cuộc hội thoại vượt quá context của model | `create_new_session` |
| `environment_connection_timeout` | Môi trường không kết nối kịp thời (có thể thử lại) | `retry_later` |
| `runtime_unavailable` | Môi trường thực thi không khả dụng (có thể thử lại) | `retry_later` |
| `model_request_failed` | Yêu cầu model không hoàn tất | `inspect_history` |
| `model_configuration_rejected` | Model hoặc lớp thực thi đã từ chối cấu hình | `create_session_with_updated_model_provider` |
| `execution_failed` | Lỗi không có nguyên nhân công khai cụ thể hơn | `inspect_history` |

Kết quả danh sách cũng có thể chứa các hàng giữ chỗ với `session_not_ready`, `session_execution_unavailable`, `session_configuration_unavailable` hoặc `session_snapshot_unavailable` khi không thể đọc trực tiếp một Session.

## Thông tin xác thực model {#model-credentials}

Theo mặc định, Session gọi model bằng chính SandBase API key đã tạo ra nó. Gửi `model_provider` để chọn một cách tường minh:

- `{"type": "sandbase"}` dùng key đang gọi của bạn. Không được dùng `base_url`.
- `{"type": "custom", "base_url": "https://…", "api_key": "…"}` gọi endpoint HTTPS tương thích OpenAI của riêng bạn. URL không được chứa thông tin xác thực, query hay fragment, và SandBase không bao giờ chuyển sang dùng SandBase key của bạn.

`model_provider` chỉ ghi và không bao giờ xuất hiện trong phản hồi.

## Điều kiện thực thi và lỗi {#admission-and-errors}

Việc tạo Session và gửi input sẽ kiểm tra điều kiện cho phép thực thi: `402 spending_limit_exceeded` khi hết hạn mức của key hoặc số dư tổ chức, `403 org_disabled` khi tổ chức không thể chạy Agent, và `503 admission_unavailable` khi không thể hoàn tất việc kiểm tra. Thao tác đọc, hủy và lưu trữ không bị chặn bởi số dư.

Gửi input cũng có thể trả về `409 session_input_pending` (input trước đó vẫn đang được chuyển; hãy chờ và đừng gửi lại với key mới), `409 session_input_expired` (kiểm tra lịch sử trước khi gửi lại) hoặc `409 session_environment_unavailable` (chờ hoặc tạo Session mới). Xem [Lỗi](/api-reference/errors#agents-platform-errors).

## Phân trang {#pagination}

Sessions, items, turns và artifacts dùng phân trang cursor (`limit` 1-100, `after`, `order`). Tệp đính kèm dùng phân trang offset (`limit` 1-100, `offset`).

Tệp workspace dùng phân trang `page` / `next`. Xem [Liệt kê tệp workspace](./list-workspace-files).
