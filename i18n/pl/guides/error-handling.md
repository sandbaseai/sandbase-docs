---
i18nSource: f63049c1cf01130e
title: Błędy i ponawianie
description: Klasyfikuj błędy API SandBase, decyduj, kiedy ponowienie jest bezpieczne, i zachowuj przydatną diagnostykę bez ujawniania sekretów.
---

# Błędy i ponawianie {#errors-and-retries}

Obsługuj błędy według statusu HTTP, rodziny endpointów i semantyki operacji. SandBase udostępnia kilka zgodnych protokołów,
więc nie istnieje jeden format JSON błędu wspólny dla wszystkich endpointów.

## Sprawdź format błędu endpointu {#read-the-endpoint-s-error-shape}

- Operacje zgodne z OpenAI zwykle zwracają obiekt `error` z komunikatem i typem.
- Anthropic Messages zwraca koperty błędów zgodne z Anthropic.
- Podstawowe operacje platformy mogą zwracać płaską treść `{ "error": "..." }` lub udokumentowany błąd specyficzny dla zasobu.
- Operacje Google i natywne operacje dostawców zachowują format swojego zgodnego protokołu tam, gdzie jest to udokumentowane.

Korzystaj ze statusu HTTP odpowiedzi i udokumentowanej treści. Nie wymagaj opcjonalnych pól, takich jak `code`, `param` czy
`request_id`, chyba że wybrany endpoint je gwarantuje. Przykłady znajdziesz w [dokumentacji błędów API](/api-reference/errors),
a odpowiedzi poszczególnych operacji w [specyfikacji OpenAPI](/openapi.yaml).

## Zdecyduj, co zrobić, na podstawie statusu {#decide-what-to-do-by-status}

| Status | Typowa przyczyna | Zalecane działanie |
|---|---|---|
| `400` / `422` | Nieprawidłowa treść, parametr lub nieobsługiwana możliwość modelu | Popraw żądanie przed ponowieniem. |
| `401` | Brakujące, nieprawidłowe, wygasłe lub unieważnione poświadczenie | Wymień poświadczenie. |
| `402` | Stan rozliczeń nie pozwala na żądanie | Uzupełnij saldo konta lub dostosuj kontrolę wydatków. |
| `403` | Niewystarczający zakres poświadczenia lub dostęp do zasobu | Użyj autoryzowanego klucza lub zasobu. |
| `404` | Nie znaleziono modelu, zadania ani zasobu platformy | Sprawdź identyfikator i organizację. |
| `409` | Konflikt stanu zasobu lub równoczesnej operacji | Odczytaj bieżący stan, a potem zdecyduj, czy ponowić. |
| `429` | SandBase lub dostawca nadrzędny ograniczył żądanie | Respektuj `Retry-After`, jeśli jest obecny; w przeciwnym razie wycofaj się z jitterem. |
| `500` / `502` / `503` / `504` | Błąd wewnętrzny, dostawcy nadrzędnego lub chwilowa niedostępność | Ponawiaj tylko wtedy, gdy powtórzenie operacji jest bezpieczne. |

Ta tabela to wskazówki dotyczące obsługi, a nie obietnica, że każdy endpoint zwraca każdy status.

## Stosuj ograniczoną politykę ponawiania {#use-a-bounded-retry-policy}

W przypadku żądania, które można bezpiecznie powtórzyć, stosuj wykładniczy backoff z jitterem, ograniczaj opóźnienie i egzekwuj łączny budżet żądań.
Wyłącz ponawianie w SDK, jeśli zewnętrzna warstwa aplikacji już ponawia żądania, albo uwzględnij obie warstwy przy ustalaniu budżetu.

```python
import os
import random
import time

from openai import APIStatusError, OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def chat_with_backoff(messages, attempts=4):
    for attempt in range(attempts):
        try:
            return client.chat.completions.create(
                model="deepseek/deepseek-v4-flash",
                messages=messages,
            )
        except APIStatusError as error:
            retryable = error.status_code in {429, 500, 502, 503, 504}
            if not retryable or attempt == attempts - 1:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

Gdy odpowiedź zawiera `Retry-After`, sparsuj go i respektuj zamiast używać opóźnienia zapasowego. Zachowaj możliwość
konfiguracji polityki; właściwa liczba prób i termin zależą od budżetu opóźnienia i kosztów wywołującego.

## Chroń się przed zduplikowanymi skutkami ubocznymi {#protect-against-duplicate-side-effects}

Powtórzenie żądania inferencji tworzy nowe generowanie i może wiązać się z dodatkowymi kosztami. Jest to dopuszczalne tylko wtedy, gdy
aplikacja potrzebuje dowolnej prawidłowej odpowiedzi i toleruje ponowne generowanie.

Zachowaj większą ostrożność przy operacjach, które tworzą, aktualizują, usuwają, publikują, planują lub uruchamiają pracę:

- korzystaj z udokumentowanej obsługi idempotencji, jeśli endpoint ją zapewnia;
- w przeciwnym razie przed powtórzeniem niejednoznacznego żądania odczytaj bieżący stan;
- nigdy nie odtwarzaj wywołania narzędzia tylko dlatego, że otaczający je strumień modelu został rozłączony;
- przechowuj identyfikator operacji klienta we własnym systemie, gdy musisz uzgadniać ponowienia.

## Obsługuj przekroczenia czasu i strumienie osobno {#handle-timeouts-and-streams-separately}

Przekroczenie czasu nie dowodzi, że serwer przestał przetwarzać żądanie. Przed ponowieniem operacji asynchronicznej lub zmieniającej stan
w miarę możliwości sprawdź udokumentowany status zasobu lub zadania.

W przypadku odpowiedzi strumieniowych odróżniaj błąd HTTP przed rozpoczęciem strumienia od rozłączenia po częściowym wyniku.
Tylko normalny sygnał zakończenia protokołu dowodzi, że strumień jest kompletny. Zobacz [Odpowiedzi strumieniowe](/guides/streaming).

## Rejestruj przydatną i bezpieczną diagnostykę {#log-useful-safe-diagnostics}

Zapisuj:

- endpoint i identyfikator modelu;
- status HTTP i zgodny typ błędu, jeśli jest obecny;
- identyfikator dostawcy lub żądania, jeśli został zwrócony;
- liczbę prób, czas, który upłynął, oraz informację, czy dotarły jakiekolwiek bajty odpowiedzi.

Nie zapisuj w logach kluczy API, wartości poświadczeń, pełnych poufnych promptów ani niezredagowanych odpowiedzi dostawców. Pokazuj użytkownikom zwięzły
komunikat z możliwym działaniem, a oczyszczoną diagnostykę zachowuj dla operatorów.

## Powiązane wskazówki {#related-guidance}

- [Dokumentacja błędów API](/api-reference/errors)
- [Limity żądań](/guides/rate-limiting)
- [Odpowiedzi strumieniowe](/guides/streaming)
- [Uwierzytelnianie](/api-reference/authentication)
