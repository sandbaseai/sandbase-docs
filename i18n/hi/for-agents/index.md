---
i18nSource: 0314b37a870481ae
title: AI के पढ़ने योग्य डॉक्यूमेंटेशन
description: SandBase API को खोजने और इस्तेमाल करने के लिए AI agent को जो कुछ चाहिए — एक page का सारांश।
---

# AI-अनुकूल API अवलोकन {#ai-friendly-api-overview}

::: info Session contract
Session (`ses_*`) एक saved Agent version चलाता है; इसे सीधे `POST /v1/agents/sessions` से बनाएँ। Runtime instances internal रहते हैं और कभी लौटाए नहीं जाते।
:::

> इंसानों और AI agents दोनों के लिए एक संक्षिप्त reference। LLM ingestion के लिए optimized plain-text versions के लिए [`llms.txt`](https://www.sandbase.ai/docs/llms.txt) देखें।

## SandBase क्या है? {#what-is-sandbase}

SandBase एक AI agent infrastructure platform है। एक API key से language, image, video, audio, search और data के enabled Models और APIs, साथ ही Agent workflows तक पहुँचा जा सकता है। किसी तय संख्या पर निर्भर रहने के बजाय वर्तमान catalog खोजें।

## API बेस URL {#api-base-url}

```
https://api.sandbase.ai/v1
```

## प्रमाणीकरण {#authentication}

सभी requests के लिए Bearer token आवश्यक है:

```
Authorization: Bearer sk-YOUR_KEY
```

अपनी key [Developer → API Keys](https://www.sandbase.ai/console/keys) पर पाएँ।

## त्वरित उदाहरण {#quick-example}

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## मुख्य API {#core-apis}

| Method | Route | विवरण |
|--------|----------|-------------|
| `POST` | `/v1/chat/completions` | OpenAI-compatible chat; वैकल्पिक capabilities चुने गए model पर निर्भर करती हैं |
| `POST` | `/v1/messages` | Anthropic-compatible messages API |
| `POST` | `/v1/run` | Model-specific schema के साथ model generation submit करें |
| `GET` | `/v1/run/{id}` | Async generation status poll करें और results प्राप्त करें |
| `GET` | `/v1/models` | Enabled logical models की सूची; default रूप से LLM type |
| `GET` | `/v1/models/{id_or_name}` | Model details, schema, capabilities और pricing प्राप्त करें |
| `GET` | `/v1/tasks/{task_id}/cost` | Task की लागत और usage प्राप्त करें |

## अतिरिक्त API Groups {#additional-api-groups}

Core generation APIs के अलावा, SandBase agent lifecycle management के लिए APIs देता है। सामान्य workflows के लिए [AI API Guide](./full) और पूरे contract के लिए [OpenAPI specification](https://www.sandbase.ai/docs/openapi.yaml) देखें।

| Group | मुख्य routes | उद्देश्य |
|-------|---------------|---------|
| **Agents** | `POST /v1/agents`, `GET /v1/agents`, `POST /v1/agents/{agent_id}` | Saved Agent definitions बनाएँ और उनके versions रखें |
| **Sessions** | `POST /v1/agents/sessions`, `POST /v1/agents/sessions/{session_id}/events`, `GET /v1/agents/sessions/{session_id}/events` | Agent चलाएँ, input भेजें और live events stream करें |
| **Skills** | `POST /v1/skills`, `GET /v1/skills` | Versioned instruction bundles जिन्हें Agents mount करते हैं |
| **MCP Connections और Secrets** | `POST /v1/mcp-connections`, `POST /v1/secrets` | Remote HTTPS MCP tools और उनके write-only Bearer tokens |

Agents platform resources `Authorization: Bearer` या `X-API-Key` स्वीकार करते हैं और failure पर `{"error":{"type","code","param","message"}}` लौटाते हैं।

## मूल्य निर्धारण मॉडल {#pricing-model}

जितना इस्तेमाल, उतना भुगतान। Pricing model-specific है और इस page से स्वतंत्र रूप से बदल सकती है:

- **Model pricing**: चुने गए model का वर्तमान formula और units `model_card` से पढ़ें
- **Token pricing**: model द्वारा घोषित होने पर इसमें input, output, cache या reasoning components शामिल हो सकते हैं
- **Media और अन्य operations**: per-request, duration, resolution या अन्य model-specific units का उपयोग कर सकते हैं
- **Data APIs** (search, social, scraping, e-commerce, finance): हर organization को प्रति UTC दिन 100 मुफ़्त calls मिलती हैं, जो योग्य data APIs में साझा होती हैं; उसके बाद calls रोकी नहीं जातीं, बल्कि प्रति call bill होती हैं। MCP में, योग्य tools `sandbase_inspect` में `pricing.free_quota` दिखाते हैं, और `sandbase_account` `free_api_quota` (`daily_limit`, `used_today`, `remaining`, `resets_at`) लौटाता है। [Daily free API calls](/guides/billing#daily-free-api-calls) देखें।

`GET /v1/models` से वर्तमान model ID खोजें, फिर request भेजने से पहले `GET /v1/models/{id_or_name}` inspect करें। यह न मानें कि pricing या cache discounts सभी providers में एक जैसे हैं।

जब कोई operation task ID लौटाए, तो उसकी दर्ज लागत inspect करें:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

## रेट लिमिट {#rate-limits}

कोई प्रकाशित सार्वभौमिक numeric default नहीं है। Requests पर एक वैकल्पिक requests-per-minute limit लागू हो सकती है, जो आपके organization को दी जाती है और उसकी सभी API keys में साझा होती है। `429` response में quota या `Retry-After` headers नहीं होते; jitter के साथ सीमित exponential backoff का उपयोग करें। [Error Guide](./errors) देखें।

---

## आगे पढ़ें {#further-reading}

- [AI API Guide](./full) — core workflows, request/response shapes और curl examples
- [Models और Pricing](./models) — live model discovery, pricing और capability मार्गदर्शन
- [Error Guide](./errors) — documented response shapes, HTTP handling और retry safety
- [OpenAPI Spec](https://www.sandbase.ai/docs/openapi.yaml) — machine-readable OpenAPI 3.1

## Plain-Text Versions (AI agents के लिए) {#plain-text-versions-for-ai-agents}

| File | URL | Content |
|------|-----|---------|
| `llms.txt` | [/docs/llms.txt](https://www.sandbase.ai/docs/llms.txt) | संक्षिप्त सारांश (~60 lines) |
| `llms-full.txt` | [/docs/llms-full.txt](https://www.sandbase.ai/docs/llms-full.txt) | विस्तृत AI-oriented API guide |
| `openapi.yaml` | [/docs/openapi.yaml](https://www.sandbase.ai/docs/openapi.yaml) | OpenAPI 3.1 machine-readable spec |
