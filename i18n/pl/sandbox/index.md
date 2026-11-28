---
i18nSource: 4191d2eb16a594f5
title: "Sandbox: przegląd i możliwości"
description: Twórz sandboksy za pomocą E2B SDK lub SandBase Console, sprawdzaj status, logi i metryki oraz poznaj osobny, eksperymentalny Playground.
---

# Sandbox: przegląd i możliwości {#sandbox-overview-and-capabilities}

Sandbox zapewnia izolowane środowiska do uruchamiania poleceń, wykonywania kodu oraz odczytu i zapisu plików. Wstrzymaj instancję, połącz się z nią ponownie i odczytaj plik, aby sprawdzić trwałość danych.

[Szybki start / E2B SDK](./quickstart) · [Otwórz Playground (eksperymentalny)](./playground)

Użyj [oficjalnego E2B SDK](./quickstart), aby zintegrować Sandbox ze swoją aplikacją. Zaloguj się do [Sandbox Console](https://www.sandbase.ai/console/sandboxes), aby tworzyć sandboksy i sprawdzać status instancji, logi i metryki. Wprowadzenie znajdziesz w [przeglądzie produktu Sandbox](https://www.sandbase.ai/sandbox). Poniższy przewodnik i tabela obsługi dotyczą osobnego, eksperymentalnego Playground.

## Pięciominutowy przewodnik po Playground {#a-five-minute-playground-walkthrough}

1. Wpisz [klucz API](/getting-started/api-keys) z uprawnieniami Sandbox. Samo połączenie tylko odczytuje szablony i instancje.
2. Wybierz dostępny szablon, potwierdź informację o zasobach i utwórz krótkotrwałą instancję.
3. Uruchom przykład z informacjami o systemie lub przykład w Pythonie. Obserwuj wyjście i zdarzenia procesów obok panelu poleceń.
4. Zapisz i zweryfikuj plik tekstowy, wstrzymaj instancję, wznów ją i ponownie odczytaj ten sam plik.
5. Sprawdź zdarzenia cyklu życia, metryki, logi i dane o czasie maszyny. Po zakończeniu usuń instancję.

Odświeżenie strony czyści poświadczenia i lokalną historię operacji; nie usuwa sandboksów. Działające instancje podlegają limitowi czasu serwera. Wstrzymane instancje mogą nadal zajmować zasoby. Zapisuj identyfikatory instancji i po opuszczeniu strony używaj narzędzi organizacji do uzgodnienia stanu i uprzątnięcia zasobów.

## Możliwości i ograniczenia {#capabilities-and-boundaries}

| Możliwość | Obsługa w Playground |
| --- | --- |
| Tworzenie, lista, wstrzymanie, wznowienie, wydłużenie limitu czasu, usunięcie | Dostępne; operacje modyfikujące dotyczą tylko instancji utworzonych w tej sesji strony |
| Polecenia i pliki tekstowe | Dostępne; polecenia działają do 25 sekund, a edycja plików jest ograniczona do `/tmp/` i 32 KiB |
| Zdarzenia cyklu życia, logi, metryki, czas maszyny | Dostępność zależy od środowiska; sprawdź zwrócone wyniki |
| Czat AI i kontekst rozmowy | Niezintegrowane; wymaga konfiguracji modelu i obciążenia Agent |
| PTY, porty aplikacji, webhooki, budowanie szablonów | Niedostępne w tym interfejsie |
| Migawki i fork | Niedostępne w tym Playground |

Interakcja z powłoką to nie czat AI. Odzyskiwanie instancji, trwałość plików, przetrwanie procesów i ciągłość rozmowy należy weryfikować osobno.

## Zdarzenia {#understanding-events}

Wpisy **Sandbox lifecycle** to natywne zdarzenia serwera pobierane przy odświeżeniu; mogą docierać z opóźnieniem. Wpisy **Sandbox process** opisują uruchomienia procesów i strumieniowane wyjście. Wpisy **Playground** rejestrują lokalne zakończenie lub niepowodzenie żądania; nie są to zdarzenia cyklu życia usługi.

Pusta lista nie dowodzi zerowego zużycia, a brak zdarzeń nie dowodzi, że operacja się nie powiodła. Dane o czasie maszyny nie są ostatecznym rachunkiem. Po przekroczeniu limitu czasu lub przerwaniu połączenia uzgodnij stan instancji, zanim spróbujesz utworzyć kolejną.

## Widoczność szablonów {#template-visibility}

Szablony mogą być publiczne lub prywatne dla Twojej organizacji. Ich liczba nie jest stała. Wpisy bez nazw pozostają widoczne, a jako etykiety zastępcze służą aliasy lub identyfikatory. To, które szablony widzisz i możesz używać, zależy od dostępu Twojej organizacji i dostępności szablonów.

## Sandboksy a sesje Agent {#sandboxes-and-agent-sessions}

Sesje Agents działają w hostowanej chmurze SandBase. Są oddzielne od instancji Sandbox tworzonych za pomocą E2B SDK, a Agents API nie udostępnia instancji Sandbox. Zobacz [Sesje](/agents/sessions).
