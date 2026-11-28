---
i18nSource: fc051d55a0cfa8bd
title: कॉन्करेंसी लिमिट
description: आपका organization एक साथ कितने tasks चला सकता है, यह सीमा account level के साथ कैसे बढ़ती है, और video submissions पर 429 और 402 को कैसे संभालें।
---

# कॉन्करेंसी लिमिट {#concurrency-limits}

Concurrency limits तय करती हैं कि आपके organization में एक ही समय में कितने tasks चल सकते हैं। हर organization का एक account level होता है, और वही level उसकी concurrency limit तय करता है। सीमा तक पहुंचने पर नीचे बताए गए जांचे जाने वाले endpoints पर नए submissions `429` के साथ अस्वीकार किए जाते हैं, जब तक आपका कोई चालू task पूरा न हो जाए। उन्हें queue में नहीं रखा जाता।

यह सीमा पूरे organization पर, सभी API keys में मिलाकर लागू होती है। कौन-से submissions जांचे जाते हैं, यह endpoint पर निर्भर करता है:

- `POST /v1/run` और `/v1/api/{vendor}/...` से होने वाली Platform API calls हर model type के लिए जांची जाती हैं, जिनमें image, audio, LLM और data API operations शामिल हैं।
- दूसरे endpoints, जैसे Chat Completions, Responses, Messages, OpenAI Images, और protocol-compatible Gemini और Volcengine endpoints, सिर्फ़ video submissions जांचते हैं।

## यह कैसे काम करता है {#how-it-works}

जब आप कोई जांचा जाने वाला task submit करते हैं, तो SandBase गिनता है कि आपके organization में इस समय कितने tasks चल रहे हैं, यानी `pending` या `running` state वाले tasks। अगर यह संख्या पहले से आपकी सीमा पर है, तो submission तुरंत `429` के साथ अस्वीकार हो जाता है। कोई task नहीं बनता और कोई charge नहीं लगता।

इस गिनती में आपके organization का हर चालू request शामिल होता है, सिर्फ़ video नहीं। जांचा जाने वाला task submit करते समय अगर कोई streaming chat completion अभी खुला है, तो वह एक slot लेता है। अगर एक ही organization लंबी streaming chats और video jobs दोनों चलाता है, तो capacity की योजना बनाते समय सभी को गिनें।

Task के अंतिम state (`completed`, `failed` या `timeout`) में पहुंचते ही slot खाली हो जाता है। आपको अपनी तरफ़ से कुछ release नहीं करना होता। चूंकि slots tasks पूरे होने पर खाली होते हैं, किसी timer पर नहीं, इसलिए यह `429` प्रति मिनट वाली [rate limit](/guides/rate-limiting) से अलग है। तय समय तक इंतज़ार करने से slot मिलने की गारंटी नहीं होती। इसके बजाय अपने किसी task के पूरा होने का इंतज़ार करें।

## डिफ़ॉल्ट सीमाएं {#default-limits}

हर नया organization **Bronze** से शुरू होता है, जिसमें 2 concurrent tasks की सीमा होती है। एक सफल टॉप-अप की राशि के आधार पर आपका level अपने आप बढ़ता है।

| Level | एक टॉप-अप | Concurrent tasks |
|-------|---------------|------------------|
| Bronze | डिफ़ॉल्ट | 2 |
| Silver | $10 या ज़्यादा | 10 |
| Gold | $100 या ज़्यादा | 100 |
| Platinum | $500 या ज़्यादा | 500 |
| Diamond | Sales से संपर्क करें | असीमित |

- **एक टॉप-अप, कुल योग नहीं।** $60 के दो टॉप-अप पर आप Silver पर ही रहते हैं। $100 का एक टॉप-अप आपको Gold पर ले जाता है।
- **सिर्फ़ upgrade।** बाद का छोटा टॉप-अप आपका level कभी कम नहीं करता।
- **सिर्फ़ paid टॉप-अप।** Promotional credits, sign-up credits और coupons आपका level नहीं बदलते।
- **तुरंत लागू।** पेमेंट सफल होते ही नई सीमा आपके अगले video submission पर लागू हो जाती है।

## अपनी सीमा बढ़ाना {#increasing-your-limit}

सीमा बढ़ाने का सबसे सीधा तरीका ऐसा एक टॉप-अप है जो ऊपर की टेबल में अगली सीमा तक पहुंचे।

500 से ज़्यादा concurrent tasks या मासिक credit line के लिए **Diamond** level के बारे में [contact@sandbase.ai](mailto:contact@sandbase.ai) से संपर्क करें। Diamond में कोई concurrency limit नहीं होती। इसे SandBase टीम सेट करती है और टॉप-अप से यह कभी नहीं बदलता।

## Video submissions पर credit की जांच {#credit-check-on-video-submissions}

Concurrency जांच के साथ-साथ SandBase हर video task को स्वीकार करने से पहले उसकी लागत का अनुमान लगाता है। अगर अनुमान आपके उपलब्ध credit (बैलेंस और कोई credit line) से ज़्यादा है, तो submission `402` के साथ अस्वीकार हो जाता है। कोई task नहीं बनता और कोई charge नहीं लगता।

- हर submission की जांच आपके मौजूदा बैलेंस के आधार पर होती है। चल रहे tasks का अभी charge नहीं हुआ है, इसलिए एक साथ कई videos submit करते समय गुंजाइश छोड़ें।
- अगर किसी model की कीमत ऐसे output पर निर्भर करती है जो उसके चलने के बाद ही बनता है, तो लागत का पहले से अनुमान नहीं लगाया जा सकता। ऐसा submission स्वीकार हो जाता है और task पूरा होने पर सामान्य रूप से बिल होता है।

## Concurrency errors संभालना {#handling-concurrency-errors}

### 429: concurrency limit पूरी हो गई {#_429-concurrency-limit-reached}

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "error": "organization concurrency limit exceeded"
}
```

कोई `Retry-After` header नहीं भेजा जाता। सीमा पहले से पता होती है, इसलिए सबसे भरोसेमंद तरीका है कि इसे कभी पार न करें। Client की तरफ़ चल रहे video tasks की संख्या सीमित रखें, और पिछला task पूरा होने के बाद ही अगला submit करें:

::: code-group

```python [Python]
import asyncio

MAX_CONCURRENT_VIDEOS = 2  # set to your level's limit
slots = asyncio.Semaphore(MAX_CONCURRENT_VIDEOS)

async def generate_video(submit, wait_for_result, payload):
    # Hold a slot for the whole lifetime of the task, not just the submit call.
    async with slots:
        task = await submit(payload)
        return await wait_for_result(task)

async def main(submit, wait_for_result, payloads):
    return await asyncio.gather(
        *(generate_video(submit, wait_for_result, p) for p in payloads)
    )
```

```javascript [JavaScript]
const MAX_CONCURRENT_VIDEOS = 2; // set to your level's limit

async function runAll(payloads, submit, waitForResult) {
  const results = [];
  const queue = [...payloads.entries()];

  async function worker() {
    for (let next = queue.shift(); next; next = queue.shift()) {
      const [index, payload] = next;
      // Each worker holds one slot until its task finishes.
      const task = await submit(payload);
      results[index] = await waitForResult(task);
    }
  }

  await Promise.all(
    Array.from({ length: MAX_CONCURRENT_VIDEOS }, worker)
  );
  return results;
}
```

:::

अगर फिर भी `429` मिले, जैसे इसलिए कि उसी organization की कोई दूसरी service भी submit कर रही है, तो रुककर retry करें। Jitter के साथ exponential backoff इस्तेमाल करें, और तंग loop में retry करते रहने के बजाय सीमित कोशिशों के बाद रुक जाएं।

### 402: इस video के लिए पर्याप्त credit नहीं {#_402-not-enough-credit-for-this-video}

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "error": "insufficient credit for estimated video cost"
}
```

Retry न करें। टॉप-अप करें, या कम लागत वाली छोटी अवधि या कम resolution चुनें।

### संगत API {#compatible-apis}

Protocol-compatible endpoints ये errors अपने native format में लौटाते हैं। उदाहरण के लिए, Volcengine-compatible `/api/v3/contents/generations/tasks` endpoint `429` के लिए `RateLimitExceeded` और `402` के लिए `AccountOverdueError` लौटाता है।

## संबंधित {#related}

- [Rate limits](/guides/rate-limiting): प्रति मिनट request सीमाएं
- [Pricing](/guides/billing): credits और टॉप-अप
- [Errors](/api-reference/errors): सभी error codes
