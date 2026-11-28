---
i18nSource: 94e0cdfdd0239d6b
title: Skills API
description: Versioned Skill bundles upload करें और उन्हें Agents से जोड़ें।
---

# Skills API {#skills-api}

Skill, instructions और resources का एक versioned ZIP bundle है जिसे Agent mount कर सकता है। Skill IDs में `skl_` prefix होता है, और version identifiers `"1"` जैसी strings होते हैं।

## Skill ऑपरेशन {#skill-operations}

| Method | Path | उद्देश्य |
|---|---|---|
| `POST` | `/v1/skills` | ZIP upload से [Skill बनाएं](./create) |
| `GET` | `/v1/skills` | [Skills की सूची](./list) |
| `GET` | `/v1/skills/{skill_id}` | [Skill पाएं](./get) |
| `POST` | `/v1/skills/{skill_id}` | डिफ़ॉल्ट version, status या metadata [अपडेट करें](./update) |
| `DELETE` | `/v1/skills/{skill_id}` | [Skill डिलीट करें](./delete) |
| `GET` | `/v1/skills/{skill_id}/content` | डिफ़ॉल्ट version का ZIP डाउनलोड करें |
| `GET` | `/v1/skills/{skill_id}/versions` | [Versions की सूची](./versions) |
| `POST` | `/v1/skills/{skill_id}/versions` | [Version upload करें](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}` | [Version पाएं](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}/content` | किसी version का ZIP डाउनलोड करें |
| `GET` | `/v1/skills/catalog` | [Public Skills ब्राउज़ करें](./catalog) |

## पांच मिनट में सेटअप {#five-minute-setup}

1. एक फ़ोल्डर बनाएं जिसमें `SKILL.md` हो और उसके frontmatter में `name` और `description` सेट हों:

   ```markdown
   ---
   name: release-notes
   description: Draft release notes from merged changes.
   ---
   Group changes by feature, fix, and breaking change. Keep each entry to one line.
   ```

2. इसे zip करें (`zip -r release-notes.zip release-notes/`)। Archive अधिकतम 5 MiB का हो सकता है।
3. इसे एक अकेले multipart part `files` के रूप में upload करें:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/skills \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -F "files=@release-notes.zip;type=application/zip"
   ```

4. [Update Agent](/api-reference/agents/update) से इसे किसी Agent में reference करें:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"skills": [{"skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null}]}'
   ```

Skill को पहली बार जोड़ते समय `"version": null` (या `version` न देने) पर Agent सेव होते समय Skill का मौजूदा `default_version` लिया जाता है। सेव किए गए Agent में एक स्पष्ट version होता है। Skill का डिफ़ॉल्ट बदलने से मौजूदा Agent upgrade नहीं होता। Upgrade करने के लिए उसके `skills` array को `"2"` जैसे स्पष्ट version के साथ अपडेट करें; मौजूदा binding के लिए `null` भेजने पर उसका pinned version बना रहता है। हर Session सेव किए गए Agent version का इस्तेमाल करता है और resolved Skills को `environment.skills` में दिखाता है।

एक Agent अधिकतम 32 Skills सपोर्ट करता है। उसके चयन में Skill IDs और Skill names unique होने चाहिए।

## संस्करण {#versions}

- `POST /v1/skills/{skill_id}/versions` पर upload करने से अगला version जुड़ता है। इसे डिफ़ॉल्ट बनाने के लिए form field `default=true` भेजें।
- `default_version` के साथ `POST /v1/skills/{skill_id}` बिना upload किए डिफ़ॉल्ट बदल देता है।
- `status` `active` या `disabled` होता है। Disabled Skill को reference करने वाले Agent के नए Sessions `400 skill_not_found` के साथ विफल होते हैं; जिन Sessions ने पहले ही कोई version freeze कर लिया है, वे उसे बनाए रखते हैं।
- जिस Skill को कोई भी Agent version reference करता है, उसे डिलीट नहीं किया जा सकता (409)। इसके बजाय उसे disable करें। नवीनतम Agent version से हटाने पर पुराने versions के references नहीं हटते।

## Pagination और errors {#pagination-and-errors}

Lists `limit` 0-100, `after` और `order` के साथ cursor pagination इस्तेमाल करती हैं। Errors [Agents error envelope](/api-reference/errors#agents-platform-errors) इस्तेमाल करते हैं।

## Bundle डाउनलोड करें {#download-a-bundle}

Content endpoints JSON नहीं, `application/zip` लौटाते हैं। Response को फ़ाइल में सेव करें:

```bash
curl --fail https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions/2/content \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  --output release-notes-v2.zip
```

मौजूदा डिफ़ॉल्ट version के लिए `/v1/skills/{skill_id}/content` इस्तेमाल करें। Public catalog bundles के लिए `/v1/skills/catalog/{skill_id}/versions/{version}/content` इस्तेमाल करें।

Version lists, Skill lists वाले ही cursor parameters इस्तेमाल करती हैं। लौटाया गया `last_id` (उदाहरण के लिए, `skl_…:2`) `after` के रूप में भेजें; सिर्फ़ version number न भेजें।
