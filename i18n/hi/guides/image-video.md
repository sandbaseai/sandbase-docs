---
i18nSource: 8c960d117a998817
title: Image और Video Models
description: SandBase के shared Run API से images और videos asynchronously बनाएँ।
---

# Image और Video Models {#image-and-video-models}

Image और video models, SandBase के shared asynchronous Run API का उपयोग करते हैं। `POST /v1/run` से task submit करें, फिर run के terminal status तक पहुँचने तक `GET /v1/run/{id}` को poll करें।

## Task submit करें {#submit-a-task}

[Image और video models](https://www.sandbase.ai/models/image-video) से exact model ID इस्तेमाल करें। बाकी request fields हर model के लिए अलग होते हैं; ज़रूरी inputs और limits के लिए model का API reference खोलें।

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<model-id>",
    "prompt": "A cinematic product shot at sunrise."
  }'
```

Response में एक opaque `id` और `pending` या `running` जैसा `status` होता है।

## Result के लिए poll करें {#poll-for-the-result}

```bash
curl https://api.sandbase.ai/v1/run/<run-id> \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`status` के `completed`, `failed` या `timeout` होने तक polling जारी रखें। Completed runs में capability-specific outputs होते हैं, जैसे image या video URL। Run ID सँभालकर रखें और run response को ही आधिकारिक status मानें।

## वेबहुक कॉलबैक {#webhook-callbacks}

समर्थित asynchronous tasks, submit request में `webhook_url` भी set कर सकते हैं। Callback केवल delivery का संकेत है, polling का विकल्प नहीं; `GET /v1/run/{id}` का उपयोग जारी रखें और duplicate या देर से आने वाले callbacks को सुरक्षित रूप से handle करें। साझा callback contract के लिए [Capability चलाएँ](/api-reference/models/run#webhook-callbacks) देखें।

## API capabilities URL-derived path का उपयोग करती हैं {#api-capabilities-use-a-url-derived-path}

Shared Run API, model generation के लिए है। [APIs catalog](https://www.sandbase.ai/apis) की API capabilities एक अलग URL-derived route का उपयोग करती हैं: `GET` या `POST /v1/api/{vendor}/{upstream_path}`। Vendor-qualified capability name, Models API या APIs catalog से आता है, इसलिए POST body से `model` field छोड़ा जा सकता है:

```bash
curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

यह route API capabilities के लिए है; image या video models call करते समय यह `/v1/run` का विकल्प नहीं है। अगर चुनी गई API capability asynchronous है, तो लौटाए गए run ID को `GET /v1/run/{id}` से poll करें।

## अगले कदम {#next-steps}

- [Image और video models](https://www.sandbase.ai/models/image-video)
- [Capability चलाएँ](/api-reference/models/run)
- [Run result प्राप्त करें](/api-reference/models/run-get)
- [API Passthrough](/api-reference/models/api-passthrough)
