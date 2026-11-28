---
i18nSource: 1b5099685e9df6ce
title: Danh mục Agent
description: Duyệt các Agent công khai và clone một Agent vào tổ chức của bạn.
---

# Danh mục Agent {#agent-catalog}

Danh mục liệt kê các Agent mà SandBase công bố để tái sử dụng. Các mục trong danh mục là chỉ đọc. Hãy clone một mục để có một Agent riêng trong tổ chức mà bạn có thể chỉnh sửa, chạy và triển khai.

| Phương thức | Đường dẫn | Mục đích |
|---|---|---|
| `GET` | `/v1/agents/catalog` | Liệt kê các Agent công khai |
| `GET` | `/v1/agents/catalog/{agent_id}` | Lấy một Agent công khai, có thể kèm `?version=` |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | Sao chép vào tổ chức của bạn |

## Liệt kê Agent trong danh mục {#list-catalog-agents}

Phân trang theo cursor với `limit` (1-100), `after` và `order`.

```bash
curl "https://api.sandbase.ai/v1/agents/catalog?limit=20" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Mỗi mục có `id`, `object: "agent"`, `visibility: "public"`, `version`, `name`, `description`, `model`, `created_at` và `updated_at`.

## Lấy một Agent trong danh mục {#get-a-catalog-agent}

```bash
curl "https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60?version=2" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`version` là tùy chọn và phải là số nguyên dương. Response chi tiết có thêm đối tượng `configuration` chỉ đọc (name, description, model, instructions, runtime profile, metadata, tools, text, reasoning và Skills).

## Clone một Agent trong danh mục {#clone-a-catalog-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/clone \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: clone-research-agent" \
  -H "Content-Type: application/json" \
  -d '{"name": "My research assistant"}'
```

Body chấp nhận `version` tùy chọn (số nguyên dương, mặc định là phiên bản công khai hiện tại) và `name` (tối đa 128 ký tự). Response là `201 Created` kèm một [đối tượng Agent](./create) đầy đủ với ID `agt_` mới trong tổ chức của bạn. `Idempotency-Key` là tùy chọn; hãy gửi một key ổn định để lần thử lại không tạo ra bản sao thứ hai.

Sau khi clone, hãy [tạo một Session](/api-reference/sessions/create) để kiểm thử.
