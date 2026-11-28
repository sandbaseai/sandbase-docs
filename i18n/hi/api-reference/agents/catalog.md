---
i18nSource: 1b5099685e9df6ce
title: Agent कैटलॉग
description: Public Agents ब्राउज़ करें और किसी एक को अपने organization में clone करें।
---

# Agent कैटलॉग {#agent-catalog}

Catalog में वे Agents होते हैं जिन्हें SandBase दोबारा इस्तेमाल के लिए प्रकाशित करता है। Catalog entries सिर्फ़ पढ़ी जा सकती हैं। किसी entry को clone करने पर आपके organization में एक private Agent बनता है, जिसे आप edit, run और deploy कर सकते हैं।

| Method | Path | उद्देश्य |
|---|---|---|
| `GET` | `/v1/agents/catalog` | Public Agents की सूची |
| `GET` | `/v1/agents/catalog/{agent_id}` | एक public Agent पाएं, वैकल्पिक रूप से `?version=` पर |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | इसे अपने organization में कॉपी करें |

## Catalog Agents की सूची {#list-catalog-agents}

`limit` (1-100), `after` और `order` के साथ cursor pagination।

```bash
curl "https://api.sandbase.ai/v1/agents/catalog?limit=20" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

हर entry में `id`, `object: "agent"`, `visibility: "public"`, `version`, `name`, `description`, `model`, `created_at` और `updated_at` होते हैं।

## Catalog Agent पाएं {#get-a-catalog-agent}

```bash
curl "https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60?version=2" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`version` वैकल्पिक है और यह एक धनात्मक पूर्णांक होना चाहिए। Detail response में एक read-only `configuration` object जुड़ता है (name, description, model, instructions, runtime profile, metadata, tools, text, reasoning और Skills)।

## Catalog Agent clone करें {#clone-a-catalog-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/clone \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: clone-research-agent" \
  -H "Content-Type: application/json" \
  -d '{"name": "My research assistant"}'
```

Body में वैकल्पिक `version` (धनात्मक पूर्णांक, डिफ़ॉल्ट रूप से मौजूदा public version) और `name` (अधिकतम 128 अक्षर) दिए जा सकते हैं। Response `201 Created` होता है, जिसमें पूरा [Agent object](./create) होता है और आपके organization में उसका नया `agt_` ID होता है। `Idempotency-Key` वैकल्पिक है; एक स्थिर key भेजें ताकि retry करने पर दूसरी कॉपी न बने।

Clone करने के बाद इसे टेस्ट करने के लिए [Session बनाएं](/api-reference/sessions/create)।
