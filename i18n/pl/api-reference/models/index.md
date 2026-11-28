---
i18nSource: 3ccdc1071b9be798
title: Models API
description: Sprawdzaj metadane modeli SandBase, ceny, status obsługi i możliwości.
---

# Models API {#models-api}

Models API służy do wyszukiwania modeli przed wyborem endpointu inferencji. Operacja listy jest zgodna z OpenAI i zwraca zwięzłe rekordy identyfikacyjne. Pobierz pojedynczy model, aby uzyskać metadane SandBase o możliwościach, schemacie i cenach.

| Operacja | Endpoint | Dokumentacja |
|---|---|---|
| Lista modeli | `GET /v1/models` | [Lista modeli](./list) |
| Pobranie jednego modelu | `GET /v1/models/{id_or_name}` | [Pobierz model](./get) |
| Wywołanie możliwości API według ścieżki | `GET/POST /v1/api/{vendor}/{upstream_path}` | [API Passthrough](./api-passthrough) |
| Uruchomienie modelu lub możliwości API | `POST /v1/run` | [Uruchom możliwość](./run) |
| Pobranie wyniku asynchronicznego | `GET /v1/run/{id}` | [Pobierz wynik uruchomienia](./run-get) |
| Odbiór asynchronicznego wywołania zwrotnego | `webhook_url` w `POST /v1/run` | [Wywołania zwrotne webhook](./run#webhook-callbacks) |
| Przeglądanie obsługiwanych modeli | — | [Katalog Models](https://www.sandbase.ai/models) |

Aby uruchomić model, otwórz jego stronę referencyjną w [katalogu Models](https://www.sandbase.ai/models); każda strona pokazuje dokładny identyfikator, pola żądania i ceny. Ta strona opisuje wyszukiwanie modeli, ujednolicony mechanizm uruchamiania możliwości, API passthrough, zasoby i sprawdzanie kosztów zadań.

`GET /v1/models` obsługuje `q`, `vendor`, `type` i `order`; nie jest paginowany. Pominięcie `type` oznacza domyślnie `llm`, a jawnie pusty `type=` wyświetla wszystkie publiczne typy modeli. Filtr `vendor` jest dokładny i rozróżnia wielkość liter; `q` to wyszukiwanie podciągu bez rozróżniania wielkości liter. Każdy element listy zawiera `id`, `object`, `created` i `owned_by`, gdzie `id` to logiczna nazwa modelu używana w żądaniach.

Nazwy modeli mogą zawierać `/`. Przy wywoływaniu endpointu szczegółów przekazuj te ukośniki jako separatory ścieżki, na przykład `/v1/models/openai/gpt-5.6-luna`; trasa serwera traktuje pozostałą część ścieżki jako jeden identyfikator logiczny. Bieżący identyfikator sprawdzaj w `GET /v1/models` zamiast kopiować go ze starszego przewodnika.

W przypadku asynchronicznej odpowiedzi `202` z API inferencji odpytuj `GET /v1/run/{id}` ze zwróconym nieprzejrzystym identyfikatorem. Nie wnioskuj prefiksu identyfikatora ani nie buduj innej ścieżki odpytywania na podstawie nagłówków zgodności.
