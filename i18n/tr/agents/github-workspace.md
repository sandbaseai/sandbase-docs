---
i18nSource: e4dcecbecc736e53
title: GitHub deposu çalışma alanı
description: Bir GitHub deposunu Session'ın /workspace dizinine klonlayın, Session branch'lerine push edin ve pull request açın.
---

# GitHub deposu çalışma alanı {#github-repository-workspace}

Bir Session, `/workspace` içine önceden klonlanmış bir GitHub deposuyla başlayabilir. Agent, kod üzerinde sıradan `git` komutlarıyla çalışır, commit'lerini Session'a ayrılmış branch'lere push eder ve bir kişinin incelemesi için pull request açabilir.

Depoya SandBase'in git proxy'si üzerinden erişilir. Session'a hiçbir GitHub token'ı girmez.

## Başlamadan önce {#before-you-start}

Bir kuruluş yöneticisi bunu console'da bir kez ayarlar:

1. **Console → Integrations** altında GitHub'ı bağlayın ve bağlantının kullanabileceği depoları seçin.
2. Bağlantıyı Agent'ın **Integrations** bölümünde Agent'a atayın. Klonlama için Agent'ın bu bağlantıya ait araçları **Read code** içermelidir. Push için ayrıca **Commit to a task branch** de içermelidir.
3. İsteğe bağlı: bu atamada bir **Workspace repository** ve branch seçin. Session'lar bu durumda varsayılan olarak onu klonlar.

`repository_id`, GitHub'ın sayısal depo kimliğidir. Bunu `GET https://api.github.com/repos/{owner}/{repo}` isteğinden (`id` alanı) veya `github_list_repositories` aracından okuyabilirsiniz.

## Depoyu Session başına seçme {#choose-the-repository-per-session}

Session'ı oluştururken `github_workspace` gönderin:

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: fix-login-2026-11-18" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
    "github_workspace": {"repository_id": "1195090324", "ref": "main"},
    "input": "Fix the failing login test, push your change and open a pull request."
  }'
```

| Alan | Zorunlu | Anlamı |
|---|---|---|
| `repository_id` | Evet | Ondalık dize. Depo, Agent'ın o bağlantı için depo kapsamı içinde olmalıdır. |
| `ref` | Hayır | Checkout yapılacak branch. Varsayılan olarak deponun varsayılan branch'idir. |
| `connection_id` | Hayır | Hangi GitHub bağlantısının kullanılacağı. Varsayılan olarak çalışma alanı deposu olan atama veya Agent'ın tek GitHub bağlantısı kullanılır. |

`github_workspace` isteğe bağlıdır:

- Gönderilmezse veya `null` ise: ayarlanmışsa Session, Agent'ın çalışma alanı deposunu klonlar. Aksi halde hiçbir şey klonlanmaz ve Session her zamanki gibi başlar.
- Gönderilirse: yalnızca bu Session için Agent'ın varsayılanının yerini alır.

Her Session'ın en fazla bir çalışma alanı deposu olur. Seçim, Session oluşturulduğunda sabitlenir.

## Session'a neler sağlanır {#what-the-session-gets}

- `/workspace` içinde `ref` checkout'u; `origin` git proxy'sini gösterir. `git fetch`, `git pull` ve `git push` her zamanki gibi çalışır.
- `sandbase-agents[bot]` olarak yazılan commit'ler.
- `SANDBASE_GIT_BRANCH_PREFIX`, örneğin `agents/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/`.
- `SANDBASE_WORKSPACE_REPOSITORY`, deponun `owner/name` değeri.

## Push kuralları {#push-rules}

Agent yalnızca kendi önekinin altındaki branch'lere push edebilir:

```bash
git push origin HEAD:${SANDBASE_GIT_BRANCH_PREFIX}fix-login
```

- Aynı branch'e tekrar push edebilir; buna açık pull request'i olan bir branch de dahildir.
- Varsayılan branch'e, diğer branch'lere, diğer Session'ların öneklerine ve tag'lere yapılan push'lar GitHub'a ulaşmadan reddedilir. Git `sandbase: only agents/<session>/* branches can be pushed` mesajını gösterir.
- Proxy, GitHub Actions workflow dosyalarını değiştiremez.

Yalnızca Session'ın push ettiği bir branch, Session'ın branch'i olarak kabul edilir. `github_open_pull_request` aracı bu branch'i kabul eder; merge kapsamı yönetilen branch'lerle sınırlı bir bağlantı da aynı şekilde kabul eder.

## İzinler bağlantıyı izler {#permissions-follow-the-connection}

Her git isteği, Agent'ın mevcut atamasına ve bağlantının mevcut politikasına göre kontrol edilir.

- Bir yönetici depo kapsamını daraltırsa, sonraki fetch veya push reddedilir.
- Bir yönetici **Commit to a task branch** iznini kaldırırsa, sonraki push reddedilir.
- Bir yönetici bağlantıyı iptal ederse, sonraki fetch veya push reddedilir.

Her Session dakikada en fazla 120 git isteği yapabilir.

## Hatalar {#errors}

| Yanıt | Neden |
|---|---|
| `400 invalid_request` (`param: github_workspace`) | `repository_id` ondalık bir dize değil, `ref` düz bir branch adı değil, Agent'ın GitHub bağlantısı yok veya deponun varsayılan branch adı desteklenmiyor (`ref` değerini açıkça ayarlayın). |
| `400 invalid_request` | Agent'ın birden fazla GitHub bağlantısı var ve hiçbirinde çalışma alanı deposu yok. `connection_id` gönderin. |
| `403 insufficient_scope` | Depo veya bağlantı Agent'ın kapsamı dışında ya da Agent'ın araçları **Read code** içermiyor. |

## Sonraki adımlar {#next-steps}

- [Session çalıştırma](/agents/sessions)
- [Session oluşturma API referansı](/api-reference/sessions/create)
