---
i18nSource: d560e2374d91a8d6
title: 帳單與點數
description: 查看 SandBase 組織餘額、透過 Stripe 或 Airwallex 購買點數、設定自動儲值、兌換優惠券，並了解 API 金鑰的支出控管。
---

# 帳單與點數 {#billing-and-credits}

本頁說明如何在 [SandBase Console](https://www.sandbase.ai/console) 中管理帳單。費率與成本最佳化請參閱[定價](/guides/billing)。

SandBase 會從組織餘額中扣除支援工作負載的費用。目前的價格、優惠、付款服務商、
最低儲值金額與適用地區皆顯示於 Console 中，且可能與本指南不同步
變動。

## 餘額 {#balance}

開啟 [Developer → Billing](https://www.sandbase.ai/console/billing)。**Credits** 頁面會顯示目前組織的：

| 項目 | 說明 |
|------|---------------|
| **Available balance** | 可用於 Models 與 APIs 的餘額 |
| **Credit limit** | 工作區的支出額度 |
| **Current level** | 帳戶等級及其並行數 |

登入後，相同的餘額也會顯示在 Console Dashboard 的 **Balance** 卡片與網站頁首。
促銷與結帳條款請以 Console 為準；請勿自動化呼叫其內部網路
請求。

## 購買點數 {#buy-credits}

1. 開啟 [Billing](https://www.sandbase.ai/console/billing)，確認 **Credits go to** 顯示的是您要儲值的工作區。
2. 在 **Buy credits** 下選擇預設金額，或在 **Custom amount** 輸入美元金額。最低儲值金額會顯示在頁面上。
3. 若提供多個 **Payment provider**，請選擇 **Stripe**（全球信用卡與電子錢包）或 **Airwallex**（信用卡與當地付款方式）。
4. 在預覽中確認 **Pay**、**Bonus** 與 **Receive**，然後選擇 **Continue with Stripe**（或您選擇的服務商），並完成託管結帳流程。
5. 在開始對成本敏感的工作負載之前，請在 **Credit transactions** 中確認已更新的餘額。

SandBase 從不儲存卡片資料；付款頁面由服務商託管。

### 首次儲值贈點 {#first-top-up-bonus}

若帳戶與工作區從未儲值，**Current offers** 會顯示首次儲值贈點。頁面會註明
贈點百分比及其上限。每個帳戶與每個工作區各限一次贈點，退款時會按比例
收回贈點。贈點會以獨立一列顯示在 **Credit transactions** 中。

## 自動儲值 {#auto-top-up}

**Auto Top-up** 會在餘額低於門檻時，以已儲存的卡片自動補充餘額。目前僅支援 Stripe，
且只有工作區擁有者與管理員可以管理此功能。

1. 在 **Payment cards** 下選擇 **Add Card**，並在 Stripe 中儲存卡片。
2. 選擇 **Turn on auto top-up**，然後設定 **When balance goes below**、**Top-up amount**、選用的 **Monthly limit** 以及卡片。
3. 勾選 **I authorize these automatic charges** 並確認。

達到每月上限後，自動儲值會在該日曆月（UTC）剩餘期間停止。自動扣款
會以通路 `Auto top-up · Stripe` 顯示在 **Credit transactions** 中。

## 兌換優惠券 {#redeem-a-coupon}

在 **Redeem a coupon** 下輸入 **Coupon code**，然後選擇 **Redeem credit**。優惠券僅適用於目前的
工作區，因此請先確認所選的組織。

## 支出控管 {#spending-controls}

| 控管項目 | 範圍 | 行為 |
|---------|-------|----------|
| 組織資金界線 | 整個組織 | 可用餘額加上任何已設定的信用額度；資金不足的請求可能傳回 HTTP 402 |
| 金鑰支出上限 | 每個 API 金鑰 | 選用的單一金鑰上限，受組織餘額限制 |
| 自動儲值每月上限 | 整個組織 | 限制每個日曆月（UTC）的自動扣款總額 |

若要設定單一金鑰的支出上限，請參閱 [API 金鑰](/getting-started/api-keys)。

## 活動與分析 {#activities-and-analysis}

[Developer → Activities](https://www.sandbase.ai/console/activities) 有兩個分頁：

- **Request History** 列出個別請求，包含 API 金鑰、模型、狀態、延遲與費用。
- **Usage** 顯示 7 天或 30 天內的請求數與費用、**Model APIs by Archived Spend** 以及 **Billing Records**。兩個表格都提供 **Export CSV**。帳單記錄匯出檔包含 **Free Quota** 欄，用以標示由每日免費額度涵蓋的呼叫。

[Developer → Analysis](https://www.sandbase.ai/console/analytics) 另提供最近 7 或 30 個完整 UTC 日的 **Overview**、**Cost analysis** 與
**Health diagnostics**。

公開定價與任務費用規範，請參閱[定價與用量](/guides/billing)以及
[取得任務費用](/api-reference/tasks/cost)。
