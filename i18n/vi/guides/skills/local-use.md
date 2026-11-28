---
i18nSource: 31b3bd202f3dc24e
agentDoc: local-use-agent-en
title: Dùng Skill trên máy cục bộ
description: Chọn một Skill trong SandBase Lab, tải gói của nó, cấu hình quyền truy cập model, rồi tạo và lưu dự án bằng agent cục bộ.
---

# Dùng Skill trên máy cục bộ {#use-a-skill-locally}

Tải xuống một SandBase Skill và hoàn thành dự án với agent trên máy tính của bạn. Một Skill chứa chỉ dẫn, script và ví dụ. Agent sẽ làm theo quy trình được mô tả trong `SKILL.md` của Skill.


## 1. Chọn Skill {#_1-choose-a-skill}

1. Mở [SandBase Lab](https://www.sandbase.ai/lab/).
2. Duyệt các ví dụ như video, hoạt ảnh và bản đồ. Mở một Skill phù hợp với dự án của bạn.
3. Xem lại ví dụ, các input bắt buộc, định dạng đầu ra và các ngôn ngữ được hỗ trợ.
4. Dùng thao tác tải xuống của Skill để lưu gói ZIP.

Với một bộ phim bản đồ về lịch sử thành phố, hãy bắt đầu với các ví dụ và chỉ dẫn của [City Through Time](https://www.sandbase.ai/lab/skills/city-through-time).

## 2. Chuẩn bị thư mục làm việc cục bộ {#_2-prepare-a-local-working-folder}

1. Tạo một thư mục dự án, chẳng hạn `my-city-film`.
2. Giải nén toàn bộ file ZIP của Skill vào đó, giữ nguyên chỉ dẫn, script và tài nguyên.
3. Mở dự án trong agent cục bộ và cấp quyền truy cập vào các file của dự án cùng các lệnh mà quy trình yêu cầu.
4. Làm theo hướng dẫn cài đặt trên trang Skill, hoặc yêu cầu agent đọc trực tiếp `SKILL.md` đã giải nén.

Một dự án có thể dùng cấu trúc sau:

```text
my-city-film/
  skill/          # Complete extracted Skill package
  inputs/         # Images, text, and other inputs
  outputs/        # Previews and deliverables
```

Hãy dùng đúng tên file và vị trí đầu ra mà Skill yêu cầu.

## 3. Kết nối SandBase {#_3-connect-sandbase}

Dán `set up https://www.sandbase.ai/SKILL.md` vào agent và chấp thuận bước đăng nhập trên trình duyệt mà nó mở ra, hoặc chạy `npx -y @sandbaseai/cli@latest connect` trong terminal. Sau đó, hãy bắt đầu một phiên agent mới để các tool SandBase được tải. Các tùy chọn tương tự có trong [Build → AI tools](https://www.sandbase.ai/console/setup) trên Console.

Xem [Kết nối AI tool](/setup/) để biết toàn bộ quy trình kết nối.

Nếu script của Skill yêu cầu `SANDBASE_API_KEY`:

1. Mở [API Keys](https://www.sandbase.ai/console/keys) và tạo hoặc chọn một key cho dự án.
2. Cấu hình key qua phần thiết lập bảo mật của agent cục bộ hoặc môi trường thực thi script.
3. Yêu cầu agent kiểm tra quyền truy cập đã được cấu hình và tiếp tục quy trình của Skill.

Hãy giữ key trong cấu hình cục bộ bảo mật. Chỉ đưa thông tin dự án vào sản phẩm bàn giao, file mã nguồn và ảnh chụp màn hình công khai. Xem mức sử dụng model và số dư trong [Billing](https://www.sandbase.ai/console/billing).

## 4. Cung cấp bản mô tả yêu cầu {#_4-provide-a-brief}

Cho agent biết cần dùng Skill nào, cần tạo gì, yêu cầu đầu ra và ngân sách của bạn. Hãy điều chỉnh ví dụ này cho dự án của bạn:

```text
Read SKILL.md in the project's skill folder and follow its workflow.

Topic: the story of Shanghai's development.
Deliverables: a playable video, a cover image, and usage notes.
Language and duration: use the Skill's supported options and state the plan before starting.
Models: use suitable models through SandBase.
Budget: model calls may use up to [AMOUNT] USD; ask me before exceeding it.

Check inputs and dependencies, then execute the workflow. Save previews and final files
in outputs. When finished, provide file paths, a summary, and the models actually used.
```

Agent đọc chỉ dẫn, kiểm tra các phụ thuộc, xử lý input và tạo hoặc render dự án. Hãy thêm mọi tài nguyên được yêu cầu vào cùng dự án và tiếp tục tác vụ.

## 5. Theo dõi tiến độ và xem lại kết quả {#_5-follow-progress-and-review-the-result}

Thời gian thực hiện phụ thuộc vào Skill, model, tài nguyên và độ dài đầu ra. Dự án video có thể mất từ vài chục phút đến vài giờ. Hãy giữ agent chạy và không để máy tính ngủ.

Hỏi về tiến độ trong cùng cuộc hội thoại:

```text
Report the current step, files already saved, and the next step, then continue the task.
```

Mở các path file được bàn giao, xem lại hình ảnh, âm thanh, phụ đề và nội dung, rồi lưu các file cuối cùng.

## 6. Chỉnh sửa dự án {#_6-revise-the-project}

Yêu cầu các thay đổi cụ thể trong tác vụ ban đầu và dùng lại các tài nguyên hiện có:

```text
Keep the structure and other shots. Shorten the opening and correct the caption at 00:18.
Reuse existing assets and save the revised result as a new version.
```

Nếu quá trình thực thi bị gián đoạn, hãy giữ thư mục làm việc và yêu cầu agent tiếp tục từ bước hiện tại.

## Bước tiếp theo {#next-steps}

- [Tham gia AI City Remix](/guides/skills/ai-city-remix)
- [Kết nối agent của bạn](/setup/)
- [Cấu hình API key](/getting-started/api-keys)
