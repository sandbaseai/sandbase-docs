---
i18nSource: 3dc57d405dbf561d
title: Klucze API
description: Jak tworzyć klucze SandBase API do uwierzytelniania żądań, zarządzać nimi i je chronić.
---

# Klucze API {#api-keys}

Klucze API uwierzytelniają Twoje żądania do SandBase. Ten przewodnik opisuje, jak tworzyć klucze, używać ich w żądaniach i chronić je.

## Tworzenie klucza API {#create-an-api-key}

1. Zaloguj się do [SandBase Console](https://www.sandbase.ai/console)
2. Otwórz **Developer → API Keys** (lub przejdź bezpośrednio do [API Keys](https://www.sandbase.ai/console/keys))
3. Kliknij **New key**
4. Wpisz opisową nazwę w polu **Name** (np. „Production Server”, „Local Development”)
5. Opcjonalnie ustaw **Spending limit** (puste pole oznacza brak limitu) i datę **Expires** (puste pole oznacza brak wygaśnięcia)
6. Kliknij **Create key**
7. Od razu skopiuj klucz z banera **API key created** — zostanie wyświetlony tylko raz

::: danger Ważne
Klucz API jest wyświetlany tylko raz, podczas tworzenia. Jeśli go zgubisz, musisz utworzyć nowy. Zapisz go w bezpiecznym miejscu przed zamknięciem okna.
:::

## Format klucza {#key-format}

Nowe klucze API tworzone w Console mają prefiks `sk-`, po którym następuje 64 znaki szesnastkowe:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Istniejące klucze `sk-sb-...` pozostają ważne, dopóki nie wygasną lub nie zostaną unieważnione. Nie weryfikuj
poświadczenia na podstawie samego prefiksu; zawsze traktuj całą wartość jako nieprzejrzysty sekret.

## Metody uwierzytelniania {#authentication-methods}

SandBase obsługuje dwa sposoby przekazywania klucza API w żądaniach:

### Nagłówek Authorization (zalecany) {#authorization-header-recommended}

Użyj standardowego nagłówka `Authorization: Bearer`. Jest on zgodny z SDK OpenAI i Anthropic:

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek/deepseek-v4-flash", "messages": [{"role": "user", "content": "Hi"}]}'
```

### Anthropic Messages: nagłówek x-api-key {#anthropic-messages-x-api-key-header}

`POST /v1/messages` przyjmuje również natywny nagłówek Anthropic `x-api-key`:

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "x-api-key: sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "anthropic/claude-sonnet-5", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hi"}]}'
```

::: tip
Spośród bram modeli tylko `POST /v1/messages` odczytuje `x-api-key` i ma on pierwszeństwo, gdy obecne są oba obsługiwane
nagłówki. [Zasoby platformy Agents](/api-reference/authentication#agents-platform-resources) również przyjmują
`X-API-Key`. Dla wszystkich pozostałych publicznych endpointów używaj nagłówka Bearer.
:::

## Uprawnienia kluczy {#key-permissions}

Klucze SandBase API działają na **poziomie organizacji**:

- Standardowy klucz utworzony w Console może wywoływać publiczne zasoby API dostępne dla organizacji
- Użycie jest rozliczane na organizację, do której należy klucz
- Klucz może mieć opcjonalną datę wygaśnięcia i limit wydatków
- Poświadczenia wydawane przez SandBase, takie jak klucze CLI Login, mogą mieć ograniczony zakres i zwracają `403` poza tym zakresem

Console nie umożliwia obecnie wyboru zakresów dla standardowego klucza. Klucze CLI Login są tworzone, gdy łączysz narzędzie AI. Strona API Keys grupuje je w jednym rozwijanym wierszu **CLI Login** i nie można ich edytować tak jak standardowych kluczy. Klucze, które SandBase tworzy za Ciebie, mają oznaczenie **Auto-created**; nie mają limitu na poziomie klucza i są ograniczone saldem konta.

Lista kluczy pokazuje dla każdego klucza **Name**, **Key Prefix**, **Spent**, **Limit**, **Expires** i **Status**. Użyj **Edit**, aby zmienić nazwę, limit wydatków lub datę wygaśnięcia standardowego klucza.

Traktuj każdy klucz jako poświadczenie aplikacji, a nie osobiste hasło. Do dostępu dla ludzi używaj członkostwa w organizacji, a do obciążeń kluczy API.

## Strategia środowisk {#environment-strategy}

Utwórz osobny klucz dla każdej aplikacji i środowiska:

| Klucz | Przykładowa nazwa | Dlaczego |
|---|---|---|
| Lokalne środowisko deweloperskie | `research-app-dev` | Rotacja bez przerywania produkcji |
| Staging | `research-app-staging` | Izolacja użycia testowego i incydentów |
| Produkcja | `research-app-production` | Jasny właściciel produkcji i ograniczona ekspozycja |
| Tymczasowa automatyzacja | `release-check-2026-08` | Ustawienie daty wygaśnięcia i niezależne unieważnienie |

Zapisz właściciela i wdrożenie, które korzysta z każdego klucza. Podczas rotacji wdróż nowy klucz, sprawdź, czy żądania kończą się powodzeniem, i dopiero wtedy unieważnij stary klucz.

## Wygasanie i unieważnianie kluczy {#key-expiration-and-revocation}

### Wygasanie {#expiration}

Podczas tworzenia klucza możesz opcjonalnie ustawić datę wygaśnięcia. Po jej upływie klucz przestaje działać, a żądania zwracają błąd `401 Unauthorized`.

Klucze bez daty wygaśnięcia pozostają ważne do czasu ręcznego unieważnienia.

### Unieważnianie klucza {#revoking-a-key}

Aby unieważnić (wyłączyć) klucz:

1. Przejdź do [Developer → API Keys](https://www.sandbase.ai/console/keys)
2. Znajdź klucz, który chcesz unieważnić
3. Kliknij **Revoke**
4. Potwierdź operację

Unieważnione klucze nie mogą uwierzytelniać nowych żądań. Unieważnienia nie można cofnąć — jeśli unieważnisz klucz przez pomyłkę, utwórz nowy.

## Dobre praktyki bezpieczeństwa {#security-best-practices}

### Nigdy nie umieszczaj kluczy w systemie kontroli wersji {#never-commit-keys-to-version-control}

Zamiast tego używaj zmiennych środowiskowych lub menedżera sekretów:

```bash
# .env file (add to .gitignore!)
SANDBASE_API_KEY=sk-your-key-here
```

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

### Używaj osobnych kluczy dla różnych środowisk {#use-separate-keys-for-different-environments}

Utwórz odrębne klucze dla środowisk deweloperskiego, testowego (staging) i produkcyjnego. Dzięki temu możesz unieważnić przejęty klucz deweloperski bez wpływu na produkcję.

### Regularnie rotuj klucze {#rotate-keys-regularly}

Okresowo twórz nowe klucze i wycofuj stare. Ogranicza to czas ekspozycji w razie wycieku klucza.

### Monitoruj aktywność {#monitor-activity}

Regularnie sprawdzaj **Developer → Activities** pod kątem nieoczekiwanych skoków liczby żądań lub użycia, które mogą wskazywać na przejęcie klucza. **Request History** można filtrować według klucza API.

Jeśli klucz zostanie ujawniony, natychmiast go unieważnij, utwórz klucz zastępczy, zaktualizuj korzystającą z niego aplikację i sprawdź Activities oraz rozliczenia pod kątem nieoczekiwanego użycia. Nie czekaj na zaplanowaną rotację.

### Ustawiaj daty wygaśnięcia {#set-expiration-dates}

W przypadku dostępu tymczasowego (potoki CI/CD, dostęp dla wykonawców zewnętrznych, wersje demonstracyjne) ustaw datę wygaśnięcia, aby klucz automatycznie przestał działać.

## Rozwiązywanie problemów {#troubleshooting}

| Błąd | Przyczyna | Rozwiązanie |
|-------|-------|-----|
| `401 - missing API key` | W żądaniu nie podano klucza | Dodaj nagłówek `Authorization: Bearer <key>` |
| `401 - invalid API key` | Klucz nie istnieje | Sprawdź literówki i upewnij się, że podano cały klucz |
| `401 - API key has been revoked` | Klucz został trwale unieważniony w Console | Utwórz klucz zastępczy |
| `401 - API key has expired` | Minęła data wygaśnięcia klucza | Utwórz nowy klucz lub przedłuż ważność |
| `402 - API key spending limit exceeded` | Klucz osiągnął skonfigurowany limit wydatków | Podnieś limit lub użyj innego uprawnionego klucza |
| `403 - insufficient_scope` | Poświadczenie z ograniczonym zakresem nie może wywołać tego endpointu | Użyj klucza uprawnionego do tego endpointu |

## Następne kroki {#next-steps}

- [**Pierwsze wywołanie API**](/getting-started/first-call) — Szczegółowe wywołanie API z pełnym omówieniem żądania i odpowiedzi
- [**Uwierzytelnianie**](/api-reference/authentication) — Obsługiwane nagłówki, cykl życia i błędy właściwe dla protokołów
- [**Dokumentacja API**](/api-reference/) — Pełna dokumentacja endpointów
