---
i18nSource: adfacb669489863e
title: खाता और बिलिंग
description: अपनी SandBase organization, API keys, बिलिंग, usage और limits manage करें।
---

# खाता और बिलिंग {#account-and-billing}

आपकी organization settings तय करती हैं कि usage का स्वामी कौन है, applications कैसे authenticate करती हैं, और खर्च पर कैसे नज़र रखी जाती है।

## आप क्या manage करते हैं {#what-you-manage}

| क्षेत्र | किसके लिए इस्तेमाल करें |
|---|---|
| [Organizations](/admin/organizations) | workspace की सीमा, सदस्यों और ownership को manage करें |
| [API Keys](/getting-started/api-keys) | application credentials बनाएँ, rotate करें और revoke करें |
| [बिलिंग और credits](/admin/billing) | balance देखें, credits खरीदें, auto top-up सेट करें, और Activities व Analysis में usage देखें |
| [Pricing और usage](/guides/billing) | model pricing, रोज़ाना की मुफ़्त API calls, और एक task की लागत देखें |
| [Rate limits](/guides/rate-limiting) | request limits और सुरक्षित retry व्यवहार समझें |

## सुझाया गया setup {#recommended-setup}

1. पुष्टि करें कि आप सही organization में काम कर रहे हैं।
2. development, staging और production के लिए अलग-अलग API keys बनाएँ।
3. keys के नाम उनकी application और environment के अनुसार रखें।
4. पहले production requests के बाद Activities और बिलिंग की समीक्षा करें।
5. इस्तेमाल न होने वाली keys revoke करें और अप्रत्याशित usage की तुरंत जाँच करें।

## Ownership और access {#ownership-and-access}

API keys और usage एक organization के होते हैं। organization बदलने से Console में दिखने वाले resources, keys और बिलिंग context बदल जाते हैं। production configuration बदलने से पहले चुनी गई organization की पुष्टि करें, और key rotation को उन applications के साथ समन्वित करें जो उसका इस्तेमाल करती हैं।

## सुरक्षा की मूल बातें {#security-basics}

- keys को environment variables या secrets manager में रखें
- keys को कभी भी Agent instructions, source code, screenshots या support messages में paste न करें
- हर application और environment के लिए अलग key इस्तेमाल करें
- अगर किसी key के उजागर होने की आशंका हो तो उसे तुरंत revoke करें
- अप्रत्याशित volume, models या endpoints के लिए Activities पर नज़र रखें
