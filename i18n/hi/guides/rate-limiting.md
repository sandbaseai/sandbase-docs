---
i18nSource: d326fdb78ea64bdf
title: रेट लिमिट
description: सीमित retries, jitter, queues और idempotency का ध्यान रखने वाली request handling से SandBase API rate limits को सुरक्षित रूप से संभालें।
---

# रेट लिमिट {#rate-limits}

SandBase आपके organization को requests-per-minute limit दे सकता है। यह organization की हर API key में साझा होती है
और एक मिनट की sliding window में गिनी जाती है। Upstream model providers भी अपने
`429 Too Many Requests` responses लौटा सकते हैं। जब तक SandBase ने आपके workload के लिए कोई quota तय न किया हो, quota hardcode न करें।

## आपके organization की limit {#your-organization-s-limit}
SandBase कोई एक तय requests-per-minute संख्या प्रकाशित नहीं करता, क्योंकि limit हर organization के लिए अलग तय होती है। Organization की हर
API key एक ही limit में गिनी जाती है, इसलिए अधिक keys बनाने से limit नहीं बढ़ती। यह limit फ़िलहाल
public API या Console में नहीं दिखाई जाती।

यदि आपके workload को गारंटीशुदा या अधिक limit चाहिए, तो organization, application,
अपेक्षित स्थिर rate और अपेक्षित burst rate के साथ SandBase support से संपर्क करें। Production client को किसी undocumented numeric default के आधार पर design न करें।

## 429 response संभालें {#handle-a-429-response}

Platform द्वारा generate किए गए `/v1/*` rate-limit responses flat error body का उपयोग करते हैं:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{"error":"organization rate limit exceeded"}
```

Organization limit `POST /v1/run`, `POST /v1/chat/completions`, `POST /v1/responses`, `POST /v1/messages`, `POST /v1/upload`, और Gemini `generateContent`, `streamGenerateContent` तथा `POST /v1beta/interactions` endpoints पर लागू होती है।
`GET /v1/run/{id}` जैसे polling endpoints गिने नहीं जाते। Protocol-compatible endpoints वही `429` अपने error envelope में लौटाते हैं,
जैसे Anthropic या Google error shape। Provider से आया response compatible endpoint के error
shape का उपयोग कर सकता है और उसमें provider rate-limit headers हो सकते हैं।

`Retry-After` और remaining-quota headers की गारंटी नहीं है। यदि `Retry-After` मौजूद है, तो उसका पालन करें। अन्यथा
jitter और अधिकतम attempt count के साथ exponential backoff का उपयोग करें।

```python
import os
import random
import time

from openai import OpenAI, RateLimitError

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def create_with_backoff(**request):
    for attempt in range(5):
        try:
            return client.chat.completions.create(**request)
        except RateLimitError:
            if attempt == 4:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

OpenAI SDK `max_retries` के ज़रिए built-in retries का भी समर्थन करता है। SDK retries या application retry loop में से
किसी एक को सोच-समझकर चुनें, ताकि retries अलग-अलग layers में कई गुना न हों।

## केवल सुरक्षित operations retry करें {#retry-only-safe-operations}

दोहराई गई inference request दूसरा generation बना सकती है और अतिरिक्त cost ला सकती है। इसे केवल तभी retry करें जब आपका
application दोबारा generation स्वीकार करता हो। State बदलने वाली request को अपने-आप retry न करें, जब तक operation
idempotency document न करता हो या आपका application साबित न कर सके कि पहला प्रयास सफल नहीं हुआ।

Streaming requests के लिए `429` आमतौर पर stream शुरू होने से पहले आता है। Bytes आ जाने के बाद, disconnect को
rate-limit error मानने के बजाय बाधित generation मानें। अपनी product ज़रूरतों के अनुसार आंशिक output रखें या हटाएँ;
फिर से शुरू करने पर नया generation बनता है।

## Throughput नियंत्रित करें {#control-throughput}

- एक साथ असीमित batch छोड़ने के बजाय concurrency सीमित रखें।
- अचानक आने वाले काम को queue करें और भेजने की दर को smooth करें।
- Duplicate requests से बचें, और जब privacy और freshness की ज़रूरतें अनुमति दें तो दोबारा उपयोग योग्य results cache करें।
- अलग keys का उपयोग ownership, spending controls और revocation के लिए करें, platform limits से बचने के लिए नहीं।
- Troubleshooting के लिए endpoint, model, HTTP status और sanitized error body दर्ज करें।
- जब किसी workload को तय या अधिक capacity limit चाहिए, तो SandBase support से संपर्क करें।

```python
import asyncio

semaphore = asyncio.Semaphore(8)

async def run_one(client, prompt):
    async with semaphore:
        return await client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": prompt}],
        )
```

Concurrency और requests per minute एक ही चीज़ नहीं हैं। दोनों को देखी गई latency और आपके application को दी गई
capacity के अनुसार tune करें।

::: info रोज़ाना मुफ़्त API calls
Organization की प्रति UTC दिन 100 मुफ़्त data API calls एक billing allowance हैं, rate limit नहीं। इससे अधिक calls
अस्वीकार नहीं होतीं, बल्कि प्रति call bill होती हैं। [रोज़ाना मुफ़्त API calls](/guides/billing#daily-free-api-calls) देखें।
:::

::: tip Video tasks
Video submissions इस बात से भी सीमित होते हैं कि आपका organization अपने account level के आधार पर एक साथ कितने tasks चला सकता है।
वह `429` `organization concurrency limit exceeded` बताता है और किसी timer से नहीं, बल्कि चल रहा task पूरा होने पर हटता है।
[Concurrency limits](/guides/concurrency-limits) देखें।
:::

## संबंधित guidance {#related-guidance}

- [Error handling](/guides/error-handling)
- [Streaming](/guides/streaming)
- [API error reference](/api-reference/errors)
- [API keys](/getting-started/api-keys)

