---
i18nSource: dab112fdbbc56799
title: Credenziali per i tool MCP
description: Salva Bearer token di sola scrittura come Secret, così gli Agent possono chiamare server MCP autenticati.
---

# Credenziali per i tool MCP {#credentials-for-mcp-tools}

Quando un server MCP richiede l'autenticazione, salva il suo Bearer token come **Secret** e collega il Secret a una [connessione MCP](/agents/mcp-tools#mcp-connections). L'ambiente di esecuzione invia il token solo a quel server.

## Come funzionano i Secret {#how-secrets-work}

- `kind` è sempre `mcp_bearer`: un Bearer token per un singolo server MCP.
- Ogni Secret è legato a un `server_url` esatto. Una connessione può usarlo solo se il suo `server_url` corrisponde. Per usare un altro URL, crea un altro Secret.
- Il token è di sola scrittura. L'API restituisce il nome, l'URL, lo stato e la `row_version` del Secret, mai il token.
- I Secret non sono variabili d'ambiente. Non vengono iniettati nel runtime dell'Agent e gli Agent non possono leggerli.

Le versioni precedenti di SandBase memorizzavano credenziali a livello di workspace o di Agent e le iniettavano come variabili d'ambiente, ad esempio `GITHUB_TOKEN`. Quel modello è stato dismesso e i relativi record non vengono migrati. Ricrea i valori che ti servono ancora come Secret sulle connessioni MCP.

## Con l'API {#with-the-api}
Crea, ruota e revoca i Secret tramite l'API. Questa guida costituisce il contratto dell'API; la pagina Credentials della Console, che si apre dall'editor dell'Agent, non è il riferimento per il comportamento dei Secret. Chiama questi endpoint da un backend attendibile, mai da codice nel browser: richiedono una API key SandBase e un token in chiaro.

| Metodo | Percorso | Scopo |
|---|---|---|
| `POST` | `/v1/secrets` | [Creare un Secret](#create-a-secret) |
| `GET` | `/v1/secrets` | [Elencare i Secret](#list-secrets) |
| `GET` | `/v1/secrets/{secret_id}` | [Ottenere un Secret](#get-a-secret) |
| `POST` | `/v1/secrets/{secret_id}/rotate` | [Ruotare il token](#rotate-a-secret) |
| `DELETE` | `/v1/secrets/{secret_id}` | [Revocare un Secret](#revoke-a-secret) |

Ogni scrittura richiede `Idempotency-Key` (1-128 byte, senza spazi iniziali o finali). L'oggetto Secret contiene `id` (prefisso `sec_`), `name`, `kind`, `server_url`, `status`, `row_version`, `created_at` e `updated_at`. `status` è `pending` mentre il token viene memorizzato, `active` quando può essere usato e `disabled` dopo la revoca. `created_at` e `updated_at` sono stringhe di timestamp RFC 3339.

### Creare un Secret {#create-a-secret}

```bash
python3 -c 'import json, os; print(json.dumps({"name": "GitHub MCP token", "kind": "mcp_bearer", "server_url": "https://mcp.example.com/github", "token": os.environ["GITHUB_MCP_TOKEN"]}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

- `kind` deve essere `mcp_bearer`.
- `server_url` deve essere HTTPS, senza user info, query o fragment. Il Secret funziona solo per questo URL esatto.
- `name` e `token` sono obbligatori e non possono essere vuoti. `name` può avere al massimo 128 byte, `token` 16384 byte e `server_url` 2048 byte.

La risposta è `201 Created` e non contiene il token. Usa l'ID `sec_` come `secret_id` quando [crei la connessione MCP](/api-reference/mcp-connections/#create-a-connection).

### Elencare i Secret {#list-secrets}

```bash
curl "https://api.sandbase.ai/v1/secrets?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Paginazione a offset con `data`, `total`, `limit` e `offset`. `limit` vale 20 per impostazione predefinita ed è limitato a 200; valori mancanti, non validi o non positivi diventano 20. `offset` vale 0 per impostazione predefinita; valori non validi o non positivi diventano 0. Avanza del `limit` restituito finché `offset + data.length >= total`. I Secret disabilitati restano nell'elenco.

### Ottenere un Secret {#get-a-secret}

```bash
curl https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

### Ruotare un Secret {#rotate-a-secret}

Imposta `SECRET_ROW_VERSION` sull'ultima `row_version` ottenuta da Ottenere un Secret.

```bash
python3 -c 'import json, os; print(json.dumps({"token": os.environ["GITHUB_MCP_TOKEN"], "row_version": int(os.environ["SECRET_ROW_VERSION"])}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61/rotate \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token-rotate-1" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

La rotazione sostituisce il token e mantiene lo stesso Secret e lo stesso `server_url`. `token` e una `row_version` intera positiva sono obbligatori, il Secret deve essere `active` e `row_version` deve corrispondere al valore più recente. Restituisce `201 Created`. Le nuove Session usano il nuovo token; le Session già avviate mantengono la credenziale che avevano congelato.

### Revocare un Secret {#revoke-a-secret}

```bash
curl -X DELETE https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-token-revoke"
```

Restituisce `204 No Content` e imposta `status` su `disabled`. Le connessioni che usano il Secret smettono di funzionare per le nuove Session e per gli input successivi alle Session esistenti. La revoca non può essere annullata: crea un nuovo Secret e sostituisci la connessione.

### Errori e retry {#errors-and-retries}

Gli errori usano l'[envelope di errore degli Agent](/api-reference/errors#agents-platform-errors). Campi non validi o una idempotency key di scrittura mancante restituiscono `400 invalid_request`; un Secret sconosciuto o non accessibile restituisce `404 not_found`. Una `row_version` obsoleta, uno stato del ciclo di vita incompatibile o il riutilizzo di una chiave di creazione con input diversi restituiscono `409 conflict`. Rileggi il Secret prima di riprovare e usa una nuova chiave per ogni nuova scrittura.

## Sicurezza {#security}

- Crea e ruota i Secret da un backend attendibile, mai da codice nel browser.
- Leggi i token dal tuo secret store o dall'ambiente, come `$GITHUB_MCP_TOKEN` sopra, invece di incollarli negli script.
- Tieni i token fuori da istruzioni, input delle Session, metadati e bundle delle Skill.
- Revoca un Secret appena il suo token potrebbe essere trapelato, poi creane uno nuovo e sostituisci la connessione.

## Passaggi successivi {#next-steps}

- [Skill e tool MCP](/agents/mcp-tools)
- [API MCP Connections](/api-reference/mcp-connections/)
