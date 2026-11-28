---
i18nSource: 3ccdc1071b9be798
title: मॉडल API
description: SandBase models का metadata, कीमतें, support status और capabilities खोजें।
---

# मॉडल API {#models-api}

Inference endpoint चुनने से पहले models खोजने के लिए Models API इस्तेमाल करें। List operation OpenAI-compatible है और छोटे identity records लौटाता है। SandBase की capability, schema और pricing metadata के लिए एक model retrieve करें।

| Operation | Endpoint | Documentation |
|---|---|---|
| Models की सूची | `GET /v1/models` | [List Models](./list) |
| एक model पाएं | `GET /v1/models/{id_or_name}` | [Get Model](./get) |
| Path से API capability invoke करें | `GET/POST /v1/api/{vendor}/{upstream_path}` | [API Passthrough](./api-passthrough) |
| Model या API capability run करें | `POST /v1/run` | [Run Capability](./run) |
| Asynchronous result पाएं | `GET /v1/run/{id}` | [Get Run Result](./run-get) |
| Asynchronous callback पाएं | `POST /v1/run` पर `webhook_url` | [Webhook callbacks](./run#webhook-callbacks) |
| सपोर्टेड models ब्राउज़ करें | — | [Models catalog](https://www.sandbase.ai/models) |

किसी model को run करने के लिए [Models catalog](https://www.sandbase.ai/models) से उसका reference पेज खोलें; हर पेज पर सटीक identifier, request fields और कीमतें दिखती हैं। यह पेज discovery, unified capability runner, API passthrough, assets और task-cost lookup को document करता है।

`GET /v1/models` `q`, `vendor`, `type` और `order` को सपोर्ट करता है; यह paginated नहीं है। `type` न देने पर डिफ़ॉल्ट `llm` होता है, जबकि स्पष्ट रूप से खाली `type=` सभी public model types की सूची देता है। `vendor` filter सटीक और case-sensitive है; `q` एक case-insensitive substring search है। हर list item में `id`, `object`, `created` और `owned_by` होते हैं, जिसमें `id` requests में इस्तेमाल होने वाला logical model name है।

Model names में `/` हो सकता है। Detail endpoint call करते समय इन slashes को path separators के रूप में भेजें, जैसे `/v1/models/openai/gpt-5.6-luna`; server route बाकी पूरे path को एक logical identifier मानता है। किसी पुरानी गाइड से identifier कॉपी करने के बजाय `GET /v1/models` से मौजूदा ID पता करें।

किसी inference API से asynchronous `202` response मिलने पर लौटाए गए opaque ID के साथ `GET /v1/run/{id}` को poll करें। ID prefix का अनुमान न लगाएं और compatibility headers से कोई अलग polling path न बनाएं।
