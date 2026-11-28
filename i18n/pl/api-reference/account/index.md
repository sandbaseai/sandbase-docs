---
i18nSource: 3b9b3fc27f878cd5
title: Account API
description: Sprawdzaj saldo organizacji i ostatnią historię wykonań powiązane z kluczem API.
---

# Account API {#account-api}

Endpointy konta są tylko do odczytu i działają na organizacji ustalonej na podstawie klucza API Bearer.

| Operacja | Endpoint |
|---|---|
| [Pobierz saldo](./balance) | `GET /v1/account/balance` |
| [Wyświetl historię wykonań](./history) | `GET /v1/account/history` |

Wartości salda i kosztów są dokładnymi ciągami dziesiętnymi. Przechowuj je jako wartości dziesiętne, zamiast konwertować je
przez binarną arytmetykę zmiennoprzecinkową.

Historia wykonań służy do bieżącej kontroli operacyjnej. Do długoterminowego uzgadniania finansowego używaj rekordów
rozliczeniowych lub eksportów.

Filtrowanie historii używa surowych znaczników czasu UTC. Bez `request_id` opcjonalny parametr zgodności `timezone` jest walidowany jako nazwa strefy czasowej IANA, ale nie przekształca znaczników czasu w odpowiedzi; tryb dokładnego `request_id` ignoruje go razem z pozostałymi filtrami. Nieznane wartości `type` nie stosują filtra typu wykonania; aby filtr działał, użyj `multimodal`, `llm` lub `api`. Nieobsługiwane wartości `range` są zastępowane przez `7d`.

Wpisy historii mogą zawierać zapisane parametry żądań i wyniki modeli. Odpowiednio ogranicz dostęp do klucza API
i nie kopiuj odpowiedzi historii do logów ani zgłoszeń do pomocy technicznej bez sprawdzenia ich pod kątem danych wrażliwych.
