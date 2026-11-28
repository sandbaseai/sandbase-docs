---
i18nSource: 28b1ef75a197824a
title: Yapay zekâ araçlarını bağlama
description: Claude Code, Codex, Cursor, Kiro ve diğer yapay zekâ araçlarına tek bir istem veya tek bir CLI komutuyla SandBase'in Models ve APIs kataloğunu sunun.
---

# Yapay zekâ araçlarını bağlama {#connect-ai-tools}

Console'daki [AI tools](https://www.sandbase.ai/console/setup) sayfası (**Build → AI tools**), SandBase'i zaten kullandığınız agent'a veya yapay zekâ aracına bağlar. Bağlı araçlar SandBase'in Models ve APIs kataloğunda arama yapabilir, her aracın girdi şemasını ve fiyatını okuyabilir ve aracı çalıştırabilir. Her çağrı etkin çalışma alanına faturalandırılır.

Desteklenen istemciler arasında Claude Code, Codex, Cursor, Kiro IDE ve Kiro CLI, Windsurf, Gemini CLI, OpenCode, Qwen Code, Warp, Amp, Crush, OpenClaw, Hermes, Claude Desktop ve ChatGPT bulunur. Güncel liste AI tools sayfasındadır.

## Hızlı başlangıç: tek bir istem yapıştırın {#quick-start-paste-one-prompt}

Bu satırı agent'ınıza yapıştırın:

```text
set up https://www.sandbase.ai/SKILL.md
```

Agent, SandBase Skill'ini okur, CLI'yi yükler ve sizden tek bir tarayıcı oturum açma işlemini onaylamanızı ister. API anahtarı yapıştırmanız gerekmez. Agent istemcinin yapılandırıldığını bildirdiğinde, `sandbase_*` araçlarının yüklenmesi için yeni bir oturum başlatın veya uygulamayı yeniden başlatın.

Skill, agent'ı çalıştıran makinede Node.js 20 veya daha yeni bir sürüm gerektirir.

## Diğer bağlantı yöntemleri {#other-ways-to-connect}

### CLI {#cli}

Bir terminalden bağlanın. `--client` olmadan CLI, bulduğu tüm desteklenen istemcileri yapılandırır:

```sh
npx -y @sandbaseai/cli@latest connect
```

Tek bir istemciyi yapılandırmak için kimliğini iletin, örneğin `codex`, `claude-code`, `cursor` veya `kiro`:

```sh
npx -y @sandbaseai/cli@latest connect --client codex
```

Yükleyici betiği aynı komutu çalıştırır:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --client codex
```

Yerel yapılandırmayı değiştirmeden yükleyicinin tanıdığı istemcileri listelemek için:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --list-agents
```

`connect`, tarayıcıda yetkilendirmeyi açar, onayladığınız çalışma alanı için bir **CLI Login** anahtarı oluşturur ve yalnızca SandBase'e ait istemci yapılandırmasını yazar. Açık kaynaklı [SandBase CLI](https://github.com/sandbaseai/cli) her istemciyi belgeler.

### Elle yapılandırdığınız MCP istemcileri {#mcp-clients-you-configure-by-hand}

Oturum açmış kullanıcılar MCP sunucu adresini [AI tools](https://www.sandbase.ai/console/setup) sayfasındaki **Other ways to connect** altında görür. Bu sunucuda **Developer → API Keys** sayfasından alınan bir [API anahtarıyla](/getting-started/api-keys) kimlik doğrulayın ve anahtarı istemcinin gizli değer yapılandırmasında saklayın.

## Bağlantıyı doğrulama {#verify-the-connection}

Yükleme veya yetkilendirme tek başına istemcinin bağlı olduğunu kanıtlamaz. Şunları doğrulayın:

- SandBase sunucusu veya bağlayıcısı istemcide görünüyor
- `sandbase_*` araçları yeni bir oturumda bulunabiliyor
- güvenli bir doğal dil isteği başarıyla tamamlanıyor

CLI tarafından yönetilen istemcilerde, yeniden bağlandıktan veya yapılandırmayı değiştirdikten sonra tanılamayı çalıştırın:

```sh
npx -y @sandbaseai/cli doctor --client codex
```

`doctor`, yerel kimlik bilgisini, MCP girdisini ve Skill'i denetler, ardından SandBase'e bir gidiş-dönüş isteği yapar. Son araç çağrısını her zaman istemcinin kendi içinde yapın.

Bağlı araçların yaptığı çalıştırmalar maliyetleriyle birlikte [Activities](https://www.sandbase.ai/console/activities) sayfasında görünür.

## Sorun giderme {#troubleshooting}

| Sorun | Kontrol edilecekler |
|---|---|
| Araçlar görünmüyor | Yeni bir istemci oturumu başlatın veya uygulamayı yeniden başlatın, `npx -y @sandbaseai/cli doctor --client <client>` komutunu çalıştırın ve yeniden deneyin. |
| Yetkilendirme eksik | `connect` komutunu yeniden çalıştırın ve faturalandırmak istediğiniz çalışma alanı için tarayıcıda oturum açmayı onaylayın. |
| Çağrılar HTTP 402 ile başarısız oluyor | Etkin çalışma alanı için [Billing](https://www.sandbase.ai/console/billing) sayfasından kredi ekleyin. |

## Yönetilen yapılandırmayı kaldırma {#remove-the-managed-configuration}

Tek bir istemci için yalnızca SandBase'e ait girdiyi kaldırın:

```sh
npx -y @sandbaseai/cli unregister --client codex
```

Komut yalnızca SandBase'e ait olduğunu doğrulayabildiği yapılandırmayı kaldırır; ilgisiz veya kullanıcı tarafından yönetilen girdileri değiştirmez. Artık ihtiyacınız yoksa ardından **Developer → API Keys** altındaki ilgili **CLI Login** anahtarını iptal edin.

## Kaynak kod ve destek {#source-and-support}

- [Kaynak kod](https://github.com/sandbaseai/cli)
- [npm paketi](https://www.npmjs.com/package/@sandbaseai/cli)
- [Sorular ve örnekler](https://github.com/sandbaseai/cli/discussions)
- [Hata bildirimleri](https://github.com/sandbaseai/cli/issues/new/choose)

## Sonraki adımlar {#next-steps}

- [Models ve APIs kataloğu](https://www.sandbase.ai/models)
- [Skill eğitimleri](/guides/skills/)
- [Agent Oluşturma](/agents/)
