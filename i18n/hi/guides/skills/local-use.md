---
i18nSource: 31b3bd202f3dc24e
agentDoc: local-use-agent-en
title: Skill को locally उपयोग करें
description: SandBase Lab की कोई Skill चुनें, उसका package download करें, model access configure करें, और local agent के साथ project बनाकर सहेजें।
---

# Skill को locally उपयोग करें {#use-a-skill-locally}

SandBase Skill download करें और अपने computer पर किसी agent के साथ project पूरा करें। Skill में instructions, scripts और examples होते हैं। Agent उसकी `SKILL.md` में बताए गए workflow का पालन करता है।


## 1. Skill चुनें {#_1-choose-a-skill}

1. [SandBase Lab](https://www.sandbase.ai/lab/) खोलें।
2. Videos, animations और maps जैसे examples देखें। अपने project से मेल खाने वाली Skill खोलें।
3. Example, आवश्यक inputs, output format और समर्थित भाषाएँ देखें।
4. ZIP package सहेजने के लिए Skill के download action का उपयोग करें।

शहर के इतिहास पर map film के लिए, [City Through Time](https://www.sandbase.ai/lab/skills/city-through-time) के examples और instructions से शुरू करें।

## 2. Local working folder तैयार करें {#_2-prepare-a-local-working-folder}

1. एक project folder बनाएँ, जैसे `my-city-film`।
2. पूरा Skill ZIP उसमें extract करें, instructions, scripts और assets को बनाए रखते हुए।
3. अपने local agent में project खोलें और उसकी files तथा workflow के लिए आवश्यक commands का access दें।
4. Skill page के installation instructions का पालन करें, या agent से extract की गई `SKILL.md` को सीधे पढ़ने को कहें।

Project यह structure उपयोग कर सकता है:

```text
my-city-film/
  skill/          # Complete extracted Skill package
  inputs/         # Images, text, and other inputs
  outputs/        # Previews and deliverables
```

Skill द्वारा आवश्यक विशिष्ट filenames और output locations का उपयोग करें।

## 3. SandBase connect करें {#_3-connect-sandbase}

अपने agent में `set up https://www.sandbase.ai/SKILL.md` paste करें और उसके द्वारा खोले गए browser sign-in को approve करें, या terminal में `npx -y @sandbaseai/cli@latest connect` चलाएँ। इसके बाद नया agent session शुरू करें ताकि SandBase tools load हो जाएँ। यही विकल्प Console में [Build → AI tools](https://www.sandbase.ai/console/setup) पर भी हैं।

पूरे connection workflow के लिए [AI tools connect करें](/setup/) देखें।

यदि Skill के scripts को `SANDBASE_API_KEY` चाहिए:

1. [API Keys](https://www.sandbase.ai/console/keys) खोलें और project के लिए एक key बनाएँ या चुनें।
2. इसे अपने local agent की secure settings या script execution environment के ज़रिए configure करें।
3. Agent से जाँचने को कहें कि access configure है, और Skill workflow जारी रखें।

Key को secure local configuration में रखें। Deliverables, source files और public screenshots में केवल project की जानकारी शामिल करें। Model usage और अपना balance [Billing](https://www.sandbase.ai/console/billing) में देखें।

## 4. Brief दें {#_4-provide-a-brief}

Agent को बताएँ कि कौन-सी Skill उपयोग करनी है, क्या बनाना है, output की ज़रूरतें क्या हैं और आपका budget कितना है। इस उदाहरण को अपने project के अनुसार बदलें:

```text
Read SKILL.md in the project's skill folder and follow its workflow.

Topic: the story of Shanghai's development.
Deliverables: a playable video, a cover image, and usage notes.
Language and duration: use the Skill's supported options and state the plan before starting.
Models: use suitable models through SandBase.
Budget: model calls may use up to [AMOUNT] USD; ask me before exceeding it.

Check inputs and dependencies, then execute the workflow. Save previews and final files
in outputs. When finished, provide file paths, a summary, and the models actually used.
```

Agent instructions पढ़ता है, dependencies जाँचता है, inputs process करता है, और project generate या render करता है। माँगे गए assets उसी project में जोड़ें और task जारी रखें।

## 5. प्रगति देखें और परिणाम की समीक्षा करें {#_5-follow-progress-and-review-the-result}

अवधि Skill, models, assets और output की लंबाई पर निर्भर करती है। Video projects में दसियों मिनट से लेकर कई घंटे लग सकते हैं। Agent को चलता रहने दें और computer को sleep में न जाने दें।

उसी conversation में प्रगति पूछें:

```text
Report the current step, files already saved, and the next step, then continue the task.
```

दिए गए file paths खोलें, visuals, audio, captions और content की समीक्षा करें, और अंतिम files सहेजें।

## 6. Project में बदलाव करें {#_6-revise-the-project}

मूल task में विशिष्ट बदलाव माँगें और मौजूदा assets को दोबारा उपयोग करें:

```text
Keep the structure and other shots. Shorten the opening and correct the caption at 00:18.
Reuse existing assets and save the revised result as a new version.
```

यदि execution बाधित हो जाए, तो working folder रखें और agent से वर्तमान चरण से जारी रखने को कहें।

## अगले कदम {#next-steps}

- [AI City Remix में भाग लें](/guides/skills/ai-city-remix)
- [अपना agent connect करें](/setup/)
- [API keys configure करें](/getting-started/api-keys)

