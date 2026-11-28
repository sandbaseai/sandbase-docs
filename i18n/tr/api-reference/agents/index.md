---
i18nSource: 8524e8b4d6f5ab97
title: Agents API
description: Kayıtlı Agent yapılandırmalarını oluşturun, sürümleyin, arşivleyin ve klonlayın.
---

# Agents API {#agents-api}

Agent; model, talimatlar, çalışma zamanı profili, Skills, MCP bağlantıları ve çıktı ayarlarından oluşan kayıtlı, sürümlü bir yapılandırmadır. Bir Agent'ı oluşturmak veya güncellemek onu çalıştırmaz. Agent'ı bir [Session](/api-reference/sessions/) içinde çalıştırın.

Agents API, OpenAI Agents protokolünü izler (OpenAI Python SDK'daki `client.beta.agents`). `OpenAI-Beta` başlığı isteğe bağlıdır; gönderirseniz değeri `agents=v1` olmalıdır. SandBase buna sürümler, compare-and-set güncellemeleri, arşivleme ve geri yükleme ile herkese açık bir katalog ekler.

## Agent işlemleri {#agent-operations}

| Yöntem | Yol | Amaç |
|---|---|---|
| `POST` | `/v1/agents` | Sürüm 1 olarak [Agent oluşturma](./create) |
| `GET` | `/v1/agents` | [Agents'ları listeleme](./list) |
| `GET` | `/v1/agents/{agent_id}` | [Agent alma](./get) |
| `POST` | `/v1/agents/{agent_id}` | [Agent güncelleme](./update) (SDK tarzı kısmi güncelleme) |
| `PATCH` | `/v1/agents/{agent_id}` | `row_version` üzerinde [compare-and-set ile değiştirme](./replace) |
| `DELETE` | `/v1/agents/{agent_id}` | Agent'ı arşivleyen [silme](./delete) işlemi |
| `POST` | `/v1/agents/{agent_id}/archive` | [Agent arşivleme](./archive) |
| `POST` | `/v1/agents/{agent_id}/unarchive` | [Agent'ı arşivden çıkarma](./unarchive) |
| `POST` | `/v1/agents/{agent_id}/restore` | [Önceki bir sürümü](./restore) yeni sürüm olarak geri yükleme |
| `GET` | `/v1/agents/{agent_id}/versions` | [Sürümleri listeleme](./versions) |
| `GET` | `/v1/agents/{agent_id}/versions/{version}` | [Tek bir sürümü alma](./get-version) |
| `GET` | `/v1/agents/catalog` | [Herkese açık kataloğa göz atma](./catalog) |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | [Katalogdaki bir Agent'ı](./catalog#clone-a-catalog-agent) organizasyonunuza klonlama |

Agent kimlikleri `agt_` önekini kullanır. İstek gövdeleri en fazla 1 MiB boyutunda katı JSON'dur; bilinmeyen alanlar 400 döndürür.

## Sürümler ve güncellemeler {#versions-and-updates}

- Her etkili yazma işlemi (create, update, replace, restore) değiştirilemez bir sürüm üretir. `version`, geçerli sürüm numarasıdır.
- `POST /v1/agents/{agent_id}`, OpenAI SDK güncellemesidir. `row_version` gerektirmez; bu nedenle son yazan kazanır.
- `PATCH /v1/agents/{agent_id}`, en son okuduğunuz `row_version` değerini gerektirir ve Agent'ı sizden önce başka biri değiştirdiyse 409 döndürür. Eşzamanlı çalışabilen düzenleyicilerde ve otomasyonlarda bunu kullanın.
- Her Session, başladığı andaki Agent sürümünü, Skill sürümlerini ve MCP bağlantı yapılandırmasını dondurur.

## Hazır olma durumu {#readiness}

Yeni yazılmış bir sürüm, yürütmeye hazırlanırken `projection_status` bildirir. Sessions, `projection_status` değeri `ready` olan etkin bir Agent gerektirir; aksi halde 409 döndürür. Arşivlenmiş Agents da yeni yürütmeler için 409 döndürür.

## Güncel sınırlar {#current-limits}

- `tools`, `function` araçlarını ve en fazla bir `web_search` aracını kabul eder. Yürütme şu anda `web_search.mode` değerinin `disabled` olmasını gerektirir.
- Function araçları kaydedilebilir, ancak istemciden araç sonucu döndürmesini isteyen Runs (`requires_action`) henüz desteklenmez ve `502 executor_contract_error` olarak görünür.
- `multi_agent` atlanmalı veya `null` olmalıdır.

## Sayfalama {#pagination}

`GET /v1/agents` ve katalog imleç tabanlı sayfalama kullanır: `limit` (1-100, varsayılan 20), `after` ve `order` (`asc` veya `desc`, varsayılan `desc`). Yanıtlar `object: "list"`, `data`, `has_more`, `first_id` ve `last_id` içerir; sonraki sayfa için `last_id` değerini `after` olarak gönderin.

`GET /v1/agents/{agent_id}/versions` ofset tabanlı sayfalama kullanır: `limit` ve `offset`; yanıtta `data`, `total`, `limit` ve `offset` bulunur.

## Hatalar {#errors}

Hatalar Agents zarfını kullanır: `{"error":{"type","code","param":null,"message"}}`. Kod listesi için [Hatalar](/api-reference/errors#agents-platform-errors) sayfasına bakın.
