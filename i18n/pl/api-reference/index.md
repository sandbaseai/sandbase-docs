---
i18nSource: 071e97a48f9c4f4c
title: Dokumentacja API
description: Wywołuj modele SandBase i zarządzaj Agents, Sessions, Skills, połączeniami MCP, Secrets oraz zasobami konta.
---

# Dokumentacja API {#api-reference}

Za pomocą API możesz wywoływać modele bezpośrednio albo definiować Agenty wielokrotnego użytku, uruchamiać je w Sessions i łączyć ze Skills oraz narzędziami MCP.

::: tip Szukasz inferencji modeli?
Kontrakty inferencji (Chat Completions, Responses, Anthropic Messages, Gemini, Images i wideo Seedance) znajdują się w sekcji **Model inference** tej dokumentacji. Pola i ceny poszczególnych modeli są na ich stronach w [katalogu Models](https://www.sandbase.ai/models).
:::

## Wybierz punkt wyjścia {#choose-a-starting-point}

| Cel | Zacznij od | Co dalej |
|---|---|---|
| Zdefiniowanie zachowania wielokrotnego użytku | [Agents](/api-reference/agents/) | Utwórz i wersjonuj konfigurację Agenta |
| Bezpośrednie uruchomienie Agenta | [Sessions](/api-reference/sessions/) | Wysyłaj wejście, strumieniuj zdarzenia i czytaj historię |
| Ponowne użycie pakietów instrukcji | [Skills](/api-reference/skills/) | Prześlij wersjonowane pakiety ZIP i dołącz je do Agentów |
| Wywoływanie zewnętrznych narzędzi | [Połączenia MCP](/api-reference/mcp-connections/) | Zarejestruj zdalne serwery MCP przez HTTPS dla Agentów |
| Uwierzytelnianie zewnętrznych narzędzi | [Secrets](/agents/api-credentials#with-the-api) | Przechowuj tokeny Bearer tylko do zapisu dla połączeń MCP |

## Cykl życia zasobów {#resource-lifecycle}

```text
Agent + version ─── direct ──→ Session ─→ events, items, turns
Agent ─ skills[] → Skill version      Agent ─ mcp_connections[] → MCP connection ─ secret_id → Secret
```

- **Agent** (`agt_`) to zapisana, wersjonowana konfiguracja; jego utworzenie nie powoduje wykonania.
- **Session** (`ses_`) uruchamia jedną wersję Agenta i zamraża jego Skills oraz połączenia MCP. Ścieżki Session znajdują się pod `/v1/agents/sessions`.
- **Skill** (`skl_`) to wersjonowany pakiet instrukcji. **Połączenie MCP** (`mcp_`) rejestruje zdalny serwer narzędzi, a **Secret** (`sec_`) przechowuje jego token Bearer.

## Konwencje zasobów platformy Agents {#conventions-for-agents-platform-resources}

Agents, Sessions, Skills, połączenia MCP i Secrets są udostępniane pod `https://api.sandbase.ai/v1` i podlegają tym samym zasadom:

- Uwierzytelniaj się za pomocą `Authorization: Bearer` lub `X-API-Key`. Zobacz [Uwierzytelnianie](/api-reference/authentication#agents-platform-resources).
- Treść żądania to ścisły JSON o rozmiarze do 1 MiB; nieznane pola zwracają 400.
- Zapisy tworzące połączenia MCP lub Secrets wymagają `Idempotency-Key`. Pozostałe zapisy go przyjmują.
- Optymistyczna kontrola współbieżności używa `row_version`: wyślij ostatnio odczytaną wartość, a w razie 409 odczytaj zasób ponownie.
- Agents, Sessions, elementy, tury i Skills używają paginacji kursorowej (`limit`, `after`, `order`; odpowiedzi zawierają `has_more` i `last_id`). Wersje Agentów, załączniki, połączenia MCP i Secrets używają paginacji z przesunięciem (`limit`, `offset`; odpowiedzi zawierają `total`).
- Błędy mają postać `{"error": {"type", "code", "param", "message"}}`. Zobacz [Błędy platformy Agents](/api-reference/errors#agents-platform-errors).

## Uwierzytelnianie {#authentication}

Wyślij klucz SandBase API jako token Bearer:

```http
Authorization: Bearer sk-YOUR_KEY
```

Traktuj klucz jako nieprzejrzysty sekret, przechowuj go na serwerze i nigdy nie umieszczaj go w kodzie przeglądarki ani w logach. Szczegóły zgodności opisuje strona [Uwierzytelnianie](/api-reference/authentication), a publiczne koperty błędów strona [Błędy](/api-reference/errors).

## Organizacja i użycie {#organization-and-usage}

Zasoby platformy należą do organizacji powiązanej z kluczem API. Za pomocą [Account API](/api-reference/account/) sprawdzisz obsługiwane saldo i widoki ostatniej historii wykonań. Administrowanie organizacją i zarządzanie rozliczeniami odbywa się w Console, chyba że opisano tu publiczny endpoint.

## Formaty dokumentacji {#reference-formats}

- Przeglądaj operacje z paska bocznego, aby zobaczyć przykłady i szczegóły odpowiedzi.
- Pobierz czytelną maszynowo [specyfikację OpenAPI](/openapi.yaml).
- Dokładne pola żądań znajdziesz na stronie modelu w [katalogu Models](https://www.sandbase.ai/models) lub na stronie API w [katalogu APIs](https://www.sandbase.ai/apis).

## Następne kroki {#next-steps}

- Jeśli dopiero zaczynasz z zarządzanymi Agentami: [Tworzenie Agenta](/agents/)
- Bezpośrednie wywołanie modelu: [Chat Completions](/api-reference/llm-gateway) lub [katalog Models](https://www.sandbase.ai/models)
