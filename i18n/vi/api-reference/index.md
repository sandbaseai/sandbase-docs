---
i18nSource: 071e97a48f9c4f4c
title: Tham chiếu API
description: Gọi các model của SandBase và quản lý Agents, Sessions, Skills, kết nối MCP, Secrets và tài nguyên tài khoản.
---

# Tham chiếu API {#api-reference}

Dùng API để gọi model trực tiếp, hoặc để định nghĩa các Agent có thể tái sử dụng, chạy chúng trong Session và kết nối chúng với Skills và công cụ MCP.

::: tip Bạn đang tìm suy luận model?
Các hợp đồng suy luận (Chat Completions, Responses, Anthropic Messages, Gemini, Images và video Seedance) nằm trong phần **Model inference** của tài liệu tham chiếu này. Các trường và bảng giá riêng của từng model có trên trang của model đó trong [danh mục Models](https://www.sandbase.ai/models).
:::

## Chọn điểm bắt đầu {#choose-a-starting-point}

| Mục tiêu | Bắt đầu với | Bước tiếp theo |
|---|---|---|
| Định nghĩa hành vi có thể tái sử dụng | [Agents](/api-reference/agents/) | Tạo và quản lý phiên bản cấu hình Agent |
| Chạy Agent trực tiếp | [Sessions](/api-reference/sessions/) | Gửi đầu vào, stream sự kiện và đọc lịch sử |
| Tái sử dụng gói instructions | [Skills](/api-reference/skills/) | Tải lên các gói ZIP có phiên bản và gắn chúng vào Agent |
| Gọi công cụ bên ngoài | [MCP Connections](/api-reference/mcp-connections/) | Đăng ký các server MCP HTTPS từ xa cho Agent |
| Xác thực công cụ bên ngoài | [Secrets](/agents/api-credentials#with-the-api) | Lưu Bearer token chỉ ghi cho kết nối MCP |

## Vòng đời tài nguyên {#resource-lifecycle}

```text
Agent + version ─── direct ──→ Session ─→ events, items, turns
Agent ─ skills[] → Skill version      Agent ─ mcp_connections[] → MCP connection ─ secret_id → Secret
```

- **Agent** (`agt_`) là một cấu hình đã lưu và có phiên bản; tạo Agent không thực thi Agent đó.
- **Session** (`ses_`) chạy một phiên bản Agent và cố định Skills cùng kết nối MCP của nó. Đường dẫn Session nằm dưới `/v1/agents/sessions`.
- **Skill** (`skl_`) là một gói instructions có phiên bản. **Kết nối MCP** (`mcp_`) đăng ký một server công cụ từ xa, và **Secret** (`sec_`) lưu Bearer token của server đó.

## Quy ước cho tài nguyên nền tảng Agents {#conventions-for-agents-platform-resources}

Agents, Sessions, Skills, kết nối MCP và Secrets được phục vụ tại `https://api.sandbase.ai/v1` và tuân theo các quy tắc chung sau:

- Xác thực bằng `Authorization: Bearer` hoặc `X-API-Key`. Xem [Xác thực](/api-reference/authentication#agents-platform-resources).
- Body của request là JSON nghiêm ngặt, tối đa 1 MiB; trường không xác định trả về 400.
- Các thao tác ghi tạo kết nối MCP hoặc Secret bắt buộc có `Idempotency-Key`. Các thao tác ghi khác chấp nhận header này.
- Kiểm soát đồng thời lạc quan dùng `row_version`: gửi giá trị bạn đọc gần nhất và xử lý 409 bằng cách đọc lại.
- Agents, Sessions, items, turns và Skills dùng phân trang theo cursor (`limit`, `after`, `order`; response có `has_more` và `last_id`). Phiên bản Agent, attachments, kết nối MCP và Secrets dùng phân trang theo offset (`limit`, `offset`; response có `total`).
- Lỗi dùng `{"error": {"type", "code", "param", "message"}}`. Xem [Lỗi nền tảng Agents](/api-reference/errors#agents-platform-errors).

## Xác thực {#authentication}

Gửi SandBase API key dưới dạng Bearer token:

```http
Authorization: Bearer sk-YOUR_KEY
```

Hãy coi key là một secret không cần diễn giải, giữ key ở phía server và không bao giờ đưa key vào mã trình duyệt hoặc log. Xem [Xác thực](/api-reference/authentication) để biết chi tiết về tương thích và [Lỗi](/api-reference/errors) để biết các envelope lỗi công khai.

## Tổ chức và mức sử dụng {#organization-and-usage}

Tài nguyên nền tảng thuộc về tổ chức gắn với API key. Dùng [Account API](/api-reference/account/) để xem số dư và lịch sử thực thi gần đây được hỗ trợ. Việc quản trị tổ chức và quản lý thanh toán vẫn thực hiện trong Console, trừ khi có endpoint công khai được mô tả tại đây.

## Định dạng tài liệu tham chiếu {#reference-formats}

- Duyệt các thao tác từ thanh bên để xem ví dụ và chi tiết response.
- Tải [đặc tả OpenAPI](/openapi.yaml) dạng máy đọc được.
- Mở trang của model trong [danh mục Models](https://www.sandbase.ai/models) hoặc trang của API trong [danh mục APIs](https://www.sandbase.ai/apis) để xem chính xác các trường request.

## Bước tiếp theo {#next-steps}

- Mới làm quen với Agent được quản lý: [Xây dựng Agent](/agents/)
- Gọi model trực tiếp: [Chat Completions](/api-reference/llm-gateway) hoặc [danh mục Models](https://www.sandbase.ai/models)
