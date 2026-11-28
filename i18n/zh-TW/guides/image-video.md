---
i18nSource: 8c960d117a998817
title: 圖片與影片模型
description: 使用 SandBase 共用的 Run API，以非同步方式生成圖片與影片。
---

# 圖片與影片模型 {#image-and-video-models}

圖片與影片模型使用 SandBase 共用的非同步 Run API。請以 `POST /v1/run` 提交任務，
然後輪詢 `GET /v1/run/{id}`，直到 run 進入
終止狀態。

## 提交任務 {#submit-a-task}

請使用 [圖片與影片模型](https://www.sandbase.ai/models/image-video) 中的確切模型 ID。其餘
請求欄位依模型而定；請開啟該模型的 API 參考，查看其
必要輸入與限制。

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<model-id>",
    "prompt": "A cinematic product shot at sunrise."
  }'
```

回應包含不透明的 `id`，以及 `pending` 或
`running` 等 `status`。

## 輪詢結果 {#poll-for-the-result}

```bash
curl https://api.sandbase.ai/v1/run/<run-id> \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

持續輪詢，直到 `status` 為 `completed`、`failed` 或 `timeout`。已完成的
run 會包含能力專屬的輸出，例如圖片或影片 URL。請保留
run ID，並以 run 回應作為具權威性的狀態。

## Webhook 回呼 {#webhook-callbacks}

支援的非同步任務也可以在提交請求中設定 `webhook_url`。
回呼只是傳遞提示，不能取代輪詢；請繼續
使用 `GET /v1/run/{id}`，並安全地處理重複或延遲的回呼。共通的
回呼合約請參閱 [執行能力](/api-reference/models/run#webhook-callbacks)。

## API 能力使用由 URL 推導的路徑 {#api-capabilities-use-a-url-derived-path}

共用的 Run API 用於模型生成。來自
[API 目錄](https://www.sandbase.ai/apis) 的 API 能力使用
另一種由 URL 推導的路由：`GET` 或 `POST /v1/api/{vendor}/{upstream_path}`。
含供應商前綴的能力名稱來自 Models API 或 API 目錄，因此
POST 主體中可以省略 `model` 欄位：

```bash
curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

此路由用於 API 能力，呼叫圖片或影片模型時不能用來取代 `/v1/run`。
若所選的 API 能力為非同步，
請以 `GET /v1/run/{id}` 輪詢回傳的 run ID。

## 後續步驟 {#next-steps}

- [圖片與影片模型](https://www.sandbase.ai/models/image-video)
- [執行能力](/api-reference/models/run)
- [取得 run 結果](/api-reference/models/run-get)
- [API 直通](/api-reference/models/api-passthrough)
