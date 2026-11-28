---
i18nSource: 8524e8b4d6f5ab97
title: Agents API
description: Twórz, wersjonuj, archiwizuj i klonuj zapisane konfiguracje Agentów.
---

# Agents API {#agents-api}

Agent to zapisana, wersjonowana konfiguracja: model, instrukcje, profil środowiska uruchomieniowego, Skills, połączenia MCP i ustawienia wyjścia. Utworzenie lub aktualizacja Agenta go nie uruchamia. Agenta uruchamia się w [Session](/api-reference/sessions/).

Agents API jest zgodne z protokołem OpenAI Agents (`client.beta.agents` w OpenAI Python SDK). Nagłówek `OpenAI-Beta` jest opcjonalny; jeśli go wysyłasz, musi mieć wartość `agents=v1`. SandBase dodaje wersje, aktualizacje compare-and-set, archiwizację i przywracanie oraz publiczny katalog.

## Operacje na Agentach {#agent-operations}

| Metoda | Ścieżka | Przeznaczenie |
|---|---|---|
| `POST` | `/v1/agents` | [Utworzenie Agenta](./create) w wersji 1 |
| `GET` | `/v1/agents` | [Lista Agentów](./list) |
| `GET` | `/v1/agents/{agent_id}` | [Pobranie Agenta](./get) |
| `POST` | `/v1/agents/{agent_id}` | [Aktualizacja Agenta](./update) (częściowa aktualizacja w stylu SDK) |
| `PATCH` | `/v1/agents/{agent_id}` | [Zastąpienie metodą compare-and-set](./replace) na podstawie `row_version` |
| `DELETE` | `/v1/agents/{agent_id}` | [Usunięcie](./delete), które archiwizuje Agenta |
| `POST` | `/v1/agents/{agent_id}/archive` | [Archiwizacja Agenta](./archive) |
| `POST` | `/v1/agents/{agent_id}/unarchive` | [Przywrócenie Agenta z archiwum](./unarchive) |
| `POST` | `/v1/agents/{agent_id}/restore` | [Przywrócenie wcześniejszej wersji](./restore) jako nowej wersji |
| `GET` | `/v1/agents/{agent_id}/versions` | [Lista wersji](./versions) |
| `GET` | `/v1/agents/{agent_id}/versions/{version}` | [Pobranie jednej wersji](./get-version) |
| `GET` | `/v1/agents/catalog` | [Przeglądanie publicznego katalogu](./catalog) |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | [Sklonowanie Agenta z katalogu](./catalog#clone-a-catalog-agent) do Twojej organizacji |

Identyfikatory Agentów mają prefiks `agt_`. Treść żądania to ścisły JSON o rozmiarze do 1 MiB; nieznane pola zwracają 400.

## Wersje i aktualizacje {#versions-and-updates}

- Każdy skuteczny zapis (create, update, replace, restore) tworzy niezmienną wersję. `version` to numer bieżącej wersji.
- `POST /v1/agents/{agent_id}` to aktualizacja w stylu OpenAI SDK. Nie wymaga `row_version`, więc wygrywa ostatni zapis.
- `PATCH /v1/agents/{agent_id}` wymaga ostatnio odczytanej wartości `row_version` i zwraca 409, gdy ktoś inny zmienił Agenta wcześniej. Używaj tej metody w edytorach i automatyzacjach, które mogą działać równolegle.
- Każda Session zamraża wersję Agenta, wersje Skills i konfigurację połączeń MCP, z którymi wystartowała.

## Gotowość {#readiness}

Nowo zapisana wersja zgłasza `projection_status`, gdy jest przygotowywana do wykonania. Sessions wymagają aktywnego Agenta, którego `projection_status` ma wartość `ready`; w przeciwnym razie zwracają 409. Zarchiwizowane Agenty również zwracają 409 dla nowych wykonań.

## Bieżące ograniczenia {#current-limits}

- `tools` przyjmuje narzędzia `function` i co najwyżej jedno narzędzie `web_search`. Wykonanie wymaga obecnie, aby `web_search.mode` miało wartość `disabled`.
- Narzędzia funkcyjne można zapisać, ale Runs, które proszą klienta o zwrócenie wyniku narzędzia (`requires_action`), nie są jeszcze obsługiwane i kończą się błędem `502 executor_contract_error`.
- `multi_agent` musi zostać pominięte lub mieć wartość `null`.

## Paginacja {#pagination}

`GET /v1/agents` i katalog używają paginacji kursorowej: `limit` (1-100, domyślnie 20), `after` i `order` (`asc` lub `desc`, domyślnie `desc`). Odpowiedzi zawierają `object: "list"`, `data`, `has_more`, `first_id` i `last_id`; aby pobrać następną stronę, przekaż `last_id` jako `after`.

`GET /v1/agents/{agent_id}/versions` używa paginacji z przesunięciem: `limit` i `offset`, a odpowiedź zawiera `data`, `total`, `limit` i `offset`.

## Błędy {#errors}

Błędy używają koperty Agents `{"error":{"type","code","param":null,"message"}}`. Listę kodów znajdziesz na stronie [Błędy](/api-reference/errors#agents-platform-errors).
