---
i18nSource: dab112fdbbc56799
title: MCP araçları için kimlik bilgileri
description: Agent'ların kimlik doğrulamalı MCP sunucularını çağırabilmesi için yalnızca yazılabilir Bearer token'larını Secret olarak saklayın.
---

# MCP araçları için kimlik bilgileri {#credentials-for-mcp-tools}

Bir MCP sunucusu kimlik doğrulama gerektiriyorsa, Bearer token'ını bir **Secret** olarak saklayın ve Secret'ı bir [MCP bağlantısına](/agents/mcp-tools#mcp-connections) ekleyin. Yürütme ortamı token'ı yalnızca o sunucuya gönderir.

## Secret'lar nasıl çalışır {#how-secrets-work}

- `kind` her zaman `mcp_bearer` değerini alır: tek bir MCP sunucusu için Bearer token.
- Her Secret tam olarak bir `server_url` değerine bağlıdır. Bir bağlantı onu yalnızca kendi `server_url` değeri eşleştiğinde kullanabilir. Başka bir URL kullanmak için başka bir Secret oluşturun.
- Token yalnızca yazılabilir. API, Secret'ın adını, URL'sini, durumunu ve `row_version` değerini döndürür; token'ı asla döndürmez.
- Secret'lar ortam değişkeni değildir. Agent çalışma ortamına enjekte edilmezler ve Agent'lar onları okuyamaz.

SandBase'in önceki sürümleri, çalışma alanı veya Agent kapsamlı kimlik bilgilerini saklıyor ve bunları `GITHUB_TOKEN` gibi ortam değişkenleri olarak enjekte ediyordu. Bu model kullanımdan kaldırıldı ve kayıtları taşınmadı. Hâlâ ihtiyaç duyduğunuz değerleri MCP bağlantılarında Secret olarak yeniden oluşturun.

## API ile {#with-the-api}
Secret'ları API ile oluşturun, yenileyin ve iptal edin. Bu kılavuz API sözleşmesidir; Agent düzenleyicisinden açılan Console'daki Credentials sayfası, Secret davranışı için referans değildir. Bu endpoint'leri tarayıcı kodundan değil, her zaman güvenilir bir backend'den çağırın: bir SandBase API anahtarı ve düz metin bir token alırlar.

| Yöntem | Yol | Amaç |
|---|---|---|
| `POST` | `/v1/secrets` | [Secret oluşturma](#create-a-secret) |
| `GET` | `/v1/secrets` | [Secret'ları listeleme](#list-secrets) |
| `GET` | `/v1/secrets/{secret_id}` | [Secret alma](#get-a-secret) |
| `POST` | `/v1/secrets/{secret_id}/rotate` | [Token'ı yenileme](#rotate-a-secret) |
| `DELETE` | `/v1/secrets/{secret_id}` | [Secret'ı iptal etme](#revoke-a-secret) |

Her yazma işlemi `Idempotency-Key` gerektirir (1-128 bayt, başında veya sonunda boşluk olmadan). Secret nesnesinde `id` (`sec_` önekli), `name`, `kind`, `server_url`, `status`, `row_version`, `created_at` ve `updated_at` alanları bulunur. `status`, token saklanırken `pending`, kullanılabilir olduğunda `active` ve iptal edildikten sonra `disabled` olur. `created_at` ve `updated_at`, RFC 3339 zaman damgası dizeleridir.

### Secret oluşturma {#create-a-secret}

```bash
python3 -c 'import json, os; print(json.dumps({"name": "GitHub MCP token", "kind": "mcp_bearer", "server_url": "https://mcp.example.com/github", "token": os.environ["GITHUB_MCP_TOKEN"]}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

- `kind`, `mcp_bearer` olmalıdır.
- `server_url`, kullanıcı bilgisi, sorgu veya fragment içermeyen bir HTTPS adresi olmalıdır. Secret yalnızca bu URL ile birebir çalışır.
- `name` ve `token` zorunludur ve boş olamaz. `name` en fazla 128 bayt, `token` en fazla 16384 bayt ve `server_url` en fazla 2048 bayt olabilir.

Yanıt, token olmadan `201 Created` olarak döner. [MCP bağlantısını oluştururken](/api-reference/mcp-connections/#create-a-connection) `sec_` kimliğini `secret_id` olarak kullanın.

### Secret'ları listeleme {#list-secrets}

```bash
curl "https://api.sandbase.ai/v1/secrets?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`data`, `total`, `limit` ve `offset` ile offset sayfalama kullanılır. `limit` varsayılan olarak 20'dir ve en fazla 200 olabilir; eksik, geçersiz veya pozitif olmayan değerler için 20 kullanılır. `offset` varsayılan olarak 0'dır; geçersiz veya pozitif olmayan değerler için 0 kullanılır. `offset + data.length >= total` olana kadar döndürülen `limit` kadar ilerleyin. Devre dışı Secret'lar listede kalır.

### Secret alma {#get-a-secret}

```bash
curl https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

### Secret'ı yenileme {#rotate-a-secret}

`SECRET_ROW_VERSION` değerini, Secret alma isteğinden gelen en güncel `row_version` olarak ayarlayın.

```bash
python3 -c 'import json, os; print(json.dumps({"token": os.environ["GITHUB_MCP_TOKEN"], "row_version": int(os.environ["SECRET_ROW_VERSION"])}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61/rotate \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token-rotate-1" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

Yenileme token'ı değiştirir; Secret ve `server_url` aynı kalır. `token` ve pozitif tam sayı bir `row_version` zorunludur, Secret `active` durumda olmalı ve `row_version` en güncel değerle eşleşmelidir. `201 Created` döndürür. Yeni Session'lar yeni token'ı kullanır; önceden başlamış Session'lar dondurdukları kimlik bilgisini kullanmaya devam eder.

### Secret'ı iptal etme {#revoke-a-secret}

```bash
curl -X DELETE https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-token-revoke"
```

`204 No Content` döndürür ve `status` değerini `disabled` yapar. Secret'ı kullanan bağlantılar yeni Session'lar için ve mevcut Session'lara gönderilen sonraki girdiler için çalışmayı durdurur. İptal geri alınamaz: yeni bir Secret oluşturun ve bağlantıyı değiştirin.

### Hatalar ve yeniden denemeler {#errors-and-retries}

Hatalar [Agents hata zarfını](/api-reference/errors#agents-platform-errors) kullanır. Geçersiz alanlar veya eksik yazma idempotency anahtarı `400 invalid_request` döndürür; bilinmeyen veya erişilemeyen bir Secret `404 not_found` döndürür. Eski bir `row_version`, uyumsuz bir yaşam döngüsü durumu veya bir oluşturma anahtarının farklı girdiyle yeniden kullanılması `409 conflict` döndürür. Yeniden denemeden önce Secret'ı tekrar okuyun ve her yeni yazma işlemi için yeni bir anahtar kullanın.

## Güvenlik {#security}

- Secret'ları tarayıcı kodundan değil, her zaman güvenilir bir backend'den oluşturun ve yenileyin.
- Token'ları betiklere yapıştırmak yerine, yukarıdaki `$GITHUB_MCP_TOKEN` örneğinde olduğu gibi kendi gizli bilgi deponuzdan veya ortamdan okuyun.
- Token'ları talimatların, Session girdisinin, metadata'nın ve Skill paketlerinin dışında tutun.
- Bir Secret'ın token'ı sızmış olabilirse onu hemen iptal edin, ardından yenisini oluşturup bağlantıyı değiştirin.

## Sonraki adımlar {#next-steps}

- [Skills ve MCP araçları](/agents/mcp-tools)
- [MCP Connections API](/api-reference/mcp-connections/)
