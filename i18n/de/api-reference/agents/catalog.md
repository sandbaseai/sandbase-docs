---
i18nSource: 1b5099685e9df6ce
title: Agent-Katalog
description: Durchsuche öffentliche Agents und klone einen in deine Organisation.
---

# Agent-Katalog {#agent-catalog}

Der Katalog listet Agents, die SandBase zur Wiederverwendung veröffentlicht. Katalogeinträge sind schreibgeschützt. Klone einen Eintrag, um einen privaten Agent in deiner Organisation zu erhalten, den du bearbeiten, ausführen und deployen kannst.

| Methode | Pfad | Zweck |
|---|---|---|
| `GET` | `/v1/agents/catalog` | Öffentliche Agents auflisten |
| `GET` | `/v1/agents/catalog/{agent_id}` | Einen öffentlichen Agent abrufen, optional mit `?version=` |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | In deine Organisation kopieren |

## Katalog-Agents auflisten {#list-catalog-agents}

Cursor-Paginierung mit `limit` (1-100), `after` und `order`.

```bash
curl "https://api.sandbase.ai/v1/agents/catalog?limit=20" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Jeder Eintrag enthält `id`, `object: "agent"`, `visibility: "public"`, `version`, `name`, `description`, `model`, `created_at` und `updated_at`.

## Katalog-Agent abrufen {#get-a-catalog-agent}

```bash
curl "https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60?version=2" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`version` ist optional und muss eine positive Ganzzahl sein. Die Detailantwort enthält zusätzlich ein schreibgeschütztes `configuration`-Objekt (Name, Beschreibung, Modell, Anweisungen, Runtime-Profil, Metadaten, Tools, Text, Reasoning und Skills).

## Katalog-Agent klonen {#clone-a-catalog-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/clone \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: clone-research-agent" \
  -H "Content-Type: application/json" \
  -d '{"name": "My research assistant"}'
```

Der Body akzeptiert optional `version` (positive Ganzzahl, Standard ist die aktuelle öffentliche Version) und `name` (bis zu 128 Zeichen). Die Antwort ist `201 Created` mit einem vollständigen [Agent-Objekt](./create), das eine neue `agt_`-ID in deiner Organisation hat. `Idempotency-Key` ist optional; sende einen stabilen Key, damit ein Retry keine zweite Kopie erzeugt.

Nach dem Klonen [erstellst du eine Session](/api-reference/sessions/create), um den Agent zu testen.
