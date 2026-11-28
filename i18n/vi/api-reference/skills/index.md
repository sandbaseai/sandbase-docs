---
i18nSource: 94e0cdfdd0239d6b
title: Skills API
description: Tải lên các gói Skill có phiên bản và gắn chúng vào Agent.
---

# Skills API {#skills-api}

Skill là một gói ZIP có phiên bản chứa instructions và tài nguyên mà Agent có thể gắn vào. ID của Skill dùng tiền tố `skl_`, còn định danh phiên bản là chuỗi như `"1"`.

## Các thao tác với Skill {#skill-operations}

| Phương thức | Đường dẫn | Mục đích |
|---|---|---|
| `POST` | `/v1/skills` | [Tạo Skill](./create) từ file ZIP tải lên |
| `GET` | `/v1/skills` | [Liệt kê Skills](./list) |
| `GET` | `/v1/skills/{skill_id}` | [Lấy Skill](./get) |
| `POST` | `/v1/skills/{skill_id}` | [Cập nhật](./update) phiên bản mặc định, trạng thái hoặc metadata |
| `DELETE` | `/v1/skills/{skill_id}` | [Xóa Skill](./delete) |
| `GET` | `/v1/skills/{skill_id}/content` | Tải file ZIP của phiên bản mặc định |
| `GET` | `/v1/skills/{skill_id}/versions` | [Liệt kê phiên bản](./versions) |
| `POST` | `/v1/skills/{skill_id}/versions` | [Tải lên một phiên bản](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}` | [Lấy một phiên bản](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}/content` | Tải file ZIP của một phiên bản |
| `GET` | `/v1/skills/catalog` | [Duyệt Skills công khai](./catalog) |

## Thiết lập trong năm phút {#five-minute-setup}

1. Tạo một thư mục chứa `SKILL.md` có frontmatter đặt `name` và `description`:

   ```markdown
   ---
   name: release-notes
   description: Draft release notes from merged changes.
   ---
   Group changes by feature, fix, and breaking change. Keep each entry to one line.
   ```

2. Nén thư mục (`zip -r release-notes.zip release-notes/`). File nén tối đa 5 MiB.
3. Tải lên dưới dạng phần multipart duy nhất `files`:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/skills \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -F "files=@release-notes.zip;type=application/zip"
   ```

4. Tham chiếu Skill từ một Agent bằng [Cập nhật Agent](/api-reference/agents/update):

   ```bash
   curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"skills": [{"skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null}]}'
   ```

Khi gắn Skill lần đầu, `"version": null` (hoặc bỏ qua `version`) sẽ được phân giải thành `default_version` hiện tại khi Agent được lưu. Agent đã lưu chứa một phiên bản cụ thể. Việc thay đổi phiên bản mặc định của Skill không nâng cấp Agent hiện có. Để nâng cấp, hãy cập nhật mảng `skills` với phiên bản cụ thể như `"2"`; gửi `null` cho một liên kết đã có sẽ giữ nguyên phiên bản đã ghim. Mỗi Session dùng phiên bản Agent đã lưu và báo các Skills đã phân giải trong `environment.skills`.

Một Agent hỗ trợ tối đa 32 Skills. ID và tên Skill phải là duy nhất trong phần lựa chọn của Agent.

## Phiên bản {#versions}

- Tải lên `POST /v1/skills/{skill_id}/versions` sẽ thêm phiên bản tiếp theo. Gửi trường form `default=true` để đặt phiên bản đó làm mặc định.
- `POST /v1/skills/{skill_id}` với `default_version` sẽ chuyển phiên bản mặc định mà không cần tải lên.
- `status` là `active` hoặc `disabled`. Session mới của Agent tham chiếu Skill đã tắt sẽ thất bại với `400 skill_not_found`; Session đã cố định phiên bản thì vẫn giữ phiên bản đó.
- Không thể xóa Skill đang được bất kỳ phiên bản Agent nào tham chiếu (409). Hãy tắt Skill thay vì xóa. Gỡ Skill khỏi phiên bản Agent mới nhất không xóa tham chiếu trong các phiên bản lịch sử.

## Phân trang và lỗi {#pagination-and-errors}

Danh sách dùng phân trang theo cursor với `limit` 0-100, `after` và `order`. Lỗi dùng [envelope lỗi của Agents](/api-reference/errors#agents-platform-errors).

## Tải gói xuống {#download-a-bundle}

Các endpoint nội dung trả về `application/zip`, không phải JSON. Hãy lưu response vào file:

```bash
curl --fail https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions/2/content \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  --output release-notes-v2.zip
```

Dùng `/v1/skills/{skill_id}/content` cho phiên bản mặc định hiện tại. Với các gói trong danh mục công khai, dùng `/v1/skills/catalog/{skill_id}/versions/{version}/content`.

Danh sách phiên bản dùng cùng tham số cursor như danh sách Skill. Hãy truyền `last_id` được trả về (ví dụ `skl_…:2`) làm `after`; không truyền số phiên bản đơn thuần.
