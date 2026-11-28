---
i18nSource: 417ea5dc930a8786
title: Skills và công cụ MCP
description: Cung cấp cho SandBase Agent các Skill tái sử dụng và công cụ MCP từ xa, đồng thời kiểm soát phiên bản và công cụ mà mỗi Session dùng.
---

# Skills và công cụ MCP {#skills-and-mcp-tools}

Agent có được khả năng theo hai cách:

- **Skills** dạy Agent cách thực hiện một công việc. Skill là một gói ZIP có phiên bản gồm chỉ dẫn và tài nguyên.
- **Kết nối MCP** cho phép Agent gọi công cụ trên một máy chủ MCP từ xa qua HTTPS, có thể xác thực bằng một [Secret](/agents/api-credentials).

Hầu hết các Agent hữu ích kết hợp cả hai: máy chủ MCP lấy dữ liệu hoặc thực hiện hành động, còn Skill mô tả cách dùng kết quả.

## Skills {#skills}

1. Đóng gói một thư mục chứa `SKILL.md` có frontmatter `name` và `description`, rồi nén chính thư mục đó (`zip -r release-notes.zip release-notes/`, tối đa 5 MiB). Thư mục đó phải nằm ở cấp cao nhất của ZIP; `SKILL.md` nằm ở gốc ZIP sẽ trả về `400 invalid_request`.
2. Tải lên bằng `POST /v1/skills` qua trường multipart `files`. Phản hồi chứa một ID `skl_` và `default_version: "1"`.
3. Tham chiếu nó trong mảng `skills` của Agent.

```json
{
  "skills": [
    { "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null }
  ]
}
```

- Ở lần gắn đầu tiên, `"version": null` được phân giải thành `default_version` hiện tại của Skill khi Agent được lưu. Một chuỗi như `"2"` chọn phiên bản đó một cách tường minh.
- Agent đã lưu sẽ ghim phiên bản. Việc đổi phiên bản mặc định của Skill không nâng cấp các Agent hiện có hay các Session mới của chúng. Hãy cập nhật Agent với một phiên bản cụ thể để nâng cấp; gửi `null` cho một liên kết hiện có sẽ giữ nguyên phiên bản đã ghim.
- Tải lên phiên bản mới bằng `POST /v1/skills/{skill_id}/versions`, và đổi phiên bản mặc định bằng `default=true` hoặc `POST /v1/skills/{skill_id}`.
- Skill bị vô hiệu hóa khiến các Session mới của Agent tham chiếu đến nó thất bại với `400 skill_not_found`.

Bạn cũng có thể duyệt các Skill công khai trong [danh mục Skills](/api-reference/skills/catalog). Xem [Skills API](/api-reference/skills/) để có hướng dẫn đầy đủ.

## Công cụ SandBase tích hợp sẵn {#built-in-sandbase-tools}

Mọi Agent mới đều có thể dùng các công cụ riêng của SandBase mà không cần thiết lập. Với `sandbase_discover`, `sandbase_inspect` và `sandbase_run`, Agent tìm một model hoặc API trong danh mục, đọc schema và giá của nó, rồi gọi bằng khóa của bạn. Khi bạn bỏ qua `mcp_connections` lúc tạo, Agent nhận giá trị mặc định này:

```json
{
  "mcp_connections": [
    {
      "connection_id": "builtin:sandbase",
      "server_label": "sandbase_builtin",
      "allowed_tools": null,
      "required": true
    }
  ]
}
```

- **Danh sách bạn gửi sẽ thay thế giá trị mặc định.** Để thêm máy chủ MCP của riêng bạn mà vẫn giữ công cụ SandBase, hãy đưa mục tích hợp sẵn vào danh sách.
- **`builtin:sandbase` yêu cầu `server_label: "sandbase_builtin"`.** Bất kỳ nhãn nào khác, hoặc dùng nhãn đó cho kết nối khác, đều trả về `400`.
- **Để tạo Agent không có công cụ,** hãy gửi `"mcp_connections": []`.
- **Công cụ tích hợp sẵn là miễn phí.** Bạn chỉ trả tiền cho các model và API mà Agent gọi qua chúng.

## Kết nối MCP {#mcp-connections}

1. Nếu máy chủ MCP cần Bearer token, hãy [tạo một Secret](/agents/api-credentials) cho đúng URL của nó.
2. Đăng ký máy chủ bằng `POST /v1/mcp-connections`:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/mcp-connections \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Idempotency-Key: github-mcp" \
     -H "Content-Type: application/json" \
     -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
   ```

3. Tham chiếu kết nối trong mảng `mcp_connections` của Agent:

   ```json
   {
     "mcp_connections": [
       {
         "connection_id": "mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13",
         "server_label": "github",
         "allowed_tools": ["search_issues", "get_issue"],
         "required": true
       }
     ]
   }
   ```

| Trường | Ý nghĩa |
|---|---|
| `connection_id` | ID kết nối `mcp_` trong tổ chức của bạn, hoặc `builtin:sandbase` cho máy chủ SandBase tích hợp sẵn |
| `server_label` | Bắt đầu bằng chữ cái; gồm chữ cái, chữ số, `_` và `-`; tối đa 64 ký tự; duy nhất trong Agent |
| `allowed_tools` | Bỏ qua hoặc `null` cho phép mọi công cụ máy chủ cung cấp; `[]` không cho phép công cụ nào; một danh sách chỉ cho phép các tên đó (tối đa 256 tên, mỗi tên không rỗng và tối đa 128 byte) |
| `required` | Session có bắt buộc phải tải máy chủ này hay không |

Một Agent có thể tham chiếu tối đa 32 kết nối. Các kết nối của tổ chức phải ở trạng thái `active` khi Session bắt đầu.

### Công cụ SandBase tích hợp sẵn {#built-in-sandbase-tools-1}

Tạo Agent không có `mcp_connections` sẽ chọn máy chủ SandBase tích hợp sẵn. Để giữ nó một cách tường minh bên cạnh máy chủ của riêng bạn, hãy đưa mục này vào mảng:

```json
{
  "connection_id": "builtin:sandbase",
  "server_label": "sandbase_builtin",
  "allowed_tools": null,
  "required": true
}
```

Một mảng tường minh sẽ thay thế toàn bộ lựa chọn; ví dụ chỉ có máy chủ tùy chỉnh ở trên không bao gồm máy chủ tích hợp sẵn. Gửi `[]` để tắt mọi công cụ MCP. Bỏ qua trường này khi cập nhật Agent sẽ giữ nguyên lựa chọn hiện có; `null` trả về `400`. Mục tích hợp sẵn không yêu cầu tạo kết nối MCP hay Secret. Đừng gửi trường `use_sandbase_mcp` đã ngừng sử dụng.

::: info Khác với OpenAI
Agents API của OpenAI khai báo máy chủ MCP trực tiếp dưới dạng `tools: [{"type": "mcp", ...}]`. SandBase trả về `400` cho dạng đó: hãy đăng ký máy chủ như một tài nguyên kết nối và tham chiếu nó trong `mcp_connections`. OpenAI SDK không có phương thức cho `/v1/mcp-connections` hay `/v1/secrets`, nên hãy gọi chúng bằng `client.post(...)` và truyền `mcp_connections` qua `extra_body` (Python) hoặc body của yêu cầu (Node.js). Xem [Tương thích OpenAI](/agents/openai-compatibility#mcp-connections-with-the-sdk).
:::

## Thay đổi và các Session đang chạy {#changes-and-running-sessions}

Mỗi Session cố định phiên bản Agent, phiên bản Skill và cấu hình kết nối MCP của nó khi bắt đầu.

- Sau khi bạn thay thế một kết nối hoặc xoay vòng Secret của nó, các Session mới dùng cấu hình mới; các Session hiện có giữ snapshot của chúng.
- Vô hiệu hóa một kết nối hoặc thu hồi Secret của nó sẽ chặn Session mới và từ chối đầu vào tiếp theo cho các Session hiện có đang dùng nó. Lệnh gọi công cụ đang chạy sẽ không bị gián đoạn.

## Không đưa token vào prompt {#keep-tokens-out-of-prompts}

Hãy lưu token dưới dạng Secret. Đừng đặt chúng trong chỉ dẫn, đầu vào Session, metadata hay gói Skill: bất kỳ ai có quyền truy cập Agent hoặc Session đều đọc được những nội dung đó.

## Bước tiếp theo {#next-steps}

- [Thông tin xác thực cho công cụ MCP](/agents/api-credentials)
- [MCP Connections API](/api-reference/mcp-connections/)
- [Skills API](/api-reference/skills/)
- [Định nghĩa một Agent](/agents/agent-api)
