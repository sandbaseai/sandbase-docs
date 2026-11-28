---
i18nSource: 91c5a0d1b6de6434
title: Giá và mức sử dụng
description: Tìm giá model hiện tại, kiểm tra chi phí tác vụ và quản lý thanh toán SandBase một cách an toàn.
---

# Giá và mức sử dụng {#pricing-and-usage}

SandBase tính phí theo mức sử dụng thực tế. Tình trạng khả dụng của model, công thức giá, hệ số cache và phí riêng của từng tính năng
có thể thay đổi độc lập, vì vậy các tích hợp nên đọc metadata trực tiếp thay vì dựa vào bảng giá
được sao chép lại.

## Lượt gọi API miễn phí hằng ngày {#daily-free-api-calls}

Mỗi tổ chức nhận 100 lượt gọi data API miễn phí (search, social, scraping, e-commerce, finance) mỗi ngày theo UTC. Hạn mức
này được dùng chung cho mọi data API đủ điều kiện và mọi key của tổ chức, và được đặt lại lúc 00:00 UTC. LLM và
model media không đủ điều kiện. Một số data API cũng không đủ điều kiện: các API giá cao hoặc tính giá theo công thức, chẳng hạn một số
endpoint batch, endpoint crawl, Xiaohongshu PGY và các tuyến Douyin Xingtu `kol-*`, bị tính phí ngay từ lượt gọi đầu tiên.
Để kiểm tra một tool, hãy chạy `sandbase_inspect`: tool đủ điều kiện có `pricing.free_quota`, còn tool không có trường này luôn
bị tính phí.

- Lượt gọi trong hạn mức không bị tính phí, và tổ chức có số dư bằng 0 vẫn có thể dùng chúng.
- Sau lượt gọi thứ 100, các lượt gọi đủ điều kiện vẫn hoạt động và được tính phí theo từng lượt với giá mà tool hiển thị. Chúng không
  bị từ chối hay giới hạn tốc độ vì đã dùng hết hạn mức.
- Lượt gọi chưa dùng không được cộng dồn sang ngày hôm sau.

Trong [SandBase MCP tools](/setup/), `sandbase_inspect` đánh dấu tool đủ điều kiện bằng `pricing.free_quota`
(`daily_limit`, `scope`, `resets`). `sandbase_account` trả về hạn mức hôm nay dưới dạng `free_api_quota` với
`daily_limit`, `used_today`, `remaining` và `resets_at`; `used_today` và `remaining` bị bỏ qua khi số đếm
tạm thời không khả dụng. Sau khi một lần chạy được quyết toán, `sandbase_run` và `sandbase_run_get` báo `free_quota_status`:
`free` (nằm trong hạn mức), `overage` (bị tính phí sau khi đã dùng hết hạn mức) hoặc `degraded` (không bị tính phí
vì số đếm hạn mức không khả dụng).

## Quản lý thanh toán trong Console {#manage-billing-in-the-console}

Dùng **Developer → Billing** để xem số dư, mua credit, thiết lập tự động nạp tiền, đổi coupon và quản lý các thiết lập thanh toán có sẵn cho
tổ chức của bạn. Mở **Developer → Activities → Usage** để xem tổng hợp request, token và chi phí ở cấp tổ chức.

::: info Ranh giới của API công khai
Các endpoint số dư, nạp tiền, xuất dữ liệu thanh toán và mức sử dụng toàn tổ chức hiện không thuộc API công khai
được hỗ trợ. Đừng tự động hóa các request mạng của Console hay phụ thuộc vào các tuyến nội bộ của Console.
:::

## Đọc giá model hiện tại {#read-current-model-pricing}

Trước tiên, hãy tìm một model đang bật:

```bash
curl 'https://api.sandbase.ai/v1/models?q=gpt' \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Sau đó yêu cầu model card đầy đủ của nó:

```bash
curl https://api.sandbase.ai/v1/models/deepseek/deepseek-v4-flash \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Endpoint danh sách được tối ưu cho việc khám phá và cố ý bỏ qua giá chi tiết cho token, cache và suy luận.
Hãy đọc giá chi tiết của model đã chọn từ `model_card` trong response chi tiết. Không có công thức chung nào
áp dụng cho mọi LLM, model media, model embedding hoặc tính năng API.

## Kiểm tra chi phí đã ghi nhận của một tác vụ {#check-one-task-s-recorded-cost}

Khi một thao tác trả về ID tác vụ, hãy truy vấn bản ghi quyết toán của nó:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Response phân biệt `cost` hiện tại với `estimated_cost` và cho biết việc quyết toán đã hoàn tất hay chưa. Đừng
dùng `cost` để đối soát thanh toán cho đến khi `settled` là `true`. Bản ghi tác vụ là dữ liệu tra cứu vận hành chứ không phải
sổ kế toán. Hãy dùng bản ghi thanh toán và file xuất CSV có trong **Developer → Activities → Usage**
để đối soát và lưu trữ lâu dài.

## Cách kiểm soát chi phí {#cost-control-practices}

- Lấy model card hiện tại trước khi khởi chạy một khối lượng công việc mới.
- Kiểm tra `capability_tags`, `supported_modes` và `unified_schema`; các lựa chọn rẻ hơn chỉ hữu ích khi chúng
  hỗ trợ đúng hành vi input và output cần thiết.
- Hạn chế ngữ cảnh prompt không cần thiết và đặt giới hạn token đầu ra phù hợp khi model đã chọn hỗ trợ.
- Coi cache là tính năng riêng của từng model. Hãy kiểm tra model card và các trường usage được trả về thay vì giả định có
  mức giảm giá chung cho cả nhà cung cấp.
- Chỉ ghi lại ID tác vụ để tra cứu chi phí tác vụ; với công việc `/v1/run` bất đồng bộ, hãy ghi lại run ID dạng chuỗi mờ được trả về và chỉ poll `GET /v1/run/{id}` khi status là `pending` hoặc `running`.
- Dùng các công cụ kiểm soát chi tiêu có trong Console cho tổ chức của bạn.

## Lỗi thanh toán {#payment-errors}

Một thao tác API có thể trả về HTTP `402` khi tổ chức không đủ tiền cho request. Cấu trúc lỗi khác nhau tùy
lớp tương thích của API, vì vậy hãy xử lý theo HTTP status và đối tượng lỗi được mô tả thay vì so khớp một chuỗi
thông báo. Sau khi giải quyết vấn đề thanh toán trong Console, hãy thử lại theo quy tắc idempotency và khôi phục của thao tác đó.

Các yêu cầu tạo video cũng được kiểm tra dựa trên chi phí ước tính trước khi bắt đầu. Một lần nạp từ $10 trở lên
sẽ nâng cấp độ tài khoản của bạn, cho phép chạy nhiều tác vụ video cùng lúc hơn. Xem
[Giới hạn đồng thời](/guides/concurrency-limits).

Xem [Model và giá](/for-agents/models), [Chi phí tác vụ](/api-reference/tasks/cost) và
[Lỗi](/api-reference/errors) để biết các hợp đồng công khai hiện tại.
