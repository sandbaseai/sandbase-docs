---
i18nSource: fc051d55a0cfa8bd
title: 동시 실행 한도
description: 조직이 동시에 실행할 수 있는 작업 수, 계정 등급에 따른 한도 변화, 동영상 제출 시 429와 402를 처리하는 방법을 설명합니다.
---

# 동시 실행 한도 {#concurrency-limits}

동시 실행 한도는 조직이 동시에 진행할 수 있는 작업 수를 제어합니다. 모든 조직에는 계정 등급이 있으며, 등급에 따라 동시 실행 한도가 정해집니다. 한도에 도달하면 아래에서 검사하는 엔드포인트의 새 제출은 실행 중인 작업 중 하나가 끝날 때까지 `429`로 거부됩니다. 대기열에 들어가지 않습니다.

한도는 모든 API 키를 통틀어 조직 전체에 적용됩니다. 어떤 제출을 검사하는지는 엔드포인트에 따라 다릅니다.

- `POST /v1/run`과 `/v1/api/{vendor}/...`를 통한 Platform API 호출은 이미지, 오디오, LLM, 데이터 API 작업을 포함한 모든 모델 유형에 대해 검사합니다.
- Chat Completions, Responses, Messages, OpenAI Images, 프로토콜 호환 Gemini 및 Volcengine 엔드포인트 같은 그 밖의 엔드포인트는 동영상 제출만 검사합니다.

## 작동 방식 {#how-it-works}

검사 대상 작업을 제출하면 SandBase는 조직에서 현재 진행 중인 작업, 즉 `pending` 또는 `running` 상태인 작업의 수를 셉니다. 이 수가 이미 한도에 도달했으면 제출은 즉시 `429`로 거부됩니다. 작업은 생성되지 않으며 요금도 부과되지 않습니다.

이 수에는 동영상뿐 아니라 조직에서 진행 중인 모든 요청이 포함됩니다. 검사 대상 작업을 제출하는 시점에 아직 열려 있는 스트리밍 채팅 완성도 슬롯 하나를 차지합니다. 같은 조직에서 긴 스트리밍 채팅과 동영상 작업을 함께 실행한다면 용량을 계획할 때 모두 고려하세요.

작업이 최종 상태(`completed`, `failed`, `timeout`)에 도달하면 슬롯이 바로 해제됩니다. 사용자가 따로 해제할 것은 없습니다. 슬롯은 타이머가 아니라 작업이 끝날 때 해제되므로, 이 `429`는 분당 [요청 한도](/guides/rate-limiting)와 다릅니다. 일정 시간 기다린다고 슬롯이 보장되지 않습니다. 대신 자신의 작업 중 하나가 끝날 때까지 기다리세요.

## 기본 한도 {#default-limits}

새 조직은 모두 동시 작업 2개 한도의 **Bronze**로 시작합니다. 등급은 한 번에 성공한 충전 금액에 따라 자동으로 올라갑니다.

| 등급 | 1회 충전 금액 | 동시 작업 수 |
|-------|---------------|------------------|
| Bronze | 기본값 | 2 |
| Silver | $10 이상 | 10 |
| Gold | $100 이상 | 100 |
| Platinum | $500 이상 | 500 |
| Diamond | 영업팀 문의 | 무제한 |

- **누적 금액이 아니라 1회 충전 금액 기준입니다.** $60를 두 번 충전하면 Silver에 머뭅니다. $100를 한 번 충전하면 Gold로 올라갑니다.
- **등급은 올라가기만 합니다.** 나중에 더 적은 금액을 충전해도 등급이 내려가지 않습니다.
- **유료 충전만 반영됩니다.** 프로모션 크레딧, 가입 크레딧, 쿠폰은 등급을 바꾸지 않습니다.
- **즉시 적용됩니다.** 결제가 완료되면 다음 동영상 제출부터 새 한도가 적용됩니다.

## 한도 늘리기 {#increasing-your-limit}

한도를 올리는 가장 직접적인 방법은 위 표의 다음 기준에 해당하는 금액을 한 번에 충전하는 것입니다.

동시 작업이 500개를 넘거나 월 단위 신용 한도가 필요하면 **Diamond** 등급에 대해 [contact@sandbase.ai](mailto:contact@sandbase.ai)로 문의하세요. Diamond에는 동시 실행 한도가 없습니다. SandBase 팀이 설정하며, 충전으로는 변경되지 않습니다.

## 동영상 제출 시 크레딧 검사 {#credit-check-on-video-submissions}

동시 실행 검사와 함께, SandBase는 각 동영상 작업을 수락하기 전에 비용을 추정합니다. 추정 비용이 사용 가능한 크레딧(잔액과 신용 한도의 합)보다 크면 제출은 `402`로 거부됩니다. 작업은 생성되지 않으며 요금도 부과되지 않습니다.

- 각 제출은 현재 잔액을 기준으로 검사합니다. 아직 실행 중인 작업에는 요금이 부과되지 않은 상태이므로, 여러 동영상을 한꺼번에 제출할 때는 여유를 두세요.
- 모델 가격이 실행 후에야 알 수 있는 출력에 따라 달라지면 비용을 미리 추정할 수 없습니다. 이런 제출은 수락되며 작업이 끝나면 정상적으로 청구됩니다.

## 동시 실행 오류 처리 {#handling-concurrency-errors}

### 429: 동시 실행 한도 도달 {#_429-concurrency-limit-reached}

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "error": "organization concurrency limit exceeded"
}
```

`Retry-After` 헤더는 보내지 않습니다. 한도는 미리 알 수 있으므로, 가장 확실한 방법은 한도를 넘지 않는 것입니다. 클라이언트 측에서 진행 중인 동영상 작업 수를 제한하고, 이전 작업이 끝난 뒤에만 다음 작업을 제출하세요.

::: code-group

```python [Python]
import asyncio

MAX_CONCURRENT_VIDEOS = 2  # set to your level's limit
slots = asyncio.Semaphore(MAX_CONCURRENT_VIDEOS)

async def generate_video(submit, wait_for_result, payload):
    # Hold a slot for the whole lifetime of the task, not just the submit call.
    async with slots:
        task = await submit(payload)
        return await wait_for_result(task)

async def main(submit, wait_for_result, payloads):
    return await asyncio.gather(
        *(generate_video(submit, wait_for_result, p) for p in payloads)
    )
```

```javascript [JavaScript]
const MAX_CONCURRENT_VIDEOS = 2; // set to your level's limit

async function runAll(payloads, submit, waitForResult) {
  const results = [];
  const queue = [...payloads.entries()];

  async function worker() {
    for (let next = queue.shift(); next; next = queue.shift()) {
      const [index, payload] = next;
      // Each worker holds one slot until its task finishes.
      const task = await submit(payload);
      results[index] = await waitForResult(task);
    }
  }

  await Promise.all(
    Array.from({ length: MAX_CONCURRENT_VIDEOS }, worker)
  );
  return results;
}
```

:::

같은 조직의 다른 서비스도 제출하고 있는 경우처럼 그래도 `429`를 받으면 백오프 후 재시도하세요. 지터를 적용한 지수 백오프를 사용하고, 짧은 루프로 계속 재시도하지 말고 정해진 횟수 후에는 중단하세요.

### 402: 이 동영상에 필요한 크레딧 부족 {#_402-not-enough-credit-for-this-video}

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "error": "insufficient credit for estimated video cost"
}
```

재시도하지 마세요. 충전하거나, 비용이 덜 드는 더 짧은 길이나 더 낮은 해상도를 선택하세요.

### 호환 API {#compatible-apis}

프로토콜 호환 엔드포인트는 이 오류를 각자의 네이티브 형식으로 반환합니다. 예를 들어 Volcengine 호환 `/api/v3/contents/generations/tasks` 엔드포인트는 `429`에 `RateLimitExceeded`를, `402`에 `AccountOverdueError`를 반환합니다.

## 관련 문서 {#related}

- [요청 한도](/guides/rate-limiting): 분당 요청 한도
- [요금](/guides/billing): 크레딧과 충전
- [오류](/api-reference/errors): 전체 오류 코드
