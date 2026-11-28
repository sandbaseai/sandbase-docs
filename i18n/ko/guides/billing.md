---
i18nSource: 91c5a0d1b6de6434
title: 가격과 사용량
description: 현재 모델 가격을 확인하고, 작업 비용을 조회하고, SandBase 결제를 안전하게 관리합니다.
---

# 가격과 사용량 {#pricing-and-usage}

SandBase는 종량제 과금을 사용합니다. 모델 제공 여부, 가격 공식, 캐시 배율, 기능별 요금은
각각 독립적으로 변경될 수 있으므로, 통합 시에는 복사해 둔 가격표에 의존하지 말고 실시간 메타데이터를
읽어야 합니다.

## 일일 무료 API 호출 {#daily-free-api-calls}

모든 조직은 UTC 기준 하루 100회의 무료 데이터 API 호출(검색, 소셜, 스크래핑, 이커머스, 금융)을 받습니다.
이 허용량은 대상이 되는 모든 데이터 API와 조직의 모든 키가 공유하며, 매일 00:00 UTC에 초기화됩니다. LLM과
미디어 모델은 대상이 아닙니다. 일부 데이터 API도 대상이 아닙니다. 일부 배치 엔드포인트, 크롤링 엔드포인트, Xiaohongshu PGY,
Douyin Xingtu `kol-*` 라우트처럼 가격이 높거나 공식으로 가격이 매겨지는 API는 첫 호출부터 과금됩니다.
도구가 대상인지 확인하려면 `sandbase_inspect`를 실행하세요. 대상 도구에는 `pricing.free_quota`가 있으며, 이 값이 없는 도구는 항상
과금됩니다.

- 허용량 내의 호출은 과금되지 않으며, 잔액이 0인 조직도 사용할 수 있습니다.
- 100번째 호출 이후에도 대상 호출은 계속 동작하며, 도구에 표시된 가격으로 호출당 과금됩니다. 허용량을 모두 사용했다는
  이유로 거부되거나 속도 제한되지 않습니다.
- 사용하지 않은 호출은 다음 날로 이월되지 않습니다.

[SandBase MCP 도구](/setup/)에서 `sandbase_inspect`는 대상 도구를 `pricing.free_quota`
(`daily_limit`, `scope`, `resets`)로 표시합니다. `sandbase_account`는 오늘의 허용량을 `free_api_quota`로 반환하며,
`daily_limit`, `used_today`, `remaining`, `resets_at`을 포함합니다. 횟수를 일시적으로 확인할 수 없으면 `used_today`와 `remaining`은
생략됩니다. 실행이 정산되면 `sandbase_run`과 `sandbase_run_get`은 `free_quota_status`를 보고합니다:
`free`(허용량으로 처리됨), `overage`(허용량을 모두 사용한 뒤 과금됨), `degraded`(허용량 횟수를 확인할 수 없어
과금되지 않음).

## Console에서 결제 관리 {#manage-billing-in-the-console}

**Developer → Billing**에서 잔액 확인, 크레딧 구매, 자동 충전 설정, 쿠폰 사용, 조직에서 사용할 수 있는 결제 설정 관리를
할 수 있습니다. 조직 수준의 요청, 토큰, 비용 요약은 **Developer → Activities → Usage**에서 확인하세요.

::: info 공개 API 범위
잔액, 충전, 결제 내보내기, 조직 전체 사용량 엔드포인트는 현재 지원되는 공개 API에 포함되지
않습니다. Console 네트워크 요청을 자동화하거나 내부 Console 라우트에 의존하지 마세요.
:::

## 현재 모델 가격 확인 {#read-current-model-pricing}

먼저 활성화된 모델을 찾습니다:

```bash
curl 'https://api.sandbase.ai/v1/models?q=gpt' \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

그런 다음 전체 모델 카드를 요청합니다:

```bash
curl https://api.sandbase.ai/v1/models/deepseek/deepseek-v4-flash \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

목록 엔드포인트는 탐색에 최적화되어 있어 토큰, 캐시, 추론의 세부 가격을 의도적으로 생략합니다.
선택한 모델의 세부 가격은 상세 응답의 `model_card`에서 읽으세요. 모든 LLM, 미디어 모델, 임베딩 모델, API 기능에
적용되는 범용 공식은 없습니다.

## 작업 하나의 기록된 비용 확인 {#check-one-task-s-recorded-cost}

작업이 작업 ID를 반환하면 해당 정산 기록을 조회합니다:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

응답은 현재 `cost`와 `estimated_cost`를 구분하고 정산이 확정되었는지 보고합니다. `settled`가 `true`가 되기 전에는
결제 대사에 `cost`를 사용하지 마세요. 작업 기록은 회계 원장이 아니라 운영용 조회 데이터입니다.
대사와 장기 기록에는 **Developer → Activities → Usage**에서 제공하는 결제 기록과 CSV 내보내기를
사용하세요.

## 비용 관리 방법 {#cost-control-practices}

- 새 워크로드를 시작하기 전에 현재 모델 카드를 확인합니다.
- `capability_tags`, `supported_modes`, `unified_schema`를 확인합니다. 더 저렴한 대안은 필요한 입력과 출력 동작을
  지원할 때만 유용합니다.
- 불필요한 프롬프트 컨텍스트를 줄이고, 선택한 모델이 지원하면 적절한 출력 토큰 한도를 설정합니다.
- 캐싱은 모델별로 다릅니다. 제공업체 전체에 할인이 적용된다고 가정하지 말고 모델 카드와 반환된 사용량 필드를
  확인합니다.
- 작업 ID는 작업 비용 조회용으로만 기록합니다. 비동기 `/v1/run` 작업은 반환된 불투명 실행 ID를 기록하고, 상태가 `pending` 또는 `running`인 동안에만 `GET /v1/run/{id}`를 폴링합니다.
- Console에서 조직에 제공하는 지출 관리 기능을 사용합니다.

## 결제 오류 {#payment-errors}

조직이 요청 비용을 충당할 수 없으면 API 작업이 HTTP `402`를 반환할 수 있습니다. 오류 엔벨로프는 API
호환 인터페이스마다 다르므로, 메시지 문자열 하나를 매칭하지 말고 HTTP 상태와 문서화된 오류 객체를
처리하세요. Console에서 결제 문제를 해결한 뒤에는 작업의 멱등성 및 복구 규칙에 따라 재시도하세요.

비디오 제출은 시작 전에 예상 비용도 확인합니다. 한 번에 $10 이상 충전하면
계정 등급이 올라가 더 많은 비디오 작업을 동시에 실행할 수 있습니다.
[동시 실행 한도](/guides/concurrency-limits)를 참고하세요.

현재 공개 계약은 [모델과 가격](/for-agents/models), [작업 비용](/api-reference/tasks/cost),
[오류](/api-reference/errors)를 참고하세요.
