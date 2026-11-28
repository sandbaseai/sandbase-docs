---
i18nSource: 3b9b3fc27f878cd5
title: Account API
description: Kiểm tra số dư của tổ chức và lịch sử thực thi gần đây gắn với một API key.
---

# Account API {#account-api}

Các endpoint Account chỉ đọc và hoạt động trên tổ chức được xác định từ Bearer API key.

| Thao tác | Endpoint |
|---|---|
| [Lấy số dư](./balance) | `GET /v1/account/balance` |
| [Liệt kê lịch sử thực thi](./history) | `GET /v1/account/history` |

Giá trị số dư và chi phí là chuỗi thập phân chính xác. Hãy giữ chúng ở dạng thập phân thay vì chuyển đổi qua
phép tính dấu phẩy động nhị phân.

Lịch sử thực thi dùng để kiểm tra vận hành gần đây. Hãy dùng bản ghi thanh toán hoặc dữ liệu xuất để đối soát
tài chính dài hạn.

Bộ lọc lịch sử dùng timestamp UTC thô. Khi không có `request_id`, tham số tương thích tùy chọn `timezone` được kiểm tra là tên múi giờ IANA nhưng không chuyển đổi timestamp trong phản hồi; chế độ `request_id` chính xác bỏ qua nó cùng các bộ lọc khác. Giá trị `type` không xác định sẽ không áp dụng bộ lọc loại thực thi; hãy dùng `multimodal`, `llm` hoặc `api` để lọc hiệu quả. Giá trị `range` không được hỗ trợ sẽ quay về `7d`.

Các mục lịch sử có thể chứa tham số yêu cầu đã lưu và đầu ra của model. Hãy hạn chế quyền truy cập API key cho phù hợp,
và đừng sao chép phản hồi lịch sử vào log hay phiếu hỗ trợ khi chưa kiểm tra dữ liệu nhạy cảm.
