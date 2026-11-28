---
i18nSource: e4dcecbecc736e53
title: GitHub-Repository als Workspace
description: Klone ein GitHub-Repository in das /workspace einer Session, pushe auf Session-Branches und öffne Pull Requests.
---

# GitHub-Repository als Workspace {#github-repository-workspace}

Eine Session kann mit einem GitHub-Repository starten, das bereits nach `/workspace` geklont ist. Der Agent arbeitet mit gewöhnlichen `git`-Befehlen am Code, pusht seine Commits auf Branches, die für die Session reserviert sind, und kann einen Pull Request öffnen, den eine Person reviewt.

Das Repository wird über den Git-Proxy von SandBase erreicht. Kein GitHub-Token gelangt in die Session.

## Bevor du beginnst {#before-you-start}

Ein Organisationsadministrator richtet das einmalig in der Console ein:

1. GitHub unter **Console → Integrations** verbinden und die Repositories auswählen, die die Verbindung verwenden darf.
2. Die Verbindung im Abschnitt **Integrations** des Agents dem Agent zuweisen. Die Tools des Agents für diese Verbindung müssen **Read code** enthalten, damit geklont werden kann. Für Pushes müssen sie außerdem **Commit to a task branch** enthalten.
3. Optional: In dieser Zuweisung ein **Workspace repository** und einen Branch auswählen. Sessions klonen es dann standardmäßig.

Die `repository_id` ist die numerische Repository-ID von GitHub. Du findest sie über `GET https://api.github.com/repos/{owner}/{repo}` (das Feld `id`) oder über das Tool `github_list_repositories`.

## Repository pro Session wählen {#choose-the-repository-per-session}

Sende `github_workspace`, wenn du die Session erstellst:

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

| Feld | Pflicht | Bedeutung |
|---|---|---|
| `repository_id` | Ja | Dezimal-String. Das Repository muss im Repository-Scope des Agents für diese Verbindung liegen. |
| `ref` | Nein | Branch, der ausgecheckt wird. Standard ist der Default-Branch des Repositorys. |
| `connection_id` | Nein | Welche GitHub-Verbindung verwendet wird. Standard ist die Zuweisung mit einem Workspace-Repository oder die einzige GitHub-Verbindung des Agents. |

`github_workspace` ist optional:

- Weggelassen oder `null`: Die Session klont das Workspace-Repository des Agents, sofern eines festgelegt ist. Andernfalls wird nichts geklont, und die Session startet wie gewohnt.
- Gesendet: Es ersetzt den Standard des Agents nur für diese Session.

Jede Session hat höchstens ein Workspace-Repository. Die Auswahl wird beim Erstellen der Session festgelegt.

## Was die Session erhält {#what-the-session-gets}

- Einen Checkout von `ref` in `/workspace`, wobei `origin` auf den Git-Proxy zeigt. `git fetch`, `git pull` und `git push` funktionieren wie gewohnt.
- Commits mit `sandbase-agents[bot]` als Autor.
- `SANDBASE_GIT_BRANCH_PREFIX`, zum Beispiel `agents/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/`.
- `SANDBASE_WORKSPACE_REPOSITORY`, das `owner/name` des Repositorys.

## Push-Regeln {#push-rules}

Der Agent kann nur auf Branches unter seinem eigenen Präfix pushen:

```bash
git push origin HEAD:${SANDBASE_GIT_BRANCH_PREFIX}fix-login
```

- Er kann erneut auf denselben Branch pushen, auch auf einen Branch, der bereits einen offenen Pull Request hat.
- Pushes auf den Default-Branch, andere Branches, Präfixe anderer Sessions und Tags werden abgelehnt, bevor sie GitHub erreichen. Git zeigt `sandbase: only agents/<session>/* branches can be pushed`.
- Der Proxy kann keine Workflow-Dateien von GitHub Actions ändern.

Nur ein Branch, den die Session gepusht hat, gilt als Branch der Session. Das Tool `github_open_pull_request` akzeptiert ihn, ebenso eine Verbindung, deren Merge-Scope auf verwaltete Branches beschränkt ist.

## Berechtigungen folgen der Verbindung {#permissions-follow-the-connection}

Jede Git-Anfrage wird gegen die aktuelle Zuweisung des Agents und die aktuelle Richtlinie der Verbindung geprüft.

- Wenn ein Administrator den Repository-Scope einschränkt, wird der nächste Fetch oder Push abgelehnt.
- Wenn ein Administrator **Commit to a task branch** entfernt, wird der nächste Push abgelehnt.
- Wenn ein Administrator die Verbindung widerruft, wird der nächste Fetch oder Push abgelehnt.

Jede Session kann bis zu 120 Git-Anfragen pro Minute stellen.

## Fehler {#errors}

| Antwort | Ursache |
|---|---|
| `400 invalid_request` (`param: github_workspace`) | `repository_id` ist kein Dezimal-String, `ref` ist kein einfacher Branch-Name, der Agent hat keine GitHub-Verbindung, oder der Name des Default-Branches wird nicht unterstützt (setze `ref` explizit). |
| `400 invalid_request` | Der Agent hat mehrere GitHub-Verbindungen, und keine davon hat ein Workspace-Repository. Sende `connection_id`. |
| `403 insufficient_scope` | Das Repository oder die Verbindung liegt außerhalb des Scopes des Agents, oder die Tools des Agents enthalten **Read code** nicht. |

## Nächste Schritte {#next-steps}

- [Sessions ausführen](/agents/sessions)
- [API-Referenz: Session erstellen](/api-reference/sessions/create)
