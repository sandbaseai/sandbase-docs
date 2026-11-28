---
i18nSource: e904f2b8bbd0ccc4
title: सेशन
description: Session में Agent चलाएँ, उसके events stream करें, history पढ़ें, files attach करें और विफलताओं को संभालें।
---

# सेशन {#sessions}

**Session** एक सहेजे गए Agent version को SandBase के hosted cloud में चलाता है; आपको execution environment नहीं चुनना पड़ता। इसका ID `ses_` से शुरू होता है, और सभी Session paths `/v1/agents/sessions` के अंतर्गत आते हैं। Session उस Agent version, Skill versions और MCP connection configuration को स्थिर कर देता है जिनके साथ वह शुरू हुआ था।

## Sessions कैसे शुरू होते हैं {#how-sessions-start}

`POST /v1/agents/sessions` से Session बनाएँ। Session `source: "direct"` रिपोर्ट करता है।

## Session चलाएँ {#run-a-session}

Native event stream **केवल live** है: disconnect के बाद events दोबारा नहीं भेजे जाते। Input भेजने से पहले इसे खोलें, और history items या turns से पढ़ें।

```bash
# 1. Create the Session
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-2026-10-06" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60"}'

# 2. In another terminal, follow live events (server-sent events)
curl -N https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY"

# 3. Send input (202 Accepted, no body)
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "List three notable launches this week."}]}'

# 4. Read the history afterwards
curl "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

आधिकारिक OpenAI Python SDK के साथ यही flow। पहले stream खोलें, किसी दूसरे thread से input भेजें, और terminal turn event पर रुकें। Node.js version और SDK अंतर के लिए [OpenAI compatibility](/agents/openai-compatibility) देखें।

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
import threading
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
session = client.beta.agents.sessions.create(
    agent_id="agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
    environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
)

def send_input():
    client.beta.agents.sessions.events.create(
        session.id,
        events=[{
            "type": "agent.session.input.message",
            "input": [{"role": "user", "content": [{"type": "input_text", "text": "List three notable launches this week."}]}],
        }],
        idempotency_key="market-scan-input-1",
    )

with client.beta.agents.sessions.events.stream(session.id) as stream:
    threading.Thread(target=send_input).start()
    for event in stream:
        print(event.type)
        if event.type in ("agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"):
            break
```

हर send में ठीक एक event होता है। `input` एक text string है, या ऐसा array जिसमें ठीक एक user message हो और उस message में ठीक एक `input_text` part हो: `[{"role": "user", "content": [{"type": "input_text", "text": "…"}]}]`। कोई अन्य रूप `400 invalid_request` लौटाता है। चल रहे turn को रोकने के लिए `{"type": "agent.session.input.cancel"}` भेजें, या `Idempotency-Key` के साथ `POST /v1/agents/sessions/{session_id}/cancel` call करें। Idle Session को cancel करने पर भी `202 {"accepted": true}` मिलता है और कुछ नहीं बदलता। Session बनाते समय आप पहला `input` भी पास कर सकते हैं। Create पर `stream: true` समर्थित नहीं है।

## Status और विफलताएँ {#status-and-failures}

| Field | Values | अर्थ |
|---|---|---|
| `status` | `idle`, `in_progress`, `failed` | Session की execution स्थिति |
| `lifecycle_status` | `active`, `archived` | Session input स्वीकार करता है या नहीं |
| `failure` | `null` या `{code, message, action, retryable?}` | विफलता का सार्वजनिक कारण और सुझाया गया अगला कदम |

`failure.action` बताता है कि क्या करना है: `retry_later`, `inspect_history`, `create_new_session`, `check_model_account`, या `create_session_with_updated_model_provider`। [Failure code table](/api-reference/sessions/#status-fields) देखें।

Client से result माँगने वाले function tools (`requires_action`) अभी समर्थित नहीं हैं; ऐसे Session को पढ़ने पर `502 executor_contract_error` मिलता है।

यदि कोई send `409 session_input_pending` लौटाता है, तो पिछला input अभी भी deliver हो रहा है। प्रतीक्षा करें और Session पढ़ें; नई `Idempotency-Key` के साथ दोबारा न भेजें, वरना input दो बार चल सकता है।

## आर्काइव {#archive}

`DELETE /v1/agents/sessions/{session_id}` किसी Session को archive करता है; Sessions स्थायी रूप से delete नहीं होते। `POST /v1/agents/sessions/{session_id}/archive` और `/unarchive` `{"row_version": …}` लेते हैं। Archived Sessions अपनी history रखते हैं, लेकिन input, metadata updates और streams अस्वीकार करते हैं।

## अटैचमेंट {#attachments}

`POST /v1/agents/sessions/{session_id}/files` से Session workspace में file upload करें (multipart field `file`, अधिकतम 5 MiB, `Idempotency-Key` आवश्यक)। समर्थित types हैं `.txt`, `.md`, `.csv`, `.log`, `.json`, `.pdf`, `.png`, `.jpg`, `.jpeg` और `.webp`। जब file का `status` `ready` हो जाए, तो उसे अधिकतम नौ अन्य files के साथ भेजें:

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-2" \
  -H "Content-Type: application/json" \
  -d '{"input": "Summarize the attached report.", "file_ids": ["fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72"]}'
```

## Clients को फिर से जोड़ना {#reconnecting-clients}

Browser-style clients जिन्हें connection टूटने के बाद एक सुसंगत view चाहिए, `POST /v1/agents/sessions/{session_id}/reconnect` call कर सकते हैं। यह Session और `GET /v1/agents/sessions/{session_id}/events/stream` के लिए एक `stream_url` लौटाता है, जो पहले `session.snapshot` भेजता है और फिर live events और `heartbeat`। यदि वह stream `stream.interrupted` भेजता है, तो input दोबारा भेजने के बजाय फिर से reconnect करें।

## GitHub रिपॉज़िटरी {#github-repository}

GitHub repository को `/workspace` में clone करने और Agent को अपनी Session branches पर push करने देने के लिए create पर `github_workspace` भेजें। [GitHub repository workspace](/agents/github-workspace) देखें।

## मॉडल क्रेडेंशियल {#model-credentials}

जब तक आप `model_provider` नहीं भेजते, Session उसी API key से models call करता है जिससे वह बनाया गया था। अपने OpenAI-compatible HTTPS endpoint पर चलाने के लिए `{"type": "custom", "base_url": "https://…", "api_key": "…"}` का उपयोग करें। `model_provider` write-only है।

## ID {#ids}

| Prefix | Resource |
|---|---|
| `agt_` | Agent |
| `ses_` | Session |
| `skl_` | Skill |
| `mcp_` | MCP connection |
| `sec_` | Secret |
| `fil_` | Session attachment |

IDs को opaque strings मानें।

## अगले कदम {#next-steps}

- [Sessions API reference](/api-reference/sessions/)
- [OpenAI compatibility](/agents/openai-compatibility)

## Workspace files और generated artifacts {#workspace-files-and-generated-artifacts}

इन तीन resources के उद्देश्य अलग-अलग हैं:

| Resource | किसके लिए उपयोग करें | Pagination |
|---|---|---|
| [Attachments](/api-reference/sessions/list-files) | आपके द्वारा upload की गई files, जिन्हें input में `file_id` से reference किया जा सकता है | `limit` / `offset` |
| [Workspace files](/api-reference/sessions/list-workspace-files) | किसी workspace directory में मौजूदा file paths और sizes | `page` / `next` |
| [Artifacts](/api-reference/sessions/list-artifacts) | Download के लिए उपलब्ध अपरिवर्तनीय generated outputs | `after` / `last_id` |

`art_` ID पाने के लिए artifacts list करें, फिर वही ID [Download Artifact](/api-reference/sessions/download-artifact) को पास करें। Workspace path या attachment `file_id` इसकी जगह नहीं ले सकते। Workspace listing केवल metadata लौटाती है और यह किसी भी path को download करने वाली API नहीं है। Artifacts को 200 MiB तक की पूरी files के रूप में download किया जा सकता है; आंशिक `Range` downloads समर्थित नहीं हैं।

