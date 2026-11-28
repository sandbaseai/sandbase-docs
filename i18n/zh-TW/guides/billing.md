---
i18nSource: 91c5a0d1b6de6434
title: 價格與用量
description: 查詢目前的模型價格、檢視任務費用，並安全地管理 SandBase 帳務。
---

# 價格與用量 {#pricing-and-usage}

SandBase 採用隨用隨付的計費方式。模型可用性、價格公式、快取倍率與特定功能的費用都可能各自變動，因此整合時應讀取即時中繼資料，而不是依賴複製下來的價格表。

## 每日免費 API 呼叫 {#daily-free-api-calls}

每個組織每個 UTC 日可獲得 100 次免費的資料 API 呼叫（搜尋、社群、爬取、電子商務、金融）。此額度由所有符合資格的資料 API 與組織的所有金鑰共用，並於 00:00 UTC 重設。LLM 與媒體模型不符合資格。部分資料 API 也不符合資格：價格較高或以公式計價的 API，例如部分批次端點、爬取端點、小紅書蒲公英（PGY）以及抖音星圖 `kol-*` 路由，從第一次呼叫起就會計費。若要檢查某個工具，請執行 `sandbase_inspect`：符合資格的工具會帶有 `pricing.free_quota`，沒有此欄位的工具一律計費。

- 額度內的呼叫不會收費，且餘額為零的組織仍可使用。
- 第 100 次呼叫之後，符合資格的呼叫仍可正常運作，並依工具顯示的價格逐次計費。它們不會因額度用完而被拒絕或限速。
- 未使用的次數不會累積到隔天。

在 [SandBase MCP 工具](/setup/)中，`sandbase_inspect` 會以 `pricing.free_quota`（`daily_limit`、`scope`、`resets`）標示符合資格的工具。`sandbase_account` 會以 `free_api_quota` 回傳今日額度，包含 `daily_limit`、`used_today`、`remaining` 與 `resets_at`；當次數暫時無法取得時，會省略 `used_today` 與 `remaining`。執行結算後，`sandbase_run` 與 `sandbase_run_get` 會回報 `free_quota_status`：`free`（由額度涵蓋）、`overage`（額度用完後計費）或 `degraded`（因無法取得額度計數而未收費）。

## 在 Console 中管理帳務 {#manage-billing-in-the-console}

使用 **Developer → Billing** 檢視餘額、購買點數、設定自動儲值、兌換優惠券，以及管理您組織可用的帳務設定。開啟 **Developer → Activities → Usage** 可查看組織層級的請求、token 與費用摘要。

::: info 公開 API 範圍
餘額、儲值、帳務匯出與全組織用量的端點目前不屬於受支援的公開 API。請勿自動化 Console 的網路請求，也不要依賴 Console 的內部路由。
:::

## 讀取目前的模型價格 {#read-current-model-pricing}

首先找出一個已啟用的模型：

```bash
curl 'https://api.sandbase.ai/v1/models?q=gpt' \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

然後請求其完整的模型卡：

```bash
curl https://api.sandbase.ai/v1/models/deepseek/deepseek-v4-flash \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

清單端點是為探索用途最佳化，因此刻意省略詳細的 token、快取與推理價格。請從詳細回應中的 `model_card` 讀取所選模型的詳細價格。沒有任何通用公式能適用於所有 LLM、媒體模型、嵌入模型或 API 功能。

## 查詢單一任務的記錄費用 {#check-one-task-s-recorded-cost}

當操作回傳任務 ID 時，可查詢其結算記錄：

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

回應會區分目前的 `cost` 與 `estimated_cost`，並回報結算是否已完成。在 `settled` 為 `true` 之前，請勿將 `cost` 用於帳務核對。任務記錄是營運查詢用的資料，而非會計帳本。請使用 **Developer → Activities → Usage** 下提供的帳務記錄與 CSV 匯出來進行核對及保存長期記錄。

## 費用控管做法 {#cost-control-practices}

- 在啟動新的工作負載前，先取得目前的模型卡。
- 檢查 `capability_tags`、`supported_modes` 與 `unified_schema`；較便宜的替代方案只有在支援所需的輸入與輸出行為時才有用。
- 減少不必要的提示詞脈絡，並在所選模型支援時設定適當的輸出 token 上限。
- 快取行為因模型而異。請查看模型卡與回傳的用量欄位，而不要假設整個供應商都有相同折扣。
- 任務 ID 只需為了查詢任務費用而記錄；對於非同步的 `/v1/run` 工作，請記錄回傳的不透明 run ID，並僅在狀態為 `pending` 或 `running` 時輪詢 `GET /v1/run/{id}`。
- 使用 Console 中為您組織提供的支出控管功能。

## 付款錯誤 {#payment-errors}

當組織無法支付請求費用時，API 操作可能會回傳 HTTP `402`。錯誤封裝格式會依 API 相容介面而有所不同，因此請處理 HTTP 狀態與文件記載的錯誤物件，而不要比對單一訊息字串。在 Console 中解決帳務問題後，請依照該操作的冪等性與復原規則重試。

影片提交在開始前也會依其預估費用進行檢查。單筆儲值 $10 以上即可提升您的帳戶等級，讓更多影片任務同時執行。請參閱[並行限制](/guides/concurrency-limits)。

目前的公開規格請參閱[模型與價格](/for-agents/models)、[任務費用](/api-reference/tasks/cost)與[錯誤](/api-reference/errors)。
