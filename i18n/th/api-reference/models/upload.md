---
i18nSource: e047946a41e1be8b
title: อัปโหลดสื่อ
description: อัปโหลดไฟล์รูปภาพ เสียง หรือวิดีโอเพื่อใช้เป็นอินพุตของโมเดล
aside: false
outline: false
apiReference:
  title: อัปโหลดสื่อ
  operation: Assets
  method: POST
  path: /v1/upload
  description: อัปโหลดไฟล์รูปภาพ เสียง หรือวิดีโอ แล้วรับ URL ของไฟล์ที่จัดเก็บไว้สำหรับอินพุตของโมเดลที่รองรับ
  groups:
    - title: ฟอร์มแบบ multipart
      fields:
        - name: file
          type: binary
          required: true
          description: รูปภาพไม่เกิน 20 MB เสียงไม่เกิน 50 MB หรือวิดีโอไม่เกิน 500 MB ดูรูปแบบที่รองรับได้ด้านล่าง
        - name: type
          type: image | audio | video
          required: false
          description: คำใบ้หมวดหมู่ (ไม่บังคับ) การตรวจสอบยังคงใช้ MIME ที่ตรวจพบจากไฟล์
    - title: MIME type ที่รองรับ
      fields:
        - name: Image
          type: string
          required: false
          description: image/jpeg, image/png, image/webp, image/gif — สูงสุด 20 MB
        - name: Audio
          type: string
          required: false
          description: audio/mpeg, audio/mp4, audio/wav, audio/x-wav, audio/ogg, audio/aac, audio/flac — สูงสุด 50 MB
        - name: Video
          type: string
          required: false
          description: video/mp4, video/quicktime, video/webm — สูงสุด 500 MB
    - title: การตอบกลับ
      fields:
        - name: url
          type: string
          required: true
          description: URL ของสื่อที่จัดเก็บไว้สำหรับส่งเป็นอินพุตของโมเดลที่รองรับ
        - name: filename · size
          type: string · integer
          required: true
          description: ชื่อไฟล์ multipart เดิมและขนาดไฟล์เป็นไบต์
        - name: type · content_type
          type: string
          required: true
          description: MIME type ที่ตรวจพบและใช้ตอนจัดเก็บไฟล์
        - name: duration_seconds
          type: number
          required: false
          description: "เฉพาะเสียงและวิดีโอ: ความยาวของสื่อเป็นวินาที เมื่ออ่านได้จากไฟล์"
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
    - title: การตรวจหา MIME
      description: เซิร์ฟเวอร์ตรวจหาชนิดไฟล์จากไบต์และชื่อไฟล์ ฟิลด์ type ที่ไม่บังคับจะไม่บังคับให้ใช้ MIME type ใดๆ
---

<ApiReferencePage />
