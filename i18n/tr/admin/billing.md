---
i18nSource: d560e2374d91a8d6
title: Faturalandırma ve krediler
description: SandBase organizasyon bakiyesini inceleyin, Stripe veya Airwallex ile kredi satın alın, otomatik yüklemeyi ayarlayın, kupon kullanın ve API anahtarı harcama kontrollerini öğrenin.
---

# Faturalandırma ve krediler {#billing-and-credits}

Bu sayfa, [SandBase Console](https://www.sandbase.ai/console) üzerindeki faturalandırma yönetimini anlatır. Ücretler ve maliyet optimizasyonu için [Fiyatlandırma](/guides/billing) sayfasına bakın.

SandBase, desteklenen iş yüklerini organizasyon bakiyesinden faturalandırır. Güncel fiyatlar, kampanyalar, ödeme sağlayıcıları,
minimum yükleme tutarları ve bölgesel kullanılabilirlik Console'da gösterilir ve bu kılavuzdan bağımsız olarak
değişebilir.

## Bakiye {#balance}

[Developer → Billing](https://www.sandbase.ai/console/billing) sayfasını açın. **Credits** sayfası etkin organizasyonun şu bilgilerini gösterir:

| Öğe | Anlamı |
|------|---------------|
| **Available balance** | Models ve API'ler genelinde kullanıma hazır tutar |
| **Credit limit** | Çalışma alanının harcama limiti |
| **Current level** | Hesap seviyesi ve eşzamanlılık sınırı |

Aynı bakiye, oturum açtığınızda Console Dashboard'daki **Balance** kartında ve site başlığında da görünür.
Kampanyalar ve ödeme koşulları için Console'u esas kaynak olarak kabul edin; Console'un dahili ağ isteklerini
otomatikleştirmeyin.

## Kredi satın alma {#buy-credits}

1. [Billing](https://www.sandbase.ai/console/billing) sayfasını açın ve **Credits go to** alanında bakiye yüklemek istediğiniz çalışma alanının göründüğünü doğrulayın.
2. **Buy credits** altında hazır bir tutar seçin veya USD cinsinden bir **Custom amount** girin. Minimum yükleme tutarı sayfada gösterilir.
3. Birden fazla **Payment provider** sunuluyorsa **Stripe** (global kartlar ve cüzdanlar) veya **Airwallex** (kartlar ve yerel ödeme yöntemleri) seçin.
4. Önizlemedeki **Pay**, **Bonus** ve **Receive** değerlerini kontrol edin, ardından **Continue with Stripe** (veya seçtiğiniz sağlayıcı) seçeneğini seçip barındırılan ödeme sayfasındaki işlemi tamamlayın.
5. Maliyete duyarlı bir iş yükünü başlatmadan önce güncellenen bakiyeyi **Credit transactions** altında doğrulayın.

SandBase kart bilgilerini asla saklamaz; ödeme sayfası sağlayıcı tarafından barındırılır.

### İlk yükleme bonusu {#first-top-up-bonus}

Hesap ve çalışma alanı daha önce hiç bakiye yüklememişse **Current offers** bölümünde bir ilk yükleme bonusu gösterilir. Sayfada
bonus yüzdesi ve üst sınırı belirtilir. Her hesap ve her çalışma alanı için tek bir bonus geçerlidir; iadelerde bonus
orantılı olarak geri alınır. Bonus, **Credit transactions** içinde ayrı bir satır olarak görünür.

## Otomatik yükleme {#auto-top-up}

**Auto Top-up**, bakiye bir eşiğin altına düştüğünde kayıtlı bir kartla bakiyeyi yeniden doldurur. Şu anda yalnızca Stripe'ı
destekler ve yalnızca çalışma alanı sahipleri ile yöneticileri bunu yönetebilir.

1. **Payment cards** altında **Add Card** seçeneğini seçin ve Stripe'ta bir kart kaydedin.
2. **Turn on auto top-up** seçeneğini seçin, ardından **When balance goes below**, **Top-up amount**, isteğe bağlı **Monthly limit** ve kartı ayarlayın.
3. **I authorize these automatic charges** kutusunu işaretleyip onaylayın.

Aylık limite ulaşıldığında otomatik yükleme, takvim ayının (UTC) geri kalanında durur. Otomatik ödemeler
**Credit transactions** içinde `Auto top-up · Stripe` kanalıyla görünür.

## Kupon kullanma {#redeem-a-coupon}

**Redeem a coupon** altına **Coupon code** değerini girin, ardından **Redeem credit** seçeneğini seçin. Kupon yalnızca etkin
çalışma alanına uygulanır; bu nedenle önce seçili organizasyonu doğrulayın.

## Harcama kontrolleri {#spending-controls}

| Kontrol | Kapsam | Davranış |
|---------|-------|----------|
| Organizasyon finansman sınırı | Tüm organizasyon | Kullanılabilir bakiye ile yapılandırılmış kredi limitinin toplamı; karşılanamayan bir istek HTTP 402 döndürebilir |
| Anahtar harcama limiti | API anahtarı başına | Anahtar başına isteğe bağlı üst sınır; organizasyon bakiyesiyle sınırlıdır |
| Otomatik yükleme aylık limiti | Tüm organizasyon | Otomatik ödemeleri takvim ayı (UTC) başına sınırlar |

Anahtar başına harcama limiti ayarlamak için [API Anahtarları](/getting-started/api-keys) sayfasına bakın.

## Etkinlikler ve Analiz {#activities-and-analysis}

[Developer → Activities](https://www.sandbase.ai/console/activities) sayfasında iki sekme bulunur:

- **Request History**, tek tek istekleri API anahtarı, model, durum, gecikme ve maliyetle birlikte listeler.
- **Usage**, son 7 veya 30 günün istek ve maliyetlerini, **Model APIs by Archived Spend** ve **Billing Records** tablolarını gösterir. Her iki tabloda da **Export CSV** bulunur. Faturalandırma kayıtları dışa aktarımı, günlük ücretsiz kotayla karşılanan çağrıları işaretleyen bir **Free Quota** sütunu içerir.

[Developer → Analysis](https://www.sandbase.ai/console/analytics), son 7 veya 30 tam UTC günü için **Overview**, **Cost analysis** ve
**Health diagnostics** görünümlerini ekler.

Herkese açık fiyatlandırma ve görev maliyeti sözleşmeleri için [Fiyatlandırma ve Kullanım](/guides/billing) ve
[Görev Maliyetini Alma](/api-reference/tasks/cost) sayfalarına bakın.
