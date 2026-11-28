---
i18nSource: e904f2b8bbd0ccc4
title: Sessions
description: Führe einen Agent in einer Session aus, streame seine Events, lies den Verlauf, hänge Dateien an und behandle Fehler.
---

# Sessions {#sessions}

Eine **Session** führt eine gespeicherte Agent-Version in der gehosteten Cloud von SandBase aus; eine Ausführungsumgebung wählst du nicht selbst. Ihre ID beginnt mit `ses_`, und alle Session-Pfade liegen unter `/v1/agents/sessions`. Die Session friert die Agent-Version, die Skill-Versionen und die MCP-Verbindungskonfiguration ein, mit denen sie gestartet wurde.

## Wie Sessions starten {#how-sessions-start}

Erstelle eine Session mit `POST /v1/agents/sessions`. Die Session meldet `source: "direct"`.

## Session ausführen {#run-a-session}

Der native Event-Stream ist **nur live**: Nach einem Verbindungsabbruch werden Events nicht erneut abgespielt. Öffne ihn, bevor du Eingaben sendest, und lies den Verlauf aus Items oder Turns.

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

Derselbe Ablauf mit dem offiziellen OpenAI Python SDK: Öffne zuerst den Stream, sende die Eingabe aus einem anderen Thread und halte beim abschließenden Turn-Event an. Die Node.js-Version und die Unterschiede der SDKs findest du unter [OpenAI-Kompatibilität](/agents/openai-compatibility).

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

Jeder Sendevorgang enthält genau ein Event. `input` ist ein Text-String oder ein Array mit genau einer User-Nachricht, die genau einen `input_text`-Teil hat: `[{"role": "user", "content": [{"type": "input_text", "text": "…"}]}]`. Jede andere Form liefert `400 invalid_request`. Um den laufenden Turn zu stoppen, sende `{"type": "agent.session.input.cancel"}` oder rufe `POST /v1/agents/sessions/{session_id}/cancel` mit einem `Idempotency-Key` auf. Der Abbruch einer inaktiven Session liefert trotzdem `202 {"accepted": true}` und ändert nichts. Du kannst beim Erstellen der Session auch schon ein erstes `input` übergeben. `stream: true` beim Erstellen wird nicht unterstützt.

## Status und Fehler {#status-and-failures}

| Feld | Werte | Bedeutung |
|---|---|---|
| `status` | `idle`, `in_progress`, `failed` | Ausführungszustand der Session |
| `lifecycle_status` | `active`, `archived` | Ob die Session Eingaben annimmt |
| `failure` | `null` oder `{code, message, action, retryable?}` | Öffentlicher Grund für einen Fehler und der empfohlene nächste Schritt |

`failure.action` sagt dir, was zu tun ist: `retry_later`, `inspect_history`, `create_new_session`, `check_model_account` oder `create_session_with_updated_model_provider`. Siehe die [Tabelle der Fehlercodes](/api-reference/sessions/#status-fields).

Function-Tools, die vom Client ein Ergebnis anfordern (`requires_action`), werden noch nicht unterstützt; das Lesen einer solchen Session liefert `502 executor_contract_error`.

Liefert ein Sendevorgang `409 session_input_pending`, wird eine frühere Eingabe noch zugestellt. Warte und lies die Session; sende nicht mit einem neuen `Idempotency-Key` erneut, sonst könnte die Eingabe zweimal ausgeführt werden.

## Archivieren {#archive}

`DELETE /v1/agents/sessions/{session_id}` archiviert eine Session; Sessions werden nicht endgültig gelöscht. `POST /v1/agents/sessions/{session_id}/archive` und `/unarchive` erwarten `{"row_version": …}`. Archivierte Sessions behalten ihren Verlauf, lehnen aber Eingaben, Metadaten-Updates und Streams ab.

## Anhänge {#attachments}

Lade mit `POST /v1/agents/sessions/{session_id}/files` eine Datei in den Session-Workspace hoch (Multipart-Feld `file`, bis zu 5 MiB, `Idempotency-Key` erforderlich). Unterstützte Typen sind `.txt`, `.md`, `.csv`, `.log`, `.json`, `.pdf`, `.png`, `.jpg`, `.jpeg` und `.webp`. Sobald der `status` der Datei `ready` ist, sendest du sie zusammen mit bis zu neun weiteren:

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-2" \
  -H "Content-Type: application/json" \
  -d '{"input": "Summarize the attached report.", "file_ids": ["fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72"]}'
```

## Clients neu verbinden {#reconnecting-clients}

Clients im Browser-Stil, die nach einem Verbindungsabbruch eine konsistente Ansicht brauchen, können `POST /v1/agents/sessions/{session_id}/reconnect` aufrufen. Der Aufruf liefert die Session und eine `stream_url` für `GET /v1/agents/sessions/{session_id}/events/stream`. Dieser Stream sendet zuerst ein `session.snapshot` und danach Live-Events und `heartbeat`. Sendet der Stream `stream.interrupted`, verbinde dich erneut, statt die Eingabe noch einmal zu senden.

## GitHub-Repository {#github-repository}

Sende beim Erstellen `github_workspace`, um ein GitHub-Repository nach `/workspace` zu klonen und den Agent auf eigene Session-Branches pushen zu lassen. Siehe [GitHub-Repository-Workspace](/agents/github-workspace).

## Modell-Zugangsdaten {#model-credentials}

Eine Session ruft Modelle mit dem API-Schlüssel auf, mit dem sie erstellt wurde, sofern du kein `model_provider` sendest. Mit `{"type": "custom", "base_url": "https://…", "api_key": "…"}` nutzt du deinen eigenen OpenAI-kompatiblen HTTPS-Endpunkt. `model_provider` kann nur geschrieben, nicht gelesen werden.

## IDs {#ids}

| Präfix | Ressource |
|---|---|
| `agt_` | Agent |
| `ses_` | Session |
| `skl_` | Skill |
| `mcp_` | MCP-Verbindung |
| `sec_` | Secret |
| `fil_` | Session-Anhang |

Behandle IDs als opake Strings.

## Nächste Schritte {#next-steps}

- [Sessions-API-Referenz](/api-reference/sessions/)
- [OpenAI-Kompatibilität](/agents/openai-compatibility)

## Workspace-Dateien und generierte Artefakte {#workspace-files-and-generated-artifacts}

Diese drei Ressourcen erfüllen unterschiedliche Zwecke:

| Ressource | Verwendung | Paginierung |
|---|---|---|
| [Anhänge](/api-reference/sessions/list-files) | Dateien, die du hochgeladen hast und in Eingaben per `file_id` referenzieren kannst | `limit` / `offset` |
| [Workspace-Dateien](/api-reference/sessions/list-workspace-files) | Aktuelle Dateipfade und -größen in einem Workspace-Verzeichnis | `page` / `next` |
| [Artefakte](/api-reference/sessions/list-artifacts) | Unveränderliche generierte Ausgaben, die zum Download bereitstehen | `after` / `last_id` |

Liste die Artefakte auf, um eine `art_`-ID zu erhalten, und übergib genau diese ID an [Download Artifact](/api-reference/sessions/download-artifact). Ein Workspace-Pfad oder eine Anhang-`file_id` kann sie nicht ersetzen. Die Workspace-Auflistung liefert nur Metadaten und ist keine API zum Download beliebiger Pfade. Artefakte lassen sich als vollständige Dateien bis 200 MiB herunterladen; partielle Downloads per `Range` werden nicht unterstützt.
