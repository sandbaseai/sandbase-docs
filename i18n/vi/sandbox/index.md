---
i18nSource: 4191d2eb16a594f5
title: Tổng quan và tính năng của Sandbox
description: Tạo sandbox bằng E2B SDK hoặc SandBase Console, kiểm tra trạng thái, log và chỉ số, và khám phá Playground thử nghiệm riêng biệt.
---

# Tổng quan và tính năng của Sandbox {#sandbox-overview-and-capabilities}

Sandbox cung cấp các môi trường cô lập để chạy lệnh, thực thi mã và đọc hoặc ghi file. Bạn có thể tạm dừng một instance, kết nối lại với nó và đọc lại một file để xác minh dữ liệu được lưu giữ.

[Bắt đầu nhanh / E2B SDK](./quickstart) · [Mở Playground (thử nghiệm)](./playground)

Dùng [E2B SDK chính thức](./quickstart) để tích hợp Sandbox vào ứng dụng của bạn. Đăng nhập vào [Sandbox Console](https://www.sandbase.ai/console/sandboxes) để tạo sandbox và xem trạng thái, log và chỉ số của instance. Xem [tổng quan sản phẩm Sandbox](https://www.sandbase.ai/sandbox) để có phần giới thiệu. Phần hướng dẫn từng bước và bảng hỗ trợ bên dưới mô tả Playground thử nghiệm riêng biệt.

## Hướng dẫn Playground trong năm phút {#a-five-minute-playground-walkthrough}

1. Nhập một [API key](/getting-started/api-keys) có quyền Sandbox. Việc kết nối chỉ đọc template và instance.
2. Chọn một template có sẵn, xác nhận thông báo về tài nguyên và tạo một instance tồn tại ngắn hạn.
3. Chạy ví dụ thông tin hệ thống hoặc ví dụ Python. Theo dõi đầu ra và sự kiện tiến trình bên cạnh bảng lệnh.
4. Ghi và kiểm tra một file văn bản, tạm dừng instance, tiếp tục chạy nó, rồi đọc lại cùng file đó.
5. Kiểm tra sự kiện vòng đời, chỉ số, log và bằng chứng về thời gian máy. Xóa instance khi hoàn tất.

Làm mới trang sẽ xóa thông tin xác thực của trang và lịch sử thao tác cục bộ; thao tác này không xóa sandbox. Instance đang chạy tuân theo thời gian chờ của server. Instance đã tạm dừng có thể vẫn giữ tài nguyên. Hãy ghi lại ID instance và dùng công cụ của tổ chức để đối chiếu và dọn dẹp tài nguyên sau khi rời trang.

## Tính năng và giới hạn {#capabilities-and-boundaries}

| Tính năng | Hỗ trợ trong Playground |
| --- | --- |
| Tạo, liệt kê, tạm dừng, tiếp tục, gia hạn thời gian chờ, xóa | Có sẵn; các thao tác thay đổi chỉ áp dụng cho instance được tạo trong phiên trang này |
| Lệnh và file văn bản | Có sẵn; lệnh chạy tối đa 25 giây, chỉnh sửa file giới hạn trong `/tmp/` và 32 KiB |
| Sự kiện vòng đời, log, chỉ số, thời gian máy | Tình trạng khả dụng khác nhau tùy môi trường; hãy kiểm tra kết quả được trả về |
| Chat AI và ngữ cảnh hội thoại | Chưa được tích hợp; cần cấu hình model và khối lượng công việc Agent |
| PTY, cổng ứng dụng, webhook, build template | Không có trong giao diện này |
| Snapshot và fork | Không có trong Playground này |

Tương tác shell không phải là chat AI. Khôi phục instance, lưu giữ file, duy trì tiến trình và tính liên tục của hội thoại là những thứ riêng biệt cần được xác minh.

## Hiểu về sự kiện {#understanding-events}

Các mục **Sandbox lifecycle** là sự kiện gốc của server, được lấy khi làm mới và có thể đến muộn. Các mục **Sandbox process** mô tả việc khởi động tiến trình và đầu ra được stream. Các mục **Playground** ghi lại việc request cục bộ hoàn tất hay thất bại; chúng không phải là sự kiện vòng đời của dịch vụ.

Danh sách rỗng không chứng minh mức sử dụng bằng 0, và thiếu sự kiện không chứng minh thao tác đã thất bại. Bằng chứng về thời gian máy không phải là hóa đơn cuối cùng. Hãy đối chiếu instance sau khi hết thời gian chờ hoặc kết nối bị gián đoạn trước khi thử gửi request tạo khác.

## Khả năng hiển thị template {#template-visibility}

Template có thể là công khai hoặc riêng tư trong tổ chức của bạn. Số lượng không cố định. Các mục không có tên vẫn hiển thị, dùng alias hoặc ID làm nhãn thay thế. Quyền truy cập của tổ chức và tình trạng khả dụng của template quyết định bạn có thể xem và dùng những template nào.

## Sandbox và Agent Session {#sandboxes-and-agent-sessions}

Agents Session chạy trên cloud được lưu trữ của SandBase. Chúng tách biệt với các instance Sandbox bạn tạo bằng E2B SDK, và Agents API không cung cấp instance Sandbox. Xem [Sessions](/agents/sessions).
