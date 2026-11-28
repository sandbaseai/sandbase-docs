---
i18nSource: 1b5099685e9df6ce
title: Catalogo degli Agent
description: Sfoglia gli Agent pubblici e clonane uno nella tua organizzazione.
---

# Catalogo degli Agent {#agent-catalog}

Il catalogo elenca gli Agent che SandBase pubblica per il riutilizzo. Le voci del catalogo sono di sola lettura. Clonane una per ottenere un Agent privato nella tua organizzazione, che puoi modificare, eseguire e distribuire.

| Metodo | Percorso | Scopo |
|---|---|---|
| `GET` | `/v1/agents/catalog` | Elenca gli Agent pubblici |
| `GET` | `/v1/agents/catalog/{agent_id}` | Ottieni un Agent pubblico, facoltativamente a una `?version=` |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | Copialo nella tua organizzazione |

## Elencare gli Agent del catalogo {#list-catalog-agents}

Paginazione a cursore con `limit` (1-100), `after` e `order`.

```bash
curl "https://api.sandbase.ai/v1/agents/catalog?limit=20" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Ogni voce contiene `id`, `object: "agent"`, `visibility: "public"`, `version`, `name`, `description`, `model`, `created_at` e `updated_at`.

## Ottenere un Agent del catalogo {#get-a-catalog-agent}

```bash
curl "https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60?version=2" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`version` è facoltativo e deve essere un intero positivo. La risposta di dettaglio aggiunge un oggetto `configuration` di sola lettura (nome, descrizione, modello, istruzioni, profilo di runtime, metadati, strumenti, testo, ragionamento e Skills).

## Clonare un Agent del catalogo {#clone-a-catalog-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/clone \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: clone-research-agent" \
  -H "Content-Type: application/json" \
  -d '{"name": "My research assistant"}'
```

Il body accetta i campi facoltativi `version` (intero positivo, per impostazione predefinita la versione pubblica corrente) e `name` (fino a 128 caratteri). La risposta è `201 Created` con un [oggetto Agent](./create) completo che ha un nuovo ID `agt_` nella tua organizzazione. `Idempotency-Key` è facoltativo; invia una chiave stabile in modo che un retry non crei una seconda copia.

Dopo la clonazione, [crea una Session](/api-reference/sessions/create) per provarlo.
