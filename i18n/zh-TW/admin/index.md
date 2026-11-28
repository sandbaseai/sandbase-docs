---
i18nSource: adfacb669489863e
title: 帳戶與帳單
description: 管理您的 SandBase 組織、API 金鑰、帳單、用量與限制。
---

# 帳戶與帳單 {#account-and-billing}

組織設定決定用量歸屬於誰、應用程式如何驗證身分，以及如何監控支出。

## 可管理的項目 {#what-you-manage}

| 項目 | 用途 |
|---|---|
| [組織](/admin/organizations) | 管理工作區範圍、成員與擁有權 |
| [API 金鑰](/getting-started/api-keys) | 建立、輪替及撤銷應用程式憑證 |
| [帳單與點數](/admin/billing) | 查看餘額、購買點數、設定自動儲值，並在 Activities 與 Analysis 中查看用量 |
| [定價與用量](/guides/billing) | 查詢模型定價、每日免費 API 呼叫次數，以及單一任務的費用 |
| [速率限制](/guides/rate-limiting) | 了解請求限制與安全的重試方式 |

## 建議設定 {#recommended-setup}

1. 確認您正在正確的組織中操作。
2. 為開發、預備（staging）與正式環境分別建立 API 金鑰。
3. 以應用程式與環境名稱為金鑰命名。
4. 第一批正式環境請求送出後，檢查 Activities 與帳單。
5. 撤銷未使用的金鑰，並儘速調查異常用量。

## 擁有權與存取權 {#ownership-and-access}

API 金鑰與用量都屬於某個組織。切換組織會改變 Console 中可見的資源、金鑰與帳單內容。變更正式環境設定前，請先確認所選的組織，並與使用該金鑰的應用程式協調金鑰輪替。

## 安全基本原則 {#security-basics}

- 將金鑰存放在環境變數或密鑰管理工具中
- 切勿將金鑰貼到 Agent 指示、原始碼、螢幕截圖或客服訊息中
- 每個應用程式與環境使用各自的金鑰
- 金鑰若可能已外洩，請立即撤銷
- 在 Activities 中監控異常的請求量、模型或端點
