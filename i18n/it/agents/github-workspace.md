---
i18nSource: e4dcecbecc736e53
title: Workspace con repository GitHub
description: Clona un repository GitHub nella /workspace di una Session, fai push sui branch della Session e apri pull request.
---

# Workspace con repository GitHub {#github-repository-workspace}

Una Session può partire con un repository GitHub già clonato in `/workspace`. L'Agent lavora sul codice con normali comandi `git`, fa push dei suoi commit su branch riservati alla Session e può aprire una pull request da far revisionare a una persona.

Il repository viene raggiunto tramite il git proxy di SandBase. Nessun token GitHub entra nella Session.

## Prima di iniziare {#before-you-start}

Un amministratore dell'organizzazione lo configura una sola volta nella console:

1. Collega GitHub in **Console → Integrations** e scegli i repository che la connessione può usare.
2. Assegna la connessione all'Agent nella sezione **Integrations** dell'Agent. I tool dell'Agent per questa connessione devono includere **Read code** per clonare. Per fare push, devono includere anche **Commit to a task branch**.
3. Facoltativo: scegli un **Workspace repository** e un branch su quell'assegnazione. Le Session lo cloneranno per impostazione predefinita.

`repository_id` è l'ID numerico del repository su GitHub. Puoi leggerlo da `GET https://api.github.com/repos/{owner}/{repo}` (il campo `id`) oppure dal tool `github_list_repositories`.

## Scegliere il repository per ogni Session {#choose-the-repository-per-session}

Invia `github_workspace` quando crei la Session:

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

| Campo | Obbligatorio | Significato |
|---|---|---|
| `repository_id` | Sì | Stringa decimale. Il repository deve rientrare nell'ambito dei repository dell'Agent per quella connessione. |
| `ref` | No | Branch su cui fare checkout. Per impostazione predefinita è il branch predefinito del repository. |
| `connection_id` | No | Connessione GitHub da usare. Per impostazione predefinita è l'assegnazione che ha un workspace repository, oppure l'unica connessione GitHub dell'Agent. |

`github_workspace` è facoltativo:

- Omesso o `null`: la Session clona il workspace repository dell'Agent, se impostato. Altrimenti non viene clonato nulla e la Session parte normalmente.
- Inviato: sostituisce il valore predefinito dell'Agent solo per questa Session.

Ogni Session ha al massimo un workspace repository. La scelta viene fissata alla creazione della Session.

## Cosa riceve la Session {#what-the-session-gets}

- Un checkout di `ref` in `/workspace`, con `origin` che punta al git proxy. `git fetch`, `git pull` e `git push` funzionano come al solito.
- Commit con autore `sandbase-agents[bot]`.
- `SANDBASE_GIT_BRANCH_PREFIX`, ad esempio `agents/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/`.
- `SANDBASE_WORKSPACE_REPOSITORY`, cioè `owner/name` del repository.

## Regole di push {#push-rules}

L'Agent può fare push solo su branch sotto il proprio prefisso:

```bash
git push origin HEAD:${SANDBASE_GIT_BRANCH_PREFIX}fix-login
```

- Può fare push di nuovo sullo stesso branch, anche su un branch che ha già una pull request aperta.
- I push sul branch predefinito, su altri branch, sui prefissi di altre Session e sui tag vengono rifiutati prima di raggiungere GitHub. Git mostra `sandbase: only agents/<session>/* branches can be pushed`.
- Il proxy non può modificare i file di workflow di GitHub Actions.

Solo un branch su cui la Session ha fatto push viene considerato branch della Session. Il tool `github_open_pull_request` lo accetta, così come una connessione il cui ambito di merge è limitato ai branch gestiti.

## I permessi seguono la connessione {#permissions-follow-the-connection}

Ogni richiesta git viene verificata rispetto all'assegnazione attuale dell'Agent e alla policy attuale della connessione.

- Se un amministratore restringe l'ambito dei repository, il fetch o il push successivo viene rifiutato.
- Se un amministratore rimuove **Commit to a task branch**, il push successivo viene rifiutato.
- Se un amministratore revoca la connessione, il fetch o il push successivo viene rifiutato.

Ogni Session può effettuare fino a 120 richieste git al minuto.

## Errori {#errors}

| Risposta | Causa |
|---|---|
| `400 invalid_request` (`param: github_workspace`) | `repository_id` non è una stringa decimale, `ref` non è un semplice nome di branch, l'Agent non ha una connessione GitHub oppure il nome del branch predefinito del repository non è supportato (imposta `ref` esplicitamente). |
| `400 invalid_request` | L'Agent ha più connessioni GitHub e nessuna ha un workspace repository. Invia `connection_id`. |
| `403 insufficient_scope` | Il repository o la connessione sono fuori dall'ambito dell'Agent, oppure i tool dell'Agent non includono **Read code**. |

## Passaggi successivi {#next-steps}

- [Eseguire le Session](/agents/sessions)
- [Riferimento API Create Session](/api-reference/sessions/create)
