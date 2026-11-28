---
i18nSource: 91c5a0d1b6de6434
title: Fiyatlandırma ve Kullanım
description: Güncel model fiyatlarını bulun, görev maliyetlerini inceleyin ve SandBase faturalandırmasını güvenle yönetin.
---

# Fiyatlandırma ve Kullanım {#pricing-and-usage}

SandBase kullandıkça öde faturalandırması kullanır. Model kullanılabilirliği, fiyat formülleri, önbellek çarpanları ve yeteneğe özgü
ücretler birbirinden bağımsız olarak değişebilir; bu nedenle entegrasyonlar kopyalanmış fiyat tablolarına güvenmek yerine
canlı meta verileri okumalıdır.

## Günlük ücretsiz API çağrıları {#daily-free-api-calls}

Her organizasyon, UTC günü başına 100 ücretsiz veri API çağrısı (arama, sosyal medya, kazıma, e-ticaret, finans) alır. Bu
hak, tüm uygun veri API'leri ve organizasyonun tüm anahtarları tarafından paylaşılır ve 00:00 UTC'de sıfırlanır. LLM'ler ve
medya modelleri uygun değildir. Bazı veri API'leri de uygun değildir: bazı toplu uç noktalar, crawl uç noktaları, Xiaohongshu PGY
ve Douyin Xingtu `kol-*` rotaları gibi daha pahalı veya formülle fiyatlandırılan API'ler ilk çağrıdan itibaren ücretlendirilir.
Bir aracı kontrol etmek için `sandbase_inspect` çalıştırın: uygun araçlar `pricing.free_quota` taşır, bu alanı taşımayan araçlar
her zaman ücretlendirilir.

- Hak kapsamındaki çağrılar ücretlendirilmez ve bakiyesi sıfır olan bir organizasyon da bunları kullanabilir.
- 100. çağrıdan sonra uygun çağrılar çalışmaya devam eder ve aracın gösterdiği fiyattan çağrı başına ücretlendirilir. Hak
  tükendiği için reddedilmez veya hız limitine takılmaz.
- Kullanılmayan çağrılar ertesi güne devretmez.

[SandBase MCP araçlarında](/setup/) `sandbase_inspect`, uygun araçları `pricing.free_quota`
(`daily_limit`, `scope`, `resets`) ile işaretler. `sandbase_account`, bugünkü hakkı `daily_limit`, `used_today`,
`remaining` ve `resets_at` içeren `free_api_quota` olarak döndürür; sayım geçici olarak kullanılamadığında `used_today` ve
`remaining` yanıta eklenmez. Bir çalıştırmanın mutabakatı tamamlandıktan sonra `sandbase_run` ve `sandbase_run_get`, `free_quota_status` bildirir:
`free` (hak kapsamında), `overage` (hak tükendikten sonra ücretlendirildi) veya `degraded` (hak sayımı kullanılamadığı için
ücretlendirilmedi).

## Console'da faturalandırmayı yönetme {#manage-billing-in-the-console}

Bakiyenizi görüntülemek, kredi satın almak, otomatik yüklemeyi ayarlamak, kupon kullanmak ve organizasyonunuz için mevcut faturalandırma ayarlarını yönetmek için
**Developer → Billing** sayfasını kullanın. Organizasyon düzeyinde istek, token ve maliyet özetleri için **Developer → Activities → Usage** sayfasını açın.

::: info Herkese açık API sınırı
Bakiye, bakiye yükleme, faturalandırma dışa aktarımı ve organizasyon genelindeki kullanım uç noktaları şu anda desteklenen
herkese açık API'nin parçası değildir. Console ağ isteklerini otomatikleştirmeyin ve dahili Console rotalarına bağımlı olmayın.
:::

## Güncel model fiyatlarını okuma {#read-current-model-pricing}

Önce etkin bir model bulun:

```bash
curl 'https://api.sandbase.ai/v1/models?q=gpt' \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Ardından modelin tam model kartını isteyin:

```bash
curl https://api.sandbase.ai/v1/models/deepseek/deepseek-v4-flash \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Liste uç noktası keşif için optimize edilmiştir ve ayrıntılı token, önbellek ve akıl yürütme fiyatlarını kasıtlı olarak içermez.
Seçilen modelin ayrıntılı fiyatlandırmasını ayrıntı yanıtındaki `model_card` alanından okuyun. Her LLM, medya modeli, embedding
modeli veya API yeteneği için geçerli evrensel bir formül yoktur.

## Bir görevin kaydedilmiş maliyetini kontrol etme {#check-one-task-s-recorded-cost}

Bir işlem görev kimliği döndürdüğünde mutabakat kaydını sorgulayın:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Yanıt, güncel `cost` değerini `estimated_cost` değerinden ayırır ve mutabakatın nihai olup olmadığını bildirir. `settled`
`true` olana kadar faturalandırma mutabakatı için `cost` değerini kullanmayın. Görev kayıtları bir muhasebe defteri değil,
operasyonel sorgulama verileridir. Mutabakat ve uzun vadeli kayıtlar için **Developer → Activities → Usage** altındaki
faturalandırma kayıtlarını ve CSV dışa aktarımlarını kullanın.

## Maliyet denetimi uygulamaları {#cost-control-practices}

- Yeni bir iş yükü başlatmadan önce güncel model kartını çözümleyin.
- `capability_tags`, `supported_modes` ve `unified_schema` değerlerini kontrol edin; daha ucuz alternatifler yalnızca gerekli
  girdi ve çıktı davranışını desteklediklerinde işe yarar.
- Gereksiz prompt bağlamını sınırlayın ve seçilen model destekliyorsa uygun bir çıktı token limiti ayarlayın.
- Önbelleklemeyi modele özgü olarak ele alın. Sağlayıcı genelinde bir indirim varsaymak yerine model kartını ve dönen
  kullanım alanlarını kontrol edin.
- Görev kimliklerini yalnızca görev maliyeti sorgulaması için kaydedin; asenkron `/v1/run` işleri için dönen opak çalıştırma kimliğini kaydedin ve `GET /v1/run/{id}` uç noktasını yalnızca durum `pending` veya `running` iken sorgulayın.
- Organizasyonunuz için Console'da sunulan harcama denetimlerini kullanın.

## Ödeme hataları {#payment-errors}

Organizasyon isteği karşılayamadığında bir API işlemi HTTP `402` döndürebilir. Hata zarfları API uyumluluk yüzeyine göre
değiştiğinden tek bir mesaj dizesini eşleştirmek yerine HTTP durumunu ve belgelenmiş hata nesnesini ele alın.
Faturalandırmayı Console'da çözdükten sonra işlemin idempotency ve kurtarma kurallarına göre yeniden deneyin.

Video gönderimleri başlamadan önce tahmini maliyetlerine göre de kontrol edilir. Tek seferde 10 $ veya daha fazla bakiye
yüklemek hesap seviyenizi yükseltir ve bu da aynı anda daha fazla video görevi çalıştırmanıza olanak tanır.
[Eşzamanlılık limitleri](/guides/concurrency-limits) sayfasına bakın.

Güncel herkese açık sözleşmeler için [Modeller ve Fiyatlandırma](/for-agents/models), [Görev Maliyeti](/api-reference/tasks/cost) ve
[Hatalar](/api-reference/errors) sayfalarına bakın.
