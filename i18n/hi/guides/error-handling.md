---
i18nSource: f63049c1cf01130e
title: Errors और retries
description: SandBase API failures को वर्गीकृत करें, तय करें कि retry कब सुरक्षित है, और secrets उजागर किए बिना उपयोगी diagnostics सुरक्षित रखें।
---

# Errors और retries {#errors-and-retries}

Errors को HTTP status, endpoint family और operation semantics के आधार पर handle करें। SandBase कई compatible protocols उपलब्ध कराता है, इसलिए कोई एक error JSON shape हर endpoint में साझा नहीं है।

## Endpoint का error shape पढ़ें {#read-the-endpoint-s-error-shape}

- OpenAI-compatible operations सामान्यतः message और type वाला `error` object लौटाते हैं।
- Anthropic Messages, Anthropic-compatible error envelopes लौटाता है।
- Core platform operations flat `{ "error": "..." }` body या कोई documented resource-specific error लौटा सकते हैं।
- Google और provider-native operations, जहाँ documented है, अपना compatible protocol shape बनाए रखते हैं।

Response के HTTP status और documented body का उपयोग करें। `code`, `param` या `request_id` जैसे वैकल्पिक fields पर तब तक निर्भर न रहें जब तक चुना गया endpoint उनकी गारंटी न दे। उदाहरणों के लिए [API error reference](/api-reference/errors) और operation-specific responses के लिए [OpenAPI specification](/openapi.yaml) देखें।

## Status के आधार पर तय करें कि क्या करना है {#decide-what-to-do-by-status}

| Status | सामान्य कारण | सुझाया गया action |
|---|---|---|
| `400` / `422` | अमान्य body, parameter या असमर्थित model capability | Retry से पहले request ठीक करें। |
| `401` | Credential मौजूद नहीं, अमान्य, expired या revoked है | Credential बदलें। |
| `402` | Billing स्थिति request की अनुमति नहीं देती | Account balance या spending control ठीक करें। |
| `403` | Credential scope या resource access अपर्याप्त है | अधिकृत key या resource का उपयोग करें। |
| `404` | Model, task या platform resource नहीं मिला | Identifier और organization जाँचें। |
| `409` | Resource state या समवर्ती operation में टकराव | वर्तमान स्थिति पढ़ें, फिर तय करें कि retry करना है या नहीं। |
| `429` | SandBase या किसी upstream provider ने request सीमित किया | `Retry-After` मौजूद हो तो उसका पालन करें; अन्यथा jitter के साथ back off करें। |
| `500` / `502` / `503` / `504` | Internal, upstream या अस्थायी उपलब्धता की विफलता | केवल तभी retry करें जब operation दोहराना सुरक्षित हो। |

यह table handling का मार्गदर्शन है; यह वादा नहीं है कि हर endpoint हर status लौटाता है।

## सीमित retry policy का उपयोग करें {#use-a-bounded-retry-policy}

जिस request को दोहराना सुरक्षित है, उसके लिए jitter के साथ exponential backoff इस्तेमाल करें, delay की ऊपरी सीमा रखें, और कुल request budget लागू करें। अगर कोई बाहरी application layer पहले से retry करती है तो SDK retries disable करें, या budget तय करते समय दोनों layers को ध्यान में रखें।

```python
import os
import random
import time

from openai import APIStatusError, OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def chat_with_backoff(messages, attempts=4):
    for attempt in range(attempts):
        try:
            return client.chat.completions.create(
                model="deepseek/deepseek-v4-flash",
                messages=messages,
            )
        except APIStatusError as error:
            retryable = error.status_code in {429, 500, 502, 503, 504}
            if not retryable or attempt == attempts - 1:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

जब response में `Retry-After` हो, तो fallback delay के बजाय उसे parse करके उसका पालन करें। Policy को configurable रखें; सही attempt count और deadline, caller के latency और cost budget पर निर्भर करते हैं।

## Duplicate side effects से बचाव करें {#protect-against-duplicate-side-effects}

Inference request दोहराने से एक नया generation बनता है और अतिरिक्त लागत लग सकती है। यह तभी स्वीकार्य है जब application को कोई भी मान्य उत्तर चाहिए और वह दोबारा generation सहन कर सके।

जो operations काम create, update, delete, publish, schedule या invoke करते हैं, उनके साथ अधिक सावधानी बरतें:

- जब कोई endpoint documented idempotency support देता है, तो उसका उपयोग करें;
- अन्यथा अस्पष्ट request दोहराने से पहले वर्तमान स्थिति पढ़ें;
- केवल इसलिए कोई tool call replay न करें कि आसपास का model stream disconnect हो गया;
- जब retries का मिलान करना हो, तो अपने system में एक client operation ID रखें।

## Timeouts और streams को अलग से handle करें {#handle-timeouts-and-streams-separately}

Timeout से यह साबित नहीं होता कि server ने request की processing रोक दी है। किसी asynchronous या state बदलने वाले operation को retry करने से पहले, जहाँ संभव हो, उसके documented resource या task status को query करें।

Streaming responses में, stream शुरू होने से पहले की HTTP error और आंशिक output के बाद हुए disconnect में अंतर करें। केवल सामान्य protocol termination signal ही पूरे stream का प्रमाण है। [Streaming responses](/guides/streaming) देखें।

## उपयोगी और सुरक्षित diagnostics log करें {#log-useful-safe-diagnostics}

दर्ज करें:

- endpoint और model identifier;
- HTTP status और, मौजूद हो तो, compatible error type;
- लौटाए जाने पर provider या request identifier;
- attempt count, बीता हुआ समय, और क्या कोई response bytes आए।

API keys, credential values, पूरे संवेदनशील prompts या unredacted provider responses log न करें। Users को संक्षिप्त और actionable message दिखाएँ, और operators के लिए sanitized diagnostics सुरक्षित रखें।

## संबंधित मार्गदर्शन {#related-guidance}

- [API error reference](/api-reference/errors)
- [Rate limits](/guides/rate-limiting)
- [Streaming responses](/guides/streaming)
- [Authentication](/api-reference/authentication)
