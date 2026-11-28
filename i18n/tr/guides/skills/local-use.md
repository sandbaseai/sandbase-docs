---
i18nSource: 31b3bd202f3dc24e
agentDoc: local-use-agent-en
title: Bir Skill'i Yerelde Kullanın
description: Bir SandBase Lab Skill'i seçin, paketini indirin, model erişimini yapılandırın ve yerel bir agent ile bir proje oluşturup kaydedin.
---

# Bir Skill'i yerelde kullanın {#use-a-skill-locally}

Bir SandBase Skill'ini indirin ve bilgisayarınızdaki bir agent ile bir projeyi tamamlayın. Bir Skill talimatlar, betikler ve örnekler içerir. Agent, `SKILL.md` dosyasında açıklanan iş akışını izler.


## 1. Bir Skill seçin {#_1-choose-a-skill}

1. [SandBase Lab](https://www.sandbase.ai/lab/) sayfasını açın.
2. Videolar, animasyonlar ve haritalar gibi örneklere göz atın. Projenize uyan bir Skill açın.
3. Örneği, gerekli girdileri, çıktı biçimini ve desteklenen dilleri inceleyin.
4. ZIP paketini kaydetmek için Skill indirme eylemini kullanın.

Şehir tarihini anlatan bir harita filmi için [City Through Time](https://www.sandbase.ai/lab/skills/city-through-time) örnekleri ve talimatlarıyla başlayın.

## 2. Yerel bir çalışma klasörü hazırlayın {#_2-prepare-a-local-working-folder}

1. `my-city-film` gibi bir proje klasörü oluşturun.
2. Skill ZIP dosyasının tamamını talimatları, betikleri ve varlıkları koruyarak bu klasöre çıkarın.
3. Projeyi yerel agent'ınızda açın ve dosyalarına ve iş akışının gerektirdiği komutlara erişim izni verin.
4. Skill sayfasındaki kurulum talimatlarını izleyin veya agent'tan çıkarılan `SKILL.md` dosyasını doğrudan okumasını isteyin.

Bir proje şu yapıyı kullanabilir:

```text
my-city-film/
  skill/          # Complete extracted Skill package
  inputs/         # Images, text, and other inputs
  outputs/        # Previews and deliverables
```

Skill'in gerektirdiği belirli dosya adlarını ve çıktı konumlarını kullanın.

## 3. SandBase'i bağlayın {#_3-connect-sandbase}

`set up https://www.sandbase.ai/SKILL.md` metnini agent'ınıza yapıştırın ve açtığı tarayıcı oturum açma işlemini onaylayın ya da bir terminalde `npx -y @sandbaseai/cli@latest connect` komutunu çalıştırın. SandBase araçlarının yüklenmesi için ardından yeni bir agent oturumu başlatın. Aynı seçenekler Console'daki [Build → AI tools](https://www.sandbase.ai/console/setup) sayfasında da bulunur.

Bağlantı iş akışının tamamı için [Yapay zekâ araçlarını bağlama](/setup/) sayfasına bakın.

Skill'in betikleri `SANDBASE_API_KEY` gerektiriyorsa:

1. [API Keys](https://www.sandbase.ai/console/keys) sayfasını açın ve proje için bir anahtar oluşturun veya seçin.
2. Anahtarı yerel agent'ınızın güvenli ayarları veya betik yürütme ortamı üzerinden yapılandırın.
3. Agent'tan erişimin yapılandırıldığını kontrol etmesini ve Skill iş akışına devam etmesini isteyin.

Anahtarı güvenli yerel yapılandırmada tutun. Teslim edilen dosyalara, kaynak dosyalara ve herkese açık ekran görüntülerine yalnızca proje bilgilerini ekleyin. Model kullanımını ve bakiyenizi [Billing](https://www.sandbase.ai/console/billing) sayfasında görüntüleyin.

## 4. Bir brifing verin {#_4-provide-a-brief}

Agent'a hangi Skill'i kullanacağını, ne oluşturacağını, çıktı gereksinimlerini ve bütçenizi söyleyin. Bu örneği projenize uyarlayın:

```text
Read SKILL.md in the project's skill folder and follow its workflow.

Topic: the story of Shanghai's development.
Deliverables: a playable video, a cover image, and usage notes.
Language and duration: use the Skill's supported options and state the plan before starting.
Models: use suitable models through SandBase.
Budget: model calls may use up to [AMOUNT] USD; ask me before exceeding it.

Check inputs and dependencies, then execute the workflow. Save previews and final files
in outputs. When finished, provide file paths, a summary, and the models actually used.
```

Agent talimatları okur, bağımlılıkları kontrol eder, girdileri işler ve projeyi üretir veya render eder. İstenen varlıkları aynı projeye ekleyin ve göreve devam edin.

## 5. İlerlemeyi izleyin ve sonucu inceleyin {#_5-follow-progress-and-review-the-result}

Süre; Skill'e, modellere, varlıklara ve çıktı uzunluğuna bağlıdır. Video projeleri onlarca dakikadan birkaç saate kadar sürebilir. Agent'ı çalışır durumda ve bilgisayarı uyanık tutun.

İlerlemeyi aynı konuşmada sorun:

```text
Report the current step, files already saved, and the next step, then continue the task.
```

Teslim edilen dosya yollarını açın, görselleri, sesi, altyazıları ve içeriği inceleyin ve son dosyaları kaydedin.

## 6. Projeyi düzenleyin {#_6-revise-the-project}

Asıl görev içinde belirli değişiklikler isteyin ve mevcut varlıkları yeniden kullanın:

```text
Keep the structure and other shots. Shorten the opening and correct the caption at 00:18.
Reuse existing assets and save the revised result as a new version.
```

Yürütme kesilirse çalışma klasörünü koruyun ve agent'tan mevcut adımdan devam etmesini isteyin.

## Sonraki adımlar {#next-steps}

- [AI City Remix'e katılın](/guides/skills/ai-city-remix)
- [Agent'ınızı bağlayın](/setup/)
- [API anahtarlarını yapılandırın](/getting-started/api-keys)
