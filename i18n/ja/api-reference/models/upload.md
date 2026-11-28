---
i18nSource: e047946a41e1be8b
title: メディアのアップロード
description: モデル入力として使う画像、音声、動画ファイルをアップロードします。
aside: false
outline: false
apiReference:
  title: メディアのアップロード
  operation: Assets
  method: POST
  path: /v1/upload
  description: 画像、音声、動画ファイルをアップロードし、対応するモデル入力に使える保存済み URL を受け取ります。
  groups:
    - title: マルチパートフォーム
      fields:
        - name: file
          type: binary
          required: true
          description: 画像は最大 20 MB、音声は最大 50 MB、動画は最大 500 MB です。対応形式は以下のとおりです。
        - name: type
          type: image | audio | video
          required: false
          description: 任意のカテゴリのヒント。検証には引き続きファイルから検出した MIME が使われます。
    - title: 対応 MIME タイプ
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
    - title: レスポンス
      fields:
        - name: url
          type: string
          required: true
          description: 対応するモデル入力に渡す保存済みメディア URL。
        - name: filename · size
          type: string · integer
          required: true
          description: マルチパートの元のファイル名と、ファイルサイズ（バイト）。
        - name: type · content_type
          type: string
          required: true
          description: ファイルの保存時に使われた、検出済みの MIME タイプ。
        - name: duration_seconds
          type: number
          required: false
          description: 音声と動画のみ：ファイルから読み取れた場合のメディアの長さ（秒）。
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
    - title: MIME の検出
      description: サーバーはファイルのバイト列とファイル名からファイルタイプを検出します。任意の type フィールドで MIME タイプを強制することはできません。
---

<ApiReferencePage />
