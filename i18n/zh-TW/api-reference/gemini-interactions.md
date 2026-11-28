---
i18nSource: 8ddefa727d909bc8
title: Google Gemini Interactions
description: 透過原生 Google 協定建立、串流及輪詢模型 Interactions。
aside: false
outline: false
apiReference:
  title: Google Gemini Interactions
  operation: Gemini
  method: POST
  path: /v1beta/interactions
  description: 建立原生 Google Interaction。即使是 HTTP 200 也要檢查 status；in_progress 回應必須進行輪詢。
  groups:
    - title: 請求本文
      fields:
        - name: model
          type: string
          required: true
          description: SandBase 邏輯模型名稱。
        - name: input
          type: string | object | array
          required: true
          description: 原生 Google Interaction 輸入。
        - name: stream
          type: boolean
          required: false
          description: 模型支援時回傳 Google Interactions SSE 事件。
        - name: background
          type: boolean
          required: false
          description: 以持久方式提交，並立即回傳可輪詢的 Interaction。無法與 stream 同時使用。
        - name: previous_interaction_id
          type: string
          required: false
          description: 從上游 Interaction 接續，並保留供應商親和性。
        - name: store
          type: boolean
          required: false
          description: 原樣轉送上游儲存偏好設定。
        - name: system_instruction
          type: string
          required: false
          description: 原生系統指示。
        - name: tools
          type: array
          required: false
          description: 原生 Google 工具定義。
        - name: generation_config
          type: object
          required: false
          description: 原生生成設定。
        - name: response_format
          type: object | array
          required: false
          description: 要求的回應格式。
        - name: response_modalities
          type: array
          required: false
          description: 要求的輸出模態。
  examples:
    - label: Background request
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1beta/interactions \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "google/gemini-omni-flash-preview",
            "input": "A red ball rolls across a table, 3 seconds.",
            "background": true,
            "response_format": {"type": "video"}
          }'
  response:
    status: 200 OK
    code: |-
      {
        "id": "job_75b74acd12534b01baba820b",
        "object": "interaction",
        "model": "google/gemini-omni-flash-preview",
        "status": "in_progress"
      }
---

<ApiReferencePage />

## 驗證 {#authentication}

使用 `x-goog-api-key`、`Authorization: Bearer …` 或 `key` 查詢參數，優先順序依此排列。建議使用標頭，因為查詢字串中的憑證可能會被記錄。

## 支援的模型 {#supported-models}

Interactions 端點並不是適用於所有目錄名稱以 `google/` 開頭之模型的通用路由。模型
必須具有與 Interactions 相容的供應商對應。SandBase 目前記載的相容模型如下：

- Gemini Omni Flash Preview：`google/gemini-omni-flash-preview`
- Gemini Omni 1.1 Flash Preview：`google/gemini-omni-1.1-flash-preview`

其他 Google 模型使用其他端點。例如 Nano Banana Pro 與 Nano Banana 2 使用
[`/v1beta/models/{model}:generateContent`](/api-reference/gemini-generate-content)，而不是 `/v1beta/interactions`。不支援的模型會直接失敗，
而不會改經由其他 Google 協定路由。

## 成功與輪詢 {#success-and-polling}

成功的提交會回傳 HTTP `200`，包括背景工作，以及有限等待時間已到期的同步請求。請一律檢查 `status`：

- `completed`、`failed`、`cancelled` 與 `incomplete` 為終止狀態。
- `in_progress` 表示仍在執行。請輪詢 `GET /v1beta/interactions/{id}`；回應的 `Location` 標頭中也可能包含該路徑。
- `requires_action` 是協定狀態，但 SandBase 目前尚未提供推進此狀態所需的工具確認端點。

輪詢 ID 是 `POST` 回傳的上游 Interaction `id`，而不是 SandBase 預測 ID。必須使用建立該 Interaction 的同一把 SandBase API 金鑰來取得它。

```bash
curl https://api.sandbase.ai/v1beta/interactions/job_75b74acd12534b01baba820b \
  -H "x-goog-api-key: $SANDBASE_API_KEY"
```

非終止狀態的 GET 回應不包含部分輸出與用量。終止狀態的回應可能包含內嵌的圖片、音訊或影片資料，大小可能達數 MB。請儘速下載並保存所需的媒體：上游保留期限到期後，SandBase 只能回傳包含結構與中繼資料的有損終止備援內容，而不是原始媒體位元組。

## 串流 {#streaming}

在請求本文中設定 `stream: true`。回應為 `text/event-stream`；此協定不使用 `?alt=sse`。事件與 delta 類型並非固定，且不經固定允許清單過濾即轉送，因此用戶端應容許未知的值。串流標頭寫出後，失敗會以 `error` 事件傳回，而不是以不同的 HTTP 狀態碼傳回。

是否支援串流取決於模型。即使協定支援 `stream: true`，上游供應商仍可能拒絕。

## 目前的限制 {#current-limits}

SandBase 目前只提供 create 與 get：

- 不接受 Agent Interactions；請使用 `model`。
- `background: true` 與 `stream: true` 無法同時使用。
- 未提供 Interaction 的 list、delete 與 cancel。
- 未提供 URI 傳遞與以 GET 為基礎的串流重新連線。
- `previous_interaction_id` 需要有效的供應商親和性對應與上游支援。親和性無法使用時，SandBase 會直接失敗，而不會在無預警情況下切換供應商。

錯誤使用 Google 封裝格式 `{ "error": { "code", "message", "status" } }`。HTTP 狀態碼可視為穩定；`message` 中經過清理的上游文字可能會變動。
