---
i18nSource: 5b94f91222d138de
title: API प्रमाणीकरण
description: Bearer tokens और समर्थित protocol-compatible API key headers से SandBase APIs को authenticate करें।
---

# प्रमाणीकरण {#authentication}

SandBase public API requests को authenticate करने के लिए API keys का इस्तेमाल करता है। यह पेज समर्थित integration तरीकों और
key-management के तरीकों को बताता है। Console authentication और उसके internal APIs public API contract का हिस्सा नहीं हैं।

## Authentication के तरीके {#authentication-methods}

Standard SandBase `/v1/*` endpoints के लिए Bearer token ज़रूरी है। Anthropic Messages और Google Gemini-compatible operations अपने native SDK-compatible API key स्थानों को भी स्वीकार करते हैं।

### Bearer टोकन {#bearer-token}

Key को `Authorization` header में शामिल करें:

```http
Authorization: Bearer sk-your-api-key
```

यह OpenAI-compatible SDKs द्वारा इस्तेमाल किया जाने वाला standard तरीका है।

### Anthropic Messages: x-api-key हेडर {#anthropic-messages-x-api-key-header}

Key को `x-api-key` header में शामिल करें:

```http
x-api-key: sk-your-api-key
```

यह header केवल `POST /v1/messages` द्वारा समर्थित है। अन्य public endpoints इसे नहीं पढ़ते; Chat Completions, `/v1/run` और resource APIs के लिए Bearer
authentication इस्तेमाल करें।

### प्राथमिकता {#priority}

केवल `POST /v1/messages` के लिए, दोनों headers मौजूद होने पर `x-api-key` को प्राथमिकता मिलती है।

### Google Gemini-संगत API कुंजियाँ {#google-gemini-compatible-api-keys}

Gemini GenerateContent और Interactions operations `x-goog-api-key`, `Authorization: Bearer …`, या `key` query parameter को इसी प्राथमिकता क्रम में स्वीकार करते हैं। Header को प्राथमिकता दें, क्योंकि query-string credentials logs और browser history में दिख सकते हैं। समर्थित paths के लिए [Google Gemini](/api-reference/gemini-generate-content) और [Gemini Interactions](/api-reference/gemini-interactions) देखें।

### निष्कर्षण तर्क {#extraction-logic}

Standard endpoints केवल `Authorization: Bearer <key>` पढ़ते हैं। Anthropic Messages middleware पहले `x-api-key`
पढ़ता है और फिर Bearer header पर जाता है। Agents platform resources `Authorization: Bearer` या
`X-API-Key` स्वीकार करते हैं (नीचे देखें)। [webhook Events API](/api-reference/webhooks) (`/events/webhooks*`) भी दोनों में से कोई भी
header स्वीकार करता है और दोनों मौजूद होने पर Bearer header इस्तेमाल करता है। समर्थित credential न होने पर `401 Unauthorized` मिलता है।

### Agents प्लेटफ़ॉर्म संसाधन {#agents-platform-resources}

`/v1/agents*` (`/v1/agents/sessions*` सहित), `/v1/mcp-connections*`, `/v1/secrets*`
और `/v1/skills*` key को इनमें से किसी भी header में स्वीकार करते हैं:

```bash
curl https://api.sandbase.ai/v1/agents \
  -H "X-API-Key: $SANDBASE_API_KEY"
```

- अगर `Authorization: Bearer` और `X-API-Key` दोनों भेजे जाते हैं, तो दोनों में एक ही key होनी चाहिए; अलग मानों पर `401 unauthorized` मिलता है। किसी भी header को दोहराने पर भी 401 मिलता है।
- `OpenAI-Beta` वैकल्पिक है। अगर मौजूद है, तो यह `agents=v1` होना चाहिए।
- Read requests के लिए `agents.read` permission और writes के लिए `agents.write` चाहिए। Console से बनी standard keys में दोनों होती हैं। Scoped SandBase-issued keys, जैसे CLI Login keys, `403 insufficient_scope` लौटाती हैं।
- `402 spending_limit_exceeded` का अर्थ है कि key की खर्च सीमा या organization का balance समाप्त हो गया है।
- Failures [Agents error envelope](/api-reference/errors#agents-platform-errors) का इस्तेमाल करते हैं, नीचे दिखाए गए flat `{"error": "…"}` रूप का नहीं।

## API कुंजी का फ़ॉर्मेट {#api-key-format}

Console से बनी नई API keys का format यह है:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| हिस्सा | विवरण |
|-----------|-------------|
| `sk-` | Standard "secret key" prefix |
| `xxxx...` | 32 random bytes से बने 64 hexadecimal characters |

पुरानी `sk-sb-...` keys expire या revoke होने तक इस्तेमाल की जा सकती हैं। Clients को keys को opaque strings मानना चाहिए,
न कि prefix या length के आधार पर किसी credential को अस्वीकार करना चाहिए।

::: warning
अपनी API key को कभी भी client-side code, public repositories या logs में उजागर न करें। इसे password की तरह रखें।
:::

## API keys बनाएँ {#create-api-keys}

### Console के ज़रिए {#via-console}

1. [SandBase Console](https://www.sandbase.ai/console) में log in करें
2. **Developer → API Keys** खोलें
3. **New key** पर click करें
4. Key को एक वर्णनात्मक नाम दें (जैसे "Production Backend", "Development")
5. Key को तुरंत copy करें — यह दोबारा नहीं दिखाई जाएगी

### कुंजी के गुण {#key-properties}

| Property | विवरण |
|----------|-------------|
| Name | पहचान के लिए पढ़ने योग्य label |
| Organization | वह org जिससे यह key संबंधित है |
| Enabled | Key active है या नहीं |
| Spending Limit | प्रति key वैकल्पिक खर्च सीमा |
| Expires At | वैकल्पिक expiration तारीख |
| Created At | Key कब बनाई गई |

Console से बनी standard keys documented public API के लिए organization-level access का इस्तेमाल करती हैं। SandBase-issued credentials, जैसे CLI Login keys, सीमित scope रख सकते हैं। Console standard keys के लिए user द्वारा चुने जाने वाले scopes नहीं देता।

## कुंजी का जीवनचक्र {#key-lifecycle}

### रोटेशन {#rotation}

Key rotate करने के लिए:

1. Console में नई key बनाएँ
2. अपनी application को नई key इस्तेमाल करने के लिए update करें
3. पुष्टि करें कि नई key production में काम करती है
4. पुरानी key revoke करें

::: tip
Downtime से बचने के लिए हमेशा पुरानी key revoke करने से पहले नई key बनाएँ।
:::

### रद्दीकरण {#revocation}

Revoke की गई keys नए requests authenticate नहीं कर सकतीं। API इस message के साथ `401 Unauthorized` लौटाता है:

```json
{"error":"API key has been revoked"}
```

### समाप्ति {#expiration}

Keys की वैकल्पिक रूप से expiration तारीख हो सकती है। Expired keys इस message के साथ `401 Unauthorized` लौटाती हैं:

```json
{"error":"API key has expired"}
```

## Endpoints की authentication ज़रूरतें {#endpoint-authentication-requirements}

| Endpoint | Auth तरीका | विवरण |
|----------|-------------|-------------|
| `POST /v1/chat/completions` | API Key (Bearer) | Chat Completions |
| `POST /v1/responses` | API Key (Bearer) | OpenAI-compatible Responses API |
| `POST /v1/messages` | API Key (Bearer या x-api-key) | Anthropic Messages |
| `/v1beta/models/*` | API Key (x-goog-api-key, Bearer या query key) | Gemini GenerateContent |
| `/v1beta/interactions*` | API Key (x-goog-api-key, Bearer या query key) | Gemini Interactions |
| `/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*` | API Key (Bearer या X-API-Key) | Agents platform resources |

SandBase Console एक अलग browser authentication flow इस्तेमाल करता है। उसके internal requests समर्थित public
endpoints नहीं हैं और integrations को उनका इस्तेमाल नहीं करना चाहिए।

## संगठन आइसोलेशन {#organization-isolation}

API keys एक organization तक सीमित होती हैं। जब आप किसी key से authenticate करते हैं:

- आप केवल अपनी organization के resources तक पहुँच सकते हैं
- Usage और बिलिंग प्रति organization track किए जाते हैं

## त्रुटि प्रतिक्रियाएँ {#error-responses}

| HTTP Status | Message | कारण |
|-------------|---------|-------|
| 401 | `missing API key in Authorization header` | कोई key नहीं दी गई |
| 401 | `invalid API key` | Key database में नहीं मिली |
| 401 | `API key has been revoked` | Key disable कर दी गई थी |
| 401 | `API key has expired` | Key की expiration तारीख निकल चुकी है |
| 402 या protocol-specific 403 | `API key spending limit exceeded` | Key-level खर्च सीमा पूरी हो गई; endpoint का documented error contract देखें |
| 403 | `API key is not authorized for this endpoint` | Scoped key का इस्तेमाल उसके scope से बाहर के endpoint पर हुआ |

ये messages flat `{"error":"<message>"}` body में आते हैं, `403` scope errors को छोड़कर। Model और account
endpoints पर वे `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}` इस्तेमाल करते हैं;
Agents platform resources पर वे `code` `insufficient_scope` के साथ [Agents error envelope](/api-reference/errors#agents-platform-errors)
इस्तेमाल करते हैं।

## सुरक्षा के best practices {#security-best-practices}

### करें {#do}

- **Keys को environment variables में store करें** — Source code में keys कभी hardcode न करें
- **हर environment के लिए अलग keys इस्तेमाल करें** — dev, staging, production के लिए अलग keys
- **Expiration तारीखें सेट करें** — अपनी security policy के अनुसार rotation interval चुनें
- **Usage पर नज़र रखें** — अप्रत्याशित activity के लिए Console जाँचें
- **Standard keys केवल उन workloads के लिए इस्तेमाल करें जिन्हें public API access चाहिए** — Scoped CLI Login credentials को उनके managed flow में ही रखें

### न करें {#don-t}

- **Keys को version control में commit न करें** — `.env` को `.gitignore` में जोड़ें
- **असंबंधित applications में एक ही key share न करें** — अलग keys से rotation और incident response ज़्यादा सुरक्षित होते हैं
- **Client-side code में keys उजागर न करें** — हमेशा अपने backend के ज़रिए proxy करें
- **API keys को log न करें** — Application logs में keys redact करें

### Environment variable का उदाहरण {#environment-variable-example}

::: code-group

```bash [.env]
SANDBASE_API_KEY=sk-your-api-key
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

:::

## Key के अनुसार rate limiting {#rate-limiting-by-key}

Request limits प्रति organization तय होती हैं और उसकी सभी API keys में साझा होती हैं, इसलिए ज़्यादा keys बनाने से
limit नहीं बढ़ती। API कोई सार्वभौमिक numeric
default या remaining-quota headers प्रकाशित नहीं करता।

Limits और 429 responses को संभालने के विवरण के लिए [Rate Limiting](/guides/rate-limiting) देखें।
