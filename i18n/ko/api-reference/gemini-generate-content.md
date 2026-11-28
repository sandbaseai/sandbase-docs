---
i18nSource: d4dc2aeab688ab05
title: Google Gemini GenerateContent
description: 네이티브 Google Gemini GenerateContent 프로토콜로 SandBase를 호출합니다.
aside: false
outline: false
apiReference:
  title: Google Gemini GenerateContent
  operation: Gemini
  method: POST
  path: /v1beta/models/{model}:generateContent
  description: 네이티브 Gemini 요청을 보내고 Gemini 호환 응답을 받습니다. 스트리밍에는 streamGenerateContent를 사용하세요.
  groups:
    - title: 경로 매개변수
      fields:
        - name: model
          type: string
          required: true
          description: gemini-3.5-flash와 같은 접두사 없는 Google 모델 이름입니다. SandBase는 이를 google/{model}로 해석합니다.
    - title: 요청 본문
      fields:
        - name: contents
          type: array
          required: false
          description: role과 parts로 구성된 Gemini 대화 콘텐츠입니다.
        - name: systemInstruction
          type: object
          required: false
          description: Gemini Content 형식의 텍스트 시스템 지시입니다.
        - name: generationConfig
          type: object
          required: false
          description: 샘플링, 출력 길이, 구조화된 출력, 사고(thinking) 설정입니다.
        - name: tools
          type: array
          required: false
          description: 함수 선언 또는 지원되는 Gemini 내장 도구 구성입니다.
        - name: toolConfig
          type: object
          required: false
          description: Gemini 함수 호출 정책입니다.
        - name: safetySettings
          type: array
          required: false
          description: Gemini 안전 카테고리와 임계값입니다.
        - name: cachedContent
          type: string
          required: false
          description: 지원되는 경우 그대로 전달되는 Gemini 캐시된 콘텐츠 리소스입니다.
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

## 인증 {#authentication}

Google 호환 요청은 SandBase API 키를 `x-goog-api-key`, `Authorization: Bearer …`, `key` 쿼리 매개변수에 이 우선순위대로 담을 수 있습니다. 쿼리 문자열의 자격 증명은 프록시 로그와 브라우저 기록에 남을 수 있으므로 헤더 사용을 권장합니다.

## 스트리밍 {#streaming}

메서드 접미사를 `:streamGenerateContent`로 바꿉니다. 쿼리 매개변수가 없으면 SandBase는 Google 호환 응답 객체를 스트리밍 JSON 배열로 반환합니다. Server-Sent Events를 사용하려면 `?alt=sse`를 추가하세요.

```bash
curl -N -X POST \
  "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:streamGenerateContent?alt=sse" \
  -H "x-goog-api-key: $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Write a short greeting."}]}]}'
```

## 네이티브 이미지 생성 {#native-image-generation}

다음 이미지 모델에는 전용 네이티브 GenerateContent 매핑이 있습니다.

- [Gemini 3 Pro Image（Nano Banana Pro）](https://www.sandbase.ai/models/google/gemini-3-pro-image/docs): `gemini-3-pro-image`
- [Gemini 3.1 Flash Image（Nano Banana 2）](https://www.sandbase.ai/models/google/gemini-3.1-flash-image/docs): `gemini-3.1-flash-image`
- [Gemini Nano Banana 2.1（Nano Banana 2.1）](https://www.sandbase.ai/models/google/gemini-nano-banana-2.1/docs): `gemini-nano-banana-2.1`

각 모델 페이지에서 토큰 가격과 이미지당 비용을 확인할 수 있습니다.

이 매핑에서는 SandBase가 요청과 응답 페이로드를 Chat
Completions로 변환하지 않고 그대로 전달합니다. 따라서 이미지 파트, 응답 모달리티, 공급자 정의 필드가 유지됩니다. URL에는 접두사 없는 모델 이름을
사용하세요. 예를 들어 `google/gemini-3.1-flash-image`는 경로에서 `gemini-3.1-flash-image`가 됩니다.
### 이미지 편집 {#edit-an-image}

원본 이미지를 텍스트 지시 옆에 `inlineData` 파트로 추가합니다. 보내는 바이트의 MIME 타입을 사용하세요.

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

### Google Gen AI SDK 사용 {#use-the-google-gen-ai-sdk}

공식 SDK가 SandBase를 가리키도록 설정하고 SandBase API 키를 사용합니다.

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

스트리밍하려면 같은 본문으로 `:streamGenerateContent?alt=sse`(SDK: `generate_content_stream`)를 호출하세요.

### 응답 처리 {#response-handling}
생성된 미디어는 반환된 candidate의 parts에서 읽습니다. 이 모델들은 네이티브 패스스루를 사용하므로 공급자 정의
필드의 대소문자 표기와 MIME 메타데이터가 받은 그대로 반환됩니다. 파일 확장자를 정하기 전에 base64 페이로드를 디코딩하고
실제 미디어 바이트를 확인하세요.

## 라우팅 및 변환 범위 {#routing-and-translation-boundaries}

SandBase는 요청한 네이티브 Gemini 프로토콜을 지원하는 공급자만 선택합니다. 선택한 모델에
호환되는 네이티브 매핑이 없으면 다른 프로토콜의 공급자로 대체하지 않고 요청이 실패합니다.

변환된 GenerateContent 경로를 사용하는 모델은 텍스트, 함수 호출과 응답, 인라인 `image/*` 데이터,
공개 HTTP(S) 이미지 참조를 지원합니다. 이 변환 경로는 지원되지 않는 인라인 MIME 타입, 비공개 Google Files 또는
`gs://` 참조, 여러 candidate, 지원되지 않는 응답 모달리티를 Google 스타일 `400 INVALID_ARGUMENT`
응답으로 거부합니다. 위에 나열된 이미지 생성 매핑은 원시 패스스루를 사용하므로 이러한 변환 전용
제한이 적용되지 않습니다. 반환된 미디어 필드는 선택한 공급자의 응답에 맞게 검증하세요.
