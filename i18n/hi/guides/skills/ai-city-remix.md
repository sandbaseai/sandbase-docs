---
i18nSource: ff1347dede49419a
agentDoc: ai-city-remix-agent-en
title: AI City Remix में भाग लें
description: AI City Remix credits claim करें, एक शहर और Skill चुनें, अपने local agent से video बनाएँ, और उसे समीक्षा के लिए upload करें।
---

# AI City Remix में भाग लें {#enter-ai-city-remix}

Event पेज पर एक Skill और शहर चुनें, फिर पूरे instructions अपने local agent को सौंप दें। बनने के बाद, agent video, cover और entry का विवरण upload करता है और उन्हें समीक्षा के लिए submit करता है।


## ज़रूरी चीज़ें {#prerequisites}

- एक SandBase account।
- Command execution और file access वाला एक local agent।
- Video, cover और project files के लिए एक working folder।

अपने पहले local setup के लिए, [Skill को locally इस्तेमाल करें](/guides/skills/local-use) देखें।

## 1. Event खोलें और credits claim करें {#_1-open-the-event-and-claim-credits}

1. [AI City Remix](https://www.sandbase.ai/lab/event/aicityremix?lang=en) खोलें और मौजूदा [event rules](https://www.sandbase.ai/lab/event/aicityremix?tab=rules&lang=en) पढ़ें।
2. “Claim $5 free & create” पर click करें और कहे जाने पर sign in करें।
3. System event credits claim करता है और उन्हें अपने-आप redeem करने की कोशिश करता है। Balance और redemption status जाँचें; retry की ज़रूरत हो तो redemption action इस्तेमाल करें।
4. Claim करने के बाद, creation dialog खोलने के लिए “Create now” पर click करें।

Claim की तारीखें, उपलब्धता और पात्रता event पेज पर दिखाई जाती हैं। Model calls वास्तविक usage के अनुसार credits खर्च करते हैं; उन्हें [Billing](https://www.sandbase.ai/console/billing) में देखें।

## 2. Model API key configure करें {#_2-configure-a-model-api-key}

अगर आपके account में कोई इस्तेमाल योग्य API key नहीं है, तो flow एक “Create an API key” dialog दिखाता है।

1. दिखाई गई spending cap और expiry देखें, फिर “Create API key” पर click करें।
2. “Create with this key” पर click करें। नई key agent को सौंपे जाने वाले पूरे instructions में शामिल हो जाती है।
3. पूरे instructions किसी भरोसेमंद agent को भेजें और उन्हें private workspace में रखें।

किसी मौजूदा key के लिए, `SANDBASE_API_KEY` को अपने local agent की secure settings या execution environment के ज़रिए configure करें। Keys को [API Keys](https://www.sandbase.ai/console/keys) में manage करें।

## 3. Skill और brief चुनें {#_3-choose-a-skill-and-brief}

Dialog एक official Skill, शहर, कहानी और creative direction पहले से चुने हुए के साथ शुरू होता है।

- Summary और विवरण पढ़ने और visual approach चुनने के लिए “Official Skill” खोलें।
- किसी शहर को search करने या map पर कोई location चुनने के लिए “Creative brief” खोलें।
- Suggestions को shuffle करें या कहानी और creative direction को सीधे edit करें।
- Map location, समर्थित भाषा और output style की पुष्टि करें।

इतिहास, लोगों और घटनाओं के लिए सत्यापित किए जा सकने वाले स्रोत इस्तेमाल करें। भाषा और अवधि के समर्थन के लिए चुने गए Skill का विवरण देखें।

## 4. Instructions copy करें और बनाएँ {#_4-copy-the-instructions-and-create}

1. Prompt area में “Copy all” पर click करें।
2. अपने local agent में project folder खोलें, एक task शुरू करें, और पूरे instructions paste करें।
3. उन्हें भेजें, माँगे गए inputs दें, dependencies configure करें, और creation शुरू करें।

Instructions में चुना गया Skill, creative brief, entry metadata format और upload authorization शामिल होते हैं। पूरा handoff रखें ताकि agent काम बनाकर submit कर सके।

“Preparing” का अर्थ है कि upload access तैयार किया जा रहा है। इसे फिर से तैयार करने के लिए “Retry” इस्तेमाल करें, या छूटा हुआ विवरण भरने के लिए “Complete brief”।

## 5. Creation की प्रगति देखें {#_5-follow-creation-progress}

Skill, models और video की लंबाई के आधार पर creation में दसियों मिनट से लेकर घंटों तक लग सकते हैं, और इसमें model credits खर्च होते हैं। Agent को चलता रहने दें और computer को जगा रखें।

उसी task में budget और प्रगति के instructions जोड़ें:

```text
My model-call budget is [AMOUNT] USD. Ask before exceeding it.
Report the current step, saved files, and next step, then continue creation.
```

मौजूदा event rules के अनुसार SandBase के ज़रिए MiniMax M3.1 Flash इस्तेमाल करें। अवधि, resolution, subtitles और file sizes के लिए event और upload पेज की ज़रूरतों का पालन करें।

## 6. Submit करें और review status जाँचें {#_6-submit-and-check-review-status}

Agent official upload client इस्तेमाल करने, video, cover और metadata upload करने, और समीक्षा के लिए submit करने के लिए पूरे instructions का पालन करता है।

प्रगति जाँचने के लिए [My entries](https://www.sandbase.ai/lab/event/aicityremix/mine?lang=en) खोलें:

| Status | अगला कदम |
|---|---|
| Draft | Film पूरी करें, files upload करें, और समीक्षा के लिए submit करें। |
| Pending review | Review status पर नज़र रखें। |
| Approved | Public entry पेज खोलें और उसे share करें। |
| Changes requested | Review note के अनुसार बदलाव करें और फिर से submit करें। |

किसी मौजूदा film के लिए, event पेज पर “Upload existing video” चुनें, विवरण भरें, video और cover upload करें, और समीक्षा के लिए submit करें।

## 7. Upload फिर से शुरू करें {#_7-resume-an-upload}

अगर authorization expire हो जाए या upload बीच में रुक जाए, तो मूल files के साथ जारी रखें:

1. Video, cover, `entry.json` और working folder रखें।
2. My entries में वही draft खोजें और “Resume upload” पर click करें।
3. नए resume instructions को मूल agent task में copy करें।
4. Agent से मौजूदा files upload और submit करने को कहें, फिर My entries में status जाँचें।

## 8. अपनी entry share करें {#_8-share-your-entry}

Approved entry पेज पर, पहले से भरा composer खोलने के लिए “Share on X” पर click करें। इसमें entry link, `#AICityRemix`, `@SandbaseAI` और official event post शामिल होते हैं।

Video post प्रकाशित करने के लिए, पहले “Download video” पर click करें, X composer में file जोड़ें, text की समीक्षा करें, और प्रकाशित करें।

## संबंधित documentation {#related-documentation}

- [Skill को locally इस्तेमाल करें](/guides/skills/local-use)
- [अपना agent connect करें](/setup/)
- [API keys configure करें](/getting-started/api-keys)
