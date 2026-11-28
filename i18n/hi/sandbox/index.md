---
i18nSource: 4191d2eb16a594f5
title: Sandbox overview और क्षमताएँ
description: E2B SDK या SandBase Console से sandboxes बनाएँ, status, logs और metrics देखें, और अलग experimental Playground आज़माएँ।
---

# Sandbox overview और क्षमताएँ {#sandbox-overview-and-capabilities}

Sandbox, commands चलाने, code execute करने और files पढ़ने या लिखने के लिए isolated environments देता है। किसी instance को pause करें, उससे फिर से connect करें, और persistence की पुष्टि के लिए कोई file वापस पढ़ें।

[Quickstart / E2B SDK](./quickstart) · [Playground खोलें (Experimental)](./playground)

अपने application में Sandbox integrate करने के लिए [आधिकारिक E2B SDK](./quickstart) का उपयोग करें। Sandboxes बनाने और instance status, logs और metrics देखने के लिए [Sandbox Console](https://www.sandbase.ai/console/sandboxes) में sign in करें। परिचय के लिए [Sandbox product overview](https://www.sandbase.ai/sandbox) देखें। नीचे दिया गया walkthrough और support table अलग Experimental Playground के बारे में हैं।

## पाँच मिनट का Playground walkthrough {#a-five-minute-playground-walkthrough}

1. Sandbox permissions वाली [API key](/getting-started/api-keys) दर्ज करें। Connect करने पर केवल templates और instances पढ़े जाते हैं।
2. कोई उपलब्ध template चुनें, resource notice स्वीकार करें, और एक अल्पकालिक instance बनाएँ।
3. System information या Python example चलाएँ। Command panel के साथ output और process events देखें।
4. एक text file लिखें और उसकी पुष्टि करें, instance को pause करें, resume करें, और वही file फिर से पढ़ें।
5. Lifecycle events, metrics, logs और machine-time evidence देखें। काम पूरा होने पर अपना instance delete करें।

Page refresh करने से page credentials और local operation history साफ़ हो जाती है; इससे sandboxes delete नहीं होते। चल रहे instances server timeout का पालन करते हैं। Paused instances resources बनाए रख सकते हैं। Instance IDs दर्ज करें, और page छोड़ने के बाद resources का मिलान और cleanup करने के लिए अपने organization के tools का उपयोग करें।

## क्षमताएँ और सीमाएँ {#capabilities-and-boundaries}

| क्षमता | Playground support |
| --- | --- |
| Create, list, pause, resume, timeout बढ़ाना, delete | उपलब्ध; बदलाव वाले controls केवल इस page session में बनाए गए instances पर लागू होते हैं |
| Commands और text files | उपलब्ध; commands अधिकतम 25 seconds तक चलते हैं, file editing `/tmp/` और 32 KiB तक सीमित है |
| Lifecycle events, logs, metrics, machine time | उपलब्धता environment के अनुसार बदलती है; लौटाए गए results देखें |
| AI chat और conversation context | Integrated नहीं; model configuration और Agent workload की ज़रूरत है |
| PTY, application ports, webhooks, template builds | इस interface में उपलब्ध नहीं |
| Snapshots और fork | इस Playground में उपलब्ध नहीं |

Shell interaction, AI chat नहीं है। Instance recovery, file persistence, process का बने रहना और conversation continuity, ये अलग-अलग चीज़ें हैं जिनकी अलग से पुष्टि करनी होती है।

## Events को समझना {#understanding-events}

**Sandbox lifecycle** entries native server events हैं जो refresh पर fetch होती हैं और देर से आ सकती हैं। **Sandbox process** entries process starts और streamed output का विवरण देती हैं। **Playground** entries local request के पूरा होने या विफल होने को दर्ज करती हैं; ये service lifecycle events नहीं हैं।

खाली list शून्य usage साबित नहीं करती, और events न होने से यह साबित नहीं होता कि कोई operation विफल हुआ। Machine-time evidence अंतिम bill नहीं है। Timeout या बाधित connection के बाद, दूसरी create request आज़माने से पहले instances का मिलान करें।

## टेम्पलेट दृश्यता {#template-visibility}

Templates public हो सकते हैं या आपके organization के लिए private। उनकी संख्या तय नहीं है। बिना नाम वाली entries भी दिखती रहती हैं, जिनके लिए aliases या IDs को fallback labels के रूप में उपयोग किया जाता है। आप कौन-से templates देख और उपयोग कर सकते हैं, यह आपके organization के access और template availability पर निर्भर करता है।

## Sandboxes और Agent Sessions {#sandboxes-and-agent-sessions}

Agents Sessions, SandBase के hosted cloud में चलते हैं। ये E2B SDK से बनाए गए Sandbox instances से अलग हैं, और Agents API, Sandbox instances उपलब्ध नहीं कराती। [Sessions](/agents/sessions) देखें।

