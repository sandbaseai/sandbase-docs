---
i18nSource: 3dc57d405dbf561d
title: API key
description: Cách tạo, quản lý và bảo mật SandBase API key dùng để xác thực request API.
---

# API key {#api-keys}

API key xác thực các request của bạn gửi đến SandBase. Hướng dẫn này trình bày cách tạo key, dùng key trong request và giữ key an toàn.

## Tạo API key {#create-an-api-key}

1. Đăng nhập vào [SandBase Console](https://www.sandbase.ai/console)
2. Mở **Developer → API Keys** (hoặc vào thẳng [API Keys](https://www.sandbase.ai/console/keys))
3. Nhấn **New key**
4. Nhập **Name** mang tính mô tả (ví dụ: "Production Server", "Local Development")
5. Tùy chọn đặt **Spending limit** (để trống nghĩa là không giới hạn) và ngày **Expires** (để trống nghĩa là không hết hạn)
6. Nhấn **Create key**
7. Sao chép key từ banner **API key created** ngay lập tức, vì key chỉ hiển thị một lần

::: danger Quan trọng
API key chỉ hiển thị một lần khi được tạo. Nếu làm mất, bạn sẽ phải tạo key mới. Hãy lưu key ở nơi an toàn trước khi đóng hộp thoại.
:::

## Định dạng key {#key-format}

API key mới tạo trong Console dùng tiền tố `sk-`, theo sau là 64 ký tự thập lục phân:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Các key `sk-sb-...` hiện có vẫn hợp lệ cho đến khi hết hạn hoặc bị thu hồi. Đừng chỉ dựa vào tiền tố để kiểm tra
thông tin xác thực; hãy luôn coi toàn bộ giá trị là một secret không cần diễn giải.

## Phương thức xác thực {#authentication-methods}

SandBase hỗ trợ hai cách truyền API key trong request:

### Header Authorization (khuyến nghị) {#authorization-header-recommended}

Dùng header tiêu chuẩn `Authorization: Bearer`. Cách này tương thích với SDK của OpenAI và Anthropic:

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek/deepseek-v4-flash", "messages": [{"role": "user", "content": "Hi"}]}'
```

### Anthropic Messages: header x-api-key {#anthropic-messages-x-api-key-header}

`POST /v1/messages` cũng chấp nhận header `x-api-key` gốc của Anthropic:

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "x-api-key: sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "anthropic/claude-sonnet-5", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hi"}]}'
```

::: tip
Trong các model gateway, chỉ `POST /v1/messages` đọc `x-api-key`, và header này được ưu tiên khi có cả hai header được hỗ trợ.
[Tài nguyên nền tảng Agents](/api-reference/authentication#agents-platform-resources) cũng chấp nhận
`X-API-Key`. Hãy dùng header Bearer cho mọi endpoint công khai khác.
:::

## Quyền của key {#key-permissions}

API key của SandBase có phạm vi ở **cấp tổ chức**:

- Key tiêu chuẩn tạo trong Console có thể gọi các tài nguyên API công khai mà tổ chức được dùng
- Mức sử dụng được tính phí cho tổ chức sở hữu key
- Key có thể có ngày hết hạn và hạn mức chi tiêu tùy chọn
- Thông tin xác thực do SandBase cấp, chẳng hạn key CLI Login, có thể mang phạm vi hạn chế và trả về `403` khi dùng ngoài phạm vi đó

Hiện Console chưa cho phép người dùng chọn phạm vi cho key tiêu chuẩn. Key CLI Login được tạo khi bạn kết nối một công cụ AI. Trang API Keys gộp chúng vào một dòng **CLI Login** có thể mở rộng, và bạn không thể chỉnh sửa chúng như key tiêu chuẩn. Key do SandBase tạo cho bạn có nhãn **Auto-created**; các key này không có hạn mức ở cấp key và bị giới hạn bởi số dư tài khoản.

Danh sách key hiển thị **Name**, **Key Prefix**, **Spent**, **Limit**, **Expires** và **Status** của từng key. Dùng **Edit** để đổi tên, hạn mức chi tiêu hoặc ngày hết hạn của key tiêu chuẩn.

Hãy coi mỗi key là thông tin xác thực của ứng dụng chứ không phải mật khẩu cá nhân. Dùng tư cách thành viên tổ chức cho quyền truy cập của con người và API key cho workload.

## Chiến lược theo môi trường {#environment-strategy}

Tạo một key riêng cho từng ứng dụng và môi trường:

| Key | Tên ví dụ | Lý do |
|---|---|---|
| Phát triển cục bộ | `research-app-dev` | Xoay vòng mà không làm gián đoạn production |
| Staging | `research-app-staging` | Tách biệt mức sử dụng và sự cố khi kiểm thử |
| Production | `research-app-production` | Giao cho production một người phụ trách rõ ràng và giới hạn mức phơi nhiễm |
| Tự động hóa tạm thời | `release-check-2026-08` | Đặt ngày hết hạn và thu hồi độc lập |

Ghi lại người phụ trách và bản triển khai sử dụng từng key. Khi xoay vòng, hãy triển khai key mới, kiểm tra các request thành công, rồi mới thu hồi key cũ.

## Hết hạn và thu hồi key {#key-expiration-and-revocation}

### Hết hạn {#expiration}

Khi tạo key, bạn có thể đặt ngày hết hạn (tùy chọn). Sau khi hết hạn, key sẽ ngừng hoạt động và request sẽ trả về lỗi `401 Unauthorized`.

Key không có ngày hết hạn sẽ hợp lệ cho đến khi bị thu hồi thủ công.

### Thu hồi key {#revoking-a-key}

Để thu hồi (vô hiệu hóa) một key:

1. Vào [Developer → API Keys](https://www.sandbase.ai/console/keys)
2. Tìm key bạn muốn thu hồi
3. Nhấn **Revoke**
4. Xác nhận thao tác

Key đã bị thu hồi không thể xác thực request mới. Không thể hoàn tác việc thu hồi; nếu thu hồi nhầm, hãy tạo key mới.

## Thực hành bảo mật tốt nhất {#security-best-practices}

### Không bao giờ commit key vào hệ thống quản lý phiên bản {#never-commit-keys-to-version-control}

Thay vào đó, hãy dùng biến môi trường hoặc trình quản lý secret:

```bash
# .env file (add to .gitignore!)
SANDBASE_API_KEY=sk-your-key-here
```

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

### Dùng key riêng cho từng môi trường {#use-separate-keys-for-different-environments}

Tạo key riêng cho development, staging và production. Nhờ vậy, bạn có thể thu hồi key development bị lộ mà không ảnh hưởng đến production.

### Xoay vòng key định kỳ {#rotate-keys-regularly}

Định kỳ tạo key mới và ngừng dùng key cũ. Việc này thu hẹp khoảng thời gian bị phơi nhiễm nếu key bị lộ.

### Theo dõi hoạt động {#monitor-activity}

Thường xuyên kiểm tra **Developer → Activities** để phát hiện request hoặc mức sử dụng tăng đột biến bất thường, vốn có thể là dấu hiệu key đã bị lộ. **Request History** có thể lọc theo API key.

Nếu key bị lộ, hãy thu hồi ngay, tạo key thay thế, cập nhật ứng dụng sử dụng key và kiểm tra Activities cùng thanh toán để tìm mức sử dụng bất thường. Đừng đợi đến lần xoay vòng theo lịch.

### Đặt ngày hết hạn {#set-expiration-dates}

Với quyền truy cập tạm thời (pipeline CI/CD, quyền cho nhà thầu, demo), hãy đặt ngày hết hạn để key tự động ngừng hoạt động.

## Khắc phục sự cố {#troubleshooting}

| Lỗi | Nguyên nhân | Cách khắc phục |
|-------|-------|-----|
| `401 - missing API key` | Request không có key | Thêm header `Authorization: Bearer <key>` |
| `401 - invalid API key` | Key không tồn tại | Kiểm tra lỗi gõ và đảm bảo đã đưa vào toàn bộ key |
| `401 - API key has been revoked` | Key đã bị thu hồi vĩnh viễn trong Console | Tạo key thay thế |
| `401 - API key has expired` | Key đã quá ngày hết hạn | Tạo key mới hoặc gia hạn |
| `402 - API key spending limit exceeded` | Key đã chạm hạn mức chi tiêu đã cấu hình | Tăng hạn mức hoặc dùng key khác có quyền |
| `403 - insufficient_scope` | Thông tin xác thực có phạm vi không thể gọi endpoint này | Dùng key có quyền với endpoint |

## Bước tiếp theo {#next-steps}

- [**Lệnh gọi API đầu tiên**](/getting-started/first-call) — Thực hiện một lệnh gọi API chi tiết với hướng dẫn đầy đủ về request/response
- [**Xác thực**](/api-reference/authentication) — Các header được hỗ trợ, vòng đời và lỗi riêng theo giao thức
- [**Tham chiếu API**](/api-reference/) — Tài liệu đầy đủ về endpoint
