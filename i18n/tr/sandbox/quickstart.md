---
i18nSource: 0d7d66842e233794
title: E2B SDK ile Sandbox hızlı başlangıcı
description: Resmi E2B JavaScript ve Python SDK'larını SandBase'e bağlayın, komut çalıştırın, dosya okuyup yazın ve bir sandbox'ı güvenle yönetin.
---

<script setup>
import SandboxPromo from '@theme/SandboxPromo.vue'
</script>

# E2B SDK ile Sandbox hızlı başlangıcı {#sandbox-quickstart-with-the-e2b-sdk}

<SandboxPromo />

Yalıtılmış bir sandbox oluşturmak, bir komut çalıştırmak ve dosya okuyup yazmak için resmi E2B SDK'yı SandBase API anahtarınızla kullanın. Bu kılavuz **E2B JavaScript ve Python SDK 2.51.0** sürümünü hedefler.

Tarayıcıdan oluşturma ve izleme için [Sandbox Console](https://www.sandbase.ai/console/sandboxes)'a giriş yapın; burada bir örnek oluşturabilir, durumunu, günlüklerini ve metriklerini görüntüleyebilirsiniz. Uygulama entegrasyonu için aşağıdaki SDK adımlarıyla devam edin veya [Sandbox ürün genel bakışını](https://www.sandbase.ai/sandbox) okuyun.

## 1. Resmi SDK'yı yapılandırma {#_1-configure-the-official-sdk}

[Console'da bir SandBase API anahtarı oluşturun](https://www.sandbase.ai/console/keys), ardından standart E2B ortam değişkenlerini yapılandırın. Resmi SDK bunları hem JavaScript'te hem de Python'da otomatik olarak okur.

| Ortam değişkeni | Değer |
|---|---|
| `E2B_API_KEY` | [Developer → API Keys](https://www.sandbase.ai/console/keys) sayfasındaki SandBase API anahtarınız |
| `E2B_API_URL` | `https://sandbox.sandbase.ai` |
| `E2B_DOMAIN` | `sandbox.sandbase.ai` |
| `E2B_DEBUG` | `false` |
| `E2B_SANDBOX_URL` | SDK'nın her sandbox'ın veri düzlemi adresini kullanması için ayarlamadan bırakın |

```bash
# Inject your SandBase key as E2B_API_KEY through your environment or secret manager.
export E2B_API_URL="https://sandbox.sandbase.ai"
export E2B_DOMAIN="sandbox.sandbase.ai"
export E2B_DEBUG="false"
unset E2B_SANDBOX_URL
```

Anahtarı zaten `SANDBASE_API_KEY` içinde saklıyorsanız onu yeniden kullanın:

```bash
export E2B_API_KEY="$SANDBASE_API_KEY"
```

Yalnızca SandBase API anahtarınıza ihtiyacınız vardır. Sandbox erişimine uygun normal bir SandBase anahtarı kullanın; başka bir yetenekle sınırlandırılmış bir anahtar reddedilebilir. Bkz. [API anahtarları](/getting-started/api-keys).

### Mevcut E2B kodu değiştirilmeden kalabilir mi? {#can-existing-e2b-code-stay-unchanged}

Evet; uygulamanız SDK bağlantı ayarlarını zaten ortamdan okuyorsa ve şablonu SandBase'de mevcutsa desteklenen işlemler için kalabilir. Resmi SDK'yı ve mevcut çağrılarınızı koruyun; yalnızca yukarıdaki anahtarı, API URL'sini ve etki alanını değiştirin. Uygulama kodundaki açık bağlantı seçenekleri ortam değişkenlerinden önceliklidir; bu nedenle sabit kodlanmış E2B uç noktalarını, etki alanlarını veya sağlayıcı anahtarlarını kaldırın ya da güncelleyin.

`E2B_API_URL` ve `E2B_DOMAIN` değerlerinin **ikisini de** ayarlayın. Yalnızca etki alanı verildiğinde SDK 2.51.0, başına ek bir `api.` öneki eklenmiş bir API ana bilgisayarı türetir. `E2B_SANDBOX_URL`, örnek başına komut/dosya adresini geçersiz kılar; bunu kontrol API'sinin kaynağına ayarlamayın. Hata ayıklama modu SDK'nın yerel geliştirme için adres seçimini değiştirir; bu HTTPS hizmeti için devre dışı bırakın.

Kontrol API'si örnekleri oluşturur ve yönetir. Komutlar, dosyalar ve uygulama portları `sandbox.sandbase.ai` altındaki örnek başına alt etki alanlarını kullanır. Model API'sinin `/v1` önekini eklemeyin. Başarılı bir kontrol API isteği tek başına komut/dosya erişimini veya tüm sağlayıcı özelliklerini doğrulamaz.

Örnekler süreç ortam değişkenlerini okur. Bir `.env` dosyası, yalnızca uygulamanız veya başlatıcınız onu SDK'yı kullanmadan önce yüklerse işe yarar.

### Şablon seçme {#choose-a-template}

Organizasyonunuzun görebildiği şablonları listelemek için SandBase anahtarınızı kullanın:

```bash
curl --fail --silent --show-error 'https://sandbox.sandbase.ai/v2/templates?limit=100' \
  -H "X-API-Key: $E2B_API_KEY"
```

`buildStatus: "ready"` olan bir şablon seçin ve `templateID` değerini kopyalayın. Görünen adlar `names` veya `aliases` içinde verilir; ikisi de boşsa kimliği kullanın. `public` alanı, herkese açık şablonları organizasyonunuzun görebildiği özel şablonlardan ayırır.

Yanıt bir dizidir. Yanıt başlıkları `X-Next-Token` içeriyorsa sonraki sayfayı almak için değerini `nextToken` sorgu parametresi olarak gönderin.

Seçilen şablon kimliğini ayarlayın:

```bash
export SANDBASE_TEMPLATE_ID="YOUR_TEMPLATE_ID"
```

`SANDBASE_TEMPLATE_ID`, aşağıdaki örneklerde kullanılan bir değişkendir; yerleşik bir E2B SDK ayarı değildir. Örnekler bunu `Sandbox.create` çağrısına açıkça iletir. Mevcut kod, o kimlik veya ad SandBase'de mevcutsa kendi şablon argümanını koruyabilir. Üst akıştaki bir E2B şablon kimliğinin veya SDK varsayılanı `base` şablonunun mevcut olduğunu varsaymayın; liste boşsa organizasyonunuz için şablon erişimi isteyin.

## 2. Oluşturma, çalıştırma ve temizleme {#_2-create-execute-and-clean-up}

Bu örnekler gerçek bir kaynak oluşturur. İki dakikalık bir ömür kullanır ve örneği `finally` içinde açıkça siler. Önce bir örneği çalıştırın ve yeniden çalıştırmadan önce temizliğin yapıldığını doğrulayın.

### JavaScript {#javascript}

Bir uygulama dizininde Node.js 22 veya daha yeni bir sürüm kullanın:

```bash
npm install --save-exact e2b@2.51.0
```

`sandbox-example.mjs` olarak kaydedin:

```js
import { randomUUID } from 'node:crypto';
import { Sandbox } from 'e2b';

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

const options = {
  requestTimeoutMs: 30_000,
  retries: 0,
};
const template = required('SANDBASE_TEMPLATE_ID');
const runId = randomUUID();
let sandbox;

// Keep this identifier if creation times out before returning an instance ID.
console.log('Run ID:', runId);
try {
  sandbox = await Sandbox.create(template, {
    ...options,
    timeoutMs: 120_000,
    metadata: { quickstartRunId: runId },
  });
  console.log('Sandbox ID:', sandbox.sandboxId);

  const result = await sandbox.commands.run('printf hello-sandbase', {
    timeoutMs: 15_000,
  });
  if (result.exitCode !== 0 || result.stdout !== 'hello-sandbase') {
    throw new Error('Command verification failed');
  }

  const path = '/tmp/sandbase-hello.txt';
  await sandbox.files.write(path, 'hello from SandBase');
  if (await sandbox.files.read(path) !== 'hello from SandBase') {
    throw new Error('File verification failed');
  }
  console.log('Command and file checks passed');
} catch {
  console.error('Sandbox example failed; retain the run ID for troubleshooting');
  process.exitCode = 1;
} finally {
  if (sandbox) {
    try {
      await Sandbox.kill(sandbox.sandboxId, options);
      console.log('Sandbox cleanup completed');
    } catch {
      console.error('Cleanup failed; delete the recorded Sandbox ID');
      process.exitCode = 1;
    }
  }
}
```

SDK ortam değişkenleri ve seçilen şablon yapılandırılmış şekilde çalıştırın:

```bash
node sandbox-example.mjs
```

### Python {#python}

Sabitlenmiş SDK sürümünü Python ortamınıza yükleyin:

```bash
python -m pip install 'e2b==2.51.0'
```

`sandbox_example.py` olarak kaydedin:

```python
import os
import sys
import uuid
from e2b import Sandbox

options = {
    "request_timeout": 30,
}
template = os.environ["SANDBASE_TEMPLATE_ID"]
run_id = str(uuid.uuid4())
sandbox = None
failed = False

print("Run ID:", run_id)
try:
    sandbox = Sandbox.create(
        template, timeout=120,
        metadata={"quickstartRunId": run_id}, **options,
    )
    print("Sandbox ID:", sandbox.sandbox_id)

    result = sandbox.commands.run("printf hello-sandbase", timeout=15)
    if result.exit_code != 0 or result.stdout != "hello-sandbase":
        raise RuntimeError("Command verification failed")

    path = "/tmp/sandbase-hello.txt"
    sandbox.files.write(path, "hello from SandBase")
    if sandbox.files.read(path) != "hello from SandBase":
        raise RuntimeError("File verification failed")
    print("Command and file checks passed")
except Exception:
    print("Sandbox example failed; retain the run ID for troubleshooting")
    failed = True
finally:
    if sandbox is not None:
        try:
            Sandbox.kill(sandbox.sandbox_id, **options)
            print("Sandbox cleanup completed")
        except Exception:
            print("Cleanup failed; delete the recorded Sandbox ID")
            failed = True

sys.exit(1 if failed else 0)
```

```bash
python sandbox_example.py
```

Başarı, hem komut/dosya doğrulamasının hem de temizliğin tamamlandığı anlamına gelir. Run ve sandbox kimliklerini organizasyonunuz içinde tutun. SDK nesnesini günlüğe yazmayın: erişim belirteçleri içerebilir.

Oluşturma işlemi kimlik dönmeden zaman aşımına uğrarsa kaynak yine de var olabilir. Başka bir tane oluşturmadan önce operatörünüzden `quickstartRunId` meta verisini kullanarak onu bulmasını isteyin. Zaman aşımı veya kesintiye uğrayan bir süreç silme işlemini doğrulamaz; süreç zorla sonlandırıldıktan sonra `finally` çalışamaz.

## 3. Ömrü uzatma veya duraklatıp yeniden bağlanma {#_3-extend-the-lifetime-or-pause-and-reconnect}

Bu kod parçalarını ilgili örneğin `try` bloğu içine, dosya denetiminden sonra ve temizlikten önce ekleyin. Duraklatma/sürdürme, seçilen şablon ve sağlayıcı tarafından desteklenmelidir.

JavaScript bu SDK zaman aşımları için **milisaniye** kullanır:

```js
await sandbox.setTimeout(300_000);
const id = sandbox.sandboxId;
await sandbox.pause();
sandbox = await Sandbox.connect(id, { ...options, timeoutMs: 120_000 });
if (await sandbox.files.read('/tmp/sandbase-hello.txt') !== 'hello from SandBase') {
  throw new Error('File did not survive pause and reconnect');
}
```

Python **saniye** kullanır:

```python
sandbox.set_timeout(300)
sandbox_id = sandbox.sandbox_id
sandbox.pause()
sandbox = Sandbox.connect(sandbox_id, timeout=120, **options)
if sandbox.files.read("/tmp/sandbase-hello.txt") != "hello from SandBase":
    raise RuntimeError("File did not survive pause and reconnect")
```

Yeniden bağlanma yeni bir SDK nesnesi ve oturum kimlik bilgileri döndürür. Sonraki komutlar ve dosyalar için bu nesneyi kullanın. Bir sandbox'ı silmek yaşam döngüsünü sonlandırır; bu kılavuz silme sonrasında depolamanın kalıcı olacağını vaat etmez. Sandbox ömrü ile tek bir komutun veya HTTP isteğinin zaman aşımı farklı ayarlardır.

## 4. Uygulama portlarına erişme {#_4-access-application-ports}

Uygulamanız sandbox içinde dinlemeye başladıktan sonra ana bilgisayarını almak için JavaScript'te `sandbox.getHost(port)`, Python'da `sandbox.get_host(port)` kullanın. Uygulama trafiği, geçerli bağlantıdaki `sandbox.trafficAccessToken` veya `sandbox.traffic_access_token` değeriyle `e2b-traffic-access-token` başlığını gerektirir.

Ana bilgisayar tek başına erişim yetkisi vermez. HTTP veya WebSocket istemciniz başlığı göndermelidir; URL'yi bir tarayıcı sekmesinde açmak başlığı eklemez. Trafik belirteçlerini ve imzalı dosya URL'lerini kimlik bilgisi olarak ele alın; günlüklerin ve paylaşılan bağlantıların dışında tutun. Port erişimi, seçilen sandbox ortamı tarafından desteklenmelidir.

## Sorun giderme {#troubleshooting}

| Belirti | Kontrol edilecekler |
|---|---|
| Kimlik doğrulama veya kapsam hatası | SandBase anahtarının geçerliliği, organizasyon erişimi ve anahtar kapsamı |
| Şablon bulunamadı | Etkin şablonun tam kimliği/adı ve organizasyonunuz tarafından görülebilirliği |
| Oluşturma başarılı ama komutlar/dosyalar başarısız | Ağ bağlantınız ve güncel oturum kimlik bilgileri; yeniden bağlanın, sorun sürerse destek ekibiyle iletişime geçin |
| İstekler yanlış hizmete gidiyor | `E2B_API_URL`, `E2B_DOMAIN` ve bunları geçersiz kılan sabit kodlanmış SDK seçenekleri |
| Duraklatmadan sonra erişim başarısız | Yeniden bağlanın ve yeni döndürülen SDK nesnesini kullanın |
| Uygulama portu bir isteği reddediyor | Uygulamanın hazır olması ve güncel trafik belirteci başlığı |
| `unsupported_operation` | Seçilen sağlayıcı bu işlemi desteklemiyor; ona güvenmeden önce kullanılabilirliği kontrol edin |
| Oluşturma yanıtı bilinmiyor | Başka bir örnek oluşturmadan önce kaydedilen run kimliğiyle durumu uzlaştırın |
| Temizlik başarısız | Kaydedilen örnek kimliği için silmeyi yeniden deneyin; oluşturma akışının tamamını yeniden çalıştırmayın |

Örnekler temel komut/dosya iş akışını kapsar. Şablon derlemeleri, anlık görüntüler, olaylar, webhook'lar ve gelişmiş ağ özellikleri ayrı yetenek denetimleri gerektirir. Bir E2B SDK'sını yüklemek tek başına her sağlayıcıyla tam uyumluluğu kanıtlamaz.

## SDK referansları {#sdk-references}

- [E2B belgeleri](https://e2b.dev/docs)
- [E2B JavaScript SDK 2.51.0](https://www.npmjs.com/package/e2b/v/2.51.0)
- [E2B Python SDK 2.51.0](https://pypi.org/project/e2b/2.51.0/)
