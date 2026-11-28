---
i18nSource: 4191d2eb16a594f5
title: Sandbox Genel Bakışı ve Yetenekleri
description: E2B SDK veya SandBase Console ile sandbox'lar oluşturun, durumu, günlükleri ve metrikleri inceleyin ve ayrı, deneysel Playground'ı keşfedin.
---

# Sandbox genel bakışı ve yetenekleri {#sandbox-overview-and-capabilities}

Sandbox; komut çalıştırmak, kod yürütmek ve dosya okuyup yazmak için yalıtılmış ortamlar sağlar. Kalıcılığı doğrulamak için bir örneği duraklatın, ona yeniden bağlanın ve bir dosyayı geri okuyun.

[Hızlı başlangıç / E2B SDK](./quickstart) · [Playground'ı açın (Deneysel)](./playground)

Sandbox'ı uygulamanıza entegre etmek için [resmi E2B SDK'sını](./quickstart) kullanın. Sandbox oluşturmak ve örnek durumunu, günlükleri ve metrikleri görüntülemek için [Sandbox Console](https://www.sandbase.ai/console/sandboxes) üzerinde oturum açın. Tanıtım için [Sandbox ürün genel bakışına](https://www.sandbase.ai/sandbox) bakın. Aşağıdaki adım adım anlatım ve destek tablosu ayrı, deneysel Playground'ı açıklar.

## Beş dakikalık Playground turu {#a-five-minute-playground-walkthrough}

1. Sandbox izinlerine sahip bir [API anahtarı](/getting-started/api-keys) girin. Bağlanmak yalnızca şablonları ve örnekleri okur.
2. Mevcut bir şablon seçin, kaynak bildirimini onaylayın ve kısa ömürlü bir örnek oluşturun.
3. Sistem bilgisi veya Python örneğini çalıştırın. Çıktıyı ve süreç olaylarını komut panelinin yanında izleyin.
4. Bir metin dosyası yazıp doğrulayın, örneği duraklatın, devam ettirin ve aynı dosyayı yeniden okuyun.
5. Yaşam döngüsü olaylarını, metrikleri, günlükleri ve makine süresi kanıtlarını inceleyin. İşiniz bittiğinde örneğinizi silin.

Sayfayı yenilemek sayfadaki kimlik bilgilerini ve yerel işlem geçmişini temizler; sandbox'ları silmez. Çalışan örnekler sunucu zaman aşımını izler. Duraklatılmış örnekler kaynakları tutmaya devam edebilir. Örnek kimliklerini kaydedin ve sayfadan ayrıldıktan sonra kaynakları uzlaştırmak ve temizlemek için organizasyonunuzun araçlarını kullanın.

## Yetenekler ve sınırlar {#capabilities-and-boundaries}

| Yetenek | Playground desteği |
| --- | --- |
| Oluşturma, listeleme, duraklatma, devam ettirme, zaman aşımını uzatma, silme | Kullanılabilir; değiştirme denetimleri yalnızca bu sayfa oturumunda oluşturulan örneklere uygulanır |
| Komutlar ve metin dosyaları | Kullanılabilir; komutlar en fazla 25 saniye çalışır, dosya düzenleme `/tmp/` ve 32 KiB ile sınırlıdır |
| Yaşam döngüsü olayları, günlükler, metrikler, makine süresi | Kullanılabilirlik ortama göre değişir; dönen sonuçları inceleyin |
| Yapay zekâ sohbeti ve konuşma bağlamı | Entegre değil; model yapılandırması ve bir Agent iş yükü gerektirir |
| PTY, uygulama portları, webhook'lar, şablon derlemeleri | Bu arayüzde kullanılamaz |
| Anlık görüntüler ve fork | Bu Playground'da kullanılamaz |

Kabuk etkileşimi yapay zekâ sohbeti değildir. Örnek kurtarma, dosya kalıcılığı, süreçlerin hayatta kalması ve konuşma sürekliliği ayrı ayrı doğrulanması gereken şeylerdir.

## Olayları anlama {#understanding-events}

**Sandbox lifecycle** girdileri, yenileme sırasında alınan yerel sunucu olaylarıdır ve gecikmeli gelebilir. **Sandbox process** girdileri süreç başlangıçlarını ve akış olarak gelen çıktıyı açıklar. **Playground** girdileri yerel isteğin tamamlanmasını veya başarısız olmasını kaydeder; bunlar servis yaşam döngüsü olayları değildir.

Boş bir liste kullanımın sıfır olduğunu kanıtlamaz, eksik olaylar da bir işlemin başarısız olduğunu kanıtlamaz. Makine süresi kanıtı nihai fatura değildir. Bir zaman aşımından veya kesilen bir bağlantıdan sonra yeni bir oluşturma isteği denemeden önce örnekleri uzlaştırın.

## Şablon görünürlüğü {#template-visibility}

Şablonlar herkese açık veya organizasyonunuza özel olabilir. Sayılar sabit değildir. Adı olmayan girdiler görünür kalır; yedek etiket olarak takma adlar veya kimlikler kullanılır. Hangi şablonları görebileceğinizi ve kullanabileceğinizi organizasyonunuzun erişimi ve şablon kullanılabilirliği belirler.

## Sandbox'lar ve Agent Sessions {#sandboxes-and-agent-sessions}

Agents Sessions, SandBase'in barındırılan bulutunda çalışır. E2B SDK ile oluşturduğunuz Sandbox örneklerinden ayrıdır ve Agents API Sandbox örneklerini sunmaz. [Sessions](/agents/sessions) sayfasına bakın.
