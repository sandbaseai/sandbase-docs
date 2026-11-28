---
i18nSource: adfacb669489863e
title: Hesap ve faturalandırma
description: SandBase kuruluşunuzu, API anahtarlarınızı, faturalandırmayı, kullanımı ve sınırları yönetin.
---

# Hesap ve faturalandırma {#account-and-billing}

Kuruluş ayarlarınız, kullanımın kime ait olduğunu, uygulamaların nasıl kimlik doğruladığını ve harcamaların nasıl izlendiğini belirler.

## Neleri yönetirsiniz {#what-you-manage}

| Alan | Kullanım amacı |
|---|---|
| [Kuruluşlar](/admin/organizations) | Çalışma alanı sınırını, üyeleri ve sahipliği yönetin |
| [API anahtarları](/getting-started/api-keys) | Uygulama kimlik bilgilerini oluşturun, yenileyin ve iptal edin |
| [Faturalandırma ve krediler](/admin/billing) | Bakiyeyi inceleyin, kredi satın alın, otomatik yüklemeyi ayarlayın ve Activities ile Analysis bölümlerinde kullanımı inceleyin |
| [Fiyatlandırma ve kullanım](/guides/billing) | Model fiyatlarını, günlük ücretsiz API çağrılarını ve tek bir görevin maliyetini öğrenin |
| [Hız sınırları](/guides/rate-limiting) | İstek sınırlarını ve güvenli yeniden deneme davranışını anlayın |

## Önerilen kurulum {#recommended-setup}

1. Doğru kuruluşta çalıştığınızı doğrulayın.
2. Geliştirme, staging ve production için ayrı API anahtarları oluşturun.
3. Anahtarları ait oldukları uygulama ve ortama göre adlandırın.
4. İlk production isteklerinden sonra Activities ve faturalandırmayı inceleyin.
5. Kullanılmayan anahtarları iptal edin ve beklenmedik kullanımı hemen araştırın.

## Sahiplik ve erişim {#ownership-and-access}

API anahtarları ve kullanım bir kuruluşa aittir. Kuruluş değiştirdiğinizde Console'da görünen kaynaklar, anahtarlar ve faturalandırma bağlamı da değişir. Production yapılandırmasını değiştirmeden önce seçili kuruluşu doğrulayın ve anahtar yenilemeyi o anahtarı kullanan uygulamalarla koordine edin.

## Temel güvenlik {#security-basics}

- anahtarları ortam değişkenlerinde veya bir gizli bilgi yöneticisinde saklayın
- anahtarları asla Agent talimatlarına, kaynak koda, ekran görüntülerine veya destek mesajlarına yapıştırmayın
- her uygulama ve ortam için ayrı bir anahtar kullanın
- açığa çıkmış olabilecek bir anahtarı hemen iptal edin
- beklenmedik hacim, model veya endpoint'ler için Activities'i izleyin
