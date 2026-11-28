---
i18nSource: 91c5a0d1b6de6434
title: Pricing और usage
description: वर्तमान model pricing देखें, task costs जाँचें और SandBase billing को सुरक्षित रूप से मैनेज करें।
---

# Pricing और usage {#pricing-and-usage}

SandBase pay-as-you-go billing का उपयोग करता है। Model availability, price formulas, cache multipliers और capability-specific
charges स्वतंत्र रूप से बदल सकते हैं, इसलिए integrations को copy की गई price tables पर निर्भर रहने के बजाय live metadata
पढ़ना चाहिए।

## रोज़ाना मुफ़्त API calls {#daily-free-api-calls}

हर organization को प्रति UTC दिन 100 मुफ़्त data API calls (search, social, scraping, e-commerce, finance) मिलती हैं। यह
allowance सभी पात्र data APIs और organization की सभी keys में साझा होती है, और 00:00 UTC पर reset होती है। LLMs और
media models पात्र नहीं हैं। कुछ data APIs भी पात्र नहीं हैं: महँगी या formula-priced APIs, जैसे कुछ
batch endpoints, crawl endpoints, Xiaohongshu PGY और Douyin Xingtu `kol-*` routes, पहली call से ही bill होती हैं।
किसी tool की जाँच के लिए `sandbase_inspect` चलाएँ: पात्र tools में `pricing.free_quota` होता है, और जिन tools में यह नहीं है वे हमेशा
bill होते हैं।

- Allowance के भीतर की calls का शुल्क नहीं लगता, और शून्य balance वाला organization भी उनका उपयोग कर सकता है।
- 100वीं call के बाद पात्र calls काम करती रहती हैं और tool में दिखाई गई कीमत पर प्रति call bill होती हैं। Allowance खत्म होने के कारण वे
  अस्वीकार या rate-limit नहीं होतीं।
- अप्रयुक्त calls अगले दिन में नहीं जुड़तीं।

[SandBase MCP tools](/setup/) में, `sandbase_inspect` पात्र tools को `pricing.free_quota`
(`daily_limit`, `scope`, `resets`) से चिह्नित करता है। `sandbase_account` आज की allowance को `free_api_quota` के रूप में
`daily_limit`, `used_today`, `remaining` और `resets_at` के साथ लौटाता है; जब गिनती
अस्थायी रूप से उपलब्ध न हो, तब `used_today` और `remaining` छोड़ दिए जाते हैं। Run settle होने के बाद, `sandbase_run` और `sandbase_run_get` `free_quota_status` रिपोर्ट करते हैं:
`free` (allowance में शामिल), `overage` (allowance खत्म होने के बाद bill हुआ), या `degraded` (शुल्क नहीं लगा
क्योंकि allowance की गिनती उपलब्ध नहीं थी)।

## Console में billing मैनेज करें {#manage-billing-in-the-console}

अपना balance देखने, credits खरीदने, auto top-up सेट करने, coupons redeem करने और अपने organization के लिए उपलब्ध billing settings मैनेज करने के लिए
**Developer → Billing** का उपयोग करें। Organization-level request, token और cost summaries के लिए **Developer → Activities → Usage** खोलें।

::: info Public API की सीमा
Balance, top-up, billing export और organization-wide usage endpoints फ़िलहाल समर्थित
public API का हिस्सा नहीं हैं। Console network requests को automate न करें और internal Console routes पर निर्भर न रहें।
:::

## वर्तमान model pricing पढ़ें {#read-current-model-pricing}

पहले एक enabled model खोजें:

```bash
curl 'https://api.sandbase.ai/v1/models?q=gpt' \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

फिर उसका पूरा model card माँगें:

```bash
curl https://api.sandbase.ai/v1/models/deepseek/deepseek-v4-flash \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

List endpoint खोज के लिए optimized है और जानबूझकर विस्तृत token, cache और reasoning prices छोड़ देता है।
चुने गए model की विस्तृत pricing detail response के `model_card` से पढ़ें। ऐसा कोई सार्वभौमिक formula नहीं है
जो हर LLM, media model, embedding model या API capability पर लागू हो।

## किसी एक task की दर्ज cost जाँचें {#check-one-task-s-recorded-cost}

जब कोई operation task ID लौटाता है, तो उसका settlement record query करें:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Response वर्तमान `cost` को `estimated_cost` से अलग दिखाता है और बताता है कि settlement अंतिम है या नहीं। जब तक `settled`
`true` न हो, billing reconciliation के लिए `cost` का उपयोग न करें। Task records operational lookup data हैं,
accounting ledger नहीं। Reconciliation और लंबे समय के records के लिए **Developer → Activities → Usage** में उपलब्ध
billing records और CSV exports का उपयोग करें।

## Cost नियंत्रण के तरीके {#cost-control-practices}

- नया workload शुरू करने से पहले वर्तमान model card देखें।
- `capability_tags`, `supported_modes` और `unified_schema` जाँचें; सस्ते विकल्प तभी उपयोगी हैं जब वे
  आवश्यक input और output व्यवहार का समर्थन करते हों।
- अनावश्यक prompt context सीमित करें, और जब चुना गया model समर्थन करता हो तो उचित output-token limit सेट करें।
- Caching को model-specific मानें। Provider-wide discount मानने के बजाय model card और लौटाए गए usage fields
  जाँचें।
- Task IDs केवल task-cost lookup के लिए दर्ज करें; asynchronous `/v1/run` काम के लिए लौटाया गया opaque run ID दर्ज करें और `GET /v1/run/{id}` को केवल तब तक poll करें जब तक status `pending` या `running` हो।
- अपने organization के लिए Console में उपलब्ध spending controls का उपयोग करें।

## भुगतान त्रुटियाँ {#payment-errors}

जब organization request के लिए funding नहीं कर पाता, तो API operation HTTP `402` लौटा सकता है। Error envelopes API
compatibility surface के अनुसार अलग होते हैं, इसलिए किसी एक message string से मिलान करने के बजाय HTTP status और documented error object को
संभालें। Console में billing ठीक करने के बाद, operation के idempotency और recovery नियमों के अनुसार retry करें।

Video submissions शुरू होने से पहले उनकी अनुमानित cost के आधार पर भी जाँचे जाते हैं। $10 या उससे अधिक का एक top-up
आपके account का level बढ़ाता है, जिससे एक साथ अधिक video tasks चल सकते हैं।
[Concurrency limits](/guides/concurrency-limits) देखें।

वर्तमान public contracts के लिए [Models and Pricing](/for-agents/models), [Task Cost](/api-reference/tasks/cost) और
[Errors](/api-reference/errors) देखें।

