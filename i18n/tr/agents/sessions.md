---
i18nSource: e904f2b8bbd0ccc4
title: Sessions
description: Bir Agent'ı Session içinde çalıştırın, olaylarını akış olarak alın, geçmişi okuyun, dosya ekleyin ve hataları yönetin.
---

# Sessions {#sessions}

Bir **Session**, kaydedilmiş bir Agent sürümünü SandBase'in barındırılan bulutunda çalıştırır; yürütme ortamını siz seçmezsiniz. Kimliği `ses_` ile başlar ve tüm Session yolları `/v1/agents/sessions` altındadır. Session, başlatıldığı andaki Agent sürümünü, Skill sürümlerini ve MCP bağlantı yapılandırmasını sabitler.

## Sessions nasıl başlar {#how-sessions-start}

`POST /v1/agents/sessions` ile bir Session oluşturun. Session `source: "direct"` değerini bildirir.

## Session çalıştırma {#run-a-session}

Yerel olay akışı **yalnızca canlıdır**: bağlantı koptuktan sonra olaylar yeniden oynatılmaz. Girdi göndermeden önce akışı açın ve geçmişi item'lardan veya turlardan okuyun.

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

Aynı akış, resmi OpenAI Python SDK'sı ile. Önce akışı açın, girdiyi başka bir iş parçacığından gönderin ve terminal tur olayında durun. Node.js sürümü ve SDK farkları için [OpenAI uyumluluğu](/agents/openai-compatibility) sayfasına bakın.

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

Her gönderim tam olarak bir olay taşır. `input` bir metin dizesidir ya da tam olarak bir `input_text` parçası içeren tam olarak bir user mesajından oluşan bir dizidir: `[{"role": "user", "content": [{"type": "input_text", "text": "…"}]}]`. Başka her yapı `400 invalid_request` döndürür. Çalışan turu durdurmak için `{"type": "agent.session.input.cancel"}` gönderin veya `POST /v1/agents/sessions/{session_id}/cancel` uç noktasını bir `Idempotency-Key` ile çağırın. Boştaki bir Session'ı iptal etmek yine `202 {"accepted": true}` döndürür ve hiçbir şeyi değiştirmez. Session'ı oluştururken ilk `input` değerini de gönderebilirsiniz. Oluşturma sırasında `stream: true` desteklenmez.

## Durum ve hatalar {#status-and-failures}

| Alan | Değerler | Anlamı |
|---|---|---|
| `status` | `idle`, `in_progress`, `failed` | Session'ın yürütme durumu |
| `lifecycle_status` | `active`, `archived` | Session'ın girdi kabul edip etmediği |
| `failure` | `null` veya `{code, message, action, retryable?}` | Hatanın herkese açık nedeni ve önerilen sonraki adım |

`failure.action` ne yapmanız gerektiğini söyler: `retry_later`, `inspect_history`, `create_new_session`, `check_model_account` veya `create_session_with_updated_model_provider`. [Hata kodu tablosuna](/api-reference/sessions/#status-fields) bakın.

İstemciden sonuç isteyen function araçları (`requires_action`) henüz desteklenmez; böyle bir Session'ı okumak `502 executor_contract_error` döndürür.

Bir gönderim `409 session_input_pending` döndürürse önceki girdi hâlâ iletilmektedir. Bekleyin ve Session'ı okuyun; yeni bir `Idempotency-Key` ile yeniden göndermeyin, aksi halde girdi iki kez çalışabilir.

## Arşivleme {#archive}

`DELETE /v1/agents/sessions/{session_id}` bir Session'ı arşivler; Sessions kalıcı olarak silinmez. `POST /v1/agents/sessions/{session_id}/archive` ve `/unarchive`, `{"row_version": …}` alır. Arşivlenmiş Sessions geçmişlerini korur ancak girdiyi, metadata güncellemelerini ve akışları reddeder.

## Ekler {#attachments}

`POST /v1/agents/sessions/{session_id}/files` ile Session çalışma alanına bir dosya yükleyin (multipart alanı `file`, en fazla 5 MiB, `Idempotency-Key` zorunlu). Desteklenen türler `.txt`, `.md`, `.csv`, `.log`, `.json`, `.pdf`, `.png`, `.jpg`, `.jpeg` ve `.webp`'dir. Dosyanın `status` değeri `ready` olduğunda dosyayı en fazla dokuz başka dosyayla birlikte gönderin:

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-2" \
  -H "Content-Type: application/json" \
  -d '{"input": "Summarize the attached report.", "file_ids": ["fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72"]}'
```

## Yeniden bağlanan istemciler {#reconnecting-clients}

Kopan bir bağlantıdan sonra tutarlı bir görünüme ihtiyaç duyan tarayıcı tarzı istemciler `POST /v1/agents/sessions/{session_id}/reconnect` çağrısını yapabilir. Bu çağrı Session'ı ve `GET /v1/agents/sessions/{session_id}/events/stream` için bir `stream_url` döndürür; bu akış önce bir `session.snapshot`, ardından canlı olayları ve `heartbeat` gönderir. Akış `stream.interrupted` yayarsa girdiyi yeniden göndermek yerine yeniden bağlanın.

## GitHub deposu {#github-repository}

Bir GitHub deposunu `/workspace` içine klonlamak ve Agent'ın kendi Session dallarına push yapmasına izin vermek için oluşturma sırasında `github_workspace` gönderin. [GitHub deposu çalışma alanı](/agents/github-workspace) sayfasına bakın.

## Model kimlik bilgileri {#model-credentials}

`model_provider` göndermediğiniz sürece Session, modelleri kendisini oluşturan API anahtarıyla çağırır. Kendi OpenAI uyumlu HTTPS uç noktanızda çalıştırmak için `{"type": "custom", "base_url": "https://…", "api_key": "…"}` kullanın. `model_provider` yalnızca yazılabilir.

## Kimlikler {#ids}

| Önek | Kaynak |
|---|---|
| `agt_` | Agent |
| `ses_` | Session |
| `skl_` | Skill |
| `mcp_` | MCP bağlantısı |
| `sec_` | Secret |
| `fil_` | Session eki |

Kimlikleri opak dizeler olarak ele alın.

## Sonraki adımlar {#next-steps}

- [Sessions API referansı](/api-reference/sessions/)
- [OpenAI uyumluluğu](/agents/openai-compatibility)

## Çalışma alanı dosyaları ve oluşturulan yapıtlar {#workspace-files-and-generated-artifacts}

Bu üç kaynak farklı amaçlara hizmet eder:

| Kaynak | Kullanım amacı | Sayfalama |
|---|---|---|
| [Ekler](/api-reference/sessions/list-files) | Yüklediğiniz ve girdide bir `file_id` ile başvurabileceğiniz dosyalar | `limit` / `offset` |
| [Çalışma alanı dosyaları](/api-reference/sessions/list-workspace-files) | Bir çalışma alanı dizinindeki güncel dosya yolları ve boyutları | `page` / `next` |
| [Yapıtlar](/api-reference/sessions/list-artifacts) | İndirilebilen, değiştirilemez oluşturulmuş çıktılar | `after` / `last_id` |

Bir `art_` kimliği almak için yapıtları listeleyin, ardından tam olarak bu kimliği [Download Artifact](/api-reference/sessions/download-artifact) uç noktasına verin. Bir çalışma alanı yolu veya ek `file_id` değeri onun yerine kullanılamaz. Çalışma alanı listesi yalnızca meta veri döndürür ve rastgele yollardan indirme yapan bir API değildir. Yapıtlar en fazla 200 MiB'lık tam dosyalar olarak indirilebilir; kısmi `Range` indirmeleri desteklenmez.
