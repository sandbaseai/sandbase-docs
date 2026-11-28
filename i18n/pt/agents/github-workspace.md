---
i18nSource: e4dcecbecc736e53
title: Workspace com repositório do GitHub
description: Clone um repositório do GitHub no /workspace de uma Session, faça push para branches da Session e abra pull requests.
---

# Workspace com repositório do GitHub {#github-repository-workspace}

Uma Session pode começar com um repositório do GitHub já clonado em `/workspace`. O Agent trabalha no código com comandos `git` comuns, envia seus commits para branches reservadas à Session e pode abrir um pull request para revisão por uma pessoa.

O repositório é acessado pelo proxy git do SandBase. Nenhum token do GitHub entra na Session.

## Antes de começar {#before-you-start}

Um administrador da organização configura isso uma única vez no console:

1. Conecte o GitHub em **Console → Integrations** e escolha os repositórios que a conexão pode usar.
2. Atribua a conexão ao Agent na seção **Integrations** do Agent. As ferramentas do Agent para essa conexão precisam incluir **Read code** para clonar. Para fazer push, elas também precisam incluir **Commit to a task branch**.
3. Opcional: escolha um **Workspace repository** e uma branch nessa atribuição. As Sessions passam a cloná-lo por padrão.

O `repository_id` é o ID numérico do repositório no GitHub. Você pode obtê-lo em `GET https://api.github.com/repos/{owner}/{repo}` (o campo `id`) ou pela ferramenta `github_list_repositories`.

## Escolha o repositório por Session {#choose-the-repository-per-session}

Envie `github_workspace` ao criar a Session:

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

| Campo | Obrigatório | Significado |
|---|---|---|
| `repository_id` | Sim | String decimal. O repositório precisa estar dentro do escopo de repositórios do Agent para essa conexão. |
| `ref` | Não | Branch a ser feito checkout. O padrão é a branch padrão do repositório. |
| `connection_id` | Não | Qual conexão do GitHub usar. O padrão é a atribuição que tem um repositório de workspace ou a única conexão do GitHub do Agent. |

`github_workspace` é opcional:

- Omitido ou `null`: a Session clona o repositório de workspace do Agent, se houver um definido. Caso contrário, nada é clonado e a Session começa normalmente.
- Enviado: substitui o padrão do Agent apenas para esta Session.

Cada Session tem no máximo um repositório de workspace. A escolha é fixada quando a Session é criada.

## O que a Session recebe {#what-the-session-gets}

- Um checkout de `ref` em `/workspace`, com `origin` apontando para o proxy git. `git fetch`, `git pull` e `git push` funcionam normalmente.
- Commits com autoria de `sandbase-agents[bot]`.
- `SANDBASE_GIT_BRANCH_PREFIX`, por exemplo `agents/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/`.
- `SANDBASE_WORKSPACE_REPOSITORY`, o `owner/name` do repositório.

## Regras de push {#push-rules}

O Agent só pode fazer push para branches sob o próprio prefixo:

```bash
git push origin HEAD:${SANDBASE_GIT_BRANCH_PREFIX}fix-login
```

- Ele pode fazer push para a mesma branch novamente, inclusive uma branch que já tem um pull request aberto.
- Pushes para a branch padrão, para outras branches, para prefixos de outras Sessions e para tags são rejeitados antes de chegar ao GitHub. O Git mostra `sandbase: only agents/<session>/* branches can be pushed`.
- O proxy não pode alterar arquivos de workflow do GitHub Actions.

Somente uma branch que a Session enviou é tratada como branch da Session. A ferramenta `github_open_pull_request` a aceita, assim como uma conexão cujo escopo de merge é limitado a branches gerenciadas.

## As permissões seguem a conexão {#permissions-follow-the-connection}

Cada requisição git é verificada em relação à atribuição atual do Agent e à política atual da conexão.

- Se um administrador restringir o escopo de repositórios, o próximo fetch ou push é recusado.
- Se um administrador remover **Commit to a task branch**, o próximo push é recusado.
- Se um administrador revogar a conexão, o próximo fetch ou push é recusado.

Cada Session pode fazer até 120 requisições git por minuto.

## Erros {#errors}

| Resposta | Causa |
|---|---|
| `400 invalid_request` (`param: github_workspace`) | `repository_id` não é uma string decimal, `ref` não é um nome de branch simples, o Agent não tem conexão do GitHub ou o nome da branch padrão do repositório não é suportado (defina `ref` explicitamente). |
| `400 invalid_request` | O Agent tem várias conexões do GitHub e nenhuma delas tem um repositório de workspace. Envie `connection_id`. |
| `403 insufficient_scope` | O repositório ou a conexão está fora do escopo do Agent, ou as ferramentas do Agent não incluem **Read code**. |

## Próximos passos {#next-steps}

- [Executar Sessions](/agents/sessions)
- [Referência da API Create Session](/api-reference/sessions/create)
