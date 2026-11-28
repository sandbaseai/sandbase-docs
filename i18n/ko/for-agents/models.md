---
i18nSource: b95a8cd6f82c3a9a
title: AI가 읽기 쉬운 Models 및 가격
description: Models API로 현재 SandBase 모델, 기능, 스키마, 가격을 확인합니다.
---

# Models 및 가격 {#models-pricing}

모든 모델은 SandBase API 키 하나로 사용할 수 있습니다. 모델 제공 여부, 스키마, 기능, 컨텍스트 한도,
가격은 각각 독립적으로 변경될 수 있습니다.

::: info 실시간 모델 메타데이터 사용하기
현재의 신뢰할 수 있는 데이터를 얻으려면 항상 `GET /v1/models`와 `GET /v1/models/{id_or_name}`을 사용하세요. 모든
LLM이 스트리밍, 비전, 도구, 구조화된 출력, 캐싱을 지원한다고 추론하지 말고, 한 모델의 입력 필드나
가격을 다른 모델에 그대로 적용하지 마세요.
:::

## 카탈로그 및 상세 응답 {#catalog-and-detail-responses}

`GET /v1/models`는 `id`, `object`, `created`, `owned_by`를 포함한 OpenAI 호환 식별 레코드를 반환합니다.
SandBase의 기능, 스키마, 가격 메타데이터는 의도적으로 제외됩니다.

`GET /v1/models/{id_or_name}`은 `unified_schema`, `supported_modes`, `model_card`를 추가로 반환합니다. 자세한 가격은
`model_card`에서 확인하세요. 최상위 `pricing` 객체는 없습니다. `capability_tags`, `supported_modes`,
`unified_schema`는 모델별 값으로 취급하세요.

## 모델 찾기 {#discover-models}

```bash
curl 'https://api.sandbase.ai/v1/models?type=llm' \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

목록 엔드포인트는 `q`, `vendor`, `type`, `order`를 지원합니다. 페이지네이션은 없으며 기본값은 `type=llm`입니다.
`id`, `object`, `created`, `owned_by`를 포함한 OpenAI 호환 항목을 반환합니다. 세부 정보를 요청하거나 모델을 호출할 때는
반환된 `id`를 모델 이름으로 사용하세요.

비동기 `202` 응답을 받으면 반환된 ID로 `GET /v1/run/{id}`를 폴링하세요. ID는 불투명한 값으로 취급하고,
ID 접두사나 호환성 헤더에서 형식을 추론하거나 다른 폴링 경로를 구성하지 마세요.

## 모델 하나 확인하기 {#inspect-one-model}

모델 이름에는 벤더 접두사가 붙으며 `/`가 포함될 수 있습니다.

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

실행하기 전에 다음을 확인하세요.

- `enabled`와 `execution_mode`
- `capability_tags`와 `supported_modes`
- 허용되는 요청 필드를 정의한 `unified_schema`
- 현재 가격 공식과 토큰 또는 캐시 배수를 담은 `model_card`

## 실제 작업 비용 확인하기 {#check-actual-task-cost}

완료되었거나 진행 중인 작업은 오래된 표로 다시 계산하지 말고 기록된 비용을 조회하세요.

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

응답 계약은 [Models API 레퍼런스](/api-reference/models/)를, 응답 형식과 재시도 안내는
[오류 가이드](/for-agents/errors)를 참고하세요.
