---
i18nSource: 0314b37a870481ae
title: Tài liệu cho AI đọc
description: Mọi thứ một AI agent cần để khám phá và dùng SandBase API — bản tóm tắt một trang.
---

# Tổng quan API thân thiện với AI {#ai-friendly-api-overview}

::: info Hợp đồng Session
Một Session (`ses_*`) chạy một phiên bản Agent đã lưu; tạo trực tiếp bằng `POST /v1/agents/sessions`. Các instance runtime luôn là nội bộ và không bao giờ được trả về.
:::

> Tài liệu tham khảo ngắn gọn cho cả con người và AI agent. Để có phiên bản văn bản thuần tối ưu cho LLM đọc, xem [`llms.txt`](https://www.sandbase.ai/docs/llms.txt).

## SandBase là gì? {#what-is-sandbase}

SandBase là nền tảng hạ tầng cho AI agent. Một API key có thể truy cập các Model và API đang bật trên các lĩnh vực ngôn ngữ, ảnh, video, âm thanh, tìm kiếm và dữ liệu, cùng các quy trình Agent. Hãy truy vấn danh mục hiện tại thay vì dựa vào một con số cố định.

## Base URL của API {#api-base-url}

```
https://api.sandbase.ai/v1
```

## Xác thực {#authentication}

Mọi request đều cần Bearer token:

```
Authorization: Bearer sk-YOUR_KEY
```

Lấy key tại [Developer → API Keys](https://www.sandbase.ai/console/keys).

## Ví dụ nhanh {#quick-example}

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## API cốt lõi {#core-apis}

| Phương thức | Route | Mô tả |
|--------|----------|-------------|
| `POST` | `/v1/chat/completions` | Chat tương thích OpenAI; các khả năng tùy chọn phụ thuộc vào model được chọn |
| `POST` | `/v1/messages` | Messages API tương thích Anthropic |
| `POST` | `/v1/run` | Gửi một yêu cầu tạo nội dung bằng model theo schema riêng của model đó |
| `GET` | `/v1/run/{id}` | Poll trạng thái tạo nội dung bất đồng bộ và lấy kết quả |
| `GET` | `/v1/models` | Liệt kê các model logic đang bật; mặc định là loại LLM |
| `GET` | `/v1/models/{id_or_name}` | Lấy chi tiết model, schema, khả năng và giá |
| `GET` | `/v1/tasks/{task_id}/cost` | Lấy chi phí và mức sử dụng của tác vụ |

## Các nhóm API khác {#additional-api-groups}

Ngoài các API tạo nội dung cốt lõi, SandBase cung cấp API để quản lý vòng đời agent. Xem [Hướng dẫn API cho AI](./full) để biết các quy trình phổ biến và [đặc tả OpenAPI](https://www.sandbase.ai/docs/openapi.yaml) để có hợp đồng đầy đủ.

| Nhóm | Route chính | Mục đích |
|-------|---------------|---------|
| **Agents** | `POST /v1/agents`, `GET /v1/agents`, `POST /v1/agents/{agent_id}` | Tạo và quản lý phiên bản định nghĩa Agent đã lưu |
| **Sessions** | `POST /v1/agents/sessions`, `POST /v1/agents/sessions/{session_id}/events`, `GET /v1/agents/sessions/{session_id}/events` | Chạy Agent, gửi input và stream sự kiện trực tiếp |
| **Skills** | `POST /v1/skills`, `GET /v1/skills` | Gói chỉ dẫn có phiên bản được gắn vào Agent |
| **MCP Connections và Secrets** | `POST /v1/mcp-connections`, `POST /v1/secrets` | Công cụ MCP HTTPS từ xa và Bearer token chỉ ghi của chúng |

Tài nguyên của nền tảng Agents chấp nhận `Authorization: Bearer` hoặc `X-API-Key` và trả về `{"error":{"type","code","param","message"}}` khi thất bại.

## Mô hình giá {#pricing-model}

Trả theo mức sử dụng. Giá phụ thuộc vào từng model và có thể thay đổi độc lập với trang này:

- **Giá model**: đọc công thức và đơn vị hiện tại của model được chọn từ `model_card`
- **Giá token**: có thể gồm các thành phần input, output, cache hoặc reasoning khi model đó khai báo
- **Media và các thao tác khác**: có thể dùng đơn vị theo request, thời lượng, độ phân giải hoặc đơn vị riêng của model
- **Data API** (tìm kiếm, mạng xã hội, scraping, thương mại điện tử, tài chính): mỗi tổ chức có 100 lượt gọi miễn phí mỗi ngày UTC, dùng chung cho các data API đủ điều kiện; sau đó các lượt gọi được tính phí theo lượt, không bị chặn. Trong MCP, các công cụ đủ điều kiện hiển thị `pricing.free_quota` trong `sandbase_inspect`, và `sandbase_account` trả về `free_api_quota` (`daily_limit`, `used_today`, `remaining`, `resets_at`). Xem [Lượt gọi API miễn phí hằng ngày](/guides/billing#daily-free-api-calls).

Tìm model ID hiện tại bằng `GET /v1/models`, rồi kiểm tra `GET /v1/models/{id_or_name}` trước khi gửi request. Đừng giả định rằng giá hay chiết khấu cache được dùng chung giữa các nhà cung cấp.

Khi một thao tác trả về task ID, hãy kiểm tra chi phí đã ghi nhận của nó:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

## Giới hạn tốc độ {#rate-limits}

Không có giá trị mặc định chung nào được công bố. Request phải tuân theo giới hạn số request mỗi phút tùy chọn
được gán cho tổ chức của bạn và dùng chung cho mọi API key của tổ chức. Phản hồi `429` không có header hạn mức hay `Retry-After`; hãy dùng
exponential backoff có giới hạn kèm jitter. Xem [Hướng dẫn lỗi](./errors).

---

## Đọc thêm {#further-reading}

- [Hướng dẫn API cho AI](./full) — các quy trình cốt lõi, cấu trúc request/response và ví dụ curl
- [Model & Giá](./models) — tra cứu model trực tiếp, giá và hướng dẫn về khả năng
- [Hướng dẫn lỗi](./errors) — cấu trúc phản hồi được mô tả, xử lý HTTP và an toàn khi thử lại
- [Đặc tả OpenAPI](https://www.sandbase.ai/docs/openapi.yaml) — OpenAPI 3.1 máy đọc được

## Phiên bản văn bản thuần (cho AI agent) {#plain-text-versions-for-ai-agents}

| Tệp | URL | Nội dung |
|------|-----|---------|
| `llms.txt` | [/docs/llms.txt](https://www.sandbase.ai/docs/llms.txt) | Bản tóm tắt ngắn gọn (~60 dòng) |
| `llms-full.txt` | [/docs/llms-full.txt](https://www.sandbase.ai/docs/llms-full.txt) | Hướng dẫn API mở rộng dành cho AI |
| `openapi.yaml` | [/docs/openapi.yaml](https://www.sandbase.ai/docs/openapi.yaml) | Đặc tả OpenAPI 3.1 máy đọc được |
