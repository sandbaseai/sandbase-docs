---
i18nSource: 5b94f91222d138de
title: Xác thực API
description: Xác thực SandBase API bằng Bearer token và các header API key tương thích giao thức được hỗ trợ.
---

# Xác thực {#authentication}

SandBase dùng API key để xác thực các request tới API công khai. Trang này trình bày các phương thức tích hợp được hỗ trợ và
cách quản lý key. Cơ chế xác thực của Console và các API nội bộ của nó không thuộc hợp đồng API công khai.

## Phương thức xác thực {#authentication-methods}

Các endpoint `/v1/*` tiêu chuẩn của SandBase yêu cầu Bearer token. Các thao tác Anthropic Messages và tương thích Google Gemini cũng chấp nhận API key ở các vị trí gốc tương thích với SDK của chúng.

### Bearer token {#bearer-token}

Đưa key vào header `Authorization`:

```http
Authorization: Bearer sk-your-api-key
```

Đây là phương thức tiêu chuẩn mà các SDK tương thích OpenAI sử dụng.

### Anthropic Messages: header x-api-key {#anthropic-messages-x-api-key-header}

Đưa key vào header `x-api-key`:

```http
x-api-key: sk-your-api-key
```

Header này chỉ được hỗ trợ bởi `POST /v1/messages`. Các endpoint công khai khác không đọc header này; hãy dùng xác thực Bearer
cho Chat Completions, `/v1/run` và các API tài nguyên.

### Thứ tự ưu tiên {#priority}

Chỉ với `POST /v1/messages`, `x-api-key` được ưu tiên khi có cả hai header.

### API key tương thích Google Gemini {#google-gemini-compatible-api-keys}

Các thao tác Gemini GenerateContent và Interactions chấp nhận `x-goog-api-key`, `Authorization: Bearer …` hoặc tham số query `key`, theo thứ tự ưu tiên đó. Nên dùng header vì thông tin xác thực trong query string có thể xuất hiện trong log và lịch sử trình duyệt. Xem [Google Gemini](/api-reference/gemini-generate-content) và [Gemini Interactions](/api-reference/gemini-interactions) để biết các đường dẫn được hỗ trợ.

### Logic trích xuất {#extraction-logic}

Các endpoint tiêu chuẩn chỉ đọc `Authorization: Bearer <key>`. Middleware của Anthropic Messages đọc `x-api-key`
trước, sau đó mới dùng header Bearer. Các tài nguyên của nền tảng Agents chấp nhận `Authorization: Bearer` hoặc
`X-API-Key` (xem bên dưới). [Webhook Events API](/api-reference/webhooks) (`/events/webhooks*`) cũng chấp nhận một trong hai
header và dùng header Bearer khi có cả hai. Thiếu thông tin xác thực được hỗ trợ sẽ trả về `401 Unauthorized`.

### Tài nguyên của nền tảng Agents {#agents-platform-resources}

`/v1/agents*` (bao gồm `/v1/agents/sessions*`), `/v1/mcp-connections*`, `/v1/secrets*`
và `/v1/skills*` chấp nhận key ở một trong hai header:

```bash
curl https://api.sandbase.ai/v1/agents \
  -H "X-API-Key: $SANDBASE_API_KEY"
```

- Nếu gửi cả `Authorization: Bearer` và `X-API-Key`, hai header phải mang cùng một key; giá trị khác nhau sẽ trả về `401 unauthorized`. Lặp lại một trong hai header cũng trả về 401.
- `OpenAI-Beta` là tùy chọn. Nếu có, giá trị phải là `agents=v1`.
- Request đọc cần quyền `agents.read` và request ghi cần `agents.write`. Các key tiêu chuẩn tạo từ Console có cả hai quyền. Các key giới hạn phạm vi do SandBase cấp, chẳng hạn key CLI Login, sẽ trả về `403 insufficient_scope`.
- `402 spending_limit_exceeded` nghĩa là giới hạn chi tiêu của key hoặc số dư của tổ chức đã cạn.
- Lỗi dùng [định dạng lỗi của Agents](/api-reference/errors#agents-platform-errors), không phải dạng phẳng `{"error": "…"}` như bên dưới.

## Định dạng API key {#api-key-format}

API key mới tạo từ Console có định dạng sau:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| Thành phần | Mô tả |
|-----------|-------------|
| `sk-` | Tiền tố "secret key" tiêu chuẩn |
| `xxxx...` | 64 ký tự thập lục phân được sinh từ 32 byte ngẫu nhiên |

Các key cũ dạng `sk-sb-...` vẫn dùng được cho đến khi hết hạn hoặc bị thu hồi. Client nên coi key là chuỗi không trong suốt
thay vì từ chối thông tin xác thực dựa trên tiền tố hoặc độ dài.

::: warning
Không bao giờ để lộ API key trong mã phía client, kho mã công khai hoặc log. Hãy bảo vệ nó như mật khẩu.
:::

## Tạo API key {#create-api-keys}

### Qua Console {#via-console}

1. Đăng nhập [SandBase Console](https://www.sandbase.ai/console)
2. Mở **Developer → API Keys**
3. Nhấn **New key**
4. Đặt cho key một tên mô tả rõ ràng (ví dụ: "Production Backend", "Development")
5. Sao chép key ngay lập tức, vì key sẽ không được hiển thị lại

### Thuộc tính của key {#key-properties}

| Thuộc tính | Mô tả |
|----------|-------------|
| Name | Nhãn dễ đọc để nhận diện |
| Organization | Tổ chức sở hữu key này |
| Enabled | Key có đang hoạt động hay không |
| Spending Limit | Mức trần chi tiêu tùy chọn cho từng key |
| Expires At | Ngày hết hạn tùy chọn |
| Created At | Thời điểm tạo key |

Các key tiêu chuẩn tạo từ Console có quyền truy cập cấp tổ chức vào API công khai được mô tả trong tài liệu. Thông tin xác thực do SandBase cấp, chẳng hạn key CLI Login, có thể mang phạm vi bị giới hạn. Console không cho người dùng chọn phạm vi cho key tiêu chuẩn.

## Vòng đời của key {#key-lifecycle}

### Xoay vòng {#rotation}

Để xoay vòng key:

1. Tạo key mới trong Console
2. Cập nhật ứng dụng để dùng key mới
3. Xác nhận key mới hoạt động trên production
4. Thu hồi key cũ

::: tip
Luôn tạo key mới trước khi thu hồi key cũ để tránh gián đoạn dịch vụ.
:::

### Thu hồi {#revocation}

Key đã bị thu hồi không thể xác thực request mới. API trả về `401 Unauthorized` với thông báo:

```json
{"error":"API key has been revoked"}
```

### Hết hạn {#expiration}

Key có thể có ngày hết hạn tùy chọn. Key đã hết hạn trả về `401 Unauthorized` với thông báo:

```json
{"error":"API key has expired"}
```

## Yêu cầu xác thực theo endpoint {#endpoint-authentication-requirements}

| Endpoint | Phương thức xác thực | Mô tả |
|----------|-------------|-------------|
| `POST /v1/chat/completions` | API Key (Bearer) | Chat Completions |
| `POST /v1/responses` | API Key (Bearer) | Responses API tương thích OpenAI |
| `POST /v1/messages` | API Key (Bearer hoặc x-api-key) | Anthropic Messages |
| `/v1beta/models/*` | API Key (x-goog-api-key, Bearer hoặc query key) | Gemini GenerateContent |
| `/v1beta/interactions*` | API Key (x-goog-api-key, Bearer hoặc query key) | Gemini Interactions |
| `/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*` | API Key (Bearer hoặc X-API-Key) | Tài nguyên của nền tảng Agents |

SandBase Console dùng một luồng xác thực trình duyệt riêng. Các request nội bộ của nó không phải endpoint công khai
được hỗ trợ và không được dùng cho tích hợp.

## Cô lập theo tổ chức {#organization-isolation}

API key được giới hạn trong phạm vi một tổ chức. Khi bạn xác thực bằng một key:

- Bạn chỉ có thể truy cập tài nguyên thuộc tổ chức của mình
- Mức sử dụng và thanh toán được theo dõi theo từng tổ chức

## Response lỗi {#error-responses}

| Mã trạng thái HTTP | Thông báo | Nguyên nhân |
|-------------|---------|-------|
| 401 | `missing API key in Authorization header` | Không cung cấp key |
| 401 | `invalid API key` | Không tìm thấy key trong cơ sở dữ liệu |
| 401 | `API key has been revoked` | Key đã bị vô hiệu hóa |
| 401 | `API key has expired` | Key đã quá ngày hết hạn |
| 402 hoặc 403 tùy giao thức | `API key spending limit exceeded` | Đã đạt giới hạn chi tiêu của key; xem hợp đồng lỗi được mô tả cho endpoint đó |
| 403 | `API key is not authorized for this endpoint` | Key giới hạn phạm vi được dùng cho endpoint nằm ngoài phạm vi của nó |

Các thông báo này được trả về trong body phẳng `{"error":"<message>"}`, trừ lỗi phạm vi `403`. Trên các endpoint model và tài khoản,
lỗi đó dùng `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`;
trên tài nguyên của nền tảng Agents, lỗi dùng [định dạng lỗi của Agents](/api-reference/errors#agents-platform-errors) với
`code` là `insufficient_scope`.

## Thực hành bảo mật tốt nhất {#security-best-practices}

### Nên {#do}

- **Lưu key trong biến môi trường**: không bao giờ hardcode key trong mã nguồn
- **Dùng key riêng cho từng môi trường**: key khác nhau cho dev, staging và production
- **Đặt ngày hết hạn**: chọn chu kỳ xoay vòng phù hợp với chính sách bảo mật của bạn
- **Theo dõi mức sử dụng**: kiểm tra Console để phát hiện hoạt động bất thường
- **Chỉ dùng key tiêu chuẩn cho các tác vụ cần truy cập API công khai**: giữ thông tin xác thực CLI Login giới hạn phạm vi trong luồng quản lý của chúng

### Không nên {#don-t}

- **Không commit key vào hệ thống quản lý phiên bản**: thêm `.env` vào `.gitignore`
- **Không dùng chung một key cho các ứng dụng không liên quan**: key riêng giúp việc xoay vòng và xử lý sự cố an toàn hơn
- **Không để lộ key trong mã phía client**: luôn chuyển tiếp qua backend của bạn
- **Không ghi API key vào log**: che key trong log của ứng dụng

### Ví dụ về biến môi trường {#environment-variable-example}

::: code-group

```bash [.env]
SANDBASE_API_KEY=sk-your-api-key
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

:::

## Giới hạn tốc độ theo key {#rate-limiting-by-key}

Giới hạn request được gán theo tổ chức và dùng chung cho tất cả API key của tổ chức đó, nên tạo thêm key không làm tăng
giới hạn. API không công bố giá trị mặc định chung dạng số
hay header cho biết hạn mức còn lại.

Xem [Giới hạn tốc độ](/guides/rate-limiting) để biết chi tiết về giới hạn và cách xử lý response 429.
