---
i18nSource: ee126767f58b111b
title: MCP Connections API
description: Registra server MCP remoti HTTPS che gli Agents possono chiamare.
---

# MCP Connections API {#mcp-connections-api}

Una connessione MCP registra un server MCP remoto raggiungibile via HTTPS. Gli Agents fanno riferimento alle connessioni in `mcp_connections`; ogni Session congela la configurazione della connessione al suo avvio. Gli ID delle connessioni usano il prefisso `mcp_`. Per autenticarti sul server con un token Bearer, crea prima un [Secret](/agents/api-credentials#with-the-api) per lo stesso URL.

| Metodo | Percorso | Scopo |
|---|---|---|
| `POST` | `/v1/mcp-connections` | [Creare una connessione](#create-a-connection) |
| `GET` | `/v1/mcp-connections` | [Elencare le connessioni](#list-connections) |
| `GET` | `/v1/mcp-connections/{connection_id}` | [Leggere una connessione](#get-a-connection) |
| `PUT` | `/v1/mcp-connections/{connection_id}` | [Sostituire una connessione](#replace-a-connection) |
| `POST` | `/v1/mcp-connections/{connection_id}/enable` | [Abilitare una connessione](#enable-a-connection) |
| `DELETE` | `/v1/mcp-connections/{connection_id}` | [Disabilitare una connessione](#disable-a-connection) |

Ogni scrittura richiede `Idempotency-Key` (da 1 a 128 byte, senza spazi iniziali o finali). L'oggetto connessione contiene `id`, `name`, `server_url`, `secret_id` (se impostato), `status` (`active` o `disabled`), `row_version`, `created_at` e `updated_at`.

## Creare una connessione {#create-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
```

- `name` è obbligatorio e non può essere vuoto, fino a 128 byte.
- `server_url` deve essere HTTPS senza informazioni utente, query o fragment (fino a 2048 byte).
- `secret_id` è facoltativo. Omettilo per un server anonimo. Se impostato, il Secret deve essere `active` e il suo `server_url` deve coincidere esattamente con questo `server_url`, altrimenti la richiesta fallisce (409 per un Secret non attivo, 400 per un URL diverso).

Restituisce `201 Created`.

## Elencare le connessioni {#list-connections}

```bash
curl "https://api.sandbase.ai/v1/mcp-connections?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Paginazione a offset con `data`, `total`, `limit` e `offset`. `limit` vale 20 per impostazione predefinita ed è limitato a 200; i valori mancanti, non validi o non positivi diventano 20. `offset` vale 0 per impostazione predefinita; i valori non validi o non positivi diventano 0. Avanza del `limit` restituito finché `offset + data.length >= total`. Le risorse disabilitate restano visibili nell'elenco.

## Leggere una connessione {#get-a-connection}

```bash
curl https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

## Sostituire una connessione {#replace-a-connection}

```bash
curl -X PUT https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-v2" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "row_version": 1}'
```

`PUT` sostituisce insieme `name`, `server_url` e `secret_id`; se ometti `secret_id`, la connessione diventa anonima. `row_version` è obbligatorio e deve coincidere con il valore corrente restituito da Get Connection. Restituisce `200 OK` con la connessione aggiornata. Una connessione disabilitata resta disabilitata dopo la sostituzione finché non la abiliti.

## Abilitare una connessione {#enable-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13/enable \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-enable" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 3}'
```

`row_version` è obbligatorio e deve essere un intero positivo che corrisponde alla risorsa corrente. Restituisce `200 OK` con la connessione. L'abilitazione mantiene lo stesso ID di connessione. Non ripristina un Secret revocato; prima sostituisci la connessione con un nuovo Secret attivo.

## Disabilitare una connessione {#disable-a-connection}

```bash
curl -X DELETE https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-disable"
```

Restituisce `204 No Content` e imposta `status` su `disabled`. Le nuove Session non possono usare la connessione e le Session esistenti che l'hanno congelata rifiutano ulteriori input. Una tool call già in esecuzione non viene interrotta.

## Modifiche e Session in esecuzione {#changes-and-running-sessions}

Le Session congelano le impostazioni della connessione al loro avvio. Dopo che hai sostituito una connessione o ruotato il suo Secret, le nuove Session usano la nuova configurazione e quelle esistenti mantengono il proprio snapshot. Disabilitare la connessione o revocarne il Secret blocca sia le nuove Session sia ulteriori input a quelle esistenti.

## Errori e retry {#errors-and-retries}

Gli errori usano l'[envelope di errore degli Agents](/api-reference/errors#agents-platform-errors). Campi non validi o una chiave di idempotenza mancante in scrittura restituiscono `400 invalid_request`; una risorsa sconosciuta o non accessibile restituisce `404 not_found`. Un `row_version` non aggiornato, uno stato del ciclo di vita incompatibile o il riuso di una chiave di creazione/aggiornamento con input diverso restituiscono `409 conflict`. Rileggi la risorsa prima di inviare un nuovo aggiornamento e usa una nuova chiave per ogni nuova operazione di scrittura.

`created_at` e `updated_at` sono stringhe di timestamp RFC 3339.
