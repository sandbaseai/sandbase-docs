---
i18nSource: 43d08f60800d37f5
title: Media Assets API
description: 재사용 가능한 미디어 Asset을 등록하고 현재 메타데이터와 다운로드 URL을 조회합니다.
---

# Media Assets API {#media-assets-api}

`/v1/assets`에서 제공되는 공식 호환 Asset 프로토콜을 사용해 미디어 URL을 등록하고, 네이티브 동영상 생성 요청에 사용할
`asset_url`을 받습니다.

미디어를 등록하고 반환된 `asset://` 참조를 Seedance에서 사용하는 전체 예시는 Seedance 레퍼런스의
[등록된 미디어 Asset 사용하기](/api-reference/volcengine-contents-generations#use-registered-media-assets)를 참고하세요.

## 개요 {#overview}

| 메서드 | 경로 | 설명 |
|--------|------|-------------|
| `POST` | `/v1/assets` | Asset 등록 |
| `GET` | `/v1/assets/{id}` | Asset 메타데이터와 현재 다운로드 URL 조회 |

## POST /v1/assets {#post-v1-assets}

공개적으로 접근 가능한 파일 URL을 Asset 라이브러리에 등록하고, 동영상 생성 요청에서 참조할 수 있는 `asset_url`을 반환합니다.

### 요청 {#request}

```http
POST /v1/assets
Authorization: Bearer $SANDBASE_API_KEY
Content-Type: application/json
```

```json
{
  "url": "https://example.com/tea-ad.mp4",
  "asset_type": "Video",
  "name": "Tea ad reference video"
}
```

| 필드 | 타입 | 필수 | 설명 |
|-------|------|----------|--------------|
| `url` | string | 예 | 공개적으로 접근 가능한 파일 URL |
| `asset_type` | string | 예 | Asset 유형: `Image` / `Video` / `Audio`(대소문자 구분) |
| `name` | string | 아니요 | 선택적 Asset 이름 |

### 응답 {#response}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| 필드 | 설명 |
|-------|--------------|
| `id` | 내부 레코드 ID |
| `asset_url` | 동영상 생성 요청에 사용하는 참조 주소 |
| `asset_type` | Asset 유형 |
| `name` | Asset 이름 |
| `created_at` | 생성 타임스탬프 |

### asset_url 사용하기 {#using-asset-url}

등록이 끝나면 선택한 모델의 실시간 스키마에서 Asset 참조를 받는 입력 필드에 `asset_url`을 전달하세요. 필드 이름은 모델마다 다릅니다. 예를 들면 다음과 같습니다.

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-hx4hf"},
  "role": "reference_video"
}
```

### 오류 {#errors}

| HTTP 상태 | 설명 |
|-------------|--------------|
| 400 | 필수 필드 누락 또는 잘못된 `asset_type` |
| 502 | 업스트림 Asset 등록 실패 |
| 500 | 사용 가능한 자격 증명이 없거나 내부 오류 발생 |

---

## GET /v1/assets/{id}

외부 ID로 등록된 Asset의 서명된 다운로드 URL을 조회합니다. 원본 파일을 미리 보거나 다운로드할 때 사용합니다.

### 요청 {#request-1}

```http
GET /v1/assets/asset-20260710150403-hx4hf
Authorization: Bearer $SANDBASE_API_KEY
```

| 파라미터 | 위치 | 설명 |
|-----------|----------|--------------|
| `id` | path | 외부 ID(`asset_url`에서 `asset://` 뒤의 부분) |

### 응답 {#response-1}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "external_id": "asset-20260710150403-hx4hf",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "status": "Active",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "download_url": "https://cdn.example.com/...?X-Tos-Expires=43200",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| 필드 | 설명 |
|-------|--------------|
| `asset_url` | 동영상 생성용 참조 주소(영구) |
| `status` | 제공업체가 보고하는 Asset 수명 주기 상태. 정해진 값 목록이 없는 문자열로 취급하세요. |
| `download_url` | 제공업체가 반환한 다운로드 URL. Asset이 준비되지 않은 동안에는 비어 있을 수 있습니다 |

### 오류 {#errors-1}

| HTTP 상태 | 설명 |
|-------------|--------------|
| 404 | Asset을 찾을 수 없거나 해당 조직에 속하지 않음 |
| 502 | 업스트림 조회 실패 |

---

## 참고 사항 {#notes}

::: tip 중요
- `asset_url`의 형식은 `asset://{external_id}`이며, 지원되는 모델 입력에 전달하는 재사용 가능한 참조입니다
- `download_url`은 제공업체가 관리하는 값으로 취급하세요. 비어 있거나 더 이상 동작하지 않으면 이 엔드포인트를 다시 조회해 현재 값을 받으세요
- `asset_type`은 대소문자를 구분합니다: `Image` / `Video` / `Audio`
- 제출하는 URL은 공개적으로 접근 가능해야 합니다(플랫폼이 해당 URL을 가져올 수 있어야 합니다)
:::
