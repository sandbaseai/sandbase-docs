---
i18nSource: 5b94f91222d138de
title: API 驗證
description: 使用 Bearer 權杖與支援的協定相容 API 金鑰標頭驗證 SandBase API。
---

# 驗證 {#authentication}

SandBase 使用 API 金鑰驗證公開 API 請求。本頁說明支援的整合方式與
金鑰管理做法。Console 的驗證機制及其內部 API 不屬於公開 API 合約。

## 驗證方式 {#authentication-methods}

標準的 SandBase `/v1/*` 端點需要 Bearer 權杖。Anthropic Messages 與 Google Gemini 相容操作也接受其原生 SDK 相容的 API 金鑰位置。

### Bearer 權杖 {#bearer-token}

在 `Authorization` 標頭中加入金鑰：

```http
Authorization: Bearer sk-your-api-key
```

這是 OpenAI 相容 SDK 使用的標準方式。

### Anthropic Messages：x-api-key 標頭 {#anthropic-messages-x-api-key-header}

在 `x-api-key` 標頭中加入金鑰：

```http
x-api-key: sk-your-api-key
```

只有 `POST /v1/messages` 支援此標頭。其他公開端點不會讀取它；Chat Completions、`/v1/run` 與資源 API 請使用 Bearer
驗證。

### 優先順序 {#priority}

僅限 `POST /v1/messages`：兩個標頭同時存在時，以 `x-api-key` 為優先。

### Google Gemini 相容的 API 金鑰 {#google-gemini-compatible-api-keys}

Gemini GenerateContent 與 Interactions 操作接受 `x-goog-api-key`、`Authorization: Bearer …` 或 `key` 查詢參數，優先順序依此排列。建議使用標頭，因為查詢字串中的憑證可能出現在日誌與瀏覽器歷史紀錄中。支援的路徑請參閱 [Google Gemini](/api-reference/gemini-generate-content) 與 [Gemini Interactions](/api-reference/gemini-interactions)。

### 讀取邏輯 {#extraction-logic}

標準端點只讀取 `Authorization: Bearer <key>`。Anthropic Messages 中介軟體會先讀取 `x-api-key`，
再改用 Bearer 標頭。Agents 平台資源接受 `Authorization: Bearer` 或
`X-API-Key`（見下文）。[webhook Events API](/api-reference/webhooks)（`/events/webhooks*`）也接受任一
標頭，兩者同時存在時使用 Bearer 標頭。缺少受支援的憑證會回傳 `401 Unauthorized`。

### Agents 平台資源 {#agents-platform-resources}

`/v1/agents*`（包括 `/v1/agents/sessions*`）、`/v1/mcp-connections*`、`/v1/secrets*`
與 `/v1/skills*` 接受放在任一標頭中的金鑰：

```bash
curl https://api.sandbase.ai/v1/agents \
  -H "X-API-Key: $SANDBASE_API_KEY"
```

- 若同時傳送 `Authorization: Bearer` 與 `X-API-Key`，兩者必須是同一把金鑰；值不同會回傳 `401 unauthorized`。重複傳送任一標頭也會回傳 401。
- `OpenAI-Beta` 為選用。若有傳送，值必須為 `agents=v1`。
- 讀取請求需要 `agents.read` 權限，寫入需要 `agents.write`。在 Console 建立的標準金鑰兩者皆具備。SandBase 核發的限定範圍金鑰（例如 CLI Login 金鑰）會回傳 `403 insufficient_scope`。
- `402 spending_limit_exceeded` 表示金鑰的支出上限或組織餘額已用盡。
- 失敗時使用 [Agents 錯誤封裝格式](/api-reference/errors#agents-platform-errors)，而不是下方所示的扁平 `{"error": "…"}` 格式。

## API 金鑰格式 {#api-key-format}

在 Console 新建立的 API 金鑰格式如下：

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| 組成部分 | 說明 |
|-----------|-------------|
| `sk-` | 標準的「secret key」前綴 |
| `xxxx...` | 由 32 個隨機位元組產生的 64 個十六進位字元 |

舊版的 `sk-sb-...` 金鑰在到期或被撤銷前仍可使用。用戶端應將金鑰視為不透明字串，
不要依前綴或長度拒絕憑證。

::: warning
切勿在用戶端程式碼、公開儲存庫或日誌中暴露您的 API 金鑰。請像對待密碼一樣保管它。
:::

## 建立 API 金鑰 {#create-api-keys}

### 透過 Console {#via-console}

1. 登入 [SandBase Console](https://www.sandbase.ai/console)
2. 開啟 **Developer → API Keys**
3. 點選 **New key**
4. 為金鑰取一個具描述性的名稱（例如「Production Backend」、「Development」）
5. 立即複製金鑰，之後將不會再顯示

### 金鑰屬性 {#key-properties}

| 屬性 | 說明 |
|----------|-------------|
| Name | 用於識別的易讀標籤 |
| Organization | 金鑰所屬的組織 |
| Enabled | 金鑰是否啟用 |
| Spending Limit | 選用的單一金鑰支出上限 |
| Expires At | 選用的到期日 |
| Created At | 金鑰的建立時間 |

在 Console 建立的標準金鑰具有組織層級的存取權，可使用文件所列的公開 API。SandBase 核發的憑證（例如 CLI Login 金鑰）可能帶有受限的範圍。Console 不提供讓使用者為標準金鑰選擇範圍的功能。

## 金鑰生命週期 {#key-lifecycle}

### 輪替 {#rotation}

輪替金鑰的步驟：

1. 在 Console 建立新金鑰
2. 更新應用程式以使用新金鑰
3. 確認新金鑰在正式環境中可正常運作
4. 撤銷舊金鑰

::: tip
務必先建立新金鑰再撤銷舊金鑰，以避免服務中斷。
:::

### 撤銷 {#revocation}

已撤銷的金鑰無法驗證新的請求。API 會回傳 `401 Unauthorized`，訊息如下：

```json
{"error":"API key has been revoked"}
```

### 到期 {#expiration}

金鑰可選擇設定到期日。已到期的金鑰會回傳 `401 Unauthorized`，訊息如下：

```json
{"error":"API key has expired"}
```

## 各端點的驗證需求 {#endpoint-authentication-requirements}

| 端點 | 驗證方式 | 說明 |
|----------|-------------|-------------|
| `POST /v1/chat/completions` | API 金鑰（Bearer） | Chat Completions |
| `POST /v1/responses` | API 金鑰（Bearer） | OpenAI 相容的 Responses API |
| `POST /v1/messages` | API 金鑰（Bearer 或 x-api-key） | Anthropic Messages |
| `/v1beta/models/*` | API 金鑰（x-goog-api-key、Bearer 或查詢參數 key） | Gemini GenerateContent |
| `/v1beta/interactions*` | API 金鑰（x-goog-api-key、Bearer 或查詢參數 key） | Gemini Interactions |
| `/v1/agents*`、`/v1/mcp-connections*`、`/v1/secrets*`、`/v1/skills*` | API 金鑰（Bearer 或 X-API-Key） | Agents 平台資源 |

SandBase Console 使用獨立的瀏覽器驗證流程。其內部請求不是受支援的公開
端點，整合時不得使用。

## 組織隔離 {#organization-isolation}

API 金鑰的範圍限定於單一組織。使用金鑰驗證時：

- 您只能存取屬於您組織的資源
- 用量與帳單以組織為單位追蹤

## 錯誤回應 {#error-responses}

| HTTP 狀態碼 | 訊息 | 原因 |
|-------------|---------|-------|
| 401 | `missing API key in Authorization header` | 未提供金鑰 |
| 401 | `invalid API key` | 資料庫中找不到金鑰 |
| 401 | `API key has been revoked` | 金鑰已停用 |
| 401 | `API key has expired` | 金鑰已過到期日 |
| 402 或協定特定的 403 | `API key spending limit exceeded` | 已達金鑰層級支出上限；請查看該端點文件所述的錯誤合約 |
| 403 | `API key is not authorized for this endpoint` | 限定範圍的金鑰用於其範圍外的端點 |

這些訊息會以扁平的 `{"error":"<message>"}` 本文傳回，`403` 範圍錯誤除外。在模型與帳戶
端點上，這類錯誤使用 `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`；
在 Agents 平台資源上，則使用 [Agents 錯誤封裝格式](/api-reference/errors#agents-platform-errors)，
`code` 為 `insufficient_scope`。

## 安全性最佳做法 {#security-best-practices}

### 應該做 {#do}

- **將金鑰存放在環境變數中**：切勿將金鑰寫死在原始碼中
- **每個環境使用不同的金鑰**：開發、預備與正式環境各用不同金鑰
- **設定到期日**：依您的安全政策選擇適當的輪替間隔
- **監控用量**：在 Console 中檢查是否有異常活動
- **只在需要存取公開 API 的工作負載上使用標準金鑰**：限定範圍的 CLI Login 憑證請保留在其受管流程中

### 不應該做 {#don-t}

- **不要將金鑰提交到版本控制**：將 `.env` 加入 `.gitignore`
- **不要讓不相關的應用程式共用同一把金鑰**：分開的金鑰讓輪替與事件應變更安全
- **不要在用戶端程式碼中暴露金鑰**：一律透過您的後端代理
- **不要在日誌中記錄 API 金鑰**：在應用程式日誌中遮蔽金鑰

### 環境變數範例 {#environment-variable-example}

::: code-group

```bash [.env]
SANDBASE_API_KEY=sk-your-api-key
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

:::

## 依金鑰的速率限制 {#rate-limiting-by-key}

請求限制以組織為單位分配，並由該組織的所有 API 金鑰共用，因此建立更多金鑰並不會提高
限制。API 不會公布通用的數值
預設值，也不提供剩餘配額標頭。

關於限制與處理 429 回應的詳細資訊，請參閱[速率限制](/guides/rate-limiting)。
