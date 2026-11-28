---
i18nSource: d326fdb78ea64bdf
title: 速率限制
description: 透過有上限的重試、抖動、佇列與考量冪等性的請求處理，安全地應對 SandBase API 速率限制。
---

# 速率限制 {#rate-limits}

SandBase 可以為您的組織指定每分鐘請求數上限。此上限由組織內所有 API 金鑰共用，並以一分鐘的滑動視窗計算。上游模型供應商也可能回傳其自身的 `429 Too Many Requests` 回應。除非 SandBase 已為您的工作負載指定配額，否則請勿將配額寫死在程式中。

## 您組織的上限 {#your-organization-s-limit}
由於上限是依組織個別指定，SandBase 不會公布一個固定的每分鐘請求數。組織內的每個 API 金鑰都計入同一個上限，因此建立更多金鑰並不會提高上限。此上限目前不會顯示在公開 API 或 Console 中。

如果您的工作負載需要保證的或更高的上限，請聯絡 SandBase 支援團隊，並提供組織、應用程式、預期的穩定速率與預期的突發速率。請勿以未記載於文件的數值預設值來設計正式環境用戶端。

## 處理 429 回應 {#handle-a-429-response}

平台產生的 `/v1/*` 速率限制回應使用扁平的錯誤本文：

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{"error":"organization rate limit exceeded"}
```

組織上限適用於 `POST /v1/run`、`POST /v1/chat/completions`、`POST /v1/responses`、`POST /v1/messages`、`POST /v1/upload`，以及 Gemini 的 `generateContent`、`streamGenerateContent` 與 `POST /v1beta/interactions` 端點。`GET /v1/run/{id}` 等輪詢端點不會計入。協定相容端點會以各自的錯誤封裝格式回傳相同的 `429`，例如 Anthropic 或 Google 的錯誤格式。由供應商產生的回應可能使用相容端點的錯誤格式，並可能包含供應商的速率限制標頭。

不保證會提供 `Retry-After` 與剩餘配額標頭。若有 `Retry-After`，請遵循它。否則，請使用帶有抖動（jitter）的指數退避，並設定最大嘗試次數。

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

OpenAI SDK 也透過 `max_retries` 支援內建重試。請明確選擇使用 SDK 重試或應用程式的重試迴圈其中之一，以免各層的重試次數相乘。

## 僅重試安全的操作 {#retry-only-safe-operations}

重複的推論請求可能會產生第二次生成並產生額外費用。只有在您的應用程式可以接受重新生成時才重試。除非操作文件說明具備冪等性，或您的應用程式能證明第一次嘗試並未成功，否則請勿自動重試會變更狀態的請求。

對於串流請求，`429` 通常會在串流開始前回傳。一旦已收到位元組，請將中斷連線視為生成被中斷，而不要假設是速率限制錯誤。請依產品需求保留或捨棄部分輸出；重新開始會產生新的生成。

## 控制輸送量 {#control-throughput}

- 限制並行數，而不要一次送出無上限的批次。
- 將突發的工作排入佇列，並平滑傳送速率。
- 避免重複請求，並在隱私與資料新鮮度需求允許時快取可重複使用的結果。
- 使用不同金鑰是為了區分擁有權、支出控管與撤銷，而不是為了規避平台限制。
- 記錄端點、模型、HTTP 狀態與經過清理的錯誤本文，以便疑難排解。
- 當工作負載需要指定的或更高的容量上限時，請聯絡 SandBase 支援團隊。

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

並行數與每分鐘請求數並不相同。請依觀察到的延遲與為您的應用程式指定的容量來調整兩者。

::: info 每日免費 API 呼叫
組織每個 UTC 日 100 次的免費資料 API 呼叫是一項帳務額度，而非速率限制。超出額度的呼叫會逐次計費，而不會被拒絕。請參閱[每日免費 API 呼叫](/guides/billing#daily-free-api-calls)。
:::

::: tip 影片任務
影片提交也會受到組織可同時執行任務數的限制，此限制取決於帳戶等級。該 `429` 會顯示 `organization concurrency limit exceeded`，並在執行中的任務完成時解除，而不是依計時器解除。請參閱[並行限制](/guides/concurrency-limits)。
:::

## 相關指引 {#related-guidance}

- [錯誤處理](/guides/error-handling)
- [串流](/guides/streaming)
- [API 錯誤參考](/api-reference/errors)
- [API 金鑰](/getting-started/api-keys)
