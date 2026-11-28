---
i18nSource: fc051d55a0cfa8bd
title: 並行上限
description: 您的組織一次可以執行多少個任務、上限如何隨帳戶等級調整，以及如何處理影片提交的 429 與 402。
---

# 並行上限 {#concurrency-limits}

並行上限控制您的組織同時可以有多少個進行中的任務。每個組織都有一個帳戶等級，該等級決定其並行上限。達到上限時，下列受檢查端點上的新提交會被以 `429` 拒絕，直到您有任一執行中的任務完成為止。這些提交不會排入佇列。

此上限適用於整個組織，涵蓋所有 API 金鑰。哪些提交會受到檢查取決於端點：

- `POST /v1/run` 以及透過 `/v1/api/{vendor}/...` 進行的 Platform API 呼叫，會針對所有模型類型進行檢查，包括圖片、音訊、LLM 與資料 API 操作。
- 其他端點，例如 Chat Completions、Responses、Messages、OpenAI Images，以及協定相容的 Gemini 與 Volcengine 端點，僅檢查影片提交。

## 運作方式 {#how-it-works}

當您提交受檢查的任務時，SandBase 會計算您的組織目前進行中的任務數，也就是處於 `pending` 或 `running` 狀態的任務。若該數量已達上限，提交會立即以 `429` 被拒絕。不會建立任務，也不會收取任何費用。

此計數涵蓋您組織中所有進行中的請求，不僅限於影片。在您提交受檢查的任務時仍在進行中的串流 chat completion，也會占用一個名額。若同一組織同時執行長時間的串流對話與影片工作，規劃容量時請將兩者都納入考量。

任務一旦進入最終狀態（`completed`、`failed` 或 `timeout`），名額就會釋出。您不需要做任何釋放動作。由於名額是在任務完成時釋出，而非依計時器釋出，因此這個 `429` 與每分鐘的[速率限制](/guides/rate-limiting)不同。等待固定的時間間隔並不保證能取得名額。請改為等待您自己的某個任務完成。

## 預設上限 {#default-limits}

每個新組織一開始都是 **Bronze** 等級，上限為 2 個並行任務。您的等級會依單筆成功儲值的金額自動提升。

| 等級 | 單筆儲值 | 並行任務數 |
|-------|---------------|------------------|
| Bronze | 預設 | 2 |
| Silver | $10 以上 | 10 |
| Gold | $100 以上 | 100 |
| Platinum | $500 以上 | 500 |
| Diamond | 聯絡業務 | 無上限 |

- **以單筆儲值計算，而非累計總額**。兩筆 $60 的儲值仍維持 Silver。單筆 $100 的儲值則會升級到 Gold。
- **只升不降**。之後較小的儲值絕不會降低您的等級。
- **僅限付費儲值**。促銷點數、註冊點數與優惠券不會改變您的等級。
- **立即生效**。付款成功後，新的上限即適用於您的下一次影片提交。

## 提高上限 {#increasing-your-limit}

提高上限最直接的方式，是單筆儲值達到上表中的下一個門檻。

若需要超過 500 個並行任務或每月信用額度，請透過 [contact@sandbase.ai](mailto:contact@sandbase.ai) 洽詢 **Diamond** 等級。Diamond 沒有並行上限。此等級由 SandBase 團隊設定，不會因儲值而變更。

## 影片提交的點數檢查 {#credit-check-on-video-submissions}

除了並行檢查之外，SandBase 也會在接受每個影片任務之前預估其費用。若預估費用超過您的可用點數（餘額加上任何信用額度），提交會以 `402` 被拒絕。不會建立任務，也不會收取任何費用。

- 每次提交都會依您目前的餘額進行檢查。仍在執行中的任務尚未扣款，因此一次提交多個影片時請預留空間。
- 若模型的價格取決於執行後才產生的輸出，則無法事先預估費用。此類提交會被接受，並在任務完成時正常計費。

## 處理並行錯誤 {#handling-concurrency-errors}

### 429：已達並行上限 {#_429-concurrency-limit-reached}

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "error": "organization concurrency limit exceeded"
}
```

回應不會包含 `Retry-After` 標頭。由於上限是事先已知的，最可靠的做法是永遠不要超過它。請在用戶端限制同時進行中的影片任務數，並且只在先前的任務完成後才提交下一個：

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

若仍收到 `429`（例如同一組織中的其他服務也在提交），請退避後再重試。請使用帶有隨機抖動的指數退避，並在有限次數的嘗試後放棄，而不是在緊密迴圈中不斷重試。

### 402：點數不足以支付此影片 {#_402-not-enough-credit-for-this-video}

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "error": "insufficient credit for estimated video cost"
}
```

請勿重試。請先儲值，或選擇費用較低的較短時長或較低解析度。

### 相容 API {#compatible-apis}

協定相容的端點會以其原生格式傳回這些錯誤。例如，Volcengine 相容的 `/api/v3/contents/generations/tasks` 端點在 `429` 時傳回 `RateLimitExceeded`，在 `402` 時傳回 `AccountOverdueError`。

## 相關內容 {#related}

- [速率限制](/guides/rate-limiting)：每分鐘請求上限
- [定價](/guides/billing)：點數與儲值
- [錯誤](/api-reference/errors)：所有錯誤代碼
