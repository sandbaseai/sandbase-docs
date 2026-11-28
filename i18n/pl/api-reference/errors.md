---
i18nSource: ac4e3b9b9eef4c7d
title: Błędy API
description: Obsługuj błędy SandBase API według statusu HTTP, rodziny endpointów, udokumentowanego kształtu odpowiedzi i bezpieczeństwa ponowień.
---

# Błędy API {#api-errors}

SandBase używa standardowych kodów statusu HTTP, ale nie udostępnia jednej uniwersalnej treści błędu. Najpierw rozgałęziaj obsługę według statusu HTTP, a potem parsuj schemat odpowiedzi opisany dla wywołanego endpointu. Nie zakładaj, że każdy błąd zawiera `code`, `param`, `message` lub `request_id`.

## Kształty odpowiedzi {#response-shapes}

Główne oprogramowanie pośredniczące i kilka endpointów `/v1/*` zwraca płaski błąd:

```json
{"error":"organization rate limit exceeded"}
```

Zasoby platformy Agents (`/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*`) zwracają obiekt w stylu OpenAI ze stałym `code`. Zobacz [Błędy platformy Agents](#agents-platform-errors):

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

Webhook Events API (`/events/webhooks*`) zwraca `{"code":<http status>,"message":"..."}`. Zobacz [Webhooks](/api-reference/webhooks#authentication-and-errors).

Endpointy zgodne z OpenAI zachowują kopertę zgodną z OpenAI. `POST /v1/messages` zachowuje kopertę zgodną z Anthropic:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

Dokładne kody statusu i schematy publicznej operacji znajdziesz w [specyfikacji OpenAPI](/openapi.yaml).

## Obsługa statusów HTTP {#http-status-handling}

| Status | Typowe znaczenie | Działanie klienta |
|---|---|---|
| `400` | Nieprawidłowe wejście lub nieobsługiwany parametr | Popraw żądanie zgodnie ze schematem endpointu i wybranego modelu. |
| `401` | Brakujące, nieprawidłowe, unieważnione lub wygasłe poświadczenie | Zastąp lub zrotuj poświadczenie; nie ponawiaj bez zmian. |
| `402` | Żądania nie da się sfinansować lub osiągnięto limit wydatków | Przed ponowieniem uzupełnij saldo lub zmień limit klucza. |
| `403` | Poświadczenie nie ma uprawnień lub endpoint zgodności mapuje błąd wydatków na 403 | Sprawdź kopertę właściwą dla endpointu i użyj uprawnionego klucza. |
| `404` | Model lub zasób jest niedostępny dla wywołującego | Sprawdź bieżący identyfikator modelu lub zasobu. |
| `409` | Konflikt stanu zasobu | Odczytaj najnowszy stan, zanim zdecydujesz, czy ponowienie jest bezpieczne. |
| `422` | Semantycznie nieprawidłowe dane zasobu | Popraw wartości opisanych pól. |
| `429` | Limit żądań organizacji lub limit współbieżności wideo | Ponów z ograniczonym wycofywaniem i losowym opóźnieniem, jeśli operację można bezpiecznie powtórzyć. |
| `500`, `502`, `503`, `504` | Błąd SandBase lub usługi nadrzędnej | Ponawiaj tylko wtedy, gdy operację można bezpiecznie powtórzyć. |

Nie każdy endpoint dokumentuje wszystkie statusy z tej tabeli. Wiążąca jest mapa odpowiedzi operacji w OpenAPI.

## Błędy uwierzytelniania {#authentication-errors}

Udokumentowane komunikaty uwierzytelniania to między innymi:

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

Klucz z ograniczonym zakresem użyty poza tym zakresem zwraca `403` z zagnieżdżoną treścią: `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`. Zasoby platformy Agents zwracają ten sam `code` we własnej kopercie.

Dla standardowych endpointów używaj `Authorization: Bearer $SANDBASE_API_KEY`. `POST /v1/messages` przyjmuje też `x-api-key`; endpointy zgodne z protokołem Google dokumentują własne obsługiwane nagłówki klucza.

Unieważnionego klucza nie można ponownie włączyć. Utwórz klucz zastępczy, zaktualizuj korzystającą z niego aplikację, sprawdź jej działanie, a następnie usuń pozostałe odwołania do starego klucza.

## Limity żądań {#rate-limits}

`organization rate limit exceeded` (`429`) oznacza, że organizacja osiągnęła przydzielony limit żądań na minutę, wspólny dla wszystkich jej kluczy API. Endpointy zgodne z protokołami zwracają ten błąd we własnej kopercie. SandBase nie publikuje jednego uniwersalnego limitu liczbowego, ponieważ limit jest przydzielany każdej organizacji osobno.

Jeśli odpowiedź zawiera `Retry-After`, przestrzegaj go. W przeciwnym razie używaj ograniczonego wykładniczego wycofywania z losowym opóźnieniem. Wzorce wygładzania ruchu opisuje strona [Limity żądań](/guides/rate-limiting).

Zgłoszenia zadań mają dwa dodatkowe sprawdzenia. `organization concurrency limit exceeded` (`429`) oznacza, że organizacja ma już tyle zadań w toku, na ile pozwala poziom jej konta; błąd ustępuje, gdy działające zadanie się zakończy. Dotyczy to każdego typu modelu w `POST /v1/run` i `/v1/api/*` oraz zgłoszeń wideo w innych endpointach. `insufficient credit for estimated video cost` (`402`) oznacza, że szacowany koszt przekracza saldo wraz z linią kredytową; przed ponowieniem doładuj konto. Zobacz [Limity współbieżności](/guides/concurrency-limits).

## Bezpieczeństwo ponowień {#retry-safety}

Stosuj tę kolejność decyzji:

1. Ustal, czy operacja wywołała już widoczny na zewnątrz efekt.
2. Nie ponawiaj bez zmian żądania, które zwróciło `400`, `401`, `402`, `403`, `404` lub `422`.
3. Przy `409` przed ponowieniem odczytaj bieżący stan zasobu.
4. Ponawiaj odpowiedzi `429` i przejściowe `5xx` tylko niewielką, ograniczoną liczbę razy.
5. Zanim powtórzysz żądanie tworzenia, wyzwolenia, przesłania lub działania zewnętrznego, upewnij się, że operacja jest idempotentna albo że aplikacja potrafi uzgodnić duplikaty.

Odpowiednie opóźnienie to:

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

## Błędy platformy Agents {#agents-platform-errors}

Agents, Sessions, Skills, połączenia MCP i Secrets zwracają jedną kopertę. Dla większości kodów `message` to stałe, bezpieczne zdanie; `invalid_request` może zawierać krótkie wyjaśnienie, na przykład który kształt wejścia lub która opcja nie jest obsługiwana. Rozgałęziaj obsługę według `code`, a nie `message`.

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type` ma wartość `authentication_error` dla 401, `server_error` dla 5xx i `invalid_request_error` w pozostałych przypadkach.

| HTTP | `code` | Znaczenie | Co zrobić |
|---|---|---|---|
| 400 | `invalid_request` | Nieprawidłowe lub nieznane pola, nieudana walidacja albo nieobsługiwana opcja | Popraw żądanie; nie ponawiaj bez zmian |
| 400 | `skill_not_found` | Wskazany Skill lub jego wersja są niedostępne | Popraw `skills` Agenta |
| 401 | `unauthorized` | Brakujące, nieprawidłowe lub sprzeczne nagłówki klucza API | Sprawdź `Authorization` / `X-API-Key` |
| 402 | `spending_limit_exceeded` | Wyczerpany limit wydatków klucza lub saldo organizacji | Dodaj kredyty lub podnieś limit |
| 403 | `insufficient_scope` | Klucz ma ograniczony zakres i nie może używać zasobów Agents | Użyj standardowego klucza utworzonego w Console |
| 403 | `org_disabled` | Organizacja nie ma uprawnień do uruchamiania Agents | Skontaktuj się z pomocą techniczną |
| 404 | `not_found` | Zasób nie istnieje w Twojej organizacji | Sprawdź identyfikator |
| 409 | `conflict` | Nieaktualne `row_version`, stan niepozwalający na zmianę lub `Idempotency-Key` użyty ponownie z inną treścią | Odczytaj zasób ponownie i dopiero wtedy zdecyduj |
| 409 | `session_input_pending` | Wcześniejsze wejście jest wciąż dostarczane | Poczekaj; nie wysyłaj ponownie z nowym kluczem |
| 409 | `session_input_expired` | Przyjęcie wejścia wygasło | Przed ponownym wysłaniem sprawdź historię |
| 409 | `session_environment_unavailable` | Środowisko wykonawcze jest niedostępne | Poczekaj lub utwórz nową Session |
| 413 | `request_too_large` | Treść żądania lub zamrożona na jej podstawie konfiguracja Session przekracza limit rozmiaru | Wyślij mniejszą treść; nie ponawiaj bez zmian |
| 429 | `quota_exceeded` | Przekroczono limit Agents | Spróbuj ponownie później |
| 502 | `executor_rejected`, `executor_contract_error` | Warstwa wykonawcza odrzuciła żądanie lub odpowiedziała w nieoczekiwany sposób | Sprawdź konfigurację Agenta, a potem ponów |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | Zależność jest tymczasowo niedostępna | Ponów z wycofywaniem i tym samym `Idempotency-Key` |

Może się też pojawić `skill_runtime_incompatible`; jest zwracany jako 503 z komunikatem `internal error`.

## Błędy strumieniowania {#streaming-failures}

Po rozpoczęciu strumienia błąd może nadejść w formacie strumienia danego protokołu zamiast jako nowa odpowiedź HTTP. Traktuj strumień jako niekompletny, zachowaj potrzebne aplikacji częściowe wyniki i ponawiaj tylko wtedy, gdy ponowne wygenerowanie odpowiedzi jest bezpieczne. Nie zakładaj, że każdy dostawca emituje to samo zdarzenie końcowe lub ten sam powód zakończenia.

## Diagnostyka operacyjna {#operational-debugging}

Zapisuj endpoint, status HTTP, wybrany identyfikator modelu lub zasobu, znacznik czasu i każdy bezpieczny identyfikator żądania zwrócony przez serwer. Nigdy nie loguj nagłówków autoryzacji, kluczy API, wartości poświadczeń ani wrażliwej treści promptów.

Historię żądań organizacji sprawdzisz w [Developer → Activities](https://www.sandbase.ai/console/activities). Zgłaszając utrzymujący się błąd, dołącz oczyszczone metadane żądania i najmniejsze żądanie, które odtwarza problem.

## Zobacz też {#see-also}

- [Uwierzytelnianie](/api-reference/authentication)
- [Błędy i ponowienia](/guides/error-handling)
- [Limity żądań](/guides/rate-limiting)
- [Przewodnik po błędach dla AI](/for-agents/errors)
