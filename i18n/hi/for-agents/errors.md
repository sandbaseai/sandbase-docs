---
i18nSource: 95410ff7ea741f64
title: AI के पढ़ने योग्य त्रुटि गाइड
description: SandBase API errors को endpoint family, HTTP status, retry की सुरक्षा और documented response shape के आधार पर संभालें।
---

# AI clients के लिए error handling {#error-handling-for-ai-clients}

SandBase कोई एक सार्वभौमिक error schema उपलब्ध नहीं कराता। पहले HTTP status के आधार पर branch करें, फिर endpoint family के लिए
documented response shape को parse करें। यह न मानें कि हर response में `code`, `param`, `request_id` या कोई
विशेष message string होगी।

## सार्वजनिक प्रतिक्रिया संरचनाएँ {#public-response-shapes}

Core `/v1/*` middleware और कई model या resource endpoints एक flat error लौटाते हैं:

```json
{"error":"organization rate limit exceeded"}
```

Agents platform resources (`/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`,
`/v1/skills*`) स्थिर `code` वाला OpenAI-style object लौटाते हैं। [Agents platform errors](#agents-platform-errors) देखें:

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

OpenAI-compatible gateways OpenAI-compatible envelope बनाए रखते हैं। `POST /v1/messages`
Anthropic-compatible envelope बनाए रखता है:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

## HTTP स्थिति प्रबंधन {#http-status-handling}

| Status | अर्थ | Client क्या करे |
|---|---|---|
| `400` | अमान्य input या असमर्थित parameter | चुने गए endpoint और model schema के अनुसार request ठीक करें। |
| `401` | Credential नहीं है, अमान्य है, revoke हो चुका है या expire हो चुका है | Credential बदलें या rotate करें; बिना बदलाव retry न करें। |
| `402` | Request के लिए funding नहीं हो सकती या spending limit पूरी हो गई | Retry से पहले billing या key limits ठीक करें। |
| `403` | Credential के पास अनुमति नहीं है, या कोई compatibility surface spending विफलता को 403 में बदलता है | Documented envelope जाँचें और अधिकृत key उपयोग करें। |
| `404` | Model या resource नहीं मिला | वर्तमान model name या resource ID की पुष्टि करें। |
| `409` | Resource state conflict | Retry सुरक्षित है या नहीं, यह तय करने से पहले resource की नवीनतम state पढ़ें। |
| `429` | Organization request limit या video concurrency limit | सीमित exponential backoff और jitter के साथ retry करें। |
| `500`, `502`, `503`, `504` | SandBase या upstream की अस्थायी विफलता | केवल तभी retry करें जब operation दोहराना सुरक्षित हो। |

## Authentication और rate-limit messages {#authentication-and-rate-limit-messages}

Documented authentication messages में ये शामिल हैं:

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

अपने scope के बाहर उपयोग की गई scoped key इसके बजाय nested body के साथ `403` लौटाती है: `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`। Agents platform resources यही `code` अपने envelope में लौटाते हैं।

Documented rate-limit message `organization rate limit exceeded` है (organization को दी गई requests-per-minute
limit, जो उसकी सभी API keys में साझा होती है)। `429` response में फ़िलहाल `Retry-After` या
`X-RateLimit-*` headers नहीं होते, और कोई प्रकाशित सार्वभौमिक RPM या concurrency default नहीं है।

## Model और resource lookup {#model-and-resource-lookup}

सक्षम model IDs खोजने के लिए `GET /v1/models` और execution से पहले किसी model की जाँच के लिए `GET /v1/models/{id_or_name}`
उपयोग करें। Resource ID को opaque मानें और संबंधित list या get operation से उसकी पुष्टि करें। ID prefix से
कोई अलग polling URL न बनाएँ।

## रीट्राई एल्गोरिदम {#retry-algorithm}

Jitter के साथ सीमित exponential backoff उपयोग करें:

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

ये नियम लागू करें:

- client द्वारा गणना की गई देरी के बाद `429` retry करें;
- अस्थायी `5xx` responses को केवल कुछ, सीमित बार retry करें;
- बिना बदलाव वाली `400`, `401`, `402`, `403` या `404` request retry न करें;
- कोई भी create, trigger या external-action request दोहराने से पहले idempotency जाँचें;
- stream विफल होने पर आंशिक output रखें और तय करें कि जारी रखना या फिर से शुरू करना सुरक्षित है या नहीं;
- अंतिम HTTP status और sanitized endpoint-specific error caller को दिखाएँ।

## Agents प्लेटफ़ॉर्म त्रुटियाँ {#agents-platform-errors}

Agents, Sessions, Skills, MCP connections और Secrets एक ही envelope लौटाते हैं। ज़्यादातर codes के लिए `message` एक तय, सुरक्षित वाक्य होता है; `invalid_request` में छोटी व्याख्या हो सकती है, जैसे कौन-सा input shape या option समर्थित नहीं है। `message` पर नहीं, `code` पर branch करें।

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

401 के लिए `type` `authentication_error` है, 5xx के लिए `server_error`, और अन्य मामलों में `invalid_request_error`।

| HTTP | `code` | अर्थ | क्या करें |
|---|---|---|---|
| 400 | `invalid_request` | गलत रूप वाले या अज्ञात fields, विफल validation, या असमर्थित option | Request ठीक करें; बिना बदलाव retry न करें |
| 400 | `skill_not_found` | Reference की गई Skill या version उपलब्ध नहीं है | Agent के `skills` ठीक करें |
| 401 | `unauthorized` | API key headers नहीं हैं, अमान्य हैं या परस्पर विरोधी हैं | `Authorization` / `X-API-Key` जाँचें |
| 402 | `spending_limit_exceeded` | Key की spending limit या organization balance समाप्त | Credits जोड़ें या limit बढ़ाएँ |
| 403 | `insufficient_scope` | Key scoped है और Agents resources उपयोग नहीं कर सकती | Console में बनी standard key उपयोग करें |
| 403 | `org_disabled` | Organization को Agents चलाने की अनुमति नहीं है | Support से संपर्क करें |
| 404 | `not_found` | Resource आपके organization में मौजूद नहीं है | ID जाँचें |
| 409 | `conflict` | पुराना `row_version`, ऐसी state जो बदलाव की अनुमति नहीं देती, या अलग body के साथ दोबारा उपयोग की गई `Idempotency-Key` | Resource फिर से पढ़ें, फिर तय करें |
| 409 | `session_input_pending` | पिछला input अभी भी deliver हो रहा है | प्रतीक्षा करें; नई key के साथ दोबारा न भेजें |
| 409 | `session_input_expired` | Input admission expire हो गया | दोबारा भेजने से पहले history जाँचें |
| 409 | `session_environment_unavailable` | Execution environment उपलब्ध नहीं है | प्रतीक्षा करें या नया Session बनाएँ |
| 413 | `request_too_large` | Request body, या उससे स्थिर किया गया Session configuration, size limit से अधिक है | छोटी body भेजें; बिना बदलाव retry न करें |
| 429 | `quota_exceeded` | Agents quota पार हो गया | बाद में retry करें |
| 502 | `executor_rejected`, `executor_contract_error` | Execution layer ने request अस्वीकार की या अप्रत्याशित उत्तर दिया | Agent configuration जाँचें, फिर retry करें |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | कोई dependency अस्थायी रूप से उपलब्ध नहीं है | Backoff और उसी `Idempotency-Key` के साथ retry करें |

`skill_runtime_incompatible` भी आ सकता है; यह `internal error` message के साथ 503 के रूप में लौटाया जाता है।

## Streaming विफलताएँ {#streaming-failures}

Streaming response शुरू होने के बाद, कोई विफलता नए HTTP status के बजाय protocol के stream format में
आ सकती है। Stream को अधूरा मानें, उसे बंद करें, application के लिए ज़रूरी आंशिक content रखें, और
केवल तभी retry करें जब request दोहराना सुरक्षित हो।

## यह भी देखें {#see-also}

- [Error Codes](/api-reference/errors) — public response formats और सामान्य HTTP statuses
- [Rate limits](/guides/rate-limiting) — 429 handling और request smoothing
- [Errors और retries](/guides/error-handling) — implementation patterns
- [Authentication](/api-reference/authentication) — समर्थित credentials और key lifecycle

