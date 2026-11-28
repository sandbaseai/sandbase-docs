---
i18nSource: 20679b8b1344acb5
title: Sandbox Playground（實驗性）
description: 使用您自己的 API 金鑰試用真實的 SandBase sandbox。建立、執行指令、在暫停與恢復後驗證檔案，並檢視生命週期事件。
outline: false
aside: false
pageClass: sandbox-playground-page
---

# Sandbox Playground {#sandbox-playground}

使用您自己的金鑰試用 Sandbox API。操作會連線到 **sandbox.sandbase.ai**，並可能產生費用。

<ClientOnly>
  <SandboxPlayground />
</ClientOnly>

## 您的金鑰由您掌控 {#your-key-stays-under-your-control}

- **僅存在頁面記憶體中。** 此 Playground 不會將您的 API 金鑰或連線權杖儲存在瀏覽器儲存空間或 cookie 中、放進 URL，或記錄在頁面活動或請求範例中。
- **可隨時清除。** 選擇 **Clear key** 即可移除金鑰、連線權杖與顯示的活動，即使請求仍在執行中也可以。重新整理或離開此頁面也會清除它們。之後需要重新輸入金鑰才能再次連線。
- **僅用於您的請求。** 您的金鑰會傳送給 SandBase，用於驗證您所要求的 Sandbox 操作。清除此頁面並不會撤銷金鑰；如有需要，請在 [Developer → API Keys](https://www.sandbase.ai/console/keys) 撤銷。

以上承諾僅涵蓋此 Playground 對憑證的處理方式，並不代表 Sandbox 活動或服務端的用量紀錄會被清除。請避免在指令或檔案中輸入機密，因為其內容可能會保留在您的 sandbox 中。

## 另行清理資源 {#clean-up-resources-separately}

清除金鑰並不會取消服務已收到的操作，也不會刪除 sandbox。使用完畢後請刪除實例。若不確定建立結果，請先檢查您的實例再建立新的。清除此頁面前，請保留清理時需要的實例 ID。

[概覽與能力](./index) · [快速入門／E2B SDK](./quickstart)
