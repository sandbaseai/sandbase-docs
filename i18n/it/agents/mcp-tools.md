---
i18nSource: 417ea5dc930a8786
title: Skills e tool MCP
description: Fornisci a un Agent SandBase Skills riutilizzabili e tool MCP remoti, e controlla quali versioni e tool usa ogni Session.
---

# Skills e tool MCP {#skills-and-mcp-tools}

Un Agent ottiene capacità in due modi:

- Le **Skills** insegnano all'Agent come svolgere un lavoro. Una Skill è un bundle ZIP con versioni, composto da istruzioni e risorse.
- Le **connessioni MCP** permettono all'Agent di chiamare tool su un server MCP remoto via HTTPS, con autenticazione facoltativa tramite un [Secret](/agents/api-credentials).

Gli Agents più utili combinano entrambi: un server MCP recupera dati o esegue azioni, e una Skill descrive come usare i risultati.

## Skills {#skills}

1. Prepara una cartella che contenga `SKILL.md` con frontmatter `name` e `description`, e comprimi la cartella stessa (`zip -r release-notes.zip release-notes/`, massimo 5 MiB). Lo ZIP deve contenere quella cartella al primo livello; un `SKILL.md` nella radice dello ZIP restituisce `400 invalid_request`.
2. Caricalo con `POST /v1/skills` come campo multipart `files`. La risposta contiene un ID `skl_` e `default_version: "1"`.
3. Fai riferimento alla Skill nell'array `skills` dell'Agent.

```json
{
  "skills": [
    { "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null }
  ]
}
```

- Al primo collegamento, `"version": null` risolve la `default_version` corrente della Skill quando l'Agent viene salvato. Una stringa come `"2"` seleziona esplicitamente quella versione.
- L'Agent salvato fissa la versione. Cambiare la versione predefinita della Skill non aggiorna gli Agents esistenti né le loro nuove Sessions. Per aggiornare, modifica l'Agent indicando una versione esplicita; inviare `null` per un binding esistente mantiene la versione fissata.
- Carica una nuova versione con `POST /v1/skills/{skill_id}/versions` e cambia la versione predefinita con `default=true` oppure con `POST /v1/skills/{skill_id}`.
- Una Skill disabilitata fa fallire con `400 skill_not_found` le nuove Sessions degli Agents che la referenziano.

Puoi anche consultare le Skills pubbliche nel [catalogo delle Skills](/api-reference/skills/catalog). Consulta l'[API Skills](/api-reference/skills/) per la procedura completa.

## Tool SandBase integrati {#built-in-sandbase-tools}

Ogni nuovo Agent può usare i tool di SandBase senza alcuna configurazione. Con `sandbase_discover`, `sandbase_inspect` e `sandbase_run`, l'Agent trova un modello o un'API nel catalogo, ne legge schema e prezzo e lo chiama con la tua chiave. Se ometti `mcp_connections` in fase di creazione, l'Agent riceve questo valore predefinito:

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

- **La lista che invii sostituisce quella predefinita.** Per aggiungere un tuo server MCP e mantenere i tool SandBase, includi la voce integrata nella tua lista.
- **`builtin:sandbase` richiede `server_label: "sandbase_builtin"`.** Qualsiasi altra label, oppure questa label su un'altra connessione, restituisce `400`.
- **Per creare un Agent senza tool,** invia `"mcp_connections": []`.
- **I tool integrati sono gratuiti.** Paghi solo i modelli e le API che l'Agent chiama tramite essi.

## Connessioni MCP {#mcp-connections}

1. Se il server MCP richiede un token Bearer, [crea un Secret](/agents/api-credentials) per il suo URL esatto.
2. Registra il server con `POST /v1/mcp-connections`:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/mcp-connections \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Idempotency-Key: github-mcp" \
     -H "Content-Type: application/json" \
     -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
   ```

3. Fai riferimento alla connessione nell'array `mcp_connections` dell'Agent:

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

| Campo | Significato |
|---|---|
| `connection_id` | ID di connessione `mcp_` nella tua organizzazione, oppure `builtin:sandbase` per il server SandBase integrato |
| `server_label` | Inizia con una lettera; lettere, cifre, `_` e `-`; fino a 64 caratteri; univoca all'interno dell'Agent |
| `allowed_tools` | Omesso o `null` consente tutti i tool offerti dal server; `[]` non ne consente nessuno; una lista consente solo quei nomi (fino a 256 nomi, ciascuno non vuoto e al massimo di 128 byte) |
| `required` | Se la Session deve caricare questo server |

Un Agent può referenziare fino a 32 connessioni. Le connessioni dell'organizzazione devono essere `active` all'avvio di una Session.

### Tool SandBase integrati {#built-in-sandbase-tools-1}

Creare un Agent senza `mcp_connections` seleziona il server SandBase integrato. Per mantenerlo esplicitamente insieme al tuo server, includi questa voce nell'array:

```json
{
  "connection_id": "builtin:sandbase",
  "server_label": "sandbase_builtin",
  "allowed_tools": null,
  "required": true
}
```

Un array esplicito sostituisce l'intera selezione; l'esempio precedente con il solo server personalizzato esclude il server integrato. Invia `[]` per disabilitare tutti i tool MCP. Omettere il campo in un aggiornamento dell'Agent mantiene la selezione esistente; `null` restituisce `400`. La voce integrata non richiede la creazione di una connessione MCP né di un Secret. Non inviare il campo dismesso `use_sandbase_mcp`.

::: info Differenze rispetto a OpenAI
L'API Agents di OpenAI dichiara i server MCP inline come `tools: [{"type": "mcp", ...}]`. SandBase restituisce `400` per questa forma: registra il server come risorsa di connessione e referenzialo in `mcp_connections`. L'SDK OpenAI non ha metodi per `/v1/mcp-connections` o `/v1/secrets`, quindi chiamali con `client.post(...)` e passa `mcp_connections` tramite `extra_body` (Python) o nel body della richiesta (Node.js). Vedi [Compatibilità con OpenAI](/agents/openai-compatibility#mcp-connections-with-the-sdk).
:::

## Modifiche e Sessions in esecuzione {#changes-and-running-sessions}

Ogni Session congela, al suo avvio, la versione dell'Agent, le versioni delle Skills e la configurazione delle connessioni MCP.

- Dopo aver sostituito una connessione o ruotato il suo Secret, le nuove Sessions usano la nuova configurazione; le Sessions esistenti mantengono il proprio snapshot.
- Disabilitare una connessione o revocare il suo Secret blocca le nuove Sessions e rifiuta ulteriori input alle Sessions esistenti che la usano. Una chiamata a un tool già in esecuzione non viene interrotta.

## Tieni i token fuori dai prompt {#keep-tokens-out-of-prompts}

Salva i token come Secrets. Non inserirli in istruzioni, input della Session, metadata o bundle delle Skills: sono leggibili da chiunque abbia accesso all'Agent o alla Session.

## Passaggi successivi {#next-steps}

- [Credenziali per i tool MCP](/agents/api-credentials)
- [API MCP Connections](/api-reference/mcp-connections/)
- [API Skills](/api-reference/skills/)
- [Definire un Agent](/agents/agent-api)
