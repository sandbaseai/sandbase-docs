---
i18nSource: 417ea5dc930a8786
title: Skills und MCP-Tools
description: Einem SandBase Agent wiederverwendbare Skills und entfernte MCP-Tools geben und steuern, welche Versionen und Tools jede Session verwendet.
---

# Skills und MCP-Tools {#skills-and-mcp-tools}

Ein Agent erhält Fähigkeiten auf zwei Wegen:

- **Skills** bringen dem Agent bei, wie er eine Aufgabe erledigt. Ein Skill ist ein versioniertes ZIP-Bundle aus Anweisungen und Ressourcen.
- **MCP-Verbindungen** lassen den Agent Tools auf einem entfernten MCP-Server über HTTPS aufrufen, optional mit einem [Secret](/agents/api-credentials) authentifiziert.

Die meisten nützlichen Agents kombinieren beides: Ein MCP-Server ruft Daten ab oder führt Aktionen aus, und ein Skill beschreibt, wie die Ergebnisse zu verwenden sind.

## Skills {#skills}

1. Packe einen Ordner, der eine `SKILL.md` mit `name`- und `description`-Frontmatter enthält, und zippe den Ordner selbst (`zip -r release-notes.zip release-notes/`, maximal 5 MiB). Das ZIP muss diesen Ordner auf oberster Ebene enthalten; eine `SKILL.md` im ZIP-Root liefert `400 invalid_request`.
2. Lade es mit `POST /v1/skills` als Multipart-Feld `files` hoch. Die Antwort enthält eine `skl_`-ID und `default_version: "1"`.
3. Referenziere es im `skills`-Array des Agents.

```json
{
  "skills": [
    { "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null }
  ]
}
```

- Beim ersten Anhängen wird `"version": null` beim Speichern des Agents zur aktuellen `default_version` des Skills aufgelöst. Ein String wie `"2"` wählt diese Version explizit aus.
- Der gespeicherte Agent legt die Version fest. Eine Änderung der Standardversion des Skills aktualisiert weder bestehende Agents noch deren neue Sessions. Aktualisiere den Agent mit einer expliziten Version, um zu wechseln; `null` bei einer bestehenden Bindung behält die festgelegte Version bei.
- Lade eine neue Version mit `POST /v1/skills/{skill_id}/versions` hoch und wechsle die Standardversion mit `default=true` oder `POST /v1/skills/{skill_id}`.
- Ein deaktivierter Skill lässt neue Sessions von Agents, die ihn referenzieren, mit `400 skill_not_found` fehlschlagen.

Öffentliche Skills findest du auch im [Skill-Katalog](/api-reference/skills/catalog). Die vollständige Anleitung steht in der [Skills API](/api-reference/skills/).

## Integrierte SandBase-Tools {#built-in-sandbase-tools}

Jeder neue Agent kann ohne Einrichtung die eigenen Tools von SandBase nutzen. Mit `sandbase_discover`, `sandbase_inspect` und `sandbase_run` findet der Agent ein Modell oder eine API im Katalog, liest Schema und Preis und ruft es mit deinem Schlüssel auf. Wenn du `mcp_connections` beim Erstellen weglässt, erhält der Agent diesen Standard:

```json
{
  "mcp_connections": [
    {
      "connection_id": "builtin:sandbase",
      "server_label": "sandbase_builtin",
      "allowed_tools": null,
      "required": true
    }
  ]
}
```

- **Die Liste, die du sendest, ersetzt den Standard.** Um deinen eigenen MCP-Server hinzuzufügen und die SandBase-Tools zu behalten, nimm den integrierten Eintrag in deine Liste auf.
- **`builtin:sandbase` erfordert `server_label: "sandbase_builtin"`.** Jedes andere Label oder dieses Label bei einer anderen Verbindung liefert `400`.
- **Um einen Agent ohne Tools zu erstellen,** sende `"mcp_connections": []`.
- **Die integrierten Tools sind kostenlos.** Du zahlst nur für die Modelle und APIs, die der Agent über sie aufruft.

## MCP-Verbindungen {#mcp-connections}

1. Wenn der MCP-Server ein Bearer-Token braucht, [erstelle ein Secret](/agents/api-credentials) für seine exakte URL.
2. Registriere den Server mit `POST /v1/mcp-connections`:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/mcp-connections \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Idempotency-Key: github-mcp" \
     -H "Content-Type: application/json" \
     -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
   ```

3. Referenziere die Verbindung im `mcp_connections`-Array des Agents:

   ```json
   {
     "mcp_connections": [
       {
         "connection_id": "mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13",
         "server_label": "github",
         "allowed_tools": ["search_issues", "get_issue"],
         "required": true
       }
     ]
   }
   ```

| Feld | Bedeutung |
|---|---|
| `connection_id` | `mcp_`-Verbindungs-ID in deiner Organisation oder `builtin:sandbase` für den integrierten SandBase-Server |
| `server_label` | Beginnt mit einem Buchstaben; Buchstaben, Ziffern, `_` und `-`; bis zu 64 Zeichen; eindeutig innerhalb des Agents |
| `allowed_tools` | Weggelassen oder `null` erlaubt alle Tools des Servers; `[]` erlaubt keines; eine Liste erlaubt nur diese Namen (bis zu 256 Namen, jeweils nicht leer und höchstens 128 Byte) |
| `required` | Ob die Session diesen Server laden muss |

Ein Agent kann bis zu 32 Verbindungen referenzieren. Verbindungen der Organisation müssen beim Start einer Session `active` sein.

### Integrierte SandBase-Tools {#built-in-sandbase-tools-1}

Wenn du einen Agent ohne `mcp_connections` erstellst, wird der integrierte SandBase-Server ausgewählt. Um ihn explizit neben deinem eigenen Server zu behalten, nimm diesen Eintrag in das Array auf:

```json
{
  "connection_id": "builtin:sandbase",
  "server_label": "sandbase_builtin",
  "allowed_tools": null,
  "required": true
}
```

Ein explizites Array ersetzt die gesamte Auswahl; das obige Beispiel mit nur eigenen Servern schließt den integrierten Server aus. Sende `[]`, um alle MCP-Tools zu deaktivieren. Lässt du das Feld bei einem Agent-Update weg, bleibt die bestehende Auswahl erhalten; `null` liefert `400`. Für den integrierten Eintrag musst du keine MCP-Verbindung und kein Secret anlegen. Sende nicht das ausgemusterte Feld `use_sandbase_mcp`.

::: info Abweichung von OpenAI
Die Agents API von OpenAI deklariert MCP-Server inline als `tools: [{"type": "mcp", ...}]`. SandBase liefert für diese Form `400`: Registriere den Server als Verbindungsressource und referenziere ihn in `mcp_connections`. Das OpenAI SDK hat keine Methoden für `/v1/mcp-connections` oder `/v1/secrets`, rufe sie daher mit `client.post(...)` auf und übergib `mcp_connections` über `extra_body` (Python) oder den Request-Body (Node.js). Siehe [OpenAI-Kompatibilität](/agents/openai-compatibility#mcp-connections-with-the-sdk).
:::

## Änderungen und laufende Sessions {#changes-and-running-sessions}

Jede Session friert beim Start ihre Agent-Version, ihre Skill-Versionen und ihre MCP-Verbindungskonfiguration ein.

- Nachdem du eine Verbindung ersetzt oder ihr Secret rotiert hast, verwenden neue Sessions die neue Konfiguration; bestehende Sessions behalten ihren Snapshot.
- Das Deaktivieren einer Verbindung oder das Widerrufen ihres Secrets blockiert neue Sessions und lehnt weitere Eingaben an bestehende Sessions ab, die sie verwenden. Ein bereits laufender Tool-Aufruf wird nicht unterbrochen.

## Token aus Prompts heraushalten {#keep-tokens-out-of-prompts}

Speichere Token als Secrets. Schreibe sie nicht in Anweisungen, Session-Eingaben, Metadaten oder Skill-Bundles: Diese kann jeder lesen, der Zugriff auf den Agent oder die Session hat.

## Nächste Schritte {#next-steps}

- [Zugangsdaten für MCP-Tools](/agents/api-credentials)
- [MCP Connections API](/api-reference/mcp-connections/)
- [Skills API](/api-reference/skills/)
- [Einen Agent definieren](/agents/agent-api)
