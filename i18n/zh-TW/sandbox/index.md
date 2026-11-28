---
i18nSource: 4191d2eb16a594f5
title: Sandbox 概覽與功能
description: 使用 E2B SDK 或 SandBase Console 建立沙箱，檢視狀態、日誌與指標，並探索獨立的實驗性 Playground。
---

# Sandbox 概覽與功能 {#sandbox-overview-and-capabilities}

Sandbox 提供隔離的環境，可用來執行指令、執行程式碼，以及讀寫檔案。您可以暫停執行個體、重新連線，再讀回檔案以驗證資料是否保留。

[快速入門／E2B SDK](./quickstart) · [開啟 Playground（實驗性）](./playground)

使用[官方 E2B SDK](./quickstart) 將 Sandbox 整合到您的應用程式中。登入 [Sandbox Console](https://www.sandbase.ai/console/sandboxes) 即可建立沙箱，並檢視執行個體狀態、日誌與指標。如需簡介，請參閱 [Sandbox 產品概覽](https://www.sandbase.ai/sandbox)。下方的操作導覽與支援表格說明的是獨立的實驗性 Playground。

## 五分鐘 Playground 操作導覽 {#a-five-minute-playground-walkthrough}

1. 輸入具備 Sandbox 權限的 [API 金鑰](/getting-started/api-keys)。連線時只會讀取範本與執行個體。
2. 選擇可用的範本，確認資源提示，然後建立一個短期執行個體。
3. 執行系統資訊或 Python 範例。在指令面板旁觀察輸出與程序事件。
4. 寫入並驗證一個文字檔案，暫停執行個體後再恢復，然後再次讀取同一個檔案。
5. 檢查生命週期事件、指標、日誌與機器時間記錄。完成後請刪除您的執行個體。

重新整理頁面會清除頁面中的憑證與本機操作記錄，但不會刪除沙箱。執行中的執行個體會依伺服器的逾時設定運作。已暫停的執行個體可能仍會保留資源。請記下執行個體 ID，並在離開頁面後使用您組織的工具核對並清理資源。

## 功能與限制 {#capabilities-and-boundaries}

| 功能 | Playground 支援情況 |
| --- | --- |
| 建立、列出、暫停、恢復、延長逾時、刪除 | 可用；變更類控制項僅適用於本次頁面工作階段中建立的執行個體 |
| 指令與文字檔案 | 可用；指令最多執行 25 秒，檔案編輯僅限 `/tmp/` 且上限 32 KiB |
| 生命週期事件、日誌、指標、機器時間 | 可用性依環境而異；請檢查回傳結果 |
| AI 聊天與對話脈絡 | 未整合；需要模型設定與 Agent 工作負載 |
| PTY、應用程式連接埠、Webhook、範本建置 | 此介面不提供 |
| 快照與 fork | 此 Playground 不提供 |

Shell 互動並不是 AI 聊天。執行個體復原、檔案保留、程序存續與對話連續性是需要分別驗證的不同事項。

## 了解事件 {#understanding-events}

**Sandbox lifecycle** 項目是重新整理時取得的原生伺服器事件，可能會延遲到達。**Sandbox process** 項目描述程序啟動與串流輸出。**Playground** 項目記錄本機請求的完成或失敗；它們不是服務的生命週期事件。

清單為空並不代表用量為零，缺少事件也不代表操作失敗。機器時間記錄並非最終帳單。在逾時或連線中斷後，請先核對執行個體，再嘗試發出另一個建立請求。

## 範本可見性 {#template-visibility}

範本可以是公開的，或僅供您的組織使用的私有範本。數量並不固定。沒有名稱的項目仍會顯示，並以別名或 ID 作為替代標籤。您可以看到及使用哪些範本，取決於您組織的存取權限與範本的可用性。

## Sandbox 與 Agent Session {#sandboxes-and-agent-sessions}

Agents Session 在 SandBase 的託管雲端中執行。它們與您使用 E2B SDK 建立的 Sandbox 執行個體是分開的，而且 Agents API 不會公開 Sandbox 執行個體。請參閱 [Session](/agents/sessions)。
