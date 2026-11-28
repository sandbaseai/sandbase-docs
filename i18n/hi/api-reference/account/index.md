---
i18nSource: 3b9b3fc27f878cd5
title: खाता API
description: किसी API key से जुड़े organization का balance और हाल की execution history देखें।
---

# खाता API {#account-api}

Account endpoints read-only हैं और Bearer API key से निर्धारित organization पर काम करते हैं।

| Operation | Endpoint |
|---|---|
| [Balance प्राप्त करें](./balance) | `GET /v1/account/balance` |
| [Execution history की सूची](./history) | `GET /v1/account/history` |

Balance और cost के मान exact decimal strings होते हैं। इन्हें binary floating-point arithmetic से बदलने के बजाय decimal मानों के रूप में ही रखें।

Execution history हाल की operational जाँच के लिए है। लंबी अवधि के financial reconciliation के लिए billing records या exports का उपयोग करें।

History filtering raw UTC timestamps का उपयोग करती है। `request_id` के बिना, वैकल्पिक `timezone` compatibility parameter को IANA time-zone name के रूप में validate किया जाता है, लेकिन यह response timestamps को नहीं बदलता; exact `request_id` mode इसे अन्य filters के साथ अनदेखा करता है। अज्ञात `type` मानों पर कोई execution-type filter लागू नहीं होता; प्रभावी filter के लिए `multimodal`, `llm` या `api` का उपयोग करें। असमर्थित `range` मान `7d` पर लौट जाते हैं।

History entries में stored request parameters और model output हो सकते हैं। इसी हिसाब से API key तक पहुँच सीमित रखें, और history responses को संवेदनशील data के लिए जाँचे बिना logs या support tickets में copy न करें।
