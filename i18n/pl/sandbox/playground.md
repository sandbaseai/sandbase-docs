---
i18nSource: 20679b8b1344acb5
title: Sandbox Playground (eksperymentalny)
description: Wypróbuj prawdziwe sandboksy SandBase z własnym kluczem API. Twórz je, uruchamiaj polecenia, sprawdzaj pliki po wstrzymaniu i wznowieniu oraz przeglądaj zdarzenia cyklu życia.
outline: false
aside: false
pageClass: sandbox-playground-page
---

# Sandbox Playground {#sandbox-playground}

Wypróbuj Sandbox API z własnym kluczem. Operacje łączą się z **sandbox.sandbase.ai** i mogą generować opłaty.

<ClientOnly>
  <SandboxPlayground />
</ClientOnly>

## Twój klucz pozostaje pod Twoją kontrolą {#your-key-stays-under-your-control}

- **Tylko w pamięci strony.** Ten Playground nie zapisuje klucza API ani tokenów połączenia w pamięci przeglądarki ani w plikach cookie, nie umieszcza ich w URL-ach i nie rejestruje ich w aktywności strony ani w przykładach żądań.
- **Usuń w dowolnym momencie.** Wybierz **Clear key**, aby usunąć klucz, tokeny połączenia i wyświetlaną aktywność, nawet podczas trwania żądania. Odświeżenie lub opuszczenie tej strony również je usuwa. Aby połączyć się ponownie, trzeba będzie znowu wpisać klucz.
- **Używany tylko do Twoich żądań.** Klucz jest przesyłany do SandBase w celu uwierzytelnienia operacji Sandbox, których żądasz. Wyczyszczenie tej strony nie unieważnia klucza; w razie potrzeby unieważnij go w [Developer → API Keys](https://www.sandbase.ai/console/keys).

Te zobowiązania dotyczą sposobu, w jaki ten Playground obsługuje poświadczenia. Nie oznaczają, że aktywność Sandbox ani rekordy użycia po stronie usługi zostaną usunięte. Nie wpisuj sekretów w poleceniach ani plikach, ponieważ ich zawartość może pozostać w Twoim sandboksie.

## Zasoby usuwaj osobno {#clean-up-resources-separately}

Wyczyszczenie klucza nie anuluje operacji już odebranej przez usługę ani nie usuwa sandboksa. Po zakończeniu usuń instancje. Jeśli wynik tworzenia jest nieznany, sprawdź swoje instancje, zanim utworzysz kolejną. Przed wyczyszczeniem tej strony zachowaj identyfikatory instancji potrzebne do sprzątania.

[Przegląd i możliwości](./index) · [Szybki start / E2B SDK](./quickstart)
