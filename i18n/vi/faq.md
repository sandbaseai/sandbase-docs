---
i18nSource: a86346e2696c732c
title: Câu hỏi thường gặp
description: Các câu hỏi thường gặp về kết nối công cụ AI, danh mục SandBase, Model, API, Agent, Session và thanh toán.
---

# Câu hỏi thường gặp {#frequently-asked-questions}

## SandBase là gì? {#what-is-sandbase}

SandBase giúp Agent kết nối với thế giới thực.

Bạn có thể dùng các Model và API có sẵn, dùng chúng từ công cụ AI của bạn sau khi kết nối trong AI tools, hoặc xây dựng các Agent tái sử dụng và chạy chúng trong Session.

## SandBase dành cho ai? {#who-is-sandbase-for}

SandBase chủ yếu dành cho ba nhóm:

- **Người dùng công cụ AI** muốn có thêm khả năng hữu ích trong Codex, Claude, Cursor hoặc Kiro
- **Nhà phát triển** muốn gọi Model và API trực tiếp
- **FDE và các nhóm** xây dựng Agent tái sử dụng cho khách hàng hoặc quy trình nội bộ

## Tôi duyệt các khả năng ở đâu? {#where-do-i-browse-capabilities}
Website SandBase liệt kê danh mục các khả năng:

- [Models](https://www.sandbase.ai/models) và [model ảnh và video](https://www.sandbase.ai/models/image-video)
- [APIs](https://www.sandbase.ai/apis)
- [Agents](https://www.sandbase.ai/agents)
- [Skills](https://www.sandbase.ai/skills)
Tùy loại khả năng, bạn có thể xem chi tiết, kiểm thử, cài đặt, gọi hoặc sao chép.

## AI tools là gì? {#what-is-ai-tools}

**Build → AI tools** trong Console kết nối SandBase với công cụ AI bạn đang dùng, chẳng hạn Claude Code, Codex, Cursor hoặc Kiro. Dán `set up https://www.sandbase.ai/SKILL.md` vào agent của bạn, hoặc chạy `npx -y @sandbaseai/cli@latest connect`. Công cụ đã kết nối có thể tìm kiếm và chạy các Model và API trong danh mục SandBase, chi phí tính vào workspace của bạn. Xem [Kết nối công cụ AI](/setup/).

## Build Agent là gì? {#what-is-build-agent}

Build Agent là nơi bạn định nghĩa và kiểm thử một Agent.

Agent kết hợp chỉ dẫn, một Model, Skills và công cụ MCP thành một quy trình tái sử dụng và có phiên bản.

## Agent có khác API không? {#is-an-agent-different-from-an-api}
Có. Agent là một cấu hình có phiên bản mà bạn chỉnh sửa và kiểm thử, và bạn chạy nó bằng cách tạo Session. Ứng dụng của bạn có thể tạo Session bằng [Sessions API](/api-reference/sessions/) trong khi bạn tiếp tục chỉnh sửa Agent.

## Session là gì? {#what-are-sessions}
Session là một lần thực thi Agent, gồm cuộc hội thoại, hoạt động của công cụ và đầu ra.

## Làm sao để Agent truy cập API bên ngoài? {#how-do-i-give-an-agent-access-to-external-apis}

Kết nối hệ thống bên ngoài dưới dạng máy chủ MCP và thêm nó vào kết nối MCP của Agent. Nếu máy chủ cần Bearer token, hãy lưu nó bằng [Secrets API](/agents/api-credentials#with-the-api) dưới dạng Secret chỉ ghi, gắn với URL của máy chủ đó. Token chỉ được gửi tới máy chủ đó và không bao giờ xuất hiện trong prompt hay runtime của Agent. Xem [Thông tin xác thực cho công cụ MCP](/agents/api-credentials).

## Model nằm ở đâu? {#where-do-models-live}

Model có [danh mục](https://www.sandbase.ai/models) riêng vì chúng là những thành phần nền tảng quan trọng.

Bạn có thể gọi Model trực tiếp, dùng nó từ một công cụ AI đã kết nối, hoặc dùng nó bên trong một Agent.

## Tôi có cần viết code không? {#do-i-need-to-write-code}

Không phải lúc nào cũng cần.

[Kết nối công cụ AI của bạn](/setup/) nếu bạn muốn có các khả năng ngay trong công cụ đó mà không cần viết code.

Dùng API Reference nếu bạn muốn gọi SandBase từ ứng dụng của mình.

Dùng Build Agent nếu bạn muốn có công việc nhiều bước tái sử dụng được.

## Làm sao để lấy API key? {#how-do-i-get-an-api-key}

Mở Console, vào **Developer → API Keys** và chọn **New key**.

Dùng key như sau:

```http
Authorization: Bearer sk-YOUR_KEY
```

## Thanh toán hoạt động như thế nào? {#how-does-billing-work}

SandBase dùng credit và tính phí theo mức sử dụng.

Model, API, Agent và công việc runtime có thể có chi phí khác nhau. Hãy xem Console để biết mức sử dụng và giá hiện tại.

## Bước tiếp theo {#next-steps}

- [Bắt đầu](/getting-started/)
- [Danh mục Model và API](https://www.sandbase.ai/models)
- [Kết nối công cụ AI](/setup/)
- [Build Agent](/agents/)
- [API Reference](/api-reference/)
