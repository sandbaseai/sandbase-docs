---
i18nSource: b95a8cd6f82c3a9a
title: Yapay zekâ tarafından okunabilir modeller ve fiyatlandırma
description: Güncel SandBase modellerini, yeteneklerini, şemalarını ve fiyatlandırmasını Models API üzerinden keşfedin.
---

# Modeller ve fiyatlandırma {#models-pricing}

Tüm modellere tek bir SandBase API anahtarıyla erişilebilir. Model kullanılabilirliği, şemalar, yetenekler, bağlam sınırları
ve fiyatlandırma birbirinden bağımsız olarak değişebilir.

::: info Canlı model meta verilerini kullanın
Güncel ve yetkili veriler için her zaman `GET /v1/models` ve `GET /v1/models/{id_or_name}` kullanın. Her
LLM'in akışı, görüntü işlemeyi, araçları, yapılandırılmış çıktıyı veya önbelleğe almayı desteklediği sonucunu çıkarmayın ve bir modelin girdi alanlarını veya
fiyatlandırmasını başka bir modele kopyalamayın.
:::

## Katalog ve ayrıntı yanıtları {#catalog-and-detail-responses}

`GET /v1/models`, `id`, `object`, `created` ve `owned_by` içeren OpenAI uyumlu kimlik kayıtları döndürür.
SandBase yetenek, şema ve fiyatlandırma meta verilerini bilerek içermez.

`GET /v1/models/{id_or_name}`; `unified_schema`, `supported_modes` ve `model_card` ekler. Ayrıntılı fiyatlandırmayı
`model_card` alanından okuyun; üst düzeyde bir `pricing` nesnesi yoktur. `capability_tags`, `supported_modes` ve
`unified_schema` alanlarını modele özgü olarak ele alın.

## Modelleri keşfetme {#discover-models}

```bash
curl 'https://api.sandbase.ai/v1/models?type=llm' \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Liste uç noktası `q`, `vendor`, `type` ve `order` parametrelerini destekler; sayfalanmaz ve varsayılan olarak `type=llm` kullanır.
`id`, `object`, `created` ve `owned_by` içeren OpenAI uyumlu öğeler döndürür. Ayrıntıları isterken veya modeli çağırırken
döndürülen `id` değerini model adı olarak kullanın.

Herhangi bir eşzamansız `202` yanıtında, döndürülen kimlikle `GET /v1/run/{id}` adresini yoklayın. Kimliği opak olarak ele alın;
biçimini tahmin etmeyin veya kimlik önekinden ya da uyumluluk başlığından farklı bir yoklama yolu oluşturmayın.

## Tek bir modeli inceleme {#inspect-one-model}

Model adları sağlayıcı öneklidir ve `/` içerebilir:

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Çalıştırmadan önce şunları inceleyin:

- `enabled` ve `execution_mode`
- `capability_tags` ve `supported_modes`
- Kabul edilen istek alanları için `unified_schema`
- Güncel fiyatlandırma formülü ve token veya önbellek çarpanları için `model_card`

## Gerçek görev maliyetini kontrol etme {#check-actual-task-cost}

Tamamlanmış veya devam eden bir görev için maliyeti eski bir tablodan yeniden hesaplamak yerine kaydedilen maliyeti sorgulayın:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Yanıt sözleşmeleri için [Models API referansına](/api-reference/models/), yanıt yapısı ve yeniden deneme rehberliği için
[Hata kılavuzuna](/for-agents/errors) bakın.
