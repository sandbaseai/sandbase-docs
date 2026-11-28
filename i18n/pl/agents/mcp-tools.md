---
i18nSource: 417ea5dc930a8786
title: Skills i narzędzia MCP
description: Daj Agentowi SandBase Skills wielokrotnego użytku i zdalne narzędzia MCP oraz kontroluj, których wersji i narzędzi używa każda Session.
---

# Skills i narzędzia MCP {#skills-and-mcp-tools}

Agent zyskuje możliwości na dwa sposoby:

- **Skills** uczą Agenta, jak wykonać zadanie. Skill to wersjonowany pakiet ZIP z instrukcjami i zasobami.
- **Połączenia MCP** pozwalają Agentowi wywoływać narzędzia na zdalnym serwerze MCP przez HTTPS, opcjonalnie z uwierzytelnianiem za pomocą [Secret](/agents/api-credentials).

Najbardziej przydatne Agents łączą oba sposoby: serwer MCP pobiera dane lub wykonuje działania, a Skill opisuje, jak korzystać z wyników.

## Skills {#skills}

1. Przygotuj folder zawierający `SKILL.md` z frontmatterem `name` i `description`, a następnie spakuj sam folder (`zip -r release-notes.zip release-notes/`, maksymalnie 5 MiB). Archiwum ZIP musi zawierać ten folder na najwyższym poziomie; `SKILL.md` w katalogu głównym ZIP zwraca `400 invalid_request`.
2. Prześlij go przez `POST /v1/skills` jako pole multipart `files`. Odpowiedź zawiera identyfikator `skl_` oraz `default_version: "1"`.
3. Odwołaj się do niego w tablicy `skills` Agenta.

```json
{
  "skills": [
    { "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null }
  ]
}
```

- Przy pierwszym dołączeniu `"version": null` wskazuje bieżącą `default_version` Skilla w momencie zapisu Agenta. Ciąg znaków, np. `"2"`, jawnie wybiera tę wersję.
- Zapisany Agent przypina wersję. Zmiana wersji domyślnej Skilla nie aktualizuje istniejących Agents ani ich nowych Sessions. Aby zaktualizować, zaktualizuj Agenta z jawną wersją; wysłanie `null` dla istniejącego powiązania zachowuje przypiętą wersję.
- Nową wersję prześlesz przez `POST /v1/skills/{skill_id}/versions`, a wersję domyślną zmienisz przez `default=true` lub `POST /v1/skills/{skill_id}`.
- Wyłączony Skill powoduje, że nowe Sessions Agents, które się do niego odwołują, kończą się błędem `400 skill_not_found`.

Publiczne Skills możesz też przeglądać w [katalogu Skills](/api-reference/skills/catalog). Pełny przewodnik znajdziesz w [Skills API](/api-reference/skills/).

## Wbudowane narzędzia SandBase {#built-in-sandbase-tools}

Każdy nowy Agent może bez konfiguracji korzystać z własnych narzędzi SandBase. Za pomocą `sandbase_discover`, `sandbase_inspect` i `sandbase_run` Agent znajduje model lub API w katalogu, odczytuje jego schemat i cenę oraz wywołuje go z Twoim kluczem. Gdy pominiesz `mcp_connections` przy tworzeniu, Agent otrzyma tę wartość domyślną:

```json
{
  "mcp_connections": [
    {
      "connection_id": "builtin:sandbase",
      "server_label": "sandbase_builtin",
      "allowed_tools": null,
      "required": true
    }
  ]
}
```

- **Wysłana lista zastępuje wartość domyślną.** Aby dodać własny serwer MCP i zachować narzędzia SandBase, umieść na liście wbudowany wpis.
- **`builtin:sandbase` wymaga `server_label: "sandbase_builtin"`.** Każda inna etykieta albo ta etykieta przy innym połączeniu zwraca `400`.
- **Aby utworzyć Agenta bez narzędzi,** wyślij `"mcp_connections": []`.
- **Wbudowane narzędzia są bezpłatne.** Płacisz tylko za modele i API, które Agent przez nie wywołuje.

## Połączenia MCP {#mcp-connections}

1. Jeśli serwer MCP wymaga tokena Bearer, [utwórz Secret](/agents/api-credentials) dla jego dokładnego URL.
2. Zarejestruj serwer przez `POST /v1/mcp-connections`:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/mcp-connections \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Idempotency-Key: github-mcp" \
     -H "Content-Type: application/json" \
     -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
   ```

3. Odwołaj się do połączenia w tablicy `mcp_connections` Agenta:

   ```json
   {
     "mcp_connections": [
       {
         "connection_id": "mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13",
         "server_label": "github",
         "allowed_tools": ["search_issues", "get_issue"],
         "required": true
       }
     ]
   }
   ```

| Pole | Znaczenie |
|---|---|
| `connection_id` | Identyfikator połączenia `mcp_` w Twojej organizacji lub `builtin:sandbase` dla wbudowanego serwera SandBase |
| `server_label` | Zaczyna się od litery; litery, cyfry, `_` i `-`; do 64 znaków; unikalna w obrębie Agenta |
| `allowed_tools` | Pominięcie lub `null` zezwala na każde narzędzie oferowane przez serwer; `[]` nie zezwala na żadne; lista zezwala tylko na podane nazwy (do 256 nazw, każda niepusta i maksymalnie 128 bajtów) |
| `required` | Czy Session musi załadować ten serwer |

Agent może odwoływać się do maksymalnie 32 połączeń. Połączenia organizacji muszą mieć status `active` w chwili uruchomienia Session.

### Wbudowane narzędzia SandBase {#built-in-sandbase-tools-1}

Utworzenie Agenta bez `mcp_connections` wybiera wbudowany serwer SandBase. Aby jawnie zachować go obok własnego serwera, umieść w tablicy ten wpis:

```json
{
  "connection_id": "builtin:sandbase",
  "server_label": "sandbase_builtin",
  "allowed_tools": null,
  "required": true
}
```

Jawna tablica zastępuje cały wybór; powyższy przykład zawierający tylko własny serwer wyklucza serwer wbudowany. Wyślij `[]`, aby wyłączyć wszystkie narzędzia MCP. Pominięcie pola przy aktualizacji Agenta zachowuje istniejący wybór; `null` zwraca `400`. Wbudowany wpis nie wymaga tworzenia połączenia MCP ani Secret. Nie wysyłaj wycofanego pola `use_sandbase_mcp`.

::: info Różnica względem OpenAI
Agents API od OpenAI deklaruje serwery MCP bezpośrednio jako `tools: [{"type": "mcp", ...}]`. SandBase zwraca `400` dla tej formy: zarejestruj serwer jako zasób połączenia i odwołaj się do niego w `mcp_connections`. OpenAI SDK nie ma metod dla `/v1/mcp-connections` ani `/v1/secrets`, więc wywołuj je przez `client.post(...)` i przekazuj `mcp_connections` przez `extra_body` (Python) lub treść żądania (Node.js). Zobacz [Zgodność z OpenAI](/agents/openai-compatibility#mcp-connections-with-the-sdk).
:::

## Zmiany a działające Sessions {#changes-and-running-sessions}

Każda Session zamraża wersję Agenta, wersje Skills i konfigurację połączeń MCP w chwili uruchomienia.

- Po zastąpieniu połączenia lub rotacji jego Secret nowe Sessions używają nowej konfiguracji; istniejące Sessions zachowują swoją migawkę.
- Wyłączenie połączenia lub unieważnienie jego Secret blokuje nowe Sessions i odrzuca dalsze wejście do istniejących Sessions, które z niego korzystają. Wywołanie narzędzia, które już trwa, nie jest przerywane.

## Nie umieszczaj tokenów w promptach {#keep-tokens-out-of-prompts}

Przechowuj tokeny jako Secrets. Nie umieszczaj ich w instrukcjach, wejściu Session, metadanych ani pakietach Skills: każdy, kto ma dostęp do Agenta lub Session, może je odczytać.

## Następne kroki {#next-steps}

- [Poświadczenia dla narzędzi MCP](/agents/api-credentials)
- [MCP Connections API](/api-reference/mcp-connections/)
- [Skills API](/api-reference/skills/)
- [Definiowanie Agenta](/agents/agent-api)
