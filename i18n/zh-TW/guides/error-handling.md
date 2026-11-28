---
i18nSource: f63049c1cf01130e
title: 錯誤與重試
description: 分類 SandBase API 失敗、判斷何時可安全重試，並在不洩漏機密的前提下保留有用的診斷資訊。
---

# 錯誤與重試 {#errors-and-retries}

請依 HTTP 狀態、端點類別與操作語意來處理錯誤。SandBase 提供多種相容協定，
因此並沒有所有端點共用的單一錯誤 JSON 格式。

## 閱讀端點的錯誤格式 {#read-the-endpoint-s-error-shape}

- OpenAI 相容的操作通常會回傳包含訊息與類型的 `error` 物件。
- Anthropic Messages 會回傳 Anthropic 相容的錯誤信封。
- 核心平台操作可能回傳扁平的 `{ "error": "..." }` 主體，或已記載的資源專屬錯誤。
- Google 與供應商原生的操作會在有記載之處保留其相容協定的格式。

請使用回應的 HTTP 狀態與已記載的主體。除非所選端點保證提供，否則不要依賴 `code`、`param` 或
`request_id` 等選用欄位。範例請參閱 [API 錯誤參考](/api-reference/errors)，
各操作專屬的回應請參閱 [OpenAPI 規格](/openapi.yaml)。

## 依狀態決定處理方式 {#decide-what-to-do-by-status}

| 狀態 | 常見原因 | 建議動作 |
|---|---|---|
| `400` / `422` | 主體、參數無效，或模型不支援該能力 | 修正請求後再重試。 |
| `401` | 憑證遺失、無效、過期或已撤銷 | 更換憑證。 |
| `402` | 帳單狀態不允許此請求 | 處理帳戶餘額或支出控管問題。 |
| `403` | 憑證範圍或資源存取權限不足 | 使用已授權的金鑰或資源。 |
| `404` | 找不到模型、任務或平台資源 | 確認識別碼與組織。 |
| `409` | 資源狀態或並行操作衝突 | 讀取目前狀態，再決定是否重試。 |
| `429` | SandBase 或上游供應商限制了請求 | 有 `Retry-After` 時遵循它；否則加入抖動進行退避。 |
| `500` / `502` / `503` / `504` | 內部、上游或暫時性的可用性錯誤 | 只有在重複操作是安全的情況下才重試。 |

此表是處理指引，並不代表每個端點都會發出所有狀態。

## 使用有上限的重試策略 {#use-a-bounded-retry-policy}

對於可安全重複的請求，請使用加入抖動的指數退避、限制最大延遲，並設定總請求預算。
若外層應用程式已經會重試，請停用 SDK 的重試，或在設定預算時將兩層都納入考量。

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

當回應包含 `Retry-After` 時，請解析並遵循它，而不是使用備用延遲。請讓策略保持
可設定；合適的嘗試次數與期限取決於呼叫端的延遲與成本預算。

## 防範重複的副作用 {#protect-against-duplicate-side-effects}

重複推論請求會產生新的生成結果，並可能產生額外費用。只有在
應用程式接受任何有效答案且能容忍重新生成時，才適合這樣做。

對於會建立、更新、刪除、發佈、排程或觸發工作的操作，請更加謹慎：

- 端點提供冪等性支援時，請使用已記載的冪等機制；
- 否則在重複一個結果不明的請求之前，先讀取目前狀態；
- 切勿僅因外層的模型串流中斷就重播工具呼叫；
- 需要核對重試時，請在您自己的系統中保留用戶端操作 ID。

## 分別處理逾時與串流 {#handle-timeouts-and-streams-separately}

逾時並不代表伺服器已停止處理請求。在重試非同步或會改變狀態的
操作之前，請盡可能查詢其已記載的資源或任務狀態。

對於串流回應，請區分串流開始前的 HTTP 錯誤與部分輸出後的中斷。
只有正常的協定終止訊號才能證明串流已完整。請參閱 [串流回應](/guides/streaming)。

## 記錄有用且安全的診斷資訊 {#log-useful-safe-diagnostics}

請記錄：

- 端點與模型識別碼；
- HTTP 狀態，以及存在時的相容錯誤類型；
- 有回傳時的供應商或請求識別碼；
- 嘗試次數、經過時間，以及是否收到任何回應位元組。

請勿記錄 API 金鑰、憑證值、完整的敏感提示詞或未經遮蔽的供應商回應。向使用者顯示簡潔且
可採取行動的訊息，同時為維運人員保留經過清理的診斷資訊。

## 相關指引 {#related-guidance}

- [API 錯誤參考](/api-reference/errors)
- [速率限制](/guides/rate-limiting)
- [串流回應](/guides/streaming)
- [驗證](/api-reference/authentication)
