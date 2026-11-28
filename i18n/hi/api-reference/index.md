---
i18nSource: 071e97a48f9c4f4c
title: API संदर्भ
description: SandBase models को call करें और Agents, Sessions, Skills, MCP connections, Secrets और account resources मैनेज करें।
---

# API संदर्भ {#api-reference}

API से models को सीधे call करें, या दोबारा इस्तेमाल होने वाले Agents बनाएं, उन्हें Sessions में run करें, और उन्हें Skills और MCP tools से जोड़ें।

::: tip Model inference ढूंढ रहे हैं?
Inference contracts (Chat Completions, Responses, Anthropic Messages, Gemini, Images और Seedance video) इस reference के **Model inference** सेक्शन में हैं। हर model के अपने fields और कीमतें [Models catalog](https://www.sandbase.ai/models) में उसके पेज पर हैं।
:::

## शुरुआत कहां से करें {#choose-a-starting-point}

| लक्ष्य | शुरुआत | आगे क्या होता है |
|---|---|---|
| दोबारा इस्तेमाल होने वाला व्यवहार तय करें | [Agents](/api-reference/agents/) | Agent configuration बनाएं और उसके versions रखें |
| Agent को सीधे run करें | [Sessions](/api-reference/sessions/) | Input भेजें, events stream करें और history पढ़ें |
| Instruction bundles दोबारा इस्तेमाल करें | [Skills](/api-reference/skills/) | Versioned ZIP bundles upload करें और उन्हें Agents से जोड़ें |
| External tools call करें | [MCP Connections](/api-reference/mcp-connections/) | Agents के लिए remote HTTPS MCP servers register करें |
| External tools को authenticate करें | [Secrets](/agents/api-credentials#with-the-api) | MCP connections के लिए write-only Bearer tokens स्टोर करें |

## संसाधन जीवनचक्र {#resource-lifecycle}

```text
Agent + version ─── direct ──→ Session ─→ events, items, turns
Agent ─ skills[] → Skill version      Agent ─ mcp_connections[] → MCP connection ─ secret_id → Secret
```

- **Agent** (`agt_`) एक सेव किया गया, versioned configuration है; इसे बनाने से यह execute नहीं होता।
- **Session** (`ses_`) एक Agent version को run करता है और उसके Skills और MCP connections को freeze करता है। Session paths `/v1/agents/sessions` के अंदर हैं।
- **Skill** (`skl_`) एक versioned instruction bundle है। **MCP connection** (`mcp_`) एक remote tool server register करता है, और **Secret** (`sec_`) उसका Bearer token स्टोर करता है।

## Agents platform resources के नियम {#conventions-for-agents-platform-resources}

Agents, Sessions, Skills, MCP connections और Secrets `https://api.sandbase.ai/v1` के अंदर उपलब्ध हैं और ये नियम साझा करते हैं:

- `Authorization: Bearer` या `X-API-Key` से authenticate करें। [Authentication](/api-reference/authentication#agents-platform-resources) देखें।
- Request bodies अधिकतम 1 MiB की strict JSON होती हैं; अनजान fields पर 400 लौटता है।
- MCP connections या Secrets बनाने वाले writes के लिए `Idempotency-Key` ज़रूरी है। बाकी writes इसे स्वीकार करते हैं।
- Optimistic concurrency `row_version` इस्तेमाल करती है: आख़िरी बार पढ़ा गया मान भेजें, और 409 मिलने पर फिर से पढ़ें।
- Agents, Sessions, items, turns और Skills cursor pagination इस्तेमाल करते हैं (`limit`, `after`, `order`; responses में `has_more` और `last_id` होते हैं)। Agent versions, attachments, MCP connections और Secrets offset pagination इस्तेमाल करते हैं (`limit`, `offset`; responses में `total` होता है)।
- Errors `{"error": {"type", "code", "param", "message"}}` इस्तेमाल करते हैं। [Agents platform errors](/api-reference/errors#agents-platform-errors) देखें।

## प्रमाणीकरण {#authentication}

SandBase API key को Bearer token के रूप में भेजें:

```http
Authorization: Bearer sk-YOUR_KEY
```

Key को एक opaque secret मानें, इसे server पर रखें, और कभी browser code या logs में शामिल न करें। Compatibility की जानकारी के लिए [Authentication](/api-reference/authentication) और public error envelopes के लिए [Errors](/api-reference/errors) देखें।

## Organization और usage {#organization-and-usage}

Platform resources उस organization के होते हैं जो API key से जुड़ा है। सपोर्टेड बैलेंस और हाल की execution history देखने के लिए [Account API](/api-reference/account/) इस्तेमाल करें। जब तक यहां कोई public endpoint documented न हो, organization administration और billing management Console में ही होते हैं।

## संदर्भ फ़ॉर्मेट {#reference-formats}

- उदाहरणों और response की जानकारी के लिए sidebar से operations ब्राउज़ करें।
- Machine-readable [OpenAPI specification](/openapi.yaml) डाउनलोड करें।
- सटीक request fields के लिए [Models catalog](https://www.sandbase.ai/models) में model का पेज या [APIs catalog](https://www.sandbase.ai/apis) में API का पेज खोलें।

## अगले कदम {#next-steps}

- Managed Agents में नए हैं: [Build Agent](/agents/)
- Model को सीधे call करें: [Chat Completions](/api-reference/llm-gateway) या [Models catalog](https://www.sandbase.ai/models)
