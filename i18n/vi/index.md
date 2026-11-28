---
i18nSource: c063864501452a7b
title: Tài liệu SandBase
description: Xây dựng trực tiếp với Models và APIs, hoặc định nghĩa các Agent có thể tái sử dụng chạy trên hạ tầng được quản lý.
---

# Tài liệu SandBase {#sandbase-docs}

Xây dựng trực tiếp với Models và APIs, hoặc định nghĩa các Agent có thể tái sử dụng chạy trên hạ tầng được quản lý.

SandBase cung cấp hai cách bổ trợ cho nhau để xây dựng ứng dụng AI. Hãy bắt đầu với phần nhỏ nhất phù hợp với công việc; bạn có thể kết hợp cả hai khi ứng dụng phát triển.

## Chọn cách xây dựng {#choose-how-to-build}

| | Models và APIs | Managed Agents |
|---|---|---|
| **Đây là gì** | Truy cập trực tiếp vào các model ngôn ngữ, ảnh, video, audio và API bên thứ ba | Cấu hình Agent có phiên bản, có thể tái sử dụng, do SandBase thực thi |
| **Phù hợp nhất cho** | Vòng lặp ứng dụng tùy chỉnh và kiểm soát request chi tiết | Công việc nhiều bước, bất đồng bộ hoặc lặp lại |
| **Bạn quản lý** | Prompt, điều phối, thử lại và trạng thái ứng dụng | Định nghĩa Agent, các tính năng được bật, input và cách bàn giao kết quả |
| **Bắt đầu tại đây** | [Models và APIs](https://www.sandbase.ai/models) | [Build Agent](/agents/) |

::: tip Một SandBase API key
Cùng một API key có thể gọi Models, APIs và Agents. Hãy giữ key ở phía server và không bao giờ để lộ key trong mã trình duyệt.
:::

## Khái niệm cốt lõi {#core-concepts}

### Models và APIs {#models-and-apis}

Dùng Models cho các khối lượng công việc về ngôn ngữ, ảnh, video và audio. Dùng APIs khi ứng dụng cần dữ liệu hoặc hành động bên ngoài. Danh mục trên website SandBase hiển thị các tính năng có sẵn, giá, schema input và ví dụ chạy được.

- [Duyệt Models](https://www.sandbase.ai/models)
- [Duyệt APIs](https://www.sandbase.ai/apis)
- [Thực hiện lệnh gọi API đầu tiên](/getting-started/first-call)
- [Mở tài liệu tham khảo API](/api-reference/)

### Agents {#agents}

Agent là một cấu hình có phiên bản, có thể tái sử dụng, gồm Model, chỉ dẫn, Skill và MCP connection. Hãy định nghĩa một lần, sau đó chạy nó trong Session.

- [Tìm hiểu Agents](/agents/)
- [Định nghĩa Agent](/agents/agent-api)
- [Thêm Skill và MCP tool](/agents/mcp-tools)

### Sessions {#sessions}
Session chạy một phiên bản Agent. Tạo Session bằng `POST /v1/agents/sessions`, gửi input, stream sự kiện và đọc toàn bộ cuộc hội thoại sau đó.

- [Hướng dẫn Sessions](/agents/sessions)
- [Sessions API](/api-reference/sessions/)

## Các bước đầu tiên {#first-steps}

1. Tạo tổ chức và [API key](/getting-started/api-keys).
2. Chọn Model, API hoặc Agent từ [danh mục](https://www.sandbase.ai/models).
3. Gửi request trực tiếp hoặc định nghĩa và kiểm thử một Agent.
4. Chạy Agent đã kiểm thử trong Session từ ứng dụng của bạn.
5. Xem lại Session, lỗi, độ trễ và chi phí trong Console.

## Hướng dẫn vận hành {#operational-guidance}

- [Streaming response](/guides/streaming)
- [Xử lý lỗi và thử lại](/guides/error-handling)
- [Giới hạn tốc độ](/guides/rate-limiting)
- [Thanh toán và giá](/guides/billing)
- [Quản trị workspace](/admin/)

## Bước tiếp theo {#next-steps}

- Sáng tạo với Skill cục bộ: [Hướng dẫn Skill](/guides/skills/)

- Mới dùng SandBase: [Bắt đầu](/getting-started/)
- Gọi Model hoặc API: [Danh mục Models](https://www.sandbase.ai/models) và [danh mục APIs](https://www.sandbase.ai/apis)
- API inference và Agent: [Tài liệu tham khảo API](/api-reference/)
- Xây dựng công việc có thể tái sử dụng: [Build Agent](/agents/)
- Kết nối AI tool: [Setup](/setup/)
