---
i18nSource: d326fdb78ea64bdf
title: 속도 제한
description: 상한이 있는 재시도, 지터, 대기열, 멱등성을 고려한 요청 처리로 SandBase API 속도 제한을 안전하게 처리합니다.
---

# 속도 제한 {#rate-limits}

SandBase는 조직에 분당 요청 수 한도를 할당할 수 있습니다. 이 한도는 조직의 모든 API 키가 공유하며
1분 슬라이딩 윈도우로 계산됩니다. 업스트림 모델 제공업체도 자체적으로
`429 Too Many Requests` 응답을 반환할 수 있습니다. SandBase가 워크로드에 할당량을 지정하지 않았다면 할당량을 하드코딩하지 마세요.

## 조직의 한도 {#your-organization-s-limit}
한도는 조직별로 할당되므로 SandBase는 고정된 분당 요청 수 하나를 공개하지 않습니다. 조직의 모든
API 키가 같은 한도에 합산되므로 키를 더 만들어도 한도가 늘어나지 않습니다. 현재 이 한도는
공개 API나 Console에 표시되지 않습니다.

워크로드에 보장된 한도나 더 높은 한도가 필요하다면 조직, 애플리케이션, 예상 평균 요청률, 예상 최대 요청률을
SandBase 지원팀에 알려 주세요. 문서화되지 않은 숫자 기본값을 기준으로 프로덕션 클라이언트를 설계하지 마세요.

## 429 응답 처리 {#handle-a-429-response}

플랫폼이 생성하는 `/v1/*` 속도 제한 응답은 평면 오류 본문을 사용합니다:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{"error":"organization rate limit exceeded"}
```

조직 한도는 `POST /v1/run`, `POST /v1/chat/completions`, `POST /v1/responses`, `POST /v1/messages`, `POST /v1/upload`와 Gemini `generateContent`, `streamGenerateContent`, `POST /v1beta/interactions` 엔드포인트에 적용됩니다.
`GET /v1/run/{id}` 같은 폴링 엔드포인트는 집계되지 않습니다. 프로토콜 호환 엔드포인트는 Anthropic 또는 Google 오류 형식처럼
자체 오류 엔벨로프로 같은 `429`를 반환합니다. 제공업체에서 발생한 응답은 호환 엔드포인트의 오류
형식을 사용할 수 있으며 제공업체의 속도 제한 헤더를 포함할 수 있습니다.

`Retry-After`와 남은 할당량 헤더는 보장되지 않습니다. `Retry-After`가 있으면 그 값을 따르세요. 없으면
지터와 최대 시도 횟수를 둔 지수 백오프를 사용하세요.

```python
import os
import random
import time

from openai import OpenAI, RateLimitError

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def create_with_backoff(**request):
    for attempt in range(5):
        try:
            return client.chat.completions.create(**request)
        except RateLimitError:
            if attempt == 4:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

OpenAI SDK도 `max_retries`로 내장 재시도를 지원합니다. 재시도가 여러 계층에서 중복되지 않도록 SDK 재시도와
애플리케이션 재시도 루프 중 하나를 의도적으로 선택하세요.

## 안전한 작업만 재시도 {#retry-only-safe-operations}

추론 요청을 반복하면 두 번째 생성이 일어나 추가 비용이 발생할 수 있습니다. 애플리케이션이 재생성을 허용할 때만
재시도하세요. 작업이 멱등성을 문서화하고 있거나 첫 시도가 성공하지 않았음을 애플리케이션이 증명할 수 있는 경우가 아니라면
상태를 변경하는 요청을 자동으로 재시도하지 마세요.

스트리밍 요청에서 `429`는 보통 스트림이 시작되기 전에 도착합니다. 바이트가 도착한 뒤의 연결 끊김은
속도 제한 오류로 가정하지 말고 중단된 생성으로 취급하세요. 부분 출력은 제품 요구 사항에 따라 보존하거나 버리세요.
다시 시작하면 새 생성이 만들어집니다.

## 처리량 제어 {#control-throughput}

- 제한 없는 배치를 한꺼번에 보내지 말고 동시 실행 수를 제한합니다.
- 급증하는 작업은 대기열에 넣고 전송 속도를 평활화합니다.
- 중복 요청을 피하고, 개인정보 보호 및 최신성 요구 사항이 허용하면 재사용 가능한 결과를 캐시합니다.
- 별도의 키는 소유권, 지출 관리, 폐기를 위해 사용하고, 플랫폼 한도를 우회하는 데 사용하지 않습니다.
- 문제 해결을 위해 엔드포인트, 모델, HTTP 상태, 정제된 오류 본문을 기록합니다.
- 워크로드에 할당된 용량이나 더 높은 용량 한도가 필요하면 SandBase 지원팀에 문의합니다.

```python
import asyncio

semaphore = asyncio.Semaphore(8)

async def run_one(client, prompt):
    async with semaphore:
        return await client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": prompt}],
        )
```

동시 실행 수는 분당 요청 수와 다릅니다. 관측된 지연 시간과 애플리케이션에 할당된 용량을 기준으로 둘 다
조정하세요.

::: info 일일 무료 API 호출
조직의 UTC 기준 하루 100회 무료 데이터 API 호출은 속도 제한이 아니라 과금 허용량입니다. 이를 초과한 호출은
거부되지 않고 호출당 과금됩니다. [일일 무료 API 호출](/guides/billing#daily-free-api-calls)을 참고하세요.
:::

::: tip 비디오 작업
비디오 제출은 계정 등급에 따라 조직이 동시에 실행할 수 있는 작업 수로도 제한됩니다.
이 `429`는 `organization concurrency limit exceeded`를 표시하며, 시간이 지나서가 아니라 실행 중인 작업이 끝나면 해제됩니다.
[동시 실행 한도](/guides/concurrency-limits)를 참고하세요.
:::

## 관련 가이드 {#related-guidance}

- [오류 처리](/guides/error-handling)
- [스트리밍](/guides/streaming)
- [API 오류 레퍼런스](/api-reference/errors)
- [API 키](/getting-started/api-keys)
