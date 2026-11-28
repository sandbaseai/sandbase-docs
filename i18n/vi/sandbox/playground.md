---
i18nSource: 20679b8b1344acb5
title: Sandbox Playground (Thử nghiệm)
description: Dùng thử sandbox SandBase thật bằng API key của riêng bạn. Tạo sandbox, chạy lệnh, kiểm tra tệp sau khi tạm dừng và tiếp tục, và xem các sự kiện vòng đời.
outline: false
aside: false
pageClass: sandbox-playground-page
---

# Sandbox Playground {#sandbox-playground}

Dùng thử Sandbox API bằng key của riêng bạn. Các thao tác kết nối tới **sandbox.sandbase.ai** và có thể phát sinh phí.

<ClientOnly>
  <SandboxPlayground />
</ClientOnly>

## Key của bạn luôn do bạn kiểm soát {#your-key-stays-under-your-control}

- **Chỉ lưu trong bộ nhớ trang.** Playground này không lưu API key hay connection token của bạn vào bộ nhớ trình duyệt hoặc cookie, không đưa chúng vào URL và không ghi chúng vào hoạt động của trang hay ví dụ request.
- **Xóa bất cứ lúc nào.** Chọn **Clear key** để xóa key, connection token và hoạt động đang hiển thị, kể cả khi một request đang chạy. Tải lại hoặc rời khỏi trang này cũng sẽ xóa chúng. Bạn sẽ cần nhập lại key để kết nối lại.
- **Chỉ dùng cho request của bạn.** Key của bạn được gửi tới SandBase để xác thực các thao tác Sandbox bạn yêu cầu. Xóa trang này không thu hồi key; hãy thu hồi trong [Developer → API Keys](https://www.sandbase.ai/console/keys) nếu cần.

Những cam kết này áp dụng cho cách Playground xử lý thông tin xác thực. Chúng không có nghĩa là hoạt động Sandbox hay bản ghi sử dụng phía dịch vụ bị xóa. Tránh nhập secret vào lệnh hoặc tệp, vì nội dung của chúng có thể còn lại trong sandbox của bạn.

## Dọn dẹp tài nguyên riêng {#clean-up-resources-separately}

Xóa key không hủy thao tác mà dịch vụ đã nhận và không xóa sandbox. Hãy xóa các instance khi dùng xong. Nếu không rõ kết quả tạo, hãy kiểm tra các instance trước khi tạo cái khác. Lưu lại mọi instance ID bạn cần để dọn dẹp trước khi xóa trang này.

[Tổng quan và khả năng](./index) · [Bắt đầu nhanh / E2B SDK](./quickstart)
