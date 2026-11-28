---
i18nSource: ee126767f58b111b
title: MCP Connections API
description: Registriere entfernte HTTPS-MCP-Server, die Agents aufrufen können.
---

# MCP Connections API {#mcp-connections-api}

Eine MCP-Verbindung registriert einen entfernten MCP-Server, der über HTTPS erreichbar ist. Agents referenzieren Verbindungen in `mcp_connections`; jede Session friert beim Start die Verbindungskonfiguration ein. Verbindungs-IDs verwenden das Präfix `mcp_`. Um dich beim Server mit einem Bearer-Token zu authentifizieren, erstelle zuerst ein [Secret](/agents/api-credentials#with-the-api) für dieselbe URL.

| Methode | Pfad | Zweck |
|---|---|---|
| `POST` | `/v1/mcp-connections` | [Verbindung erstellen](#create-a-connection) |
| `GET` | `/v1/mcp-connections` | [Verbindungen auflisten](#list-connections) |
| `GET` | `/v1/mcp-connections/{connection_id}` | [Verbindung abrufen](#get-a-connection) |
| `PUT` | `/v1/mcp-connections/{connection_id}` | [Verbindung ersetzen](#replace-a-connection) |
| `POST` | `/v1/mcp-connections/{connection_id}/enable` | [Verbindung aktivieren](#enable-a-connection) |
| `DELETE` | `/v1/mcp-connections/{connection_id}` | [Verbindung deaktivieren](#disable-a-connection) |

Jeder Schreibvorgang erfordert `Idempotency-Key` (1–128 Bytes, ohne führende oder nachgestellte Leerzeichen). Das Verbindungsobjekt hat `id`, `name`, `server_url`, `secret_id` (falls gesetzt), `status` (`active` oder `disabled`), `row_version`, `created_at` und `updated_at`.

## Verbindung erstellen {#create-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
```

- `name` ist erforderlich, darf nicht leer sein und umfasst bis zu 128 Bytes.
- `server_url` muss HTTPS sein, ohne Benutzerinformationen, Query oder Fragment (bis zu 2048 Bytes).
- `secret_id` ist optional. Lass es bei einem anonymen Server weg. Ist es gesetzt, muss das Secret `active` sein und seine `server_url` exakt dieser `server_url` entsprechen, sonst schlägt die Anfrage fehl (409 bei einem inaktiven Secret, 400 bei abweichender URL).

Liefert `201 Created`.

## Verbindungen auflisten {#list-connections}

```bash
curl "https://api.sandbase.ai/v1/mcp-connections?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Offset-Paginierung mit `data`, `total`, `limit` und `offset`. `limit` ist standardmäßig 20 und auf 200 begrenzt; fehlende, ungültige oder nicht positive Werte ergeben 20. `offset` ist standardmäßig 0; ungültige oder nicht positive Werte ergeben 0. Gehe jeweils um das zurückgegebene `limit` weiter, bis `offset + data.length >= total` gilt. Deaktivierte Ressourcen bleiben in der Liste sichtbar.

## Verbindung abrufen {#get-a-connection}

```bash
curl https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

## Verbindung ersetzen {#replace-a-connection}

```bash
curl -X PUT https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-v2" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "row_version": 1}'
```

`PUT` ersetzt `name`, `server_url` und `secret_id` gemeinsam; lässt du `secret_id` weg, wird die Verbindung anonym. `row_version` ist erforderlich und muss dem aktuellen Wert aus Get Connection entsprechen. Liefert `200 OK` mit der aktualisierten Verbindung. Eine deaktivierte Verbindung bleibt nach dem Ersetzen deaktiviert, bis du sie aktivierst.

## Verbindung aktivieren {#enable-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13/enable \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-enable" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 3}'
```

`row_version` ist erforderlich und muss eine positive Ganzzahl sein, die der aktuellen Ressource entspricht. Liefert `200 OK` mit der Verbindung. Beim Aktivieren bleibt die Verbindungs-ID gleich. Ein widerrufenes Secret wird dadurch nicht wiederhergestellt; ersetze die Verbindung zuerst mit einem neuen aktiven Secret.

## Verbindung deaktivieren {#disable-a-connection}

```bash
curl -X DELETE https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-disable"
```

Liefert `204 No Content` und setzt `status` auf `disabled`. Neue Sessions können die Verbindung nicht nutzen, und bestehende Sessions, die sie eingefroren haben, lehnen weitere Eingaben ab. Ein bereits laufender Tool-Aufruf wird nicht unterbrochen.

## Änderungen und laufende Sessions {#changes-and-running-sessions}

Sessions frieren die Verbindungseinstellungen beim Start ein. Nachdem du eine Verbindung ersetzt oder ihr Secret rotiert hast, verwenden neue Sessions die neue Konfiguration, während bestehende Sessions ihren Snapshot behalten. Das Deaktivieren der Verbindung oder das Widerrufen ihres Secrets blockiert sowohl neue Sessions als auch weitere Eingaben an bestehende.

## Fehler und Wiederholungen {#errors-and-retries}

Fehler verwenden das [Error-Envelope der Agents](/api-reference/errors#agents-platform-errors). Ungültige Felder oder ein fehlender Idempotenzschlüssel bei Schreibvorgängen liefern `400 invalid_request`; eine unbekannte oder nicht zugängliche Ressource liefert `404 not_found`. Eine veraltete `row_version`, ein inkompatibler Lebenszykluszustand oder die Wiederverwendung eines Create- bzw. Update-Schlüssels mit anderer Eingabe liefert `409 conflict`. Lies die Ressource erneut, bevor du ein neues Update sendest, und verwende für jeden neuen Schreibvorgang einen neuen Schlüssel.

`created_at` und `updated_at` sind Zeitstempel-Strings nach RFC 3339.
