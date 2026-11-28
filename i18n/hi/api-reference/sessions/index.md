---
i18nSource: 99170a141af66587
title: सेशन API
description: Saved Agent version चलाएँ, input भेजें, events stream करें और Session history पढ़ें।
---

# सेशन API {#sessions-api}

Session, किसी saved [Agent](/api-reference/agents/) version को SandBase के hosted cloud में चलाता है; कोई execution environment चुनना नहीं पड़ता। Session IDs `ses_` prefix का उपयोग करते हैं। Sessions, Agents का sub-resource हैं: हर path `/v1/agents/sessions` से शुरू होता है।

Standard operations, OpenAI Agents protocol (`client.beta.agents.sessions`) का पालन करते हैं; आधिकारिक SDK क्या कर सकता है और क्या नहीं, इसके लिए [OpenAI compatibility](/agents/openai-compatibility) देखें। SandBase extensions इसमें renaming, archive state, cancellation, attachments, workspace file metadata, अपरिवर्तनीय artifacts और reconnect किया जा सकने वाला product stream जोड़ते हैं।

::: info Sessions कहाँ से आते हैं
आप `POST /v1/agents/sessions` से सीधे Session बनाते हैं। Session `source: "direct"` और `source_id: null` रिपोर्ट करता है।
:::

## सुझाया गया flow {#recommended-flow}

1. किसी saved Agent के लिए [Session बनाएँ](./create)। Session चुने गए Agent version और MCP connections को freeze कर देता है, और उस Agent version पर पहले से pinned Skill versions का उपयोग करता है।
2. `GET /v1/agents/sessions/{session_id}/events` से [event stream खोलें](./stream)। Stream केवल live होता है, इसलिए input भेजने से पहले इसे खोलें।
3. `POST /v1/agents/sessions/{session_id}/events` और `agent.session.input.message` event के साथ [input भेजें](./send-events)। यह call 202 लौटाती है।
4. Results stream से पढ़ें, या बाद में [items](./items) और [turns](./turns) से।

## सेशन ऑपरेशन {#session-operations}

| Method | Path | उद्देश्य |
|---|---|---|
| `POST` | `/v1/agents/sessions` | [Session बनाएँ](./create) |
| `GET` | `/v1/agents/sessions` | [Sessions की सूची](./list) |
| `GET` | `/v1/agents/sessions/{session_id}` | [Session प्राप्त करें](./get) |
| `POST` | `/v1/agents/sessions/{session_id}` | [Metadata replace करें](./update) |
| `PATCH` | `/v1/agents/sessions/{session_id}` | `row_version` के साथ [rename करें](./rename) |
| `DELETE` | `/v1/agents/sessions/{session_id}` | [Delete करें](./delete), जो Session को archive करता है |
| `POST` | `/v1/agents/sessions/{session_id}/events` | [एक input या cancel event भेजें](./send-events) |
| `GET` | `/v1/agents/sessions/{session_id}/events` | [Live events stream करें](./stream) (SSE) |
| `GET` | `/v1/agents/sessions/{session_id}/items` | [Items की सूची](./items) |
| `GET` | `/v1/agents/sessions/{session_id}/turns` | [Turns की सूची](./turns) |
| `GET` | `/v1/agents/sessions/{session_id}/turns/{turn_id}` | [एक turn प्राप्त करें](./get-turn) |
| `POST` | `/v1/agents/sessions/{session_id}/cancel` | [चल रहा turn cancel करें](./cancel) |
| `POST` | `/v1/agents/sessions/{session_id}/archive` | [Archive करें](./archive) |
| `POST` | `/v1/agents/sessions/{session_id}/unarchive` | [Unarchive करें](./unarchive) |
| `POST` | `/v1/agents/sessions/{session_id}/reconnect` | stream टूटने के बाद [reconnect करें](./reconnect) |
| `GET` | `/v1/agents/sessions/{session_id}/events/stream` | [Snapshot-then-live stream](./stream-snapshot) (SSE) |
| `POST` | `/v1/agents/sessions/{session_id}/files` | [Attachment upload करें](./upload-file) |
| `GET` | `/v1/agents/sessions/{session_id}/files` | [Attachments की सूची](./list-files) |
| `GET` | `/v1/agents/sessions/{session_id}/files/{file_id}/content` | [Attachment download करें](./download-file) |
| `DELETE` | `/v1/agents/sessions/{session_id}/files/{file_id}` | [Attachment delete करें](./delete-file) |
| `GET` | `/v1/agents/sessions/{session_id}/workspace-files` | [Workspace file metadata की सूची](./list-workspace-files) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts` | [अपरिवर्तनीय artifacts की सूची](./list-artifacts) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` | [Artifact download करें](./download-artifact) |

## स्थिति फ़ील्ड {#status-fields}

- `status` execution status है: `idle`, `in_progress` या `failed`। Client result की ज़रूरत वाले function tools (`requires_action`) अभी समर्थित नहीं हैं; ऐसे Session को पढ़ने पर `502 executor_contract_error` लौटता है।
- `lifecycle_status` `active` या `archived` होता है। Archived Sessions input, metadata updates और streams अस्वीकार करते हैं। `DELETE` archive करता है; `unarchive` वापस लाता है।
- `failure` या तो `null` होता है या `code`, `message`, `action` और कभी-कभी `retryable` वाला object।

| `failure.code` | अर्थ | सुझाया गया `action` |
|---|---|---|
| `session_creation_rejected` | Execution layer ने Session अस्वीकार किया | `create_new_session` |
| `model_authentication_failed` | Model provider ने key अस्वीकार की | `create_session_with_updated_model_provider` |
| `model_rate_limited` | Model provider rate limit लगा रहा है (retryable) | `retry_later` |
| `model_quota_exceeded` | Model account में कोई quota नहीं है | `check_model_account` |
| `context_limit_exceeded` | Conversation model context से बड़ी हो गई है | `create_new_session` |
| `environment_connection_timeout` | Environment समय पर connect नहीं हुआ (retryable) | `retry_later` |
| `runtime_unavailable` | Execution environment उपलब्ध नहीं है (retryable) | `retry_later` |
| `model_request_failed` | Model request पूरा नहीं हुआ | `inspect_history` |
| `model_configuration_rejected` | Model या execution layer ने configuration अस्वीकार किया | `create_session_with_updated_model_provider` |
| `execution_failed` | किसी अधिक विशिष्ट public कारण के बिना failure | `inspect_history` |

जब किसी Session को live नहीं पढ़ा जा सकता, तो list results में `session_not_ready`, `session_execution_unavailable`, `session_configuration_unavailable` या `session_snapshot_unavailable` वाली placeholder rows भी हो सकती हैं।

## मॉडल क्रेडेंशियल {#model-credentials}

Default रूप से Session उसी SandBase API key से models call करता है जिससे उसे बनाया गया था। स्पष्ट रूप से चुनने के लिए `model_provider` भेजें:

- `{"type": "sandbase"}` आपकी calling key का उपयोग करता है। `base_url` की अनुमति नहीं है।
- `{"type": "custom", "base_url": "https://…", "api_key": "…"}` आपके अपने OpenAI-compatible HTTPS endpoint को call करता है। URL में credentials, query या fragment नहीं हो सकते, और SandBase कभी भी आपकी SandBase key पर fallback नहीं करता।

`model_provider` write-only है और responses में कभी दिखाई नहीं देता।

## Admission और errors {#admission-and-errors}

Session बनाने और input भेजने पर execution admission जाँचा जाता है: key limit या organization balance ख़त्म होने पर `402 spending_limit_exceeded`, organization के Agents न चला पाने पर `403 org_disabled`, और जाँच पूरी न हो पाने पर `503 admission_unavailable`। Reads, cancellation और archive, balance से नहीं रुकते।

Input भेजने पर `409 session_input_pending` (पहले का input अभी deliver हो रहा है; प्रतीक्षा करें, और नई key के साथ दोबारा न भेजें), `409 session_input_expired` (फिर से भेजने से पहले history जाँचें), या `409 session_environment_unavailable` (प्रतीक्षा करें या नया Session बनाएँ) भी लौट सकता है। [Errors](/api-reference/errors#agents-platform-errors) देखें।

## पेजिनेशन {#pagination}

Sessions, items, turns और artifacts cursor pagination (`limit` 1-100, `after`, `order`) का उपयोग करते हैं। Attachments offset pagination (`limit` 1-100, `offset`) का उपयोग करते हैं।

Workspace files इसके बजाय `page` / `next` pagination का उपयोग करती हैं। [Workspace files की सूची](./list-workspace-files) देखें।
