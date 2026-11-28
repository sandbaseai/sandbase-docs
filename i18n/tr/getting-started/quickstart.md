---
i18nSource: 8cb9626a2127cb8d
title: Hızlı başlangıç
description: "SandBase'i nasıl kullanacağınızı seçin: platformda, API üzerinden veya Agent'ınızla. Skills ve Tools bulun, adımları izleyin ve SDK veya CLI depolarından başlayın."
pageClass: quickstart-page
---

# Hızlı başlangıç {#quick-start}

## SandBase'i nasıl kullanmak istediğinizi seçin {#connect}

Bunlar tamamlamanız gereken üç adım değil, **başlamanın üç alternatif yoludur**. Hepsinde aynı SandBase hesabını ve çalışma alanını kullanın.

<QuickstartPaths />

Yalnızca hazır bir göreve mi ihtiyacınız var? [Tools'u keşfedin](#use-tools) veya [bir Skill seçin](#use-skills). Oturum açmadan önce herkese açık kataloglara ve belgelere göz atabilirsiniz.

### Açık kaynak depolardan başlayın {#start-from-the-open-source-repositories}

- **[SandBase — SDK'lar ve örnekler](https://github.com/sandbaseai/sandbase)**: Python, TypeScript ve Go istemcileri, API örnekleri ve barındırılan Agent iş akışları. Kendi uygulamanızı geliştirirken bunu kullanın.
- **[SandBase CLI ve MCP](https://github.com/sandbaseai/cli)**: yapay zekâ aracınızı kurup bağlayın veya yetenekleri terminalden keşfedip çalıştırın. Bunu mevcut Agent'ınızla kullanın.

## Başlamadan önce: oturum açın {#create-account}

Bir Playground kullanmadan, barındırılan bir Skill çalıştırmadan veya API anahtarı oluşturmadan önce oturum açın. Hesap gerektirmeden çalışan ücretsiz araçlar doğrudan kullanılabilir. **Zaten oturum açtınız mı? Bu adımı atlayın** ve hesap menüsünün kullanmak istediğiniz çalışma alanını gösterdiğini kontrol edin.

SandBase, GitHub veya Google kullanır. Ayrı bir e-posta ve parolayla kayıt yoktur.

1. [Hesap oluştur / Oturum aç](https://www.sandbase.ai/login){target="_blank"} sayfasını açın.
2. Güvenlik denetimini tamamlayın, ardından **Sign in with GitHub** veya **Sign in with Google** seçeneğini seçin.
3. Sağlayıcı penceresinde erişimi onaylayın.
4. Kullandığınız sayfaya dönün veya [Console](https://www.sandbase.ai/console){target="_blank"}'u açın.

İlk oturum açma, hesabınızı ve bir **kişisel çalışma alanı** oluşturur. SandBase'i denemeden önce bir kuruluş oluşturmanız gerekmez.

Bir hoş geldin kredisi görünürse ödeme yöntemi eklemeden başlayabilirsiniz. Console Dashboard'daki **Balance** kartı ve [Billing](https://www.sandbase.ai/console/billing){target="_blank"} güncel bakiyeyi gösterir.

## Platformda {#use-on-website}

Bir Model'i, API'yi veya Agent'ı önce tarayıcıda denemek istiyorsanız bunu seçin; istemci kurulumu ve kod gerekmez.

1. Oturum açın, ardından kataloğu açın:
   - [Dil modelleri](https://www.sandbase.ai/models){target="_blank"}
   - [Görüntü ve video modelleri](https://www.sandbase.ai/models/image-video){target="_blank"}
   - [API'ler](https://www.sandbase.ai/apis){target="_blank"}
   - [Agents](https://www.sandbase.ai/agents){target="_blank"}
2. Bir model veya API ayrıntı sayfasını açın ve varsa **Playground** seçeneğini seçin.
3. İstem, görüntü, arama sorgusu veya URL gibi gerekli girdileri girin. Çalıştırmadan önce gösterilen fiyatı kontrol edin.
4. İsteği çalıştırın ve döndürülen metni, veriyi, görüntüyü, videoyu veya görev durumunu görüntüleyin.

Web sitesindeki Playground için ayrı bir API anahtarı oluşturmanız gerekmez. Bir yetenek Playground sunmuyorsa **API** sekmesini kullanın ve aşağıdaki API yolunu izleyin.

## API üzerinden {#call-api}

Uygulamanıza tek bir yetenek ekliyorsanız bunu seçin.

1. Hedef çalışma alanınız için geçerli bir anahtarı yeniden kullanın veya [Developer → API Keys](https://www.sandbase.ai/console/keys){target="_blank"} sayfasında **New key** ile bir [API anahtarı](/getting-started/api-keys) oluşturun. Anahtarı hemen kopyalayın; yalnızca bir kez gösterilir.
2. Kataloğu filtreleyin ve bir ayrıntı sayfası açın:
   - [Dil modelleri](https://www.sandbase.ai/models){target="_blank"} — sağlayıcıya, yeteneklere, bağlama ve fiyata göre filtreleyin
   - [Görüntü ve video modelleri](https://www.sandbase.ai/models/image-video){target="_blank"} — metinden görüntüye, görüntüden görüntüye, metinden videoya ve görüntüden videoya gibi çok modlu modelleri filtreleyin
   - [API'ler](https://www.sandbase.ai/apis){target="_blank"} — API kaynaklarını platforma ve veri kaynağına göre filtreleyin
3. **API** sekmesini açın, örnek isteği kopyalayın ve o uç noktanın zorunlu alanlarını doldurun.
4. SandBase anahtarınızı bir sunucu ortam değişkeninde saklayın ve isteği çalıştırın. Anahtarı tarayıcı koduna veya herkese açık bir depoya koymayın.
5. Yanıtı kontrol edin. Eşzamansız bir görev için, görev tamamlanana kadar uç noktanın durum yoklama örneğini izleyin.

**Bash / zsh** (macOS, Linux veya WSL ile Windows) için örnek dil modeli çağrısı. Yer tutucu anahtarı yerel olarak değiştirin. Diğer ortamlar için aşağıdaki depodaki Python, TypeScript veya Go örneklerini kullanın; kabuk komutları PowerShell ile birbirinin yerine kullanılamaz.

```bash
export SANDBASE_API_KEY="sk-YOUR_KEY"

curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Reply with one sentence explaining what an API is."}]
  }'
```

Koddan başlayın: [GitHub'daki SandBase SDK'ları ve örnekleri](https://github.com/sandbaseai/sandbase).

Daha fazla bilgi: [İlk API çağrısı](/getting-started/first-call).

## Agent'ınızla {#use-in-ai-tool}

Claude Code, Codex, Cursor, Kiro veya desteklenen başka bir istemci kullanıyorsanız ve SandBase Models ile API'lerini o uygulamanın içinde istiyorsanız bunu seçin.

**Otomatik yerel kurulum için:** istemcinizin komut çalıştırabilmesi ve bulunduğu makinede npm ile birlikte Node.js 20+ olması gerekir. Yalnızca sohbet tabanlı bir istemci kullanıyorsanız bunun yerine [istemciye özgü bağlantı talimatlarını](/setup/) izleyin.

1. Console'da [Build → AI tools](https://www.sandbase.ai/console/setup){target="_blank"} sayfasını açın.
2. Bu satırı yapay zekâ asistanınızın sohbetine yapıştırın, ardından ne oluşturmak istediğinizi söyleyin. Bu bir kabuk komutu değil, sohbet talimatıdır:

   ```text
   set up https://www.sandbase.ai/SKILL.md
   ```

3. Agent'ın açtığı tarayıcı oturum açma işlemini onaylayın. Yapıştırılacak bir API anahtarı yoktur.
4. SandBase araçlarının yüklenmesi için yeni bir oturum başlatın veya uygulamayı yeniden başlatın.
5. Agent'tan ilgili aracı keşfetmesini ve incelemesini isteyin, ardından yetkiniz ve bütçeniz dahilinde sınırlı bir istek yapmasını isteyin. Geliştirme için yanıtı projenize entegre etmesini, çalıştırma komutunu ve gerçek test sonuçlarını sunmasını isteyin. Yalnızca keşif, bir iş API'si çağrısını doğrulamaz.

Terminali mi tercih ediyorsunuz? `npx -y @sandbaseai/cli@latest connect` komutunu çalıştırın. Komut algıladığı desteklenen istemcileri yapılandırır; yalnızca birini yapılandırmak için `npx -y @sandbaseai/cli@latest connect --client codex` kullanın (`codex` yerine desteklenen istemcinizi yazın). Ardından o istemciyi yeniden başlatın. Ücretli bir çalıştırmadan önce seçili çalışma alanını kontrol edin.

Örneğin şunu isteyebilirsiniz:

> Yapay zekâ agent'ları hakkındaki herkese açık X gönderilerini aramak için bir SandBase API'si bul. Önce zorunlu girdilerini ve fiyatını incele, ardından çalıştırmadan önce tek bir isteğin maliyetini bana söyle. Sonuçta özgün kaynak bağlantılarını koru.

Kaynak kod ve kurulum talimatları: [GitHub'daki SandBase CLI ve MCP](https://github.com/sandbaseai/cli).

Daha fazla bilgi: [AI tools bağlama](/setup/).

### Yapay zekâ asistanınızın geliştirmenize yardım etmesine izin verin {#start-with-your-agent}

[Kurulum Skill'i](https://www.sandbase.ai/SKILL.md), agent'ınızı mevcut durumunuza göre yönlendirir: henüz hesap yok, mevcut bir API anahtarı, zaten bağlı bir araç, mevcut bir proje veya yeni bir özellik. Uç noktanın girdilerini ve fiyatını kontrol eder, entegrasyonu uygulamaya yardımcı olur ve kurulumu doğrulanmış bir çağrıdan ve çalışan bir özellikten ayırt eder. Hedefinizi ve varsa harcama sınırınızı söyleyin; anahtarınızı sohbete yapıştırmayın.

Zaten bir anahtarınız veya projeniz mi var? Bunu belirtin; baştan başlamanız gerekmez. Örneğin: “Bir SandBase anahtarım var. Bu projeye bir Similarweb trafik sorgusu ekle; önce API'yi incele ve canlı testin maliyetini göster.” Komut çalıştıramayan veya araç yükleyemeyen bir asistanın [istemciye özgü kurulum yoluna](/setup/) ihtiyacı vardır.

[Agent'ınıza Markdown Hızlı Başlangıç'ı verin](https://www.sandbase.ai/quickstart.md) veya aşağıdaki adımları kullanın. Kurulum Skill'ini yüklemek kendi başına barındırılan bir Agent oluşturmaz.

### İsteğe bağlı: SandBase'de barındırılan bir Agent çalıştırın {#build-agent}

İş birden çok adımdan oluşuyorsa veya yeniden kullanılacaksa bunu seçin.

1. [Build → Agents](https://www.sandbase.ai/console/agents){target="_blank"} sayfasını açın ve **Create** seçeneğini seçin.
2. **Overview** ve **Instructions** alanlarını doldurun.
3. Bir **Model** seçin.
4. **Capabilities** altında Skills ve MCP araçları ekleyin, ardından **Runtime** ayarını yapın.
5. Bir Session içinde test etmek için **Create & Chat** seçeneğini seçin.
6. Test edilen sürümü Agent'ın **API** sekmesinden uygulamanızla çağırın.

Daha fazla bilgi: [Build Agent](/agents/). Aynı işlemi resmi OpenAI SDK'sıyla koddan yapmak için [OpenAI uyumluluğu](/agents/openai-compatibility) sayfasına bakın.

## Skills, Tools ve diğer geliştirme yolları {#skills-and-tools}

Görevinize uyan kaynağı seçin. Bir API'yi kullanmak için Skill kurmanız veya barındırılan bir Agent oluşturmanız gerekmez.

- **[Tools](https://www.sandbase.ai/tools):** metin biçimlendirme veya herkese açık veri arama gibi belirli bir görevi hazır bir arayüzde tamamlayın.
- **[Skills](https://www.sandbase.ai/skills):** bir agent'a talimatlar, betikler ve örnekler içeren yeniden kullanılabilir bir iş akışı verin.
- **Models ve API'ler:** bir yeteneği Playground'dan, kodunuzdan veya bağlı bir agent'tan çağırın. [Dil modellerini](https://www.sandbase.ai/models), [görüntü ve videoyu](https://www.sandbase.ai/models/image-video) veya [veri API'lerini](https://www.sandbase.ai/apis) keşfedin.
- **[Barındırılan Agent'lar](/agents/):** SandBase'de yeniden kullanılabilir bir agent yapılandırın ve çalıştırın.
- **[Sandbox'lar](/sandbox/):** koda, çalıştırma yapmak ve dosyalarla çalışmak için yalıtılmış bir ortam verin.

### Bir Tool kullanma {#use-tools}

1. [Tools](https://www.sandbase.ai/tools) sayfasını açın ve tamamlamak istediğiniz görevi seçin.
2. Aracın girdi gereksinimlerini ve fiyatlandırma veya kota etiketini okuyun. Ücretsiz yardımcı araçlar hesap olmadan çalışabilir; veri araçlarını çalıştırmak için SandBase oturumu gerekir ve model testleri kendi anahtarınızı gerektirebilir.
3. İstenen metni, URL'yi, dosyayı veya diğer girdileri girin, ardından aracın çalıştırma eylemini kullanın.
4. Çıktıyı inceleyin ve sunulduğu yerde kopyalama veya indirme eylemini kullanın. Bir veri aracında aynı görevi otomatikleştirmek istiyorsanız bağlantılı API'sini ve istek örneğini kullanın.

**Ücretsiz günlük kota çalışma alanı tarafından paylaşılır**; her araç için ayrı bir hak değildir. Çalıştırmadan önce uygunluğu ve gösterilen fiyatı kontrol edin; ücretsiz bir yardımcı araç, bir model veya API çağrısını ücretsiz yapmaz.

### Bir Skill kullanma {#use-skills}

1. [Skills](https://www.sandbase.ai/skills) sayfasını açın, bir iş akışı seçin ve örneklerini, zorunlu girdilerini ve bağımlılıklarını okuyun.
2. O Skill'in ayrıntı sayfasında sunulan seçeneklerden birini seçin:
   - **Run online:** sunulduğu yerde oturum açın ve barındırılan örneği çalıştırın. İlerlemesini takip edin ve ortaya çıkan çıktıyı veya dosyaları açın. Gösterilen kullanım hakkını kontrol edin; kullanılabilirlik ve sınırlar Skill'e göre değişir.
   - **Install / Download:** sunulduğu yerde paketi indirmek için oturum açın. Paketin tamamını bir çalışma klasörüne çıkarın, ardından kurulum talimatlarını izleyin veya yerel agent'ınızdan `SKILL.md` dosyasını okumasını isteyin.
3. Yerel kullanım için görevinizi, girdilerinizi, istediğiniz çıktıyı ve harcama sınırınızı belirtin. SandBase'i [Agent yolunu](#use-in-ai-tool) kullanarak bağlayın; Skill'in betikleri bir anahtar gerektiriyorsa anahtarı sohbete yapıştırmak yerine yürütme ortamında yapılandırın.
4. Gerçek sonucu inceleyin. Bir Skill'i indirmek veya agent'ınızı bağlamak, iş akışının başarıyla çalıştığı anlamına gelmez.

SandBase **kurulum Skill'i** istemcinizi bağlar; katalogdaki Skills ise tek tek iş akışlarını tanımlar. Kurmadan önce her Skill'in bağımlılıklarını ve desteklenen istemcisini kontrol edin. Yerel bir iş akışının kullandığı model ve API çağrıları kullanım ücretine yol açabilir.

Girdi klasörleri ve kaydedilen çıktılar dahil eksiksiz bir anlatım için [Bir Skill'i yerel olarak kullanma](/guides/skills/local-use) sayfasına bakın.

## İsteğe bağlı: bir ekip çalışma alanı paylaşın {#create-organization}

API anahtarları, kullanım ve faturalandırma bir kuruluşa aittir. Tek başınıza değerlendirme yapıyorsanız kişisel çalışma alanında kalın. Birkaç kişi anahtarları ve harcamayı paylaşacaksa bir ekip oluşturun.

| Çalışma alanı | Ne zaman kullanılır |
|---|---|
| **Personal** | İlk oturum açmada otomatik olarak oluşturulur. Kullanıcı başına bir tane. |
| **Team** | Paylaşılan üyeler, anahtarlar ve bakiye. Bir şirket veya proje için oluşturun. |

### Ekip oluşturma {#create-team}

1. [Create team](https://www.sandbase.ai/console/members?create=1){target="_blank"} sayfasını açın veya Console'un sağ üstündeki hesap menüsünde **Create Team** seçeneğini seçin.
2. Bir **Team name** girin, ardından **Create team** seçeneğini seçin.
3. Hesap menüsünün artık bu ekibi etkin çalışma alanı olarak gösterdiğini doğrulayın.
4. **Developer → Team** sayfasında **Add member** seçeneğini seçin, mevcut bir SandBase hesabının **Account email** değerini girin ve **Workspace role** (Member veya Admin) seçin.

Davet edilen kişinin zaten bir SandBase hesabı olmalıdır. Hesabı yoksa önce oturum açabilmesi için ona [bu sayfayı](/getting-started/quickstart) gönderin, ardından onu ekleyin.

Birden fazla kuruluşa üyeyseniz hesap menüsünden geçiş yapın. Anahtarlar ve faturalandırma **etkin** kuruluşu izler. Roller için [Kuruluşlar](/admin/organizations) sayfasına bakın.

## Çalıştığını doğrulayın {#confirm-it-works}

Aşağıdakilerin tümü doğru olduğunda hazırsınız:

- Console hesap menüsü kullanmak istediğiniz kuruluşu gösteriyor.
- Bir yolu tamamladınız: bir API çağrısı, web sitesinde bir çalıştırma, bağlı bir yapay zekâ aracı veya bir Agent.
- Bir istek başarılı oluyor.

İstek başarısız olursa etkin kuruluşu, anahtarı ve [Hatalar](/guides/error-handling) sayfasını kontrol edin. Çalışma alanında kalan bakiye yoksa [Billing](https://www.sandbase.ai/console/billing){target="_blank"} sayfasından bakiye yükleyin.

### Takılırsanız {#if-you-get-stuck}

| Gördüğünüz | Kontrol edilecekler |
| --- | --- |
| Oturum açılması gerekiyor | Oturum açın, özgün sayfaya dönün ve etkin çalışma alanını kontrol edin. |
| Geçersiz anahtar veya erişim reddedildi | Anahtarın hedef çalışma alanına ait olduğunu ve uç noktaya erişimi olduğunu doğrulayın. Kredi eklemek izin sorunlarını çözmez. |
| Yetersiz bakiye veya kota tükendi | Yanıtı okuyun: bakiye sorunu için Billing'i, kota sınırı için gösterilen sıfırlama zamanını kontrol edin. |
| Agent'ınızda araç yok | Yeni bir istemci oturumu başlatın, ardından [AI tools bağlama](/setup/) sayfasındaki tanılama adımlarını izleyin. |
| Görev hâlâ çalışıyor | Döndürülen görev durumunu veya sayfanın ilerleme göstergesini takip edin. Aynı ücretli isteği tekrar tekrar göndermekten kaçının. |

## Faturalandırma ve kullanım {#billing-and-usage}

Oturum açtıktan sonra etkin kuruluşun harcamasını inceleyin:

<QuickstartResources group="ops" />

## Sırada ne var {#next-steps}

<QuickstartResources group="catalog" />

- [Tools](https://www.sandbase.ai/tools) — bir görevi tarayıcıda tamamlayın
- [Skills](https://www.sandbase.ai/skills) — yeniden kullanılabilir bir agent iş akışı bulun
- [API anahtarları](/getting-started/api-keys) — kuruluş anahtarları oluşturun ve yenileyin
- [Models ve API kataloğu](https://www.sandbase.ai/models) — Models, API'ler ve Agents'ı web sitesinde deneyin
- [AI tools bağlama](/setup/) — yapay zekâ aracınıza SandBase kataloğunu verin
- [Build Agent](/agents/) — yeniden kullanılabilir Agent'lar oluşturun
- [API Reference](/api-reference/) — kodla entegre edin
