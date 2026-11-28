---
i18nSource: 3ccdc1071b9be798
title: Models API
description: SandBase model meta verilerini, fiyatlandırmasını, destek durumunu ve yeteneklerini keşfedin.
---

# Models API {#models-api}

Bir çıkarım uç noktası seçmeden önce modelleri keşfetmek için Models API'yi kullanın. Listeleme işlemi OpenAI uyumludur ve kısa kimlik kayıtları döndürür. SandBase yetenek, şema ve fiyatlandırma meta verileri için tek bir modeli alın.

| İşlem | Uç nokta | Belgeler |
|---|---|---|
| Modelleri listeleme | `GET /v1/models` | [Modelleri Listeleme](./list) |
| Tek bir modeli alma | `GET /v1/models/{id_or_name}` | [Model Alma](./get) |
| Bir API yeteneğini yol üzerinden çağırma | `GET/POST /v1/api/{vendor}/{upstream_path}` | [API Passthrough](./api-passthrough) |
| Bir model veya API yeteneğini çalıştırma | `POST /v1/run` | [Yetenek Çalıştırma](./run) |
| Asenkron bir sonucu alma | `GET /v1/run/{id}` | [Run Sonucunu Alma](./run-get) |
| Asenkron bir geri çağrı alma | `POST /v1/run` üzerinde `webhook_url` | [Webhook geri çağrıları](./run#webhook-callbacks) |
| Desteklenen modellere göz atma | — | [Models kataloğu](https://www.sandbase.ai/models) |

Bir modeli çalıştırmak için [Models kataloğundan](https://www.sandbase.ai/models) referans sayfasını açın; her sayfa kesin tanımlayıcıyı, istek alanlarını ve fiyatlandırmayı gösterir. Bu sayfa keşfi, birleşik yetenek çalıştırıcısını, API passthrough'u, asset'leri ve görev maliyeti sorgulamayı belgeler.

`GET /v1/models`, `q`, `vendor`, `type` ve `order` parametrelerini destekler; sayfalanmaz. `type` atlanırsa varsayılan `llm` olur; açıkça boş bırakılan `type=` ise tüm herkese açık model türlerini listeler. `vendor` filtresi tam eşleşmelidir ve büyük/küçük harfe duyarlıdır; `q` büyük/küçük harfe duyarsız bir alt dize aramasıdır. Her liste öğesi `id`, `object`, `created` ve `owned_by` içerir; burada `id`, isteklerde kullanılan mantıksal model adıdır.

Model adları `/` içerebilir. Ayrıntı uç noktasını çağırırken bu eğik çizgileri yol ayırıcısı olarak gönderin, örneğin `/v1/models/openai/gpt-5.6-luna`; sunucu rotası kalan yolu tek bir mantıksal tanımlayıcı olarak işler. Eski bir kılavuzdan tanımlayıcı kopyalamak yerine güncel kimliği `GET /v1/models` ile bulun.

Bir çıkarım API'sinden gelen asenkron `202` yanıtı için döndürülen opak kimlikle `GET /v1/run/{id}` uç noktasını yoklayın. Kimlik önekini tahmin etmeyin veya uyumluluk başlıklarından farklı bir yoklama yolu oluşturmayın.
