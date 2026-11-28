---
i18nSource: ee126767f58b111b
title: MCP Connections API
description: Agent'ların çağırabileceği uzak HTTPS MCP sunucularını kaydedin.
---

# MCP Connections API {#mcp-connections-api}

Bir MCP bağlantısı, HTTPS üzerinden erişilebilen uzak bir MCP sunucusunu kaydeder. Agent'lar bağlantılara `mcp_connections` içinde başvurur; her Session, başladığında bağlantı yapılandırmasını sabitler. Bağlantı kimlikleri `mcp_` önekini kullanır. Sunucuda bir Bearer token ile kimlik doğrulamak için önce aynı URL için bir [Secret](/agents/api-credentials#with-the-api) oluşturun.

| Metot | Yol | Amaç |
|---|---|---|
| `POST` | `/v1/mcp-connections` | [Bağlantı oluşturma](#create-a-connection) |
| `GET` | `/v1/mcp-connections` | [Bağlantıları listeleme](#list-connections) |
| `GET` | `/v1/mcp-connections/{connection_id}` | [Bağlantı getirme](#get-a-connection) |
| `PUT` | `/v1/mcp-connections/{connection_id}` | [Bağlantıyı değiştirme](#replace-a-connection) |
| `POST` | `/v1/mcp-connections/{connection_id}/enable` | [Bağlantıyı etkinleştirme](#enable-a-connection) |
| `DELETE` | `/v1/mcp-connections/{connection_id}` | [Bağlantıyı devre dışı bırakma](#disable-a-connection) |

Her yazma işlemi `Idempotency-Key` gerektirir (1-128 bayt, başta veya sonda boşluk olmadan). Bağlantı nesnesinde `id`, `name`, `server_url`, `secret_id` (ayarlandığında), `status` (`active` veya `disabled`), `row_version`, `created_at` ve `updated_at` bulunur.

## Bağlantı oluşturma {#create-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
```

- `name` zorunludur, boş olamaz ve en fazla 128 bayttır.
- `server_url`, kullanıcı bilgisi, sorgu veya fragment içermeyen bir HTTPS adresi olmalıdır (en fazla 2048 bayt).
- `secret_id` isteğe bağlıdır. Anonim bir sunucu için göndermeyin. Ayarlandığında Secret `active` olmalı ve `server_url` değeri bu `server_url` ile tam olarak aynı olmalıdır; aksi halde istek başarısız olur (etkin olmayan Secret için 409, URL uyuşmazlığı için 400).

`201 Created` döndürür.

## Bağlantıları listeleme {#list-connections}

```bash
curl "https://api.sandbase.ai/v1/mcp-connections?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`data`, `total`, `limit` ve `offset` ile offset sayfalama. `limit` varsayılan olarak 20'dir ve en fazla 200 olabilir; eksik, geçersiz veya pozitif olmayan değerler için 20 kullanılır. `offset` varsayılan olarak 0'dır; geçersiz veya pozitif olmayan değerler için 0 kullanılır. `offset + data.length >= total` olana kadar dönen `limit` kadar ilerleyin. Devre dışı bırakılmış kaynaklar listede görünmeye devam eder.

## Bağlantı getirme {#get-a-connection}

```bash
curl https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

## Bağlantıyı değiştirme {#replace-a-connection}

```bash
curl -X PUT https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-v2" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "row_version": 1}'
```

`PUT`, `name`, `server_url` ve `secret_id` alanlarını birlikte değiştirir; `secret_id` gönderilmezse bağlantı anonim olur. `row_version` zorunludur ve Get Connection'ın döndürdüğü mevcut değerle eşleşmelidir. Güncellenen bağlantıyla birlikte `200 OK` döndürür. Devre dışı bir bağlantı, değiştirildikten sonra siz etkinleştirene kadar devre dışı kalır.

## Bağlantıyı etkinleştirme {#enable-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13/enable \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-enable" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 3}'
```

`row_version` zorunludur ve mevcut kaynakla eşleşen pozitif bir tamsayı olmalıdır. Bağlantıyla birlikte `200 OK` döndürür. Etkinleştirme aynı bağlantı kimliğini korur. İptal edilmiş bir Secret'ı geri getirmez; önce bağlantıyı yeni ve etkin bir Secret ile değiştirin.

## Bağlantıyı devre dışı bırakma {#disable-a-connection}

```bash
curl -X DELETE https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-disable"
```

`204 No Content` döndürür ve `status` değerini `disabled` yapar. Yeni Sessions bağlantıyı kullanamaz; bağlantıyı sabitlemiş mevcut Sessions da sonraki girdileri reddeder. Hâlihazırda çalışan bir araç çağrısı kesilmez.

## Değişiklikler ve çalışan Sessions {#changes-and-running-sessions}

Sessions, başladıklarında bağlantı ayarlarını sabitler. Bir bağlantıyı değiştirdikten veya Secret'ını yeniledikten sonra yeni Sessions yeni yapılandırmayı kullanır, mevcut Sessions ise kendi anlık görüntülerini korur. Bağlantıyı devre dışı bırakmak veya Secret'ını iptal etmek hem yeni Sessions'ı hem de mevcut Sessions'a yapılan sonraki girdileri engeller.

## Hatalar ve yeniden denemeler {#errors-and-retries}

Hatalar [Agents hata zarfını](/api-reference/errors#agents-platform-errors) kullanır. Geçersiz alanlar veya eksik yazma idempotency anahtarı `400 invalid_request` döndürür; bilinmeyen veya erişilemeyen bir kaynak `404 not_found` döndürür. Güncel olmayan `row_version`, uyumsuz bir yaşam döngüsü durumu veya bir oluşturma/güncelleme anahtarının farklı girdiyle yeniden kullanılması `409 conflict` döndürür. Yeni bir güncelleme göndermeden önce kaynağı yeniden okuyun ve her yeni yazma işlemi için yeni bir anahtar kullanın.

`created_at` ve `updated_at`, RFC 3339 zaman damgası dizeleridir.
