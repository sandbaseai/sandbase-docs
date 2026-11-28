---
i18nSource: dab112fdbbc56799
title: Poświadczenia dla narzędzi MCP
description: Przechowuj tokeny Bearer tylko do zapisu jako Secrets, aby Agents mogły wywoływać uwierzytelnione serwery MCP.
---

# Poświadczenia dla narzędzi MCP {#credentials-for-mcp-tools}

Gdy serwer MCP wymaga uwierzytelnienia, zapisz jego token Bearer jako **Secret** i dołącz Secret do [połączenia MCP](/agents/mcp-tools#mcp-connections). Środowisko wykonawcze wysyła token wyłącznie do tego serwera.

## Jak działają Secrets {#how-secrets-work}

- `kind` ma zawsze wartość `mcp_bearer`: token Bearer dla jednego serwera MCP.
- Każdy Secret jest powiązany z jednym konkretnym `server_url`. Połączenie może go użyć tylko wtedy, gdy jego `server_url` jest zgodny. Aby użyć innego URL, utwórz kolejny Secret.
- Token jest tylko do zapisu. API zwraca nazwę, URL, status i `row_version` Secretu, nigdy token.
- Secrets nie są zmiennymi środowiskowymi. Nie są wstrzykiwane do środowiska uruchomieniowego Agent, a Agents nie mogą ich odczytać.

Wcześniejsze wersje SandBase przechowywały poświadczenia o zasięgu obszaru roboczego lub Agent i wstrzykiwały je jako zmienne środowiskowe, np. `GITHUB_TOKEN`. Ten model został wycofany, a jego rekordy nie są migrowane. Wartości, których nadal potrzebujesz, utwórz ponownie jako Secrets w połączeniach MCP.

## Przez API {#with-the-api}
Twórz, rotuj i unieważniaj Secrets przez API. Ten przewodnik stanowi kontrakt API; strona Credentials w Console, otwierana z edytora Agent, nie jest źródłem referencyjnym dla działania Secrets. Wywołuj te endpointy z zaufanego backendu, nigdy z kodu przeglądarki: przyjmują klucz API SandBase i token w postaci jawnej.

| Metoda | Ścieżka | Cel |
|---|---|---|
| `POST` | `/v1/secrets` | [Utworzenie Secretu](#create-a-secret) |
| `GET` | `/v1/secrets` | [Lista Secrets](#list-secrets) |
| `GET` | `/v1/secrets/{secret_id}` | [Pobranie Secretu](#get-a-secret) |
| `POST` | `/v1/secrets/{secret_id}/rotate` | [Rotacja tokena](#rotate-a-secret) |
| `DELETE` | `/v1/secrets/{secret_id}` | [Unieważnienie Secretu](#revoke-a-secret) |

Każdy zapis wymaga `Idempotency-Key` (1-128 bajtów, bez białych znaków na początku i końcu). Obiekt Secret ma pola `id` (prefiks `sec_`), `name`, `kind`, `server_url`, `status`, `row_version`, `created_at` i `updated_at`. `status` ma wartość `pending` podczas zapisywania tokena, `active`, gdy można go używać, oraz `disabled` po unieważnieniu. `created_at` i `updated_at` to znaczniki czasu RFC 3339 w postaci ciągów znaków.

### Utworzenie Secretu {#create-a-secret}

```bash
python3 -c 'import json, os; print(json.dumps({"name": "GitHub MCP token", "kind": "mcp_bearer", "server_url": "https://mcp.example.com/github", "token": os.environ["GITHUB_MCP_TOKEN"]}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

- `kind` musi mieć wartość `mcp_bearer`.
- `server_url` musi używać HTTPS bez danych użytkownika, zapytania ani fragmentu. Secret działa tylko dla tego konkretnego URL.
- `name` i `token` są wymagane i nie mogą być puste. `name` może mieć do 128 bajtów, `token` do 16384 bajtów, a `server_url` do 2048 bajtów.

Odpowiedź to `201 Created` bez tokena. Użyj identyfikatora `sec_` jako `secret_id` podczas [tworzenia połączenia MCP](/api-reference/mcp-connections/#create-a-connection).

### Lista Secrets {#list-secrets}

```bash
curl "https://api.sandbase.ai/v1/secrets?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Paginacja offsetowa z polami `data`, `total`, `limit` i `offset`. `limit` domyślnie wynosi 20, maksymalnie 200; brakujące, nieprawidłowe lub niedodatnie wartości dają 20. `offset` domyślnie wynosi 0; nieprawidłowe lub niedodatnie wartości dają 0. Przesuwaj się o zwrócony `limit`, aż `offset + data.length >= total`. Wyłączone Secrets pozostają na liście.

### Pobranie Secretu {#get-a-secret}

```bash
curl https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

### Rotacja Secretu {#rotate-a-secret}

Ustaw `SECRET_ROW_VERSION` na najnowszą wartość `row_version` z operacji pobrania Secretu.

```bash
python3 -c 'import json, os; print(json.dumps({"token": os.environ["GITHUB_MCP_TOKEN"], "row_version": int(os.environ["SECRET_ROW_VERSION"])}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61/rotate \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token-rotate-1" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

Rotacja zastępuje token, zachowując ten sam Secret i `server_url`. Wymagane są `token` i dodatnia liczba całkowita `row_version`, Secret musi mieć status `active`, a `row_version` musi odpowiadać najnowszej wartości. Zwraca `201 Created`. Nowe Sessions używają nowego tokena; Sessions, które już się rozpoczęły, zachowują zamrożone poświadczenie.

### Unieważnienie Secretu {#revoke-a-secret}

```bash
curl -X DELETE https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-token-revoke"
```

Zwraca `204 No Content` i ustawia `status` na `disabled`. Połączenia używające tego Secretu przestają działać dla nowych Sessions i dla dalszego wejścia do istniejących Sessions. Unieważnienia nie można cofnąć: utwórz nowy Secret i zastąp połączenie.

### Błędy i ponowienia {#errors-and-retries}

Błędy używają [koperty błędów Agents](/api-reference/errors#agents-platform-errors). Nieprawidłowe pola lub brak klucza idempotencji przy zapisie zwracają `400 invalid_request`; nieznany lub niedostępny Secret zwraca `404 not_found`. Nieaktualny `row_version`, niezgodny stan cyklu życia lub ponowne użycie klucza tworzenia z innym wejściem zwraca `409 conflict`. Przed ponowieniem odczytaj Secret ponownie i używaj nowego klucza dla każdego nowego zapisu.

## Bezpieczeństwo {#security}

- Twórz i rotuj Secrets z zaufanego backendu, nigdy z kodu przeglądarki.
- Odczytuj tokeny z własnego magazynu sekretów lub środowiska, jak `$GITHUB_MCP_TOKEN` powyżej, zamiast wklejać je do skryptów.
- Nie umieszczaj tokenów w instrukcjach, wejściu Session, metadanych ani pakietach Skill.
- Unieważnij Secret, gdy tylko jego token mógł wyciec, a następnie utwórz nowy i zastąp połączenie.

## Następne kroki {#next-steps}

- [Skills i narzędzia MCP](/agents/mcp-tools)
- [API połączeń MCP](/api-reference/mcp-connections/)
