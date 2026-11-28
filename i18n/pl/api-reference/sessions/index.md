---
i18nSource: 99170a141af66587
title: Sessions API
description: Uruchamiaj zapisaną wersję Agenta, wysyłaj wejście, strumieniuj zdarzenia i odczytuj historię Session.
---

# Sessions API {#sessions-api}

Session uruchamia jedną zapisaną wersję [Agenta](/api-reference/agents/) w hostowanej chmurze SandBase; nie wybiera się środowiska wykonawczego. Identyfikatory Session mają prefiks `ses_`. Sessions są podzasobem Agents: każda ścieżka zaczyna się od `/v1/agents/sessions`.

Standardowe operacje są zgodne z protokołem OpenAI Agents (`client.beta.agents.sessions`); co oficjalne SDK potrafi, a czego nie, opisuje sekcja [Zgodność z OpenAI](/agents/openai-compatibility). Rozszerzenia SandBase dodają zmianę nazwy, stan archiwizacji, anulowanie, załączniki, metadane plików obszaru roboczego, niezmienne artefakty oraz strumień produktowy z możliwością ponownego połączenia.

::: info Skąd pochodzą Sessions
Session tworzysz bezpośrednio przez `POST /v1/agents/sessions`. Session zgłasza `source: "direct"` i `source_id: null`.
:::

## Zalecany przebieg {#recommended-flow}

1. [Utwórz Session](./create) dla zapisanego Agenta. Session zamraża wybraną wersję Agenta i połączenia MCP oraz używa wersji Skills już przypiętych do tej wersji Agenta.
2. [Otwórz strumień zdarzeń](./stream) przez `GET /v1/agents/sessions/{session_id}/events`. Strumień przekazuje tylko zdarzenia na żywo, więc otwórz go przed wysłaniem wejścia.
3. [Wyślij wejście](./send-events) przez `POST /v1/agents/sessions/{session_id}/events` ze zdarzeniem `agent.session.input.message`. Wywołanie zwraca 202.
4. Odczytaj wyniki ze strumienia lub później z [items](./items) i [turns](./turns).

## Operacje na Session {#session-operations}

| Metoda | Ścieżka | Przeznaczenie |
|---|---|---|
| `POST` | `/v1/agents/sessions` | [Utwórz Session](./create) |
| `GET` | `/v1/agents/sessions` | [Wyświetl Sessions](./list) |
| `GET` | `/v1/agents/sessions/{session_id}` | [Pobierz Session](./get) |
| `POST` | `/v1/agents/sessions/{session_id}` | [Zastąp metadane](./update) |
| `PATCH` | `/v1/agents/sessions/{session_id}` | [Zmień nazwę](./rename) z `row_version` |
| `DELETE` | `/v1/agents/sessions/{session_id}` | [Usuń](./delete), co archiwizuje Session |
| `POST` | `/v1/agents/sessions/{session_id}/events` | [Wyślij jedno zdarzenie wejścia lub anulowania](./send-events) |
| `GET` | `/v1/agents/sessions/{session_id}/events` | [Strumieniuj zdarzenia na żywo](./stream) (SSE) |
| `GET` | `/v1/agents/sessions/{session_id}/items` | [Wyświetl elementy](./items) |
| `GET` | `/v1/agents/sessions/{session_id}/turns` | [Wyświetl tury](./turns) |
| `GET` | `/v1/agents/sessions/{session_id}/turns/{turn_id}` | [Pobierz jedną turę](./get-turn) |
| `POST` | `/v1/agents/sessions/{session_id}/cancel` | [Anuluj trwającą turę](./cancel) |
| `POST` | `/v1/agents/sessions/{session_id}/archive` | [Archiwizuj](./archive) |
| `POST` | `/v1/agents/sessions/{session_id}/unarchive` | [Przywróć z archiwum](./unarchive) |
| `POST` | `/v1/agents/sessions/{session_id}/reconnect` | [Połącz ponownie](./reconnect) po zerwaniu strumienia |
| `GET` | `/v1/agents/sessions/{session_id}/events/stream` | [Strumień: migawka, potem zdarzenia na żywo](./stream-snapshot) (SSE) |
| `POST` | `/v1/agents/sessions/{session_id}/files` | [Prześlij załącznik](./upload-file) |
| `GET` | `/v1/agents/sessions/{session_id}/files` | [Wyświetl załączniki](./list-files) |
| `GET` | `/v1/agents/sessions/{session_id}/files/{file_id}/content` | [Pobierz załącznik](./download-file) |
| `DELETE` | `/v1/agents/sessions/{session_id}/files/{file_id}` | [Usuń załącznik](./delete-file) |
| `GET` | `/v1/agents/sessions/{session_id}/workspace-files` | [Wyświetl metadane plików obszaru roboczego](./list-workspace-files) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts` | [Wyświetl niezmienne artefakty](./list-artifacts) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` | [Pobierz artefakt](./download-artifact) |

## Pola statusu {#status-fields}

- `status` to status wykonania: `idle`, `in_progress` lub `failed`. Narzędzia funkcyjne wymagające wyniku od klienta (`requires_action`) nie są jeszcze obsługiwane; odczyt takiej Session zwraca `502 executor_contract_error`.
- `lifecycle_status` ma wartość `active` lub `archived`. Zarchiwizowane Sessions odrzucają wejście, aktualizacje metadanych i strumienie. `DELETE` archiwizuje; `unarchive` przywraca.
- `failure` to `null` lub obiekt z polami `code`, `message`, `action` i czasem `retryable`.

| `failure.code` | Znaczenie | Sugerowane `action` |
|---|---|---|
| `session_creation_rejected` | Warstwa wykonawcza odrzuciła Session | `create_new_session` |
| `model_authentication_failed` | Dostawca modelu odrzucił klucz | `create_session_with_updated_model_provider` |
| `model_rate_limited` | Dostawca modelu ogranicza liczbę żądań (można ponowić) | `retry_later` |
| `model_quota_exceeded` | Konto modelu nie ma dostępnego limitu | `check_model_account` |
| `context_limit_exceeded` | Rozmowa przekracza kontekst modelu | `create_new_session` |
| `environment_connection_timeout` | Środowisko nie połączyło się na czas (można ponowić) | `retry_later` |
| `runtime_unavailable` | Środowisko wykonawcze jest niedostępne (można ponowić) | `retry_later` |
| `model_request_failed` | Żądanie do modelu nie zostało ukończone | `inspect_history` |
| `model_configuration_rejected` | Model lub warstwa wykonawcza odrzuciły konfigurację | `create_session_with_updated_model_provider` |
| `execution_failed` | Błąd bez bardziej szczegółowej publicznej przyczyny | `inspect_history` |

Wyniki list mogą też zawierać wiersze zastępcze z `session_not_ready`, `session_execution_unavailable`, `session_configuration_unavailable` lub `session_snapshot_unavailable`, gdy Session nie da się odczytać na żywo.

## Poświadczenia modelu {#model-credentials}

Domyślnie Session wywołuje modele tym samym kluczem API SandBase, którym została utworzona. Aby wybrać jawnie, wyślij `model_provider`:

- `{"type": "sandbase"}` używa klucza, którym wywołujesz. `base_url` jest niedozwolony.
- `{"type": "custom", "base_url": "https://…", "api_key": "…"}` wywołuje Twój własny endpoint HTTPS zgodny z OpenAI. URL nie może zawierać poświadczeń, zapytania ani fragmentu, a SandBase nigdy nie przełącza się awaryjnie na Twój klucz SandBase.

`model_provider` jest tylko do zapisu i nigdy nie pojawia się w odpowiedziach.

## Dopuszczenie i błędy {#admission-and-errors}

Tworzenie Session i wysyłanie wejścia sprawdzają dopuszczenie do wykonania: `402 spending_limit_exceeded`, gdy wyczerpano limit klucza lub saldo organizacji, `403 org_disabled`, gdy organizacja nie może uruchamiać Agents, oraz `503 admission_unavailable`, gdy sprawdzenia nie da się ukończyć. Odczyty, anulowanie i archiwizacja nie są blokowane przez saldo.

Wysłanie wejścia może też zwrócić `409 session_input_pending` (wcześniejsze wejście jest jeszcze dostarczane; poczekaj i nie wysyłaj ponownie z nowym kluczem), `409 session_input_expired` (przed ponownym wysłaniem sprawdź historię) lub `409 session_environment_unavailable` (poczekaj lub utwórz nową Session). Zobacz [Błędy](/api-reference/errors#agents-platform-errors).

## Stronicowanie {#pagination}

Sessions, elementy, tury i artefakty używają stronicowania kursorowego (`limit` 1-100, `after`, `order`). Załączniki używają stronicowania offsetowego (`limit` 1-100, `offset`).

Pliki obszaru roboczego używają zamiast tego stronicowania `page` / `next`. Zobacz [Wyświetl pliki obszaru roboczego](./list-workspace-files).
