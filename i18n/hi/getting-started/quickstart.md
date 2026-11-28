---
i18nSource: 8cb9626a2127cb8d
title: क्विक स्टार्ट
description: चुनें कि SandBase का उपयोग कैसे करना है — platform पर, API के ज़रिए, या अपने Agent के साथ। Skills और Tools खोजें, कदम अपनाएँ, और SDK या CLI repositories से शुरू करें।
pageClass: quickstart-page
---

# क्विक स्टार्ट {#quick-start}

## चुनें कि आप SandBase का उपयोग कैसे करना चाहते हैं {#connect}

ये **शुरू करने के तीन वैकल्पिक तरीके** हैं, तीन ऐसे कदम नहीं जिन्हें पूरा करना ज़रूरी हो। इन सभी में एक ही SandBase account और workspace इस्तेमाल करें।

<QuickstartPaths />

बस कोई तैयार task चाहिए? [Tools देखें](#use-tools) या [कोई Skill चुनें](#use-skills)। Sign in करने से पहले भी आप public catalogs और documentation देख सकते हैं।

### Open-source repositories से शुरू करें {#start-from-the-open-source-repositories}

- **[SandBase — SDKs & examples](https://github.com/sandbaseai/sandbase)**: Python, TypeScript और Go clients, API examples, और hosted Agent workflows। अपना application बनाते समय इसका उपयोग करें।
- **[SandBase CLI & MCP](https://github.com/sandbaseai/cli)**: अपना AI tool install और connect करें, या terminal से capabilities खोजें और चलाएँ। अपने मौजूदा Agent के साथ इसका उपयोग करें।

## शुरू करने से पहले: sign in करें {#create-account}

Playground इस्तेमाल करने, hosted Skill चलाने या API key बनाने से पहले sign in करें। Account के बिना काम करने वाले free tools सीधे इस्तेमाल किए जा सकते हैं। **पहले से signed in हैं? यह कदम छोड़ दें** और जाँच लें कि account menu में वही workspace दिख रहा है जिसे आप इस्तेमाल करना चाहते हैं।

SandBase, GitHub या Google का उपयोग करता है। अलग से email-और-password signup नहीं है।

1. [Create account / Sign in](https://www.sandbase.ai/login){target="_blank"} खोलें।
2. Security check पूरा करें, फिर **Sign in with GitHub** या **Sign in with Google** चुनें।
3. Provider window में access approve करें।
4. जिस page पर आप थे वहाँ लौटें, या [Console](https://www.sandbase.ai/console){target="_blank"} खोलें।

पहली बार login करने पर आपका account और एक **personal workspace** बनता है। SandBase आज़माने से पहले आपको organization बनाने की ज़रूरत नहीं है।

अगर welcome credit दिखाई दे, तो आप payment method जोड़े बिना शुरू कर सकते हैं। Console Dashboard पर **Balance** card और [Billing](https://www.sandbase.ai/console/billing){target="_blank"} वर्तमान balance दिखाते हैं।

## Platform पर {#use-on-website}

अगर आप पहले browser में कोई Model, API या Agent आज़माना चाहते हैं, तो यह चुनें — कोई client install नहीं और कोई code नहीं।

1. Sign in करें, फिर catalog खोलें:
   - [Language models](https://www.sandbase.ai/models){target="_blank"}
   - [Image और video models](https://www.sandbase.ai/models/image-video){target="_blank"}
   - [APIs](https://www.sandbase.ai/apis){target="_blank"}
   - [Agents](https://www.sandbase.ai/agents){target="_blank"}
2. किसी model या API का detail page खोलें और जहाँ उपलब्ध हो वहाँ **Playground** चुनें।
3. ज़रूरी inputs दें, जैसे prompt, image, search query या URL। चलाने से पहले दिखाई गई price जाँचें।
4. Request चलाएँ और लौटाया गया text, data, image, video या task status देखें।

Website Playground के लिए आपको अलग API key बनाने की ज़रूरत नहीं है। अगर किसी capability में Playground नहीं है, तो उसका **API** tab इस्तेमाल करें और नीचे दिया गया API तरीका अपनाएँ।

## API के ज़रिए {#call-api}

अगर आप अपने app में एक capability जोड़ रहे हैं, तो यह चुनें।

1. अपने इच्छित workspace की कोई मान्य key दोबारा इस्तेमाल करें, या [Developer → API Keys](https://www.sandbase.ai/console/keys){target="_blank"} में **New key** से एक [API key](/getting-started/api-keys) बनाएँ। इसे तुरंत copy करें; यह केवल एक बार दिखाई जाती है।
2. Catalog filter करें और detail page खोलें:
   - [Language models](https://www.sandbase.ai/models){target="_blank"} — provider, capabilities, context और price के आधार पर filter करें
   - [Image और video models](https://www.sandbase.ai/models/image-video){target="_blank"} — text-to-image, image-to-image, text-to-video और image-to-video जैसे multimodal models filter करें
   - [APIs](https://www.sandbase.ai/apis){target="_blank"} — platform और data source के आधार पर API resources filter करें
3. **API** tab खोलें, example request copy करें, और उस endpoint के ज़रूरी fields भरें।
4. अपनी SandBase key को server environment variable में store करें और request चलाएँ। इसे browser code या public repository में न डालें।
5. Response जाँचें। Asynchronous task के लिए, पूरा होने तक endpoint का status-polling example अपनाएँ।

**Bash / zsh** (macOS, Linux, या WSL के साथ Windows) के लिए language-model call का उदाहरण। Placeholder key को locally बदलें। अन्य environments के लिए नीचे दी गई repository में Python, TypeScript या Go examples इस्तेमाल करें; shell commands, PowerShell में वैसे ही नहीं चलते।

```bash
export SANDBASE_API_KEY="sk-YOUR_KEY"

curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Reply with one sentence explaining what an API is."}]
  }'
```

Code से शुरू करें: [GitHub पर SandBase SDKs & examples](https://github.com/sandbaseai/sandbase)।

और जानें: [पहली API Call](/getting-started/first-call)।

## अपने Agent के साथ {#use-in-ai-tool}

अगर आप Claude Code, Codex, Cursor, Kiro या कोई अन्य समर्थित client इस्तेमाल करते हैं और उस app के अंदर SandBase Models और APIs चाहते हैं, तो यह चुनें।

**Automatic local setup के लिए:** आपका client commands चला सकना चाहिए, और उसकी machine पर npm के साथ Node.js 20+ होना चाहिए। अगर आप chat-only client इस्तेमाल करते हैं, तो इसके बजाय उसके [client-specific connection instructions](/setup/) अपनाएँ।

1. Console में [Build → AI tools](https://www.sandbase.ai/console/setup){target="_blank"} खोलें।
2. यह line अपने AI assistant के chat में paste करें, फिर उसे बताएँ कि आप क्या बनाना चाहते हैं। यह chat instruction है, shell command नहीं:

   ```text
   set up https://www.sandbase.ai/SKILL.md
   ```

3. Agent जो browser sign-in खोलता है, उसे approve करें। कोई API key paste नहीं करनी होती।
4. नया session शुरू करें या app restart करें ताकि SandBase tools load हो जाएँ।
5. Agent से संबंधित tool खोजने और inspect करने को कहें, फिर अपनी authorization और budget के भीतर एक सीमित request करवाएँ। Development के लिए, उससे response को अपने project में integrate करवाएँ और run command तथा वास्तविक test results दिलवाएँ। केवल discovery से business API call verify नहीं होती।

Terminal पसंद है? `npx -y @sandbaseai/cli@latest connect` चलाएँ। यह जिन समर्थित clients को detect करता है उन्हें configure करता है; केवल एक को configure करने के लिए `npx -y @sandbaseai/cli@latest connect --client codex` इस्तेमाल करें (`codex` को अपने समर्थित client से बदलें)। उसके बाद उस client को restart करें। Paid run से पहले चुना गया workspace जाँचें।

उदाहरण के लिए, आप पूछ सकते हैं:

> AI agents के बारे में public X posts search करने के लिए एक SandBase API ढूँढो। पहले उसके ज़रूरी inputs और price inspect करो, फिर चलाने से पहले मुझे एक request की लागत बताओ। Result में मूल source links बनाए रखो।

Source और install instructions: [GitHub पर SandBase CLI & MCP](https://github.com/sandbaseai/cli)।

और जानें: [AI tools connect करें](/setup/)।

### अपने AI assistant से बनाने में मदद लें {#start-with-your-agent}

[Setup Skill](https://www.sandbase.ai/SKILL.md) आपकी वर्तमान स्थिति के अनुसार आपके agent का मार्गदर्शन करता है: अभी कोई account नहीं, मौजूदा API key, पहले से connected tool, मौजूदा project, या कोई नया feature। यह endpoint के inputs और price जाँचता है, integration implement करने में मदद करता है, और setup को verified call और काम करने वाले feature से अलग करके बताता है। इसे अपना लक्ष्य और कोई spending limit बताएँ; अपनी key chat में paste न करें।

पहले से key या project है? बता दें; आपको शुरुआत से शुरू करने की ज़रूरत नहीं है। उदाहरण के लिए: “मेरे पास SandBase key है। इस project में Similarweb traffic lookup जोड़ो; API inspect करो और पहले live-test की लागत दिखाओ।” जो assistant commands नहीं चला सकता या tools load नहीं कर सकता, उसे [client-specific setup path](/setup/) चाहिए।

[अपने agent को Markdown Quickstart दें](https://www.sandbase.ai/quickstart.md), या नीचे दिए गए कदम अपनाएँ। Setup Skill install करने से अपने आप कोई hosted Agent नहीं बनता।

### वैकल्पिक: SandBase पर hosted Agent चलाएँ {#build-agent}

अगर काम में कई कदम हैं या उसे दोबारा इस्तेमाल करना है, तो यह चुनें।

1. [Build → Agents](https://www.sandbase.ai/console/agents){target="_blank"} खोलें और **Create** चुनें।
2. **Overview** और **Instructions** भरें।
3. एक **Model** चुनें।
4. **Capabilities** में Skills और MCP tools जोड़ें, फिर **Runtime** set करें।
5. Session में test करने के लिए **Create & Chat** चुनें।
6. Agent के **API** tab से test किया गया version अपने app से call करें।

और जानें: [Build Agent](/agents/)। आधिकारिक OpenAI SDK से code में यही करने के लिए [OpenAI compatibility](/agents/openai-compatibility) देखें।

## Skills, Tools और बनाने के अन्य तरीके {#skills-and-tools}

अपने task से मेल खाने वाला resource चुनें। API इस्तेमाल करने के लिए आपको Skill install करने या hosted Agent बनाने की ज़रूरत नहीं है।

- **[Tools](https://www.sandbase.ai/tools):** तैयार interface में कोई विशेष task पूरा करें, जैसे text formatting या public data देखना।
- **[Skills](https://www.sandbase.ai/skills):** agent को instructions, scripts और examples के साथ दोबारा इस्तेमाल योग्य workflow दें।
- **Models & APIs:** Playground, अपने code या connected agent से कोई capability call करें। [Language models](https://www.sandbase.ai/models), [image & video](https://www.sandbase.ai/models/image-video) या [data APIs](https://www.sandbase.ai/apis) देखें।
- **[Hosted Agents](/agents/):** SandBase पर दोबारा इस्तेमाल योग्य agent configure करें और चलाएँ।
- **[Sandboxes](/sandbox/):** code को execute करने और files पर काम करने के लिए एक isolated environment दें।

### Tool इस्तेमाल करें {#use-tools}

1. [Tools](https://www.sandbase.ai/tools) खोलें और वह task चुनें जिसे आप पूरा करना चाहते हैं।
2. Tool की input requirements और pricing या quota label पढ़ें। Free utilities account के बिना काम कर सकती हैं; data tools चलाने के लिए SandBase sign-in चाहिए, और model tests के लिए आपकी अपनी key की ज़रूरत हो सकती है।
3. माँगा गया text, URL, file या अन्य inputs दें, फिर tool का run action इस्तेमाल करें।
4. Output देखें और जहाँ उपलब्ध हो वहाँ copy या download action इस्तेमाल करें। Data tool के लिए, अगर आप वही task automate करना चाहते हैं तो उसका linked API और request example इस्तेमाल करें।

**Free daily quota पूरे workspace में साझा होता है**, यह हर tool के लिए अलग allowance नहीं है। चलाने से पहले eligibility और दिखाई गई price जाँचें; free utility से कोई model या API call मुफ़्त नहीं हो जाती।

### Skill इस्तेमाल करें {#use-skills}

1. [Skills](https://www.sandbase.ai/skills) खोलें, कोई workflow चुनें, और उसके examples, ज़रूरी inputs और dependencies पढ़ें।
2. उस Skill के detail page पर उपलब्ध विकल्पों में से एक चुनें:
   - **Run online:** sign in करें और जहाँ उपलब्ध हो वहाँ hosted example चलाएँ। उसकी progress देखें और परिणामी output या files खोलें। दिखाया गया allowance जाँचें; उपलब्धता और सीमाएँ हर Skill में अलग होती हैं।
   - **Install / Download:** जहाँ उपलब्ध हो वहाँ package download करने के लिए sign in करें। पूरे package को एक working folder में extract करें, फिर उसके installation instructions अपनाएँ या अपने local agent से उसकी `SKILL.md` पढ़ने को कहें।
3. Local उपयोग के लिए, अपना task, inputs, अपेक्षित output और spending limit दें। [Agent path](#use-in-ai-tool) से SandBase connect करें; अगर Skill के scripts को key चाहिए, तो उसे chat में paste करने के बजाय execution environment में configure करें।
4. वास्तविक result देखें। Skill download करने या अपना agent connect करने का अर्थ यह नहीं है कि workflow सफलतापूर्वक चल गया है।

SandBase **setup Skill** आपके client को connect करता है; catalog Skills अलग-अलग workflows बताते हैं। Install करने से पहले हर Skill की dependencies और समर्थित client जाँचें। Local workflow द्वारा इस्तेमाल किए गए Model और API calls पर usage charges लग सकते हैं।

Input folders और saved deliverables सहित पूरे walkthrough के लिए [Skill को locally इस्तेमाल करें](/guides/skills/local-use) देखें।

## वैकल्पिक: team workspace साझा करें {#create-organization}

API keys, usage और billing किसी organization से जुड़े होते हैं। अगर आप अकेले evaluate कर रहे हैं तो personal workspace में ही रहें। जब कई लोग keys और खर्च साझा करेंगे, तब team बनाएँ।

| Workspace | कब इस्तेमाल करें |
|---|---|
| **Personal** | पहली बार login पर अपने आप बनता है। हर user के लिए एक। |
| **Team** | साझा members, keys और balance। इसे किसी company या project के लिए बनाएँ। |

### Team बनाएँ {#create-team}

1. [Create team](https://www.sandbase.ai/console/members?create=1){target="_blank"} खोलें, या Console के top right में account menu से **Create Team** चुनें।
2. **Team name** दर्ज करें, फिर **Create team** चुनें।
3. पुष्टि करें कि account menu अब उस team को active workspace के रूप में दिखा रहा है।
4. **Developer → Team** पर **Add member** चुनें, किसी मौजूदा SandBase account का **Account email** दर्ज करें, और **Workspace role** (Member या Admin) चुनें।

Invite किए गए व्यक्ति के पास पहले से SandBase account होना चाहिए। अगर नहीं है, तो उन्हें [यह page](/getting-started/quickstart) भेजें ताकि वे पहले sign in कर सकें, फिर उन्हें जोड़ें।

अगर आप एक से अधिक organizations में हैं, तो account menu से switch करें। Keys और billing **active** organization के अनुसार चलते हैं। Roles के लिए [Organizations](/admin/organizations) देखें।

## पुष्टि करें कि यह काम कर रहा है {#confirm-it-works}

आप तैयार हैं जब ये सभी बातें सही हों:

- Console account menu वही organization दिखाता है जिसे आप इस्तेमाल करना चाहते हैं।
- आपने एक तरीका पूरा किया: API call, website पर run, connected AI tool, या Agent।
- एक request सफल होता है।

अगर request विफल हो, तो active organization, key और [Errors](/guides/error-handling) जाँचें। Workspace में balance न बचा हो तो [Billing](https://www.sandbase.ai/console/billing){target="_blank"} में top up करें।

### अगर आप अटक जाएँ {#if-you-get-stuck}

| आपको क्या दिखता है | क्या जाँचें |
| --- | --- |
| Sign-in आवश्यक | Sign in करें, मूल page पर लौटें, और active workspace जाँचें। |
| अमान्य key या access denied | पुष्टि करें कि key इच्छित workspace की है और उसे endpoint तक access है। Credits जोड़ने से permissions ठीक नहीं होतीं। |
| अपर्याप्त balance या quota ख़त्म | Response पढ़ें: balance की समस्या के लिए Billing देखें, या quota limit के लिए दिखाया गया reset time देखें। |
| आपके Agent में कोई tools नहीं | नया client session शुरू करें, फिर [AI tools connect करें](/setup/) में दिए diagnostics अपनाएँ। |
| Task अभी चल रहा है | लौटाया गया task status या page का progress indicator देखें। एक ही paid request बार-बार submit करने से बचें। |

## Billing और usage {#billing-and-usage}

Sign in करने के बाद, active organization का खर्च देखें:

<QuickstartResources group="ops" />

## आगे क्या करें {#next-steps}

<QuickstartResources group="catalog" />

- [Tools](https://www.sandbase.ai/tools) — browser में task पूरा करें
- [Skills](https://www.sandbase.ai/skills) — दोबारा इस्तेमाल योग्य agent workflow खोजें
- [API keys](/getting-started/api-keys) — organization keys बनाएँ और rotate करें
- [Models और APIs catalog](https://www.sandbase.ai/models) — website पर Models, APIs और Agents आज़माएँ
- [AI tools connect करें](/setup/) — अपने AI tool को SandBase catalog दें
- [Build Agent](/agents/) — दोबारा इस्तेमाल योग्य Agents बनाएँ
- [API Reference](/api-reference/) — code के साथ integrate करें
