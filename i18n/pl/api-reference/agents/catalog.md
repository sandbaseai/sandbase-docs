---
i18nSource: 1b5099685e9df6ce
title: Katalog Agentów
description: Przeglądaj publiczne Agenty i sklonuj wybranego do swojej organizacji.
---

# Katalog Agentów {#agent-catalog}

Katalog zawiera Agenty, które SandBase publikuje do ponownego użycia. Wpisy katalogu są tylko do odczytu. Sklonuj wpis, aby uzyskać prywatnego Agenta w swojej organizacji, którego możesz edytować, uruchamiać i wdrażać.

| Metoda | Ścieżka | Przeznaczenie |
|---|---|---|
| `GET` | `/v1/agents/catalog` | Lista publicznych Agentów |
| `GET` | `/v1/agents/catalog/{agent_id}` | Pobranie jednego publicznego Agenta, opcjonalnie w wersji `?version=` |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | Skopiowanie go do Twojej organizacji |

## Lista Agentów z katalogu {#list-catalog-agents}

Paginacja kursorowa z parametrami `limit` (1-100), `after` i `order`.

```bash
curl "https://api.sandbase.ai/v1/agents/catalog?limit=20" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Każdy wpis zawiera `id`, `object: "agent"`, `visibility: "public"`, `version`, `name`, `description`, `model`, `created_at` i `updated_at`.

## Pobieranie Agenta z katalogu {#get-a-catalog-agent}

```bash
curl "https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60?version=2" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`version` jest opcjonalny i musi być dodatnią liczbą całkowitą. Odpowiedź szczegółowa zawiera dodatkowo obiekt `configuration` tylko do odczytu (nazwa, opis, model, instrukcje, profil środowiska uruchomieniowego, metadane, narzędzia, tekst, rozumowanie i Skills).

## Klonowanie Agenta z katalogu {#clone-a-catalog-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/clone \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: clone-research-agent" \
  -H "Content-Type: application/json" \
  -d '{"name": "My research assistant"}'
```

Treść żądania przyjmuje opcjonalne pola `version` (dodatnia liczba całkowita, domyślnie bieżąca wersja publiczna) i `name` (do 128 znaków). Odpowiedź to `201 Created` z pełnym [obiektem Agent](./create), który ma nowy identyfikator `agt_` w Twojej organizacji. Nagłówek `Idempotency-Key` jest opcjonalny; wyślij stały klucz, aby ponowienie nie utworzyło drugiej kopii.

Po sklonowaniu [utwórz Session](/api-reference/sessions/create), aby go przetestować.
