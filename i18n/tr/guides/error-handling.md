---
i18nSource: f63049c1cf01130e
title: Hatalar ve yeniden denemeler
description: SandBase API hatalarını sınıflandırın, yeniden denemenin ne zaman güvenli olduğuna karar verin ve gizli bilgileri açığa çıkarmadan yararlı tanılama bilgilerini koruyun.
---

# Hatalar ve yeniden denemeler {#errors-and-retries}

Hataları HTTP durumuna, uç nokta ailesine ve işlem semantiğine göre ele alın. SandBase birkaç uyumlu protokol sunar;
bu nedenle her uç noktanın paylaştığı tek bir hata JSON yapısı yoktur.

## Uç noktanın hata yapısını okuyun {#read-the-endpoint-s-error-shape}

- OpenAI uyumlu işlemler normalde mesaj ve tür içeren bir `error` nesnesi döndürür.
- Anthropic Messages, Anthropic uyumlu hata zarfları döndürür.
- Temel platform işlemleri düz bir `{ "error": "..." }` gövdesi veya belgelenmiş, kaynağa özgü bir hata döndürebilir.
- Google ve sağlayıcıya özgü işlemler, belgelendiği yerlerde uyumlu protokol yapılarını korur.

Yanıtın HTTP durumunu ve belgelenmiş gövdesini kullanın. Seçilen uç nokta garanti etmedikçe `code`, `param` veya
`request_id` gibi isteğe bağlı alanların bulunmasını şart koşmayın. Örnekler için [API hata referansına](/api-reference/errors),
işleme özgü yanıtlar için [OpenAPI belirtimine](/openapi.yaml) bakın.

## Duruma göre ne yapacağınıza karar verin {#decide-what-to-do-by-status}

| Durum | Tipik neden | Önerilen eylem |
|---|---|---|
| `400` / `422` | Geçersiz gövde, parametre veya desteklenmeyen model yeteneği | Yeniden denemeden önce isteği düzeltin. |
| `401` | Eksik, geçersiz, süresi dolmuş veya iptal edilmiş kimlik bilgisi | Kimlik bilgisini değiştirin. |
| `402` | Faturalandırma durumu isteğe izin vermiyor | Hesap bakiyesi veya harcama denetimi sorununu çözün. |
| `403` | Kimlik bilgisi kapsamı veya kaynak erişimi yetersiz | Yetkili bir anahtar veya kaynak kullanın. |
| `404` | Model, görev veya platform kaynağı bulunamadı | Tanımlayıcıyı ve kuruluşu doğrulayın. |
| `409` | Kaynak durumu veya eşzamanlı işlem çakışması | Güncel durumu okuyun, ardından yeniden denemeye karar verin. |
| `429` | SandBase veya bir üst akış sağlayıcısı isteği sınırladı | Varsa `Retry-After` değerine uyun; yoksa jitter ile geri çekilin. |
| `500` / `502` / `503` / `504` | Dahili, üst akış veya geçici kullanılabilirlik hatası | Yalnızca işlemi tekrarlamak güvenliyse yeniden deneyin. |

Bu tablo bir işleme kılavuzudur; her uç noktanın her durumu döndüreceğine dair bir taahhüt değildir.

## Sınırlı bir yeniden deneme politikası kullanın {#use-a-bounded-retry-policy}

Tekrarlanması güvenli bir istek için jitter ile üstel geri çekilme kullanın, gecikmeye üst sınır koyun ve toplam istek bütçesi uygulayın.
Dış uygulama katmanı zaten yeniden deniyorsa SDK yeniden denemelerini devre dışı bırakın veya bütçeyi belirlerken her iki katmanı da hesaba katın.

```python
import os
import random
import time

from openai import APIStatusError, OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def chat_with_backoff(messages, attempts=4):
    for attempt in range(attempts):
        try:
            return client.chat.completions.create(
                model="deepseek/deepseek-v4-flash",
                messages=messages,
            )
        except APIStatusError as error:
            retryable = error.status_code in {429, 500, 502, 503, 504}
            if not retryable or attempt == attempts - 1:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

Bir yanıt `Retry-After` içerdiğinde yedek gecikmeyi kullanmak yerine bu değeri ayrıştırıp ona uyun. Politikayı
yapılandırılabilir tutun; doğru deneme sayısı ve son tarih, çağıranın gecikme ve maliyet bütçesine bağlıdır.

## Yinelenen yan etkilere karşı koruma sağlayın {#protect-against-duplicate-side-effects}

Bir çıkarım isteğini tekrarlamak yeni bir üretim oluşturur ve ek maliyete yol açabilir. Bu yalnızca uygulama
herhangi bir geçerli yanıta ihtiyaç duyuyorsa ve yeniden üretimi tolere edebiliyorsa kabul edilebilir.

İş oluşturan, güncelleyen, silen, yayımlayan, zamanlayan veya çağıran işlemlerde daha temkinli olun:

- uç nokta sağlıyorsa belgelenmiş idempotency desteğini kullanın;
- aksi halde belirsiz bir isteği tekrarlamadan önce güncel durumu okuyun;
- bir araç çağrısını yalnızca çevresindeki model akışı koptu diye asla yeniden oynatmayın;
- yeniden denemeleri mutabakat etmeniz gerektiğinde kendi sisteminizde bir istemci işlem kimliği tutun.

## Zaman aşımlarını ve akışları ayrı ele alın {#handle-timeouts-and-streams-separately}

Zaman aşımı, sunucunun isteği işlemeyi bıraktığını kanıtlamaz. Eşzamansız veya durum değiştiren bir işlemi yeniden
denemeden önce, mümkünse belgelenmiş kaynağını veya görev durumunu sorgulayın.

Akışlı yanıtlarda akış başlamadan önceki bir HTTP hatasını kısmi çıktıdan sonraki bir bağlantı kopmasından ayırın.
Yalnızca normal protokol sonlandırma sinyali akışın eksiksiz olduğunu kanıtlar. Bkz. [Akışlı yanıtlar](/guides/streaming).

## Yararlı ve güvenli tanılama bilgilerini günlüğe kaydedin {#log-useful-safe-diagnostics}

Şunları kaydedin:

- uç nokta ve model tanımlayıcısı;
- HTTP durumu ve varsa uyumlu hata türü;
- döndürüldüyse sağlayıcı veya istek tanımlayıcısı;
- deneme sayısı, geçen süre ve herhangi bir yanıt baytının gelip gelmediği.

API anahtarlarını, kimlik bilgisi değerlerini, hassas istemlerin tamamını veya maskelenmemiş sağlayıcı yanıtlarını günlüğe kaydetmeyin. Kullanıcılara kısa ve
uygulanabilir bir mesaj gösterirken operatörler için temizlenmiş tanılama bilgilerini saklayın.

## İlgili rehberler {#related-guidance}

- [API hata referansı](/api-reference/errors)
- [Hız sınırları](/guides/rate-limiting)
- [Akışlı yanıtlar](/guides/streaming)
- [Kimlik doğrulama](/api-reference/authentication)
