---
i18nSource: 4bd032d88bac0470
title: Seedance वीडियो (Volcengine Ark प्रोटोकॉल)
description: Volcengine Ark Contents Generations task protocol से Seedance 2.0 और 2.5 videos generate करें, जिसमें inputs, polling, billing और media Assets शामिल हैं।
aside: false
outline: false
apiReference:
  title: Seedance Video
  operation: Video
  method: POST
  path: /api/v3/contents/generations/tasks
  description: Seedance video task submit करें। सफल submission HTTP 200 और एक SandBase task id लौटाता है।
  groups:
    - title: Request body
      fields:
        - name: model
          type: string
          required: true
          description: "समर्थित model identifier: bytedance/seedance/2.0-official या bytedance/seedance/2.5-official।"
        - name: content
          type: array
          required: true
          description: Typed text और वैकल्पिक media inputs। Items के रूप model द्वारा validate किए जाते हैं।
        - name: duration
          type: integer
          required: false
          description: बिना बदलाव के model को भेजा जाता है। Model validation लागू होता है।
        - name: resolution
          type: string
          required: false
          description: बिना बदलाव के model को भेजा जाता है। Model validation लागू होता है।
        - name: ratio
          type: string
          required: false
          description: बिना बदलाव के model को भेजा जाता है। Model validation लागू होता है।
        - name: generate_audio
          type: boolean
          required: false
          description: बिना बदलाव के model को भेजा जाता है। समर्थित होने पर generated audio का अनुरोध करें।
  examples:
    - label: Text to video
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "bytedance/seedance/2.0-official",
            "content": [{"type": "text", "text": "A paper boat crossing a rain puddle"}],
            "duration": 5,
            "resolution": "720p"
          }'
  response:
    status: 200 OK
    code: '{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }'
---

<ApiReferencePage />

## Seedance गाइड {#seedance-guide}

Seedance, text, शुरुआती और अंतिम frames, और images, video तथा audio जैसे multimodal references से video generate करता है।
इसे साधारण text-to-video clip से लेकर ऐसे directed shot तक, किसी भी चीज़ के लिए उपयोग करें जो किसी visual subject, camera
movement और soundtrack का पालन करता हो।

Generation asynchronous है। Task submit करें, फिर उसे तब तक poll करें जब तक वह terminal status तक न पहुँच जाए।

## Model चुनना {#choosing-a-model}

| `model` | किसके लिए सबसे उपयुक्त | Output resolutions |
| --- | --- | --- |
| `bytedance/seedance/2.5-official` | 1080p delivery और उपलब्ध सबसे ऊँचा output resolution | 480p, 720p, 1080p |
| `bytedance/seedance/2.0-official` | जब 480p या 720p पर्याप्त हो, तब कम लागत वाला generation | 480p, 720p |

दोनों models एक ही multimodal input स्वीकार करते हैं और एक ही request shape में text-to-video, image-to-video और multimodal reference
workflows का समर्थन करते हैं। जब 480p या 720p आपकी ज़रूरत पूरी करता हो और आप कम कीमत वाला विकल्प चाहते हों, तो `2.0-official` चुनें।
जब आपको 1080p चाहिए, तो `2.5-official` चुनें।

## API संदर्भ {#api-reference}

| Method | Path |
| --- | --- |
| `POST` | `/api/v3/contents/generations/tasks` |
| `GET` | `/api/v3/contents/generations/tasks/{task_id}` |

Tasks की listing और किसी task को cancel या delete करना समर्थित नहीं है। Result प्राप्त करने के लिए लौटाया गया task `id` सहेज लें।

हर request को उसी API key से authenticate करें जिससे task बनाया गया था:

```
Authorization: Bearer $SANDBASE_API_KEY
```

`model` value, [Model चुनना](#choosing-a-model) में दिए गए नामों में से किसी एक से मेल खानी चाहिए। Results पाने का समर्थित तरीका
polling है; इस endpoint के लिए `callback_url` पर निर्भर न रहें।

## क्विकस्टार्ट {#quickstart}

Task submit करें:

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "A slow cinematic push across an alpine lake at sunrise"}
    ],
    "ratio": "16:9",
    "resolution": "720p",
    "duration": 5,
    "generate_audio": true
  }'
```

```json
{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }
```

उस id के साथ task को हर 5 से 10 seconds में poll करें, जब तक `status` `succeeded`, `failed`, `expired` या `cancelled` न हो जाए:

```bash
curl https://api.sandbase.ai/api/v3/contents/generations/tasks/158d2649-e01d-45b9-b88a-ef3c450c601c \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "158d2649-e01d-45b9-b88a-ef3c450c601c",
  "model": "bytedance/seedance/2.5-official",
  "status": "succeeded",
  "created_at": 1787059000,
  "updated_at": 1787059150,
  "content": { "video_url": "https://media.sandbase.ai/files/158d2649.../0.mp4" },
  "usage": { "completion_tokens": 108900, "total_tokens": 108900 }
}
```

Generate किया गया video `content.video_url` पर उपलब्ध होता है।

## Input workflow चुनें {#choose-an-input-workflow}

API सात सामान्य input workflows का समर्थन करती है। `content` के हर item में एक `type` होता है; item types और
roles का संयोजन workflow तय करता है:

| लक्ष्य | `content` संयोजन | कब उपयोग करें |
| --- | --- | --- |
| Text to video | Text | जब पूरा scene prompt में बताया जा सके |
| शुरुआती frame को animate करें | Text (वैकल्पिक) + `first_frame` वाली image | जब पहला frame दी गई image से मेल खाना चाहिए |
| दो frames के बीच transition | Text (वैकल्पिक) + `first_frame` + `last_frame` | जब shot की शुरुआत और अंत नियंत्रित होने चाहिए |
| किसी visual reference का पालन करें | Text (वैकल्पिक) + `reference_image` वाली image | जब कोई subject, product, costume या visual style पहचानने योग्य बना रहना चाहिए |
| Motion या camera language का पालन करें | Text (वैकल्पिक) + `reference_video` वाला video | जब motion, timing, editing rhythm या camera movement किसी reference clip से आए |
| Audio reference जोड़ें | Text/image/video + `reference_audio` वाला audio | जब dialogue, music, voice या sound design परिणाम को दिशा दे |
| पूरा multimodal direction | Text + image + video + audio references | जब एक ही shot में अलग-अलग assets appearance, motion और sound को नियंत्रित करें |

Audio अकेले नहीं भेजा जा सकता। Audio item वाली हर request में कम से कम एक text, image या video
item भी होना चाहिए।

### Content item के रूप {#content-item-shapes}

```json
{ "type": "text", "text": "A puppy running across a sunlit lawn" }
```

```json
{ "type": "image_url", "image_url": { "url": "https://example.com/ref.jpg" }, "role": "reference_image" }
```

```json
{ "type": "video_url", "video_url": { "url": "https://example.com/ref.mp4" }, "role": "reference_video" }
```

```json
{ "type": "audio_url", "audio_url": { "url": "https://example.com/bgm.mp3" }, "role": "reference_audio" }
```

`role` बताता है कि model को asset का उपयोग कैसे करना चाहिए:

| Asset | `role` | प्रभाव |
| --- | --- | --- |
| Image | `first_frame` | Image को शुरुआती frame के रूप में उपयोग करें |
| Image | `last_frame` | Image को अंतिम frame के रूप में उपयोग करें; उसी request में `first_frame` शामिल करें |
| Image | `reference_image` | Subject, composition, product, costume या visual style का reference लें |
| Video | `reference_video` | Motion, camera work, timing या editing rhythm का reference लें |
| Audio | `reference_audio` | Voice, dialogue, music या sound design का reference लें |

Image items public URL या inline `data:image/...;base64,...` value, दोनों में से कोई भी स्वीकार करते हैं। Video और audio references के लिए
ऐसे public URLs उपयोग करें जिन्हें model download कर सके।

कोई भी `video_url` item शामिल करने पर request video-to-video mode में चली जाती है, जिससे token rate बदल जाता है।
[Billing](#billing) देखें।

## सामान्य recipes {#common-recipes}

नीचे दिए उदाहरण request bodies दिखाते हैं। इनमें से किसी को भी [Quickstart](#quickstart) में दिखाए गए create-task endpoint पर भेजें।

### पहले frame को animate करें {#animate-a-first-frame}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "The woman slowly looks up and smiles as the camera gently pushes in"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 5,
  "generate_audio": true
}
```

### पहले से अंतिम frame तक transition बनाएँ {#create-a-first-to-last-frame-transition}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "A smooth transition from a bright afternoon into a neon-lit night"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"},
    {"type": "image_url", "image_url": {"url": "https://example.com/last-frame.jpg"}, "role": "last_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 6
}
```

### Image, video और audio references के साथ shot direct करें {#direct-a-shot-with-image-video-and-audio-references}

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "First-person fruit tea commercial, camera pushes in on the layered foam"},
      {"type": "image_url", "image_url": {"url": "https://example.com/ref.jpg"}, "role": "reference_image"},
      {"type": "video_url", "video_url": {"url": "https://example.com/ref.mp4"}, "role": "reference_video"},
      {"type": "audio_url", "audio_url": {"url": "https://example.com/bgm.mp3"}, "role": "reference_audio"}
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 11
  }'
```

हर reference को स्पष्ट काम देने के लिए prompt का उपयोग करें: उदाहरण के लिए, “image से product का appearance बनाए रखें, video से
camera movement लें, और audio की pacing का पालन करें।” यह हर asset से पूरे परिणाम को नियंत्रित करवाने की तुलना में
अधिक भरोसेमंद है।

## प्रभावी prompt लिखना {#writing-an-effective-prompt}

एक व्यावहारिक prompt आमतौर पर इस क्रम का पालन करता है:

1. **Subject** — shot में कौन या क्या दिखता है।
2. **Action** — क्या बदलता या हिलता है।
3. **Scene** — स्थान, दिन का समय, मौसम और आसपास के विवरण।
4. **Visual style** — cinematic, documentary, product commercial, animation आदि।
5. **Camera** — framing, lens का अनुभव, camera movement और cuts।
6. **Sound** — `generate_audio` enabled होने पर dialogue, ambience, music या effects।

स्पष्ट बताएँ कि क्या स्थिर रहना चाहिए। उदाहरण के लिए: “Product label पढ़ने योग्य रहे, camera एक धीमा
push-in करे, कोई scene cut न हो, स्वाभाविक room tone।” जब कई references हों, तो बताएँ कि हर एक से कौन-सी visual या motion
विशेषता लेनी है।

## आउटपुट विकल्प {#output-options}

| Parameter | Type | Default | Values |
| --- | --- | --- | --- |
| `resolution` | string | `720p` | `480p`, `720p`, `1080p`। `2.0-official` `1080p` का समर्थन नहीं करता |
| `ratio` | string | `adaptive` | `16:9`, `9:16`, `4:3`, `3:4`, `1:1`, `21:9`, `adaptive`। `adaptive` input और prompt के आधार पर ratio चुनता है |
| `duration` | integer | `5` | 4 से 15 seconds, या `-1` ताकि model समर्थित range में खुद चुने |
| `generate_audio` | boolean | `true` | Synchronized voice, sound effects और background music generate करें |
| `seed` | integer | `-1` | `-1` से `2^32-1`। एक ही prompt और seed मिलते-जुलते output देते हैं, एक जैसे नहीं |
| `watermark` | boolean | `false` | नीचे दाएँ कोने में AI-generated watermark जोड़ें |
| `tools` | array | `[]` | `[{"type": "web_search"}]` shot की योजना बनाते समय web search enable करता है |

### टास्क नियंत्रण {#task-control}

| Parameter | Type | Default | नोट्स |
| --- | --- | --- | --- |
| `execution_expires_after` | integer | `172800` | Seconds में task timeout, 3600 से 259200 तक। इससे आगे जाने वाला task `expired` हो जाता है |
| `service_tier` | string | `default` | ये models `flex` का समर्थन नहीं करते |
| `safety_identifier` | string | — | Opaque end-user identifier, अधिकतम 64 characters। कच्चा personal data नहीं, hash भेजें |

### फ़्रेम आकार {#frame-size}

`resolution` और `ratio` मिलकर pixel dimensions तय करते हैं:

| Resolution | 16:9 | 9:16 | 4:3 | 3:4 | 1:1 | 21:9 |
| --- | --- | --- | --- | --- | --- | --- |
| 480p | 864×496 | 496×864 | 752×560 | 560×752 | 640×640 | 992×432 |
| 720p | 1280×720 | 720×1280 | 1112×834 | 834×1112 | 960×960 | 1470×630 |
| 1080p | 1920×1080 | 1080×1920 | 1664×1248 | 1248×1664 | 1440×1440 | 2206×946 |

## टास्क स्थिति {#task-status}

| `status` | अर्थ | क्या करें |
| --- | --- | --- |
| `queued` | स्वीकार हुआ, शुरू होने की प्रतीक्षा में | हर 5 से 10 seconds में poll करते रहें |
| `running` | Generate हो रहा है | Poll करते रहें |
| `succeeded` | पूरा हुआ | `content.video_url` download करें |
| `failed` | Content review ने अस्वीकार किया, या model में error आया | `error.message` पढ़ें। Retry से पहले prompt बदलें |
| `expired` | `execution_expires_after` से अधिक समय तक चला | फिर से submit करें |
| `cancelled` | Generation शुरू होने से पहले समाप्त हुआ | फिर से submit करें |

### टास्क फ़ील्ड {#task-fields}

| Field | Type | नोट्स |
| --- | --- | --- |
| `id` | string | Submit पर लौटाया गया task id |
| `model` | string | आपके द्वारा भेजी गई `model` value |
| `status` | string | ऊपर देखें |
| `created_at` | integer | Unix seconds |
| `updated_at` | integer | Unix seconds। Task पूरा होने तक `created_at` के बराबर |
| `content` | object | Task सफल होने तक खाली। इसमें generate किया गया `video_url` होता है |
| `usage` | object | Token counts। [Billing](#billing) देखें |
| `error` | object | `failed` और `expired` के लिए मौजूद। इसमें `code` और `message` होते हैं |

### पूरा Python flow {#complete-python-flow}

```python
import os
import time

import requests

BASE_URL = "https://api.sandbase.ai/api/v3/contents/generations/tasks"
HEADERS = {
    "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
    "Content-Type": "application/json",
}

task = requests.post(
    BASE_URL,
    headers=HEADERS,
    json={
        "model": "bytedance/seedance/2.5-official",
        "content": [
            {
                "type": "text",
                "text": "A quiet shoreline at sunrise, gentle waves, one slow camera push-in",
            }
        ],
        "ratio": "16:9",
        "resolution": "720p",
        "duration": 5,
        "generate_audio": True,
    },
)
task.raise_for_status()
task_id = task.json()["id"]

while True:
    time.sleep(8)
    result = requests.get(f"{BASE_URL}/{task_id}", headers=HEADERS)
    result.raise_for_status()
    data = result.json()
    print(data["status"])

    if data["status"] == "succeeded":
        print(data["content"]["video_url"])
        break
    if data["status"] in {"failed", "expired", "cancelled"}:
        raise RuntimeError(data.get("error", {"message": data["status"]}))
```

## बिलिंग {#billing}

ये models `usage.completion_tokens` पर bill करते हैं, जिसे task पूरा होने पर रिपोर्ट करता है। Token rate दो
आयामों पर निर्भर करता है:

- **Input में video है या नहीं।** Video-to-video requests, यानी `video_url` type का कोई भी `content` item, text-to-video की तुलना में
  कम rate पर bill होती हैं।
- **Output resolution।** `2.5-official` के लिए 1080p, 480p और 720p से अधिक rate पर bill होता है। `2.0-official` का rate
  resolution के अनुसार नहीं बदलता।

`usage` में `completion_tokens` और `total_tokens` रिपोर्ट होते हैं, जो फ़िलहाल बराबर हैं। Task चलते समय यह खाली रहता है।
वास्तविक शुल्क के लिए अपनी [account history](/api-reference/account/history) देखें, और वर्तमान rates के लिए
[pricing guide](/guides/billing) देखें।

## त्रुटियाँ {#errors}

अमान्य request तुरंत error लौटाती है। Generation के दौरान होने वाला error polling के बाद task में दिखता है। दोनों में
machine-readable `code` और human-readable `message` वाला `error` object होता है:

```json
{ "error": { "code": "InvalidParameter", "message": "model is required", "type": "BadRequest" } }
```

| HTTP | `code` | `type` |
| --- | --- | --- |
| 400 | `InvalidParameter` | `BadRequest` |
| 401 | `AuthenticationError` | `Unauthorized` |
| 403 | `PermissionDenied` | `Forbidden` |
| 404 | `ResourceNotFound` | `NotFound` |
| 429 | `RateLimitExceeded` | `TooManyRequests` |
| 500 | `InternalServiceError` | `InternalServerError` |
| 503 | `InternalServiceError` | `ServiceUnavailable` |

Recovery के सामान्य कदम:

| परिणाम | क्या आज़माएँ |
| --- | --- |
| `400 InvalidParameter` | Model name, आवश्यक content, roles, resolution, duration और asset URLs जाँचें |
| Content-review error के साथ task status `failed` | फिर से submit करने से पहले prompt दोबारा लिखें या flag किए गए reference asset को बदलें |
| Task status `expired` | नया task submit करें; high-resolution या लंबे clips के लिए अधिक `execution_expires_after` पर विचार करें |
| `429 RateLimitExceeded` | Exponential backoff के साथ retry करें और एक साथ होने वाले submissions कम करें |
| `503 ServiceUnavailable` | थोड़ी देर बाद वही request retry करें |

## Registered media Assets का उपयोग करें {#use-registered-media-assets}

SandBase `/v1/assets` पर official-compatible Asset protocol उपलब्ध कराता है। Asset request और लौटाया गया `asset://`
reference official protocol का पालन करते हैं, और यह reference native ByteDance Contents
Generations request में बिना बदलाव के आगे भेजा जाता है।
`bytedance/seedance/2.5-official` और `bytedance/seedance/2.0-official`, दोनों यह reference
वहाँ स्वीकार करते हैं जहाँ वे सामान्य रूप से public HTTP(S) URL स्वीकार करते हैं।

पूरा workflow:

1. `POST /v1/assets` से पहुँच योग्य media URL register करें।
2. `GET /v1/assets/{external_id}` तब तक query करें जब तक provider यह न बताए कि Asset उपयोग योग्य है।
3. लौटाया गया `asset_url` Seedance `content` item में रखें और generation task submit करें।

### आधिकारिक-संगत Asset ऑपरेशन {#official-compatible-asset-operations}

| Method | Path | उद्देश्य |
| --- | --- | --- |
| `POST` | `/v1/assets` | पहुँच योग्य media URL register करें और official-compatible `asset://` reference पाएँ |
| `GET` | `/v1/assets/{external_id}` | Provider status पढ़ें और वर्तमान preview/download URL प्राप्त करें |

Public API फ़िलहाल registration और lookup उपलब्ध कराती है। Asset groups, listing, renaming, updating और deletion
public operations नहीं हैं। Assets उस organization के होते हैं जिससे API key जुड़ी है।

### चरण 1: Asset register करें {#step-1-register-the-asset}

पहुँच योग्य URL को `POST /v1/assets` पर भेजें। `asset_type` case-sensitive है और `Image`, `Video` या `Audio` होना चाहिए:

```bash
curl -X POST https://api.sandbase.ai/v1/assets \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/product-reference.png",
    "asset_type": "Image",
    "name": "Product reference"
  }'
```

Response से `asset_url` सहेजें:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Image",
  "name": "Product reference",
  "created_at": "2026-07-10T15:04:03Z"
}
```

`asset://` के बाद की value वह `external_id` है जिसे official-compatible lookup operation उपयोग करता है।

### चरण 2: तैयारी जाँचें {#step-2-check-readiness}

`asset://` prefix के बिना, `external_id` के साथ Asset query करें:

```bash
curl https://api.sandbase.ai/v1/assets/asset-20260710150403-hx4hf \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "external_id": "asset-20260710150403-hx4hf",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "status": "Active",
  "asset_type": "Image",
  "name": "Product reference",
  "download_url": "https://media.example.com/current-signed-url",
  "created_at": "2026-07-10T15:04:03Z"
}
```

`status` को पूरी enum के बजाय provider की खुली value मानें। Generation task submit करने से पहले तब तक प्रतीक्षा करें जब तक provider
उपयोग योग्य स्थिति न बताए; एक सामान्य ready value `Active` है। `download_url` provider द्वारा मैनेज होता है और
processing के दौरान खाली हो सकता है। जब आपको वर्तमान preview URL चाहिए, तब Asset को फिर से query करें। Seedance requests में
`download_url` copy करने के बजाय स्थायी `asset_url` का ही उपयोग करते रहें।

### चरण 3: Asset के साथ generate करें {#step-3-generate-with-the-asset}

`asset_url` को media type से मेल खाने वाले URL field में रखें। यह उदाहरण registered image को visual
reference के रूप में उपयोग करता है:

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {
        "type": "text",
        "text": "Create a cinematic product shot. Keep the bottle shape and label from the reference image."
      },
      {
        "type": "image_url",
        "image_url": {"url": "asset://asset-20260710150403-hx4hf"},
        "role": "reference_image"
      }
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 5,
    "generate_audio": true
  }'
```

Create response एक task `id` लौटाता है। चुने गए model page पर बताए अनुसार
`GET /api/v3/contents/generations/tasks/{task_id}` को poll करें।

### Content item और role चुनें {#choose-the-content-item-and-role}

| Asset type | `content[].type` | URL field | समर्थित role | किसके लिए उपयोग करें |
| --- | --- | --- | --- | --- |
| Image | `image_url` | `image_url.url` | `first_frame` | Video को ठीक इसी frame से शुरू करें |
| Image | `image_url` | `image_url.url` | `last_frame` | इस frame पर समाप्त करें; उसी request में `first_frame` शामिल करें |
| Image | `image_url` | `image_url.url` | `reference_image` | Subject, product, composition, costume या visual style बनाए रखें |
| Video | `video_url` | `video_url.url` | `reference_video` | Motion, timing, camera work या editing rhythm का पालन करें |
| Audio | `audio_url` | `audio_url.url` | `reference_audio` | Voice, dialogue, music या sound design का पालन करें |

Audio एकमात्र input नहीं हो सकता। `reference_audio` Asset को text, image या video के साथ मिलाएँ। `video_url` वाली हर request
video-to-video billing rate का उपयोग करती है।

#### Video Asset उदाहरण {#video-asset-example}

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-video1"},
  "role": "reference_video"
}
```

#### Audio Asset उदाहरण {#audio-asset-example}

```json
{
  "type": "audio_url",
  "audio_url": {"url": "asset://asset-20260710150403-audio1"},
  "role": "reference_audio"
}
```

### Direct URL या `asset://` reference? {#direct-url-or-asset-reference}

| Input | कब सबसे उपयुक्त | Trade-off |
| --- | --- | --- |
| Public HTTP(S) URL | Media पहले से hosted है और एक बार उपयोग होता है | सबसे तेज़ रास्ता, लेकिन task submission और provider fetch तक URL पहुँच योग्य रहना चाहिए |
| `asset://` reference | Media को official Asset protocol के ज़रिए दोबारा उपयोग किया जाता है | एक registration/readiness चरण जुड़ता है, फिर आगे के Seedance tasks के लिए स्थायी reference मिलता है |

Request parameters, polling, task statuses और billing के लिए ऊपर [Seedance guide](#seedance-guide) देखें।

## आधिकारिक ByteDance resources {#official-bytedance-resources}
- [Seedance video generation documentation](https://www.volcengine.com/docs/82379/1520758?lang=en)
- [Create contents generation task API](https://api.volcengine.com/api-explorer/?action=CreateContentsGenerationsTasks&groupName=%E8%A7%86%E9%A2%91%E7%94%9F%E6%88%90API&serviceCode=ark&version=2024-01-01)
- [Seedance 2.0 prompting guide](https://www.volcengine.com/docs/82379/2222480?lang=en)

