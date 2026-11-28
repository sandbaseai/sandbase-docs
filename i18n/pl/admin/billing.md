---
i18nSource: d560e2374d91a8d6
title: Rozliczenia i kredyty
description: Sprawdzaj saldo organizacji SandBase, kupuj kredyty przez Stripe lub Airwallex, konfiguruj automatyczne doładowanie, realizuj kupony i poznaj mechanizmy kontroli wydatków kluczy API.
---

# Rozliczenia i kredyty {#billing-and-credits}

Ta strona opisuje zarządzanie rozliczeniami w [SandBase Console](https://www.sandbase.ai/console). Stawki i optymalizację kosztów opisuje strona [Cennik](/guides/billing).

SandBase rozlicza obsługiwane obciążenia z salda organizacji. Aktualne ceny, oferty, operatorzy płatności,
minimalne kwoty doładowania i dostępność regionalna są widoczne w Console i mogą się zmieniać niezależnie od tego
przewodnika.

## Saldo {#balance}

Otwórz [Developer → Billing](https://www.sandbase.ai/console/billing). Strona **Credits** pokazuje dla aktywnej organizacji:

| Pozycja | Znaczenie |
|------|---------------|
| **Available balance** | Środki gotowe do użycia w Models i API |
| **Credit limit** | Limit wydatków obszaru roboczego |
| **Current level** | Poziom konta i jego współbieżność |

To samo saldo widać na karcie **Balance** w panelu Console oraz w nagłówku strony po zalogowaniu.
Traktuj Console jako źródło prawdy w sprawie promocji i warunków płatności; nie automatyzuj jego wewnętrznych żądań
sieciowych.

## Zakup kredytów {#buy-credits}

1. Otwórz [Billing](https://www.sandbase.ai/console/billing) i sprawdź, czy pole **Credits go to** wskazuje obszar roboczy, który chcesz zasilić.
2. W sekcji **Buy credits** wybierz gotową kwotę lub wpisz **Custom amount** w USD. Minimalna kwota doładowania jest podana na stronie.
3. Jeśli dostępny jest więcej niż jeden **Payment provider**, wybierz **Stripe** (karty i portfele z całego świata) lub **Airwallex** (karty i lokalne metody płatności).
4. Sprawdź w podglądzie wartości **Pay**, **Bonus** i **Receive**, a następnie wybierz **Continue with Stripe** (lub wybranego operatora) i dokończ płatność na stronie operatora.
5. Zanim uruchomisz obciążenie wrażliwe na koszty, sprawdź zaktualizowane saldo w sekcji **Credit transactions**.

SandBase nigdy nie przechowuje danych kart; stroną płatności zarządza operator.

### Bonus za pierwsze doładowanie {#first-top-up-bonus}

Jeśli konto i obszar roboczy nigdy nie były doładowane, sekcja **Current offers** pokazuje bonus za pierwsze doładowanie. Strona podaje
procent bonusu i jego górny limit. Przysługuje jeden bonus na konto i na obszar roboczy, a zwroty proporcjonalnie odbierają
bonus. Bonus pojawia się jako osobny wiersz w **Credit transactions**.

## Automatyczne doładowanie {#auto-top-up}

**Auto Top-up** uzupełnia saldo z zapisanej karty, gdy spadnie ono poniżej progu. Obecnie obsługuje tylko
Stripe i mogą nim zarządzać wyłącznie właściciele i administratorzy obszaru roboczego.

1. W sekcji **Payment cards** wybierz **Add Card** i zapisz kartę w Stripe.
2. Wybierz **Turn on auto top-up**, a następnie ustaw **When balance goes below**, **Top-up amount**, opcjonalny **Monthly limit** i kartę.
3. Zaznacz **I authorize these automatic charges** i potwierdź.

Po osiągnięciu limitu miesięcznego automatyczne doładowanie zatrzymuje się do końca miesiąca kalendarzowego (UTC). Automatyczne obciążenia
pojawiają się w **Credit transactions** z kanałem `Auto top-up · Stripe`.

## Realizacja kuponu {#redeem-a-coupon}

Wpisz **Coupon code** w sekcji **Redeem a coupon**, a następnie wybierz **Redeem credit**. Kupon dotyczy tylko aktywnego
obszaru roboczego, więc najpierw sprawdź wybraną organizację.

## Kontrola wydatków {#spending-controls}

| Mechanizm | Zakres | Działanie |
|---------|-------|----------|
| Granica finansowania organizacji | Cała organizacja | Dostępne saldo plus skonfigurowany limit kredytowy; żądanie bez pokrycia może zwrócić HTTP 402 |
| Limit wydatków klucza | Na klucz API | Opcjonalny limit dla klucza, ograniczony saldem organizacji |
| Miesięczny limit automatycznego doładowania | Cała organizacja | Ogranicza automatyczne obciążenia w miesiącu kalendarzowym (UTC) |

Jak ustawić limit wydatków dla klucza, opisuje strona [Klucze API](/getting-started/api-keys).

## Activities i Analysis {#activities-and-analysis}

[Developer → Activities](https://www.sandbase.ai/console/activities) ma dwie karty:

- **Request History** wyświetla pojedyncze żądania z kluczem API, modelem, statusem, opóźnieniem i kosztem.
- **Usage** pokazuje żądania i koszty z 7 lub 30 dni, **Model APIs by Archived Spend** oraz **Billing Records**. Obie tabele mają **Export CSV**. Eksport rekordów rozliczeniowych zawiera kolumnę **Free Quota**, która oznacza wywołania objęte dzienną darmową pulą.

[Developer → Analysis](https://www.sandbase.ai/console/analytics) dodaje **Overview**, **Cost analysis** i
**Health diagnostics** za ostatnie 7 lub 30 pełnych dni UTC.

Publiczny cennik i zasady kosztów zadań opisują strony [Cennik i użycie](/guides/billing) oraz
[Pobieranie kosztu zadania](/api-reference/tasks/cost).
