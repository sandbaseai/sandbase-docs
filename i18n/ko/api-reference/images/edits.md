---
i18nSource: a4db28360a2974cd
title: 이미지 편집
description: OpenAI Images 호환 동기식 API로 업로드한 이미지를 편집합니다.
aside: false
outline: false
apiReference:
  title: 이미지 편집
  operation: Images
  method: POST
  path: /v1/images/edits
  description: SandBase의 OpenAI Images 호환 동기식 multipart 엔드포인트로 업로드한 이미지 하나 이상을 편집합니다.
  signature: client.images.edit(params)
  groups:
    - title: 요청 본문
      schema: ImageEditParams
      fields:
        - name: model
          type: string
          required: true
          description: gpt-image-2, gpt-image-2.5-flare, gpt-image-2.5-sunburst 중 하나.
        - name: prompt
          type: string
          required: true
          description: 요청할 편집 내용에 대한 텍스트 설명.
        - name: image
          type: file | file[]
          required: true
          description: 하나 이상의 원본 이미지 파일. 여러 이미지를 보내려면 multipart 필드를 반복하세요.
        - name: mask
          type: file
          required: false
          description: 인페인팅용 선택적 마스크 이미지.
        - name: n
          type: integer
          required: false
          description: 지원되는 경우 반환할 편집 이미지 수.
        - name: size
          type: string
          required: false
          description: 모델이 지원하는 출력 크기.
        - name: quality
          type: string
          required: false
          description: 모델이 지원하는 출력 품질.
        - name: background
          type: string
          required: false
          description: 출력 배경 설정.
        - name: input_fidelity
          type: string
          required: false
          description: 지원 모델이 원본 이미지의 세부 사항을 얼마나 충실히 유지할지 지정합니다.
        - name: output_format
          type: string
          required: false
          description: png, webp, jpeg 등 출력 인코딩.
        - name: output_compression
          type: integer
          required: false
          description: 0에서 100 사이의 출력 압축 수준.
        - name: user
          type: string
          required: false
          description: 제공업체 호환 최종 사용자 식별자.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/images/edits \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -F model=gpt-image-2 \
          -F 'prompt=Turn the daytime sky into a starry night' \
          -F image=@landscape.png
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-...", base_url="https://api.sandbase.ai/v1")
        with open("landscape.png", "rb") as image:
            result = client.images.edit(
                model="gpt-image-2",
                image=image,
                prompt="Turn the daytime sky into a starry night",
            )
        print(result.data[0].b64_json or result.data[0].url)
  response:
    status: 200 OK
    code: |-
      {
        "created": 1787529600,
        "data": [{"b64_json": "iVBORw0KGgo..."}],
        "usage": {
          "input_tokens": 1024,
          "output_tokens": 4096,
          "total_tokens": 5120,
          "input_tokens_details": {"text_tokens": 12, "image_tokens": 1012}
        }
      }
  notes:
    - title: Multipart 업로드
      description: model, prompt, image를 multipart/form-data로 보내세요. image 필드를 반복하면 여러 원본 파일이 유지됩니다.
    - title: 동기식 전용
      description: stream=true, mode=stream, mode=async는 거부됩니다.
  errors:
    - status: "400"
      description: 잘못된 multipart 본문, 지원되지 않는 모델, 스트리밍 모드 또는 제공업체 요청.
    - status: "401"
      description: API 키가 없거나 유효하지 않습니다.
    - status: "402"
      description: 조직 또는 API Key 지출 한도에 도달했습니다.
    - status: "403"
      description: API 키 범위가 이 엔드포인트를 허용하지 않습니다.
    - status: "404"
      description: 라우팅된 이미지 편집 모델을 사용할 수 없습니다.
    - status: "429"
      description: 요청 한도를 초과했습니다.
    - status: "500"
      description: 요청 저장 또는 응답 처리에 실패했습니다.
    - status: "502"
      description: 제공업체가 유효하지 않은 네이티브 응답을 반환했습니다.
    - status: "503"
      description: 성공한 제공업체 경로가 없습니다.
---

<ApiReferencePage />

## 지원 모델 {#supported-models}
다음 OpenAI 이미지 모델은 이 엔드포인트와 [`/v1/images/generations`](/api-reference/images/generations)에서 네이티브 Images API를 사용합니다. `model`에 공개 모델 이름을 지정하세요.

| `model` | 적합한 용도 |
| --- | --- |
| `gpt-image-2.5-flare` | 일상적인 크리에이티브 작업을 위한 빠르고 고품질의 생성 및 편집 |
| `gpt-image-2.5-sunburst` | 시각적 충실도와 정밀도가 가장 중요한 작업 |
| `gpt-image-2` | 이전 세대 GPT Image |

요청은 동기식이며 `data`에 `b64_json` 또는 URL 형태로 이미지 데이터를 반환합니다. 이 엔드포인트는 일반 비동기 `/v1/run` 모델 엔드포인트와 별개입니다. 각 모델의 계약과 가격은 [모델 카탈로그](https://www.sandbase.ai/models/image-video)의 해당 모델 페이지에서 확인할 수 있습니다.

`model`, `prompt`, 그리고 하나 이상의 `image` 파일을 지정하세요. 여러 원본 이미지를 합성하거나 편집하려면 `image` 필드를 반복해서 보내세요.

```bash
curl https://api.sandbase.ai/v1/images/edits \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -F "model=gpt-image-2.5-flare" \
  -F "prompt=Turn this product photo into a warm editorial scene" \
  -F "image=@product.png" \
  -F "quality=high"
```
