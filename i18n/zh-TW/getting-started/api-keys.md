---
i18nSource: 3dc57d405dbf561d
title: API 金鑰
description: 如何建立、管理並保護用於驗證 API 請求的 SandBase API 金鑰。
---

# API 金鑰 {#api-keys}

API 金鑰用於驗證您對 SandBase 的請求。本指南說明如何建立金鑰、在請求中使用金鑰，以及確保金鑰安全。

## 建立 API 金鑰 {#create-an-api-key}

1. 登入 [SandBase Console](https://www.sandbase.ai/console)
2. 開啟 **Developer → API Keys**（或直接前往 [API Keys](https://www.sandbase.ai/console/keys)）
3. 點選 **New key**
4. 輸入具描述性的 **Name**（例如「Production Server」、「Local Development」）
5. 可選擇設定 **Spending limit**（留空表示無上限）與 **Expires** 日期（留空表示永不過期）
6. 點選 **Create key**
7. 立即從 **API key created** 橫幅中複製金鑰，金鑰只會顯示一次

::: danger 重要
您的 API 金鑰只會在建立時顯示一次。若遺失，您必須建立新的金鑰。請在關閉對話框前妥善保存。
:::

## 金鑰格式 {#key-format}

在 Console 中建立的新 API 金鑰使用 `sk-` 前綴，後接 64 個十六進位字元：

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

既有的 `sk-sb-...` 金鑰在過期或被撤銷前仍然有效。請勿僅以前綴來驗證
憑證；請一律將完整的值視為不透明的機密。

## 驗證方式 {#authentication-methods}

SandBase 支援兩種在請求中傳遞 API 金鑰的方式：

### Authorization 標頭（建議） {#authorization-header-recommended}

使用標準的 `Authorization: Bearer` 標頭。此方式與 OpenAI 和 Anthropic SDK 相容：

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek/deepseek-v4-flash", "messages": [{"role": "user", "content": "Hi"}]}'
```

### Anthropic Messages：x-api-key 標頭 {#anthropic-messages-x-api-key-header}

`POST /v1/messages` 也接受 Anthropic 原生的 `x-api-key` 標頭：

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "x-api-key: sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "anthropic/claude-sonnet-5", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hi"}]}'
```

::: tip
在各模型閘道中，只有 `POST /v1/messages` 會讀取 `x-api-key`，且當兩種支援的標頭同時存在時，
`x-api-key` 優先。[Agents 平台資源](/api-reference/authentication#agents-platform-resources)也接受
`X-API-Key`。其他所有公開端點請使用 Bearer 標頭。
:::

## 金鑰權限 {#key-permissions}

SandBase API 金鑰的範圍為**組織層級**：

- 在 Console 建立的標準金鑰可以呼叫該組織可用的公開 API 資源
- 用量會計入擁有該金鑰的組織
- 金鑰可設定選用的到期日與支出上限
- SandBase 核發的憑證（例如 CLI Login 金鑰）可能帶有受限範圍，在範圍之外使用時會傳回 `403`

Console 目前並未提供讓使用者為標準金鑰選擇範圍的功能。CLI Login 金鑰會在您連接 AI 工具時建立。API Keys 頁面會將它們歸在一個可展開的 **CLI Login** 列中，且無法像標準金鑰一樣編輯。SandBase 為您自動建立的金鑰會帶有 **Auto-created** 標記；這類金鑰沒有金鑰層級的上限，僅受帳戶餘額限制。

金鑰清單會顯示每個金鑰的 **Name**、**Key Prefix**、**Spent**、**Limit**、**Expires** 與 **Status**。使用 **Edit** 可變更標準金鑰的名稱、支出上限或到期日。

請將每個金鑰視為應用程式憑證，而非個人密碼。人員存取請使用組織成員資格，工作負載則使用 API 金鑰。

## 環境策略 {#environment-strategy}

為每個應用程式與環境建立不同的金鑰：

| 金鑰 | 名稱範例 | 原因 |
|---|---|---|
| 本機開發 | `research-app-dev` | 輪替時不會中斷正式環境 |
| 預備環境 | `research-app-staging` | 隔離測試用量與事故 |
| 正式環境 | `research-app-production` | 讓正式環境有明確的負責人並限制暴露範圍 |
| 臨時自動化 | `release-check-2026-08` | 設定到期日並可獨立撤銷 |

記錄每個金鑰的負責人與使用它的部署。輪替時，先部署新金鑰、確認請求成功，然後才撤銷舊金鑰。

## 金鑰到期與撤銷 {#key-expiration-and-revocation}

### 到期 {#expiration}

建立金鑰時，您可以選擇設定到期日。金鑰過期後將停止運作，請求會傳回 `401 Unauthorized` 錯誤。

未設定到期日的金鑰會持續有效，直到手動撤銷為止。

### 撤銷金鑰 {#revoking-a-key}

若要撤銷（停用）金鑰：

1. 前往 [Developer → API Keys](https://www.sandbase.ai/console/keys)
2. 找到要撤銷的金鑰
3. 點選 **Revoke**
4. 確認此動作

已撤銷的金鑰無法再驗證新的請求。撤銷無法復原；若誤撤銷了金鑰，請建立新的金鑰。

## 安全性最佳實務 {#security-best-practices}

### 切勿將金鑰提交到版本控制 {#never-commit-keys-to-version-control}

請改用環境變數或機密管理工具：

```bash
# .env file (add to .gitignore!)
SANDBASE_API_KEY=sk-your-key-here
```

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

### 為不同環境使用不同的金鑰 {#use-separate-keys-for-different-environments}

為開發、預備與正式環境分別建立金鑰。如此一來，您可以撤銷外洩的開發金鑰，而不影響正式環境。

### 定期輪替金鑰 {#rotate-keys-regularly}

定期建立新金鑰並淘汰舊金鑰。這樣可在金鑰外洩時縮短暴露的時間。

### 監控活動 {#monitor-activity}

定期檢查 **Developer → Activities**，留意請求或用量是否有異常暴增，這可能表示金鑰已外洩。**Request History** 可依 API 金鑰篩選。

若金鑰外洩，請立即撤銷、建立替代金鑰、更新使用該金鑰的應用程式，並檢查 Activities 與帳單是否有異常用量。不要等到排定的輪替時間。

### 設定到期日 {#set-expiration-dates}

對於臨時存取（CI/CD 管線、外包人員存取、展示），請設定到期日，讓金鑰自動停止運作。

## 疑難排解 {#troubleshooting}

| 錯誤 | 原因 | 解決方式 |
|-------|-------|-----|
| `401 - missing API key` | 請求中未提供金鑰 | 加上 `Authorization: Bearer <key>` 標頭 |
| `401 - invalid API key` | 金鑰不存在 | 檢查是否有錯字，並確認已包含完整金鑰 |
| `401 - API key has been revoked` | 金鑰已在 Console 中被永久撤銷 | 建立替代金鑰 |
| `401 - API key has expired` | 金鑰已超過到期日 | 建立新金鑰或延長到期日 |
| `402 - API key spending limit exceeded` | 金鑰已達設定的支出上限 | 提高上限或使用其他已授權的金鑰 |
| `403 - insufficient_scope` | 具範圍限制的憑證無法呼叫此端點 | 使用已獲授權呼叫該端點的金鑰 |

## 後續步驟 {#next-steps}

- [**第一次 API 呼叫**](/getting-started/first-call)：完整逐步說明請求與回應，進行一次詳細的 API 呼叫
- [**驗證**](/api-reference/authentication)：支援的標頭、生命週期與各協定專屬的錯誤
- [**API 參考**](/api-reference/)：完整的端點文件
