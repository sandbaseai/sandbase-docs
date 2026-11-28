---
i18nSource: d560e2374d91a8d6
title: बिलिंग और क्रेडिट
description: SandBase organization का बैलेंस देखें, Stripe या Airwallex से क्रेडिट खरीदें, ऑटो टॉप-अप सेट करें, कूपन रिडीम करें और API key के खर्च नियंत्रण समझें।
---

# बिलिंग और क्रेडिट {#billing-and-credits}

यह पेज [SandBase Console](https://www.sandbase.ai/console) में बिलिंग मैनेजमेंट के बारे में है। दरों और लागत कम करने के तरीकों के लिए [Pricing](/guides/billing) देखें।

SandBase समर्थित workloads का बिल organization के बैलेंस से काटता है। मौजूदा कीमतें, ऑफ़र, पेमेंट प्रोवाइडर,
न्यूनतम टॉप-अप राशि और क्षेत्रीय उपलब्धता Console में दिखाई जाती हैं, और ये इस गाइड से अलग
बदल सकती हैं।

## बैलेंस {#balance}

[Developer → Billing](https://www.sandbase.ai/console/billing) खोलें। **Credits** पेज active organization की ये जानकारी दिखाता है:

| आइटम | मतलब |
|------|---------------|
| **Available balance** | Models और APIs में इस्तेमाल के लिए तैयार |
| **Credit limit** | Workspace की खर्च सीमा |
| **Current level** | अकाउंट टियर और उसकी concurrency |

साइन इन होने पर यही बैलेंस Console Dashboard के **Balance** कार्ड और साइट हेडर में भी दिखता है।
प्रमोशन और checkout की शर्तों के लिए Console को ही सही स्रोत मानें; इसके आंतरिक नेटवर्क
requests को automate न करें।

## क्रेडिट खरीदें {#buy-credits}

1. [Billing](https://www.sandbase.ai/console/billing) खोलें और पुष्टि करें कि **Credits go to** में वही workspace दिख रहा है जिसमें आप पैसे डालना चाहते हैं।
2. **Buy credits** में कोई preset राशि चुनें या USD में **Custom amount** डालें। न्यूनतम टॉप-अप राशि पेज पर दिखाई जाती है।
3. अगर एक से ज़्यादा **Payment provider** उपलब्ध हों, तो **Stripe** (ग्लोबल कार्ड और वॉलेट) या **Airwallex** (कार्ड और स्थानीय पेमेंट तरीके) चुनें।
4. Preview में **Pay**, **Bonus** और **Receive** देखें, फिर **Continue with Stripe** (या आपका चुना हुआ प्रोवाइडर) चुनें और hosted checkout पूरा करें।
5. लागत के प्रति संवेदनशील workload शुरू करने से पहले **Credit transactions** में अपडेट हुआ बैलेंस जांच लें।

SandBase कभी कार्ड की जानकारी स्टोर नहीं करता; पेमेंट पेज प्रोवाइडर होस्ट करता है।

### पहले टॉप-अप पर बोनस {#first-top-up-bonus}

अगर अकाउंट और workspace में पहले कभी टॉप-अप नहीं हुआ है, तो **Current offers** में पहले टॉप-अप का बोनस दिखता है। पेज पर
बोनस का प्रतिशत और उसकी अधिकतम सीमा बताई जाती है। हर अकाउंट और हर workspace पर एक ही बोनस लागू होता है, और refund होने पर बोनस
उसी अनुपात में वापस ले लिया जाता है। बोनस **Credit transactions** में अलग पंक्ति के रूप में दिखता है।

## ऑटो टॉप-अप {#auto-top-up}

**Auto Top-up** बैलेंस एक तय सीमा से नीचे जाने पर सेव किए गए कार्ड से उसे फिर भर देता है। फ़िलहाल यह सिर्फ़ Stripe
को सपोर्ट करता है, और इसे सिर्फ़ workspace owners और admins ही मैनेज कर सकते हैं।

1. **Payment cards** में **Add Card** चुनें और Stripe में कार्ड सेव करें।
2. **Turn on auto top-up** चुनें, फिर **When balance goes below**, **Top-up amount**, वैकल्पिक **Monthly limit** और कार्ड सेट करें।
3. **I authorize these automatic charges** को चेक करें और पुष्टि करें।

मासिक सीमा पूरी होने पर कैलेंडर महीने (UTC) के बाकी समय के लिए ऑटो टॉप-अप रुक जाता है। ऑटोमैटिक चार्ज
**Credit transactions** में `Auto top-up · Stripe` चैनल के साथ दिखते हैं।

## कूपन रिडीम करें {#redeem-a-coupon}

**Redeem a coupon** में **Coupon code** डालें, फिर **Redeem credit** चुनें। कूपन सिर्फ़ active
workspace पर लागू होता है, इसलिए पहले चुना गया organization जांच लें।

## खर्च नियंत्रण {#spending-controls}

| नियंत्रण | दायरा | व्यवहार |
|---------|-------|----------|
| Organization की फ़ंडिंग सीमा | पूरा org | उपलब्ध बैलेंस और कॉन्फ़िगर की गई credit limit; बिना फ़ंड वाला request HTTP 402 लौटा सकता है |
| Key की खर्च सीमा | हर API key | हर key के लिए वैकल्पिक सीमा, जो org बैलेंस से बंधी होती है |
| ऑटो टॉप-अप की मासिक सीमा | पूरा org | हर कैलेंडर महीने (UTC) के ऑटोमैटिक चार्ज की सीमा तय करती है |

हर key के लिए खर्च सीमा सेट करने के लिए [API Keys](/getting-started/api-keys) देखें।

## Activities और Analysis {#activities-and-analysis}

[Developer → Activities](https://www.sandbase.ai/console/activities) में दो टैब हैं:

- **Request History** हर request को API key, model, status, latency और लागत के साथ दिखाता है।
- **Usage** 7 या 30 दिनों के requests और लागत, **Model APIs by Archived Spend**, और **Billing Records** दिखाता है। दोनों टेबल में **Export CSV** है। Billing records के export में **Free Quota** कॉलम होता है, जो दैनिक free quota में आने वाली calls को चिह्नित करता है।

[Developer → Analysis](https://www.sandbase.ai/console/analytics) पिछले 7 या 30 पूरे UTC दिनों के लिए **Overview**, **Cost analysis** और
**Health diagnostics** जोड़ता है।

सार्वजनिक कीमतों और task-cost contracts के लिए [Pricing and Usage](/guides/billing) और
[Get Task Cost](/api-reference/tasks/cost) देखें।
