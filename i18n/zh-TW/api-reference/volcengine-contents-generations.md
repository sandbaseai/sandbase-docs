---
i18nSource: 4bd032d88bac0470
title: Seedance 影片（火山引擎 Ark 協定）
description: 透過火山引擎 Ark Contents Generations 任務協定生成 Seedance 2.0 與 2.5 影片，內容涵蓋輸入、輪詢、計費與媒體 Asset。
aside: false
outline: false
apiReference:
  title: Seedance 影片
  operation: Video
  method: POST
  path: /api/v3/contents/generations/tasks
  description: 提交 Seedance 影片任務。提交成功會回傳 HTTP 200 與 SandBase 任務 id。
  groups:
    - title: 請求本文
      fields:
        - name: model
          type: string
          required: true
          description: 支援的模型識別碼：bytedance/seedance/2.0-official 或 bytedance/seedance/2.5-official。
        - name: content
          type: array
          required: true
          description: 具類型的文字與選填的媒體輸入。項目格式由模型驗證。
        - name: duration
          type: integer
          required: false
          description: 原封不動轉送給模型。適用模型驗證。
        - name: resolution
          type: string
          required: false
          description: 原封不動轉送給模型。適用模型驗證。
        - name: ratio
          type: string
          required: false
          description: 原封不動轉送給模型。適用模型驗證。
        - name: generate_audio
          type: boolean
          required: false
          description: 原封不動轉送給模型。在支援時請求生成音訊。
  examples:
    - label: Text to video
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "bytedance/seedance/2.0-official",
            "content": [{"type": "text", "text": "A paper boat crossing a rain puddle"}],
            "duration": 5,
            "resolution": "720p"
          }'
  response:
    status: 200 OK
    code: '{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }'
---

<ApiReferencePage />

## Seedance 指南 {#seedance-guide}

Seedance 可從文字、開頭與結尾畫格，以及圖片、影片、音訊等多模態參考生成影片。無論是簡單的文字轉影片片段，或是依照視覺主體、運鏡與配樂執導的鏡頭，都可以使用它來製作。

生成為非同步處理。提交任務後，輪詢該任務直到它進入終止狀態。

## 選擇模型 {#choosing-a-model}

| `model` | 適用情境 | 輸出解析度 |
| --- | --- | --- |
| `bytedance/seedance/2.5-official` | 1080p 交付與最高的可用輸出解析度 | 480p、720p、1080p |
| `bytedance/seedance/2.0-official` | 480p 或 720p 已足夠時的較低成本生成 | 480p、720p |

兩個模型接受相同的多模態輸入，並以單一請求格式支援文字轉影片、圖片轉影片與多模態參考工作流程。若 480p 或 720p 符合需求且希望選擇價格較低的方案，請選擇 `2.0-official`。若需要 1080p，請選擇 `2.5-official`。

## API 參考 {#api-reference}

| 方法 | 路徑 |
| --- | --- |
| `POST` | `/api/v3/contents/generations/tasks` |
| `GET` | `/api/v3/contents/generations/tasks/{task_id}` |

不支援列出任務，也不支援取消或刪除任務。請保存回傳的任務 `id` 以取得結果。

每個請求都必須使用建立任務時所用的同一個 API 金鑰進行驗證：

```
Authorization: Bearer $SANDBASE_API_KEY
```

`model` 的值必須與[選擇模型](#choosing-a-model)中的其中一個名稱相符。輪詢是取得結果的支援方式；此端點請勿依賴 `callback_url`。

## 快速入門 {#quickstart}

提交任務：

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "A slow cinematic push across an alpine lake at sunrise"}
    ],
    "ratio": "16:9",
    "resolution": "720p",
    "duration": 5,
    "generate_audio": true
  }'
```

```json
{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }
```

使用該 id 每 5 到 10 秒輪詢一次任務，直到 `status` 為 `succeeded`、`failed`、`expired` 或 `cancelled`：

```bash
curl https://api.sandbase.ai/api/v3/contents/generations/tasks/158d2649-e01d-45b9-b88a-ef3c450c601c \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "158d2649-e01d-45b9-b88a-ef3c450c601c",
  "model": "bytedance/seedance/2.5-official",
  "status": "succeeded",
  "created_at": 1787059000,
  "updated_at": 1787059150,
  "content": { "video_url": "https://media.sandbase.ai/files/158d2649.../0.mp4" },
  "usage": { "completion_tokens": 108900, "total_tokens": 108900 }
}
```

生成的影片可從 `content.video_url` 取得。

## 選擇輸入工作流程 {#choose-an-input-workflow}

此 API 支援七種常見的輸入工作流程。`content` 中的每個項目都有一個 `type`；項目類型與角色的組合決定所使用的工作流程：

| 目標 | `content` 組合 | 適用時機 |
| --- | --- | --- |
| 文字轉影片 | 文字 | 場景可以完全以提示詞描述 |
| 讓開頭畫格動起來 | 文字（選填）+ 帶有 `first_frame` 的圖片 | 第一個畫格必須與提供的圖片相符 |
| 在兩個畫格之間轉場 | 文字（選填）+ `first_frame` + `last_frame` | 鏡頭需要受控的開頭與結尾 |
| 依循視覺參考 | 文字（選填）+ 帶有 `reference_image` 的圖片 | 主體、產品、服裝或視覺風格需要保持可辨識 |
| 依循動作或鏡頭語言 | 文字（選填）+ 帶有 `reference_video` 的影片 | 動作、節奏、剪輯韻律或運鏡來自參考片段 |
| 加入音訊參考 | 文字／圖片／影片 + 帶有 `reference_audio` 的音訊 | 對白、音樂、人聲或音效設計需要引導結果 |
| 完整多模態執導 | 文字 + 圖片 + 影片 + 音訊參考 | 在單一鏡頭中由不同素材分別控制外觀、動作與聲音 |

音訊無法單獨使用。每個包含音訊項目的請求，也必須至少包含一個文字、圖片或影片項目。

### 內容項目格式 {#content-item-shapes}

```json
{ "type": "text", "text": "A puppy running across a sunlit lawn" }
```

```json
{ "type": "image_url", "image_url": { "url": "https://example.com/ref.jpg" }, "role": "reference_image" }
```

```json
{ "type": "video_url", "video_url": { "url": "https://example.com/ref.mp4" }, "role": "reference_video" }
```

```json
{ "type": "audio_url", "audio_url": { "url": "https://example.com/bgm.mp3" }, "role": "reference_audio" }
```

`role` 說明模型應如何使用該素材：

| 素材 | `role` | 效果 |
| --- | --- | --- |
| 圖片 | `first_frame` | 將圖片作為開頭畫格 |
| 圖片 | `last_frame` | 將圖片作為結尾畫格；同一請求中須包含 `first_frame` |
| 圖片 | `reference_image` | 參考主體、構圖、產品、服裝或視覺風格 |
| 影片 | `reference_video` | 參考動作、運鏡、節奏或剪輯韻律 |
| 音訊 | `reference_audio` | 參考人聲、對白、音樂或音效設計 |

圖片項目可接受公開 URL 或內嵌的 `data:image/...;base64,...` 值。影片與音訊參考應使用模型可下載的公開 URL。

只要包含任何 `video_url` 項目，請求就會進入影片轉影片模式，這會改變 token 費率。請參閱[計費](#billing)。

## 常見做法 {#common-recipes}

以下範例展示請求本文。可將其中任何一個傳送至[快速入門](#quickstart)中所示的建立任務端點。

### 讓第一個畫格動起來 {#animate-a-first-frame}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "The woman slowly looks up and smiles as the camera gently pushes in"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 5,
  "generate_audio": true
}
```

### 建立從首格到尾格的轉場 {#create-a-first-to-last-frame-transition}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "A smooth transition from a bright afternoon into a neon-lit night"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"},
    {"type": "image_url", "image_url": {"url": "https://example.com/last-frame.jpg"}, "role": "last_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 6
}
```

### 使用圖片、影片與音訊參考執導鏡頭 {#direct-a-shot-with-image-video-and-audio-references}

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "First-person fruit tea commercial, camera pushes in on the layered foam"},
      {"type": "image_url", "image_url": {"url": "https://example.com/ref.jpg"}, "role": "reference_image"},
      {"type": "video_url", "video_url": {"url": "https://example.com/ref.mp4"}, "role": "reference_video"},
      {"type": "audio_url", "audio_url": {"url": "https://example.com/bgm.mp3"}, "role": "reference_audio"}
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 11
  }'
```

使用提示詞為每個參考指定明確的任務，例如：「保留圖片中的產品外觀，使用影片中的運鏡，並跟隨音訊的節奏。」這比要求每個素材都控制整體結果更可靠。

## 撰寫有效的提示詞 {#writing-an-effective-prompt}

實用的提示詞通常依照以下順序：

1. **主體** — 鏡頭中出現的人或物。
2. **動作** — 什麼在變化或移動。
3. **場景** — 地點、時段、天氣與周遭細節。
4. **視覺風格** — 電影感、紀錄片、產品廣告、動畫等。
5. **鏡頭** — 構圖、鏡頭質感、運鏡與剪接。
6. **聲音** — 啟用 `generate_audio` 時的對白、環境音、音樂或音效。

請明確說明哪些部分必須保持穩定。例如：「產品標籤保持清晰可讀，鏡頭緩慢推進一次，不切換場景，保留自然的室內環境音。」當有多個參考時，請描述要從每個參考中取用哪種視覺或動作特質。

## 輸出選項 {#output-options}

| 參數 | 類型 | 預設值 | 可用值 |
| --- | --- | --- | --- |
| `resolution` | string | `720p` | `480p`、`720p`、`1080p`。`2.0-official` 不支援 `1080p` |
| `ratio` | string | `adaptive` | `16:9`、`9:16`、`4:3`、`3:4`、`1:1`、`21:9`、`adaptive`。`adaptive` 會依輸入與提示詞選擇比例 |
| `duration` | integer | `5` | 4 到 15 秒，或 `-1` 讓模型在支援範圍內自行選擇 |
| `generate_audio` | boolean | `true` | 生成同步的人聲、音效與背景音樂 |
| `seed` | integer | `-1` | `-1` 到 `2^32-1`。相同的提示詞與 seed 會產生相似但不完全相同的輸出 |
| `watermark` | boolean | `false` | 在右下角加上 AI 生成浮水印 |
| `tools` | array | `[]` | `[{"type": "web_search"}]` 會在規劃鏡頭時啟用網路搜尋 |

### 任務控制 {#task-control}

| 參數 | 類型 | 預設值 | 備註 |
| --- | --- | --- | --- |
| `execution_expires_after` | integer | `172800` | 任務逾時秒數，範圍 3600 到 259200。超過此時間的任務會變成 `expired` |
| `service_tier` | string | `default` | 這些模型不支援 `flex` |
| `safety_identifier` | string | — | 不透明的終端使用者識別碼，最多 64 個字元。請傳送雜湊值，而非原始個人資料 |

### 畫面尺寸 {#frame-size}

`resolution` 與 `ratio` 共同決定像素尺寸：

| 解析度 | 16:9 | 9:16 | 4:3 | 3:4 | 1:1 | 21:9 |
| --- | --- | --- | --- | --- | --- | --- |
| 480p | 864×496 | 496×864 | 752×560 | 560×752 | 640×640 | 992×432 |
| 720p | 1280×720 | 720×1280 | 1112×834 | 834×1112 | 960×960 | 1470×630 |
| 1080p | 1920×1080 | 1080×1920 | 1664×1248 | 1248×1664 | 1440×1440 | 2206×946 |

## 任務狀態 {#task-status}

| `status` | 意義 | 處理方式 |
| --- | --- | --- |
| `queued` | 已受理，等待開始 | 持續每 5 到 10 秒輪詢一次 |
| `running` | 生成中 | 持續輪詢 |
| `succeeded` | 已完成 | 下載 `content.video_url` |
| `failed` | 遭內容審核拒絕，或模型發生錯誤 | 讀取 `error.message`。重試前請調整提示詞 |
| `expired` | 執行時間超過 `execution_expires_after` | 重新提交 |
| `cancelled` | 在生成開始前結束 | 重新提交 |

### 任務欄位 {#task-fields}

| 欄位 | 類型 | 備註 |
| --- | --- | --- |
| `id` | string | 提交時回傳的任務 id |
| `model` | string | 您傳送的 `model` 值 |
| `status` | string | 見上方 |
| `created_at` | integer | Unix 秒數 |
| `updated_at` | integer | Unix 秒數。任務完成前等於 `created_at` |
| `content` | object | 任務成功前為空。包含生成的 `video_url` |
| `usage` | object | Token 數量。請參閱[計費](#billing) |
| `error` | object | 在 `failed` 與 `expired` 時出現。包含 `code` 與 `message` |

### 完整的 Python 流程 {#complete-python-flow}

```python
import os
import time

import requests

BASE_URL = "https://api.sandbase.ai/api/v3/contents/generations/tasks"
HEADERS = {
    "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
    "Content-Type": "application/json",
}

task = requests.post(
    BASE_URL,
    headers=HEADERS,
    json={
        "model": "bytedance/seedance/2.5-official",
        "content": [
            {
                "type": "text",
                "text": "A quiet shoreline at sunrise, gentle waves, one slow camera push-in",
            }
        ],
        "ratio": "16:9",
        "resolution": "720p",
        "duration": 5,
        "generate_audio": True,
    },
)
task.raise_for_status()
task_id = task.json()["id"]

while True:
    time.sleep(8)
    result = requests.get(f"{BASE_URL}/{task_id}", headers=HEADERS)
    result.raise_for_status()
    data = result.json()
    print(data["status"])

    if data["status"] == "succeeded":
        print(data["content"]["video_url"])
        break
    if data["status"] in {"failed", "expired", "cancelled"}:
        raise RuntimeError(data.get("error", {"message": data["status"]}))
```

## 計費 {#billing}

這些模型依 `usage.completion_tokens` 計費，此值會在任務完成時回報。Token 費率取決於兩個面向：

- **輸入是否包含影片。** 影片轉影片請求（即任何類型為 `video_url` 的 `content` 項目）的費率低於文字轉影片。
- **輸出解析度。** 對於 `2.5-official`，1080p 的費率高於 480p 與 720p。`2.0-official` 的費率不因解析度而異。

`usage` 會回報 `completion_tokens` 與 `total_tokens`，目前兩者相等。任務執行期間此欄位為空。實際費用請參閱您的[帳戶歷史記錄](/api-reference/account/history)，目前費率請參閱[價格指南](/guides/billing)。

## 錯誤 {#errors}

無效的請求會立即回傳錯誤。生成期間發生的錯誤會在輪詢後出現在任務中。兩者都使用 `error` 物件，包含機器可讀的 `code` 與人類可讀的 `message`：

```json
{ "error": { "code": "InvalidParameter", "message": "model is required", "type": "BadRequest" } }
```

| HTTP | `code` | `type` |
| --- | --- | --- |
| 400 | `InvalidParameter` | `BadRequest` |
| 401 | `AuthenticationError` | `Unauthorized` |
| 403 | `PermissionDenied` | `Forbidden` |
| 404 | `ResourceNotFound` | `NotFound` |
| 429 | `RateLimitExceeded` | `TooManyRequests` |
| 500 | `InternalServiceError` | `InternalServerError` |
| 503 | `InternalServiceError` | `ServiceUnavailable` |

常見的復原步驟：

| 結果 | 可嘗試的做法 |
| --- | --- |
| `400 InvalidParameter` | 檢查模型名稱、必要內容、角色、解析度、長度與素材 URL |
| 任務狀態為 `failed` 且為內容審核錯誤 | 重新撰寫提示詞，或替換被標記的參考素材後再重新提交 |
| 任務狀態為 `expired` | 提交新任務；高解析度或長片段可考慮設定較長的 `execution_expires_after` |
| `429 RateLimitExceeded` | 使用指數退避重試，並減少同時提交的數量 |
| `503 ServiceUnavailable` | 稍候片刻後重試相同的請求 |

## 使用已註冊的媒體 Asset {#use-registered-media-assets}

SandBase 在 `/v1/assets` 提供與官方相容的 Asset 協定。Asset 請求與回傳的 `asset://` 參照遵循官方協定，且該參照會原封不動地傳入原生 ByteDance Contents Generations 請求中。`bytedance/seedance/2.5-official` 與 `bytedance/seedance/2.0-official` 在原本接受公開 HTTP(S) URL 的位置都接受此參照。

完整的工作流程如下：

1. 使用 `POST /v1/assets` 註冊一個可存取的媒體 URL。
2. 查詢 `GET /v1/assets/{external_id}`，直到供應商回報該 Asset 可以使用。
3. 將回傳的 `asset_url` 放入 Seedance 的 `content` 項目中，並提交生成任務。

### 與官方相容的 Asset 操作 {#official-compatible-asset-operations}

| 方法 | 路徑 | 用途 |
| --- | --- | --- |
| `POST` | `/v1/assets` | 註冊可存取的媒體 URL，並取得與官方相容的 `asset://` 參照 |
| `GET` | `/v1/assets/{external_id}` | 讀取供應商狀態，並取得目前的預覽／下載 URL |

公開 API 目前只提供註冊與查詢。Asset 群組、列出、重新命名、更新與刪除都不是公開操作。Asset 隸屬於 API 金鑰所關聯的組織。

### 步驟 1：註冊 Asset {#step-1-register-the-asset}

將可存取的 URL 傳送至 `POST /v1/assets`。`asset_type` 區分大小寫，且必須是 `Image`、`Video` 或 `Audio`：

```bash
curl -X POST https://api.sandbase.ai/v1/assets \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/product-reference.png",
    "asset_type": "Image",
    "name": "Product reference"
  }'
```

從回應中保存 `asset_url`：

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Image",
  "name": "Product reference",
  "created_at": "2026-07-10T15:04:03Z"
}
```

`asset://` 之後的值即為與官方相容之查詢操作所使用的 `external_id`。

### 步驟 2：檢查是否就緒 {#step-2-check-readiness}

使用不含 `asset://` 前綴的 `external_id` 查詢 Asset：

```bash
curl https://api.sandbase.ai/v1/assets/asset-20260710150403-hx4hf \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "external_id": "asset-20260710150403-hx4hf",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "status": "Active",
  "asset_type": "Image",
  "name": "Product reference",
  "download_url": "https://media.example.com/current-signed-url",
  "created_at": "2026-07-10T15:04:03Z"
}
```

請將 `status` 視為開放的供應商值，而非完整列舉。請等到供應商回報可用狀態後再提交生成任務；常見的就緒值為 `Active`。`download_url` 由供應商管理，處理期間可能為空。需要目前的預覽 URL 時，請再次查詢 Asset。在 Seedance 請求中請持續使用永久的 `asset_url`，而不要複製 `download_url`。

### 步驟 3：使用 Asset 生成 {#step-3-generate-with-the-asset}

將 `asset_url` 放入與媒體類型相符的 URL 欄位。此範例將已註冊的圖片作為視覺參考：

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {
        "type": "text",
        "text": "Create a cinematic product shot. Keep the bottle shape and label from the reference image."
      },
      {
        "type": "image_url",
        "image_url": {"url": "asset://asset-20260710150403-hx4hf"},
        "role": "reference_image"
      }
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 5,
    "generate_audio": true
  }'
```

建立回應會回傳任務 `id`。請依所選模型頁面的說明輪詢 `GET /api/v3/contents/generations/tasks/{task_id}`。

### 選擇內容項目與角色 {#choose-the-content-item-and-role}

| Asset 類型 | `content[].type` | URL 欄位 | 支援的角色 | 用途 |
| --- | --- | --- | --- | --- |
| 圖片 | `image_url` | `image_url.url` | `first_frame` | 從這個畫格開始影片 |
| 圖片 | `image_url` | `image_url.url` | `last_frame` | 以這個畫格結束；同一請求中須包含 `first_frame` |
| 圖片 | `image_url` | `image_url.url` | `reference_image` | 保留主體、產品、構圖、服裝或視覺風格 |
| 影片 | `video_url` | `video_url.url` | `reference_video` | 依循動作、節奏、運鏡或剪輯韻律 |
| 音訊 | `audio_url` | `audio_url.url` | `reference_audio` | 依循人聲、對白、音樂或音效設計 |

音訊不能是唯一的輸入。請將 `reference_audio` Asset 與文字、圖片或影片搭配使用。任何包含 `video_url` 的請求都會使用影片轉影片的計費費率。

#### 影片 Asset 範例 {#video-asset-example}

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-video1"},
  "role": "reference_video"
}
```

#### 音訊 Asset 範例 {#audio-asset-example}

```json
{
  "type": "audio_url",
  "audio_url": {"url": "asset://asset-20260710150403-audio1"},
  "role": "reference_audio"
}
```

### 直接 URL 或 `asset://` 參照？ {#direct-url-or-asset-reference}

| 輸入 | 最適合的情況 | 取捨 |
| --- | --- | --- |
| 公開 HTTP(S) URL | 媒體已有託管且只使用一次 | 最快的方式，但從任務提交到供應商擷取期間，URL 都必須保持可存取 |
| `asset://` 參照 | 透過官方 Asset 協定重複使用媒體 | 多一個註冊／就緒檢查步驟，之後即可取得供後續 Seedance 任務使用的永久參照 |

請求參數、輪詢、任務狀態與計費請參閱上方的 [Seedance 指南](#seedance-guide)。

## ByteDance 官方資源 {#official-bytedance-resources}
- [Seedance 影片生成文件](https://www.volcengine.com/docs/82379/1520758?lang=en)
- [建立內容生成任務 API](https://api.volcengine.com/api-explorer/?action=CreateContentsGenerationsTasks&groupName=%E8%A7%86%E9%A2%91%E7%94%9F%E6%88%90API&serviceCode=ark&version=2024-01-01)
- [Seedance 2.0 提示詞指南](https://www.volcengine.com/docs/82379/2222480?lang=en)
