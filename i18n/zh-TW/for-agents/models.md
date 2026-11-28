---
i18nSource: b95a8cd6f82c3a9a
title: AI 可讀的模型與價格
description: 透過 Models API 查詢目前的 SandBase 模型、能力、schema 與價格。
---

# 模型與價格 {#models-pricing}

所有模型都能以一把 SandBase API 金鑰存取。模型的可用性、schema、能力、上下文限制
與價格可能各自獨立變動。

::: info 使用即時的模型中繼資料
請一律使用 `GET /v1/models` 與 `GET /v1/models/{id_or_name}` 取得最新且具權威性的資料。不要推斷每個
LLM 都支援串流、視覺、工具、結構化輸出或快取，也不要將某個模型的輸入欄位或
價格套用到另一個模型。
:::

## 目錄與詳細資料回應 {#catalog-and-detail-responses}

`GET /v1/models` 會回傳 OpenAI 相容的識別紀錄，包含 `id`、`object`、`created` 與 `owned_by`。
它刻意省略 SandBase 的能力、schema 與價格中繼資料。

`GET /v1/models/{id_or_name}` 另外加入 `unified_schema`、`supported_modes` 與 `model_card`。詳細價格請從
`model_card` 讀取；沒有頂層的 `pricing` 物件。請將 `capability_tags`、`supported_modes` 與
`unified_schema` 視為模型專屬的資料。

## 查詢模型 {#discover-models}

```bash
curl 'https://api.sandbase.ai/v1/models?type=llm' \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

列表端點支援 `q`、`vendor`、`type` 與 `order`；它不分頁，且預設為 `type=llm`。
它會回傳包含 `id`、`object`、`created` 與 `owned_by` 的 OpenAI 相容項目。請求詳細資料或呼叫模型時，
請使用回傳的 `id` 作為模型名稱。

對於任何非同步的 `202` 回應，請以回傳的 ID 輪詢 `GET /v1/run/{id}`。請將該 ID 視為不透明值；不要
推斷其格式，也不要依 ID 前綴或相容性標頭組出不同的輪詢路徑。

## 檢視單一模型 {#inspect-one-model}

模型名稱帶有供應商前綴，且可能包含 `/`：

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

執行前，請檢視：

- `enabled` 與 `execution_mode`
- `capability_tags` 與 `supported_modes`
- `unified_schema`，了解可接受的請求欄位
- `model_card`，了解目前的價格公式與 token 或快取倍率

## 查看實際任務費用 {#check-actual-task-cost}

對於已完成或進行中的任務，請查詢記錄的費用，而不是根據過時的表格重新計算：

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

回應合約請參閱 [Models API 參考](/api-reference/models/)，回應格式與重試指引請參閱
[錯誤指南](/for-agents/errors)。
