---
i18nSource: a86346e2696c732c
title: अक्सर पूछे जाने वाले प्रश्न
description: AI tools connect करने, SandBase catalog, Models, APIs, Agents, Sessions और billing के बारे में अक्सर पूछे जाने वाले प्रश्न।
---

# अक्सर पूछे जाने वाले प्रश्न {#frequently-asked-questions}

## SandBase क्या है? {#what-is-sandbase}

SandBase, Agents को असली दुनिया से जुड़ने में मदद करता है।

आप तैयार Models और APIs इस्तेमाल कर सकते हैं, AI tools में connect करने के बाद उन्हें अपने AI tools से इस्तेमाल कर सकते हैं, या दोबारा इस्तेमाल योग्य Agents बनाकर उन्हें Sessions में चला सकते हैं।

## SandBase किसके लिए है? {#who-is-sandbase-for}

SandBase मुख्य रूप से तीन समूहों के लिए है:

- **AI tool users**, जो Codex, Claude, Cursor या Kiro के अंदर उपयोगी capabilities चाहते हैं
- **builders**, जो Models और APIs को सीधे call करना चाहते हैं
- **FDEs और teams**, जो customers या internal workflows के लिए दोबारा इस्तेमाल योग्य Agents बनाते हैं

## Capabilities कहाँ देखें? {#where-do-i-browse-capabilities}
SandBase website पर capabilities का catalog है:

- [Models](https://www.sandbase.ai/models) और [image तथा video models](https://www.sandbase.ai/models/image-video)
- [APIs](https://www.sandbase.ai/apis)
- [Agents](https://www.sandbase.ai/agents)
- [Skills](https://www.sandbase.ai/skills)
Capability के प्रकार के अनुसार आप उसे inspect, test, install, call या clone कर सकते हैं।

## AI tools क्या है? {#what-is-ai-tools}

Console में **Build → AI tools**, SandBase को उस AI tool से connect करता है जिसे आप पहले से इस्तेमाल करते हैं, जैसे Claude Code, Codex, Cursor या Kiro। अपने agent में `set up https://www.sandbase.ai/SKILL.md` paste करें, या `npx -y @sandbaseai/cli@latest connect` चलाएँ। Connected tool, SandBase के Models और APIs catalog को search और run कर सकता है, और इसका bill आपके workspace पर आता है। [AI tools connect करें](/setup/) देखें।

## Build Agent क्या है? {#what-is-build-agent}

Build Agent वह जगह है जहाँ आप Agent परिभाषित और test करते हैं।

Agent, instructions, एक Model, Skills और MCP tools को एक दोबारा इस्तेमाल योग्य, versioned workflow में जोड़ता है।

## क्या Agent, API से अलग है? {#is-an-agent-different-from-an-api}
हाँ। Agent एक versioned configuration है जिसे आप edit और test करते हैं, और Session बनाकर उसे चलाते हैं। जब आप Agent को edit करते रहते हैं, तब भी आपका app [Sessions API](/api-reference/sessions/) से Sessions बना सकता है।

## Sessions क्या हैं? {#what-are-sessions}
Session किसी Agent का एक execution है, जिसमें उसकी conversation, tool activity और output शामिल होते हैं।

## Agent को external APIs तक पहुँच कैसे दें? {#how-do-i-give-an-agent-access-to-external-apis}

External system को MCP server के रूप में connect करें और उसे Agent के MCP connections में जोड़ें। अगर server को Bearer token चाहिए, तो उसे [Secrets API](/agents/api-credentials#with-the-api) से उस server URL से बंधे write-only Secret के रूप में store करें। Tokens केवल उसी server को भेजे जाते हैं और कभी prompts या Agent runtime में दिखाई नहीं देते। [MCP tools के लिए credentials](/agents/api-credentials) देखें।

## Models कहाँ मिलते हैं? {#where-do-models-live}

Models का अपना [catalog](https://www.sandbase.ai/models) है, क्योंकि वे महत्वपूर्ण building blocks हैं।

आप किसी Model को सीधे call कर सकते हैं, connected AI tool से इस्तेमाल कर सकते हैं, या Agent के अंदर इस्तेमाल कर सकते हैं।

## क्या मुझे code लिखना होगा? {#do-i-need-to-write-code}

हमेशा नहीं।

अगर आप बिना code लिखे अपने AI tool के अंदर capabilities चाहते हैं, तो [अपना AI tool connect करें](/setup/)।

अगर आप अपने application से SandBase को call करना चाहते हैं, तो API Reference का उपयोग करें।

अगर आप दोबारा इस्तेमाल योग्य multi-step काम चाहते हैं, तो Build Agent का उपयोग करें।

## API key कैसे मिलेगी? {#how-do-i-get-an-api-key}

Console खोलें, **Developer → API Keys** पर जाएँ, और **New key** चुनें।

Key को इस तरह इस्तेमाल करें:

```http
Authorization: Bearer sk-YOUR_KEY
```

## Billing कैसे काम करती है? {#how-does-billing-work}

SandBase credits और usage-based billing का उपयोग करता है।

Models, APIs, Agents और runtime काम की लागत अलग-अलग हो सकती है। वर्तमान usage और pricing के लिए Console देखें।

## अगले कदम {#next-steps}

- [शुरुआत करें](/getting-started/)
- [Models और APIs catalog](https://www.sandbase.ai/models)
- [AI tools connect करें](/setup/)
- [Build Agent](/agents/)
- [API Reference](/api-reference/)
