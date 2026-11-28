---
i18nSource: 88501841ea0abd9d
title: एकीकृत इमेज Run API
description: SandBase की unified model API से image generation और editing क्षमताएँ चलाएँ।
aside: false
outline: false
apiReference:
  title: Image Generation
  operation: Models
  method: POST
  path: /v1/run
  description: FLUX, Stable Diffusion, DALL-E जैसे AI models से images generate करें।
  groups:
    - title: Request body
      fields:
        - name: model
          type: string
          required: true
          description: वर्तमान model identifier, उदाहरण के लिए bfl/flux-1/schnell।
        - name: prompt
          type: string
          required: true
          description: Image का text विवरण
        - name: aspect_ratio
          type: string
          required: false
          description: Output aspect ratio। Flux 1 Schnell का default 16:9 है।
        - name: guidance_scale
          type: number
          required: false
          description: 1 से 20 तक prompt guidance strength।
        - name: output_format
          type: jpeg | png
          required: false
          description: Output image format। Flux 1 Schnell का default jpeg है।
        - name: mode
          type: string
          required: false
          description: async केवल तभी सेट करें जब चुना गया model asynchronous execution का समर्थन करता हो
        - name: webhook_url
          type: string
          required: false
          description: केवल इस async task के लिए public HTTPS callback URL
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
