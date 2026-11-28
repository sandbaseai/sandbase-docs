---
i18nSource: b95a8cd6f82c3a9a
title: AI-Readable Models और Pricing
description: Models API से वर्तमान SandBase models, capabilities, schemas और pricing खोजें।
---

# Models और Pricing {#models-pricing}

सभी models एक ही SandBase API key से उपलब्ध हैं। Model की उपलब्धता, schemas, capabilities, context limits और pricing एक-दूसरे से स्वतंत्र रूप से बदल सकते हैं।

::: info Live model metadata का उपयोग करें
वर्तमान और आधिकारिक data के लिए हमेशा `GET /v1/models` और `GET /v1/models/{id_or_name}` का उपयोग करें। यह न मानें कि हर LLM streaming, vision, tools, structured output या caching समर्थित करता है, और एक model के input fields या pricing को दूसरे model पर copy न करें।
:::

## Catalog और detail responses {#catalog-and-detail-responses}

`GET /v1/models` OpenAI-compatible identity records लौटाता है, जिनमें `id`, `object`, `created` और `owned_by` होते हैं। इसमें SandBase capability, schema और pricing metadata जानबूझकर शामिल नहीं किया जाता।

`GET /v1/models/{id_or_name}` इसमें `unified_schema`, `supported_modes` और `model_card` जोड़ता है। विस्तृत pricing `model_card` से पढ़ें; कोई top-level `pricing` object नहीं है। `capability_tags`, `supported_modes` और `unified_schema` को model-specific मानें।

## Models खोजें {#discover-models}

```bash
curl 'https://api.sandbase.ai/v1/models?type=llm' \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

List endpoint `q`, `vendor`, `type` और `order` समर्थित करता है; यह paginated नहीं है और इसका default `type=llm` है। यह `id`, `object`, `created` और `owned_by` वाले OpenAI-compatible items लौटाता है। Details माँगते या model call करते समय लौटाए गए `id` को model name के रूप में इस्तेमाल करें।

किसी भी asynchronous `202` response के लिए, लौटाए गए ID के साथ `GET /v1/run/{id}` को poll करें। ID को opaque मानें; उसका format अनुमान न लगाएँ और ID prefix या compatibility header से कोई अलग polling path न बनाएँ।

## एक model inspect करें {#inspect-one-model}

Model names vendor-qualified होते हैं और उनमें `/` हो सकता है:

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Execution से पहले ये जाँचें:

- `enabled` और `execution_mode`
- `capability_tags` और `supported_modes`
- स्वीकार किए जाने वाले request fields के लिए `unified_schema`
- वर्तमान pricing formula और token या cache multipliers के लिए `model_card`

## Task की असली लागत जाँचें {#check-actual-task-cost}

पूरे हो चुके या चल रहे task के लिए, किसी पुरानी table से दोबारा गणना करने के बजाय दर्ज की गई लागत query करें:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Response contracts के लिए [Models API reference](/api-reference/models/) और response-shape तथा retry मार्गदर्शन के लिए [Error Guide](/for-agents/errors) देखें।
