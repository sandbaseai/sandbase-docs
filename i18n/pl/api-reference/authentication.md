---
i18nSource: 5b94f91222d138de
title: Uwierzytelnianie API
description: Uwierzytelniaj żądania do API SandBase tokenami Bearer i obsługiwanymi nagłówkami kluczy API zgodnymi z protokołami.
---

# Uwierzytelnianie {#authentication}

SandBase uwierzytelnia żądania publicznego API za pomocą kluczy API. Ta strona opisuje obsługiwane metody integracji oraz
dobre praktyki zarządzania kluczami. Uwierzytelnianie w Console i jego wewnętrzne API nie są częścią kontraktu publicznego API.

## Metody uwierzytelniania {#authentication-methods}

Standardowe endpointy SandBase `/v1/*` wymagają tokena Bearer. Operacje Anthropic Messages i zgodne z Google Gemini akceptują także miejsca przekazywania klucza API zgodne z ich natywnymi SDK.

### Token Bearer {#bearer-token}

Umieść klucz w nagłówku `Authorization`:

```http
Authorization: Bearer sk-your-api-key
```

To standardowa metoda używana przez SDK zgodne z OpenAI.

### Anthropic Messages: nagłówek x-api-key {#anthropic-messages-x-api-key-header}

Umieść klucz w nagłówku `x-api-key`:

```http
x-api-key: sk-your-api-key
```

Ten nagłówek jest obsługiwany tylko przez `POST /v1/messages`. Inne publiczne endpointy go nie odczytują; dla Chat Completions, `/v1/run`
i API zasobów używaj uwierzytelniania Bearer.

### Priorytet {#priority}

Wyłącznie dla `POST /v1/messages`: gdy obecne są oba nagłówki, pierwszeństwo ma `x-api-key`.

### Klucze API zgodne z Google Gemini {#google-gemini-compatible-api-keys}

Operacje Gemini GenerateContent i Interactions akceptują `x-goog-api-key`, `Authorization: Bearer …` lub parametr zapytania `key`, w tej kolejności priorytetu. Preferuj nagłówek, ponieważ poświadczenia w ciągu zapytania mogą trafić do logów i historii przeglądarki. Obsługiwane ścieżki opisano w [Google Gemini](/api-reference/gemini-generate-content) i [Gemini Interactions](/api-reference/gemini-interactions).

### Logika odczytu klucza {#extraction-logic}

Standardowe endpointy odczytują wyłącznie `Authorization: Bearer <key>`. Middleware Anthropic Messages najpierw odczytuje `x-api-key`,
a następnie wraca do nagłówka Bearer. Zasoby platformy Agents akceptują `Authorization: Bearer` lub
`X-API-Key` (zobacz niżej). [Webhook Events API](/api-reference/webhooks) (`/events/webhooks*`) również akceptuje oba
nagłówki i używa nagłówka Bearer, gdy obecne są oba. Brak obsługiwanego poświadczenia zwraca `401 Unauthorized`.

### Zasoby platformy Agents {#agents-platform-resources}

`/v1/agents*` (w tym `/v1/agents/sessions*`), `/v1/mcp-connections*`, `/v1/secrets*`
i `/v1/skills*` akceptują klucz w dowolnym z nagłówków:

```bash
curl https://api.sandbase.ai/v1/agents \
  -H "X-API-Key: $SANDBASE_API_KEY"
```

- Jeśli wysłano jednocześnie `Authorization: Bearer` i `X-API-Key`, muszą zawierać ten sam klucz; różne wartości zwracają `401 unauthorized`. Powtórzenie któregokolwiek nagłówka również zwraca 401.
- `OpenAI-Beta` jest opcjonalny. Jeśli występuje, musi mieć wartość `agents=v1`.
- Żądania odczytu wymagają uprawnienia `agents.read`, a zapisy `agents.write`. Standardowe klucze utworzone w Console mają oba. Klucze o ograniczonym zakresie wydawane przez SandBase, np. klucze CLI Login, zwracają `403 insufficient_scope`.
- `402 spending_limit_exceeded` oznacza wyczerpanie limitu wydatków klucza lub salda organizacji.
- Błędy używają [koperty błędów Agents](/api-reference/errors#agents-platform-errors), a nie płaskiej formy `{"error": "…"}` pokazanej niżej.

## Format klucza API {#api-key-format}

Nowe klucze API utworzone w Console mają następujący format:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| Składnik | Opis |
|-----------|-------------|
| `sk-` | Standardowy prefiks „secret key” |
| `xxxx...` | 64 znaki szesnastkowe wygenerowane z 32 losowych bajtów |

Starsze klucze `sk-sb-...` działają, dopóki nie wygasną lub nie zostaną unieważnione. Klienci powinni traktować klucze jako nieprzezroczyste ciągi
i nie odrzucać poświadczeń na podstawie prefiksu ani długości.

::: warning
Nigdy nie ujawniaj klucza API w kodzie po stronie klienta, publicznych repozytoriach ani logach. Traktuj go jak hasło.
:::

## Tworzenie kluczy API {#create-api-keys}

### W Console {#via-console}

1. Zaloguj się do [SandBase Console](https://www.sandbase.ai/console)
2. Otwórz **Developer → API Keys**
3. Kliknij **New key**
4. Nadaj kluczowi opisową nazwę (np. „Production Backend”, „Development”)
5. Od razu skopiuj klucz — nie zostanie wyświetlony ponownie

### Właściwości klucza {#key-properties}

| Właściwość | Opis |
|----------|-------------|
| Name | Czytelna etykieta identyfikująca klucz |
| Organization | Organizacja, do której należy klucz |
| Enabled | Czy klucz jest aktywny |
| Spending Limit | Opcjonalny limit wydatków dla klucza |
| Expires At | Opcjonalna data wygaśnięcia |
| Created At | Data utworzenia klucza |

Standardowe klucze utworzone w Console mają dostęp na poziomie organizacji do udokumentowanego publicznego API. Poświadczenia wydawane przez SandBase, np. klucze CLI Login, mogą mieć ograniczony zakres. Console nie pozwala wybierać zakresów dla standardowych kluczy.

## Cykl życia klucza {#key-lifecycle}

### Rotacja {#rotation}

Aby zrotować klucz:

1. Utwórz nowy klucz w Console
2. Zaktualizuj aplikację, aby używała nowego klucza
3. Sprawdź, czy nowy klucz działa na produkcji
4. Unieważnij stary klucz

::: tip
Zawsze twórz nowy klucz przed unieważnieniem starego, aby uniknąć przestoju.
:::

### Unieważnienie {#revocation}

Unieważnione klucze nie mogą uwierzytelniać nowych żądań. API zwraca `401 Unauthorized` z komunikatem:

```json
{"error":"API key has been revoked"}
```

### Wygaśnięcie {#expiration}

Klucze mogą mieć opcjonalną datę wygaśnięcia. Wygasłe klucze zwracają `401 Unauthorized` z komunikatem:

```json
{"error":"API key has expired"}
```

## Wymagania uwierzytelniania endpointów {#endpoint-authentication-requirements}

| Endpoint | Metoda uwierzytelniania | Opis |
|----------|-------------|-------------|
| `POST /v1/chat/completions` | Klucz API (Bearer) | Chat Completions |
| `POST /v1/responses` | Klucz API (Bearer) | Responses API zgodne z OpenAI |
| `POST /v1/messages` | Klucz API (Bearer lub x-api-key) | Anthropic Messages |
| `/v1beta/models/*` | Klucz API (x-goog-api-key, Bearer lub key w zapytaniu) | Gemini GenerateContent |
| `/v1beta/interactions*` | Klucz API (x-goog-api-key, Bearer lub key w zapytaniu) | Gemini Interactions |
| `/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*` | Klucz API (Bearer lub X-API-Key) | Zasoby platformy Agents |

SandBase Console używa osobnego przepływu uwierzytelniania w przeglądarce. Jego wewnętrzne żądania nie są obsługiwanymi publicznymi
endpointami i integracje nie mogą z nich korzystać.

## Izolacja organizacji {#organization-isolation}

Klucze API mają zasięg organizacji. Gdy uwierzytelniasz się kluczem:

- Masz dostęp tylko do zasobów należących do Twojej organizacji
- Użycie i rozliczenia są śledzone dla każdej organizacji osobno

## Odpowiedzi z błędami {#error-responses}

| Status HTTP | Komunikat | Przyczyna |
|-------------|---------|-------|
| 401 | `missing API key in Authorization header` | Nie podano klucza |
| 401 | `invalid API key` | Klucz nie istnieje w bazie danych |
| 401 | `API key has been revoked` | Klucz został wyłączony |
| 401 | `API key has expired` | Upłynęła data wygaśnięcia klucza |
| 402 lub 403 zależny od protokołu | `API key spending limit exceeded` | Osiągnięto limit wydatków klucza; sprawdź udokumentowany kontrakt błędów endpointu |
| 403 | `API key is not authorized for this endpoint` | Klucz o ograniczonym zakresie użyty na endpoincie spoza tego zakresu |

Te komunikaty przychodzą w płaskiej treści `{"error":"<message>"}`, z wyjątkiem błędów zakresu `403`. Na endpointach modeli i konta
mają one postać `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`;
w zasobach platformy Agents używają [koperty błędów Agents](/api-reference/errors#agents-platform-errors) z
`code` równym `insufficient_scope`.

## Dobre praktyki bezpieczeństwa {#security-best-practices}

### Rób {#do}

- **Przechowuj klucze w zmiennych środowiskowych** — nigdy nie wpisuj kluczy na stałe w kodzie źródłowym
- **Używaj osobnych kluczy dla każdego środowiska** — różne klucze dla dev, staging i produkcji
- **Ustawiaj daty wygaśnięcia** — wybierz okres rotacji zgodny z Twoją polityką bezpieczeństwa
- **Monitoruj użycie** — sprawdzaj w Console nieoczekiwaną aktywność
- **Używaj standardowych kluczy tylko dla zadań wymagających dostępu do publicznego API** — poświadczenia CLI Login o ograniczonym zakresie zostaw w ich zarządzanym przepływie

### Nie rób {#don-t}

- **Nie commituj kluczy do systemu kontroli wersji** — dodaj `.env` do `.gitignore`
- **Nie używaj jednego klucza w niezwiązanych aplikacjach** — osobne klucze ułatwiają bezpieczną rotację i reagowanie na incydenty
- **Nie ujawniaj kluczy w kodzie po stronie klienta** — zawsze przekazuj żądania przez swój backend
- **Nie loguj kluczy API** — maskuj klucze w logach aplikacji

### Przykład zmiennej środowiskowej {#environment-variable-example}

::: code-group

```bash [.env]
SANDBASE_API_KEY=sk-your-api-key
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

:::

## Limity zapytań a klucze {#rate-limiting-by-key}

Limity żądań są przydzielane organizacji i współdzielone przez wszystkie jej klucze API, więc tworzenie kolejnych kluczy nie podnosi
limitu. API nie publikuje uniwersalnej liczbowej
wartości domyślnej ani nagłówków z pozostałym limitem.

Szczegóły limitów i obsługi odpowiedzi 429 znajdziesz w [Limity zapytań](/guides/rate-limiting).
