---
i18nSource: e047946a41e1be8b
title: Tải lên media
description: Tải lên file ảnh, audio hoặc video để dùng làm input cho model.
aside: false
outline: false
apiReference:
  title: Tải lên media
  operation: Assets
  method: POST
  path: /v1/upload
  description: Tải lên file ảnh, audio hoặc video và nhận URL đã lưu cho input model được hỗ trợ.
  groups:
    - title: Form multipart
      fields:
        - name: file
          type: binary
          required: true
          description: Ảnh tối đa 20 MB, audio tối đa 50 MB hoặc video tối đa 500 MB. Các định dạng được hỗ trợ được liệt kê bên dưới.
        - name: type
          type: image | audio | video
          required: false
          description: Gợi ý danh mục tùy chọn. Việc xác thực vẫn dựa trên MIME được phát hiện từ file.
    - title: Các MIME type được hỗ trợ
      fields:
        - name: Image
          type: string
          required: false
          description: image/jpeg, image/png, image/webp, image/gif — tối đa 20 MB.
        - name: Audio
          type: string
          required: false
          description: audio/mpeg, audio/mp4, audio/wav, audio/x-wav, audio/ogg, audio/aac, audio/flac — tối đa 50 MB.
        - name: Video
          type: string
          required: false
          description: video/mp4, video/quicktime, video/webm — tối đa 500 MB.
    - title: Response
      fields:
        - name: url
          type: string
          required: true
          description: URL media đã lưu để truyền vào input model được hỗ trợ.
        - name: filename · size
          type: string · integer
          required: true
          description: Tên file multipart gốc và kích thước file tính bằng byte.
        - name: type · content_type
          type: string
          required: true
          description: MIME type được phát hiện và dùng khi lưu file.
        - name: duration_seconds
          type: number
          required: false
          description: "Chỉ với audio và video: thời lượng media tính bằng giây, khi có thể đọc được từ file."
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/upload \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -F "file=@reference.mp4" \
          -F "type=video"
  response:
    status: 200 OK
    code: |-
      {
        "url": "https://media.sandbase.ai/uploads/2026/08/550e8400-e29b-41d4-a716-446655440000.mp4",
        "filename": "reference.mp4",
        "size": 1048576,
        "type": "video/mp4",
        "content_type": "video/mp4",
        "duration_seconds": 5.04
      }
  notes:
    - title: Phát hiện MIME
      description: Server phát hiện loại file từ nội dung byte và tên file. Trường type tùy chọn không ép buộc MIME type.
---

<ApiReferencePage />
