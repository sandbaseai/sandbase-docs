---
i18nSource: ee126767f58b111b
title: MCP Connections API
description: Đăng ký các MCP server HTTPS từ xa mà Agent có thể gọi.
---

# MCP Connections API {#mcp-connections-api}

MCP connection đăng ký một MCP server từ xa có thể truy cập qua HTTPS. Agent tham chiếu connection trong `mcp_connections`; mỗi Session cố định cấu hình connection khi bắt đầu. ID connection dùng tiền tố `mcp_`. Để xác thực với server bằng Bearer token, trước tiên hãy tạo một [Secret](/agents/api-credentials#with-the-api) cho cùng URL.

| Phương thức | Path | Mục đích |
|---|---|---|
| `POST` | `/v1/mcp-connections` | [Tạo connection](#create-a-connection) |
| `GET` | `/v1/mcp-connections` | [Liệt kê connection](#list-connections) |
| `GET` | `/v1/mcp-connections/{connection_id}` | [Lấy một connection](#get-a-connection) |
| `PUT` | `/v1/mcp-connections/{connection_id}` | [Thay thế connection](#replace-a-connection) |
| `POST` | `/v1/mcp-connections/{connection_id}/enable` | [Bật connection](#enable-a-connection) |
| `DELETE` | `/v1/mcp-connections/{connection_id}` | [Tắt connection](#disable-a-connection) |

Mọi thao tác ghi đều yêu cầu `Idempotency-Key` (1-128 byte, không có khoảng trắng ở đầu hoặc cuối). Đối tượng connection có `id`, `name`, `server_url`, `secret_id` (khi được đặt), `status` (`active` hoặc `disabled`), `row_version`, `created_at` và `updated_at`.

## Tạo connection {#create-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
```

- `name` là bắt buộc, không được để trống, tối đa 128 byte.
- `server_url` phải là HTTPS, không chứa thông tin người dùng, query hoặc fragment (tối đa 2048 byte).
- `secret_id` là tùy chọn. Bỏ qua trường này cho server ẩn danh. Khi được đặt, Secret phải ở trạng thái `active` và `server_url` của nó phải khớp chính xác với `server_url` này, nếu không request sẽ thất bại (409 với Secret không hoạt động, 400 khi URL không khớp).

Trả về `201 Created`.

## Liệt kê connection {#list-connections}

```bash
curl "https://api.sandbase.ai/v1/mcp-connections?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Phân trang theo offset với `data`, `total`, `limit` và `offset`. `limit` mặc định là 20 và tối đa là 200; giá trị bị thiếu, không hợp lệ hoặc không dương sẽ dùng 20. `offset` mặc định là 0; giá trị không hợp lệ hoặc không dương sẽ dùng 0. Tăng dần theo `limit` được trả về cho đến khi `offset + data.length >= total`. Tài nguyên đã tắt vẫn hiển thị trong danh sách.

## Lấy một connection {#get-a-connection}

```bash
curl https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

## Thay thế connection {#replace-a-connection}

```bash
curl -X PUT https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-v2" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "row_version": 1}'
```

`PUT` thay thế đồng thời `name`, `server_url` và `secret_id`; bỏ qua `secret_id` sẽ khiến connection trở thành ẩn danh. `row_version` là bắt buộc và phải khớp với giá trị hiện tại do Get Connection trả về. Trả về `200 OK` cùng connection đã cập nhật. Connection đã tắt vẫn ở trạng thái tắt sau khi thay thế cho đến khi bạn bật lại.

## Bật connection {#enable-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13/enable \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-enable" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 3}'
```

`row_version` là bắt buộc và phải là số nguyên dương khớp với tài nguyên hiện tại. Trả về `200 OK` cùng connection. Việc bật giữ nguyên ID connection. Thao tác này không khôi phục Secret đã bị thu hồi; trước tiên hãy thay thế connection bằng một Secret mới đang hoạt động.

## Tắt connection {#disable-a-connection}

```bash
curl -X DELETE https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-disable"
```

Trả về `204 No Content` và đặt `status` thành `disabled`. Session mới không thể dùng connection này, và các Session hiện có đã cố định nó sẽ từ chối input tiếp theo. Lệnh gọi tool đang chạy không bị gián đoạn.

## Thay đổi và Session đang chạy {#changes-and-running-sessions}

Session cố định thiết lập connection khi bắt đầu. Sau khi bạn thay thế connection hoặc xoay vòng Secret của nó, Session mới dùng cấu hình mới còn Session hiện có giữ snapshot của mình. Tắt connection hoặc thu hồi Secret của nó sẽ chặn cả Session mới lẫn input tiếp theo cho các Session hiện có.

## Lỗi và thử lại {#errors-and-retries}

Lỗi dùng [cấu trúc lỗi của Agents](/api-reference/errors#agents-platform-errors). Trường không hợp lệ hoặc thiếu idempotency key khi ghi sẽ trả về `400 invalid_request`; tài nguyên không xác định hoặc không thể truy cập trả về `404 not_found`. `row_version` đã cũ, trạng thái vòng đời không tương thích, hoặc dùng lại key tạo/cập nhật với input khác sẽ trả về `409 conflict`. Hãy đọc lại tài nguyên trước khi gửi bản cập nhật mới, và dùng key mới cho mỗi thao tác ghi mới.

`created_at` và `updated_at` là chuỗi timestamp RFC 3339.
