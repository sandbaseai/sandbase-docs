---
i18nSource: 0d7d66842e233794
title: E2B SDK के साथ Sandbox quickstart
description: Official E2B JavaScript और Python SDKs को SandBase से जोड़ें, commands चलाएं, फ़ाइलें पढ़ें और लिखें, और sandbox को सुरक्षित रूप से मैनेज करें।
---

<script setup>
import SandboxPromo from '@theme/SandboxPromo.vue'
</script>

# E2B SDK के साथ Sandbox quickstart {#sandbox-quickstart-with-the-e2b-sdk}

<SandboxPromo />

अपनी SandBase API key के साथ official E2B SDK इस्तेमाल करके एक isolated sandbox बनाएं, कोई command चलाएं, और फ़ाइलें पढ़ें और लिखें। यह गाइड **E2B JavaScript और Python SDK 2.51.0** के लिए है।

Browser से instance बनाने और देखने के लिए [Sandbox Console](https://www.sandbase.ai/console/sandboxes) में साइन इन करें, instance बनाएं, और उसका status, logs और metrics देखें। Application integration के लिए नीचे दिए SDK steps जारी रखें, या [Sandbox product overview](https://www.sandbase.ai/sandbox) पढ़ें।

## 1. Official SDK कॉन्फ़िगर करें {#_1-configure-the-official-sdk}

[Console में SandBase API key बनाएं](https://www.sandbase.ai/console/keys), फिर मानक E2B environment variables कॉन्फ़िगर करें। Official SDK इन्हें JavaScript और Python दोनों में अपने आप पढ़ता है।

| Environment variable | मान |
|---|---|
| `E2B_API_KEY` | [Developer → API Keys](https://www.sandbase.ai/console/keys) से आपकी SandBase API key |
| `E2B_API_URL` | `https://sandbox.sandbase.ai` |
| `E2B_DOMAIN` | `sandbox.sandbase.ai` |
| `E2B_DEBUG` | `false` |
| `E2B_SANDBOX_URL` | इसे सेट न करें ताकि SDK हर sandbox का data-plane address इस्तेमाल करे |

```bash
# Inject your SandBase key as E2B_API_KEY through your environment or secret manager.
export E2B_API_URL="https://sandbox.sandbase.ai"
export E2B_DOMAIN="sandbox.sandbase.ai"
export E2B_DEBUG="false"
unset E2B_SANDBOX_URL
```

अगर आप key पहले से `SANDBASE_API_KEY` में स्टोर करते हैं, तो उसी का इस्तेमाल करें:

```bash
export E2B_API_KEY="$SANDBASE_API_KEY"
```

आपको सिर्फ़ अपनी SandBase API key चाहिए। Sandbox access के योग्य सामान्य SandBase key इस्तेमाल करें; किसी दूसरी capability तक सीमित key अस्वीकार हो सकती है। [API keys](/getting-started/api-keys) देखें।

### क्या मौजूदा E2B code बिना बदलाव के रह सकता है? {#can-existing-e2b-code-stay-unchanged}

हां, सपोर्टेड operations के लिए, अगर आपकी application पहले से SDK connection settings environment से पढ़ती है और उसका template SandBase पर उपलब्ध है। Official SDK और अपनी मौजूदा calls बनाए रखें; सिर्फ़ ऊपर दिए key, API URL और domain बदलें। Application code में दिए गए स्पष्ट connection options, environment variables से ऊपर होते हैं, इसलिए hardcoded E2B endpoint, domain या provider key को हटाएं या अपडेट करें।

`E2B_API_URL` और `E2B_DOMAIN` **दोनों** सेट करें। सिर्फ़ domain देने पर SDK 2.51.0 एक अतिरिक्त `api.` prefix के साथ API host बनाता है। `E2B_SANDBOX_URL` हर instance के command/file address को override करता है; इसे control API origin पर सेट न करें। Debug mode local development के लिए SDK का address चयन बदल देता है, इसलिए इस HTTPS service के लिए इसे disabled रखें।

Control API instances बनाता और मैनेज करता है। Commands, files और application ports `sandbox.sandbase.ai` के अंदर हर instance के अलग subdomains इस्तेमाल करते हैं। Model API का `/v1` prefix न जोड़ें। सिर्फ़ control API request सफल होने से command/file access या provider की सभी features की पुष्टि नहीं होती।

उदाहरण process environment variables पढ़ते हैं। `.env` फ़ाइल तभी काम करती है जब आपकी application या launcher SDK इस्तेमाल करने से पहले उसे load करे।

### Template चुनें {#choose-a-template}

अपने organization को दिखने वाले templates की सूची के लिए अपनी SandBase key इस्तेमाल करें:

```bash
curl --fail --silent --show-error 'https://sandbox.sandbase.ai/v2/templates?limit=100' \
  -H "X-API-Key: $E2B_API_KEY"
```

`buildStatus: "ready"` वाला template चुनें और उसका `templateID` कॉपी करें। Display names `names` या `aliases` में दिए जाते हैं; दोनों खाली हों तो ID इस्तेमाल करें। `public` field, public templates को आपके organization को दिखने वाले private templates से अलग करता है।

Response एक array है। अगर response headers में `X-Next-Token` है, तो अगला पेज पाने के लिए उसका मान `nextToken` query parameter के रूप में भेजें।

चुना गया template ID सेट करें:

```bash
export SANDBASE_TEMPLATE_ID="YOUR_TEMPLATE_ID"
```

`SANDBASE_TEMPLATE_ID` नीचे के उदाहरणों में इस्तेमाल होने वाला variable है, E2B SDK की built-in setting नहीं। उदाहरण इसे स्पष्ट रूप से `Sandbox.create` को भेजते हैं। मौजूदा code अपना template argument बनाए रख सकता है, अगर वह ID या name SandBase पर उपलब्ध है। यह न मानें कि upstream E2B template ID या SDK का डिफ़ॉल्ट `base` उपलब्ध है; अगर सूची खाली है, तो अपने organization के लिए template access का अनुरोध करें।

## 2. बनाएं, चलाएं और साफ़ करें {#_2-create-execute-and-clean-up}

ये उदाहरण एक असली resource बनाते हैं। ये दो मिनट की lifetime इस्तेमाल करते हैं और `finally` में instance को स्पष्ट रूप से डिलीट करते हैं। पहले एक उदाहरण चलाएं और दोबारा चलाने से पहले cleanup की पुष्टि करें।

### JavaScript {#javascript}

किसी application directory में Node.js 22 या नया version इस्तेमाल करें:

```bash
npm install --save-exact e2b@2.51.0
```

`sandbox-example.mjs` के रूप में सेव करें:

```js
import { randomUUID } from 'node:crypto';
import { Sandbox } from 'e2b';

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

const options = {
  requestTimeoutMs: 30_000,
  retries: 0,
};
const template = required('SANDBASE_TEMPLATE_ID');
const runId = randomUUID();
let sandbox;

// Keep this identifier if creation times out before returning an instance ID.
console.log('Run ID:', runId);
try {
  sandbox = await Sandbox.create(template, {
    ...options,
    timeoutMs: 120_000,
    metadata: { quickstartRunId: runId },
  });
  console.log('Sandbox ID:', sandbox.sandboxId);

  const result = await sandbox.commands.run('printf hello-sandbase', {
    timeoutMs: 15_000,
  });
  if (result.exitCode !== 0 || result.stdout !== 'hello-sandbase') {
    throw new Error('Command verification failed');
  }

  const path = '/tmp/sandbase-hello.txt';
  await sandbox.files.write(path, 'hello from SandBase');
  if (await sandbox.files.read(path) !== 'hello from SandBase') {
    throw new Error('File verification failed');
  }
  console.log('Command and file checks passed');
} catch {
  console.error('Sandbox example failed; retain the run ID for troubleshooting');
  process.exitCode = 1;
} finally {
  if (sandbox) {
    try {
      await Sandbox.kill(sandbox.sandboxId, options);
      console.log('Sandbox cleanup completed');
    } catch {
      console.error('Cleanup failed; delete the recorded Sandbox ID');
      process.exitCode = 1;
    }
  }
}
```

SDK environment variables और चुने गए template को कॉन्फ़िगर करके चलाएं:

```bash
node sandbox-example.mjs
```

### Python {#python}

अपने Python environment में pinned SDK install करें:

```bash
python -m pip install 'e2b==2.51.0'
```

`sandbox_example.py` के रूप में सेव करें:

```python
import os
import sys
import uuid
from e2b import Sandbox

options = {
    "request_timeout": 30,
}
template = os.environ["SANDBASE_TEMPLATE_ID"]
run_id = str(uuid.uuid4())
sandbox = None
failed = False

print("Run ID:", run_id)
try:
    sandbox = Sandbox.create(
        template, timeout=120,
        metadata={"quickstartRunId": run_id}, **options,
    )
    print("Sandbox ID:", sandbox.sandbox_id)

    result = sandbox.commands.run("printf hello-sandbase", timeout=15)
    if result.exit_code != 0 or result.stdout != "hello-sandbase":
        raise RuntimeError("Command verification failed")

    path = "/tmp/sandbase-hello.txt"
    sandbox.files.write(path, "hello from SandBase")
    if sandbox.files.read(path) != "hello from SandBase":
        raise RuntimeError("File verification failed")
    print("Command and file checks passed")
except Exception:
    print("Sandbox example failed; retain the run ID for troubleshooting")
    failed = True
finally:
    if sandbox is not None:
        try:
            Sandbox.kill(sandbox.sandbox_id, **options)
            print("Sandbox cleanup completed")
        except Exception:
            print("Cleanup failed; delete the recorded Sandbox ID")
            failed = True

sys.exit(1 if failed else 0)
```

```bash
python sandbox_example.py
```

सफलता का मतलब है कि command/file verification और cleanup दोनों पूरे हुए। Run और sandbox IDs को अपने organization के भीतर रखें। SDK object को log न करें: उसमें access tokens हो सकते हैं।

अगर बिना ID मिले creation timeout हो जाए, तो resource फिर भी मौजूद हो सकता है। दूसरा बनाने से पहले अपने operator से `quickstartRunId` metadata के ज़रिए उसे ढूंढने को कहें। Timeout या बाधित process से deletion की पुष्टि नहीं होती; process को ज़बरदस्ती बंद करने के बाद `finally` नहीं चल सकता।

## 3. Lifetime बढ़ाएं या pause करके फिर से कनेक्ट करें {#_3-extend-the-lifetime-or-pause-and-reconnect}

इन snippets को संबंधित उदाहरण के `try` block में file check के बाद और cleanup से पहले डालें। Pause/resume को चुने गए template और provider द्वारा सपोर्ट होना चाहिए।

JavaScript इन SDK timeouts के लिए **milliseconds** इस्तेमाल करता है:

```js
await sandbox.setTimeout(300_000);
const id = sandbox.sandboxId;
await sandbox.pause();
sandbox = await Sandbox.connect(id, { ...options, timeoutMs: 120_000 });
if (await sandbox.files.read('/tmp/sandbase-hello.txt') !== 'hello from SandBase') {
  throw new Error('File did not survive pause and reconnect');
}
```

Python **seconds** इस्तेमाल करता है:

```python
sandbox.set_timeout(300)
sandbox_id = sandbox.sandbox_id
sandbox.pause()
sandbox = Sandbox.connect(sandbox_id, timeout=120, **options)
if sandbox.files.read("/tmp/sandbase-hello.txt") != "hello from SandBase":
    raise RuntimeError("File did not survive pause and reconnect")
```

Reconnect एक नया SDK object और session credentials लौटाता है। आगे के commands और files के लिए उसी object का इस्तेमाल करें। Sandbox डिलीट करने पर उसका lifecycle खत्म हो जाता है; यह गाइड deletion के बाद storage बने रहने का वादा नहीं करती। Sandbox की lifetime और किसी एक command या HTTP request का timeout अलग-अलग settings हैं।

## 4. Application ports तक पहुंच {#_4-access-application-ports}

जब आपकी application sandbox के अंदर listen करने लगे, तो उसका host पाने के लिए JavaScript में `sandbox.getHost(port)` या Python में `sandbox.get_host(port)` इस्तेमाल करें। Application traffic के लिए `e2b-traffic-access-token` header ज़रूरी है, जिसमें मौजूदा connection का `sandbox.trafficAccessToken` या `sandbox.traffic_access_token` इस्तेमाल होता है।

सिर्फ़ host से access की अनुमति नहीं मिलती। आपके HTTP या WebSocket client को यह header भेजना होगा; browser tab में URL खोलने से यह नहीं जुड़ता। Traffic tokens और signed file URLs को credentials मानें, और उन्हें logs और साझा links से दूर रखें। Port access को चुने गए sandbox environment द्वारा सपोर्ट होना चाहिए।

## समस्या निवारण {#troubleshooting}

| लक्षण | क्या जांचें |
|---|---|
| Authentication या scope error | SandBase key की वैधता, organization access और key scope |
| Template नहीं मिला | सटीक enabled template ID/name और आपके organization के लिए उसकी visibility |
| Create सफल होता है लेकिन commands/files विफल होते हैं | आपका network connection और मौजूदा session credentials; फिर से कनेक्ट करें और समस्या बनी रहे तो support से संपर्क करें |
| Requests गलत service पर जाते हैं | `E2B_API_URL`, `E2B_DOMAIN`, और इन्हें override करने वाले hardcoded SDK options |
| Pause के बाद access विफल होता है | फिर से कनेक्ट करें और नया लौटा SDK object इस्तेमाल करें |
| Application port request अस्वीकार करता है | Application की readiness और मौजूदा traffic token header |
| `unsupported_operation` | चुना गया provider वह operation सपोर्ट नहीं करता; उस पर निर्भर होने से पहले उपलब्धता जांचें |
| Create response अज्ञात है | दूसरा instance बनाने से पहले दर्ज run ID से मिलान करें |
| Cleanup विफल होता है | दर्ज instance ID के लिए deletion दोबारा करें; पूरा create flow फिर से न चलाएं |

उदाहरण बुनियादी command/file workflow दिखाते हैं। Template builds, snapshots, events, webhooks और advanced networking के लिए अलग capability जांच चाहिए। सिर्फ़ E2B SDK install करने से हर provider के साथ पूरी compatibility साबित नहीं होती।

## SDK संदर्भ {#sdk-references}

- [E2B documentation](https://e2b.dev/docs)
- [E2B JavaScript SDK 2.51.0](https://www.npmjs.com/package/e2b/v/2.51.0)
- [E2B Python SDK 2.51.0](https://pypi.org/project/e2b/2.51.0/)
