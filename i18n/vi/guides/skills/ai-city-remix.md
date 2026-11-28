---
i18nSource: ff1347dede49419a
agentDoc: ai-city-remix-agent-en
title: Tham gia AI City Remix
description: Nhận credit AI City Remix, chọn thành phố và Skill, tạo video bằng agent cục bộ và tải lên để xét duyệt.
---

# Tham gia AI City Remix {#enter-ai-city-remix}

Chọn một Skill và thành phố trên trang sự kiện, sau đó giao toàn bộ chỉ dẫn cho agent cục bộ của bạn. Sau khi tạo xong, agent sẽ tải lên video, ảnh bìa và thông tin bài dự thi rồi gửi đi để xét duyệt.


## Điều kiện tiên quyết {#prerequisites}

- Một tài khoản SandBase.
- Một agent cục bộ có quyền chạy lệnh và truy cập file.
- Một thư mục làm việc cho video, ảnh bìa và các file dự án.

Để thiết lập môi trường cục bộ lần đầu, hãy làm theo [Dùng Skill trên máy cục bộ](/guides/skills/local-use).

## 1. Mở trang sự kiện và nhận credit {#_1-open-the-event-and-claim-credits}

1. Mở [AI City Remix](https://www.sandbase.ai/lab/event/aicityremix?lang=en) và đọc [thể lệ sự kiện](https://www.sandbase.ai/lab/event/aicityremix?tab=rules&lang=en) hiện hành.
2. Nhấn “Nhận $5 miễn phí và sáng tạo” và đăng nhập khi được yêu cầu.
3. Hệ thống nhận credit sự kiện và tự động thử quy đổi. Hãy kiểm tra số dư và trạng thái quy đổi; dùng thao tác quy đổi nếu cần thử lại.
4. Sau khi nhận, nhấn “Sáng tạo ngay” để mở hộp thoại tạo.

Ngày nhận, tình trạng còn credit và điều kiện tham gia được hiển thị trên trang sự kiện. Lệnh gọi model dùng credit theo mức sử dụng thực tế; bạn có thể xem lại trong [Billing](https://www.sandbase.ai/console/billing).

## 2. Cấu hình API key cho model {#_2-configure-a-model-api-key}

Nếu tài khoản của bạn chưa có API key dùng được, luồng sẽ hiển thị hộp thoại “Tạo API key”.

1. Xem lại mức trần chi tiêu và thời hạn hiển thị, rồi nhấn “Tạo API key”.
2. Nhấn “Tạo bằng key này”. Key mới sẽ được đưa vào toàn bộ chỉ dẫn giao cho agent.
3. Gửi toàn bộ chỉ dẫn cho agent mà bạn tin cậy và giữ chúng trong một không gian làm việc riêng tư.

Với key có sẵn, hãy cấu hình `SANDBASE_API_KEY` qua phần cài đặt bảo mật hoặc môi trường thực thi của agent cục bộ. Quản lý key tại [API Keys](https://www.sandbase.ai/console/keys).

## 3. Chọn Skill và brief {#_3-choose-a-skill-and-brief}

Hộp thoại mở ra với Skill chính thức, thành phố, câu chuyện và định hướng sáng tạo đã được chọn sẵn.

- Mở rộng “Skill chính thức” để đọc phần tóm tắt và chi tiết, rồi chọn phong cách hình ảnh.
- Mở rộng “Brief sáng tạo” để tìm thành phố hoặc chọn một địa điểm trên bản đồ.
- Xáo trộn gợi ý hoặc chỉnh sửa trực tiếp câu chuyện và định hướng sáng tạo.
- Xác nhận vị trí trên bản đồ, ngôn ngữ được hỗ trợ và phong cách output.

Hãy dùng nguồn có thể kiểm chứng cho lịch sử, nhân vật và sự kiện. Xem chi tiết của Skill đã chọn để biết ngôn ngữ và thời lượng được hỗ trợ.

## 4. Sao chép chỉ dẫn và bắt đầu tạo {#_4-copy-the-instructions-and-create}

1. Nhấn “Sao chép tất cả” trong vùng prompt.
2. Mở thư mục dự án trong agent cục bộ, bắt đầu một tác vụ và dán toàn bộ chỉ dẫn.
3. Gửi chỉ dẫn, cung cấp các input được yêu cầu, cấu hình dependency và bắt đầu tạo.

Chỉ dẫn chứa Skill đã chọn, brief sáng tạo, định dạng metadata của bài dự thi và quyền tải lên. Hãy giữ nguyên toàn bộ phần bàn giao để agent có thể tạo và nộp tác phẩm.

“Đang chuẩn bị” nghĩa là quyền tải lên đang được chuẩn bị. Dùng “Thử lại” để chuẩn bị lại, hoặc “Hoàn thiện brief” để điền các thông tin còn thiếu.

## 5. Theo dõi tiến độ tạo {#_5-follow-creation-progress}

Quá trình tạo có thể mất từ vài chục phút đến vài giờ, tùy vào Skill, model và độ dài video, và sẽ dùng credit model. Hãy giữ agent chạy và không để máy tính ngủ.

Thêm chỉ dẫn về ngân sách và tiến độ vào cùng tác vụ:

```text
My model-call budget is [AMOUNT] USD. Ask before exceeding it.
Report the current step, saved files, and next step, then continue creation.
```

Dùng MiniMax M3.1 Flash qua SandBase theo yêu cầu của thể lệ sự kiện hiện hành. Tuân thủ yêu cầu của trang sự kiện và trang tải lên về thời lượng, độ phân giải, phụ đề và dung lượng file.

## 6. Nộp bài và kiểm tra trạng thái xét duyệt {#_6-submit-and-check-review-status}

Agent làm theo toàn bộ chỉ dẫn để dùng upload client chính thức, tải lên video, ảnh bìa và metadata, rồi gửi đi xét duyệt.

Mở [Bài dự thi của tôi](https://www.sandbase.ai/lab/event/aicityremix/mine?lang=en) để kiểm tra tiến độ:

| Trạng thái | Bước tiếp theo |
|---|---|
| Bản nháp | Hoàn thiện phim, tải file lên và gửi đi xét duyệt. |
| Chờ xét duyệt | Theo dõi trạng thái xét duyệt. |
| Đã duyệt | Mở trang bài dự thi công khai và chia sẻ. |
| Yêu cầu chỉnh sửa | Chỉnh sửa theo ghi chú xét duyệt và gửi lại. |

Với phim đã có sẵn, hãy chọn “Tải lên video có sẵn” trên trang sự kiện, điền thông tin, tải lên video và ảnh bìa, rồi gửi đi xét duyệt.

## 7. Tiếp tục tải lên {#_7-resume-an-upload}

Nếu quyền tải lên hết hạn hoặc quá trình tải lên bị gián đoạn, hãy tiếp tục với các file gốc:

1. Giữ lại video, ảnh bìa, `entry.json` và thư mục làm việc.
2. Tìm đúng bản nháp đó trong Bài dự thi của tôi và nhấn “Tiếp tục tải lên”.
3. Sao chép chỉ dẫn tiếp tục mới vào tác vụ agent ban đầu.
4. Yêu cầu agent tải lên và nộp các file có sẵn, sau đó kiểm tra trạng thái trong Bài dự thi của tôi.

## 8. Chia sẻ bài dự thi {#_8-share-your-entry}

Trên trang bài dự thi đã được duyệt, nhấn “Chia sẻ lên X” để mở khung soạn bài đã điền sẵn. Nội dung gồm liên kết bài dự thi, `#AICityRemix`, `@SandbaseAI` và bài đăng chính thức của sự kiện.

Để đăng bài kèm video, trước tiên hãy nhấn “Tải video xuống”, thêm file vào khung soạn bài của X, xem lại nội dung và đăng.

## Tài liệu liên quan {#related-documentation}

- [Dùng Skill trên máy cục bộ](/guides/skills/local-use)
- [Kết nối agent của bạn](/setup/)
- [Cấu hình API key](/getting-started/api-keys)
