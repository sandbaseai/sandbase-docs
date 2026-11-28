---
i18nSource: adfacb669489863e
title: Konto i rozliczenia
description: Zarządzaj organizacją SandBase, kluczami API, rozliczeniami, użyciem i limitami.
---

# Konto i rozliczenia {#account-and-billing}

Ustawienia organizacji określają, do kogo należy użycie, jak aplikacje się uwierzytelniają i jak monitorowane są wydatki.

## Czym zarządzasz {#what-you-manage}

| Obszar | Do czego służy |
|---|---|
| [Organizacje](/admin/organizations) | Zarządzanie granicami obszaru roboczego, członkami i własnością |
| [Klucze API](/getting-started/api-keys) | Tworzenie, rotacja i unieważnianie poświadczeń aplikacji |
| [Rozliczenia i kredyty](/admin/billing) | Sprawdzanie salda, zakup kredytów, konfiguracja automatycznego doładowania i przegląd użycia w Activities i Analysis |
| [Cennik i użycie](/guides/billing) | Ceny modeli, dzienne darmowe wywołania API i koszt pojedynczego zadania |
| [Limity zapytań](/guides/rate-limiting) | Limity żądań i bezpieczne ponawianie |

## Zalecana konfiguracja {#recommended-setup}

1. Upewnij się, że pracujesz we właściwej organizacji.
2. Utwórz osobne klucze API dla środowisk deweloperskiego, testowego (staging) i produkcyjnego.
3. Nazywaj klucze według aplikacji i środowiska.
4. Po pierwszych żądaniach produkcyjnych przejrzyj Activities i rozliczenia.
5. Unieważniaj nieużywane klucze i szybko wyjaśniaj nieoczekiwane użycie.

## Własność i dostęp {#ownership-and-access}

Klucze API i użycie należą do organizacji. Przełączenie organizacji zmienia zasoby, klucze i kontekst rozliczeń widoczne w Console. Przed zmianą konfiguracji produkcyjnej sprawdź wybraną organizację i uzgodnij rotację klucza z aplikacjami, które go używają.

## Podstawy bezpieczeństwa {#security-basics}

- przechowuj klucze w zmiennych środowiskowych lub menedżerze sekretów
- nigdy nie wklejaj kluczy do instrukcji Agent, kodu źródłowego, zrzutów ekranu ani wiadomości do pomocy technicznej
- używaj osobnego klucza dla każdej aplikacji i środowiska
- natychmiast unieważnij klucz, jeśli mógł zostać ujawniony
- monitoruj Activities pod kątem nieoczekiwanego wolumenu, modeli lub endpointów
