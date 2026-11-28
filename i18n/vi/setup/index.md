---
i18nSource: 28b1ef75a197824a
title: Kết nối công cụ AI
description: Cung cấp danh mục Models và APIs của SandBase cho Claude Code, Codex, Cursor, Kiro và các công cụ AI khác chỉ với một prompt hoặc một lệnh CLI.
---

# Kết nối công cụ AI {#connect-ai-tools}

Trang [AI tools](https://www.sandbase.ai/console/setup) trong Console (**Build → AI tools**) kết nối SandBase với agent hoặc công cụ AI bạn đang dùng. Các công cụ đã kết nối có thể tìm kiếm trong danh mục Models và APIs của SandBase, đọc input schema và giá của từng công cụ, rồi chạy nó. Mọi lệnh gọi đều được tính phí cho workspace đang hoạt động.

Các client được hỗ trợ gồm Claude Code, Codex, Cursor, Kiro IDE và Kiro CLI, Windsurf, Gemini CLI, OpenCode, Qwen Code, Warp, Amp, Crush, OpenClaw, Hermes, Claude Desktop và ChatGPT. Trang AI tools liệt kê danh sách hiện tại.

## Bắt đầu nhanh: dán một prompt {#quick-start-paste-one-prompt}

Dán dòng này vào agent của bạn:

```text
set up https://www.sandbase.ai/SKILL.md
```

Agent sẽ đọc SandBase Skill, cài CLI và yêu cầu bạn phê duyệt một lần đăng nhập trên trình duyệt. Bạn không cần dán API key. Khi agent báo client đã được cấu hình, hãy bắt đầu một phiên mới hoặc khởi động lại ứng dụng để các công cụ `sandbase_*` được nạp.

Skill cần Node.js 20 trở lên trên máy chạy agent.

## Các cách kết nối khác {#other-ways-to-connect}

### CLI {#cli}

Kết nối từ terminal. Nếu không có `--client`, CLI sẽ cấu hình mọi client được hỗ trợ mà nó tìm thấy:

```sh
npx -y @sandbaseai/cli@latest connect
```

Để cấu hình một client, hãy truyền id của client đó, ví dụ `codex`, `claude-code`, `cursor` hoặc `kiro`:

```sh
npx -y @sandbaseai/cli@latest connect --client codex
```

Script cài đặt chạy cùng lệnh này:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --client codex
```

Để liệt kê các client mà trình cài đặt nhận diện được mà không thay đổi cấu hình cục bộ:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --list-agents
```

`connect` mở trang cấp quyền trên trình duyệt, tạo key **CLI Login** cho workspace bạn phê duyệt và chỉ ghi cấu hình client do SandBase quản lý. [SandBase CLI](https://github.com/sandbaseai/cli) mã nguồn mở có tài liệu cho từng client.

### Client MCP bạn tự cấu hình {#mcp-clients-you-configure-by-hand}

Người dùng đã đăng nhập sẽ thấy địa chỉ MCP server trong **Other ways to connect** trên trang [AI tools](https://www.sandbase.ai/console/setup). Xác thực bằng một [API key](/getting-started/api-keys) từ **Developer → API Keys** và lưu key trong cấu hình secret của client.

## Kiểm tra kết nối {#verify-the-connection}

Chỉ cài đặt hoặc cấp quyền thôi không chứng minh được client đã kết nối. Hãy xác nhận rằng:

- server hoặc connector SandBase hiển thị trong client
- có thể tìm thấy các công cụ `sandbase_*` trong một phiên mới
- một request ngôn ngữ tự nhiên an toàn hoàn tất thành công

Với các client do CLI quản lý, hãy chạy lệnh chẩn đoán sau khi kết nối lại hoặc thay đổi cấu hình:

```sh
npx -y @sandbaseai/cli doctor --client codex
```

`doctor` kiểm tra thông tin xác thực cục bộ, mục MCP và Skill, sau đó thực hiện một lượt gọi khứ hồi đến SandBase. Hãy luôn thực hiện lệnh gọi công cụ cuối cùng ngay bên trong client.

Các lượt chạy do công cụ đã kết nối thực hiện sẽ xuất hiện trong [Activities](https://www.sandbase.ai/console/activities) kèm chi phí.

## Khắc phục sự cố {#troubleshooting}

| Vấn đề | Cần kiểm tra |
|---|---|
| Công cụ không xuất hiện | Bắt đầu phiên client mới hoặc khởi động lại ứng dụng, chạy `npx -y @sandbaseai/cli doctor --client <client>` rồi thử lại. |
| Thiếu quyền | Chạy lại `connect` và phê duyệt đăng nhập trên trình duyệt cho workspace bạn muốn tính phí. |
| Lệnh gọi thất bại với HTTP 402 | Nạp thêm credit trong [Billing](https://www.sandbase.ai/console/billing) cho workspace đang hoạt động. |

## Gỡ cấu hình được quản lý {#remove-the-managed-configuration}

Chỉ gỡ mục do SandBase quản lý cho một client:

```sh
npx -y @sandbaseai/cli unregister --client codex
```

Lệnh này chỉ gỡ cấu hình mà nó xác minh được là thuộc SandBase và giữ nguyên các mục không liên quan hoặc do người dùng quản lý. Sau đó, hãy thu hồi key **CLI Login** tương ứng trong **Developer → API Keys** nếu bạn không còn cần đến.

## Mã nguồn và hỗ trợ {#source-and-support}

- [Mã nguồn](https://github.com/sandbaseai/cli)
- [Gói npm](https://www.npmjs.com/package/@sandbaseai/cli)
- [Câu hỏi và ví dụ](https://github.com/sandbaseai/cli/discussions)
- [Báo lỗi](https://github.com/sandbaseai/cli/issues/new/choose)

## Bước tiếp theo {#next-steps}

- [Danh mục Models và APIs](https://www.sandbase.ai/models)
- [Hướng dẫn Skill](/guides/skills/)
- [Xây dựng Agent](/agents/)
