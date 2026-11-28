---
i18nSource: ee126767f58b111b
title: MCP Connections API
description: ऐसे remote HTTPS MCP servers register करें जिन्हें Agents call कर सकें।
---

# MCP Connections API {#mcp-connections-api}

MCP connection, HTTPS पर पहुँच योग्य किसी remote MCP server को register करता है। Agents, `mcp_connections` में connections को reference करते हैं; हर Session शुरू होते समय connection configuration को स्थिर कर देता है। Connection IDs `mcp_` prefix का उपयोग करते हैं। Bearer token से server पर authenticate करने के लिए, पहले उसी URL के लिए एक [Secret](/agents/api-credentials#with-the-api) बनाएँ।

| Method | Path | उद्देश्य |
|---|---|---|
| `POST` | `/v1/mcp-connections` | [Connection बनाएँ](#create-a-connection) |
| `GET` | `/v1/mcp-connections` | [Connections list करें](#list-connections) |
| `GET` | `/v1/mcp-connections/{connection_id}` | [Connection प्राप्त करें](#get-a-connection) |
| `PUT` | `/v1/mcp-connections/{connection_id}` | [Connection replace करें](#replace-a-connection) |
| `POST` | `/v1/mcp-connections/{connection_id}/enable` | [Connection enable करें](#enable-a-connection) |
| `DELETE` | `/v1/mcp-connections/{connection_id}` | [Connection disable करें](#disable-a-connection) |

हर write के लिए `Idempotency-Key` आवश्यक है (1-128 bytes, शुरुआत या अंत में whitespace के बिना)। Connection object में `id`, `name`, `server_url`, `secret_id` (सेट होने पर), `status` (`active` या `disabled`), `row_version`, `created_at` और `updated_at` होते हैं।

## Connection बनाएँ {#create-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
```

- `name` आवश्यक है और खाली नहीं हो सकता, अधिकतम 128 bytes।
- `server_url` HTTPS होना चाहिए, जिसमें user info, query या fragment न हो (अधिकतम 2048 bytes)।
- `secret_id` वैकल्पिक है। Anonymous server के लिए इसे छोड़ दें। सेट होने पर Secret `active` होना चाहिए और उसका `server_url` इसी `server_url` के बिल्कुल बराबर होना चाहिए, अन्यथा request विफल होता है (inactive Secret के लिए 409, URL मेल न खाने पर 400)।

`201 Created` लौटाता है।

## Connections list करें {#list-connections}

```bash
curl "https://api.sandbase.ai/v1/mcp-connections?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`data`, `total`, `limit` और `offset` के साथ offset pagination। `limit` का default 20 है और अधिकतम 200; न दिए गए, अमान्य या nonpositive मानों पर 20 उपयोग होता है। `offset` का default 0 है; अमान्य या nonpositive मानों पर 0 उपयोग होता है। लौटाए गए `limit` जितना आगे बढ़ें, जब तक `offset + data.length >= total` न हो जाए। Disabled resources list में दिखते रहते हैं।

## Connection प्राप्त करें {#get-a-connection}

```bash
curl https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

## Connection replace करें {#replace-a-connection}

```bash
curl -X PUT https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-v2" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "row_version": 1}'
```

`PUT`, `name`, `server_url` और `secret_id` को एक साथ बदलता है; `secret_id` छोड़ने पर connection anonymous हो जाता है। `row_version` आवश्यक है और Get Connection द्वारा लौटाए गए वर्तमान मान से मेल खाना चाहिए। Updated connection के साथ `200 OK` लौटाता है। Disabled connection, replace के बाद भी तब तक disabled रहता है जब तक आप उसे enable नहीं करते।

## Connection enable करें {#enable-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13/enable \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-enable" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 3}'
```

`row_version` आवश्यक है और वर्तमान resource से मेल खाने वाला positive integer होना चाहिए। Connection के साथ `200 OK` लौटाता है। Enable करने पर connection ID वही रहता है। यह revoked Secret को वापस नहीं लाता; पहले connection को नए active Secret के साथ replace करें।

## Connection disable करें {#disable-a-connection}

```bash
curl -X DELETE https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-disable"
```

`204 No Content` लौटाता है और `status` को `disabled` पर सेट करता है। नए Sessions इस connection का उपयोग नहीं कर सकते, और जिन मौजूदा Sessions ने इसे स्थिर किया था वे आगे का input अस्वीकार करते हैं। पहले से चल रही tool call बाधित नहीं होती।

## बदलाव और चल रहे Sessions {#changes-and-running-sessions}

Sessions शुरू होते समय connection settings को स्थिर कर देते हैं। Connection replace करने या उसका Secret rotate करने के बाद, नए Sessions नया configuration उपयोग करते हैं और मौजूदा Sessions अपना snapshot रखते हैं। Connection disable करने या उसका Secret revoke करने से नए Sessions और मौजूदा Sessions का आगे का input, दोनों रुक जाते हैं।

## Errors और retries {#errors-and-retries}

Errors [Agents error envelope](/api-reference/errors#agents-platform-errors) का उपयोग करते हैं। अमान्य fields या write idempotency key न होने पर `400 invalid_request` मिलता है; अज्ञात या inaccessible resource `404 not_found` लौटाता है। पुराना `row_version`, असंगत lifecycle state, या अलग input के साथ create/update key दोबारा उपयोग करने पर `409 conflict` मिलता है। नया update भेजने से पहले resource फिर से पढ़ें, और हर नए write operation के लिए नई key उपयोग करें।

`created_at` और `updated_at` RFC 3339 timestamp strings हैं।

