---
i18nSource: 3dc57d405dbf561d
title: API कुंजियाँ
description: API requests को authenticate करने के लिए अपनी SandBase API keys बनाने, मैनेज करने और सुरक्षित रखने का तरीका।
---

# API कुंजियाँ {#api-keys}

API keys, SandBase को भेजे गए आपके requests को authenticate करती हैं। यह गाइड बताती है कि keys कैसे बनाएं, requests में उनका इस्तेमाल कैसे करें, और उन्हें सुरक्षित कैसे रखें।

## API key बनाएं {#create-an-api-key}

1. [SandBase Console](https://www.sandbase.ai/console) में लॉग इन करें
2. **Developer → API Keys** खोलें (या सीधे [API Keys](https://www.sandbase.ai/console/keys) पर जाएं)
3. **New key** पर क्लिक करें
4. एक स्पष्ट **Name** डालें (जैसे "Production Server", "Local Development")
5. चाहें तो **Spending limit** (खाली छोड़ने पर असीमित) और **Expires** तारीख (खाली छोड़ने पर कोई expiry नहीं) सेट करें
6. **Create key** पर क्लिक करें
7. **API key created** बैनर से key तुरंत कॉपी करें — यह सिर्फ़ एक बार दिखाई जाएगी

::: danger ज़रूरी
आपकी API key सिर्फ़ बनाते समय एक बार दिखाई जाती है। अगर यह खो जाए, तो आपको नई key बनानी होगी। Dialog बंद करने से पहले इसे सुरक्षित जगह स्टोर करें।
:::

## Key का format {#key-format}

Console में बनाई गई नई API keys में `sk-` prefix के बाद 64 hexadecimal अक्षर होते हैं:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

मौजूदा `sk-sb-...` keys expire या revoke होने तक मान्य रहती हैं। Credential को validate करने के लिए सिर्फ़ prefix का
इस्तेमाल न करें; पूरे मान को हमेशा एक opaque secret मानें।

## Authentication के तरीके {#authentication-methods}

SandBase requests में API key भेजने के दो तरीके सपोर्ट करता है:

### Authorization Header (सुझाया गया) {#authorization-header-recommended}

मानक `Authorization: Bearer` header इस्तेमाल करें। यह OpenAI और Anthropic SDKs के साथ compatible है:

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek/deepseek-v4-flash", "messages": [{"role": "user", "content": "Hi"}]}'
```

### Anthropic Messages: x-api-key हेडर {#anthropic-messages-x-api-key-header}

`POST /v1/messages` native Anthropic `x-api-key` header भी स्वीकार करता है:

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "x-api-key: sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "anthropic/claude-sonnet-5", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hi"}]}'
```

::: tip
Model gateways में सिर्फ़ `POST /v1/messages` ही `x-api-key` पढ़ता है, और दोनों सपोर्टेड headers मौजूद होने पर इसे प्राथमिकता मिलती है।
[Agents platform resources](/api-reference/authentication#agents-platform-resources) भी
`X-API-Key` स्वीकार करते हैं। बाकी हर public endpoint के लिए Bearer header इस्तेमाल करें।
:::

## Key की permissions {#key-permissions}

SandBase API keys का scope **organization level** पर होता है:

- Console में बनाई गई मानक key, organization के लिए उपलब्ध public API resources को call कर सकती है
- Usage का बिल उस organization को जाता है जिसकी key है
- Key में वैकल्पिक expiration और खर्च सीमा हो सकती है
- SandBase द्वारा जारी credentials, जैसे CLI Login keys, में सीमित scope हो सकता है और उस scope के बाहर वे `403` लौटाते हैं

Console फ़िलहाल मानक key के लिए user द्वारा चुने जाने वाले scopes नहीं दिखाता। CLI Login keys तब बनती हैं जब आप कोई AI tool कनेक्ट करते हैं। API Keys पेज इन्हें एक expandable **CLI Login** पंक्ति में समूहित करता है, और इन्हें मानक keys की तरह edit नहीं किया जा सकता। SandBase द्वारा आपके लिए बनाई गई keys पर **Auto-created** badge होता है; इनकी कोई key-level सीमा नहीं होती और ये अकाउंट बैलेंस से बंधी होती हैं।

Key list में हर key के लिए **Name**, **Key Prefix**, **Spent**, **Limit**, **Expires** और **Status** दिखते हैं। मानक key का नाम, खर्च सीमा या expiration बदलने के लिए **Edit** इस्तेमाल करें।

हर key को निजी password के बजाय application credential मानें। लोगों की पहुंच के लिए organization membership और workloads के लिए API keys इस्तेमाल करें।

## Environment की रणनीति {#environment-strategy}

हर application और environment के लिए अलग key बनाएं:

| Key | उदाहरण नाम | क्यों |
|---|---|---|
| Local development | `research-app-dev` | Production को बाधित किए बिना rotate करें |
| Staging | `research-app-staging` | Test usage और incidents को अलग रखें |
| Production | `research-app-production` | Production को स्पष्ट owner और सीमित exposure दें |
| अस्थायी automation | `release-check-2026-08` | Expiration सेट करें और अलग से revoke करें |

हर key का owner और उसे इस्तेमाल करने वाला deployment दर्ज करें। Rotation के दौरान नई key deploy करें, सफल requests की पुष्टि करें, और उसके बाद ही पुरानी key revoke करें।

## Key का expiration और revocation {#key-expiration-and-revocation}

### समाप्ति {#expiration}

Key बनाते समय आप चाहें तो expiration तारीख सेट कर सकते हैं। Expire होने के बाद key काम करना बंद कर देती है और requests `401 Unauthorized` error लौटाते हैं।

बिना expiration तारीख वाली keys तब तक मान्य रहती हैं जब तक उन्हें manually revoke न किया जाए।

### Key revoke करना {#revoking-a-key}

किसी key को revoke (disable) करने के लिए:

1. [Developer → API Keys](https://www.sandbase.ai/console/keys) पर जाएं
2. वह key ढूंढें जिसे आप revoke करना चाहते हैं
3. **Revoke** पर क्लिक करें
4. पुष्टि करें

Revoked keys नए requests को authenticate नहीं कर सकतीं। Revocation वापस नहीं लिया जा सकता — गलती से revoke करने पर नई key बनाएं।

## सुरक्षा के best practices {#security-best-practices}

### Keys को कभी version control में commit न करें {#never-commit-keys-to-version-control}

इसके बजाय environment variables या secrets manager इस्तेमाल करें:

```bash
# .env file (add to .gitignore!)
SANDBASE_API_KEY=sk-your-key-here
```

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

### अलग-अलग environments के लिए अलग keys इस्तेमाल करें {#use-separate-keys-for-different-environments}

Development, staging और production के लिए अलग-अलग keys बनाएं। इससे आप production पर असर डाले बिना compromised development key को revoke कर सकते हैं।

### Keys को नियमित रूप से rotate करें {#rotate-keys-regularly}

समय-समय पर नई keys बनाएं और पुरानी keys हटाएं। इससे key लीक होने पर exposure की अवधि सीमित रहती है।

### Activity पर नज़र रखें {#monitor-activity}

अप्रत्याशित request या usage spikes के लिए **Developer → Activities** नियमित रूप से देखें, क्योंकि ये compromised key का संकेत हो सकते हैं। **Request History** को API key के आधार पर filter किया जा सकता है।

अगर कोई key उजागर हो जाए, तो उसे तुरंत revoke करें, नई key बनाएं, उसे इस्तेमाल करने वाली application अपडेट करें, और अप्रत्याशित usage के लिए Activities और billing जांचें। तय rotation का इंतज़ार न करें।

### Expiration तारीखें सेट करें {#set-expiration-dates}

अस्थायी पहुंच (CI/CD pipelines, contractor access, demos) के लिए expiration तारीख सेट करें ताकि key अपने आप काम करना बंद कर दे।

## समस्या निवारण {#troubleshooting}

| Error | कारण | समाधान |
|-------|-------|-----|
| `401 - missing API key` | Request में कोई key नहीं दी गई | `Authorization: Bearer <key>` header जोड़ें |
| `401 - invalid API key` | Key मौजूद नहीं है | Typos जांचें और पक्का करें कि पूरी key शामिल है |
| `401 - API key has been revoked` | Key को Console में स्थायी रूप से revoke किया गया | नई key बनाएं |
| `401 - API key has expired` | Key की expiration तारीख निकल गई | नई key बनाएं या expiration बढ़ाएं |
| `402 - API key spending limit exceeded` | Key अपनी कॉन्फ़िगर की गई खर्च सीमा तक पहुंच गई | सीमा बढ़ाएं या कोई दूसरी अधिकृत key इस्तेमाल करें |
| `403 - insufficient_scope` | Scoped credential इस endpoint को call नहीं कर सकता | इस endpoint के लिए अधिकृत key इस्तेमाल करें |

## अगले कदम {#next-steps}

- [**First API Call**](/getting-started/first-call) — पूरे request/response walkthrough के साथ विस्तृत API call करें
- [**Authentication**](/api-reference/authentication) — सपोर्टेड headers, lifecycle और protocol-specific errors
- [**API Reference**](/api-reference/) — सभी endpoints का पूरा documentation
