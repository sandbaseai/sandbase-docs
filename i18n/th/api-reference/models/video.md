---
i18nSource: 9fd64c100b1d8b20
title: Unified Video Run API
description: เรียกใช้ความสามารถด้านการสร้างและแก้ไขวิดีโอผ่าน API โมเดลแบบรวมศูนย์ของ SandBase
aside: false
outline: false
apiReference:
  title: การสร้างวิดีโอ
  operation: Models
  method: POST
  path: /v1/run
  description: สร้างวิดีโอด้วยโมเดล AI การสร้างวิดีโอทำงานแบบอะซิงโครนัส คุณส่งคำขอแล้วโพลเพื่อรับผลลัพธ์
  groups:
    - title: เนื้อหาคำขอ
      fields:
        - name: model
          type: string
          required: true
          description: ตัวระบุโมเดลปัจจุบัน เช่น kwaivgi/kling-video/v3/standard/text-to-video
        - name: prompt
          type: string
          required: true
          description: คำอธิบายวิดีโอเป็นข้อความ
        - name: duration
          type: number
          required: false
          description: ความยาววิดีโอเป็นวินาที
        - name: image_url
          type: string
          required: false
          description: ภาพอ้างอิงสำหรับ image-to-video
        - name: webhook_url
          type: string
          required: false
          description: URL callback แบบ HTTPS สาธารณะสำหรับงานอะซิงโครนัสนี้เท่านั้น
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/run \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"kwaivgi/kling-video/v3/standard/text-to-video","prompt":"A cat playing piano","duration":5}'
    - label: Python
      language: python
      code: |-
        # 1. Submit generation request
        response = client.post("/v1/run", json={
            "model": "kwaivgi/kling-video/v3/standard/text-to-video",
            "prompt": "A cat playing piano",
            "duration": 5,
            "webhook_url": "https://hooks.example.com/sandbase/task?token=opaque-token"
        })
        generation_id = response.json()["id"]

        # 2. SandBase posts the terminal event to webhook_url.
        # You may still poll the existing result endpoint as a fallback.
        import time
        while True:
            result = client.get(f"/v1/run/{generation_id}").json()
            if result["status"] in ("completed", "failed", "timeout"):
                print(result)
                break
            time.sleep(5)
  response:
    status: 202 Accepted
    code: |-
      {
        "id": "run_01...",
        "status": "pending",
        "model": "kwaivgi/kling-video/v3/standard/text-to-video"
      }
---

<ApiReferencePage />
