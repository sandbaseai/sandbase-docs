---
i18nSource: 8c960d117a998817
title: Modele obrazów i wideo
description: Generuj obrazy i wideo asynchronicznie za pomocą wspólnego Run API w SandBase.
---

# Modele obrazów i wideo {#image-and-video-models}

Modele obrazów i wideo korzystają ze wspólnego asynchronicznego Run API w SandBase. Wyślij zadanie
przez `POST /v1/run`, a następnie odpytuj `GET /v1/run/{id}`, aż uruchomienie osiągnie
status końcowy.

## Wysyłanie zadania {#submit-a-task}

Użyj dokładnego identyfikatora modelu ze strony [Modele obrazów i wideo](https://www.sandbase.ai/models/image-video). Pozostałe
pola żądania zależą od modelu; wymagane dane wejściowe i limity znajdziesz w dokumentacji API
danego modelu.

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<model-id>",
    "prompt": "A cinematic product shot at sunrise."
  }'
```

Odpowiedź zawiera nieprzezroczysty `id` oraz `status`, np. `pending` lub
`running`.

## Odpytywanie o wynik {#poll-for-the-result}

```bash
curl https://api.sandbase.ai/v1/run/<run-id> \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Odpytuj dalej, aż `status` przyjmie wartość `completed`, `failed` lub `timeout`. Ukończone
uruchomienia zawierają wyniki zależne od możliwości, np. URL obrazu lub wideo. Zachowaj
identyfikator uruchomienia i traktuj odpowiedź uruchomienia jako wiarygodne źródło statusu.

## Wywołania zwrotne webhook {#webhook-callbacks}

Obsługiwane zadania asynchroniczne mogą też ustawić `webhook_url` w żądaniu wysłania.
Wywołanie zwrotne jest wskazówką o dostarczeniu, a nie zamiennikiem odpytywania; nadal
używaj `GET /v1/run/{id}` i bezpiecznie obsługuj zduplikowane lub opóźnione wywołania zwrotne. Wspólny
kontrakt wywołań zwrotnych opisuje strona
[Uruchamianie możliwości](/api-reference/models/run#webhook-callbacks).

## Możliwości API używają ścieżki wynikającej z URL {#api-capabilities-use-a-url-derived-path}

Wspólne Run API służy do generowania przez modele. Możliwości API z
[katalogu APIs](https://www.sandbase.ai/apis) używają
innej trasy wynikającej z URL: `GET` lub `POST /v1/api/{vendor}/{upstream_path}`.
Nazwa możliwości z prefiksem dostawcy pochodzi z Models API lub katalogu APIs, więc
pole `model` można pominąć w treści POST:

```bash
curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

Ta trasa jest przeznaczona dla możliwości API i nie zastępuje `/v1/run` przy
wywoływaniu modeli obrazów lub wideo. Jeśli wybrana możliwość API jest asynchroniczna,
odpytuj zwrócony identyfikator uruchomienia przez `GET /v1/run/{id}`.

## Następne kroki {#next-steps}

- [Modele obrazów i wideo](https://www.sandbase.ai/models/image-video)
- [Uruchamianie możliwości](/api-reference/models/run)
- [Pobieranie wyniku uruchomienia](/api-reference/models/run-get)
- [API Passthrough](/api-reference/models/api-passthrough)
