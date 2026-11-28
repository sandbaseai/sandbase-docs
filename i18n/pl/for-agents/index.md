---
i18nSource: 0314b37a870481ae
title: Dokumentacja czytelna dla AI
description: Wszystko, czego agent AI potrzebuje, aby znaleźć i używać API SandBase — podsumowanie na jednej stronie.
---

# Przegląd API przyjazny dla AI {#ai-friendly-api-overview}

::: info Kontrakt Session
Session (`ses_*`) uruchamia jedną zapisaną wersję Agenta; tworzysz ją bezpośrednio przez `POST /v1/agents/sessions`. Instancje środowiska wykonawczego pozostają wewnętrzne i nigdy nie są zwracane.
:::

> Zwięzła dokumentacja dla ludzi i agentów AI. Wersje w czystym tekście zoptymalizowane pod kątem przetwarzania przez LLM znajdziesz w [`llms.txt`](https://www.sandbase.ai/docs/llms.txt).

## Czym jest SandBase? {#what-is-sandbase}

SandBase to platforma infrastruktury dla agentów AI. Jeden klucz API daje dostęp do włączonych Models i APIs z zakresu języka, obrazu, wideo, audio, wyszukiwania i danych, a także do przepływów pracy Agent. Zamiast polegać na stałej liczbie, sprawdzaj aktualny katalog.

## Bazowy URL API {#api-base-url}

```
https://api.sandbase.ai/v1
```

## Uwierzytelnianie {#authentication}

Wszystkie żądania wymagają tokena Bearer:

```
Authorization: Bearer sk-YOUR_KEY
```

Klucz uzyskasz w [Developer → API Keys](https://www.sandbase.ai/console/keys).

## Szybki przykład {#quick-example}

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## Podstawowe API {#core-apis}

| Metoda | Trasa | Opis |
|--------|----------|-------------|
| `POST` | `/v1/chat/completions` | Czat zgodny z OpenAI; opcjonalne możliwości zależą od wybranego modelu |
| `POST` | `/v1/messages` | API wiadomości zgodne z Anthropic |
| `POST` | `/v1/run` | Wysyła zadanie generowania modelu zgodnie z jego schematem |
| `GET` | `/v1/run/{id}` | Odpytuje status asynchronicznego generowania i pobiera wyniki |
| `GET` | `/v1/models` | Wyświetla włączone modele logiczne; domyślnie typ LLM |
| `GET` | `/v1/models/{id_or_name}` | Pobiera szczegóły modelu, schemat, możliwości i cennik |
| `GET` | `/v1/tasks/{task_id}/cost` | Pobiera koszt i użycie zadania |

## Dodatkowe grupy API {#additional-api-groups}

Poza podstawowymi API generowania SandBase udostępnia API do zarządzania cyklem życia agentów. Typowe przepływy pracy opisuje [Przewodnik po API dla AI](./full), a pełny kontrakt — [specyfikacja OpenAPI](https://www.sandbase.ai/docs/openapi.yaml).

| Grupa | Kluczowe trasy | Przeznaczenie |
|-------|---------------|---------|
| **Agents** | `POST /v1/agents`, `GET /v1/agents`, `POST /v1/agents/{agent_id}` | Tworzenie i wersjonowanie zapisanych definicji Agents |
| **Sessions** | `POST /v1/agents/sessions`, `POST /v1/agents/sessions/{session_id}/events`, `GET /v1/agents/sessions/{session_id}/events` | Uruchamianie Agenta, wysyłanie wejścia i strumieniowanie zdarzeń na żywo |
| **Skills** | `POST /v1/skills`, `GET /v1/skills` | Wersjonowane pakiety instrukcji montowane przez Agents |
| **MCP Connections i Secrets** | `POST /v1/mcp-connections`, `POST /v1/secrets` | Zdalne narzędzia MCP przez HTTPS i ich tokeny Bearer tylko do zapisu |

Zasoby platformy Agents akceptują `Authorization: Bearer` lub `X-API-Key` i w razie błędu zwracają `{"error":{"type","code","param","message"}}`.

## Model cenowy {#pricing-model}

Płacisz za użycie. Ceny zależą od modelu i mogą się zmieniać niezależnie od tej strony:

- **Ceny modeli**: odczytaj aktualną formułę i jednostki wybranego modelu z `model_card`
- **Ceny tokenów**: mogą obejmować składniki za wejście, wyjście, cache lub rozumowanie, jeśli dany model je deklaruje
- **Multimedia i inne operacje**: mogą używać jednostek za żądanie, czas trwania, rozdzielczość lub innych jednostek specyficznych dla modelu
- **Data APIs** (wyszukiwanie, media społecznościowe, scraping, e-commerce, finanse): każda organizacja otrzymuje 100 bezpłatnych wywołań na dobę UTC, współdzielonych przez kwalifikujące się API danych; potem wywołania są rozliczane za każde wywołanie, a nie blokowane. W MCP kwalifikujące się narzędzia pokazują `pricing.free_quota` w `sandbase_inspect`, a `sandbase_account` zwraca `free_api_quota` (`daily_limit`, `used_today`, `remaining`, `resets_at`). Zobacz [Dzienne bezpłatne wywołania API](/guides/billing#daily-free-api-calls).

Aktualny identyfikator modelu znajdziesz przez `GET /v1/models`, a przed wysłaniem żądania sprawdź `GET /v1/models/{id_or_name}`. Nie zakładaj, że ceny lub rabaty za cache są wspólne dla różnych dostawców.

Gdy operacja zwraca identyfikator zadania, sprawdź jego zarejestrowany koszt:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

## Limity żądań {#rate-limits}

Nie ma opublikowanej uniwersalnej domyślnej wartości liczbowej. Żądania podlegają opcjonalnemu limitowi żądań na minutę
przypisanemu do Twojej organizacji i współdzielonemu przez wszystkie jej klucze API. Odpowiedź `429` nie zawiera nagłówków limitu ani `Retry-After`; stosuj ograniczony
wykładniczy backoff z jitterem. Zobacz [Przewodnik po błędach](./errors).

---

## Dalsza lektura {#further-reading}

- [Przewodnik po API dla AI](./full) — podstawowe przepływy pracy, struktury żądań i odpowiedzi oraz przykłady curl
- [Modele i ceny](./models) — wykrywanie modeli na żywo, ceny i wskazówki dotyczące możliwości
- [Przewodnik po błędach](./errors) — udokumentowane struktury odpowiedzi, obsługa HTTP i bezpieczne ponawianie
- [Specyfikacja OpenAPI](https://www.sandbase.ai/docs/openapi.yaml) — OpenAPI 3.1 w formacie do odczytu maszynowego

## Wersje w czystym tekście (dla agentów AI) {#plain-text-versions-for-ai-agents}

| Plik | URL | Zawartość |
|------|-----|---------|
| `llms.txt` | [/docs/llms.txt](https://www.sandbase.ai/docs/llms.txt) | Zwięzłe podsumowanie (~60 wierszy) |
| `llms-full.txt` | [/docs/llms-full.txt](https://www.sandbase.ai/docs/llms-full.txt) | Rozszerzony przewodnik po API dla AI |
| `openapi.yaml` | [/docs/openapi.yaml](https://www.sandbase.ai/docs/openapi.yaml) | Specyfikacja OpenAPI 3.1 do odczytu maszynowego |
