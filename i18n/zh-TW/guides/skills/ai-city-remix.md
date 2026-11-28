---
i18nSource: ff1347dede49419a
agentDoc: ai-city-remix-agent-en
title: 參加 AI City Remix
description: 領取 AI City Remix 點數，選擇城市與 Skill，用本機 Agent 創作影片並上傳送審。
---

# 參加 AI City Remix {#enter-ai-city-remix}

在活動頁面選擇 Skill 與城市，再將完整指示交給您的本機 Agent。創作完成後，Agent 會上傳影片、封面與參賽資料並送出審核。


## 事前準備 {#prerequisites}

- 一個 SandBase 帳戶。
- 一個可執行指令並存取檔案的本機 Agent。
- 一個用來存放影片、封面與專案檔案的工作資料夾。

第一次在本機設定時，請參閱[在本機使用 Skill](/guides/skills/local-use)。

## 1. 開啟活動頁面並領取點數 {#_1-open-the-event-and-claim-credits}

1. 開啟 [AI City Remix](https://www.sandbase.ai/lab/event/aicityremix?lang=en)，並閱讀目前的[活動規則](https://www.sandbase.ai/lab/event/aicityremix?tab=rules&lang=en)。
2. 點選「Claim $5 free & create」，並依提示登入。
3. 系統會領取活動點數並嘗試自動兌換。請檢查餘額與兌換狀態；若需要重試，請使用兌換操作。
4. 領取後，點選「Create now」開啟創作對話框。

領取日期、可用狀態與參加資格會顯示在活動頁面上。模型呼叫會依實際用量扣除點數；請在 [Billing](https://www.sandbase.ai/console/billing) 中查看。

## 2. 設定模型 API 金鑰 {#_2-configure-a-model-api-key}

若您的帳戶沒有可用的 API 金鑰，流程會顯示「Create an API key」對話框。

1. 查看顯示的支出上限與到期時間，然後點選「Create API key」。
2. 點選「Create with this key」。新金鑰會包含在交給 Agent 的完整指示中。
3. 將完整指示傳送給您信任的 Agent，並保存在私人工作區中。

若使用既有的金鑰，請透過本機 Agent 的安全設定或執行環境設定 `SANDBASE_API_KEY`。請在 [API Keys](https://www.sandbase.ai/console/keys) 中管理金鑰。

## 3. 選擇 Skill 與創作簡介 {#_3-choose-a-skill-and-brief}

對話框開啟時，已預先選好一個官方 Skill、城市、故事與創作方向。

- 展開「Official Skill」閱讀摘要與詳細資訊，並選擇視覺風格。
- 展開「Creative brief」搜尋城市，或在地圖上選擇地點。
- 隨機切換建議，或直接編輯故事與創作方向。
- 確認地圖位置、支援的語言與輸出風格。

歷史、人物與事件請使用可查證的來源。語言與片長的支援情況請查看所選 Skill 的詳細資訊。

## 4. 複製指示並開始創作 {#_4-copy-the-instructions-and-create}

1. 在提示詞區域點選「Copy all」。
2. 在本機 Agent 中開啟專案資料夾，開始一個任務，並貼上完整指示。
3. 送出指示，提供任何要求的輸入，設定相依套件，然後開始創作。

指示中包含所選的 Skill、創作簡介、參賽中繼資料格式與上傳授權。請完整交付，讓 Agent 能夠創作並提交作品。

「Preparing」表示正在準備上傳權限。點選「Retry」可重新準備，或點選「Complete brief」補齊缺少的資訊。

## 5. 追蹤創作進度 {#_5-follow-creation-progress}

依 Skill、模型與影片長度不同，創作可能需要數十分鐘到數小時，並會使用模型點數。請保持 Agent 執行中，並避免電腦進入睡眠。

在同一個任務中加入預算與進度相關指示：

```text
My model-call budget is [AMOUNT] USD. Ask before exceeding it.
Report the current step, saved files, and next step, then continue creation.
```

依目前活動規則的要求，透過 SandBase 使用 MiniMax M3.1 Flash。片長、解析度、字幕與檔案大小請遵循活動與上傳頁面的規定。

## 6. 提交並查看審核狀態 {#_6-submit-and-check-review-status}

Agent 會依照完整指示使用官方上傳用戶端，上傳影片、封面與中繼資料，並送出審核。

開啟 [My entries](https://www.sandbase.ai/lab/event/aicityremix/mine?lang=en) 查看進度：

| 狀態 | 下一步 |
|---|---|
| 草稿 | 完成影片、上傳檔案並送出審核。 |
| 待審核 | 追蹤審核狀態。 |
| 已核准 | 開啟公開的作品頁面並分享。 |
| 需要修改 | 依審核意見修改後重新送出。 |

若已有完成的影片，請在活動頁面選擇「Upload existing video」，填寫資料，上傳影片與封面，然後送出審核。

## 7. 繼續上傳 {#_7-resume-an-upload}

若授權過期或上傳中斷，請使用原本的檔案繼續：

1. 保留影片、封面、`entry.json` 與工作資料夾。
2. 在 My entries 中找到同一份草稿，點選「Resume upload」。
3. 將新的續傳指示複製到原本的 Agent 任務中。
4. 請 Agent 上傳並提交既有檔案，然後在 My entries 中查看狀態。

## 8. 分享您的作品 {#_8-share-your-entry}

在已核准的作品頁面上，點選「Share on X」開啟預先填好內容的撰寫視窗。內容包含作品連結、`#AICityRemix`、`@SandbaseAI` 與官方活動貼文。

若要發布影片貼文，請先點選「Download video」，在 X 撰寫視窗中加入檔案，檢查文字後再發布。

## 相關文件 {#related-documentation}

- [在本機使用 Skill](/guides/skills/local-use)
- [連接您的 Agent](/setup/)
- [設定 API 金鑰](/getting-started/api-keys)
