---
i18nSource: d560e2374d91a8d6
title: Thanh toán và credit
description: Xem số dư tổ chức SandBase, mua credit bằng Stripe hoặc Airwallex, thiết lập tự động nạp tiền, đổi coupon và tìm hiểu cơ chế kiểm soát chi tiêu theo API key.
---

# Thanh toán và credit {#billing-and-credits}

Trang này hướng dẫn quản lý thanh toán trong [SandBase Console](https://www.sandbase.ai/console). Để xem đơn giá và cách tối ưu chi phí, hãy xem [Bảng giá](/guides/billing).

SandBase tính phí các workload được hỗ trợ từ số dư của tổ chức. Giá hiện hành, ưu đãi, nhà cung cấp thanh toán,
số tiền nạp tối thiểu và phạm vi khu vực được hiển thị trong Console và có thể thay đổi độc lập với
hướng dẫn này.

## Số dư {#balance}

Mở [Developer → Billing](https://www.sandbase.ai/console/billing). Trang **Credits** hiển thị các thông tin sau của tổ chức đang hoạt động:

| Mục | Ý nghĩa |
|------|---------------|
| **Available balance** | Số dư sẵn sàng dùng cho Models và API |
| **Credit limit** | Hạn mức chi tiêu của workspace |
| **Current level** | Cấp tài khoản và mức đồng thời tương ứng |

Số dư này cũng xuất hiện trên thẻ **Balance** ở Console Dashboard và trên thanh đầu trang khi bạn đã đăng nhập.
Hãy coi Console là nguồn chính xác cho khuyến mãi và điều khoản thanh toán; đừng tự động hóa các request mạng nội bộ
của nó.

## Mua credit {#buy-credits}

1. Mở [Billing](https://www.sandbase.ai/console/billing) và kiểm tra **Credits go to** đang hiển thị đúng workspace bạn muốn nạp tiền.
2. Trong **Buy credits**, chọn một mức có sẵn hoặc nhập **Custom amount** bằng USD. Số tiền nạp tối thiểu được hiển thị trên trang.
3. Nếu có nhiều **Payment provider**, hãy chọn **Stripe** (thẻ và ví điện tử toàn cầu) hoặc **Airwallex** (thẻ và phương thức thanh toán nội địa).
4. Xem lại **Pay**, **Bonus** và **Receive** trong phần xem trước, sau đó chọn **Continue with Stripe** (hoặc nhà cung cấp bạn đã chọn) và hoàn tất thanh toán trên trang do nhà cung cấp lưu trữ.
5. Kiểm tra số dư đã cập nhật trong **Credit transactions** trước khi chạy workload nhạy cảm về chi phí.

SandBase không bao giờ lưu thông tin thẻ; trang thanh toán do nhà cung cấp lưu trữ.

### Thưởng nạp lần đầu {#first-top-up-bonus}

Khi tài khoản và workspace chưa từng nạp tiền, **Current offers** sẽ hiển thị khoản thưởng nạp lần đầu. Trang này ghi rõ
tỷ lệ thưởng và mức trần. Mỗi tài khoản và mỗi workspace chỉ được áp dụng một lần thưởng, và khi hoàn tiền, khoản thưởng sẽ bị thu hồi
theo tỷ lệ. Khoản thưởng xuất hiện thành một dòng riêng trong **Credit transactions**.

## Tự động nạp tiền {#auto-top-up}

**Auto Top-up** nạp lại số dư bằng thẻ đã lưu khi số dư giảm xuống dưới một ngưỡng. Hiện tính năng này chỉ hỗ trợ Stripe,
và chỉ owner và admin của workspace mới có thể quản lý.

1. Trong **Payment cards**, chọn **Add Card** và lưu thẻ trong Stripe.
2. Chọn **Turn on auto top-up**, sau đó đặt **When balance goes below**, **Top-up amount**, **Monthly limit** (tùy chọn) và thẻ.
3. Đánh dấu **I authorize these automatic charges** và xác nhận.

Khi đạt hạn mức hằng tháng, tính năng tự động nạp tiền sẽ dừng cho đến hết tháng dương lịch (UTC). Các khoản thanh toán tự động
xuất hiện trong **Credit transactions** với kênh `Auto top-up · Stripe`.

## Đổi mã coupon {#redeem-a-coupon}

Nhập **Coupon code** trong **Redeem a coupon**, sau đó chọn **Redeem credit**. Coupon chỉ áp dụng cho workspace đang
hoạt động, vì vậy hãy kiểm tra tổ chức đã chọn trước.

## Kiểm soát chi tiêu {#spending-controls}

| Cơ chế kiểm soát | Phạm vi | Hành vi |
|---------|-------|----------|
| Giới hạn cấp vốn của tổ chức | Toàn tổ chức | Số dư khả dụng cộng với hạn mức credit đã cấu hình (nếu có); request không đủ tiền có thể trả về HTTP 402 |
| Hạn mức chi tiêu của key | Theo từng API key | Mức trần tùy chọn cho từng key, không vượt quá số dư của tổ chức |
| Hạn mức tự động nạp hằng tháng | Toàn tổ chức | Giới hạn các khoản thanh toán tự động trong mỗi tháng dương lịch (UTC) |

Để đặt hạn mức chi tiêu cho từng key, hãy xem [API Keys](/getting-started/api-keys).

## Activities và Analysis {#activities-and-analysis}

[Developer → Activities](https://www.sandbase.ai/console/activities) có hai tab:

- **Request History** liệt kê từng request kèm API key, model, trạng thái, độ trễ và chi phí.
- **Usage** hiển thị số request và chi phí trong 7 hoặc 30 ngày, **Model APIs by Archived Spend** và **Billing Records**. Cả hai bảng đều có **Export CSV**. File xuất billing records có cột **Free Quota** đánh dấu các lệnh gọi nằm trong hạn mức miễn phí hằng ngày.

[Developer → Analysis](https://www.sandbase.ai/console/analytics) bổ sung **Overview**, **Cost analysis** và
**Health diagnostics** cho 7 hoặc 30 ngày UTC trọn vẹn gần nhất.

Để xem bảng giá công khai và hợp đồng chi phí tác vụ, hãy xem [Bảng giá và mức sử dụng](/guides/billing) và
[Lấy chi phí tác vụ](/api-reference/tasks/cost).
