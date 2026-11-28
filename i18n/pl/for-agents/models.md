---
i18nSource: b95a8cd6f82c3a9a
title: Modele i ceny czytelne dla AI
description: Sprawdzaj aktualne modele SandBase, ich możliwości, schematy i ceny przez Models API.
---

# Modele i ceny {#models-pricing}

Wszystkie modele są dostępne z jednym kluczem API SandBase. Dostępność modeli, schematy, możliwości, limity kontekstu
i ceny mogą zmieniać się niezależnie od siebie.

::: info Korzystaj z aktualnych metadanych modeli
Zawsze używaj `GET /v1/models` i `GET /v1/models/{id_or_name}`, aby uzyskać aktualne, wiarygodne dane. Nie zakładaj, że każdy
LLM obsługuje strumieniowanie, wizję, narzędzia, ustrukturyzowane wyjście lub cache, i nie kopiuj pól wejściowych ani
cen jednego modelu do innego.
:::

## Odpowiedzi katalogu i szczegółów {#catalog-and-detail-responses}

`GET /v1/models` zwraca rekordy tożsamości zgodne z OpenAI zawierające `id`, `object`, `created` i `owned_by`.
Celowo pomija metadane SandBase dotyczące możliwości, schematu i cen.

`GET /v1/models/{id_or_name}` dodaje `unified_schema`, `supported_modes` i `model_card`. Szczegółowe ceny odczytuj z
`model_card`; nie ma obiektu `pricing` na najwyższym poziomie. Traktuj `capability_tags`, `supported_modes` i
`unified_schema` jako specyficzne dla modelu.

## Wyszukiwanie modeli {#discover-models}

```bash
curl 'https://api.sandbase.ai/v1/models?type=llm' \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Endpoint listy obsługuje `q`, `vendor`, `type` i `order`; nie jest stronicowany i domyślnie używa `type=llm`.
Zwraca elementy zgodne z OpenAI z `id`, `object`, `created` i `owned_by`. Używaj zwróconego `id` jako
nazwy modelu przy pobieraniu szczegółów lub wywoływaniu modelu.

Dla każdej asynchronicznej odpowiedzi `202` odpytuj `GET /v1/run/{id}` ze zwróconym identyfikatorem. Traktuj identyfikator jako nieprzezroczysty; nie
wnioskuj o jego formacie ani nie konstruuj innej ścieżki odpytywania na podstawie prefiksu identyfikatora lub nagłówka zgodności.

## Sprawdzanie pojedynczego modelu {#inspect-one-model}

Nazwy modeli zawierają prefiks dostawcy i mogą zawierać `/`:

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Przed wykonaniem sprawdź:

- `enabled` i `execution_mode`
- `capability_tags` i `supported_modes`
- `unified_schema` pod kątem akceptowanych pól żądania
- `model_card` pod kątem aktualnej formuły cenowej i mnożników tokenów lub cache

## Sprawdzanie rzeczywistego kosztu zadania {#check-actual-task-cost}

Dla zadania ukończonego lub w toku pobierz zarejestrowany koszt zamiast przeliczać go na podstawie nieaktualnej tabeli:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Kontrakty odpowiedzi opisuje [dokumentacja Models API](/api-reference/models/), a wskazówki dotyczące struktury odpowiedzi i ponawiania —
[Przewodnik po błędach](/for-agents/errors).
