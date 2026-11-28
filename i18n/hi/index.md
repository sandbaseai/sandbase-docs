---
i18nSource: c063864501452a7b
title: SandBase डॉक्स
description: Models और APIs के साथ सीधे build करें, या managed infrastructure पर चलने वाले reusable Agents परिभाषित करें।
---

# SandBase डॉक्स {#sandbase-docs}

Models और APIs के साथ सीधे build करें, या managed infrastructure पर चलने वाले reusable Agents परिभाषित करें।

SandBase, AI applications बनाने के दो पूरक तरीके देता है। काम के अनुसार सबसे छोटे विकल्प से शुरू करें; application बढ़ने के साथ आप दोनों को मिला सकते हैं।

## Build करने का तरीका चुनें {#choose-how-to-build}

| | Models और APIs | Managed Agents |
|---|---|---|
| **यह क्या है** | Language, image, video, audio और third-party APIs तक सीधा access | SandBase द्वारा चलाए जाने वाले reusable, versioned Agent configurations |
| **किसके लिए सबसे उपयुक्त** | Custom application loops और request पर बारीक नियंत्रण | कई चरणों वाला, asynchronous या दोहराया जाने वाला काम |
| **आप क्या मैनेज करते हैं** | Prompts, orchestration, retries और application state | Agent definition, enabled capabilities, inputs और delivery व्यवहार |
| **यहाँ से शुरू करें** | [Models और APIs](https://www.sandbase.ai/models) | [Build Agent](/agents/) |

::: tip एक SandBase API key
एक ही API key से Models, APIs और Agents call किए जा सकते हैं। Keys को server पर रखें और browser code में कभी expose न करें।
:::

## मुख्य अवधारणाएँ {#core-concepts}

### Models और APIs {#models-and-apis}

Language, image, video और audio workloads के लिए Models का उपयोग करें। जब application को external data या actions चाहिए, तो APIs का उपयोग करें। SandBase website का catalog उपलब्ध capabilities, pricing, input schemas और काम करने वाले examples दिखाता है।

- [Models देखें](https://www.sandbase.ai/models)
- [APIs देखें](https://www.sandbase.ai/apis)
- [अपनी पहली API call करें](/getting-started/first-call)
- [API Reference खोलें](/api-reference/)

### Agents {#agents}

Agent एक reusable, versioned configuration है जिसमें एक Model, instructions, Skills और MCP connections होते हैं। इसे एक बार परिभाषित करें, फिर Sessions में चलाएँ।

- [Agents को समझें](/agents/)
- [Agent परिभाषित करें](/agents/agent-api)
- [Skills और MCP tools जोड़ें](/agents/mcp-tools)

### सेशन {#sessions}
Session एक Agent version चलाता है। इसे `POST /v1/agents/sessions` से बनाएँ, input भेजें, events stream करें, और बाद में पूरी conversation पढ़ें।

- [Sessions guide](/agents/sessions)
- [Sessions API](/api-reference/sessions/)

## पहले कदम {#first-steps}

1. एक organization और [API key](/getting-started/api-keys) बनाएँ।
2. [Catalog](https://www.sandbase.ai/models) से कोई Model, API या Agent चुनें।
3. सीधी request करें, या कोई Agent परिभाषित करके test करें।
4. Test किए गए Agent को अपने application से Sessions में चलाएँ।
5. Console में Sessions, errors, latency और cost की समीक्षा करें।

## संचालन संबंधी मार्गदर्शन {#operational-guidance}

- [Streaming responses](/guides/streaming)
- [Error handling और retries](/guides/error-handling)
- [Rate limiting](/guides/rate-limiting)
- [Billing और pricing](/guides/billing)
- [Workspace administration](/admin/)

## अगले कदम {#next-steps}

- Local Skills के साथ बनाना: [Skill tutorials](/guides/skills/)

- SandBase में नए हैं: [Getting started](/getting-started/)
- Model या API call करना: [Models catalog](https://www.sandbase.ai/models) और [APIs catalog](https://www.sandbase.ai/apis)
- Inference और Agent APIs: [API Reference](/api-reference/)
- Reusable काम बनाना: [Build Agent](/agents/)
- AI tool connect करना: [Setup](/setup/)

