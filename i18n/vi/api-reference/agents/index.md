---
i18nSource: 8524e8b4d6f5ab97
title: Agents API
description: Tạo, quản lý phiên bản, lưu trữ và clone các cấu hình Agent đã lưu.
---

# Agents API {#agents-api}

Agent là một cấu hình đã lưu và có quản lý phiên bản, gồm model, instructions, runtime profile, Skills, kết nối MCP và thiết lập đầu ra. Việc tạo hoặc cập nhật Agent không chạy Agent đó. Hãy chạy Agent trong một [Session](/api-reference/sessions/).

Agents API tuân theo giao thức OpenAI Agents (`client.beta.agents` trong OpenAI Python SDK). Header `OpenAI-Beta` là tùy chọn; nếu bạn gửi, giá trị phải là `agents=v1`. SandBase bổ sung phiên bản, cập nhật kiểu compare-and-set, lưu trữ và khôi phục, cùng một danh mục công khai.

## Các thao tác với Agent {#agent-operations}

| Phương thức | Đường dẫn | Mục đích |
|---|---|---|
| `POST` | `/v1/agents` | [Tạo Agent](./create) ở phiên bản 1 |
| `GET` | `/v1/agents` | [Liệt kê Agent](./list) |
| `GET` | `/v1/agents/{agent_id}` | [Lấy Agent](./get) |
| `POST` | `/v1/agents/{agent_id}` | [Cập nhật Agent](./update) (cập nhật một phần theo kiểu SDK) |
| `PATCH` | `/v1/agents/{agent_id}` | [Thay thế bằng compare-and-set](./replace) trên `row_version` |
| `DELETE` | `/v1/agents/{agent_id}` | [Xóa](./delete), tức là lưu trữ Agent |
| `POST` | `/v1/agents/{agent_id}/archive` | [Lưu trữ Agent](./archive) |
| `POST` | `/v1/agents/{agent_id}/unarchive` | [Bỏ lưu trữ Agent](./unarchive) |
| `POST` | `/v1/agents/{agent_id}/restore` | [Khôi phục một phiên bản trước đó](./restore) thành phiên bản mới |
| `GET` | `/v1/agents/{agent_id}/versions` | [Liệt kê phiên bản](./versions) |
| `GET` | `/v1/agents/{agent_id}/versions/{version}` | [Lấy một phiên bản](./get-version) |
| `GET` | `/v1/agents/catalog` | [Duyệt danh mục công khai](./catalog) |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | [Clone một Agent trong danh mục](./catalog#clone-a-catalog-agent) vào tổ chức của bạn |

ID của Agent dùng tiền tố `agt_`. Body của request là JSON nghiêm ngặt, tối đa 1 MiB; trường không xác định trả về 400.

## Phiên bản và cập nhật {#versions-and-updates}

- Mỗi lần ghi có hiệu lực (create, update, replace, restore) tạo ra một phiên bản bất biến. `version` là số phiên bản hiện tại.
- `POST /v1/agents/{agent_id}` là thao tác cập nhật của OpenAI SDK. Thao tác này không cần `row_version`, nên lần ghi sau cùng sẽ thắng.
- `PATCH /v1/agents/{agent_id}` yêu cầu `row_version` bạn đọc gần nhất và trả về 409 nếu người khác đã thay đổi Agent trước đó. Hãy dùng thao tác này cho trình soạn thảo và tự động hóa có thể chạy đồng thời.
- Mỗi Session cố định phiên bản Agent, phiên bản Skill và cấu hình kết nối MCP tại thời điểm Session bắt đầu.

## Trạng thái sẵn sàng {#readiness}

Phiên bản vừa ghi sẽ báo `projection_status` trong lúc được chuẩn bị để thực thi. Session cần một Agent đang active có `projection_status` là `ready`; nếu không sẽ trả về 409. Agent đã lưu trữ cũng trả về 409 với các lần thực thi mới.

## Giới hạn hiện tại {#current-limits}

- `tools` chấp nhận công cụ `function` và tối đa một công cụ `web_search`. Việc thực thi hiện yêu cầu `web_search.mode` là `disabled`.
- Function tool có thể được lưu, nhưng các Run yêu cầu client trả về kết quả công cụ (`requires_action`) chưa được hỗ trợ và sẽ báo lỗi `502 executor_contract_error`.
- `multi_agent` phải được bỏ qua hoặc là `null`.

## Phân trang {#pagination}

`GET /v1/agents` và danh mục dùng phân trang theo cursor: `limit` (1-100, mặc định 20), `after` và `order` (`asc` hoặc `desc`, mặc định `desc`). Response chứa `object: "list"`, `data`, `has_more`, `first_id` và `last_id`; truyền `last_id` làm `after` để lấy trang tiếp theo.

`GET /v1/agents/{agent_id}/versions` dùng phân trang theo offset: `limit` và `offset`, response gồm `data`, `total`, `limit` và `offset`.

## Lỗi {#errors}

Lỗi dùng envelope của Agents `{"error":{"type","code","param":null,"message"}}`. Xem danh sách mã lỗi tại [Lỗi](/api-reference/errors#agents-platform-errors).
