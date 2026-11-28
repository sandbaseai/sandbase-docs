---
i18nSource: dab112fdbbc56799
title: Thông tin xác thực cho công cụ MCP
description: Lưu Bearer token chỉ ghi dưới dạng Secret để Agent có thể gọi các máy chủ MCP cần xác thực.
---

# Thông tin xác thực cho công cụ MCP {#credentials-for-mcp-tools}

Khi một máy chủ MCP yêu cầu xác thực, hãy lưu Bearer token của máy chủ đó dưới dạng **Secret** và gắn Secret vào một [kết nối MCP](/agents/mcp-tools#mcp-connections). Môi trường thực thi chỉ gửi token đến đúng máy chủ đó.

## Cách Secret hoạt động {#how-secrets-work}

- `kind` luôn là `mcp_bearer`: một Bearer token cho một máy chủ MCP.
- Mỗi Secret được gắn với đúng một `server_url`. Kết nối chỉ dùng được Secret khi `server_url` của kết nối khớp. Để dùng URL khác, hãy tạo một Secret khác.
- Token là dữ liệu chỉ ghi. API trả về tên, URL, trạng thái và `row_version` của Secret, không bao giờ trả về token.
- Secret không phải biến môi trường. Secret không được đưa vào runtime của Agent và Agent không thể đọc chúng.

Các phiên bản SandBase trước đây lưu thông tin xác thực theo phạm vi workspace hoặc Agent và đưa chúng vào dưới dạng biến môi trường như `GITHUB_TOKEN`. Mô hình đó đã ngừng sử dụng và các bản ghi cũ không được di chuyển. Hãy tạo lại những giá trị bạn vẫn cần dưới dạng Secret trên kết nối MCP.

## Dùng API {#with-the-api}
Tạo, xoay vòng và thu hồi Secret bằng API. Hướng dẫn này là hợp đồng API; trang Credentials của Console, mở từ trình chỉnh sửa Agent, không phải tài liệu tham chiếu cho hành vi của Secret. Hãy gọi các endpoint này từ backend tin cậy, không bao giờ từ mã chạy trên trình duyệt: chúng nhận SandBase API key và token dạng văn bản thuần.

| Phương thức | Đường dẫn | Mục đích |
|---|---|---|
| `POST` | `/v1/secrets` | [Tạo Secret](#create-a-secret) |
| `GET` | `/v1/secrets` | [Liệt kê Secret](#list-secrets) |
| `GET` | `/v1/secrets/{secret_id}` | [Lấy một Secret](#get-a-secret) |
| `POST` | `/v1/secrets/{secret_id}/rotate` | [Xoay vòng token](#rotate-a-secret) |
| `DELETE` | `/v1/secrets/{secret_id}` | [Thu hồi Secret](#revoke-a-secret) |

Mọi thao tác ghi đều yêu cầu `Idempotency-Key` (1-128 byte, không có khoảng trắng ở đầu hoặc cuối). Đối tượng Secret có `id` (tiền tố `sec_`), `name`, `kind`, `server_url`, `status`, `row_version`, `created_at` và `updated_at`. `status` là `pending` trong lúc token đang được lưu, `active` khi có thể sử dụng và `disabled` sau khi bị thu hồi. `created_at` và `updated_at` là chuỗi thời gian theo RFC 3339.

### Tạo Secret {#create-a-secret}

```bash
python3 -c 'import json, os; print(json.dumps({"name": "GitHub MCP token", "kind": "mcp_bearer", "server_url": "https://mcp.example.com/github", "token": os.environ["GITHUB_MCP_TOKEN"]}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

- `kind` phải là `mcp_bearer`.
- `server_url` phải là HTTPS, không chứa thông tin người dùng, query hoặc fragment. Secret chỉ hoạt động với đúng URL này.
- `name` và `token` là bắt buộc và không được để trống. `name` tối đa 128 byte, `token` tối đa 16384 byte và `server_url` tối đa 2048 byte.

Response là `201 Created` và không chứa token. Dùng ID `sec_` làm `secret_id` khi bạn [tạo kết nối MCP](/api-reference/mcp-connections/#create-a-connection).

### Liệt kê Secret {#list-secrets}

```bash
curl "https://api.sandbase.ai/v1/secrets?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Phân trang theo offset với `data`, `total`, `limit` và `offset`. `limit` mặc định là 20 và tối đa là 200; giá trị bị thiếu, không hợp lệ hoặc không dương sẽ dùng 20. `offset` mặc định là 0; giá trị không hợp lệ hoặc không dương sẽ dùng 0. Tăng dần theo `limit` được trả về cho đến khi `offset + data.length >= total`. Secret đã bị vô hiệu hóa vẫn xuất hiện trong danh sách.

### Lấy một Secret {#get-a-secret}

```bash
curl https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

### Xoay vòng Secret {#rotate-a-secret}

Đặt `SECRET_ROW_VERSION` thành `row_version` mới nhất từ thao tác lấy Secret.

```bash
python3 -c 'import json, os; print(json.dumps({"token": os.environ["GITHUB_MCP_TOKEN"], "row_version": int(os.environ["SECRET_ROW_VERSION"])}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61/rotate \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token-rotate-1" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

Việc xoay vòng thay thế token nhưng giữ nguyên Secret và `server_url`. `token` và `row_version` (số nguyên dương) là bắt buộc, Secret phải ở trạng thái `active` và `row_version` phải khớp với giá trị mới nhất. Trả về `201 Created`. Các Session mới dùng token mới; các Session đã bắt đầu vẫn giữ thông tin xác thực đã cố định lúc khởi tạo.

### Thu hồi Secret {#revoke-a-secret}

```bash
curl -X DELETE https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-token-revoke"
```

Trả về `204 No Content` và đặt `status` thành `disabled`. Các kết nối dùng Secret này sẽ ngừng hoạt động với Session mới và với input tiếp theo của Session hiện có. Không thể hoàn tác việc thu hồi: hãy tạo Secret mới và thay thế kết nối.

### Lỗi và thử lại {#errors-and-retries}

Lỗi dùng [định dạng lỗi của Agents](/api-reference/errors#agents-platform-errors). Trường không hợp lệ hoặc thiếu idempotency key khi ghi sẽ trả về `400 invalid_request`; Secret không tồn tại hoặc không truy cập được trả về `404 not_found`. `row_version` đã cũ, trạng thái vòng đời không tương thích hoặc dùng lại key tạo với input khác sẽ trả về `409 conflict`. Hãy đọc lại Secret trước khi thử lại và dùng key mới cho mỗi thao tác ghi mới.

## Bảo mật {#security}

- Tạo và xoay vòng Secret từ backend tin cậy, không bao giờ từ mã chạy trên trình duyệt.
- Đọc token từ kho secret hoặc môi trường của riêng bạn, như `$GITHUB_MCP_TOKEN` ở trên, thay vì dán trực tiếp vào script.
- Không đưa token vào chỉ dẫn, input của Session, metadata hoặc gói Skill.
- Thu hồi Secret ngay khi token có thể đã bị lộ, sau đó tạo Secret mới và thay thế kết nối.

## Bước tiếp theo {#next-steps}

- [Skills và công cụ MCP](/agents/mcp-tools)
- [MCP Connections API](/api-reference/mcp-connections/)
