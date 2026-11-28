---
i18nSource: 39ce638efc41350d
title: 이미지 생성
description: 동기식 OpenAI Images 호환 API로 이미지를 생성합니다.
aside: false
outline: false
apiReference:
  title: 이미지 생성
  operation: Images
  method: POST
  path: /v1/images/generations
  description: SandBase의 동기식 OpenAI Images 호환 엔드포인트로 이미지를 생성합니다. 이 엔드포인트는 범용 /v1/run 모델 API와 다릅니다.
  signature: client.images.generate(params)
  groups:
    - title: 요청 본문
      schema: ImageGenerateParams
      fields:
        - name: model
          type: string
          required: true
          description: gpt-image-2, gpt-image-2.5-flare, gpt-image-2.5-sunburst 중 하나입니다.
        - name: prompt
          type: string
          required: true
          description: 생성할 이미지에 대한 텍스트 설명입니다.
        - name: n
          type: integer
          required: false
          description: 지원되는 경우 생성할 이미지 수입니다.
        - name: size
          type: string
          required: false
          description: 모델이 지원하는 출력 크기입니다.
        - name: quality
          type: string
          required: false
          description: low, medium, high, auto 같은 출력 품질입니다.
        - name: background
          type: string
          required: false
          description: transparent, opaque, auto 같은 배경 설정입니다.
        - name: output_format
          type: string
          required: false
          description: png, webp, jpeg 같은 출력 인코딩입니다.
        - name: output_compression
          type: integer
          required: false
          description: 출력 압축 수준(0~100)입니다.
        - name: moderation
          type: string
          required: false
          description: 제공업체 호환 모더레이션 설정입니다.
        - name: user
          type: string
          required: false
          description: 제공업체 호환 최종 사용자 식별자입니다.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/images/generations \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"gpt-image-2","prompt":"A paper-cut city floating above the clouds","size":"1024x1024"}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-...", base_url="https://api.sandbase.ai/v1")
        result = client.images.generate(
            model="gpt-image-2",
            prompt="A paper-cut city floating above the clouds",
            size="1024x1024",
        )
        print(result.data[0].b64_json or result.data[0].url)
  response:
    status: 200 OK
    code: |-
      {
        "created": 1787529600,
        "data": [{"b64_json": "iVBORw0KGgo..."}],
        "usage": {
          "input_tokens": 12,
          "output_tokens": 4096,
          "total_tokens": 4108,
          "input_tokens_details": {"text_tokens": 12, "image_tokens": 0}
        }
      }
  notes:
    - title: 동기식 전용
      description: stream=true, mode=stream, mode=async는 거부됩니다. 반환된 data 배열을 바로 사용하세요.
    - title: 호환 필드
      description: 추가 JSON 필드는 변경 없이 전달되지만, 지원 여부는 모델과 제공업체에 따라 다릅니다.
  errors:
    - status: "400"
      description: 잘못된 JSON, 지원되지 않는 모델, 스트리밍 모드 또는 제공업체 요청입니다.
    - status: "401"
      description: API 키가 없거나 유효하지 않습니다.
    - status: "402"
      description: 조직 또는 API Key 지출 한도에 도달했습니다.
    - status: "403"
      description: API 키 범위가 이 엔드포인트를 허용하지 않습니다.
    - status: "404"
      description: 라우팅된 이미지 모델을 사용할 수 없습니다.
    - status: "429"
      description: 속도 제한을 초과했습니다.
    - status: "500"
      description: 요청 저장 또는 응답 처리에 실패했습니다.
    - status: "502"
      description: 제공업체가 유효하지 않은 네이티브 응답을 반환했습니다.
    - status: "503"
      description: 성공한 제공업체 라우트가 없습니다.
---

<ApiReferencePage />

## 지원 모델 {#supported-models}
이 엔드포인트에서는 다음 OpenAI 이미지 모델이 네이티브 Images API를 사용합니다. `model`에 공개 모델 이름을 보내세요:

| `model` | 적합한 용도 |
| --- | --- |
| `gpt-image-2.5-flare` | 일상적인 크리에이티브 작업을 위한 빠르고 고품질의 생성 및 편집 |
| `gpt-image-2.5-sunburst` | 시각적 충실도와 정밀도가 가장 중요한 작업 |
| `gpt-image-2` | 이전 세대 GPT Image |

요청은 동기식이며 `data`에 이미지 데이터를 `b64_json` 또는 URL로 반환합니다. 이 엔드포인트는 범용 비동기 모델 엔드포인트인 `/v1/run`과 별개입니다. 해당 계약과 가격은 [모델 카탈로그](https://www.sandbase.ai/models/image-video)의 각 모델 페이지에 문서화되어 있습니다.

이미지를 편집하려면 같은 모델 이름으로 [`POST /v1/images/edits`](/api-reference/images/edits)에 `multipart/form-data`를 보내세요.
