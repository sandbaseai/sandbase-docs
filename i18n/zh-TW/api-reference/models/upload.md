---
i18nSource: e047946a41e1be8b
title: 上傳媒體
description: 上傳圖片、音訊或影片檔案，作為模型輸入使用。
aside: false
outline: false
apiReference:
  title: 上傳媒體
  operation: Assets
  method: POST
  path: /v1/upload
  description: 上傳圖片、音訊或影片檔案，並取得可用於支援之模型輸入的儲存 URL。
  groups:
    - title: Multipart 表單
      fields:
        - name: file
          type: binary
          required: true
          description: 圖片最大 20 MB、音訊最大 50 MB，或影片最大 500 MB。支援的格式列於下方。
        - name: type
          type: image | audio | video
          required: false
          description: 選填的類別提示。驗證仍以檔案的 MIME 偵測結果為準。
    - title: 支援的 MIME 類型
      fields:
        - name: Image
          type: string
          required: false
          description: image/jpeg、image/png、image/webp、image/gif — 最大 20 MB。
        - name: Audio
          type: string
          required: false
          description: audio/mpeg、audio/mp4、audio/wav、audio/x-wav、audio/ogg、audio/aac、audio/flac — 最大 50 MB。
        - name: Video
          type: string
          required: false
          description: video/mp4、video/quicktime、video/webm — 最大 500 MB。
    - title: 回應
      fields:
        - name: url
          type: string
          required: true
          description: 儲存後的媒體 URL，可傳入支援的模型輸入。
        - name: filename · size
          type: string · integer
          required: true
          description: 原始 multipart 檔名與檔案大小（位元組）。
        - name: type · content_type
          type: string
          required: true
          description: 儲存檔案時所使用的偵測 MIME 類型。
        - name: duration_seconds
          type: number
          required: false
          description: 僅限音訊與影片：可從檔案讀取時的媒體長度（秒）。
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
    - title: MIME 偵測
      description: 伺服器會根據檔案的位元組內容與檔名偵測檔案類型。選填的 type 欄位不會強制指定 MIME 類型。
---

<ApiReferencePage />
