---
i18nSource: f63049c1cf01130e
title: 오류와 재시도
description: SandBase API 실패를 분류하고, 재시도가 안전한 시점을 판단하며, 비밀 정보를 노출하지 않고 유용한 진단 정보를 남깁니다.
---

# 오류와 재시도 {#errors-and-retries}

HTTP 상태, 엔드포인트 계열, 작업의 의미에 따라 오류를 처리하세요. SandBase는 여러 호환 프로토콜을 제공하므로
모든 엔드포인트가 공유하는 단일 오류 JSON 형식은 없습니다.

## 엔드포인트의 오류 형식 확인하기 {#read-the-endpoint-s-error-shape}

- OpenAI 호환 작업은 일반적으로 message와 type이 담긴 `error` 객체를 반환합니다.
- Anthropic Messages는 Anthropic 호환 오류 envelope를 반환합니다.
- 핵심 플랫폼 작업은 평면적인 `{ "error": "..." }` 본문이나 문서화된 리소스별 오류를 반환할 수 있습니다.
- Google 및 제공업체 네이티브 작업은 문서에 명시된 경우 해당 호환 프로토콜 형식을 유지합니다.

응답의 HTTP 상태와 문서화된 본문을 사용하세요. 선택한 엔드포인트가 보장하지 않는 한 `code`, `param`,
`request_id` 같은 선택적 필드를 필수로 가정하지 마세요. 예시는 [API 오류 레퍼런스](/api-reference/errors)를,
작업별 응답은 [OpenAPI 명세](/openapi.yaml)를 참고하세요.

## 상태에 따라 대응 결정하기 {#decide-what-to-do-by-status}

| 상태 | 일반적인 원인 | 권장 대응 |
|---|---|---|
| `400` / `422` | 잘못된 본문, 파라미터 또는 지원되지 않는 모델 기능 | 재시도하기 전에 요청을 수정하세요. |
| `401` | 자격 증명이 없거나, 유효하지 않거나, 만료되었거나, 폐기됨 | 자격 증명을 교체하세요. |
| `402` | 청구 상태가 요청을 허용하지 않음 | 계정 잔액이나 지출 제어를 해결하세요. |
| `403` | 자격 증명 범위나 리소스 접근 권한이 부족함 | 권한이 있는 키나 리소스를 사용하세요. |
| `404` | 모델, 작업 또는 플랫폼 리소스를 찾을 수 없음 | 식별자와 조직을 확인하세요. |
| `409` | 리소스 상태 또는 동시 작업 충돌 | 현재 상태를 읽은 다음 재시도 여부를 결정하세요. |
| `429` | SandBase 또는 업스트림 제공업체가 요청을 제한함 | `Retry-After`가 있으면 따르고, 없으면 지터를 적용해 백오프하세요. |
| `500` / `502` / `503` / `504` | 내부, 업스트림 또는 일시적 가용성 장애 | 작업을 반복해도 안전한 경우에만 재시도하세요. |

이 표는 처리 가이드이며, 모든 엔드포인트가 모든 상태를 반환한다는 보장은 아닙니다.

## 상한이 있는 재시도 정책 사용하기 {#use-a-bounded-retry-policy}

반복해도 안전한 요청에는 지터를 적용한 지수 백오프를 사용하고, 지연 시간에 상한을 두며, 전체 요청 예산을 적용하세요.
외부 애플리케이션 계층에서 이미 재시도한다면 SDK 재시도를 비활성화하거나, 예산을 설정할 때 두 계층을 모두 고려하세요.

```python
import os
import random
import time

from openai import APIStatusError, OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def chat_with_backoff(messages, attempts=4):
    for attempt in range(attempts):
        try:
            return client.chat.completions.create(
                model="deepseek/deepseek-v4-flash",
                messages=messages,
            )
        except APIStatusError as error:
            retryable = error.status_code in {429, 500, 502, 503, 504}
            if not retryable or attempt == attempts - 1:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

응답에 `Retry-After`가 포함되어 있으면 대체 지연 시간 대신 이 값을 파싱해 따르세요. 정책은
구성 가능하게 유지하세요. 적절한 시도 횟수와 기한은 호출자의 지연 시간 및 비용 예산에 따라 다릅니다.

## 중복 부작용 방지하기 {#protect-against-duplicate-side-effects}

추론 요청을 반복하면 새로운 생성이 이루어지며 추가 비용이 발생할 수 있습니다. 애플리케이션이 유효한 답변이면 무엇이든
괜찮고 재생성을 감수할 수 있는 경우에만 허용됩니다.

작업을 생성, 업데이트, 삭제, 게시, 예약 또는 호출하는 작업에는 더 신중하게 접근하세요.

- 엔드포인트가 멱등성을 지원한다면 문서화된 방법을 사용하세요.
- 그렇지 않다면 결과가 불확실한 요청을 반복하기 전에 현재 상태를 읽으세요.
- 주변의 모델 스트림이 끊겼다는 이유만으로 도구 호출을 다시 실행하지 마세요.
- 재시도를 대조해야 한다면 자체 시스템에 클라이언트 작업 ID를 보관하세요.

## 시간 초과와 스트림은 별도로 처리하기 {#handle-timeouts-and-streams-separately}

시간 초과가 발생했다고 해서 서버가 요청 처리를 중단했다는 뜻은 아닙니다. 비동기 작업이나 상태를 변경하는
작업을 재시도하기 전에 가능하면 문서화된 리소스나 작업 상태를 조회하세요.

스트리밍 응답에서는 스트림 시작 전의 HTTP 오류와 일부 출력 후의 연결 끊김을 구분하세요.
정상적인 프로토콜 종료 신호만이 스트림이 완전하다는 것을 증명합니다. [스트리밍 응답](/guides/streaming)을 참고하세요.

## 유용하고 안전한 진단 정보 기록하기 {#log-useful-safe-diagnostics}

다음을 기록하세요.

- 엔드포인트와 모델 식별자
- HTTP 상태와 호환 오류 유형(있는 경우)
- 반환된 경우 제공업체 또는 요청 식별자
- 시도 횟수, 경과 시간, 응답 바이트 수신 여부

API 키, 자격 증명 값, 민감한 프롬프트 전체, 마스킹하지 않은 제공업체 응답은 기록하지 마세요. 사용자에게는 간결하고
조치 가능한 메시지를 보여 주고, 운영자를 위해서는 정제된 진단 정보를 보관하세요.

## 관련 안내 {#related-guidance}

- [API 오류 레퍼런스](/api-reference/errors)
- [요청 한도](/guides/rate-limiting)
- [스트리밍 응답](/guides/streaming)
- [인증](/api-reference/authentication)
