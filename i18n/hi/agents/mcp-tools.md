---
i18nSource: 417ea5dc930a8786
title: Skills और MCP tools
description: SandBase Agent को दोबारा इस्तेमाल योग्य Skills और remote MCP tools दें, और नियंत्रित करें कि हर Session कौन-से versions और tools इस्तेमाल करे।
---

# Skills और MCP tools {#skills-and-mcp-tools}

Agent को capabilities दो तरीकों से मिलती हैं:

- **Skills** Agent को कोई काम करना सिखाते हैं। Skill, instructions और resources का एक versioned ZIP bundle है।
- **MCP connections** Agent को HTTPS पर किसी remote MCP server के tools call करने देते हैं, और वैकल्पिक रूप से [Secret](/agents/api-credentials) से authenticate होते हैं।

ज़्यादातर उपयोगी Agents दोनों को जोड़ते हैं: MCP server data लाता है या actions करता है, और Skill बताता है कि results का उपयोग कैसे करना है।

## Skills {#skills}

1. ऐसा folder package करें जिसमें `name` और `description` frontmatter वाली `SKILL.md` हो, और folder को ही zip करें (`zip -r release-notes.zip release-notes/`, अधिकतम 5 MiB)। ZIP के top level पर वही folder होना चाहिए; ZIP root पर `SKILL.md` होने पर `400 invalid_request` लौटता है।
2. इसे `POST /v1/skills` से multipart field `files` के रूप में upload करें। Response में एक `skl_` ID और `default_version: "1"` होता है।
3. इसे Agent के `skills` array में reference करें।

```json
{
  "skills": [
    { "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null }
  ]
}
```

- पहली बार जोड़ने पर, `"version": null` Agent save होते समय Skill के current `default_version` पर resolve होता है। `"2"` जैसी string उस version को स्पष्ट रूप से चुनती है।
- Saved Agent version को pin कर देता है। Skill का default बदलने से मौजूदा Agents या उनके नए Sessions upgrade नहीं होते। Upgrade करने के लिए Agent को स्पष्ट version के साथ update करें; मौजूदा binding के लिए `null` भेजने पर उसका pinned version बना रहता है।
- `POST /v1/skills/{skill_id}/versions` से नया version upload करें, और `default=true` या `POST /v1/skills/{skill_id}` से default बदलें।
- Disabled Skill की वजह से उसे reference करने वाले Agents के नए Sessions `400 skill_not_found` के साथ विफल होते हैं।

आप [Skills catalog](/api-reference/skills/catalog) में public Skills भी देख सकते हैं। पूरे walkthrough के लिए [Skills API](/api-reference/skills/) देखें।

## बिल्ट-इन SandBase टूल {#built-in-sandbase-tools}

हर नया Agent बिना किसी setup के SandBase के अपने tools इस्तेमाल कर सकता है। `sandbase_discover`, `sandbase_inspect` और `sandbase_run` से Agent catalog में कोई model या API ढूँढता है, उसका schema और price पढ़ता है, और आपकी key से उसे call करता है। Create के समय `mcp_connections` न भेजने पर Agent को यह default मिलता है:

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

- **आपकी भेजी गई list default की जगह ले लेती है।** अपना MCP server जोड़ते हुए SandBase tools बनाए रखने के लिए अपनी list में built-in entry शामिल करें।
- **`builtin:sandbase` के लिए `server_label: "sandbase_builtin"` आवश्यक है।** कोई अन्य label, या किसी दूसरे connection पर यह label, `400` लौटाता है।
- **बिना tools वाला Agent बनाने के लिए,** `"mcp_connections": []` भेजें।
- **Built-in tools मुफ़्त हैं।** आप केवल उन models और APIs का भुगतान करते हैं जिन्हें Agent इनके ज़रिए call करता है।

## MCP कनेक्शन {#mcp-connections}

1. अगर MCP server को Bearer token चाहिए, तो उसके exact URL के लिए [Secret बनाएँ](/agents/api-credentials)।
2. `POST /v1/mcp-connections` से server register करें:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/mcp-connections \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Idempotency-Key: github-mcp" \
     -H "Content-Type: application/json" \
     -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
   ```

3. Agent के `mcp_connections` array में connection को reference करें:

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

| Field | अर्थ |
|---|---|
| `connection_id` | आपके organization में `mcp_` connection ID, या built-in SandBase server के लिए `builtin:sandbase` |
| `server_label` | Letter से शुरू होता है; letters, digits, `_` और `-`; अधिकतम 64 characters; Agent में अद्वितीय |
| `allowed_tools` | छोड़ने या `null` होने पर server के सभी tools की अनुमति होती है; `[]` किसी की अनुमति नहीं देता; list केवल उन्हीं names की अनुमति देती है (अधिकतम 256 names, हर name nonblank और अधिकतम 128 bytes) |
| `required` | क्या Session को यह server load करना ज़रूरी है |

एक Agent अधिकतम 32 connections reference कर सकता है। Session शुरू होते समय organization connections का `active` होना ज़रूरी है।

### बिल्ट-इन SandBase टूल {#built-in-sandbase-tools-1}

`mcp_connections` के बिना Agent बनाने पर built-in SandBase server चुना जाता है। इसे अपने server के साथ स्पष्ट रूप से बनाए रखने के लिए array में यह entry शामिल करें:

```json
{
  "connection_id": "builtin:sandbase",
  "server_label": "sandbase_builtin",
  "allowed_tools": null,
  "required": true
}
```

स्पष्ट array पूरे selection की जगह ले लेता है; ऊपर का केवल-custom उदाहरण built-in server को शामिल नहीं करता। सभी MCP tools disable करने के लिए `[]` भेजें। Agent update में यह field छोड़ने पर मौजूदा selection बना रहता है; `null` भेजने पर `400` लौटता है। Built-in entry के लिए MCP connection या Secret बनाने की ज़रूरत नहीं है। Retired `use_sandbase_mcp` field न भेजें।

::: info OpenAI से अंतर
OpenAI का Agents API, MCP servers को inline `tools: [{"type": "mcp", ...}]` के रूप में घोषित करता है। SandBase उस रूप के लिए `400` लौटाता है: server को connection resource के रूप में register करें और उसे `mcp_connections` में reference करें। OpenAI SDK में `/v1/mcp-connections` या `/v1/secrets` के लिए कोई methods नहीं हैं, इसलिए उन्हें `client.post(...)` से call करें और `mcp_connections` को `extra_body` (Python) या request body (Node.js) से भेजें। [OpenAI compatibility](/agents/openai-compatibility#mcp-connections-with-the-sdk) देखें।
:::

## बदलाव और चल रहे Sessions {#changes-and-running-sessions}

हर Session शुरू होते समय अपने Agent version, Skill versions और MCP connection configuration को freeze कर देता है।

- किसी connection को replace करने या उसका Secret rotate करने के बाद, नए Sessions नया configuration इस्तेमाल करते हैं; मौजूदा Sessions अपना snapshot बनाए रखते हैं।
- किसी connection को disable करने या उसका Secret revoke करने से नए Sessions रुक जाते हैं और उसे इस्तेमाल करने वाले मौजूदा Sessions में आगे का input अस्वीकार होता है। पहले से चल रही tool call बीच में नहीं रोकी जाती।

## Tokens को prompts से दूर रखें {#keep-tokens-out-of-prompts}

Tokens को Secrets के रूप में store करें। उन्हें instructions, Session input, metadata या Skill bundles में न डालें: इन्हें Agent या Session तक पहुँच रखने वाला कोई भी पढ़ सकता है।

## अगले कदम {#next-steps}

- [MCP tools के लिए credentials](/agents/api-credentials)
- [MCP Connections API](/api-reference/mcp-connections/)
- [Skills API](/api-reference/skills/)
- [Agent परिभाषित करें](/agents/agent-api)
