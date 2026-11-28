---
i18nSource: 417ea5dc930a8786
title: Skills 與 MCP 工具
description: 為 SandBase Agent 提供可重複使用的 Skills 與遠端 MCP 工具，並控制每個 Session 使用的版本與工具。
---

# Skills 與 MCP 工具 {#skills-and-mcp-tools}

Agent 透過兩種方式取得能力：

- **Skills** 教導 Agent 如何完成工作。Skill 是一個具版本控管的 ZIP 套件，內含指示與資源。
- **MCP 連線** 讓 Agent 透過 HTTPS 呼叫遠端 MCP 伺服器上的工具，並可選擇使用 [Secret](/agents/api-credentials) 進行驗證。

大多數實用的 Agent 會同時結合兩者：MCP 伺服器負責擷取資料或執行動作，Skill 則說明如何運用結果。

## Skills {#skills}

1. 將含有 `SKILL.md`（帶有 `name` 與 `description` frontmatter）的資料夾打包，並壓縮資料夾本身（`zip -r release-notes.zip release-notes/`，最大 5 MiB）。ZIP 的最上層必須是該資料夾；若 `SKILL.md` 位於 ZIP 根目錄，會回傳 `400 invalid_request`。
2. 以 multipart 欄位 `files` 透過 `POST /v1/skills` 上傳。回應中包含 `skl_` ID 與 `default_version: "1"`。
3. 在 Agent 的 `skills` 陣列中參照它。

```json
{
  "skills": [
    { "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null }
  ]
}
```

- 首次附加時，`"version": null` 會在儲存 Agent 時解析為該 Skill 當下的 `default_version`。`"2"` 這類字串則會明確選取該版本。
- 已儲存的 Agent 會固定版本。變更 Skill 的預設版本不會升級既有的 Agent 或其新的 Session。若要升級，請以明確版本更新 Agent；對既有繫結傳送 `null` 會保留其已固定的版本。
- 使用 `POST /v1/skills/{skill_id}/versions` 上傳新版本，並透過 `default=true` 或 `POST /v1/skills/{skill_id}` 切換預設版本。
- 若 Skill 被停用，參照它的 Agent 在建立新 Session 時會失敗並回傳 `400 skill_not_found`。

您也可以在 [Skills 目錄](/api-reference/skills/catalog) 瀏覽公開的 Skills。完整的操作說明請參閱 [Skills API](/api-reference/skills/)。

## 內建 SandBase 工具 {#built-in-sandbase-tools}

每個新的 Agent 都能直接使用 SandBase 自有的工具，無須任何設定。透過 `sandbase_discover`、`sandbase_inspect` 與 `sandbase_run`，Agent 可以在目錄中找到模型或 API、讀取其 schema 與價格，並以您的金鑰呼叫它。若建立時省略 `mcp_connections`，Agent 會取得以下預設值：

```json
{
  "mcp_connections": [
    {
      "connection_id": "builtin:sandbase",
      "server_label": "sandbase_builtin",
      "allowed_tools": null,
      "required": true
    }
  ]
}
```

- **您傳送的清單會取代預設值。** 若要加入自己的 MCP 伺服器並保留 SandBase 工具，請在清單中包含內建項目。
- **`builtin:sandbase` 必須搭配 `server_label: "sandbase_builtin"`。** 使用其他標籤，或將該標籤用於其他連線，都會回傳 `400`。
- **若要建立不含工具的 Agent，** 請傳送 `"mcp_connections": []`。
- **內建工具免費。** 您只需為 Agent 透過它們呼叫的模型與 API 付費。

## MCP 連線 {#mcp-connections}

1. 若 MCP 伺服器需要 Bearer 權杖，請針對其確切 URL [建立 Secret](/agents/api-credentials)。
2. 使用 `POST /v1/mcp-connections` 註冊伺服器：

   ```bash
   curl -X POST https://api.sandbase.ai/v1/mcp-connections \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Idempotency-Key: github-mcp" \
     -H "Content-Type: application/json" \
     -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
   ```

3. 在 Agent 的 `mcp_connections` 陣列中參照該連線：

   ```json
   {
     "mcp_connections": [
       {
         "connection_id": "mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13",
         "server_label": "github",
         "allowed_tools": ["search_issues", "get_issue"],
         "required": true
       }
     ]
   }
   ```

| 欄位 | 說明 |
|---|---|
| `connection_id` | 您組織中的 `mcp_` 連線 ID，或代表內建 SandBase 伺服器的 `builtin:sandbase` |
| `server_label` | 以字母開頭；可使用字母、數字、`_` 與 `-`；最多 64 個字元；在 Agent 內不可重複 |
| `allowed_tools` | 省略或為 `null` 時允許伺服器提供的所有工具；`[]` 不允許任何工具；清單則只允許列出的名稱（最多 256 個名稱，每個不得為空白且最多 128 位元組） |
| `required` | Session 是否必須載入此伺服器 |

一個 Agent 最多可參照 32 個連線。Session 啟動時，組織連線必須處於 `active` 狀態。

### 內建 SandBase 工具 {#built-in-sandbase-tools-1}

建立 Agent 時若未指定 `mcp_connections`，會選用內建的 SandBase 伺服器。若要在自己的伺服器之外明確保留它，請在陣列中加入以下項目：

```json
{
  "connection_id": "builtin:sandbase",
  "server_label": "sandbase_builtin",
  "allowed_tools": null,
  "required": true
}
```

明確指定的陣列會取代整個選擇；上方僅含自訂伺服器的範例會排除內建伺服器。傳送 `[]` 可停用所有 MCP 工具。更新 Agent 時省略此欄位會保留既有的選擇；傳送 `null` 則回傳 `400`。內建項目不需要建立 MCP 連線或 Secret。請勿傳送已停用的 `use_sandbase_mcp` 欄位。

::: info 與 OpenAI 的差異
OpenAI 的 Agents API 以 `tools: [{"type": "mcp", ...}]` 的形式內嵌宣告 MCP 伺服器。SandBase 對此形式會回傳 `400`：請將伺服器註冊為連線資源，並在 `mcp_connections` 中參照它。OpenAI SDK 沒有 `/v1/mcp-connections` 或 `/v1/secrets` 的方法，因此請以 `client.post(...)` 呼叫它們，並透過 `extra_body`（Python）或請求主體（Node.js）傳入 `mcp_connections`。請參閱 [OpenAI 相容性](/agents/openai-compatibility#mcp-connections-with-the-sdk)。
:::

## 變更與執行中的 Session {#changes-and-running-sessions}

每個 Session 在啟動時會凍結其 Agent 版本、Skill 版本與 MCP 連線設定。

- 取代連線或輪替其 Secret 後，新的 Session 會使用新設定；既有的 Session 則保留其快照。
- 停用連線或撤銷其 Secret 會阻止建立新的 Session，並拒絕使用它的既有 Session 的後續輸入。已在執行中的工具呼叫不會被中斷。

## 不要將權杖放進提示詞 {#keep-tokens-out-of-prompts}

請將權杖儲存為 Secret。不要把它們放在指示、Session 輸入、metadata 或 Skill 套件中：任何能存取該 Agent 或 Session 的人都能讀取這些內容。

## 後續步驟 {#next-steps}

- [MCP 工具的憑證](/agents/api-credentials)
- [MCP Connections API](/api-reference/mcp-connections/)
- [Skills API](/api-reference/skills/)
- [定義 Agent](/agents/agent-api)
