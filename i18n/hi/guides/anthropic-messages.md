---
i18nSource: 1afa8f1905c6e53c
title: Anthropic Messages
description: SandBase के साथ Anthropic-compatible messages, content blocks, tools, thinking और streaming इस्तेमाल करें।
---

# Anthropic Messages {#anthropic-messages}

SandBase `POST /v1/messages` पर एक Anthropic-compatible endpoint देता है। Anthropic SDK applications सिर्फ़ API key और base URL बदलकर कनेक्ट हो सकती हैं।

```python
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai",
)
```

## Authentication और version headers {#authentication-and-version-headers}

`x-api-key` या `Authorization: Bearer …` इस्तेमाल करें। दोनों देने पर `x-api-key` को प्राथमिकता मिलती है। वैकल्पिक `anthropic-version` header upstream को भेजा जाता है और न देने पर डिफ़ॉल्ट `2023-06-01` होता है। वैकल्पिक `anthropic-beta` values भी provider compatibility के अधीन आगे भेजी जाती हैं।

## Messages और content blocks {#messages-and-content-blocks}

Messages `user` और `assistant` roles इस्तेमाल करते हैं। System instruction को top-level `system` field में रखें। Content सादा text हो सकता है या `text`, `image`, `tool_use` और `tool_result` जैसे typed blocks का array।

## Tools और extended thinking {#tools-and-extended-thinking}

`tools` में tool definitions जोड़ें और `tool_choice` से चयन नियंत्रित करें। चुना गया model सपोर्ट करे तो `thinking` से extended reasoning कॉन्फ़िगर करें; बातचीत आगे बढ़ाते समय लौटाए गए thinking blocks को बनाए रखें।

## स्ट्रीमिंग {#streaming}

Anthropic-style SSE events पाने के लिए `stream: true` सेट करें, जिनमें `message_start`, content-block events, `message_delta` और `message_stop` शामिल हैं। SandBase keepalive और provider-defined beta events भी आगे भेजता है। आगे की compatibility के लिए consumers को अनजान event types नज़रअंदाज़ करने चाहिए और protocol-level `error` events संभालने चाहिए।

## संगतता {#compatibility}

SandBase public model name को चुने गए provider से map करता है। बाकी compatible request fields और response bytes वैसे ही रहते हैं, जब तक उस provider का कोई स्पष्ट compatibility नियम किसी असमर्थित field को हटा न दे या candidate को अस्वीकार न कर दे। Provider-specific beta features हर model पर उपलब्ध नहीं हो सकते। पूरे request और response schema के लिए [Create Anthropic Message](/api-reference/anthropic-compat) देखें।
