---
i18nSource: 4bd032d88bac0470
title: Seedance 비디오(Volcengine Ark 프로토콜)
description: Volcengine Ark Contents Generations 작업 프로토콜로 Seedance 2.0 및 2.5 비디오를 생성합니다. 입력, 폴링, 과금, 미디어 Asset을 다룹니다.
aside: false
outline: false
apiReference:
  title: Seedance 비디오
  operation: Video
  method: POST
  path: /api/v3/contents/generations/tasks
  description: Seedance 비디오 작업을 제출합니다. 제출에 성공하면 HTTP 200과 SandBase 작업 id를 반환합니다.
  groups:
    - title: 요청 본문
      fields:
        - name: model
          type: string
          required: true
          description: "지원되는 모델 식별자: bytedance/seedance/2.0-official 또는 bytedance/seedance/2.5-official."
        - name: content
          type: array
          required: true
          description: 유형이 지정된 텍스트와 선택적 미디어 입력입니다. 항목 형식은 모델이 검증합니다.
        - name: duration
          type: integer
          required: false
          description: 변경 없이 모델로 전달됩니다. 모델 검증이 적용됩니다.
        - name: resolution
          type: string
          required: false
          description: 변경 없이 모델로 전달됩니다. 모델 검증이 적용됩니다.
        - name: ratio
          type: string
          required: false
          description: 변경 없이 모델로 전달됩니다. 모델 검증이 적용됩니다.
        - name: generate_audio
          type: boolean
          required: false
          description: 변경 없이 모델로 전달됩니다. 지원되는 경우 생성된 오디오를 요청합니다.
  examples:
    - label: Text to video
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "bytedance/seedance/2.0-official",
            "content": [{"type": "text", "text": "A paper boat crossing a rain puddle"}],
            "duration": 5,
            "resolution": "720p"
          }'
  response:
    status: 200 OK
    code: '{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }'
---

<ApiReferencePage />

## Seedance 가이드 {#seedance-guide}

Seedance는 텍스트, 시작 및 종료 프레임, 그리고 이미지·비디오·오디오 같은 멀티모달 레퍼런스로 비디오를 생성합니다.
간단한 텍스트-비디오 클립부터 시각적 피사체, 카메라 움직임, 사운드트랙을 따르는 연출된 샷까지
다양하게 사용할 수 있습니다.

생성은 비동기로 이루어집니다. 작업을 제출한 뒤 종료 상태에 도달할 때까지 폴링하세요.

## 모델 선택 {#choosing-a-model}

| `model` | 적합한 용도 | 출력 해상도 |
| --- | --- | --- |
| `bytedance/seedance/2.5-official` | 1080p 결과물과 가장 높은 출력 해상도 | 480p, 720p, 1080p |
| `bytedance/seedance/2.0-official` | 480p 또는 720p로 충분할 때 더 저렴한 생성 | 480p, 720p |

두 모델은 같은 멀티모달 입력을 받으며, 하나의 요청 형식으로 텍스트-비디오, 이미지-비디오, 멀티모달 레퍼런스
워크플로를 지원합니다. 480p 또는 720p로 충분하고 더 저렴한 옵션을 원한다면 `2.0-official`을
선택하세요. 1080p가 필요하다면 `2.5-official`을 선택하세요.

## API 레퍼런스 {#api-reference}

| 메서드 | 경로 |
| --- | --- |
| `POST` | `/api/v3/contents/generations/tasks` |
| `GET` | `/api/v3/contents/generations/tasks/{task_id}` |

작업 목록 조회와 작업 취소 또는 삭제는 지원되지 않습니다. 결과를 조회하려면 반환된 작업 `id`를 저장하세요.

모든 요청은 작업을 생성할 때 사용한 같은 API 키로 인증하세요:

```
Authorization: Bearer $SANDBASE_API_KEY
```

`model` 값은 [모델 선택](#choosing-a-model)에 나온 이름 중 하나와 일치해야 합니다. 결과는 폴링으로
받는 것이 지원되는 방식이며, 이 엔드포인트에서는 `callback_url`에 의존하지 마세요.

## 빠른 시작 {#quickstart}

작업을 제출합니다:

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "A slow cinematic push across an alpine lake at sunrise"}
    ],
    "ratio": "16:9",
    "resolution": "720p",
    "duration": 5,
    "generate_audio": true
  }'
```

```json
{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }
```

`status`가 `succeeded`, `failed`, `expired`, `cancelled` 중 하나가 될 때까지 해당 id로 5~10초마다 작업을 폴링합니다:

```bash
curl https://api.sandbase.ai/api/v3/contents/generations/tasks/158d2649-e01d-45b9-b88a-ef3c450c601c \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "158d2649-e01d-45b9-b88a-ef3c450c601c",
  "model": "bytedance/seedance/2.5-official",
  "status": "succeeded",
  "created_at": 1787059000,
  "updated_at": 1787059150,
  "content": { "video_url": "https://media.sandbase.ai/files/158d2649.../0.mp4" },
  "usage": { "completion_tokens": 108900, "total_tokens": 108900 }
}
```

생성된 비디오는 `content.video_url`에서 확인할 수 있습니다.

## 입력 워크플로 선택 {#choose-an-input-workflow}

API는 일반적인 입력 워크플로 일곱 가지를 지원합니다. `content`의 각 항목에는 `type`이 있으며, 항목 유형과
역할의 조합으로 워크플로가 결정됩니다:

| 목표 | `content` 조합 | 사용 시점 |
| --- | --- | --- |
| 텍스트로 비디오 생성 | 텍스트 | 장면을 프롬프트만으로 모두 설명할 수 있을 때 |
| 시작 프레임 애니메이션 | 텍스트(선택) + `first_frame` 이미지 | 첫 프레임이 제공한 이미지와 일치해야 할 때 |
| 두 프레임 간 전환 | 텍스트(선택) + `first_frame` + `last_frame` | 샷의 시작과 끝을 제어해야 할 때 |
| 시각적 레퍼런스 따르기 | 텍스트(선택) + `reference_image` 이미지 | 피사체, 제품, 의상, 시각적 스타일을 알아볼 수 있게 유지해야 할 때 |
| 동작이나 카메라 연출 따르기 | 텍스트(선택) + `reference_video` 비디오 | 동작, 타이밍, 편집 리듬, 카메라 움직임을 레퍼런스 클립에서 가져올 때 |
| 오디오 레퍼런스 추가 | 텍스트/이미지/비디오 + `reference_audio` 오디오 | 대사, 음악, 목소리, 사운드 디자인이 결과를 이끌어야 할 때 |
| 전체 멀티모달 연출 | 텍스트 + 이미지 + 비디오 + 오디오 레퍼런스 | 하나의 샷에서 서로 다른 에셋이 외형, 동작, 소리를 각각 제어할 때 |

오디오는 단독으로 사용할 수 없습니다. 오디오 항목이 포함된 모든 요청에는 텍스트, 이미지, 비디오 항목이
하나 이상 있어야 합니다.

### 콘텐츠 항목 형식 {#content-item-shapes}

```json
{ "type": "text", "text": "A puppy running across a sunlit lawn" }
```

```json
{ "type": "image_url", "image_url": { "url": "https://example.com/ref.jpg" }, "role": "reference_image" }
```

```json
{ "type": "video_url", "video_url": { "url": "https://example.com/ref.mp4" }, "role": "reference_video" }
```

```json
{ "type": "audio_url", "audio_url": { "url": "https://example.com/bgm.mp3" }, "role": "reference_audio" }
```

`role`은 모델이 에셋을 사용하는 방식을 지정합니다:

| 에셋 | `role` | 효과 |
| --- | --- | --- |
| 이미지 | `first_frame` | 이미지를 시작 프레임으로 사용합니다 |
| 이미지 | `last_frame` | 이미지를 종료 프레임으로 사용합니다. 같은 요청에 `first_frame`을 포함하세요 |
| 이미지 | `reference_image` | 피사체, 구도, 제품, 의상, 시각적 스타일을 참조합니다 |
| 비디오 | `reference_video` | 동작, 카메라 워크, 타이밍, 편집 리듬을 참조합니다 |
| 오디오 | `reference_audio` | 목소리, 대사, 음악, 사운드 디자인을 참조합니다 |

이미지 항목은 공개 URL 또는 인라인 `data:image/...;base64,...` 값을 받습니다. 비디오와 오디오 레퍼런스는
모델이 다운로드할 수 있는 공개 URL을 사용해야 합니다.

`video_url` 항목이 하나라도 포함되면 요청이 비디오-비디오 모드가 되어 토큰 요율이 달라집니다.
[과금](#billing)을 참고하세요.

## 자주 쓰는 레시피 {#common-recipes}

아래 예제는 요청 본문입니다. [빠른 시작](#quickstart)에 나온 작업 생성 엔드포인트로 보내세요.

### 첫 프레임 애니메이션 {#animate-a-first-frame}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "The woman slowly looks up and smiles as the camera gently pushes in"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 5,
  "generate_audio": true
}
```

### 첫 프레임에서 마지막 프레임으로 전환 {#create-a-first-to-last-frame-transition}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "A smooth transition from a bright afternoon into a neon-lit night"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"},
    {"type": "image_url", "image_url": {"url": "https://example.com/last-frame.jpg"}, "role": "last_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 6
}
```

### 이미지, 비디오, 오디오 레퍼런스로 샷 연출 {#direct-a-shot-with-image-video-and-audio-references}

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "First-person fruit tea commercial, camera pushes in on the layered foam"},
      {"type": "image_url", "image_url": {"url": "https://example.com/ref.jpg"}, "role": "reference_image"},
      {"type": "video_url", "video_url": {"url": "https://example.com/ref.mp4"}, "role": "reference_video"},
      {"type": "audio_url", "audio_url": {"url": "https://example.com/bgm.mp3"}, "role": "reference_audio"}
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 11
  }'
```

프롬프트에서 각 레퍼런스에 명확한 역할을 지정하세요. 예: “이미지의 제품 외형을 유지하고, 비디오의
카메라 움직임을 사용하고, 오디오의 템포를 따르세요.” 모든 에셋이 결과 전체를 제어하도록 요청하는 것보다
이 방식이 더 안정적입니다.

## 효과적인 프롬프트 작성 {#writing-an-effective-prompt}

실용적인 프롬프트는 보통 다음 순서를 따릅니다:

1. **피사체** — 샷에 등장하는 사람이나 사물.
2. **동작** — 무엇이 변하거나 움직이는지.
3. **장면** — 장소, 시간대, 날씨, 주변 디테일.
4. **시각적 스타일** — 시네마틱, 다큐멘터리, 제품 광고, 애니메이션 등.
5. **카메라** — 프레이밍, 렌즈 느낌, 카메라 움직임, 컷.
6. **사운드** — `generate_audio`가 활성화된 경우 대사, 앰비언스, 음악, 효과음.

유지해야 할 요소를 명확히 적으세요. 예: “제품 라벨이 계속 읽을 수 있게 보이고, 카메라는 천천히 한 번
푸시인하며, 장면 전환 없이 자연스러운 실내 앰비언스.” 레퍼런스가 여러 개라면 각 레퍼런스에서 가져올 시각적 특성이나
동작 특성을 설명하세요.

## 출력 옵션 {#output-options}

| 파라미터 | 유형 | 기본값 | 값 |
| --- | --- | --- | --- |
| `resolution` | string | `720p` | `480p`, `720p`, `1080p`. `2.0-official`은 `1080p`를 지원하지 않습니다 |
| `ratio` | string | `adaptive` | `16:9`, `9:16`, `4:3`, `3:4`, `1:1`, `21:9`, `adaptive`. `adaptive`는 입력과 프롬프트에 따라 비율을 선택합니다 |
| `duration` | integer | `5` | 4~15초, 또는 지원 범위 안에서 모델이 선택하도록 하려면 `-1` |
| `generate_audio` | boolean | `true` | 동기화된 목소리, 효과음, 배경 음악을 생성합니다 |
| `seed` | integer | `-1` | `-1`~`2^32-1`. 같은 프롬프트와 seed는 동일하지는 않지만 유사한 출력을 생성합니다 |
| `watermark` | boolean | `false` | 오른쪽 아래에 AI 생성 워터마크를 추가합니다 |
| `tools` | array | `[]` | `[{"type": "web_search"}]`를 지정하면 샷을 계획할 때 웹 검색을 사용합니다 |

### 작업 제어 {#task-control}

| 파라미터 | 유형 | 기본값 | 참고 |
| --- | --- | --- | --- |
| `execution_expires_after` | integer | `172800` | 작업 타임아웃(초)이며 3600~259200입니다. 이 시간을 넘긴 작업은 `expired`가 됩니다 |
| `service_tier` | string | `default` | 이 모델들은 `flex`를 지원하지 않습니다 |
| `safety_identifier` | string | — | 불투명한 최종 사용자 식별자이며 최대 64자입니다. 원본 개인 데이터가 아닌 해시를 보내세요 |

### 프레임 크기 {#frame-size}

`resolution`과 `ratio`가 함께 픽셀 크기를 결정합니다:

| 해상도 | 16:9 | 9:16 | 4:3 | 3:4 | 1:1 | 21:9 |
| --- | --- | --- | --- | --- | --- | --- |
| 480p | 864×496 | 496×864 | 752×560 | 560×752 | 640×640 | 992×432 |
| 720p | 1280×720 | 720×1280 | 1112×834 | 834×1112 | 960×960 | 1470×630 |
| 1080p | 1920×1080 | 1080×1920 | 1664×1248 | 1248×1664 | 1440×1440 | 2206×946 |

## 작업 상태 {#task-status}

| `status` | 의미 | 조치 |
| --- | --- | --- |
| `queued` | 접수되어 시작 대기 중 | 5~10초마다 계속 폴링합니다 |
| `running` | 생성 중 | 계속 폴링합니다 |
| `succeeded` | 완료 | `content.video_url`을 다운로드합니다 |
| `failed` | 콘텐츠 검토에서 거부되었거나 모델 오류 발생 | `error.message`를 확인하고, 재시도 전에 프롬프트를 수정합니다 |
| `expired` | `execution_expires_after`를 초과함 | 다시 제출합니다 |
| `cancelled` | 생성이 시작되기 전에 종료됨 | 다시 제출합니다 |

### 작업 필드 {#task-fields}

| 필드 | 유형 | 참고 |
| --- | --- | --- |
| `id` | string | 제출 시 반환된 작업 id |
| `model` | string | 보낸 `model` 값 |
| `status` | string | 위 표 참고 |
| `created_at` | integer | Unix 초 |
| `updated_at` | integer | Unix 초. 작업이 끝날 때까지 `created_at`과 같습니다 |
| `content` | object | 작업이 성공하기 전까지 비어 있습니다. 생성된 `video_url`을 담습니다 |
| `usage` | object | 토큰 수. [과금](#billing) 참고 |
| `error` | object | `failed`와 `expired`일 때 존재합니다. `code`와 `message`를 포함합니다 |

### 전체 Python 흐름 {#complete-python-flow}

```python
import os
import time

import requests

BASE_URL = "https://api.sandbase.ai/api/v3/contents/generations/tasks"
HEADERS = {
    "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
    "Content-Type": "application/json",
}

task = requests.post(
    BASE_URL,
    headers=HEADERS,
    json={
        "model": "bytedance/seedance/2.5-official",
        "content": [
            {
                "type": "text",
                "text": "A quiet shoreline at sunrise, gentle waves, one slow camera push-in",
            }
        ],
        "ratio": "16:9",
        "resolution": "720p",
        "duration": 5,
        "generate_audio": True,
    },
)
task.raise_for_status()
task_id = task.json()["id"]

while True:
    time.sleep(8)
    result = requests.get(f"{BASE_URL}/{task_id}", headers=HEADERS)
    result.raise_for_status()
    data = result.json()
    print(data["status"])

    if data["status"] == "succeeded":
        print(data["content"]["video_url"])
        break
    if data["status"] in {"failed", "expired", "cancelled"}:
        raise RuntimeError(data.get("error", {"message": data["status"]}))
```

## 과금 {#billing}

이 모델들은 작업이 끝날 때 보고되는 `usage.completion_tokens`를 기준으로 과금됩니다. 토큰 요율은 두 가지
기준에 따라 달라집니다:

- **입력에 비디오가 포함되는지 여부.** 비디오-비디오 요청, 즉 유형이 `video_url`인 `content` 항목이 하나라도 있는 요청은
  텍스트-비디오보다 낮은 요율로 과금됩니다.
- **출력 해상도.** `2.5-official`에서는 1080p가 480p와 720p보다 높게 과금됩니다. `2.0-official`의 요율은 해상도에 따라
  달라지지 않습니다.

`usage`는 `completion_tokens`와 `total_tokens`를 보고하며, 현재 두 값은 같습니다. 작업이 실행 중일 때는 비어 있습니다.
실제 요금은 [계정 기록](/api-reference/account/history)에서, 현재 요율은
[가격 가이드](/guides/billing)에서 확인하세요.

## 오류 {#errors}

잘못된 요청은 즉시 오류를 반환합니다. 생성 중 발생한 오류는 폴링 후 작업에 나타납니다. 두 경우 모두
기계가 읽을 수 있는 `code`와 사람이 읽을 수 있는 `message`가 있는 `error` 객체를 사용합니다:

```json
{ "error": { "code": "InvalidParameter", "message": "model is required", "type": "BadRequest" } }
```

| HTTP | `code` | `type` |
| --- | --- | --- |
| 400 | `InvalidParameter` | `BadRequest` |
| 401 | `AuthenticationError` | `Unauthorized` |
| 403 | `PermissionDenied` | `Forbidden` |
| 404 | `ResourceNotFound` | `NotFound` |
| 429 | `RateLimitExceeded` | `TooManyRequests` |
| 500 | `InternalServiceError` | `InternalServerError` |
| 503 | `InternalServiceError` | `ServiceUnavailable` |

일반적인 복구 방법:

| 결과 | 시도할 방법 |
| --- | --- |
| `400 InvalidParameter` | 모델 이름, 필수 콘텐츠, 역할, 해상도, 길이, 에셋 URL을 확인합니다 |
| 콘텐츠 검토 오류로 작업 상태 `failed` | 다시 제출하기 전에 프롬프트를 다시 쓰거나 문제가 된 레퍼런스 에셋을 교체합니다 |
| 작업 상태 `expired` | 새 작업을 제출합니다. 고해상도나 긴 클립이라면 더 긴 `execution_expires_after`를 고려하세요 |
| `429 RateLimitExceeded` | 지수 백오프로 재시도하고 동시 제출 수를 줄입니다 |
| `503 ServiceUnavailable` | 잠시 후 같은 요청을 재시도합니다 |

## 등록된 미디어 Asset 사용 {#use-registered-media-assets}

SandBase는 `/v1/assets`에서 공식 호환 Asset 프로토콜을 제공합니다. Asset 요청과 반환되는 `asset://`
레퍼런스는 공식 프로토콜을 따르며, 이 레퍼런스는 네이티브 ByteDance Contents
Generations 요청에 변경 없이 그대로 전달됩니다.
`bytedance/seedance/2.5-official`과 `bytedance/seedance/2.0-official` 모두 일반적으로 공개 HTTP(S) URL을 받는 위치에서
이 레퍼런스를 받습니다.

전체 워크플로는 다음과 같습니다:

1. `POST /v1/assets`로 접근 가능한 미디어 URL을 등록합니다.
2. 제공업체가 Asset을 사용할 수 있다고 보고할 때까지 `GET /v1/assets/{external_id}`를 조회합니다.
3. 반환된 `asset_url`을 Seedance `content` 항목에 넣고 생성 작업을 제출합니다.

### 공식 호환 Asset 작업 {#official-compatible-asset-operations}

| 메서드 | 경로 | 용도 |
| --- | --- | --- |
| `POST` | `/v1/assets` | 접근 가능한 미디어 URL을 등록하고 공식 호환 `asset://` 레퍼런스를 받습니다 |
| `GET` | `/v1/assets/{external_id}` | 제공업체 상태를 읽고 현재 미리보기/다운로드 URL을 얻습니다 |

현재 공개 API는 등록과 조회만 제공합니다. Asset 그룹, 목록 조회, 이름 변경, 업데이트, 삭제는
공개 작업이 아닙니다. Asset은 API 키와 연결된 조직에 속합니다.

### 1단계: Asset 등록 {#step-1-register-the-asset}

접근 가능한 URL을 `POST /v1/assets`로 보냅니다. `asset_type`은 대소문자를 구분하며 `Image`, `Video`, `Audio` 중 하나여야 합니다:

```bash
curl -X POST https://api.sandbase.ai/v1/assets \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/product-reference.png",
    "asset_type": "Image",
    "name": "Product reference"
  }'
```

응답에서 `asset_url`을 저장합니다:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Image",
  "name": "Product reference",
  "created_at": "2026-07-10T15:04:03Z"
}
```

`asset://` 뒤의 값이 공식 호환 조회 작업에서 사용하는 `external_id`입니다.

### 2단계: 준비 상태 확인 {#step-2-check-readiness}

`asset://` 접두사를 뺀 `external_id`로 Asset을 조회합니다:

```bash
curl https://api.sandbase.ai/v1/assets/asset-20260710150403-hx4hf \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "external_id": "asset-20260710150403-hx4hf",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "status": "Active",
  "asset_type": "Image",
  "name": "Product reference",
  "download_url": "https://media.example.com/current-signed-url",
  "created_at": "2026-07-10T15:04:03Z"
}
```

`status`는 모든 값이 정해진 열거형이 아니라 제공업체가 정의하는 개방형 값으로 취급하세요. 생성 작업을 제출하기 전에 제공업체가 사용 가능한
상태를 보고할 때까지 기다리세요. 일반적인 준비 완료 값은 `Active`입니다. `download_url`은 제공업체가 관리하며
처리 중에는 비어 있을 수 있습니다. 현재 미리보기 URL이 필요하면 Asset을 다시 조회하세요. Seedance 요청에는 `download_url`을 복사하지 말고
영구적인 `asset_url`을 계속 사용하세요.

### 3단계: Asset으로 생성 {#step-3-generate-with-the-asset}

미디어 유형에 맞는 URL 필드에 `asset_url`을 넣습니다. 이 예제는 등록된 이미지를 시각적
레퍼런스로 사용합니다:

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {
        "type": "text",
        "text": "Create a cinematic product shot. Keep the bottle shape and label from the reference image."
      },
      {
        "type": "image_url",
        "image_url": {"url": "asset://asset-20260710150403-hx4hf"},
        "role": "reference_image"
      }
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 5,
    "generate_audio": true
  }'
```

생성 응답은 작업 `id`를 반환합니다. 선택한 모델 페이지에 설명된 대로
`GET /api/v3/contents/generations/tasks/{task_id}`를 폴링하세요.

### 콘텐츠 항목과 역할 선택 {#choose-the-content-item-and-role}

| Asset 유형 | `content[].type` | URL 필드 | 지원 역할 | 용도 |
| --- | --- | --- | --- | --- |
| 이미지 | `image_url` | `image_url.url` | `first_frame` | 정확히 이 프레임에서 비디오를 시작합니다 |
| 이미지 | `image_url` | `image_url.url` | `last_frame` | 이 프레임으로 끝냅니다. 같은 요청에 `first_frame`을 포함하세요 |
| 이미지 | `image_url` | `image_url.url` | `reference_image` | 피사체, 제품, 구도, 의상, 시각적 스타일을 유지합니다 |
| 비디오 | `video_url` | `video_url.url` | `reference_video` | 동작, 타이밍, 카메라 워크, 편집 리듬을 따릅니다 |
| 오디오 | `audio_url` | `audio_url.url` | `reference_audio` | 목소리, 대사, 음악, 사운드 디자인을 따릅니다 |

오디오만 입력으로 사용할 수는 없습니다. `reference_audio` Asset은 텍스트, 이미지 또는 비디오와 함께 사용하세요. `video_url`이
포함된 요청은 비디오-비디오 과금 요율을 사용합니다.

#### 비디오 Asset 예제 {#video-asset-example}

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-video1"},
  "role": "reference_video"
}
```

#### 오디오 Asset 예제 {#audio-asset-example}

```json
{
  "type": "audio_url",
  "audio_url": {"url": "asset://asset-20260710150403-audio1"},
  "role": "reference_audio"
}
```

### 직접 URL과 `asset://` 레퍼런스 중 무엇을 쓸까? {#direct-url-or-asset-reference}

| 입력 | 적합한 경우 | 장단점 |
| --- | --- | --- |
| 공개 HTTP(S) URL | 미디어가 이미 호스팅되어 있고 한 번만 사용할 때 | 가장 빠른 방법이지만, 작업 제출과 제공업체의 가져오기가 끝날 때까지 URL에 접근할 수 있어야 합니다 |
| `asset://` 레퍼런스 | 공식 Asset 프로토콜로 미디어를 재사용할 때 | 등록/준비 확인 단계가 추가되지만, 이후 Seedance 작업에 사용할 영구 레퍼런스를 얻습니다 |

요청 파라미터, 폴링, 작업 상태, 과금은 위의 [Seedance 가이드](#seedance-guide)를 참고하세요.

## 공식 ByteDance 리소스 {#official-bytedance-resources}
- [Seedance 비디오 생성 문서](https://www.volcengine.com/docs/82379/1520758?lang=en)
- [콘텐츠 생성 작업 생성 API](https://api.volcengine.com/api-explorer/?action=CreateContentsGenerationsTasks&groupName=%E8%A7%86%E9%A2%91%E7%94%9F%E6%88%90API&serviceCode=ark&version=2024-01-01)
- [Seedance 2.0 프롬프트 가이드](https://www.volcengine.com/docs/82379/2222480?lang=en)
