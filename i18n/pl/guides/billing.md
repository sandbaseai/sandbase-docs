---
i18nSource: 91c5a0d1b6de6434
title: Cennik i zużycie
description: Sprawdzaj aktualne ceny modeli, koszty zadań i bezpiecznie zarządzaj rozliczeniami SandBase.
---

# Cennik i zużycie {#pricing-and-usage}

SandBase stosuje rozliczanie pay-as-you-go. Dostępność modeli, formuły cenowe, mnożniki cache i opłaty za konkretne
możliwości mogą zmieniać się niezależnie, dlatego integracje powinny odczytywać metadane na bieżąco zamiast polegać na skopiowanych
tabelach cen.

## Dzienne darmowe wywołania API {#daily-free-api-calls}

Każda organizacja otrzymuje 100 darmowych wywołań API danych (wyszukiwanie, media społecznościowe, scraping, e-commerce, finanse) na dobę UTC.
Pula jest wspólna dla wszystkich kwalifikujących się API danych i wszystkich kluczy organizacji i odnawia się o 00:00 UTC. LLM-y i
modele multimedialne się nie kwalifikują. Nie kwalifikują się też niektóre API danych: droższe lub wyceniane formułą, np. część
endpointów wsadowych, endpointy crawl, Xiaohongshu PGY i trasy Douyin Xingtu `kol-*`, są płatne od pierwszego wywołania.
Aby sprawdzić narzędzie, uruchom `sandbase_inspect`: kwalifikujące się narzędzia mają `pricing.free_quota`, a narzędzia bez tego pola są zawsze
płatne.

- Wywołania w ramach puli nie są obciążane i organizacja z zerowym saldem nadal może z nich korzystać.
- Po 100. wywołaniu kwalifikujące się wywołania nadal działają i są rozliczane za każde wywołanie według ceny podanej przy narzędziu. Nie są
  odrzucane ani ograniczane z powodu wyczerpania puli.
- Niewykorzystane wywołania nie przechodzą na następny dzień.

W [narzędziach MCP SandBase](/setup/) `sandbase_inspect` oznacza kwalifikujące się narzędzia polem `pricing.free_quota`
(`daily_limit`, `scope`, `resets`). `sandbase_account` zwraca dzisiejszą pulę jako `free_api_quota` z polami
`daily_limit`, `used_today`, `remaining` i `resets_at`; `used_today` i `remaining` są pomijane, gdy licznik jest
chwilowo niedostępny. Po rozliczeniu uruchomienia `sandbase_run` i `sandbase_run_get` zwracają `free_quota_status`:
`free` (pokryte z puli), `overage` (rozliczone po wyczerpaniu puli) lub `degraded` (nieobciążone,
ponieważ licznik puli był niedostępny).

## Zarządzanie rozliczeniami w Console {#manage-billing-in-the-console}

W **Developer → Billing** możesz sprawdzić saldo, kupić kredyty, skonfigurować automatyczne doładowanie, zrealizować kupony i zarządzać ustawieniami rozliczeń dostępnymi dla Twojej
organizacji. Otwórz **Developer → Activities → Usage**, aby zobaczyć podsumowania żądań, tokenów i kosztów na poziomie organizacji.

::: info Granica publicznego API
Endpointy salda, doładowań, eksportu rozliczeń i zużycia w całej organizacji nie należą obecnie do obsługiwanego
publicznego API. Nie automatyzuj żądań sieciowych Console i nie polegaj na wewnętrznych trasach Console.
:::

## Odczyt aktualnych cen modeli {#read-current-model-pricing}

Najpierw znajdź włączony model:

```bash
curl 'https://api.sandbase.ai/v1/models?q=gpt' \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Następnie pobierz jego pełną kartę modelu:

```bash
curl https://api.sandbase.ai/v1/models/deepseek/deepseek-v4-flash \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Endpoint listy jest zoptymalizowany pod kątem wyszukiwania i celowo pomija szczegółowe ceny tokenów, cache i rozumowania.
Szczegółowe ceny wybranego modelu odczytasz z `model_card` w odpowiedzi szczegółowej. Nie istnieje uniwersalna formuła,
która dotyczyłaby każdego LLM, modelu multimedialnego, modelu embeddingów lub możliwości API.

## Sprawdzanie zarejestrowanego kosztu zadania {#check-one-task-s-recorded-cost}

Gdy operacja zwraca identyfikator zadania, odpytaj jego rekord rozliczenia:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Odpowiedź odróżnia bieżący `cost` od `estimated_cost` i informuje, czy rozliczenie jest ostateczne. Nie
używaj `cost` do uzgadniania rozliczeń, dopóki `settled` nie ma wartości `true`. Rekordy zadań to dane do bieżącego wglądu operacyjnego, a nie
księga rachunkowa. Do uzgadniania i długoterminowej ewidencji używaj rekordów rozliczeń i eksportów CSV dostępnych w **Developer → Activities → Usage**.

## Praktyki kontroli kosztów {#cost-control-practices}

- Przed uruchomieniem nowego obciążenia pobierz aktualną kartę modelu.
- Sprawdź `capability_tags`, `supported_modes` i `unified_schema`; tańsze alternatywy są przydatne tylko wtedy, gdy
  obsługują wymagane zachowanie wejścia i wyjścia.
- Ograniczaj zbędny kontekst promptu i ustaw odpowiedni limit tokenów wyjściowych, jeśli wybrany model to obsługuje.
- Traktuj cache jako zależny od modelu. Sprawdzaj kartę modelu i zwracane pola zużycia zamiast zakładać rabat
  obowiązujący u całego dostawcy.
- Identyfikatory zadań zapisuj tylko do sprawdzania kosztu zadania; dla asynchronicznej pracy `/v1/run` zapisz zwrócony nieprzezroczysty identyfikator uruchomienia i odpytuj `GET /v1/run/{id}` tylko wtedy, gdy status to `pending` lub `running`.
- Korzystaj z mechanizmów kontroli wydatków dostępnych w Console dla Twojej organizacji.

## Błędy płatności {#payment-errors}

Operacja API może zwrócić HTTP `402`, gdy organizacja nie może sfinansować żądania. Koperty błędów różnią się w zależności od warstwy
zgodności API, dlatego obsługuj status HTTP i udokumentowany obiekt błędu zamiast dopasowywać jeden
komunikat. Po uregulowaniu rozliczeń w Console ponów żądanie zgodnie z zasadami idempotencji i odzyskiwania danej operacji.

Zgłoszenia wideo są też sprawdzane pod kątem szacowanego kosztu przed rozpoczęciem. Jednorazowe doładowanie o wartości co najmniej 10 USD
podnosi poziom konta, co pozwala uruchamiać więcej zadań wideo jednocześnie. Zobacz
[Limity równoległości](/guides/concurrency-limits).

Aktualne publiczne kontrakty opisują [Modele i cennik](/for-agents/models), [Koszt zadania](/api-reference/tasks/cost) oraz
[Błędy](/api-reference/errors).
