---
i18nSource: dab112fdbbc56799
title: Credentials für MCP-Tools
description: Speichere nur schreibbare Bearer-Tokens als Secrets, damit Agents authentifizierte MCP-Server aufrufen können.
---

# Credentials für MCP-Tools {#credentials-for-mcp-tools}

Wenn ein MCP-Server eine Authentifizierung verlangt, speichere sein Bearer-Token als **Secret** und hänge das Secret an eine [MCP-Verbindung](/agents/mcp-tools#mcp-connections) an. Die Ausführungsumgebung sendet das Token nur an diesen Server.

## So funktionieren Secrets {#how-secrets-work}

- `kind` ist immer `mcp_bearer`: ein Bearer-Token für einen MCP-Server.
- Jedes Secret ist an genau eine `server_url` gebunden. Eine Verbindung kann es nur verwenden, wenn ihre `server_url` übereinstimmt. Für eine andere URL erstellst du ein weiteres Secret.
- Das Token ist nur schreibbar. Die API gibt Name, URL, Status und `row_version` des Secrets zurück, aber nie das Token.
- Secrets sind keine Umgebungsvariablen. Sie werden nicht in die Agent-Laufzeit injiziert, und Agents können sie nicht lesen.

Frühere Versionen von SandBase speicherten Credentials auf Workspace- oder Agent-Ebene und injizierten sie als Umgebungsvariablen wie `GITHUB_TOKEN`. Dieses Modell wurde eingestellt, und seine Datensätze werden nicht migriert. Lege die Werte, die du noch brauchst, als Secrets auf MCP-Verbindungen neu an.

## Mit der API {#with-the-api}
Secrets erstellst, rotierst und widerrufst du über die API. Dieser Leitfaden ist der API-Vertrag; die Credentials-Seite der Console, die du aus dem Agent-Editor öffnest, ist nicht die Referenz für das Verhalten von Secrets. Rufe diese Endpunkte von einem vertrauenswürdigen Backend auf, nie aus Browser-Code: Sie erwarten einen SandBase-API-Key und ein Token im Klartext.

| Methode | Pfad | Zweck |
|---|---|---|
| `POST` | `/v1/secrets` | [Secret erstellen](#create-a-secret) |
| `GET` | `/v1/secrets` | [Secrets auflisten](#list-secrets) |
| `GET` | `/v1/secrets/{secret_id}` | [Secret abrufen](#get-a-secret) |
| `POST` | `/v1/secrets/{secret_id}/rotate` | [Token rotieren](#rotate-a-secret) |
| `DELETE` | `/v1/secrets/{secret_id}` | [Secret widerrufen](#revoke-a-secret) |

Jeder Schreibvorgang erfordert `Idempotency-Key` (1–128 Bytes, ohne führende oder nachgestellte Leerzeichen). Das Secret-Objekt hat `id` (Präfix `sec_`), `name`, `kind`, `server_url`, `status`, `row_version`, `created_at` und `updated_at`. `status` ist `pending`, während das Token gespeichert wird, `active`, sobald es verwendet werden kann, und `disabled` nach dem Widerruf. `created_at` und `updated_at` sind Zeitstempel-Strings im Format RFC 3339.

### Secret erstellen {#create-a-secret}

```bash
python3 -c 'import json, os; print(json.dumps({"name": "GitHub MCP token", "kind": "mcp_bearer", "server_url": "https://mcp.example.com/github", "token": os.environ["GITHUB_MCP_TOKEN"]}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

- `kind` muss `mcp_bearer` sein.
- `server_url` muss HTTPS sein, ohne Benutzerinformationen, Query oder Fragment. Das Secret funktioniert nur für genau diese URL.
- `name` und `token` sind Pflichtfelder und dürfen nicht leer sein. `name` umfasst bis zu 128 Bytes, `token` bis zu 16384 Bytes und `server_url` bis zu 2048 Bytes.

Die Antwort ist `201 Created`, ohne das Token. Verwende die `sec_`-ID als `secret_id`, wenn du [die MCP-Verbindung erstellst](/api-reference/mcp-connections/#create-a-connection).

### Secrets auflisten {#list-secrets}

```bash
curl "https://api.sandbase.ai/v1/secrets?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Offset-Paginierung mit `data`, `total`, `limit` und `offset`. `limit` ist standardmäßig 20 und auf 200 begrenzt; fehlende, ungültige oder nicht positive Werte ergeben 20. `offset` ist standardmäßig 0; ungültige oder nicht positive Werte ergeben 0. Erhöhe um das zurückgegebene `limit`, bis `offset + data.length >= total` gilt. Deaktivierte Secrets bleiben in der Liste.

### Secret abrufen {#get-a-secret}

```bash
curl https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

### Secret rotieren {#rotate-a-secret}

Setze `SECRET_ROW_VERSION` auf die aktuelle `row_version` aus „Secret abrufen“.

```bash
python3 -c 'import json, os; print(json.dumps({"token": os.environ["GITHUB_MCP_TOKEN"], "row_version": int(os.environ["SECRET_ROW_VERSION"])}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61/rotate \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token-rotate-1" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

Die Rotation ersetzt das Token und behält dasselbe Secret und dieselbe `server_url`. `token` und eine positive ganze Zahl als `row_version` sind erforderlich, das Secret muss `active` sein, und `row_version` muss dem aktuellen Wert entsprechen. Gibt `201 Created` zurück. Neue Sessions verwenden das neue Token; bereits gestartete Sessions behalten das Credential, das sie eingefroren haben.

### Secret widerrufen {#revoke-a-secret}

```bash
curl -X DELETE https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-token-revoke"
```

Gibt `204 No Content` zurück und setzt `status` auf `disabled`. Verbindungen, die das Secret verwenden, funktionieren für neue Sessions und für weitere Eingaben an bestehende Sessions nicht mehr. Ein Widerruf lässt sich nicht rückgängig machen: Erstelle ein neues Secret und ersetze die Verbindung.

### Fehler und Retries {#errors-and-retries}

Fehler verwenden den [Fehler-Envelope der Agents](/api-reference/errors#agents-platform-errors). Ungültige Felder oder ein fehlender Idempotency-Key bei Schreibvorgängen ergeben `400 invalid_request`; ein unbekanntes oder nicht zugängliches Secret ergibt `404 not_found`. Eine veraltete `row_version`, ein inkompatibler Lebenszyklusstatus oder die Wiederverwendung eines Create-Keys mit anderer Eingabe ergeben `409 conflict`. Lies das Secret vor einem Retry erneut und verwende für jeden neuen Schreibvorgang einen neuen Key.

## Sicherheit {#security}

- Erstelle und rotiere Secrets von einem vertrauenswürdigen Backend aus, nie aus Browser-Code.
- Lies Tokens aus deinem eigenen Secret Store oder der Umgebung, wie oben mit `$GITHUB_MCP_TOKEN`, statt sie in Skripte einzufügen.
- Halte Tokens aus Anweisungen, Session-Eingaben, Metadaten und Skill-Bundles heraus.
- Widerrufe ein Secret, sobald sein Token geleakt sein könnte, erstelle dann ein neues und ersetze die Verbindung.

## Nächste Schritte {#next-steps}

- [Skills und MCP-Tools](/agents/mcp-tools)
- [MCP Connections API](/api-reference/mcp-connections/)
