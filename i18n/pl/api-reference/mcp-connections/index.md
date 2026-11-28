---
i18nSource: ee126767f58b111b
title: MCP Connections API
description: Rejestruj zdalne serwery MCP przez HTTPS, które mogą wywoływać Agents.
---

# MCP Connections API {#mcp-connections-api}

Połączenie MCP rejestruje zdalny serwer MCP dostępny przez HTTPS. Agents odwołują się do połączeń w `mcp_connections`; każda sesja zamraża konfigurację połączenia w chwili startu. Identyfikatory połączeń mają prefiks `mcp_`. Aby uwierzytelniać się na serwerze tokenem Bearer, najpierw utwórz [sekret](/agents/api-credentials#with-the-api) dla tego samego URL.

| Metoda | Ścieżka | Przeznaczenie |
|---|---|---|
| `POST` | `/v1/mcp-connections` | [Utworzenie połączenia](#create-a-connection) |
| `GET` | `/v1/mcp-connections` | [Lista połączeń](#list-connections) |
| `GET` | `/v1/mcp-connections/{connection_id}` | [Pobranie połączenia](#get-a-connection) |
| `PUT` | `/v1/mcp-connections/{connection_id}` | [Zastąpienie połączenia](#replace-a-connection) |
| `POST` | `/v1/mcp-connections/{connection_id}/enable` | [Włączenie połączenia](#enable-a-connection) |
| `DELETE` | `/v1/mcp-connections/{connection_id}` | [Wyłączenie połączenia](#disable-a-connection) |

Każdy zapis wymaga `Idempotency-Key` (1-128 bajtów, bez białych znaków na początku i końcu). Obiekt połączenia ma pola `id`, `name`, `server_url`, `secret_id` (jeśli ustawione), `status` (`active` lub `disabled`), `row_version`, `created_at` i `updated_at`.

## Utworzenie połączenia {#create-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
```

- `name` jest wymagane i niepuste, do 128 bajtów.
- `server_url` musi używać HTTPS bez danych użytkownika, zapytania i fragmentu (do 2048 bajtów).
- `secret_id` jest opcjonalne. Pomiń je dla serwera anonimowego. Jeśli jest ustawione, sekret musi być `active`, a jego `server_url` musi być dokładnie równy temu `server_url`, w przeciwnym razie żądanie kończy się błędem (409 dla nieaktywnego sekretu, 400 dla niezgodnego URL).

Zwraca `201 Created`.

## Lista połączeń {#list-connections}

```bash
curl "https://api.sandbase.ai/v1/mcp-connections?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Paginacja offsetowa z polami `data`, `total`, `limit` i `offset`. `limit` domyślnie wynosi 20, a maksymalnie 200; brakujące, nieprawidłowe lub niedodatnie wartości dają 20. `offset` domyślnie wynosi 0; nieprawidłowe lub niedodatnie wartości dają 0. Przesuwaj się o zwrócony `limit`, aż `offset + data.length >= total`. Wyłączone zasoby pozostają widoczne na liście.

## Pobranie połączenia {#get-a-connection}

```bash
curl https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

## Zastąpienie połączenia {#replace-a-connection}

```bash
curl -X PUT https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-v2" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "row_version": 1}'
```

`PUT` zastępuje jednocześnie `name`, `server_url` i `secret_id`; pominięcie `secret_id` czyni połączenie anonimowym. `row_version` jest wymagane i musi odpowiadać bieżącej wartości zwróconej przez Get Connection. Zwraca `200 OK` ze zaktualizowanym połączeniem. Wyłączone połączenie pozostaje wyłączone po zastąpieniu, dopóki go nie włączysz.

## Włączenie połączenia {#enable-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13/enable \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-enable" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 3}'
```

`row_version` jest wymagane i musi być dodatnią liczbą całkowitą zgodną z bieżącym zasobem. Zwraca `200 OK` z połączeniem. Włączenie zachowuje ten sam identyfikator połączenia. Nie przywraca unieważnionego sekretu; najpierw zastąp połączenie nowym, aktywnym sekretem.

## Wyłączenie połączenia {#disable-a-connection}

```bash
curl -X DELETE https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-disable"
```

Zwraca `204 No Content` i ustawia `status` na `disabled`. Nowe sesje nie mogą używać połączenia, a istniejące sesje, które je zamroziły, odrzucają dalsze wejście. Już trwające wywołanie narzędzia nie jest przerywane.

## Zmiany a działające sesje {#changes-and-running-sessions}

Sesje zamrażają ustawienia połączenia w chwili startu. Po zastąpieniu połączenia lub rotacji jego sekretu nowe sesje używają nowej konfiguracji, a istniejące zachowują swoją migawkę. Wyłączenie połączenia lub unieważnienie jego sekretu blokuje zarówno nowe sesje, jak i dalsze wejście do istniejących.

## Błędy i ponawianie {#errors-and-retries}

Błędy używają [koperty błędów Agents](/api-reference/errors#agents-platform-errors). Nieprawidłowe pola lub brak klucza idempotencji przy zapisie zwracają `400 invalid_request`; nieznany lub niedostępny zasób zwraca `404 not_found`. Nieaktualne `row_version`, niezgodny stan cyklu życia lub ponowne użycie klucza tworzenia/aktualizacji z innym wejściem zwraca `409 conflict`. Przed nową aktualizacją odczytaj zasób ponownie i dla każdej nowej operacji zapisu używaj nowego klucza.

`created_at` i `updated_at` to znaczniki czasu RFC 3339 w postaci ciągów znaków.
