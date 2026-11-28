---
i18nSource: 99170a141af66587
title: Sessions API
description: Kayıtlı bir Agent sürümünü çalıştırın, girdi gönderin, olayları akış halinde alın ve Session geçmişini okuyun.
---

# Sessions API {#sessions-api}

Bir Session, kayıtlı bir [Agent](/api-reference/agents/) sürümünü SandBase'in barındırılan bulutunda çalıştırır; seçilecek bir yürütme ortamı yoktur. Session kimlikleri `ses_` önekini kullanır. Session'lar Agents'ın alt kaynağıdır: her yol `/v1/agents/sessions` ile başlar.

Standart işlemler OpenAI Agents protokolünü (`client.beta.agents.sessions`) izler; resmi SDK'nın neleri yapıp neleri yapamadığı için [OpenAI uyumluluğu](/agents/openai-compatibility) sayfasına bakın. SandBase uzantıları yeniden adlandırma, arşiv durumu, iptal, ekler, çalışma alanı dosya meta verileri, değiştirilemez yapıtlar ve yeniden bağlanılabilir bir ürün akışı ekler.

::: info Session'lar nereden gelir
Bir Session'ı doğrudan `POST /v1/agents/sessions` ile oluşturursunuz. Session `source: "direct"` ve `source_id: null` bildirir.
:::

## Önerilen akış {#recommended-flow}

1. Kayıtlı bir Agent için [Session oluşturun](./create). Session seçilen Agent sürümünü ve MCP bağlantılarını dondurur ve o Agent sürümüne zaten sabitlenmiş Skill sürümlerini kullanır.
2. `GET /v1/agents/sessions/{session_id}/events` ile [olay akışını açın](./stream). Akış yalnızca canlıdır; bu nedenle girdi göndermeden önce açın.
3. `POST /v1/agents/sessions/{session_id}/events` ve bir `agent.session.input.message` olayıyla [girdi gönderin](./send-events). Çağrı 202 döndürür.
4. Sonuçları akıştan veya sonradan [öğeler](./items) ve [turlar](./turns) üzerinden okuyun.

## Session işlemleri {#session-operations}

| Yöntem | Yol | Amaç |
|---|---|---|
| `POST` | `/v1/agents/sessions` | [Session oluşturma](./create) |
| `GET` | `/v1/agents/sessions` | [Session'ları listeleme](./list) |
| `GET` | `/v1/agents/sessions/{session_id}` | [Session getirme](./get) |
| `POST` | `/v1/agents/sessions/{session_id}` | [Meta verileri değiştirme](./update) |
| `PATCH` | `/v1/agents/sessions/{session_id}` | `row_version` ile [yeniden adlandırma](./rename) |
| `DELETE` | `/v1/agents/sessions/{session_id}` | Session'ı arşivleyen [silme](./delete) |
| `POST` | `/v1/agents/sessions/{session_id}/events` | [Bir girdi veya iptal olayı gönderme](./send-events) |
| `GET` | `/v1/agents/sessions/{session_id}/events` | [Canlı olay akışı](./stream) (SSE) |
| `GET` | `/v1/agents/sessions/{session_id}/items` | [Öğeleri listeleme](./items) |
| `GET` | `/v1/agents/sessions/{session_id}/turns` | [Turları listeleme](./turns) |
| `GET` | `/v1/agents/sessions/{session_id}/turns/{turn_id}` | [Tek bir turu getirme](./get-turn) |
| `POST` | `/v1/agents/sessions/{session_id}/cancel` | [Çalışan turu iptal etme](./cancel) |
| `POST` | `/v1/agents/sessions/{session_id}/archive` | [Arşivleme](./archive) |
| `POST` | `/v1/agents/sessions/{session_id}/unarchive` | [Arşivden çıkarma](./unarchive) |
| `POST` | `/v1/agents/sessions/{session_id}/reconnect` | Kopan bir akıştan sonra [yeniden bağlanma](./reconnect) |
| `GET` | `/v1/agents/sessions/{session_id}/events/stream` | [Önce anlık görüntü, sonra canlı akış](./stream-snapshot) (SSE) |
| `POST` | `/v1/agents/sessions/{session_id}/files` | [Ek yükleme](./upload-file) |
| `GET` | `/v1/agents/sessions/{session_id}/files` | [Ekleri listeleme](./list-files) |
| `GET` | `/v1/agents/sessions/{session_id}/files/{file_id}/content` | [Ek indirme](./download-file) |
| `DELETE` | `/v1/agents/sessions/{session_id}/files/{file_id}` | [Ek silme](./delete-file) |
| `GET` | `/v1/agents/sessions/{session_id}/workspace-files` | [Çalışma alanı dosya meta verilerini listeleme](./list-workspace-files) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts` | [Değiştirilemez yapıtları listeleme](./list-artifacts) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` | [Yapıt indirme](./download-artifact) |

## Durum alanları {#status-fields}

- `status` yürütme durumudur: `idle`, `in_progress` veya `failed`. İstemci sonucu gerektiren function araçları (`requires_action`) henüz desteklenmez; böyle bir Session okunduğunda `502 executor_contract_error` döner.
- `lifecycle_status`, `active` veya `archived` değerini alır. Arşivlenmiş Session'lar girdiyi, meta veri güncellemelerini ve akışları reddeder. `DELETE` arşivler; `unarchive` geri yükler.
- `failure`, `null` ya da `code`, `message`, `action` ve bazen `retryable` içeren bir nesnedir.

| `failure.code` | Anlamı | Önerilen `action` |
|---|---|---|
| `session_creation_rejected` | Yürütme katmanı Session'ı reddetti | `create_new_session` |
| `model_authentication_failed` | Model sağlayıcısı anahtarı reddetti | `create_session_with_updated_model_provider` |
| `model_rate_limited` | Model sağlayıcısı hız sınırlaması uyguluyor (yeniden denenebilir) | `retry_later` |
| `model_quota_exceeded` | Model hesabının kotası yok | `check_model_account` |
| `context_limit_exceeded` | Konuşma model bağlamını aşıyor | `create_new_session` |
| `environment_connection_timeout` | Ortam zamanında bağlanmadı (yeniden denenebilir) | `retry_later` |
| `runtime_unavailable` | Yürütme ortamı kullanılamıyor (yeniden denenebilir) | `retry_later` |
| `model_request_failed` | Model isteği tamamlanmadı | `inspect_history` |
| `model_configuration_rejected` | Model veya yürütme katmanı yapılandırmayı reddetti | `create_session_with_updated_model_provider` |
| `execution_failed` | Daha belirli bir herkese açık nedeni olmayan hata | `inspect_history` |

Bir Session canlı olarak okunamadığında liste sonuçları `session_not_ready`, `session_execution_unavailable`, `session_configuration_unavailable` veya `session_snapshot_unavailable` içeren yer tutucu satırlar da içerebilir.

## Model kimlik bilgileri {#model-credentials}

Varsayılan olarak bir Session, modelleri onu oluşturan SandBase API anahtarıyla çağırır. Açıkça seçmek için `model_provider` gönderin:

- `{"type": "sandbase"}` çağıran anahtarınızı kullanır. `base_url` kullanılamaz.
- `{"type": "custom", "base_url": "https://…", "api_key": "…"}` kendi OpenAI uyumlu HTTPS uç noktanızı çağırır. URL kimlik bilgisi, sorgu veya parça içeremez ve SandBase hiçbir zaman SandBase anahtarınıza geri dönmez.

`model_provider` yalnızca yazılabilirdir ve yanıtlarda hiçbir zaman görünmez.

## Kabul ve hatalar {#admission-and-errors}

Session oluşturma ve girdi gönderme, yürütme kabulünü denetler: anahtar sınırı veya kuruluş bakiyesi tükendiğinde `402 spending_limit_exceeded`, kuruluş Agent çalıştıramadığında `403 org_disabled` ve denetim tamamlanamadığında `503 admission_unavailable` döner. Okumalar, iptal ve arşivleme bakiye nedeniyle engellenmez.

Girdi gönderme ayrıca `409 session_input_pending` (önceki girdi hâlâ iletiliyor; bekleyin ve yeni bir anahtarla yeniden göndermeyin), `409 session_input_expired` (yeniden göndermeden önce geçmişi inceleyin) veya `409 session_environment_unavailable` (bekleyin veya yeni bir Session oluşturun) döndürebilir. Bkz. [Hatalar](/api-reference/errors#agents-platform-errors).

## Sayfalama {#pagination}

Session'lar, öğeler, turlar ve yapıtlar imleç sayfalaması kullanır (`limit` 1-100, `after`, `order`). Ekler offset sayfalaması kullanır (`limit` 1-100, `offset`).

Çalışma alanı dosyaları bunun yerine `page` / `next` sayfalaması kullanır. Bkz. [Çalışma alanı dosyalarını listeleme](./list-workspace-files).
