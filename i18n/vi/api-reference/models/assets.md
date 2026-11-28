---
i18nSource: 43d08f60800d37f5
title: Media Assets API
description: Đăng ký Asset media có thể tái sử dụng và lấy metadata cùng URL tải xuống hiện tại của chúng.
---

# Media Assets API {#media-assets-api}

Dùng giao thức Asset tương thích chính thức tại `/v1/assets` để đăng ký URL media và lấy `asset_url` cho
các yêu cầu tạo video gốc.

Để xem ví dụ đầy đủ đăng ký media và dùng tham chiếu `asset://` được trả về với Seedance, xem
[Dùng Asset media đã đăng ký](/api-reference/volcengine-contents-generations#use-registered-media-assets) trong tài liệu tham khảo Seedance.

## Tổng quan {#overview}

| Phương thức | Đường dẫn | Mô tả |
|--------|------|-------------|
| `POST` | `/v1/assets` | Đăng ký một Asset |
| `GET` | `/v1/assets/{id}` | Lấy metadata của Asset và URL tải xuống hiện tại |

## POST /v1/assets {#post-v1-assets}

Đăng ký một URL tệp truy cập công khai vào thư viện asset và trả về `asset_url` có thể được tham chiếu trong các yêu cầu tạo video.

### Request {#request}

```http
POST /v1/assets
Authorization: Bearer $SANDBASE_API_KEY
Content-Type: application/json
```

```json
{
  "url": "https://example.com/tea-ad.mp4",
  "asset_type": "Video",
  "name": "Tea ad reference video"
}
```

| Trường | Kiểu | Bắt buộc | Mô tả |
|-------|------|----------|--------------|
| `url` | string | Có | URL tệp truy cập công khai |
| `asset_type` | string | Có | Loại asset: `Image` / `Video` / `Audio` (phân biệt hoa thường) |
| `name` | string | Không | Tên asset tùy chọn |

### Response {#response}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| Trường | Mô tả |
|-------|--------------|
| `id` | ID bản ghi nội bộ |
| `asset_url` | Địa chỉ tham chiếu dùng trong yêu cầu tạo video |
| `asset_type` | Loại asset |
| `name` | Tên asset |
| `created_at` | Thời điểm tạo |

### Dùng asset_url {#using-asset-url}

Sau khi đăng ký, hãy truyền `asset_url` vào một trường đầu vào chấp nhận tham chiếu Asset trong schema trực tiếp của model được chọn. Tên trường khác nhau tùy model; ví dụ:

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-hx4hf"},
  "role": "reference_video"
}
```

### Lỗi {#errors}

| Mã trạng thái HTTP | Mô tả |
|-------------|--------------|
| 400 | Thiếu trường bắt buộc hoặc `asset_type` không hợp lệ |
| 502 | Đăng ký asset ở upstream thất bại |
| 500 | Không có thông tin xác thực khả dụng hoặc lỗi nội bộ |

---

## GET /v1/assets/{id}

Lấy URL tải xuống đã ký của một asset đã đăng ký theo ID bên ngoài của nó. Dùng để xem trước hoặc tải xuống tệp gốc.

### Request {#request-1}

```http
GET /v1/assets/asset-20260710150403-hx4hf
Authorization: Bearer $SANDBASE_API_KEY
```

| Tham số | Vị trí | Mô tả |
|-----------|----------|--------------|
| `id` | path | ID bên ngoài (phần sau `asset://` trong `asset_url`) |

### Response {#response-1}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "external_id": "asset-20260710150403-hx4hf",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "status": "Active",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "download_url": "https://cdn.example.com/...?X-Tos-Expires=43200",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| Trường | Mô tả |
|-------|--------------|
| `asset_url` | Địa chỉ tham chiếu cho việc tạo video (vĩnh viễn) |
| `status` | Trạng thái vòng đời của Asset do nhà cung cấp báo cáo. Hãy coi đây là chuỗi mở. |
| `download_url` | URL tải xuống do nhà cung cấp trả về; có thể rỗng khi Asset chưa sẵn sàng |

### Lỗi {#errors-1}

| Mã trạng thái HTTP | Mô tả |
|-------------|--------------|
| 404 | Không tìm thấy asset hoặc asset không thuộc tổ chức của bạn |
| 502 | Truy vấn upstream thất bại |

---

## Lưu ý {#notes}

::: tip Quan trọng
- `asset_url` có định dạng `asset://{external_id}` và là tham chiếu có thể tái sử dụng để truyền vào các đầu vào model được hỗ trợ
- Hãy coi `download_url` là do nhà cung cấp quản lý. Nếu nó rỗng hoặc không còn hoạt động, hãy truy vấn lại endpoint này để lấy giá trị hiện tại
- `asset_type` phân biệt hoa thường: `Image` / `Video` / `Audio`
- URL được gửi phải truy cập công khai được (nền tảng cần tải được nó)
:::
