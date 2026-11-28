---
i18nSource: 8c960d117a998817
title: Görüntü ve video modelleri
description: Görüntüleri ve videoları eşzamansız olarak üretmek için SandBase'in ortak Run API'sini kullanın.
---

# Görüntü ve video modelleri {#image-and-video-models}

Görüntü ve video modelleri, SandBase'in ortak eşzamansız Run API'sini kullanır. `POST /v1/run` ile bir görev
gönderin, ardından run son duruma ulaşana kadar `GET /v1/run/{id}` adresini
yoklayın.

## Görev gönderme {#submit-a-task}

[Görüntü ve video modelleri](https://www.sandbase.ai/models/image-video) sayfasındaki tam model kimliğini kullanın. Diğer
istek alanları modele özgüdür; zorunlu girdiler ve sınırlar için modelin API
referansını açın.

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<model-id>",
    "prompt": "A cinematic product shot at sunrise."
  }'
```

Yanıt opak bir `id` ve `pending` veya `running` gibi bir
`status` içerir.

## Sonucu yoklama {#poll-for-the-result}

```bash
curl https://api.sandbase.ai/v1/run/<run-id> \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`status` değeri `completed`, `failed` veya `timeout` olana kadar yoklamaya devam edin. Tamamlanan
run'lar, görüntü veya video URL'si gibi yeteneğe özgü çıktılar içerir. Run kimliğini
saklayın ve run yanıtını yetkili durum kaynağı olarak kabul edin.

## Webhook geri çağırmaları {#webhook-callbacks}

Desteklenen eşzamansız görevler, gönderim isteğinde `webhook_url` de ayarlayabilir.
Geri çağırma, yoklamanın yerini almayan bir teslimat ipucudur; `GET /v1/run/{id}`
kullanmaya devam edin ve yinelenen veya gecikmeli geri çağırmaları güvenli şekilde işleyin. Ortak
geri çağırma sözleşmesi için [Bir yeteneği çalıştırma](/api-reference/models/run#webhook-callbacks) sayfasına bakın.

## API yetenekleri URL'den türetilen bir yol kullanır {#api-capabilities-use-a-url-derived-path}

Ortak Run API, model üretimi içindir. [API kataloğundaki](https://www.sandbase.ai/apis)
API yetenekleri farklı, URL'den türetilen bir rota kullanır:
`GET` veya `POST /v1/api/{vendor}/{upstream_path}`.
Sağlayıcı önekli yetenek adı Models API'den veya API kataloğundan gelir; bu nedenle
POST gövdesinde `model` alanı atlanabilir:

```bash
curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

Bu rota API yetenekleri içindir; görüntü veya video modellerini çağırırken `/v1/run`
yerine kullanılmaz. Seçilen API yeteneği eşzamansızsa,
döndürülen run kimliğini `GET /v1/run/{id}` ile yoklayın.

## Sonraki adımlar {#next-steps}

- [Görüntü ve video modelleri](https://www.sandbase.ai/models/image-video)
- [Bir yeteneği çalıştırma](/api-reference/models/run)
- [Run sonucunu alma](/api-reference/models/run-get)
- [API Passthrough](/api-reference/models/api-passthrough)
