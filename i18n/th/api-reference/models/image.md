---
i18nSource: 88501841ea0abd9d
title: Unified Image Run API
description: รันความสามารถในการสร้างและแก้ไขรูปภาพผ่าน API โมเดลแบบรวมของ SandBase
aside: false
outline: false
apiReference:
  title: การสร้างรูปภาพ
  operation: Models
  method: POST
  path: /v1/run
  description: สร้างรูปภาพด้วยโมเดล AI เช่น FLUX, Stable Diffusion, DALL-E และอื่นๆ
  groups:
    - title: Request body
      fields:
        - name: model
          type: string
          required: true
          description: ตัวระบุโมเดลปัจจุบัน เช่น bfl/flux-1/schnell
        - name: prompt
          type: string
          required: true
          description: คำอธิบายรูปภาพเป็นข้อความ
        - name: aspect_ratio
          type: string
          required: false
          description: อัตราส่วนภาพของเอาต์พุต Flux 1 Schnell ใช้ 16:9 เป็นค่าเริ่มต้น
        - name: guidance_scale
          type: number
          required: false
          description: ระดับการชี้นำของ prompt ตั้งแต่ 1 ถึง 20
        - name: output_format
          type: jpeg | png
          required: false
          description: รูปแบบไฟล์รูปภาพเอาต์พุต Flux 1 Schnell ใช้ jpeg เป็นค่าเริ่มต้น
        - name: mode
          type: string
          required: false
          description: ตั้งเป็น async เฉพาะเมื่อโมเดลที่เลือกรองรับการรันแบบอะซิงโครนัส
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
          -d '{"model":"bfl/flux-1/schnell","prompt":"A futuristic city at sunset","aspect_ratio":"1:1"}'
    - label: Python
      language: python
      code: |-
        response = client.post("/v1/run", json={
            "model": "bfl/flux-1/schnell",
            "prompt": "A futuristic city at sunset, cyberpunk style",
            "aspect_ratio": "1:1"
        })
        print(response.json()["outputs"][0]["url"])
  response:
    status: 200 OK
    code: |-
      {
        "id": "run_01...",
        "status": "completed",
        "outputs": [{ "url": "https://media.sandbase.ai/images/output.png" }]
      }
---

<ApiReferencePage />
