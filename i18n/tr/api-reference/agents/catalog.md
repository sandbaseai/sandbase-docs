---
i18nSource: 1b5099685e9df6ce
title: Agent Kataloğu
description: Herkese açık Agents'lara göz atın ve birini organizasyonunuza klonlayın.
---

# Agent Kataloğu {#agent-catalog}

Katalog, SandBase'in yeniden kullanım için yayımladığı Agents'ları listeler. Katalog girdileri salt okunurdur. Organizasyonunuzda düzenleyebileceğiniz, çalıştırabileceğiniz ve dağıtabileceğiniz özel bir Agent elde etmek için bir girdiyi klonlayın.

| Yöntem | Yol | Amaç |
|---|---|---|
| `GET` | `/v1/agents/catalog` | Herkese açık Agents'ları listeler |
| `GET` | `/v1/agents/catalog/{agent_id}` | Herkese açık tek bir Agent'ı, isteğe bağlı olarak `?version=` ile alır |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | Agent'ı organizasyonunuza kopyalar |

## Katalog Agents'larını listeleme {#list-catalog-agents}

`limit` (1-100), `after` ve `order` ile imleç tabanlı sayfalama.

```bash
curl "https://api.sandbase.ai/v1/agents/catalog?limit=20" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Her girdide `id`, `object: "agent"`, `visibility: "public"`, `version`, `name`, `description`, `model`, `created_at` ve `updated_at` bulunur.

## Katalogdaki bir Agent'ı alma {#get-a-catalog-agent}

```bash
curl "https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60?version=2" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`version` isteğe bağlıdır ve pozitif bir tam sayı olmalıdır. Ayrıntı yanıtı, salt okunur bir `configuration` nesnesi ekler (ad, açıklama, model, talimatlar, çalışma zamanı profili, meta veriler, araçlar, metin, akıl yürütme ve Skills).

## Katalogdaki bir Agent'ı klonlama {#clone-a-catalog-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/clone \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: clone-research-agent" \
  -H "Content-Type: application/json" \
  -d '{"name": "My research assistant"}'
```

Gövde isteğe bağlı olarak `version` (pozitif tam sayı, varsayılan olarak geçerli herkese açık sürüm) ve `name` (en fazla 128 karakter) alanlarını kabul eder. Yanıt `201 Created` olur ve organizasyonunuzda yeni bir `agt_` kimliğine sahip eksiksiz bir [Agent nesnesi](./create) içerir. `Idempotency-Key` isteğe bağlıdır; yeniden denemenin ikinci bir kopya oluşturmaması için sabit bir anahtar gönderin.

Klonladıktan sonra test etmek için [bir Session oluşturun](/api-reference/sessions/create).
