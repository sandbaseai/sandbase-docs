---
i18nSource: e047946a41e1be8b
title: 미디어 업로드
description: 모델 입력으로 사용할 이미지, 오디오 또는 비디오 파일을 업로드합니다.
aside: false
outline: false
apiReference:
  title: 미디어 업로드
  operation: Assets
  method: POST
  path: /v1/upload
  description: 이미지, 오디오 또는 비디오 파일을 업로드하고, 지원되는 모델 입력에 사용할 저장 URL을 받습니다.
  groups:
    - title: Multipart 폼
      fields:
        - name: file
          type: binary
          required: true
          description: 이미지는 최대 20 MB, 오디오는 최대 50 MB, 비디오는 최대 500 MB입니다. 지원 형식은 아래에 나와 있습니다.
        - name: type
          type: image | audio | video
          required: false
          description: 선택적 카테고리 힌트입니다. 검증은 여전히 파일에서 감지한 MIME에 따라 이루어집니다.
    - title: 지원 MIME 유형
      fields:
        - name: Image
          type: string
          required: false
          description: image/jpeg, image/png, image/webp, image/gif — 최대 20 MB.
        - name: Audio
          type: string
          required: false
          description: audio/mpeg, audio/mp4, audio/wav, audio/x-wav, audio/ogg, audio/aac, audio/flac — 최대 50 MB.
        - name: Video
          type: string
          required: false
          description: video/mp4, video/quicktime, video/webm — 최대 500 MB.
    - title: 응답
      fields:
        - name: url
          type: string
          required: true
          description: 지원되는 모델 입력에 전달할 저장된 미디어 URL입니다.
        - name: filename · size
          type: string · integer
          required: true
          description: 원본 multipart 파일 이름과 파일 크기(바이트)입니다.
        - name: type · content_type
          type: string
          required: true
          description: 파일 저장 시 사용된 감지된 MIME 유형입니다.
        - name: duration_seconds
          type: number
          required: false
          description: "오디오와 비디오 전용: 파일에서 읽을 수 있는 경우 미디어 길이(초)입니다."
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
    - title: MIME 감지
      description: 서버는 파일의 바이트와 파일 이름으로 파일 유형을 감지합니다. 선택적 type 필드로 MIME 유형을 강제할 수는 없습니다.
---

<ApiReferencePage />
