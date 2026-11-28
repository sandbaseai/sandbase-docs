---
i18nSource: e904f2b8bbd0ccc4
title: Sesje
description: Uruchamiaj Agent w sesji, strumieniuj jego zdarzenia, odczytuj historię, dołączaj pliki i obsługuj błędy.
---

# Sesje {#sessions}

**Sesja** (Session) uruchamia jedną zapisaną wersję Agent w hostowanej chmurze SandBase; nie wybierasz środowiska wykonawczego. Jej identyfikator zaczyna się od `ses_`, a wszystkie ścieżki sesji znajdują się pod `/v1/agents/sessions`. Sesja zamraża wersję Agent, wersje Skills i konfigurację połączeń MCP, z którymi wystartowała.

## Jak rozpoczynają się sesje {#how-sessions-start}

Utwórz sesję przez `POST /v1/agents/sessions`. Sesja zgłasza `source: "direct"`.

## Uruchamianie sesji {#run-a-session}

Natywny strumień zdarzeń działa **tylko na żywo**: po rozłączeniu zdarzenia nie są odtwarzane. Otwórz go przed wysłaniem wejścia, a historię odczytuj z elementów (items) lub tur (turns).

```bash
# 1. Create the Session
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-2026-10-06" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60"}'

# 2. In another terminal, follow live events (server-sent events)
curl -N https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY"

# 3. Send input (202 Accepted, no body)
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "List three notable launches this week."}]}'

# 4. Read the history afterwards
curl "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Ten sam przepływ z oficjalnym SDK OpenAI dla Pythona. Najpierw otwórz strumień, wyślij wejście z innego wątku i zatrzymaj się na końcowym zdarzeniu tury. Wersję dla Node.js i różnice w SDK znajdziesz w sekcji [Zgodność z OpenAI](/agents/openai-compatibility).

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
import threading
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
session = client.beta.agents.sessions.create(
    agent_id="agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
    environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
)

def send_input():
    client.beta.agents.sessions.events.create(
        session.id,
        events=[{
            "type": "agent.session.input.message",
            "input": [{"role": "user", "content": [{"type": "input_text", "text": "List three notable launches this week."}]}],
        }],
        idempotency_key="market-scan-input-1",
    )

with client.beta.agents.sessions.events.stream(session.id) as stream:
    threading.Thread(target=send_input).start()
    for event in stream:
        print(event.type)
        if event.type in ("agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"):
            break
```

Każde wysłanie zawiera dokładnie jedno zdarzenie. `input` to ciąg tekstowy lub tablica z dokładnie jedną wiadomością użytkownika, która ma dokładnie jedną część `input_text`: `[{"role": "user", "content": [{"type": "input_text", "text": "…"}]}]`. Każdy inny kształt zwraca `400 invalid_request`. Aby zatrzymać trwającą turę, wyślij `{"type": "agent.session.input.cancel"}` lub wywołaj `POST /v1/agents/sessions/{session_id}/cancel` z nagłówkiem `Idempotency-Key`. Anulowanie bezczynnej sesji i tak zwraca `202 {"accepted": true}` i niczego nie zmienia. Pierwsze `input` możesz też przekazać przy tworzeniu sesji. `stream: true` przy tworzeniu nie jest obsługiwane.

## Status i błędy {#status-and-failures}

| Pole | Wartości | Znaczenie |
|---|---|---|
| `status` | `idle`, `in_progress`, `failed` | Stan wykonania sesji |
| `lifecycle_status` | `active`, `archived` | Czy sesja przyjmuje wejście |
| `failure` | `null` lub `{code, message, action, retryable?}` | Publiczna przyczyna błędu i sugerowany następny krok |

`failure.action` mówi, co zrobić: `retry_later`, `inspect_history`, `create_new_session`, `check_model_account` lub `create_session_with_updated_model_provider`. Zobacz [tabelę kodów błędów](/api-reference/sessions/#status-fields).

Narzędzia funkcyjne, które proszą klienta o wynik (`requires_action`), nie są jeszcze obsługiwane; odczyt takiej sesji zwraca `502 executor_contract_error`.

Jeśli wysłanie zwraca `409 session_input_pending`, wcześniejsze wejście jest nadal dostarczane. Poczekaj i odczytaj sesję; nie wysyłaj ponownie z nowym `Idempotency-Key`, bo wejście mogłoby zostać wykonane dwa razy.

## Archiwizacja {#archive}

`DELETE /v1/agents/sessions/{session_id}` archiwizuje sesję; sesje nie są trwale usuwane. `POST /v1/agents/sessions/{session_id}/archive` i `/unarchive` przyjmują `{"row_version": …}`. Zarchiwizowane sesje zachowują historię, ale odrzucają wejście, aktualizacje metadanych i strumienie.

## Załączniki {#attachments}

Prześlij plik do przestrzeni roboczej sesji przez `POST /v1/agents/sessions/{session_id}/files` (pole multipart `file`, do 5 MiB, wymagany `Idempotency-Key`). Obsługiwane typy to `.txt`, `.md`, `.csv`, `.log`, `.json`, `.pdf`, `.png`, `.jpg`, `.jpeg` i `.webp`. Gdy `status` pliku ma wartość `ready`, wyślij go razem z maksymalnie dziewięcioma innymi:

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-2" \
  -H "Content-Type: application/json" \
  -d '{"input": "Summarize the attached report.", "file_ids": ["fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72"]}'
```

## Ponowne łączenie klientów {#reconnecting-clients}

Klienci w stylu przeglądarkowym, którzy po zerwaniu połączenia potrzebują spójnego widoku, mogą wywołać `POST /v1/agents/sessions/{session_id}/reconnect`. Zwraca to sesję i `stream_url` dla `GET /v1/agents/sessions/{session_id}/events/stream`, który najpierw wysyła `session.snapshot`, a potem zdarzenia na żywo i `heartbeat`. Jeśli ten strumień wyemituje `stream.interrupted`, połącz się ponownie zamiast ponownie wysyłać wejście.

## Repozytorium GitHub {#github-repository}

Przy tworzeniu wyślij `github_workspace`, aby sklonować repozytorium GitHub do `/workspace` i pozwolić Agent wypychać zmiany do własnych gałęzi sesji. Zobacz [Przestrzeń robocza z repozytorium GitHub](/agents/github-workspace).

## Poświadczenia modelu {#model-credentials}

Sesja wywołuje modele kluczem API, którym została utworzona, chyba że wyślesz `model_provider`. Użyj `{"type": "custom", "base_url": "https://…", "api_key": "…"}`, aby korzystać z własnego endpointu HTTPS zgodnego z OpenAI. `model_provider` jest tylko do zapisu.

## Identyfikatory {#ids}

| Prefiks | Zasób |
|---|---|
| `agt_` | Agent |
| `ses_` | Sesja |
| `skl_` | Skill |
| `mcp_` | Połączenie MCP |
| `sec_` | Sekret |
| `fil_` | Załącznik sesji |

Traktuj identyfikatory jako nieprzezroczyste ciągi znaków.

## Kolejne kroki {#next-steps}

- [Dokumentacja Sessions API](/api-reference/sessions/)
- [Zgodność z OpenAI](/agents/openai-compatibility)

## Pliki przestrzeni roboczej i wygenerowane artefakty {#workspace-files-and-generated-artifacts}

Te trzy zasoby służą różnym celom:

| Zasób | Zastosowanie | Paginacja |
|---|---|---|
| [Załączniki](/api-reference/sessions/list-files) | Przesłane pliki, do których możesz się odwołać w wejściu przez `file_id` | `limit` / `offset` |
| [Pliki przestrzeni roboczej](/api-reference/sessions/list-workspace-files) | Bieżące ścieżki i rozmiary plików w katalogu przestrzeni roboczej | `page` / `next` |
| [Artefakty](/api-reference/sessions/list-artifacts) | Niezmienne wygenerowane wyniki dostępne do pobrania | `after` / `last_id` |

Wyświetl listę artefaktów, aby uzyskać identyfikator `art_`, a następnie przekaż dokładnie ten identyfikator do [Download Artifact](/api-reference/sessions/download-artifact). Ścieżka w przestrzeni roboczej ani `file_id` załącznika nie mogą go zastąpić. Lista plików przestrzeni roboczej zwraca tylko metadane i nie jest API do pobierania dowolnych ścieżek. Artefakty można pobierać jako całe pliki do 200 MiB; częściowe pobieranie z nagłówkiem `Range` nie jest obsługiwane.
