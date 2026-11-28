---
i18nSource: 8524e8b4d6f5ab97
title: Agents API
description: सेव किए गए Agent configurations बनाएं, उनके versions रखें, archive करें और clone करें।
---

# Agents API {#agents-api}

Agent एक सेव किया गया, versioned configuration है: एक model, instructions, एक runtime profile, Skills, MCP connections और output settings। Agent बनाने या अपडेट करने से वह run नहीं होता। उसे [Session](/api-reference/sessions/) में run करें।

Agents API, OpenAI Agents protocol (OpenAI Python SDK में `client.beta.agents`) का पालन करता है। `OpenAI-Beta` header वैकल्पिक है; भेजने पर उसका मान `agents=v1` होना चाहिए। SandBase इसमें versions, compare-and-set updates, archive और restore, और एक public catalog जोड़ता है।

## Agent ऑपरेशन {#agent-operations}

| Method | Path | उद्देश्य |
|---|---|---|
| `POST` | `/v1/agents` | Version 1 पर [Agent बनाएं](./create) |
| `GET` | `/v1/agents` | [Agents की सूची](./list) |
| `GET` | `/v1/agents/{agent_id}` | [Agent पाएं](./get) |
| `POST` | `/v1/agents/{agent_id}` | [Agent अपडेट करें](./update) (SDK-style partial update) |
| `PATCH` | `/v1/agents/{agent_id}` | `row_version` पर [compare-and-set के साथ replace करें](./replace) |
| `DELETE` | `/v1/agents/{agent_id}` | [Delete](./delete), जो Agent को archive करता है |
| `POST` | `/v1/agents/{agent_id}/archive` | [Agent archive करें](./archive) |
| `POST` | `/v1/agents/{agent_id}/unarchive` | [Agent unarchive करें](./unarchive) |
| `POST` | `/v1/agents/{agent_id}/restore` | [पुराना version restore करें](./restore), नए version के रूप में |
| `GET` | `/v1/agents/{agent_id}/versions` | [Versions की सूची](./versions) |
| `GET` | `/v1/agents/{agent_id}/versions/{version}` | [एक version पाएं](./get-version) |
| `GET` | `/v1/agents/catalog` | [Public catalog ब्राउज़ करें](./catalog) |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | [Catalog Agent को](./catalog#clone-a-catalog-agent) अपने organization में clone करें |

Agent IDs में `agt_` prefix होता है। Request bodies अधिकतम 1 MiB की strict JSON होती हैं; अनजान fields पर 400 लौटता है।

## Versions और updates {#versions-and-updates}

- हर प्रभावी write (create, update, replace, restore) एक immutable version बनाता है। `version` मौजूदा version number है।
- `POST /v1/agents/{agent_id}` OpenAI SDK वाला update है। इसमें `row_version` की ज़रूरत नहीं होती, इसलिए आख़िरी write ही लागू रहता है।
- `PATCH /v1/agents/{agent_id}` के लिए वह `row_version` ज़रूरी है जो आपने आख़िरी बार पढ़ा था, और अगर किसी और ने पहले Agent बदल दिया हो तो यह 409 लौटाता है। एक साथ चल सकने वाले editors और automation में इसका इस्तेमाल करें।
- हर Session शुरू होते समय के Agent version, Skill versions और MCP connection configuration को freeze कर देता है।

## तैयारी स्थिति {#readiness}

नया लिखा गया version execution के लिए तैयार होते समय `projection_status` दिखाता है। Sessions के लिए ऐसा active Agent चाहिए जिसका `projection_status` `ready` हो; वरना 409 लौटता है। Archived Agents भी नए executions के लिए 409 लौटाते हैं।

## मौजूदा सीमाएं {#current-limits}

- `tools` में `function` tools और ज़्यादा से ज़्यादा एक `web_search` tool दिए जा सकते हैं। फ़िलहाल execution के लिए `web_search.mode` का `disabled` होना ज़रूरी है।
- Function tools सेव किए जा सकते हैं, लेकिन जिन Runs में client से tool result लौटाने को कहा जाता है (`requires_action`), वे अभी सपोर्टेड नहीं हैं और `502 executor_contract_error` के रूप में दिखते हैं।
- `multi_agent` को छोड़ दें या `null` रखें।

## पेजिनेशन {#pagination}

`GET /v1/agents` और catalog, cursor pagination इस्तेमाल करते हैं: `limit` (1-100, डिफ़ॉल्ट 20), `after`, और `order` (`asc` या `desc`, डिफ़ॉल्ट `desc`)। Responses में `object: "list"`, `data`, `has_more`, `first_id` और `last_id` होते हैं; अगले पेज के लिए `last_id` को `after` के रूप में भेजें।

`GET /v1/agents/{agent_id}/versions` offset pagination इस्तेमाल करता है: `limit` और `offset`, और response में `data`, `total`, `limit` और `offset` होते हैं।

## त्रुटियाँ {#errors}

Errors, Agents envelope `{"error":{"type","code","param":null,"message"}}` इस्तेमाल करते हैं। Codes की सूची के लिए [Errors](/api-reference/errors#agents-platform-errors) देखें।
