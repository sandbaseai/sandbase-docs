---
i18nSource: 2ba7f0f41847d04f
title: Definiowanie Agenta
description: "Twórz i aktualizuj wersjonowanego Agenta za pomocą Agents API: pola, limity, wersje i archiwizacja."
---

# Definiowanie Agenta {#define-an-agent}

Agenta tworzysz przez `POST /v1/agents`. API jest zgodne z protokołem OpenAI Agents, więc możesz używać zwykłego HTTP lub `client.beta.agents` z OpenAI SDK z `base_url="https://api.sandbase.ai/v1"`. Nagłówek `OpenAI-Beta` jest opcjonalny; jeśli go wysyłasz, musi mieć wartość `agents=v1`. Informacje o tym, co obsługuje SDK, znajdziesz w sekcji [Zgodność z OpenAI](/agents/openai-compatibility).

## Tworzenie Agenta {#create-an-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: create-research-agent-1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research assistant",
    "model": "deepseek/deepseek-v4-flash",
    "instructions": "Research the question, compare at least two sources, and cite them.",
    "metadata": {"team": "research"}
  }'
```

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
agent = client.beta.agents.create(
    model="deepseek/deepseek-v4-flash",
    name="Research assistant",
    instructions="Research the question, compare at least two sources, and cite them.",
    metadata={"team": "research"},
)
print(agent.id, agent.version)  # agt_..., 1
```

Odpowiedź to `201 Created` z Agentem: identyfikator `agt_`, `version: 1`, `row_version`, `status: "active"` oraz `projection_status`. Nowa wersja jest przygotowywana do wykonania w tle; uruchamiaj Sessions, gdy `projection_status` ma wartość `ready`.

`Idempotency-Key` jest opcjonalny. Gdy go pominiesz, usługa wygeneruje klucz, więc ponowione żądanie może utworzyć drugiego Agenta. Przy ponawianiu wysyłaj własny, stały klucz.

## Pola {#fields}

Treść to ścisły JSON (do 1 MiB). Nieznane pola zwracają 400.

| Pole | Wymagane | Limity i wartości |
|---|---|---|
| `model` | Tak | Identyfikator modelu, do 200 znaków |
| `name` | Nie | Do 128 znaków |
| `instructions` | Nie | Do 256 KiB |
| `description` | Nie | Do 4096 znaków |
| `runtime_profile` | Nie | `codex` (domyślnie), `claude` lub `mcode` |
| `skills` | Nie | Do 32 odwołań. Nowe powiązanie z `version: null` przypina bieżącą wersję domyślną w momencie zapisu; istniejące powiązania zachowują przypiętą wersję. Aby zaktualizować, podaj jawną wersję; zobacz [Skills](/agents/mcp-tools#skills) |
| `mcp_connections` | Nie | Do 32 odwołań; zobacz [Połączenia MCP](/agents/mcp-tools#mcp-connections) |
| `tools` | Nie | Do 64 narzędzi `function` i co najwyżej jedno narzędzie `web_search` |
| `text` | Nie | `format.type` `text` lub `json_schema` (schemat obiektu); `verbosity` `low`, `medium` lub `high` |
| `reasoning` | Nie | `effort` `none`, `minimal`, `low`, `medium`, `high`, `xhigh` lub `max`; `summary` `concise`, `detailed` lub `auto` |
| `service_tier` | Nie | `auto` (domyślnie), `default`, `flex`, `priority` lub `fast` |
| `metadata` | Nie | Do 16 par ciągów znaków; klucze do 64, a wartości do 512 znaków |
| `note` | Nie | Notatka o zmianie zapisywana przy wersji |

## Obecne ograniczenia {#current-limits}

- Aby Sessions mogły się uruchomić, `web_search` musi używać `"mode": "disabled"`.
- Narzędzia `function` można zapisać, ale Runs, które wymagają zwrócenia wyniku narzędzia przez klienta (`requires_action`), nie są jeszcze obsługiwane. Session w tym stanie zwraca `502 executor_contract_error`. Zamiast tego daj Agentowi zewnętrzne możliwości przez [połączenia MCP](/agents/mcp-tools#mcp-connections).
- `multi_agent` musi zostać pominięte lub mieć wartość `null`.

## Aktualizowanie Agenta {#update-an-agent}

Istnieją dwie formy aktualizacji. Obie tworzą nową wersję.

- `POST /v1/agents/{agent_id}` to aktualizacja w stylu OpenAI SDK. Wysyłaj tylko pola, które chcesz zmienić. `row_version` nie jest potrzebne, więc wygrywa ostatni zapis. Pola `description` i `note` nie są akceptowane w tej formie.
- `PATCH /v1/agents/{agent_id}` to aktualizacja typu compare-and-set. Wymaga ostatnio odczytanego `row_version` i zwraca 409, jeśli Agent w międzyczasie się zmienił. Jawne wartości `null` są odrzucane.

```bash
curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 2, "instructions": "Answer in five bullet points with cited sources.", "note": "Shorter answers"}'
```

## Wersje, archiwizacja i przywracanie {#versions-archive-and-restore}

- `GET /v1/agents/{agent_id}/versions` wyświetla niezmienne migawki; `GET /v1/agents/{agent_id}/versions/{version}` odczytuje jedną z nich.
- `POST /v1/agents/{agent_id}/restore` z `{"source_version": 1, "row_version": 3}` kopiuje wcześniejszą konfigurację do nowej bieżącej wersji.
- `POST /v1/agents/{agent_id}/archive` i `/unarchive` przyjmują `{"row_version": …}`. Zarchiwizowane Agents nie mogą uruchamiać nowych Sessions.
- `DELETE /v1/agents/{agent_id}` archiwizuje Agenta. Agents nigdy nie są trwale usuwane.

## Następne kroki {#next-steps}

- [Skills i narzędzia MCP](/agents/mcp-tools)
- [Uruchamianie Agenta w Session](/agents/sessions)
- [Dokumentacja Agents API](/api-reference/agents/)
