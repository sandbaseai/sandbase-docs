---
i18nSource: e4dcecbecc736e53
title: Espace de travail de dépôt GitHub
description: Clonez un dépôt GitHub dans le /workspace d'une Session, poussez vers les branches de la Session et ouvrez des pull requests.
---

# Espace de travail de dépôt GitHub {#github-repository-workspace}

Une Session peut démarrer avec un dépôt GitHub déjà cloné dans `/workspace`. L'Agent travaille sur le code avec des commandes `git` ordinaires, pousse ses commits vers des branches réservées à la Session et peut ouvrir une pull request qu'une personne relira.

Le dépôt est accessible via le proxy git de SandBase. Aucun jeton GitHub n'entre dans la Session.

## Avant de commencer {#before-you-start}

Un administrateur de l'organisation effectue cette configuration une seule fois dans la console :

1. Connectez GitHub sous **Console → Integrations** et choisissez les dépôts que la connexion peut utiliser.
2. Attribuez la connexion à l'Agent dans la section **Integrations** de l'Agent. Les outils de l'Agent pour cette connexion doivent inclure **Read code** pour cloner. Pour pousser, ils doivent aussi inclure **Commit to a task branch**.
3. Facultatif : choisissez un **Workspace repository** et une branche sur cette attribution. Les Sessions le clonent alors par défaut.

Le `repository_id` est l'ID numérique du dépôt sur GitHub. Vous pouvez le lire depuis `GET https://api.github.com/repos/{owner}/{repo}` (le champ `id`) ou avec l'outil `github_list_repositories`.

## Choisir le dépôt pour chaque Session {#choose-the-repository-per-session}

Envoyez `github_workspace` lorsque vous créez la Session :

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

| Champ | Obligatoire | Signification |
|---|---|---|
| `repository_id` | Oui | Chaîne décimale. Le dépôt doit faire partie du périmètre de dépôts de l'Agent pour cette connexion. |
| `ref` | Non | Branche à extraire. Par défaut, la branche par défaut du dépôt. |
| `connection_id` | Non | Connexion GitHub à utiliser. Par défaut, l'attribution qui possède un dépôt d'espace de travail, ou la seule connexion GitHub de l'Agent. |

`github_workspace` est facultatif :

- Omis ou `null` : la Session clone le dépôt d'espace de travail de l'Agent, s'il est défini. Sinon, rien n'est cloné et la Session démarre normalement.
- Envoyé : il remplace la valeur par défaut de l'Agent pour cette Session uniquement.

Chaque Session a au plus un dépôt d'espace de travail. Ce choix est fixé à la création de la Session.

## Ce que reçoit la Session {#what-the-session-gets}

- Une extraction de `ref` dans `/workspace`, avec `origin` pointant vers le proxy git. `git fetch`, `git pull` et `git push` fonctionnent normalement.
- Des commits dont l'auteur est `sandbase-agents[bot]`.
- `SANDBASE_GIT_BRANCH_PREFIX`, par exemple `agents/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/`.
- `SANDBASE_WORKSPACE_REPOSITORY`, le `owner/name` du dépôt.

## Règles de push {#push-rules}

L'Agent ne peut pousser que vers des branches situées sous son propre préfixe :

```bash
git push origin HEAD:${SANDBASE_GIT_BRANCH_PREFIX}fix-login
```

- Il peut pousser de nouveau vers la même branche, y compris une branche qui a déjà une pull request ouverte.
- Les pushes vers la branche par défaut, d'autres branches, les préfixes d'autres Sessions et les tags sont rejetés avant d'atteindre GitHub. Git affiche `sandbase: only agents/<session>/* branches can be pushed`.
- Le proxy ne peut pas modifier les fichiers de workflow GitHub Actions.

Seule une branche poussée par la Session est considérée comme une branche de la Session. L'outil `github_open_pull_request` l'accepte, tout comme une connexion dont le périmètre de fusion est limité aux branches gérées.

## Les permissions suivent la connexion {#permissions-follow-the-connection}

Chaque requête git est vérifiée par rapport à l'attribution actuelle de l'Agent et à la politique actuelle de la connexion.

- Si un administrateur réduit le périmètre de dépôts, le fetch ou le push suivant est refusé.
- Si un administrateur retire **Commit to a task branch**, le push suivant est refusé.
- Si un administrateur révoque la connexion, le fetch ou le push suivant est refusé.

Chaque Session peut effectuer jusqu'à 120 requêtes git par minute.

## Erreurs {#errors}

| Réponse | Cause |
|---|---|
| `400 invalid_request` (`param: github_workspace`) | `repository_id` n'est pas une chaîne décimale, `ref` n'est pas un simple nom de branche, l'Agent n'a pas de connexion GitHub, ou le nom de la branche par défaut du dépôt n'est pas pris en charge (définissez `ref` explicitement). |
| `400 invalid_request` | L'Agent a plusieurs connexions GitHub et aucune n'a de dépôt d'espace de travail. Envoyez `connection_id`. |
| `403 insufficient_scope` | Le dépôt ou la connexion est hors du périmètre de l'Agent, ou les outils de l'Agent n'incluent pas **Read code**. |

## Étapes suivantes {#next-steps}

- [Exécuter des Sessions](/agents/sessions)
- [Référence de l'API Create Session](/api-reference/sessions/create)
