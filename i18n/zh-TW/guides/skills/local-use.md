---
i18nSource: 31b3bd202f3dc24e
agentDoc: local-use-agent-en
title: 在本機使用 Skill
description: 選擇 SandBase Lab 的 Skill、下載其套件、設定模型存取權限，並搭配本機 Agent 建立及儲存專案。
---

# 在本機使用 Skill {#use-a-skill-locally}

下載 SandBase Skill，並在您的電腦上搭配 Agent 完成專案。Skill 包含指示、腳本與範例。Agent 會依照其 `SKILL.md` 中描述的工作流程執行。


## 1. 選擇 Skill {#_1-choose-a-skill}

1. 開啟 [SandBase Lab](https://www.sandbase.ai/lab/)。
2. 瀏覽影片、動畫、地圖等範例。開啟符合您專案需求的 Skill。
3. 檢視範例、必要輸入、輸出格式與支援的語言。
4. 使用 Skill 的下載功能儲存 ZIP 套件。

若要製作城市歷史地圖影片，請從 [City Through Time](https://www.sandbase.ai/lab/skills/city-through-time) 的範例與指示開始。

## 2. 準備本機工作資料夾 {#_2-prepare-a-local-working-folder}

1. 建立專案資料夾，例如 `my-city-film`。
2. 將完整的 Skill ZIP 解壓縮到該資料夾中，保留指示、腳本與素材。
3. 在您的本機 Agent 中開啟專案，並授予其存取專案檔案及執行工作流程所需指令的權限。
4. 依照 Skill 頁面上的安裝說明操作，或直接請 Agent 讀取解壓縮後的 `SKILL.md`。

專案可以使用以下結構：

```text
my-city-film/
  skill/          # Complete extracted Skill package
  inputs/         # Images, text, and other inputs
  outputs/        # Previews and deliverables
```

請使用 Skill 所要求的特定檔名與輸出位置。

## 3. 連接 SandBase {#_3-connect-sandbase}

將 `set up https://www.sandbase.ai/SKILL.md` 貼到您的 Agent 中，並核准其開啟的瀏覽器登入，或在終端機中執行 `npx -y @sandbaseai/cli@latest connect`。之後請開啟新的 Agent 工作階段，以載入 SandBase 工具。Console 中的 [Build → AI tools](https://www.sandbase.ai/console/setup) 也提供相同的選項。

完整的連線流程請參閱[連接 AI 工具](/setup/)。

如果 Skill 的腳本需要 `SANDBASE_API_KEY`：

1. 開啟 [API Keys](https://www.sandbase.ai/console/keys)，為專案建立或選取一個金鑰。
2. 透過本機 Agent 的安全設定或腳本執行環境進行設定。
3. 請 Agent 確認存取權限已設定完成，並繼續執行 Skill 工作流程。

請將金鑰保存在安全的本機設定中。交付成果、原始檔案與公開截圖中只應包含專案資訊。您可以在 [Billing](https://www.sandbase.ai/console/billing) 中檢視模型用量與餘額。

## 4. 提供需求說明 {#_4-provide-a-brief}

告訴 Agent 要使用哪個 Skill、要製作什麼、輸出需求以及您的預算。請依您的專案調整以下範例：

```text
Read SKILL.md in the project's skill folder and follow its workflow.

Topic: the story of Shanghai's development.
Deliverables: a playable video, a cover image, and usage notes.
Language and duration: use the Skill's supported options and state the plan before starting.
Models: use suitable models through SandBase.
Budget: model calls may use up to [AMOUNT] USD; ask me before exceeding it.

Check inputs and dependencies, then execute the workflow. Save previews and final files
in outputs. When finished, provide file paths, a summary, and the models actually used.
```

Agent 會讀取指示、檢查相依套件、處理輸入，並生成或算繪專案。將任何要求的素材加入同一個專案中，然後繼續任務。

## 5. 追蹤進度並檢視結果 {#_5-follow-progress-and-review-the-result}

所需時間取決於 Skill、模型、素材與輸出長度。影片專案可能需要數十分鐘到數小時。請保持 Agent 執行中，並讓電腦維持喚醒狀態。

在同一個對話中詢問進度：

```text
Report the current step, files already saved, and the next step, then continue the task.
```

開啟交付的檔案路徑，檢查畫面、音訊、字幕與內容，然後儲存最終檔案。

## 6. 修改專案 {#_6-revise-the-project}

在原本的任務中提出具體修改要求，並重複使用既有素材：

```text
Keep the structure and other shots. Shorten the opening and correct the caption at 00:18.
Reuse existing assets and save the revised result as a new version.
```

如果執行中斷，請保留工作資料夾，並請 Agent 從目前的步驟繼續。

## 後續步驟 {#next-steps}

- [進入 AI City Remix](/guides/skills/ai-city-remix)
- [連接您的 Agent](/setup/)
- [設定 API 金鑰](/getting-started/api-keys)
