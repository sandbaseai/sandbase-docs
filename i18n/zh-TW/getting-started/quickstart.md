---
i18nSource: 8cb9626a2127cb8d
title: 快速入門
description: 選擇使用 SandBase 的方式 — 在平台上、透過 API，或搭配您的 Agent。尋找 Skills 與 Tools，依照步驟操作，並從 SDK 或 CLI 儲存庫開始。
pageClass: quickstart-page
---

# 快速入門 {#quick-start}

## 選擇您使用 SandBase 的方式 {#connect}

以下是**三種可擇一的入門方式**，而不是必須依序完成的三個步驟。這些方式都使用同一個 SandBase 帳戶與工作區。

<QuickstartPaths />

只需要一個現成的任務工具？[探索 Tools](#use-tools) 或 [選擇 Skill](#use-skills)。登入前即可瀏覽公開目錄與文件。

### 從開源儲存庫開始 {#start-from-the-open-source-repositories}

- **[SandBase — SDK 與範例](https://github.com/sandbaseai/sandbase)**：Python、TypeScript 與 Go 用戶端、API 範例，以及託管 Agent 工作流程。適合用來建置您自己的應用程式。
- **[SandBase CLI 與 MCP](https://github.com/sandbaseai/cli)**：安裝並連結您的 AI 工具，或從終端機探索並執行各項能力。適合搭配您現有的 Agent 使用。

## 開始之前：登入 {#create-account}

使用 Playground、執行託管 Skill 或建立 API 金鑰之前，請先登入。不需要帳戶的免費工具可直接使用。**已經登入？請略過此步驟**，並確認帳戶選單顯示的是您要使用的工作區。

SandBase 使用 GitHub 或 Google 登入，沒有另外的電子郵件與密碼註冊方式。

1. 開啟 [建立帳戶／登入](https://www.sandbase.ai/login){target="_blank"}。
2. 完成安全性檢查，然後選擇 **Sign in with GitHub** 或 **Sign in with Google**。
3. 在供應商視窗中核准存取。
4. 回到您原本使用的頁面，或開啟 [Console](https://www.sandbase.ai/console){target="_blank"}。

首次登入會建立您的帳戶與一個**個人工作區**。試用 SandBase 之前不需要先建立組織。

若出現歡迎點數，您無須新增付款方式即可開始使用。Console Dashboard 上的 **Balance** 卡片與 [Billing](https://www.sandbase.ai/console/billing){target="_blank"} 會顯示目前餘額。

## 在平台上使用 {#use-on-website}

若想先在瀏覽器中試用模型、API 或 Agent，請選擇此方式 — 無須安裝用戶端，也不必撰寫程式碼。

1. 登入後開啟目錄：
   - [語言模型](https://www.sandbase.ai/models){target="_blank"}
   - [圖片與影片模型](https://www.sandbase.ai/models/image-video){target="_blank"}
   - [API](https://www.sandbase.ai/apis){target="_blank"}
   - [Agents](https://www.sandbase.ai/agents){target="_blank"}
2. 開啟模型或 API 的詳細資料頁面，並在可用時選擇 **Playground**。
3. 輸入必要的內容，例如提示詞、圖片、搜尋查詢或 URL。執行前請先確認顯示的價格。
4. 執行請求，並查看回傳的文字、資料、圖片、影片或任務狀態。

網站 Playground 不需要另外建立 API 金鑰。若某項能力沒有提供 Playground，請使用其 **API** 分頁，並依照下方的 API 方式操作。

## 透過 API 使用 {#call-api}

若要在您的應用程式中加入一項能力，請選擇此方式。

1. 重複使用您目標工作區的有效金鑰，或在 [Developer → API Keys](https://www.sandbase.ai/console/keys){target="_blank"} 中以 **New key** 建立 [API 金鑰](/getting-started/api-keys)。請立即複製；金鑰只會顯示一次。
2. 篩選目錄並開啟詳細資料頁面：
   - [語言模型](https://www.sandbase.ai/models){target="_blank"} — 依供應商、能力、上下文長度與價格篩選
   - [圖片與影片模型](https://www.sandbase.ai/models/image-video){target="_blank"} — 篩選文生圖、圖生圖、文生影片與圖生影片等多模態模型
   - [API](https://www.sandbase.ai/apis){target="_blank"} — 依平台與資料來源篩選 API 資源
3. 開啟 **API** 分頁，複製範例請求，並填入該端點的必填欄位。
4. 將您的 SandBase 金鑰存放在伺服器的環境變數中，然後執行請求。請勿將它放在瀏覽器端程式碼或公開的儲存庫中。
5. 檢查回應。若為非同步任務，請依照該端點的狀態輪詢範例操作，直到任務完成。

以下是適用於 **Bash / zsh**（macOS、Linux 或搭配 WSL 的 Windows）的語言模型呼叫範例。請在本機替換佔位金鑰。其他環境請使用下方儲存庫中的 Python、TypeScript 或 Go 範例；shell 指令無法直接用於 PowerShell。

```bash
export SANDBASE_API_KEY="sk-YOUR_KEY"

curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Reply with one sentence explaining what an API is."}]
  }'
```

從程式碼開始：[GitHub 上的 SandBase SDK 與範例](https://github.com/sandbaseai/sandbase)。

了解更多：[第一次 API 呼叫](/getting-started/first-call)。

## 搭配您的 Agent 使用 {#use-in-ai-tool}

若您使用 Claude Code、Codex、Cursor、Kiro 或其他支援的用戶端，並想在該應用程式中使用 SandBase 的模型與 API，請選擇此方式。

**自動本機設定的條件：** 您的用戶端必須能執行指令，且所在機器需安裝 Node.js 20+ 與 npm。若您使用的是僅支援聊天的用戶端，請改為依照其 [用戶端專屬的連結說明](/setup/) 操作。

1. 在 Console 中開啟 [Build → AI tools](https://www.sandbase.ai/console/setup){target="_blank"}。
2. 將這一行貼到 AI 助理的聊天中，然後告訴它您想建置什麼。這是聊天指示，不是 shell 指令：

   ```text
   set up https://www.sandbase.ai/SKILL.md
   ```

3. 核准 agent 開啟的瀏覽器登入。無須貼上 API 金鑰。
4. 開始新的工作階段或重新啟動應用程式，讓 SandBase 工具載入。
5. 請 agent 探索並檢視相關工具，然後在您的授權與預算範圍內發出一次有限度的請求。若用於開發，請讓它將回應整合到您的專案中，並提供執行指令與實際的測試結果。僅完成探索並不代表商業 API 呼叫已經驗證。

偏好使用終端機？請執行 `npx -y @sandbaseai/cli@latest connect`。它會設定偵測到的支援用戶端；若只要設定其中一個，請使用 `npx -y @sandbaseai/cli@latest connect --client codex`（將 `codex` 替換為您支援的用戶端）。之後請重新啟動該用戶端。執行付費請求前，請確認所選的工作區。

例如，您可以這樣要求：

> 找一個能搜尋關於 AI agent 的公開 X 貼文的 SandBase API。先檢視它的必要輸入與價格，並在執行前告訴我一次請求的費用。在結果中保留原始來源連結。

原始碼與安裝說明：[GitHub 上的 SandBase CLI 與 MCP](https://github.com/sandbaseai/cli)。

了解更多：[連結 AI 工具](/setup/)。

### 讓您的 AI 助理協助建置 {#start-with-your-agent}

[設定 Skill](https://www.sandbase.ai/SKILL.md) 會依您目前的情況引導 agent：尚無帳戶、已有 API 金鑰、已連結工具、既有專案，或要開發新功能。它會檢查端點的輸入與價格，協助實作整合，並區分「完成設定」、「已驗證的呼叫」與「可運作的功能」。請告訴它您的目標與支出上限；不要將金鑰貼到聊天中。

已經有金鑰或專案？直接說明即可，不需要從頭開始。例如：「我有一把 SandBase 金鑰。在這個專案中加入 Similarweb 流量查詢；先檢視 API 並告訴我即時測試的費用。」無法執行指令或載入工具的助理，需要改用 [用戶端專屬的設定方式](/setup/)。

[將 Markdown 版快速入門提供給您的 agent](https://www.sandbase.ai/quickstart.md)，或使用以下步驟。安裝設定 Skill 本身並不會建立託管 Agent。

### 選用：在 SandBase 上執行託管 Agent {#build-agent}

若工作包含多個步驟或需要重複使用，請選擇此方式。

1. 開啟 [Build → Agents](https://www.sandbase.ai/console/agents){target="_blank"}，並選擇 **Create**。
2. 填寫 **Overview** 與 **Instructions**。
3. 選擇一個 **Model**。
4. 在 **Capabilities** 下加入 Skills 與 MCP 工具，然後設定 **Runtime**。
5. 選擇 **Create & Chat**，在 Session 中進行測試。
6. 在 Agent 的 **API** 分頁上，從您的應用程式呼叫已測試的版本。

了解更多：[Build Agent](/agents/)。若要以官方 OpenAI SDK 從程式碼完成相同操作，請參閱 [OpenAI 相容性](/agents/openai-compatibility)。

## Skills、Tools 與其他建置方式 {#skills-and-tools}

請選擇符合您任務的資源。使用 API 不需要安裝 Skill 或建立託管 Agent。

- **[Tools](https://www.sandbase.ai/tools)：** 在現成的介面中完成特定任務，例如格式化文字或查詢公開資料。
- **[Skills](https://www.sandbase.ai/skills)：** 為 agent 提供包含指示、腳本與範例的可重複使用工作流程。
- **模型與 API：** 從 Playground、您的程式碼或已連結的 agent 呼叫某項能力。探索 [語言模型](https://www.sandbase.ai/models)、[圖片與影片](https://www.sandbase.ai/models/image-video) 或 [資料 API](https://www.sandbase.ai/apis)。
- **[託管 Agent](/agents/)：** 在 SandBase 上設定並執行可重複使用的 agent。
- **[Sandbox](/sandbox/)：** 為程式碼提供隔離的環境來執行與處理檔案。

### 使用 Tool {#use-tools}

1. 開啟 [Tools](https://www.sandbase.ai/tools)，選擇您要完成的任務。
2. 閱讀該工具的輸入需求，以及價格或配額標籤。免費的實用工具不需要帳戶即可使用；資料工具需要登入 SandBase 才能執行，模型測試則可能需要您自己的金鑰。
3. 輸入所需的文字、URL、檔案或其他內容，然後使用該工具的執行動作。
4. 檢視輸出，並在有提供時使用複製或下載動作。若為資料工具，想自動化相同任務時，可使用其連結的 API 與請求範例。

**每日免費配額由整個工作區共用**，並不是每個工具各自獨立的額度。執行前請確認資格與顯示的價格；免費的實用工具並不代表模型或 API 呼叫也免費。

### 使用 Skill {#use-skills}

1. 開啟 [Skills](https://www.sandbase.ai/skills)，選擇一個工作流程，並閱讀其範例、必要輸入與相依項目。
2. 選擇該 Skill 詳細資料頁面上提供的其中一個選項：
   - **線上執行：** 在有提供時登入並執行託管範例。追蹤其進度，並開啟產生的輸出或檔案。請確認顯示的額度；可用性與限制因 Skill 而異。
   - **安裝／下載：** 在有提供時登入並下載套件。將完整套件解壓縮到工作資料夾中，然後依照其安裝說明操作，或請您的本機 agent 讀取其 `SKILL.md`。
3. 在本機使用時，請提供您的任務、輸入、期望的輸出與支出上限。依照 [Agent 方式](#use-in-ai-tool) 連結 SandBase；若 Skill 的腳本需要金鑰，請在執行環境中設定，而不是貼到聊天中。
4. 檢視實際結果。下載 Skill 或連結您的 agent，並不代表工作流程已成功執行。

SandBase 的**設定 Skill** 用於連結您的用戶端；目錄中的 Skills 則描述個別的工作流程。安裝前請確認每個 Skill 的相依項目與支援的用戶端。本機工作流程所使用的模型與 API 呼叫可能會產生用量費用。

完整的操作說明（包含輸入資料夾與儲存的交付成果）請參閱 [在本機使用 Skill](/guides/skills/local-use)。

## 選用：共用團隊工作區 {#create-organization}

API 金鑰、用量與帳單都屬於某個組織。若您是獨自評估，請留在個人工作區。若有多人需要共用金鑰與支出，請建立團隊。

| 工作區 | 適用時機 |
|---|---|
| **個人** | 首次登入時自動建立。每位使用者一個。 |
| **團隊** | 共用成員、金鑰與餘額。適合為公司或專案建立。 |

### 建立團隊 {#create-team}

1. 開啟 [建立團隊](https://www.sandbase.ai/console/members?create=1){target="_blank"}，或在 Console 右上角的帳戶選單中選擇 **Create Team**。
2. 輸入 **Team name**，然後選擇 **Create team**。
3. 確認帳戶選單現在顯示該團隊為作用中的工作區。
4. 在 **Developer → Team** 上選擇 **Add member**，輸入現有 SandBase 帳戶的 **Account email**，並選擇 **Workspace role**（Member 或 Admin）。

受邀者必須已經擁有 SandBase 帳戶。若對方還沒有，請將 [此頁面](/getting-started/quickstart) 傳給對方，讓他先登入，再將他加入。

若您隸屬多個組織，請在帳戶選單中切換。金鑰與帳單會依循**作用中**的組織。角色說明請參閱 [組織](/admin/organizations)。

## 確認可正常運作 {#confirm-it-works}

符合以下所有條件時，即表示您已準備就緒：

- Console 帳戶選單顯示您要使用的組織。
- 您已完成其中一種方式：API 呼叫、在網站上執行、連結 AI 工具，或使用 Agent。
- 有一次請求成功。

若請求失敗，請檢查作用中的組織、金鑰與 [錯誤](/guides/error-handling)。當工作區沒有剩餘餘額時，請在 [Billing](https://www.sandbase.ai/console/billing){target="_blank"} 儲值。

### 遇到問題時 {#if-you-get-stuck}

| 您看到的狀況 | 要檢查的項目 |
| --- | --- |
| 需要登入 | 登入後回到原本的頁面，並確認作用中的工作區。 |
| 金鑰無效或存取遭拒 | 確認金鑰屬於目標工作區，且有權存取該端點。加值點數無法解決權限問題。 |
| 餘額不足或配額用盡 | 閱讀回應內容：若是餘額問題請查看 Billing，若是配額限制請查看顯示的重設時間。 |
| 您的 Agent 中沒有工具 | 開始新的用戶端工作階段，然後依照 [連結 AI 工具](/setup/) 中的診斷步驟操作。 |
| 任務仍在執行中 | 追蹤回傳的任務狀態或頁面上的進度指示。避免重複提交相同的付費請求。 |

## 帳單與用量 {#billing-and-usage}

登入後，檢視作用中組織的支出：

<QuickstartResources group="ops" />

## 後續步驟 {#next-steps}

<QuickstartResources group="catalog" />

- [Tools](https://www.sandbase.ai/tools) — 在瀏覽器中完成任務
- [Skills](https://www.sandbase.ai/skills) — 尋找可重複使用的 agent 工作流程
- [API 金鑰](/getting-started/api-keys) — 建立與輪替組織金鑰
- [模型與 API 目錄](https://www.sandbase.ai/models) — 在網站上試用模型、API 與 Agent
- [連結 AI 工具](/setup/) — 讓您的 AI 工具使用 SandBase 目錄
- [Build Agent](/agents/) — 建立可重複使用的 Agent
- [API 參考](/api-reference/) — 以程式碼整合
