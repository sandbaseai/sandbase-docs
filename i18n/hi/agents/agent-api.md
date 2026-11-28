---
i18nSource: 2ba7f0f41847d04f
title: Agent परिभाषित करें
description: Agents API से versioned Agent बनाएँ और update करें, जिसमें fields, सीमाएँ, versions और archive शामिल हैं।
---

# Agent परिभाषित करें {#define-an-agent}

`POST /v1/agents` से Agent बनाएँ। यह API, OpenAI Agents protocol का पालन करता है, इसलिए आप सामान्य HTTP या `base_url="https://api.sandbase.ai/v1"` के साथ OpenAI SDK का `client.beta.agents` इस्तेमाल कर सकते हैं। `OpenAI-Beta` header वैकल्पिक है; अगर आप इसे भेजते हैं, तो इसका मान `agents=v1` होना चाहिए। SDK क्या-क्या समर्थित करता है, यह जानने के लिए [OpenAI compatibility](/agents/openai-compatibility) देखें।

## Agent बनाएँ {#create-an-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: create-research-agent-1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research assistant",
    "model": "deepseek/deepseek-v4-flash",
    "instructions": "Research the question, compare at least two sources, and cite them.",
    "metadata": {"team": "research"}
  }'
```

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
agent = client.beta.agents.create(
    model="deepseek/deepseek-v4-flash",
    name="Research assistant",
    instructions="Research the question, compare at least two sources, and cite them.",
    metadata={"team": "research"},
)
print(agent.id, agent.version)  # agt_..., 1
```

Response `201 Created` होता है, जिसमें Agent लौटता है: एक `agt_` ID, `version: 1`, `row_version`, `status: "active"` और `projection_status`। नया version background में execution के लिए तैयार किया जाता है; `projection_status` के `ready` होने पर Sessions शुरू करें।

`Idempotency-Key` वैकल्पिक है। इसे न भेजने पर सर्विस खुद एक key बनाती है, इसलिए दोबारा भेजा गया request दूसरा Agent बना सकता है। Retry करते समय अपनी स्थिर key भेजें।

## फ़ील्ड {#fields}

Body strict JSON होती है (अधिकतम 1 MiB)। अज्ञात fields 400 लौटाते हैं।

| Field | आवश्यक | सीमाएँ और मान |
|---|---|---|
| `model` | हाँ | Model ID, अधिकतम 200 characters |
| `name` | नहीं | अधिकतम 128 characters |
| `instructions` | नहीं | अधिकतम 256 KiB |
| `description` | नहीं | अधिकतम 4096 characters |
| `runtime_profile` | नहीं | `codex` (default), `claude` या `mcode` |
| `skills` | नहीं | अधिकतम 32 references। `version: null` वाली नई binding, save होते समय current default को pin करती है; मौजूदा bindings अपना pinned version बनाए रखती हैं। Upgrade करने के लिए स्पष्ट version दें; [Skills](/agents/mcp-tools#skills) देखें |
| `mcp_connections` | नहीं | अधिकतम 32 references; [MCP connections](/agents/mcp-tools#mcp-connections) देखें |
| `tools` | नहीं | अधिकतम 64 `function` tools और अधिकतम एक `web_search` tool |
| `text` | नहीं | `format.type` `text` या `json_schema` (object schema); `verbosity` `low`, `medium` या `high` |
| `reasoning` | नहीं | `effort` `none`, `minimal`, `low`, `medium`, `high`, `xhigh` या `max`; `summary` `concise`, `detailed` या `auto` |
| `service_tier` | नहीं | `auto` (default), `default`, `flex`, `priority` या `fast` |
| `metadata` | नहीं | अधिकतम 16 string pairs; keys अधिकतम 64 और values अधिकतम 512 characters |
| `note` | नहीं | Version पर सहेजा जाने वाला change note |

## वर्तमान सीमाएँ {#current-limits}

- Sessions शुरू होने के लिए `web_search` को `"mode": "disabled"` का उपयोग करना होगा।
- `function` tools save किए जा सकते हैं, लेकिन ऐसे Runs अभी समर्थित नहीं हैं जिनमें client को tool result लौटाना पड़े (`requires_action`)। उस स्थिति में Session `502 executor_contract_error` लौटाता है। इसके बजाय Agent को [MCP connections](/agents/mcp-tools#mcp-connections) के ज़रिए external capabilities दें।
- `multi_agent` को छोड़ दें या `null` रखें।

## Agent update करें {#update-an-agent}

Update के दो रूप हैं। दोनों एक नया version बनाते हैं।

- `POST /v1/agents/{agent_id}` OpenAI SDK वाला update है। केवल वे fields भेजें जिन्हें आप बदलना चाहते हैं। `row_version` की ज़रूरत नहीं होती, इसलिए आख़िरी write ही लागू होता है। इस रूप में `description` और `note` स्वीकार नहीं किए जाते।
- `PATCH /v1/agents/{agent_id}` compare-and-set update है। इसमें आपके द्वारा पिछली बार पढ़ा गया `row_version` आवश्यक है, और अगर इस बीच Agent बदल गया हो तो यह 409 लौटाता है। स्पष्ट `null` मान अस्वीकार किए जाते हैं।

```bash
curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 2, "instructions": "Answer in five bullet points with cited sources.", "note": "Shorter answers"}'
```

## Versions, archive और restore {#versions-archive-and-restore}

- `GET /v1/agents/{agent_id}/versions` अपरिवर्तनीय snapshots की सूची देता है; `GET /v1/agents/{agent_id}/versions/{version}` एक snapshot पढ़ता है।
- `{"source_version": 1, "row_version": 3}` के साथ `POST /v1/agents/{agent_id}/restore` किसी पुराने configuration को एक नए current version में copy करता है।
- `POST /v1/agents/{agent_id}/archive` और `/unarchive`, `{"row_version": …}` लेते हैं। Archived Agents नए Sessions शुरू नहीं कर सकते।
- `DELETE /v1/agents/{agent_id}` Agent को archive करता है। Agents कभी hard-delete नहीं किए जाते।

## अगले कदम {#next-steps}

- [Skills और MCP tools](/agents/mcp-tools)
- [Agent को Session में चलाएँ](/agents/sessions)
- [Agents API reference](/api-reference/agents/)
