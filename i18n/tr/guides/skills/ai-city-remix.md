---
i18nSource: ff1347dede49419a
agentDoc: ai-city-remix-agent-en
title: AI City Remix'e katılın
description: AI City Remix kredilerini alın, bir şehir ve Skill seçin, yerel agent'ınızla bir video oluşturun ve incelemeye yükleyin.
---

# AI City Remix'e katılın {#enter-ai-city-remix}

Etkinlik sayfasında bir Skill ve şehir seçin, ardından talimatların tamamını yerel agent'ınıza verin. Oluşturma tamamlandıktan sonra agent videoyu, kapağı ve katılım bilgilerini yükler ve incelemeye gönderir.


## Ön koşullar {#prerequisites}

- Bir SandBase hesabı.
- Komut çalıştırma ve dosya erişimi olan bir yerel agent.
- Video, kapak ve proje dosyaları için bir çalışma klasörü.

İlk yerel kurulumunuz için [Bir Skill'i yerel olarak kullanma](/guides/skills/local-use) kılavuzunu izleyin.

## 1. Etkinliği açın ve kredileri alın {#_1-open-the-event-and-claim-credits}

1. [AI City Remix](https://www.sandbase.ai/lab/event/aicityremix?lang=en) sayfasını açın ve güncel [etkinlik kurallarını](https://www.sandbase.ai/lab/event/aicityremix?tab=rules&lang=en) okuyun.
2. “Claim $5 free & create” düğmesine tıklayın ve istendiğinde giriş yapın.
3. Sistem etkinlik kredilerini alır ve bunları otomatik olarak kullanmaya çalışır. Bakiyeyi ve kullanım durumunu kontrol edin; yeniden deneme gerekiyorsa kullanma işlemini kullanın.
4. Kredileri aldıktan sonra oluşturma penceresini açmak için “Create now” düğmesine tıklayın.

Kredi alma tarihleri, kullanılabilirlik ve uygunluk etkinlik sayfasında gösterilir. Model çağrıları gerçek kullanıma göre kredi harcar; bunları [Billing](https://www.sandbase.ai/console/billing) sayfasında inceleyin.

## 2. Bir model API anahtarı yapılandırın {#_2-configure-a-model-api-key}

Hesabınızda kullanılabilir bir API anahtarı yoksa akış bir “Create an API key” penceresi gösterir.

1. Gösterilen harcama sınırını ve son kullanma tarihini inceleyin, ardından “Create API key” düğmesine tıklayın.
2. “Create with this key” düğmesine tıklayın. Yeni anahtar, agent'a verilen talimatların tamamına dahil edilir.
3. Talimatların tamamını güvendiğiniz bir agent'a gönderin ve özel bir çalışma alanında saklayın.

Mevcut bir anahtar için `SANDBASE_API_KEY` değerini yerel agent'ınızın güvenli ayarları veya yürütme ortamı üzerinden yapılandırın. Anahtarları [API Keys](https://www.sandbase.ai/console/keys) sayfasında yönetin.

## 3. Bir Skill ve brif seçin {#_3-choose-a-skill-and-brief}

Pencere, seçili bir resmi Skill, şehir, hikâye ve yaratıcı yönle açılır.

- Özeti ve ayrıntıları okumak ve bir görsel yaklaşım seçmek için “Official Skill” bölümünü genişletin.
- Bir şehir aramak veya haritada bir konum seçmek için “Creative brief” bölümünü genişletin.
- Önerileri karıştırın veya hikâyeyi ve yaratıcı yönü doğrudan düzenleyin.
- Harita konumunu, desteklenen dili ve çıktı stilini onaylayın.

Tarih, kişiler ve olaylar için doğrulanabilir kaynaklar kullanın. Dil ve süre desteği için seçilen Skill'in ayrıntılarını kontrol edin.

## 4. Talimatları kopyalayın ve oluşturun {#_4-copy-the-instructions-and-create}

1. Prompt alanında “Copy all” düğmesine tıklayın.
2. Proje klasörünü yerel agent'ınızda açın, bir görev başlatın ve talimatların tamamını yapıştırın.
3. Talimatları gönderin, istenen girdileri sağlayın, bağımlılıkları yapılandırın ve oluşturmaya başlayın.

Talimatlar seçilen Skill'i, yaratıcı brifi, katılım metadata biçimini ve yükleme yetkisini içerir. Agent'ın işi oluşturup gönderebilmesi için devredilen talimatların tamamını koruyun.

“Preparing”, yükleme erişiminin hazırlandığı anlamına gelir. Yeniden hazırlamak için “Retry”, eksik ayrıntıları doldurmak için “Complete brief” düğmesini kullanın.

## 5. Oluşturma ilerlemesini takip edin {#_5-follow-creation-progress}

Oluşturma, Skill'e, modellere ve video uzunluğuna bağlı olarak onlarca dakikadan birkaç saate kadar sürebilir ve model kredisi harcar. Agent'ı çalışır durumda ve bilgisayarı uyanık tutun.

Aynı göreve bütçe ve ilerleme talimatları ekleyin:

```text
My model-call budget is [AMOUNT] USD. Ask before exceeding it.
Report the current step, saved files, and next step, then continue creation.
```

Güncel etkinlik kurallarının gerektirdiği şekilde MiniMax M3.1 Flash'ı SandBase üzerinden kullanın. Süre, çözünürlük, altyazı ve dosya boyutları için etkinlik ve yükleme sayfasındaki gereksinimlere uyun.

## 6. Gönderin ve inceleme durumunu kontrol edin {#_6-submit-and-check-review-status}

Agent, talimatların tamamını izleyerek resmi yükleme istemcisini kullanır, videoyu, kapağı ve metadata'yı yükler ve incelemeye gönderir.

İlerlemeyi kontrol etmek için [My entries](https://www.sandbase.ai/lab/event/aicityremix/mine?lang=en) sayfasını açın:

| Durum | Sonraki adım |
|---|---|
| Draft | Filmi tamamlayın, dosyaları yükleyin ve incelemeye gönderin. |
| Pending review | İnceleme durumunu takip edin. |
| Approved | Herkese açık katılım sayfasını açın ve paylaşın. |
| Changes requested | İnceleme notuna göre düzeltin ve yeniden gönderin. |

Mevcut bir film için etkinlik sayfasında “Upload existing video” seçeneğini seçin, ayrıntıları doldurun, videoyu ve kapağı yükleyin ve incelemeye gönderin.

## 7. Yüklemeye devam edin {#_7-resume-an-upload}

Yetkinin süresi dolarsa veya bir yükleme kesintiye uğrarsa orijinal dosyalarla devam edin:

1. Videoyu, kapağı, `entry.json` dosyasını ve çalışma klasörünü saklayın.
2. My entries içinde aynı taslağı bulun ve “Resume upload” düğmesine tıklayın.
3. Yeni devam talimatlarını orijinal agent görevine kopyalayın.
4. Agent'tan mevcut dosyaları yükleyip göndermesini isteyin, ardından My entries içinde durumu kontrol edin.

## 8. Katılımınızı paylaşın {#_8-share-your-entry}

Onaylanmış bir katılım sayfasında, önceden doldurulmuş bir gönderi düzenleyicisi açmak için “Share on X” düğmesine tıklayın. Düzenleyici katılım bağlantısını, `#AICityRemix`, `@SandbaseAI` ve resmi etkinlik gönderisini içerir.

Video gönderisi yayımlamak için önce “Download video” düğmesine tıklayın, dosyayı X düzenleyicisine ekleyin, metni gözden geçirin ve yayımlayın.

## İlgili dokümantasyon {#related-documentation}

- [Bir Skill'i yerel olarak kullanma](/guides/skills/local-use)
- [Agent'ınızı bağlayın](/setup/)
- [API anahtarlarını yapılandırma](/getting-started/api-keys)
