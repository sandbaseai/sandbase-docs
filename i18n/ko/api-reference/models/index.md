---
i18nSource: 3ccdc1071b9be798
title: Models API
description: SandBase 모델 메타데이터, 요금, 지원 상태, 기능을 탐색합니다.
---

# Models API {#models-api}

추론 엔드포인트를 선택하기 전에 Models API로 모델을 탐색합니다. 목록 작업은 OpenAI와 호환되며 간결한 식별 레코드를 반환합니다. SandBase 기능, 스키마, 요금 메타데이터가 필요하면 모델 하나를 조회합니다.

| 작업 | 엔드포인트 | 문서 |
|---|---|---|
| 모델 목록 조회 | `GET /v1/models` | [모델 목록 조회](./list) |
| 모델 하나 조회 | `GET /v1/models/{id_or_name}` | [모델 조회](./get) |
| 경로로 API 기능 호출 | `GET/POST /v1/api/{vendor}/{upstream_path}` | [API 패스스루](./api-passthrough) |
| 모델 또는 API 기능 실행 | `POST /v1/run` | [기능 실행](./run) |
| 비동기 결과 조회 | `GET /v1/run/{id}` | [실행 결과 조회](./run-get) |
| 비동기 콜백 수신 | `POST /v1/run`의 `webhook_url` | [웹훅 콜백](./run#webhook-callbacks) |
| 지원 모델 둘러보기 | — | [Models 카탈로그](https://www.sandbase.ai/models) |

모델을 실행하려면 [Models 카탈로그](https://www.sandbase.ai/models)에서 해당 레퍼런스 페이지를 여세요. 각 페이지에 정확한 식별자, 요청 필드, 요금이 나와 있습니다. 이 페이지에서는 탐색, 통합 기능 실행기, API 패스스루, 에셋, 작업 비용 조회를 다룹니다.

`GET /v1/models`는 `q`, `vendor`, `type`, `order`를 지원하며 페이지네이션은 없습니다. `type`을 생략하면 기본값 `llm`이 적용되고, `type=`처럼 명시적으로 비우면 모든 공개 모델 유형이 나열됩니다. `vendor` 필터는 대소문자를 구분하는 정확 일치이고, `q`는 대소문자를 구분하지 않는 부분 문자열 검색입니다. 각 목록 항목에는 `id`, `object`, `created`, `owned_by`가 포함되며, `id`는 요청에 사용하는 논리 모델 이름입니다.

모델 이름에는 `/`가 포함될 수 있습니다. 상세 엔드포인트를 호출할 때는 슬래시를 경로 구분자 그대로 전달합니다(예: `/v1/models/openai/gpt-5.6-luna`). 서버 라우트가 나머지 경로 전체를 하나의 논리 식별자로 처리합니다. 오래된 가이드의 식별자를 복사하지 말고 `GET /v1/models`에서 현재 ID를 확인하세요.

추론 API가 비동기 `202` 응답을 반환하면, 반환된 불투명 ID로 `GET /v1/run/{id}`를 폴링합니다. ID 접두사를 추측하거나 호환성 헤더를 근거로 다른 폴링 경로를 만들지 마세요.
