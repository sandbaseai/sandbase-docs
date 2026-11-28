---
i18nSource: 7b24f4b0b5cd2c33
title: Build Agent
description: Định nghĩa, kiểm thử và chạy các Agent có thể tái sử dụng, có phiên bản trong SandBase Session.
---

# Build Agent {#build-agent}

Build Agent là nơi bạn định nghĩa và kiểm thử một Agent, sau đó quyết định cách nó chạy.

Agent là một cấu hình được lưu và quản lý phiên bản: một Model, chỉ dẫn, runtime profile, Skills và các kết nối MCP tới công cụ bên ngoài. Lưu một Agent không làm nó chạy.

## Agent là gì {#what-an-agent-is}

| Câu hỏi | Nằm ở đâu |
|---|---|
| Agent cần làm gì? | `instructions` |
| Model nào thực hiện công việc? | `model`, một model ID từ [Models API](/api-reference/models/) |
| Agent biết làm những gì? | [Skills](/agents/mcp-tools#skills), các gói chỉ dẫn có phiên bản |
| Agent có thể gọi công cụ bên ngoài nào? | [Kết nối MCP](/agents/mcp-tools#mcp-connections), kèm [thông tin xác thực](/agents/api-credentials) khi máy chủ cần token |
| Agent chạy như thế nào? | Trong một [Session](/agents/sessions) |

Mỗi thay đổi có hiệu lực đều tạo ra một phiên bản mới bất biến. Bạn có thể liệt kê các phiên bản và khôi phục phiên bản trước đó bất cứ lúc nào.

## Agent chạy như thế nào {#how-an-agent-runs}

Bạn chạy Agent trong một [Session](/agents/sessions). Session là tài nguyên `ses_` mà bạn gửi input vào và nhận luồng sự kiện từ đó, dù là cho một cuộc hội thoại tương tác, một lần chạy thử hay một lệnh gọi từ ứng dụng của bạn. Mỗi Session cố định phiên bản Agent mà nó khởi động cùng, nên bạn có thể tiếp tục chỉnh sửa Agent mà không ảnh hưởng đến các Session đã tồn tại.

## Vòng đời Agent: Soạn thảo → Kiểm thử trong Session → Chạy từ ứng dụng → Kiểm tra Session {#agent-lifecycle-draft-→-test-in-a-session-→-run-from-your-app-→-inspect-sessions}

### 1. Soạn thảo {#_1-draft}

Tạo Agent trong Console tại **Build → Agents**, hoặc bằng [`POST /v1/agents`](/agents/agent-api). Hãy bắt đầu với quy trình hữu ích nhỏ nhất và chỉ thêm Skills cùng kết nối MCP khi chỉ dẫn thực sự cần đến.

### 2. Kiểm thử trong Session {#_2-test-in-a-session}

Tạo một Session cho Agent, gửi input tiêu biểu, rồi đọc output, hoạt động của công cụ và lỗi. Hãy kiểm thử cả trường hợp thiếu input, công cụ không khả dụng, kết quả rỗng và yêu cầu về định dạng output, không chỉ trường hợp suôn sẻ.

### 3. Chạy từ ứng dụng {#_3-run-from-your-app}

Tạo Session cho Agent đã kiểm thử từ ứng dụng của bạn bằng [Sessions API](/api-reference/sessions/).

### 4. Kiểm tra Session {#_4-inspect-sessions}

Đọc các item và turn của từng Session bằng Sessions API để xem lại toàn bộ cuộc hội thoại, hoạt động của công cụ và lỗi.

## Danh sách kiểm tra cho production {#production-checklist}

- `model` dùng model ID hiện hành từ Models API.
- Skills được ghim phiên bản khi hành vi không được phép thay đổi ngầm.
- Kết nối MCP chỉ mở những công cụ Agent cần, bằng `allowed_tools`.
- Token được lưu dưới dạng [Secret](/agents/api-credentials), không bao giờ được ghi vào chỉ dẫn, input hoặc metadata.
- Lệnh tạo Session gửi kèm `Idempotency-Key` và các lần thử lại dùng lại key đó.
- Trạng thái và lỗi của Session được kiểm tra sau khi khởi chạy.

## Agent trong catalog {#catalog-agents}

[Catalog Agent](/api-reference/agents/catalog) công khai liệt kê các Agent do SandBase phát hành. Bạn có thể đọc một Agent trong catalog, nhưng để thay đổi nó, trước tiên bạn cần clone nó vào tổ chức của mình bằng `POST /v1/agents/catalog/{agent_id}/clone`. Bản clone là một Agent riêng tư mới do bạn sở hữu và có thể chạy.

::: tip Dùng OpenAI SDK
Agents, Sessions và Skills tuân theo OpenAI Agents API, nên OpenAI SDK chính thức hoạt động với `base_url="https://api.sandbase.ai/v1"`. Xem [Tương thích OpenAI](/agents/openai-compatibility) để có các ví dụ đã được kiểm chứng và những điểm khác biệt.
:::

## Bước tiếp theo {#next-steps}

- [Định nghĩa Agent](/agents/agent-api)
- [Tương thích OpenAI](/agents/openai-compatibility)
- [Skills và công cụ MCP](/agents/mcp-tools)
- [Sessions](/agents/sessions)
