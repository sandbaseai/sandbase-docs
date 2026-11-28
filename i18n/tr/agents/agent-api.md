---
i18nSource: 2ba7f0f41847d04f
title: Agent tanımlama
description: Agents API ile alanlar, sınırlar, sürümler ve arşivleme dahil olmak üzere sürümlü bir Agent oluşturun ve güncelleyin.
---

# Agent tanımlama {#define-an-agent}

`POST /v1/agents` ile bir Agent oluşturun. API, OpenAI Agents protokolünü izler; bu nedenle düz HTTP veya `base_url="https://api.sandbase.ai/v1"` ile OpenAI SDK'sının `client.beta.agents` istemcisini kullanabilirsiniz. `OpenAI-Beta` başlığı isteğe bağlıdır; gönderirseniz değeri `agents=v1` olmalıdır. SDK'nın neleri desteklediği için [OpenAI uyumluluğu](/agents/openai-compatibility) sayfasına bakın.

## Agent oluşturma {#create-an-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: create-research-agent-1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research assistant",
    "model": "deepseek/deepseek-v4-flash",
    "instructions": "Research the question, compare at least two sources, and cite them.",
    "metadata": {"team": "research"}
  }'
```

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
agent = client.beta.agents.create(
    model="deepseek/deepseek-v4-flash",
    name="Research assistant",
    instructions="Research the question, compare at least two sources, and cite them.",
    metadata={"team": "research"},
)
print(agent.id, agent.version)  # agt_..., 1
```

Yanıt, Agent ile birlikte `201 Created` döner: bir `agt_` kimliği, `version: 1`, `row_version`, `status: "active"` ve `projection_status`. Yeni sürüm arka planda yürütmeye hazırlanır; `projection_status` değeri `ready` olduğunda Session başlatın.

`Idempotency-Key` isteğe bağlıdır. Bunu atlarsanız hizmet bir anahtar üretir; bu durumda yeniden denenen bir istek ikinci bir Agent oluşturabilir. Yeniden denerken kendi sabit anahtarınızı gönderin.

## Alanlar {#fields}

Gövde katı JSON'dur (en fazla 1 MiB). Bilinmeyen alanlar 400 döndürür.

| Alan | Zorunlu | Sınırlar ve değerler |
|---|---|---|
| `model` | Evet | Model kimliği, en fazla 200 karakter |
| `name` | Hayır | En fazla 128 karakter |
| `instructions` | Hayır | En fazla 256 KiB |
| `description` | Hayır | En fazla 4096 karakter |
| `runtime_profile` | Hayır | `codex` (varsayılan), `claude` veya `mcode` |
| `skills` | Hayır | En fazla 32 referans. `version: null` içeren yeni bir bağlama, kaydedildiği anda geçerli varsayılan sürümü sabitler; mevcut bağlamalar sabitlenmiş sürümlerini korur. Yükseltmek için açık bir sürüm belirtin; bkz. [Skills](/agents/mcp-tools#skills) |
| `mcp_connections` | Hayır | En fazla 32 referans; bkz. [MCP bağlantıları](/agents/mcp-tools#mcp-connections) |
| `tools` | Hayır | En fazla 64 `function` aracı ve en fazla bir `web_search` aracı |
| `text` | Hayır | `format.type` `text` veya `json_schema` (nesne şeması); `verbosity` `low`, `medium` veya `high` |
| `reasoning` | Hayır | `effort` `none`, `minimal`, `low`, `medium`, `high`, `xhigh` veya `max`; `summary` `concise`, `detailed` veya `auto` |
| `service_tier` | Hayır | `auto` (varsayılan), `default`, `flex`, `priority` veya `fast` |
| `metadata` | Hayır | En fazla 16 metin çifti; anahtarlar en fazla 64, değerler en fazla 512 karakter |
| `note` | Hayır | Sürümde saklanan değişiklik notu |

## Mevcut sınırlamalar {#current-limits}

- Session'ların başlayabilmesi için `web_search` aracı `"mode": "disabled"` kullanmalıdır.
- `function` araçları kaydedilebilir, ancak istemcinin bir araç sonucu döndürmesini gerektiren Run'lar (`requires_action`) henüz desteklenmez. Bu durumdaki bir Session `502 executor_contract_error` döndürür. Bunun yerine Agent'a dış yetenekleri [MCP bağlantıları](/agents/mcp-tools#mcp-connections) üzerinden kazandırın.
- `multi_agent` atlanmalı veya `null` olmalıdır.

## Agent güncelleme {#update-an-agent}

İki güncelleme biçimi vardır. Her ikisi de yeni bir sürüm oluşturur.

- `POST /v1/agents/{agent_id}`, OpenAI SDK güncellemesidir. Yalnızca değiştirmek istediğiniz alanları gönderin. `row_version` gerekmez; bu nedenle son yazan kazanır. Bu biçimde `description` ve `note` kabul edilmez.
- `PATCH /v1/agents/{agent_id}`, karşılaştır-ve-ayarla (compare-and-set) güncellemesidir. En son okuduğunuz `row_version` değerini gerektirir ve bu arada Agent değiştiyse 409 döndürür. Açık `null` değerleri reddedilir.

```bash
curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 2, "instructions": "Answer in five bullet points with cited sources.", "note": "Shorter answers"}'
```

## Sürümler, arşivleme ve geri yükleme {#versions-archive-and-restore}

- `GET /v1/agents/{agent_id}/versions` değiştirilemez anlık görüntüleri listeler; `GET /v1/agents/{agent_id}/versions/{version}` bunlardan birini okur.
- `{"source_version": 1, "row_version": 3}` ile `POST /v1/agents/{agent_id}/restore`, önceki bir yapılandırmayı yeni bir geçerli sürüme kopyalar.
- `POST /v1/agents/{agent_id}/archive` ve `/unarchive`, `{"row_version": …}` alır. Arşivlenmiş Agent'lar yeni Session başlatamaz.
- `DELETE /v1/agents/{agent_id}` Agent'ı arşivler. Agent'lar hiçbir zaman kalıcı olarak silinmez.

## Sonraki adımlar {#next-steps}

- [Skills ve MCP araçları](/agents/mcp-tools)
- [Agent'ı bir Session içinde çalıştırma](/agents/sessions)
- [Agents API referansı](/api-reference/agents/)
