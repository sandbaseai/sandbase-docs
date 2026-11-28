---
i18nSource: 1fdcd80dbbac0247
title: Chat Completions
description: SandBase के साथ OpenAI-compatible chat completions, streaming, tools, multimodal input और structured output इस्तेमाल करें।
---

# Chat Completions {#chat-completions}

SandBase `POST /v1/chat/completions` पर एक OpenAI-compatible Chat Completions endpoint देता है। मौजूदा OpenAI SDK applications केवल API key और base URL बदलकर SandBase इस्तेमाल कर सकती हैं।

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1",
)
```

## Messages और multimodal content {#messages-and-multimodal-content}

चुने गए provider द्वारा समर्थित roles के साथ messages बातचीत के क्रम में भेजें, आमतौर पर `system`, `developer`, `user`, `assistant` और `tool`। Text एक string हो सकता है। Vision समर्थित करने वाले models `text` और `image_url` जैसे content parts भी स्वीकार करते हैं।

## स्ट्रीमिंग {#streaming}

Server-Sent Events पाने के लिए `stream: true` सेट करें। हर `data:` event को क्रम से पढ़ें और `choices[0].delta.content` को जोड़ते जाएँ। Stream `data: [DONE]` के साथ समाप्त होता है। जब चुना गया provider streaming usage देता है, तो `stream_options: {"include_usage": true}` जोड़ें; अन्यथा usage मौजूद नहीं भी हो सकता।

## टूल {#tools}

`tools` में call किए जा सकने वाले functions परिभाषित करें। जब assistant `tool_calls` लौटाता है, तो हर function को अपनी application में चलाएँ, फिर आगे बढ़ने से पहले मेल खाते `tool_call_id` वाला एक `tool` message जोड़ें।

## संरचित आउटपुट {#structured-output}

JSON object या JSON Schema response माँगने के लिए `response_format` इस्तेमाल करें। समर्थन model के अनुसार बदलता है, इसलिए strict schema enforcement पर निर्भर होने से पहले चुने गए model की क्षमताएँ जाँचें।

## प्रोवाइडर-विशिष्ट पैरामीटर {#provider-specific-parameters}

SandBase routing के लिए `model` और `stream` इस्तेमाल करता है। जब चुना गया provider वही protocol इस्तेमाल करता है, तो अतिरिक्त OpenAI-compatible request fields बनाए रखे जाते हैं। जब SandBase protocols के बीच translate करता है, तो documented fields या `extra_body` इस्तेमाल करें; समर्थन provider के अनुसार बदलता है।

## Errors और retries {#errors-and-retries}

Retry किए जा सकने वाले `429` और transient server responses के लिए bounded backoff केवल तभी इस्तेमाल करें जब दोबारा generate करना सुरक्षित हो। Malformed requests, authentication failures, या ऐसे requests जिनके tool side effects पहले ही हो चुके हों, उन्हें अपने-आप retry न करें। [Errors और retries](/guides/error-handling) देखें। पूरे field और response schema के लिए [Chat Completions API](/api-reference/llm-gateway) देखें।
