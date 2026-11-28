---
i18nSource: 7b24f4b0b5cd2c33
title: Build Agent
description: Definiuj, testuj i uruchamiaj wielokrotnego użytku, wersjonowane Agents w SandBase Sessions.
---

# Build Agent {#build-agent}

Build Agent to miejsce, w którym definiujesz i testujesz Agent, a następnie decydujesz, jak ma działać.

Agent to zapisana, wersjonowana konfiguracja: Model, instrukcje, profil środowiska uruchomieniowego, Skills oraz połączenia MCP z zewnętrznymi narzędziami. Zapisanie Agenta go nie uruchamia.

## Czym jest Agent {#what-an-agent-is}

| Pytanie | Gdzie to jest |
|---|---|
| Co ma robić? | `instructions` |
| Który model wykonuje pracę? | `model`, identyfikator modelu z [Models API](/api-reference/models/) |
| Co potrafi? | [Skills](/agents/mcp-tools#skills), wersjonowane pakiety instrukcji |
| Jakie zewnętrzne narzędzia może wywoływać? | [Połączenia MCP](/agents/mcp-tools#mcp-connections), z [poświadczeniami](/agents/api-credentials), gdy serwer wymaga tokena |
| Jak działa? | W [Session](/agents/sessions) |

Każda faktyczna zmiana tworzy nową, niezmienną wersję. W dowolnym momencie możesz wyświetlić listę wersji i przywrócić wcześniejszą.

## Jak działa Agent {#how-an-agent-runs}

Agent uruchamiasz w [Session](/agents/sessions). Session to zasób `ses_`, do którego wysyłasz wejście i z którego strumieniujesz zdarzenia, niezależnie od tego, czy chodzi o interaktywną rozmowę, przebieg testowy, czy wywołanie z Twojej aplikacji. Każda Session zamraża wersję Agenta, z którą wystartowała, więc możesz dalej edytować Agenta bez zmieniania istniejących Sessions.

## Cykl życia Agenta: Szkic → Test w Session → Uruchamianie z aplikacji → Przegląd Sessions {#agent-lifecycle-draft-→-test-in-a-session-→-run-from-your-app-→-inspect-sessions}

### 1. Szkic {#_1-draft}

Utwórz Agenta w Console w **Build → Agents** lub za pomocą [`POST /v1/agents`](/agents/agent-api). Zacznij od najmniejszego użytecznego przepływu i dodawaj Skills oraz połączenia MCP dopiero wtedy, gdy instrukcje ich wymagają.

### 2. Test w Session {#_2-test-in-a-session}

Utwórz Session dla Agenta, wyślij reprezentatywne wejście i przeanalizuj wynik, aktywność narzędzi oraz błędy. Testuj brakujące wejście, niedostępne narzędzia, puste wyniki i wymagania dotyczące formatu wyjścia, a nie tylko scenariusz pozytywny.

### 3. Uruchamianie z aplikacji {#_3-run-from-your-app}

Twórz Sessions dla przetestowanego Agenta z poziomu aplikacji za pomocą [Sessions API](/api-reference/sessions/).

### 4. Przegląd Sessions {#_4-inspect-sessions}

Odczytuj elementy i tury każdej Session za pomocą Sessions API, aby przejrzeć całą rozmowę, aktywność narzędzi i błędy.

## Lista kontrolna przed produkcją {#production-checklist}

- `model` używa aktualnego identyfikatora modelu z Models API.
- Skills są przypięte do wersji, gdy zachowanie nie może zmieniać się niepostrzeżenie.
- Połączenia MCP udostępniają tylko narzędzia potrzebne Agentowi, za pomocą `allowed_tools`.
- Tokeny są przechowywane jako [Secrets](/agents/api-credentials), nigdy nie są wpisywane do instrukcji, wejścia ani metadanych.
- Tworzenie Session wysyła `Idempotency-Key`, a ponowienia używają go ponownie.
- Status i błędy Session są sprawdzane po uruchomieniu.

## Agents z katalogu {#catalog-agents}

Publiczny [katalog Agents](/api-reference/agents/catalog) zawiera Agents opublikowane przez SandBase. Możesz odczytać Agenta z katalogu, ale aby go zmienić, najpierw sklonuj go do swojej organizacji za pomocą `POST /v1/agents/catalog/{agent_id}/clone`. Klon to nowy prywatny Agent, którego jesteś właścicielem i który możesz uruchamiać.

::: tip Korzystanie z OpenAI SDK
Agents, Sessions i Skills są zgodne z OpenAI Agents API, więc oficjalny OpenAI SDK działa z `base_url="https://api.sandbase.ai/v1"`. Zweryfikowane przykłady i różnice znajdziesz w sekcji [Zgodność z OpenAI](/agents/openai-compatibility).
:::

## Następne kroki {#next-steps}

- [Definiowanie Agenta](/agents/agent-api)
- [Zgodność z OpenAI](/agents/openai-compatibility)
- [Skills i narzędzia MCP](/agents/mcp-tools)
- [Sessions](/agents/sessions)
