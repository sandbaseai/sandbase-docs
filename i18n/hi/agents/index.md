---
i18nSource: 7b24f4b0b5cd2c33
title: Agent बनाएँ
description: दोबारा इस्तेमाल होने वाले, versioned Agents को SandBase Sessions में परिभाषित करें, test करें और चलाएँ।
---

# Agent बनाएँ {#build-agent}

Build Agent वह जगह है जहाँ आप एक Agent को परिभाषित और test करते हैं, फिर तय करते हैं कि वह कैसे चलेगा।

Agent एक saved, versioned configuration है: एक Model, instructions, एक runtime profile, Skills, और external tools से MCP connections। Agent को save करने से वह चलता नहीं है।

## Agent क्या है {#what-an-agent-is}

| सवाल | यह कहाँ रहता है |
|---|---|
| इसे क्या करना चाहिए? | `instructions` |
| काम कौन-सा model करता है? | `model`, [Models API](/api-reference/models/) से एक model ID |
| इसे क्या करना आता है? | [Skills](/agents/mcp-tools#skills), versioned instruction bundles |
| यह कौन-से external tools call कर सकता है? | [MCP connections](/agents/mcp-tools#mcp-connections), और जब server को token चाहिए तो [credentials](/agents/api-credentials) के साथ |
| यह कैसे चलता है? | एक [Session](/agents/sessions) में |

हर प्रभावी बदलाव एक नया immutable version बनाता है। आप कभी भी versions की सूची देख सकते हैं और किसी पुराने version को restore कर सकते हैं।

## Agent कैसे चलता है {#how-an-agent-runs}

आप Agent को एक [Session](/agents/sessions) में चलाते हैं। Session एक `ses_` resource है जिसे आप input भेजते हैं और जिससे events stream करते हैं, चाहे वह interactive बातचीत हो, test run हो, या आपकी application से call हो। हर Session उस Agent version को freeze कर लेता है जिसके साथ वह शुरू हुआ था, इसलिए आप पहले से मौजूद Sessions को बदले बिना Agent को edit करते रह सकते हैं।

## Agent lifecycle: Draft → Session में test → अपनी app से चलाएँ → Sessions की जाँच {#agent-lifecycle-draft-→-test-in-a-session-→-run-from-your-app-→-inspect-sessions}

### 1. ड्राफ़्ट {#_1-draft}

Console में **Build → Agents** के अंतर्गत, या [`POST /v1/agents`](/agents/agent-api) से Agent बनाएँ। सबसे छोटे उपयोगी workflow से शुरू करें, और Skills व MCP connections तभी जोड़ें जब instructions को उनकी ज़रूरत हो।

### 2. Session में test करें {#_2-test-in-a-session}

Agent के लिए एक Session बनाएँ, प्रतिनिधि input भेजें, और output, tool activity और errors पढ़ें। केवल happy path ही नहीं, बल्कि missing input, अनुपलब्ध tools, खाली परिणाम और output-format की ज़रूरतों को भी test करें।

### 3. अपनी app से चलाएँ {#_3-run-from-your-app}

[Sessions API](/api-reference/sessions/) से अपनी application में test किए गए Agent के लिए Sessions बनाएँ।

### 4. Sessions की जाँच करें {#_4-inspect-sessions}

पूरी बातचीत, tool activity और errors की समीक्षा के लिए Sessions API से हर Session के items और turns पढ़ें।

## प्रोडक्शन चेकलिस्ट {#production-checklist}

- `model` Models API से एक मौजूदा model ID इस्तेमाल करता है।
- जब व्यवहार बिना बताए नहीं बदलना चाहिए, तो Skills एक version पर pin किए गए हैं।
- MCP connections `allowed_tools` के ज़रिए केवल वही tools उपलब्ध कराते हैं जिनकी Agent को ज़रूरत है।
- Tokens [Secrets](/agents/api-credentials) के रूप में store किए गए हैं, कभी instructions, input या metadata में नहीं लिखे गए।
- Session बनाते समय `Idempotency-Key` भेजी जाती है, और retries उसी को दोबारा इस्तेमाल करते हैं।
- Launch के बाद Session status और errors जाँचे जाते हैं।

## कैटलॉग Agents {#catalog-agents}

सार्वजनिक [Agent catalog](/api-reference/agents/catalog) SandBase द्वारा प्रकाशित Agents की सूची देता है। आप catalog Agent पढ़ सकते हैं, लेकिन उसे बदलने के लिए पहले `POST /v1/agents/catalog/{agent_id}/clone` से उसे अपनी organization में clone करें। Clone एक नया private Agent होता है जिसके आप स्वामी हैं और जिसे आप चला सकते हैं।

::: tip OpenAI SDK का इस्तेमाल
Agents, Sessions और Skills OpenAI Agents API का पालन करते हैं, इसलिए आधिकारिक OpenAI SDK `base_url="https://api.sandbase.ai/v1"` के साथ काम करता है। सत्यापित उदाहरणों और अंतरों के लिए [OpenAI compatibility](/agents/openai-compatibility) देखें।
:::

## अगले कदम {#next-steps}

- [Agent परिभाषित करें](/agents/agent-api)
- [OpenAI compatibility](/agents/openai-compatibility)
- [Skills और MCP tools](/agents/mcp-tools)
- [Sessions](/agents/sessions)
