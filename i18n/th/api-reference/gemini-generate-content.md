---
i18nSource: d4dc2aeab688ab05
title: Google Gemini GenerateContent
description: เรียกใช้ SandBase ด้วยโปรโตคอล Google Gemini GenerateContent แบบ native
aside: false
outline: false
apiReference:
  title: Google Gemini GenerateContent
  operation: Gemini
  method: POST
  path: /v1beta/models/{model}:generateContent
  description: ส่งคำขอ Gemini แบบ native และรับการตอบกลับที่เข้ากันได้กับ Gemini ใช้ streamGenerateContent สำหรับการสตรีม
  groups:
    - title: พารามิเตอร์ของพาธ
      fields:
        - name: model
          type: string
          required: true
          description: ชื่อโมเดล Google แบบเปล่า เช่น gemini-3.5-flash โดย SandBase จะแปลงเป็น google/{model}
    - title: เนื้อหาคำขอ
      fields:
        - name: contents
          type: array
          required: false
          description: เนื้อหาบทสนทนาของ Gemini ที่ประกอบด้วย role และ parts
        - name: systemInstruction
          type: object
          required: false
          description: คำสั่งระบบแบบข้อความในรูปแบบ Gemini Content
        - name: generationConfig
          type: object
          required: false
          description: การตั้งค่าการสุ่ม ความยาวเอาต์พุต เอาต์พุตแบบมีโครงสร้าง และ thinking
        - name: tools
          type: array
          required: false
          description: การประกาศฟังก์ชันหรือการกำหนดค่าเครื่องมือในตัวของ Gemini ที่รองรับ
        - name: toolConfig
          type: object
          required: false
          description: นโยบาย function calling ของ Gemini
        - name: safetySettings
          type: array
          required: false
          description: หมวดหมู่และเกณฑ์ความปลอดภัยของ Gemini
        - name: cachedContent
          type: string
          required: false
          description: ทรัพยากร cached-content ของ Gemini ที่ส่งผ่านเมื่อรองรับ
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST \
          "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:generateContent" \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"contents":[{"role":"user","parts":[{"text":"Explain immutable infrastructure in one sentence."}]}]}'
  response:
    status: 200 OK
    code: |-
      {
        "candidates": [
          {
            "content": {
              "role": "model",
              "parts": [{"text": "Immutable infrastructure replaces servers from versioned images instead of modifying them in place."}]
            },
            "finishReason": "STOP",
            "index": 0
          }
        ],
        "usageMetadata": {
          "promptTokenCount": 8,
          "candidatesTokenCount": 15,
          "totalTokenCount": 23
        }
      }
---

<ApiReferencePage />

## การยืนยันตัวตน {#authentication}

คำขอที่เข้ากันได้กับ Google สามารถส่ง SandBase API key ใน `x-goog-api-key`, `Authorization: Bearer …` หรือพารามิเตอร์ query `key` ตามลำดับความสำคัญนี้ แนะนำให้ใช้ส่วนหัว เพราะข้อมูลรับรองใน query string อาจปรากฏในล็อกของ proxy และประวัติของเบราว์เซอร์

## การสตรีม {#streaming}

เปลี่ยน suffix ของเมธอดเป็น `:streamGenerateContent` หากไม่มีพารามิเตอร์ query SandBase จะส่งคืนออบเจ็กต์การตอบกลับที่เข้ากันได้กับ Google เป็นอาร์เรย์ JSON แบบสตรีม เพิ่ม `?alt=sse` เพื่อใช้ Server-Sent Events:

```bash
curl -N -X POST \
  "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:streamGenerateContent?alt=sse" \
  -H "x-goog-api-key: $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Write a short greeting."}]}]}'
```

## การสร้างภาพแบบ native {#native-image-generation}

โมเดลภาพเหล่านี้มีการแมป GenerateContent แบบ native โดยเฉพาะ:

- [Gemini 3 Pro Image（Nano Banana Pro）](https://www.sandbase.ai/models/google/gemini-3-pro-image/docs): `gemini-3-pro-image`
- [Gemini 3.1 Flash Image（Nano Banana 2）](https://www.sandbase.ai/models/google/gemini-3.1-flash-image/docs): `gemini-3.1-flash-image`
- [Gemini Nano Banana 2.1（Nano Banana 2.1）](https://www.sandbase.ai/models/google/gemini-nano-banana-2.1/docs): `gemini-nano-banana-2.1`

หน้าของแต่ละโมเดลแสดงราคาโทเค็นและค่าใช้จ่ายต่อภาพ

สำหรับการแมปเหล่านี้ SandBase จะส่งต่อ payload ของคำขอและการตอบกลับโดยไม่แปลงผ่าน Chat
Completions ซึ่งช่วยคง image part, response modality และฟิลด์ที่ผู้ให้บริการกำหนดไว้ ให้ใช้ชื่อโมเดลเปล่าใน
URL เช่น `google/gemini-3.1-flash-image` จะกลายเป็น `gemini-3.1-flash-image` ในพาธ
### แก้ไขภาพ {#edit-an-image}

เพิ่มภาพต้นฉบับเป็น part แบบ `inlineData` ถัดจากคำสั่งที่เป็นข้อความ ใช้ MIME type ที่ตรงกับไบต์ที่คุณส่ง:

```json
{
  "contents": [{
    "role": "user",
    "parts": [
      {"text": "Keep the subject unchanged and turn the background into a paper-cut landscape."},
      {"inlineData": {"mimeType": "image/png", "data": "<base64-input-image>"}}
    ]
  }],
  "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"imageSize": "1K"}}
}
```

### ใช้ Google Gen AI SDK {#use-the-google-gen-ai-sdk}

ชี้ SDK อย่างเป็นทางการไปที่ SandBase และใช้ SandBase API key ของคุณ:

```python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="YOUR_SANDBASE_API_KEY",
    http_options=types.HttpOptions(base_url="https://api.sandbase.ai"),
)

response = client.models.generate_content(
    model="gemini-nano-banana-2.1",
    contents="Create a wide editorial illustration of a solar-powered city at sunrise.",
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE"],
        image_config=types.ImageConfig(aspect_ratio="16:9", image_size="1K"),
    ),
)

for part in response.candidates[0].content.parts:
    if part.inline_data:
        with open("output.jpg", "wb") as f:
            f.write(part.inline_data.data)
```

สำหรับการสตรีม ให้เรียก `:streamGenerateContent?alt=sse` (SDK: `generate_content_stream`) ด้วยเนื้อหาเดียวกัน

### การจัดการการตอบกลับ {#response-handling}
อ่านสื่อที่สร้างขึ้นจาก candidate part ที่ส่งกลับมา เนื่องจากโมเดลเหล่านี้ใช้การส่งผ่านแบบ native ตัวพิมพ์ของชื่อฟิลด์
ที่ผู้ให้บริการกำหนดและ metadata ของ MIME จะถูกส่งคืนตามที่ได้รับ ให้ถอดรหัส payload แบบ base64 และตรวจสอบไบต์ของสื่อจริง
ก่อนเลือกนามสกุลไฟล์

## ขอบเขตของการกำหนดเส้นทางและการแปลง {#routing-and-translation-boundaries}

SandBase จะเลือกเฉพาะผู้ให้บริการที่รองรับโปรโตคอล Gemini แบบ native ที่ร้องขอ หากโมเดลที่เลือกไม่มี
การแมปแบบ native ที่เข้ากันได้ คำขอจะล้มเหลว แทนที่จะไปใช้ผู้ให้บริการที่ใช้โปรโตคอลอื่น

โมเดลที่ใช้เส้นทาง GenerateContent แบบแปลงรองรับข้อความ, function call และ response, ข้อมูล `image/*` แบบ inline
และการอ้างอิงภาพผ่าน HTTP(S) สาธารณะ เส้นทางแบบแปลงนี้จะปฏิเสธ MIME type แบบ inline ที่ไม่รองรับ, Google Files ส่วนตัว หรือ
การอ้างอิง `gs://`, การขอหลาย candidate และ response modality ที่ไม่รองรับ ด้วยการตอบกลับ `400 INVALID_ARGUMENT`
แบบ Google การแมปสำหรับสร้างภาพที่ระบุไว้ข้างต้นใช้การส่งผ่านแบบดิบ จึงไม่อยู่ภายใต้ข้อจำกัดที่ใช้เฉพาะกับการแปลง
ให้ตรวจสอบฟิลด์สื่อที่ส่งกลับมาตามการตอบกลับของผู้ให้บริการที่เลือก
