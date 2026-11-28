---
i18nSource: 28b1ef75a197824a
title: 連接 AI 工具
description: 只需一段提示或一行 CLI 指令，就能讓 Claude Code、Codex、Cursor、Kiro 等 AI 工具使用 SandBase 的 Models 與 APIs 目錄。
---

# 連接 AI 工具 {#connect-ai-tools}

Console 中的 [AI tools](https://www.sandbase.ai/console/setup) 頁面（**Build → AI tools**）可將 SandBase 連接到您已在使用的 Agent 或 AI 工具。連接後的工具可以搜尋 SandBase 的 Models 與 APIs 目錄、讀取每個工具的輸入結構描述與價格，並加以執行。每次呼叫都會計費至目前的工作區。

支援的用戶端包括 Claude Code、Codex、Cursor、Kiro IDE 與 Kiro CLI、Windsurf、Gemini CLI、OpenCode、Qwen Code、Warp、Amp、Crush、OpenClaw、Hermes、Claude Desktop 以及 ChatGPT。目前完整的清單請見 AI tools 頁面。

## 快速入門：貼上一段提示 {#quick-start-paste-one-prompt}

將這一行貼到您的 Agent 中：

```text
set up https://www.sandbase.ai/SKILL.md
```

Agent 會讀取 SandBase Skill、安裝 CLI，並請您核准一次瀏覽器登入。您不需要貼上 API 金鑰。當 Agent 回報用戶端已設定完成後，請開啟新的 session 或重新啟動應用程式，以載入 `sandbase_*` 工具。

此 Skill 需要執行 Agent 的電腦上安裝 Node.js 20 或更新版本。

## 其他連接方式 {#other-ways-to-connect}

### CLI {#cli}

從終端機連接。若未指定 `--client`，CLI 會設定它找到的所有支援用戶端：

```sh
npx -y @sandbaseai/cli@latest connect
```

若只要設定單一用戶端，請傳入其 id，例如 `codex`、`claude-code`、`cursor` 或 `kiro`：

```sh
npx -y @sandbaseai/cli@latest connect --client codex
```

安裝程式指令碼會執行相同的指令：

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --client codex
```

若要列出安裝程式可辨識的用戶端，而不變更本機設定：

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --list-agents
```

`connect` 會開啟瀏覽器授權、為您核准的工作區建立 **CLI Login** 金鑰，且只會寫入屬於 SandBase 的用戶端設定。開放原始碼的 [SandBase CLI](https://github.com/sandbaseai/cli) 記載了每個用戶端的說明。

### 需手動設定的 MCP 用戶端 {#mcp-clients-you-configure-by-hand}

已登入的使用者可在 [AI tools](https://www.sandbase.ai/console/setup) 頁面的 **Other ways to connect** 下看到 MCP 伺服器位址。請使用從 **Developer → API Keys** 取得的 [API 金鑰](/getting-started/api-keys)進行驗證，並將金鑰保存在用戶端的機密設定中。

## 驗證連線 {#verify-the-connection}

僅完成安裝或授權並不代表用戶端已連線。請確認：

- 用戶端中可看到 SandBase 伺服器或連接器
- 在新的 session 中可以找到 `sandbase_*` 工具
- 一則安全的自然語言請求能成功完成

對於由 CLI 管理的用戶端，請在重新連接或變更設定後執行診斷：

```sh
npx -y @sandbaseai/cli doctor --client codex
```

`doctor` 會檢查本機憑證、MCP 項目與 Skill，然後與 SandBase 進行一次往返通訊。最後的工具呼叫請務必在用戶端內執行。

連接後的工具所執行的作業會連同費用顯示在 [Activities](https://www.sandbase.ai/console/activities) 中。

## 疑難排解 {#troubleshooting}

| 問題 | 檢查項目 |
|---|---|
| 工具沒有出現 | 開啟新的用戶端 session 或重新啟動應用程式，執行 `npx -y @sandbaseai/cli doctor --client <client>`，然後重試。 |
| 缺少授權 | 再次執行 `connect`，並為您要計費的工作區核准瀏覽器登入。 |
| 呼叫失敗並傳回 HTTP 402 | 在 [Billing](https://www.sandbase.ai/console/billing) 中為目前的工作區加值點數。 |

## 移除受管理的設定 {#remove-the-managed-configuration}

僅移除單一用戶端中屬於 SandBase 的項目：

```sh
npx -y @sandbaseai/cli unregister --client codex
```

此指令只會移除能確認屬於 SandBase 的設定，不相關或由使用者管理的項目則保持不變。若您不再需要，請接著在 **Developer → API Keys** 下撤銷對應的 **CLI Login** 金鑰。

## 原始碼與支援 {#source-and-support}

- [原始碼](https://github.com/sandbaseai/cli)
- [npm 套件](https://www.npmjs.com/package/@sandbaseai/cli)
- [問題與範例](https://github.com/sandbaseai/cli/discussions)
- [錯誤回報](https://github.com/sandbaseai/cli/issues/new/choose)

## 後續步驟 {#next-steps}

- [Models 與 APIs 目錄](https://www.sandbase.ai/models)
- [Skill 教學](/guides/skills/)
- [建構 Agent](/agents/)
