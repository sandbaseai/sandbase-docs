---
i18nSource: 2ba7f0f41847d04f
title: Einen Agent definieren
description: Einen versionierten Agent mit der Agents API erstellen und aktualisieren, inklusive Feldern, Grenzen, Versionen und Archivierung.
---

# Einen Agent definieren {#define-an-agent}

Erstelle einen Agent mit `POST /v1/agents`. Die API folgt dem OpenAI-Agents-Protokoll, du kannst also einfaches HTTP oder `client.beta.agents` aus dem OpenAI SDK mit `base_url="https://api.sandbase.ai/v1"` verwenden. Der Header `OpenAI-Beta` ist optional; wenn du ihn sendest, muss er `agents=v1` lauten. Was das SDK unterstützt, findest du unter [OpenAI-Kompatibilität](/agents/openai-compatibility).

## Einen Agent erstellen {#create-an-agent}

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

Die Antwort ist `201 Created` mit dem Agent: eine `agt_`-ID, `version: 1`, `row_version`, `status: "active"` und `projection_status`. Eine neue Version wird im Hintergrund für die Ausführung vorbereitet; starte Sessions, sobald `projection_status` den Wert `ready` hat.

`Idempotency-Key` ist optional. Wenn du ihn weglässt, erzeugt der Dienst einen eigenen, sodass eine wiederholte Anfrage einen zweiten Agent anlegen kann. Sende bei Wiederholungen deinen eigenen stabilen Schlüssel.

## Felder {#fields}

Der Body ist striktes JSON (bis zu 1 MiB). Unbekannte Felder liefern 400.

| Feld | Erforderlich | Grenzen und Werte |
|---|---|---|
| `model` | Ja | Modell-ID, bis zu 200 Zeichen |
| `name` | Nein | Bis zu 128 Zeichen |
| `instructions` | Nein | Bis zu 256 KiB |
| `description` | Nein | Bis zu 4096 Zeichen |
| `runtime_profile` | Nein | `codex` (Standard), `claude` oder `mcode` |
| `skills` | Nein | Bis zu 32 Referenzen. Eine neue Bindung mit `version: null` legt beim Speichern die aktuelle Standardversion fest; bestehende Bindungen behalten ihre festgelegte Version. Gib eine explizite Version an, um zu aktualisieren; siehe [Skills](/agents/mcp-tools#skills) |
| `mcp_connections` | Nein | Bis zu 32 Referenzen; siehe [MCP-Verbindungen](/agents/mcp-tools#mcp-connections) |
| `tools` | Nein | Bis zu 64 `function`-Tools und höchstens ein `web_search`-Tool |
| `text` | Nein | `format.type` `text` oder `json_schema` (Objektschema); `verbosity` `low`, `medium` oder `high` |
| `reasoning` | Nein | `effort` `none`, `minimal`, `low`, `medium`, `high`, `xhigh` oder `max`; `summary` `concise`, `detailed` oder `auto` |
| `service_tier` | Nein | `auto` (Standard), `default`, `flex`, `priority` oder `fast` |
| `metadata` | Nein | Bis zu 16 String-Paare; Schlüssel bis zu 64 und Werte bis zu 512 Zeichen |
| `note` | Nein | Änderungsnotiz, die bei der Version gespeichert wird |

## Aktuelle Einschränkungen {#current-limits}

- `web_search` muss `"mode": "disabled"` verwenden, damit Sessions starten.
- `function`-Tools lassen sich speichern, aber Runs, bei denen der Client ein Tool-Ergebnis zurückgeben muss (`requires_action`), werden noch nicht unterstützt. Eine Session in diesem Zustand liefert `502 executor_contract_error`. Gib dem Agent externe Fähigkeiten stattdessen über [MCP-Verbindungen](/agents/mcp-tools#mcp-connections).
- `multi_agent` muss weggelassen werden oder `null` sein.

## Einen Agent aktualisieren {#update-an-agent}

Es gibt zwei Formen des Updates. Beide erzeugen eine neue Version.

- `POST /v1/agents/{agent_id}` ist das Update des OpenAI SDK. Sende nur die Felder, die du ändern willst. Eine `row_version` ist nicht nötig, daher gewinnt der letzte Schreibzugriff. `description` und `note` werden in dieser Form nicht akzeptiert.
- `PATCH /v1/agents/{agent_id}` ist das Compare-and-Set-Update. Es erfordert die zuletzt gelesene `row_version` und liefert 409, wenn sich der Agent inzwischen geändert hat. Explizite `null`-Werte werden abgelehnt.

```bash
curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 2, "instructions": "Answer in five bullet points with cited sources.", "note": "Shorter answers"}'
```

## Versionen, Archivieren und Wiederherstellen {#versions-archive-and-restore}

- `GET /v1/agents/{agent_id}/versions` listet unveränderliche Snapshots auf; `GET /v1/agents/{agent_id}/versions/{version}` liest einen davon.
- `POST /v1/agents/{agent_id}/restore` mit `{"source_version": 1, "row_version": 3}` kopiert eine frühere Konfiguration in eine neue aktuelle Version.
- `POST /v1/agents/{agent_id}/archive` und `/unarchive` erwarten `{"row_version": …}`. Archivierte Agents können keine neuen Sessions starten.
- `DELETE /v1/agents/{agent_id}` archiviert den Agent. Agents werden nie endgültig gelöscht.

## Nächste Schritte {#next-steps}

- [Skills und MCP-Tools](/agents/mcp-tools)
- [Den Agent in einer Session ausführen](/agents/sessions)
- [Agents-API-Referenz](/api-reference/agents/)
