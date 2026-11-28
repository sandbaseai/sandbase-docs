---
i18nSource: e047946a41e1be8b
title: 上传媒体
description: 上传图像、音频或视频文件，用作模型输入。
aside: false
outline: false
apiReference:
  title: 上传媒体
  operation: Assets
  method: POST
  path: /v1/upload
  description: 上传图像、音频或视频文件，获取可用于受支持模型输入的存储 URL。
  groups:
    - title: Multipart 表单
      fields:
        - name: file
          type: binary
          required: true
          description: 图像最大 20 MB，音频最大 50 MB，视频最大 500 MB。支持的格式见下文。
        - name: type
          type: image | audio | video
          required: false
          description: 可选的类别提示。校验仍以从文件检测到的 MIME 类型为准。
    - title: 支持的 MIME 类型
      fields:
        - name: Image
          type: string
          required: false
          description: image/jpeg、image/png、image/webp、image/gif，最大 20 MB。
        - name: Audio
          type: string
          required: false
          description: audio/mpeg、audio/mp4、audio/wav、audio/x-wav、audio/ogg、audio/aac、audio/flac，最大 50 MB。
        - name: Video
          type: string
          required: false
          description: video/mp4、video/quicktime、video/webm，最大 500 MB。
    - title: 响应
      fields:
        - name: url
          type: string
          required: true
          description: 存储后的媒体 URL，可传给受支持的模型输入。
        - name: filename · size
          type: string · integer
          required: true
          description: 原始 multipart 文件名及文件大小（字节）。
        - name: type · content_type
          type: string
          required: true
          description: 存储文件时使用的检测所得 MIME 类型。
        - name: duration_seconds
          type: number
          required: false
          description: 仅限音频和视频：可从文件中读取时，返回媒体时长（秒）。
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
    - title: MIME 检测
      description: 服务器根据文件字节和文件名检测文件类型。可选的 type 字段不会强制指定 MIME 类型。
---

<ApiReferencePage />
