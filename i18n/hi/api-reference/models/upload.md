---
i18nSource: e047946a41e1be8b
title: Media upload करें
description: Model input के रूप में उपयोग के लिए image, audio, या video file upload करें।
aside: false
outline: false
apiReference:
  title: Media upload करें
  operation: Assets
  method: POST
  path: /v1/upload
  description: Image, audio, या video file upload करें और समर्थित model input के लिए संग्रहीत URL पाएँ।
  groups:
    - title: Multipart form
      fields:
        - name: file
          type: binary
          required: true
          description: Image अधिकतम 20 MB, audio अधिकतम 50 MB, या video अधिकतम 500 MB। समर्थित formats नीचे दिए गए हैं।
        - name: type
          type: image | audio | video
          required: false
          description: वैकल्पिक श्रेणी संकेत। Validation फिर भी file से MIME detection के आधार पर होता है।
    - title: समर्थित MIME types
      fields:
        - name: Image
          type: string
          required: false
          description: image/jpeg, image/png, image/webp, image/gif — अधिकतम 20 MB।
        - name: Audio
          type: string
          required: false
          description: audio/mpeg, audio/mp4, audio/wav, audio/x-wav, audio/ogg, audio/aac, audio/flac — अधिकतम 50 MB।
        - name: Video
          type: string
          required: false
          description: video/mp4, video/quicktime, video/webm — अधिकतम 500 MB।
    - title: Response
      fields:
        - name: url
          type: string
          required: true
          description: समर्थित model input को पास करने के लिए संग्रहीत media URL।
        - name: filename · size
          type: string · integer
          required: true
          description: मूल multipart filename और bytes में file size।
        - name: type · content_type
          type: string
          required: true
          description: File संग्रहीत करते समय उपयोग किया गया detected MIME type।
        - name: duration_seconds
          type: number
          required: false
          description: "केवल audio और video: seconds में media की अवधि, जब इसे file से पढ़ा जा सके।"
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
    - title: MIME detection
      description: Server file के bytes और filename से उसका type पहचानता है। वैकल्पिक type field किसी MIME type को लागू नहीं करता।
---

<ApiReferencePage />
