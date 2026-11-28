---
i18nSource: 20679b8b1344acb5
title: Sandbox Playground (प्रायोगिक)
description: अपनी API key से असली SandBase sandboxes आज़माएँ। Sandbox बनाएँ, commands चलाएँ, pause और resume के बाद files जाँचें, और lifecycle events देखें।
outline: false
aside: false
pageClass: sandbox-playground-page
---

# Sandbox Playground {#sandbox-playground}

अपनी key से Sandbox API आज़माएँ। Operations **sandbox.sandbase.ai** से connect होते हैं और इन पर शुल्क लग सकता है।

<ClientOnly>
  <SandboxPlayground />
</ClientOnly>

## आपकी key आपके नियंत्रण में रहती है {#your-key-stays-under-your-control}

- **केवल page memory में।** यह Playground आपकी API key या connection tokens को browser storage या cookies में save नहीं करता, उन्हें URLs में नहीं डालता, और page activity या request examples में दर्ज नहीं करता।
- **कभी भी clear करें।** key, connection tokens और दिखाई गई activity हटाने के लिए **Clear key** चुनें, भले ही कोई request चल रहा हो। यह page refresh करने या छोड़ने पर भी ये clear हो जाते हैं। दोबारा connect करने के लिए आपको अपनी key फिर से डालनी होगी।
- **केवल आपके requests के लिए इस्तेमाल।** आपकी key SandBase को भेजी जाती है ताकि आपके द्वारा अनुरोधित Sandbox operations authenticate हो सकें। यह page clear करने से key revoke नहीं होती; ज़रूरत हो तो उसे [Developer → API Keys](https://www.sandbase.ai/console/keys) में revoke करें।

ये वादे केवल इस Playground द्वारा credentials के handling पर लागू होते हैं। इनका अर्थ यह नहीं है कि Sandbox activity या service-side usage records मिटा दिए जाते हैं। Commands या files में secrets डालने से बचें, क्योंकि उनका content आपके sandbox में बना रह सकता है।

## Resources को अलग से clean up करें {#clean-up-resources-separately}

अपनी key clear करने से service को पहले ही मिल चुका operation cancel नहीं होता और न ही कोई sandbox delete होता है। काम पूरा होने पर instances delete करें। अगर किसी creation का result पता नहीं है, तो नया बनाने से पहले अपने instances जाँचें। यह page clear करने से पहले cleanup के लिए ज़रूरी instance IDs सँभालकर रखें।

[Overview और capabilities](./index) · [Quickstart / E2B SDK](./quickstart)
