---
i18nSource: ac4e3b9b9eef4c7d
title: API त्रुटियाँ
description: SandBase API errors को HTTP status, endpoint family, documented response shape और retry की सुरक्षा के आधार पर संभालें।
---

# API त्रुटियाँ {#api-errors}

SandBase मानक HTTP status codes इस्तेमाल करता है, लेकिन इसका कोई एक सार्वभौमिक error body नहीं है। पहले HTTP status के आधार पर branch करें, फिर जिस endpoint को आपने call किया उसके लिए documented response schema को parse करें। यह न मानें कि हर error में `code`, `param`, `message` या `request_id` होगा।

## Response के रूप {#response-shapes}

Core middleware और कई `/v1/*` endpoints एक flat error लौटाते हैं:

```json
{"error":"organization rate limit exceeded"}
```

Agents platform resources (`/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*`) एक स्थिर `code` के साथ OpenAI-style object लौटाते हैं। [Agents platform errors](#agents-platform-errors) देखें:

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

Webhook Events API (`/events/webhooks*`) `{"code":<http status>,"message":"..."}` लौटाता है। [Webhooks](/api-reference/webhooks#authentication-and-errors) देखें।

OpenAI-compatible endpoints OpenAI-compatible envelope ही रखते हैं। `POST /v1/messages` Anthropic-compatible envelope रखता है:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

किसी public operation के सटीक status codes और schemas के लिए [OpenAPI specification](/openapi.yaml) इस्तेमाल करें।

## HTTP status को संभालना {#http-status-handling}

| Status | सामान्य मतलब | Client क्या करे |
|---|---|---|
| `400` | गलत input या असमर्थित parameter | Endpoint और चुने गए model के schema के अनुसार request ठीक करें। |
| `401` | Credential मौजूद नहीं, गलत, revoked या expired | Credential बदलें या rotate करें; बिना बदलाव के retry न करें। |
| `402` | Request के लिए फ़ंड नहीं है या खर्च सीमा पूरी हो गई | Retry से पहले बैलेंस या key की सीमा ठीक करें। |
| `403` | Credential के पास अनुमति नहीं है, या कोई compatibility endpoint खर्च की विफलता को 403 में बदलता है | Endpoint का अपना envelope देखें और अधिकृत key इस्तेमाल करें। |
| `404` | Model या resource caller के लिए उपलब्ध नहीं है | मौजूदा model ID या resource ID जांचें। |
| `409` | Resource state में टकराव | Retry सुरक्षित है या नहीं, यह तय करने से पहले नई state पढ़ें। |
| `422` | Resource input अर्थ के हिसाब से गलत है | Documented field values ठीक करें। |
| `429` | Organization की request सीमा या video concurrency सीमा | अगर operation दोहराना सुरक्षित है, तो सीमित backoff और jitter के साथ retry करें। |
| `500`, `502`, `503`, `504` | SandBase या upstream की विफलता | सिर्फ़ तभी retry करें जब operation दोहराना सुरक्षित हो। |

हर endpoint इस टेबल का हर status document नहीं करता। Operation का OpenAPI response map ही प्रामाणिक है।

## प्रमाणीकरण त्रुटियाँ {#authentication-errors}

Documented authentication messages में ये शामिल हैं:

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

अगर scoped key को उसके scope से बाहर इस्तेमाल किया जाए, तो इसके बजाय nested body के साथ `403` लौटता है: `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`। Agents platform resources यही `code` अपने envelope में लौटाते हैं।

मानक endpoints के लिए `Authorization: Bearer $SANDBASE_API_KEY` इस्तेमाल करें। `POST /v1/messages` `x-api-key` भी स्वीकार करता है; protocol-compatible Google endpoints अपने सपोर्टेड key headers खुद document करते हैं।

Revoked key को फिर से enable नहीं किया जा सकता। नई key बनाएं, उसे इस्तेमाल करने वाली application अपडेट करें, जांच करें, और फिर पुरानी key के बचे हुए सभी references हटा दें।

## रेट लिमिट {#rate-limits}

`organization rate limit exceeded` (`429`) का मतलब है कि आपका organization अपनी तय requests-per-minute सीमा तक पहुंच गया है, जिसे उसकी सभी API keys साझा करती हैं। Protocol-compatible endpoints इसे अपने envelope में लौटाते हैं। SandBase कोई एक सार्वभौमिक संख्या वाली सीमा प्रकाशित नहीं करता, क्योंकि सीमा हर organization के लिए अलग तय होती है।

अगर response में `Retry-After` है, तो उसका पालन करें। वरना jitter के साथ सीमित exponential backoff इस्तेमाल करें। Requests को समान रूप से फैलाने के तरीकों के लिए [Rate limits](/guides/rate-limiting) देखें।

Task submissions पर दो अतिरिक्त जांच होती हैं। `organization concurrency limit exceeded` (`429`) का मतलब है कि आपके organization में पहले से उतने tasks चल रहे हैं जितने उसका account level अनुमति देता है; कोई चालू task पूरा होने पर यह हट जाता है। यह `POST /v1/run` और `/v1/api/*` पर हर model type पर, और दूसरे endpoints पर video submissions पर लागू होता है। `insufficient credit for estimated video cost` (`402`) का मतलब है कि अनुमानित लागत आपके बैलेंस और credit line से ज़्यादा है; retry से पहले टॉप-अप करें। [Concurrency limits](/guides/concurrency-limits) देखें।

## Retry की सुरक्षा {#retry-safety}

यह क्रम अपनाएं:

1. तय करें कि operation ने पहले ही कोई बाहरी रूप से दिखने वाला असर तो नहीं किया है।
2. बिना बदलाव वाले `400`, `401`, `402`, `403`, `404` या `422` request को retry न करें।
3. `409` पर retry से पहले resource की मौजूदा state पढ़ें।
4. `429` और अस्थायी `5xx` responses को सिर्फ़ कुछ सीमित बार retry करें।
5. Create, trigger, upload या external-action request दोहराने से पहले पुष्टि करें कि operation idempotent है या आपकी application duplicates को सुलझा सकती है।

उपयुक्त delay:

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

## Agents प्लेटफ़ॉर्म त्रुटियाँ {#agents-platform-errors}

Agents, Sessions, Skills, MCP connections और Secrets एक ही envelope लौटाते हैं। ज़्यादातर codes के लिए `message` एक तय, सुरक्षित वाक्य होता है; `invalid_request` में छोटी व्याख्या हो सकती है, जैसे कौन-सा input shape या option सपोर्टेड नहीं है। `message` के बजाय `code` पर branch करें।

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type` 401 के लिए `authentication_error`, 5xx के लिए `server_error` और बाकी सबके लिए `invalid_request_error` होता है।

| HTTP | `code` | मतलब | क्या करें |
|---|---|---|---|
| 400 | `invalid_request` | गलत या अनजान fields, validation विफल, या असमर्थित option | Request ठीक करें; बिना बदलाव के retry न करें |
| 400 | `skill_not_found` | Referenced Skill या version उपलब्ध नहीं है | Agent के `skills` ठीक करें |
| 401 | `unauthorized` | API key headers मौजूद नहीं, गलत, या आपस में टकराते हैं | `Authorization` / `X-API-Key` जांचें |
| 402 | `spending_limit_exceeded` | Key की खर्च सीमा या organization का बैलेंस खत्म | क्रेडिट जोड़ें या सीमा बढ़ाएं |
| 403 | `insufficient_scope` | Key scoped है और Agents resources इस्तेमाल नहीं कर सकती | Console में बनाई गई मानक key इस्तेमाल करें |
| 403 | `org_disabled` | Organization को Agents चलाने की अनुमति नहीं है | Support से संपर्क करें |
| 404 | `not_found` | Resource आपके organization में मौजूद नहीं है | ID जांचें |
| 409 | `conflict` | पुराना `row_version`, ऐसी state जिसमें बदलाव की अनुमति नहीं, या अलग body के साथ दोबारा इस्तेमाल हुई `Idempotency-Key` | Resource फिर से पढ़ें, फिर तय करें |
| 409 | `session_input_pending` | पहले का input अभी पहुंचाया जा रहा है | इंतज़ार करें; नई key के साथ दोबारा न भेजें |
| 409 | `session_input_expired` | Input admission expire हो गया | दोबारा भेजने से पहले history देखें |
| 409 | `session_environment_unavailable` | Execution environment उपलब्ध नहीं है | इंतज़ार करें या नया Session बनाएं |
| 413 | `request_too_large` | Request body, या उससे freeze हुआ Session configuration, size सीमा से बड़ा है | छोटी body भेजें; बिना बदलाव के retry न करें |
| 429 | `quota_exceeded` | Agents quota पार हो गया | बाद में retry करें |
| 502 | `executor_rejected`, `executor_contract_error` | Execution layer ने request अस्वीकार किया या अप्रत्याशित जवाब दिया | Agent configuration जांचें, फिर retry करें |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | कोई dependency अस्थायी रूप से उपलब्ध नहीं है | Backoff और उसी `Idempotency-Key` के साथ retry करें |

`skill_runtime_incompatible` भी दिख सकता है; यह `internal error` message के साथ 503 के रूप में लौटता है।

## Streaming की विफलताएं {#streaming-failures}

Stream शुरू होने के बाद error नए HTTP response के बजाय उस protocol के stream format में आ सकता है। Stream को अधूरा मानें, अपनी application के लिए ज़रूरी partial output रखें, और सिर्फ़ तभी retry करें जब request दोबारा generate करना सुरक्षित हो। यह न मानें कि हर provider एक जैसा terminal event या finish reason भेजता है।

## संचालन संबंधी डिबगिंग {#operational-debugging}

Endpoint, HTTP status, चुना गया model या resource ID, timestamp, और server से लौटा कोई भी सुरक्षित request identifier दर्ज करें। Authorization headers, API keys, credential values या संवेदनशील prompt content कभी log न करें।

Organization की request history देखने के लिए [Developer → Activities](https://www.sandbase.ai/console/activities) इस्तेमाल करें। लगातार आने वाली विफलता की रिपोर्ट करते समय sanitized request metadata और सबसे छोटा reproducible request शामिल करें।

## यह भी देखें {#see-also}

- [Authentication](/api-reference/authentication)
- [Errors और retries](/guides/error-handling)
- [Rate limits](/guides/rate-limiting)
- [AI-readable Error Guide](/for-agents/errors)
