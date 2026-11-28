---
i18nSource: adfacb669489863e
title: Tài khoản và thanh toán
description: Quản lý tổ chức SandBase, API key, thanh toán, mức sử dụng và giới hạn của bạn.
---

# Tài khoản và thanh toán {#account-and-billing}

Phần cài đặt tổ chức của bạn quyết định ai sở hữu mức sử dụng, ứng dụng xác thực như thế nào và chi tiêu được theo dõi ra sao.

## Những gì bạn quản lý {#what-you-manage}

| Hạng mục | Dùng để |
|---|---|
| [Tổ chức](/admin/organizations) | Quản lý phạm vi không gian làm việc, thành viên và quyền sở hữu |
| [API Key](/getting-started/api-keys) | Tạo, xoay vòng và thu hồi thông tin xác thực của ứng dụng |
| [Thanh toán và credit](/admin/billing) | Xem số dư, mua credit, thiết lập tự động nạp tiền và xem mức sử dụng trong Activities và Analysis |
| [Giá và mức sử dụng](/guides/billing) | Tra cứu giá model, số lượt gọi API miễn phí hằng ngày và chi phí của một tác vụ |
| [Giới hạn tốc độ](/guides/rate-limiting) | Hiểu giới hạn request và cách thử lại an toàn |

## Thiết lập khuyến nghị {#recommended-setup}

1. Xác nhận bạn đang làm việc trong đúng tổ chức.
2. Tạo các API key riêng cho môi trường development, staging và production.
3. Đặt tên key theo ứng dụng và môi trường sử dụng.
4. Xem lại Activities và thông tin thanh toán sau các request production đầu tiên.
5. Thu hồi các key không dùng đến và kịp thời điều tra mức sử dụng bất thường.

## Quyền sở hữu và truy cập {#ownership-and-access}

API key và mức sử dụng thuộc về một tổ chức. Khi chuyển tổ chức, các tài nguyên, key và ngữ cảnh thanh toán hiển thị trong Console cũng thay đổi theo. Trước khi thay đổi cấu hình production, hãy kiểm tra tổ chức đang chọn và phối hợp việc xoay vòng key với các ứng dụng đang dùng key đó.

## Bảo mật cơ bản {#security-basics}

- lưu key trong biến môi trường hoặc trình quản lý secret
- không bao giờ dán key vào chỉ dẫn của Agent, mã nguồn, ảnh chụp màn hình hoặc tin nhắn gửi bộ phận hỗ trợ
- dùng một key riêng cho mỗi ứng dụng và môi trường
- thu hồi key ngay nếu key có thể đã bị lộ
- theo dõi Activities để phát hiện lưu lượng, model hoặc endpoint bất thường
