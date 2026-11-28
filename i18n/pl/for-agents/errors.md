---
i18nSource: 95410ff7ea741f64
title: Przewodnik po błędach dla AI
description: Obsługuj błędy API SandBase według rodziny endpointów, statusu HTTP, bezpieczeństwa ponowień i udokumentowanego kształtu odpowiedzi.
---

# Obsługa błędów dla klientów AI {#error-handling-for-ai-clients}

SandBase nie udostępnia jednego uniwersalnego schematu błędów. Najpierw rozgałęziaj logikę według statusu HTTP, a potem parsuj kształt odpowiedzi
opisany dla danej rodziny endpointów. Nie zakładaj, że każda odpowiedź zawiera `code`, `param`, `request_id` lub
konkretny komunikat.

## Publiczne kształty odpowiedzi {#public-response-shapes}

Główne middleware `/v1/*` oraz kilka endpointów modeli i zasobów zwraca płaski błąd:

```json
{"error":"organization rate limit exceeded"}
```

Zasoby platformy Agents (`/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`,
`/v1/skills*`) zwracają obiekt w stylu OpenAI ze stabilnym `code`. Zobacz [Błędy platformy Agents](#agents-platform-errors):

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

Bramy zgodne z OpenAI zachowują kopertę zgodną z OpenAI. `POST /v1/messages` zachowuje
kopertę zgodną z Anthropic:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

## Obsługa statusów HTTP {#http-status-handling}

| Status | Znaczenie | Działanie klienta |
|---|---|---|
| `400` | Nieprawidłowe wejście lub nieobsługiwany parametr | Popraw żądanie zgodnie ze schematem wybranego endpointu i modelu. |
| `401` | Brakujące, nieprawidłowe, unieważnione lub wygasłe poświadczenie | Zastąp lub zrotuj poświadczenie; nie ponawiaj bez zmian. |
| `402` | Żądania nie można sfinansować lub osiągnięto limit wydatków | Przed ponowieniem rozwiąż kwestię rozliczeń lub limitów klucza. |
| `403` | Poświadczenie nie ma uprawnień lub warstwa zgodności mapuje błąd wydatków na 403 | Sprawdź udokumentowaną kopertę i użyj uprawnionego klucza. |
| `404` | Nie znaleziono modelu lub zasobu | Zweryfikuj bieżącą nazwę modelu lub identyfikator zasobu. |
| `409` | Konflikt stanu zasobu | Odczytaj najnowszy stan zasobu, zanim zdecydujesz, czy ponowienie jest bezpieczne. |
| `429` | Limit żądań organizacji lub limit równoległości wideo | Ponawiaj z ograniczonym wykładniczym wycofaniem i losowym rozrzutem (jitter). |
| `500`, `502`, `503`, `504` | Przejściowa awaria SandBase lub usługi upstream | Ponawiaj tylko wtedy, gdy operację można bezpiecznie powtórzyć. |

## Komunikaty uwierzytelniania i limitów żądań {#authentication-and-rate-limit-messages}

Udokumentowane komunikaty uwierzytelniania to m.in.:

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

Klucz z ograniczonym zakresem użyty poza tym zakresem zwraca zamiast tego `403` z zagnieżdżoną treścią: `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`. Zasoby platformy Agents zwracają ten sam `code` we własnej kopercie.

Udokumentowany komunikat limitu żądań to `organization rate limit exceeded` (przypisany organizacji limit żądań na minutę,
współdzielony przez wszystkie jej klucze API). Odpowiedź `429` nie zawiera obecnie nagłówków `Retry-After` ani
`X-RateLimit-*` i nie ma opublikowanej uniwersalnej domyślnej wartości RPM ani równoległości.

## Wyszukiwanie modeli i zasobów {#model-and-resource-lookup}

Użyj `GET /v1/models`, aby poznać identyfikatory włączonych modeli, oraz `GET /v1/models/{id_or_name}`, aby sprawdzić model przed
wykonaniem. Traktuj identyfikator zasobu jako nieprzezroczysty i weryfikuj go odpowiednią operacją list lub get. Nie buduj
innego URL odpytywania na podstawie prefiksu identyfikatora.

## Algorytm ponawiania {#retry-algorithm}

Używaj ograniczonego wykładniczego wycofania z losowym rozrzutem:

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

Stosuj te zasady:

- ponawiaj `429` po opóźnieniu obliczonym przez klienta;
- ponawiaj przejściowe odpowiedzi `5xx` tylko niewielką, ograniczoną liczbę razy;
- nie ponawiaj niezmienionego żądania `400`, `401`, `402`, `403` ani `404`;
- przed powtórzeniem żądania tworzenia, wyzwalania lub działania zewnętrznego sprawdź idempotencję;
- gdy strumień się przerwie, zachowaj częściowe wyjście i zdecyduj, czy bezpieczniej jest kontynuować, czy zacząć od nowa;
- przekaż wywołującemu końcowy status HTTP i oczyszczony błąd specyficzny dla endpointu.

## Błędy platformy Agents {#agents-platform-errors}

Agents, sesje, Skills, połączenia MCP i sekrety zwracają jedną kopertę. Dla większości kodów `message` to stałe, bezpieczne zdanie; `invalid_request` może zawierać krótkie wyjaśnienie, np. który kształt wejścia lub opcja nie są obsługiwane. Rozgałęziaj logikę według `code`, a nie `message`.

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type` to `authentication_error` dla 401, `server_error` dla 5xx i `invalid_request_error` w pozostałych przypadkach.

| HTTP | `code` | Znaczenie | Co zrobić |
|---|---|---|---|
| 400 | `invalid_request` | Źle sformułowane lub nieznane pola, nieudana walidacja lub nieobsługiwana opcja | Popraw żądanie; nie ponawiaj bez zmian |
| 400 | `skill_not_found` | Wskazany Skill lub jego wersja są niedostępne | Popraw `skills` w Agent |
| 401 | `unauthorized` | Brakujące, nieprawidłowe lub sprzeczne nagłówki klucza API | Sprawdź `Authorization` / `X-API-Key` |
| 402 | `spending_limit_exceeded` | Wyczerpany limit wydatków klucza lub saldo organizacji | Doładuj środki lub podnieś limit |
| 403 | `insufficient_scope` | Klucz ma ograniczony zakres i nie może używać zasobów Agents | Użyj standardowego klucza utworzonego w Console |
| 403 | `org_disabled` | Organizacja nie ma uprawnień do uruchamiania Agents | Skontaktuj się z pomocą techniczną |
| 404 | `not_found` | Zasób nie istnieje w Twojej organizacji | Sprawdź identyfikator |
| 409 | `conflict` | Nieaktualne `row_version`, stan niepozwalający na zmianę lub `Idempotency-Key` użyty ponownie z inną treścią | Odczytaj zasób ponownie i dopiero wtedy zdecyduj |
| 409 | `session_input_pending` | Wcześniejsze wejście jest nadal dostarczane | Poczekaj; nie wysyłaj ponownie z nowym kluczem |
| 409 | `session_input_expired` | Przyjęcie wejścia wygasło | Przed ponownym wysłaniem sprawdź historię |
| 409 | `session_environment_unavailable` | Środowisko wykonawcze jest niedostępne | Poczekaj lub utwórz nową sesję |
| 413 | `request_too_large` | Treść żądania lub zamrożona na jej podstawie konfiguracja sesji przekracza limit rozmiaru | Wyślij mniejszą treść; nie ponawiaj bez zmian |
| 429 | `quota_exceeded` | Przekroczono limit Agents | Spróbuj ponownie później |
| 502 | `executor_rejected`, `executor_contract_error` | Warstwa wykonawcza odrzuciła żądanie lub odpowiedziała w nieoczekiwany sposób | Sprawdź konfigurację Agent, a następnie ponów |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | Zależność jest tymczasowo niedostępna | Ponawiaj z wycofaniem i tym samym `Idempotency-Key` |

Może się też pojawić `skill_runtime_incompatible`; jest zwracany jako 503 z komunikatem `internal error`.

## Awarie strumieniowania {#streaming-failures}

Po rozpoczęciu odpowiedzi strumieniowej błąd może dotrzeć w formacie strumienia danego protokołu zamiast jako nowy
status HTTP. Traktuj strumień jako niekompletny, zamknij go, zachowaj częściową treść potrzebną aplikacji i
ponawiaj tylko wtedy, gdy żądanie można bezpiecznie powtórzyć.

## Zobacz też {#see-also}

- [Kody błędów](/api-reference/errors) — publiczne formaty odpowiedzi i typowe statusy HTTP
- [Limity żądań](/guides/rate-limiting) — obsługa 429 i wygładzanie żądań
- [Błędy i ponawianie](/guides/error-handling) — wzorce implementacji
- [Uwierzytelnianie](/api-reference/authentication) — obsługiwane poświadczenia i cykl życia kluczy
