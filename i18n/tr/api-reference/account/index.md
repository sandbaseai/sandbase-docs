---
i18nSource: 3b9b3fc27f878cd5
title: Account API
description: Bir API anahtarıyla ilişkili kuruluş bakiyesini ve yakın tarihli yürütme geçmişini inceleyin.
---

# Account API {#account-api}

Hesap uç noktaları salt okunurdur ve Bearer API anahtarından çözümlenen kuruluş üzerinde çalışır.

| İşlem | Uç nokta |
|---|---|
| [Bakiyeyi getir](./balance) | `GET /v1/account/balance` |
| [Yürütme geçmişini listele](./history) | `GET /v1/account/history` |

Bakiye ve maliyet değerleri kesin ondalık metinlerdir. Bunları ikili kayan nokta aritmetiğiyle dönüştürmek yerine
ondalık değerler olarak saklayın.

Yürütme geçmişi, yakın tarihli operasyonel inceleme içindir. Uzun vadeli finansal mutabakat için faturalandırma
kayıtlarını veya dışa aktarımları kullanın.

Geçmiş filtrelemesi ham UTC zaman damgalarını kullanır. `request_id` olmadan, isteğe bağlı `timezone` uyumluluk parametresi bir IANA saat dilimi adı olarak doğrulanır ancak yanıttaki zaman damgalarını dönüştürmez; tam `request_id` modu bu parametreyi diğer filtrelerle birlikte yok sayar. Bilinmeyen `type` değerleri herhangi bir yürütme türü filtresi uygulamaz; etkili bir filtre için `multimodal`, `llm` veya `api` kullanın. Desteklenmeyen `range` değerleri `7d` değerine geri döner.

Geçmiş girdileri saklanan istek parametrelerini ve model çıktısını içerebilir. API anahtarına erişimi buna göre kısıtlayın
ve geçmiş yanıtlarını hassas veriler açısından incelemeden günlüklere veya destek taleplerine kopyalamayın.
