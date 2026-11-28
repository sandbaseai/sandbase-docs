---
i18nSource: dab112fdbbc56799
title: MCP tools के लिए credentials
description: write-only Bearer tokens को Secrets के रूप में store करें, ताकि Agents authenticated MCP servers को call कर सकें।
---

# MCP tools के लिए credentials {#credentials-for-mcp-tools}

जब किसी MCP server को authentication चाहिए, तो उसका Bearer token एक **Secret** के रूप में store करें और उस Secret को एक [MCP connection](/agents/mcp-tools#mcp-connections) से जोड़ें। Execution environment यह token केवल उसी server को भेजता है।

## Secrets कैसे काम करते हैं {#how-secrets-work}

- `kind` हमेशा `mcp_bearer` होता है: एक MCP server के लिए Bearer token।
- हर Secret ठीक एक `server_url` से बंधा होता है। कोई connection इसका इस्तेमाल तभी कर सकता है जब उसका `server_url` मेल खाता हो। किसी दूसरे URL के लिए दूसरा Secret बनाएँ।
- token write-only है। API Secret का name, URL, status और `row_version` लौटाता है, token कभी नहीं।
- Secrets environment variables नहीं हैं। उन्हें Agent runtime में inject नहीं किया जाता, और Agents उन्हें पढ़ नहीं सकते।

SandBase के पुराने versions workspace- या Agent-scoped credentials store करते थे और उन्हें `GITHUB_TOKEN` जैसे environment variables के रूप में inject करते थे। वह मॉडल अब बंद कर दिया गया है और उसके records migrate नहीं किए जाते। जिन मानों की आपको अब भी ज़रूरत है, उन्हें MCP connections पर Secrets के रूप में दोबारा बनाएँ।

## API के साथ {#with-the-api}
API से Secrets बनाएँ, rotate करें और revoke करें। यह guide API contract है; Agent editor से खुलने वाला Console का Credentials पेज Secret के व्यवहार का reference नहीं है। इन endpoints को किसी trusted backend से call करें, browser code से कभी नहीं: ये एक SandBase API key और plaintext token लेते हैं।

| Method | Path | उद्देश्य |
|---|---|---|
| `POST` | `/v1/secrets` | [Secret बनाएँ](#create-a-secret) |
| `GET` | `/v1/secrets` | [Secrets की सूची](#list-secrets) |
| `GET` | `/v1/secrets/{secret_id}` | [Secret प्राप्त करें](#get-a-secret) |
| `POST` | `/v1/secrets/{secret_id}/rotate` | [token rotate करें](#rotate-a-secret) |
| `DELETE` | `/v1/secrets/{secret_id}` | [Secret revoke करें](#revoke-a-secret) |

हर write के लिए `Idempotency-Key` ज़रूरी है (1-128 bytes, शुरुआत या अंत में whitespace के बिना)। Secret object में `id` (`sec_` prefix), `name`, `kind`, `server_url`, `status`, `row_version`, `created_at` और `updated_at` होते हैं। token store होते समय `status` `pending` होता है, इस्तेमाल के लायक होने पर `active`, और revoke होने के बाद `disabled`। `created_at` और `updated_at` RFC 3339 timestamp strings हैं।

### Secret बनाएँ {#create-a-secret}

```bash
python3 -c 'import json, os; print(json.dumps({"name": "GitHub MCP token", "kind": "mcp_bearer", "server_url": "https://mcp.example.com/github", "token": os.environ["GITHUB_MCP_TOKEN"]}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

- `kind` का `mcp_bearer` होना ज़रूरी है।
- `server_url` HTTPS होना चाहिए, जिसमें user info, query या fragment न हो। Secret केवल इसी सटीक URL के लिए काम करता है।
- `name` और `token` ज़रूरी हैं और खाली नहीं हो सकते। `name` अधिकतम 128 bytes, `token` अधिकतम 16384 bytes, और `server_url` अधिकतम 2048 bytes का हो सकता है।

Response token के बिना `201 Created` होता है। [MCP connection बनाते](/api-reference/mcp-connections/#create-a-connection) समय `sec_` ID को `secret_id` के रूप में इस्तेमाल करें।

### Secrets की सूची {#list-secrets}

```bash
curl "https://api.sandbase.ai/v1/secrets?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`data`, `total`, `limit` और `offset` के साथ offset pagination। `limit` का default 20 है और अधिकतम 200; न दिए गए, अमान्य या non-positive मानों पर 20 इस्तेमाल होता है। `offset` का default 0 है; अमान्य या non-positive मानों पर 0 इस्तेमाल होता है। लौटाए गए `limit` जितना आगे बढ़ते रहें, जब तक `offset + data.length >= total` न हो जाए। Disabled Secrets सूची में बने रहते हैं।

### Secret प्राप्त करें {#get-a-secret}

```bash
curl https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

### Secret rotate करें {#rotate-a-secret}

`SECRET_ROW_VERSION` को Get a Secret से मिले नवीनतम `row_version` पर सेट करें।

```bash
python3 -c 'import json, os; print(json.dumps({"token": os.environ["GITHUB_MCP_TOKEN"], "row_version": int(os.environ["SECRET_ROW_VERSION"])}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61/rotate \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token-rotate-1" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

Rotation token को बदल देता है और वही Secret और `server_url` बनाए रखता है। `token` और एक धनात्मक पूर्णांक `row_version` ज़रूरी हैं, Secret का `active` होना ज़रूरी है, और `row_version` नवीनतम मान से मेल खाना चाहिए। यह `201 Created` लौटाता है। नए Sessions नया token इस्तेमाल करते हैं; जो Sessions पहले से शुरू हो चुके हैं, वे अपना frozen credential ही रखते हैं।

### Secret revoke करें {#revoke-a-secret}

```bash
curl -X DELETE https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-token-revoke"
```

यह `204 No Content` लौटाता है और `status` को `disabled` पर सेट करता है। इस Secret का इस्तेमाल करने वाले connections नए Sessions के लिए और मौजूदा Sessions के आगे के input के लिए काम करना बंद कर देते हैं। Revocation को undo नहीं किया जा सकता: नया Secret बनाएँ और connection को बदलें।

### Errors और retries {#errors-and-retries}

Errors [Agents error envelope](/api-reference/errors#agents-platform-errors) का इस्तेमाल करते हैं। अमान्य fields या write idempotency key न होने पर `400 invalid_request` मिलता है; अज्ञात या inaccessible Secret पर `404 not_found` मिलता है। पुराना `row_version`, असंगत lifecycle state, या अलग input के साथ create key का दोबारा इस्तेमाल `409 conflict` लौटाता है। retry से पहले Secret को फिर से पढ़ें, और हर नए write के लिए नई key इस्तेमाल करें।

## सुरक्षा {#security}

- Secrets को trusted backend से बनाएँ और rotate करें, browser code से कभी नहीं।
- tokens को scripts में paste करने के बजाय अपने secret store या environment से पढ़ें, जैसे ऊपर `$GITHUB_MCP_TOKEN` में।
- tokens को instructions, Session input, metadata और Skill bundles से बाहर रखें।
- जैसे ही किसी Secret का token leak होने की आशंका हो, उसे revoke करें, फिर नया बनाएँ और connection को बदलें।

## अगले कदम {#next-steps}

- [Skills और MCP tools](/agents/mcp-tools)
- [MCP Connections API](/api-reference/mcp-connections/)
