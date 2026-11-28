---
i18nSource: e4dcecbecc736e53
title: Obszar roboczy z repozytorium GitHub
description: Sklonuj repozytorium GitHub do /workspace w Session, wypychaj do gałęzi Session i otwieraj pull requesty.
---

# Obszar roboczy z repozytorium GitHub {#github-repository-workspace}

Session może wystartować z repozytorium GitHub już sklonowanym do `/workspace`. Agent pracuje na kodzie za pomocą zwykłych poleceń `git`, wypycha swoje commity do gałęzi zarezerwowanych dla Session i może otworzyć pull request do przeglądu przez człowieka.

Dostęp do repozytorium odbywa się przez proxy git SandBase. Żaden token GitHub nie trafia do Session.

## Zanim zaczniesz {#before-you-start}

Administrator organizacji konfiguruje to jednorazowo w konsoli:

1. Połącz GitHub w **Console → Integrations** i wybierz repozytoria, z których może korzystać połączenie.
2. Przypisz połączenie do Agent w sekcji **Integrations** Agenta. Narzędzia Agenta dla tego połączenia muszą obejmować **Read code**, aby klonować. Aby wypychać, muszą też obejmować **Commit to a task branch**.
3. Opcjonalnie: wybierz **Workspace repository** i gałąź w tym przypisaniu. Sessions będą je wtedy domyślnie klonować.

`repository_id` to liczbowy identyfikator repozytorium w GitHub. Możesz go odczytać z `GET https://api.github.com/repos/{owner}/{repo}` (pole `id`) lub z narzędzia `github_list_repositories`.

## Wybór repozytorium dla Session {#choose-the-repository-per-session}

Wyślij `github_workspace` podczas tworzenia Session:

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

| Pole | Wymagane | Znaczenie |
|---|---|---|
| `repository_id` | Tak | Ciąg cyfr dziesiętnych. Repozytorium musi mieścić się w zakresie repozytoriów Agenta dla tego połączenia. |
| `ref` | Nie | Gałąź do pobrania. Domyślnie gałąź domyślna repozytorium. |
| `connection_id` | Nie | Które połączenie GitHub użyć. Domyślnie przypisanie z repozytorium obszaru roboczego lub jedyne połączenie GitHub Agenta. |

`github_workspace` jest opcjonalne:

- Pominięte lub `null`: Session klonuje repozytorium obszaru roboczego Agenta, jeśli jest ustawione. W przeciwnym razie nic nie jest klonowane, a Session startuje normalnie.
- Wysłane: zastępuje domyślne ustawienie Agenta tylko dla tej Session.

Każda Session ma najwyżej jedno repozytorium obszaru roboczego. Wybór jest ustalany przy tworzeniu Session.

## Co otrzymuje Session {#what-the-session-gets}

- Kopię roboczą `ref` w `/workspace`, z `origin` wskazującym na proxy git. `git fetch`, `git pull` i `git push` działają jak zwykle.
- Commity z autorem `sandbase-agents[bot]`.
- `SANDBASE_GIT_BRANCH_PREFIX`, na przykład `agents/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/`.
- `SANDBASE_WORKSPACE_REPOSITORY`, czyli `owner/name` repozytorium.

## Zasady wypychania {#push-rules}

Agent może wypychać tylko do gałęzi pod własnym prefiksem:

```bash
git push origin HEAD:${SANDBASE_GIT_BRANCH_PREFIX}fix-login
```

- Może ponownie wypychać do tej samej gałęzi, także takiej, która ma już otwarty pull request.
- Wypchnięcia do gałęzi domyślnej, innych gałęzi, prefiksów innych Sessions oraz tagów są odrzucane, zanim dotrą do GitHub. Git wyświetla `sandbase: only agents/<session>/* branches can be pushed`.
- Proxy nie może zmieniać plików workflow GitHub Actions.

Tylko gałąź wypchnięta przez Session jest traktowana jako gałąź tej Session. Akceptuje ją narzędzie `github_open_pull_request`, a także połączenie, którego zakres scalania jest ograniczony do zarządzanych gałęzi.

## Uprawnienia wynikają z połączenia {#permissions-follow-the-connection}

Każde żądanie git jest sprawdzane względem bieżącego przypisania Agenta i bieżącej polityki połączenia.

- Jeśli administrator zawęzi zakres repozytoriów, następne pobranie lub wypchnięcie zostanie odrzucone.
- Jeśli administrator usunie **Commit to a task branch**, następne wypchnięcie zostanie odrzucone.
- Jeśli administrator unieważni połączenie, następne pobranie lub wypchnięcie zostanie odrzucone.

Każda Session może wykonać do 120 żądań git na minutę.

## Błędy {#errors}

| Odpowiedź | Przyczyna |
|---|---|
| `400 invalid_request` (`param: github_workspace`) | `repository_id` nie jest ciągiem cyfr dziesiętnych, `ref` nie jest zwykłą nazwą gałęzi, Agent nie ma połączenia GitHub lub nazwa gałęzi domyślnej repozytorium nie jest obsługiwana (ustaw `ref` jawnie). |
| `400 invalid_request` | Agent ma kilka połączeń GitHub i żadne z nich nie ma repozytorium obszaru roboczego. Wyślij `connection_id`. |
| `403 insufficient_scope` | Repozytorium lub połączenie jest poza zakresem Agenta albo narzędzia Agenta nie obejmują **Read code**. |

## Następne kroki {#next-steps}

- [Uruchamianie Sessions](/agents/sessions)
- [Dokumentacja API tworzenia Session](/api-reference/sessions/create)
