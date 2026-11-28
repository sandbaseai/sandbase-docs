---
i18nSource: 1afa8f1905c6e53c
title: Anthropic Messages
description: Usa con SandBase messaggi, blocchi di contenuto, strumenti, thinking e streaming compatibili con Anthropic.
---

# Anthropic Messages {#anthropic-messages}

SandBase offre un endpoint compatibile con Anthropic su `POST /v1/messages`. Le applicazioni basate sull'SDK di Anthropic possono collegarsi cambiando la chiave API e il base URL.

```python
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai",
)
```

## Header di autenticazione e di versione {#authentication-and-version-headers}

Usa `x-api-key` o `Authorization: Bearer …`. Se li fornisci entrambi, `x-api-key` ha la precedenza. L'header facoltativo `anthropic-version` viene inoltrato upstream e, se omesso, vale `2023-06-01`. Anche gli eventuali valori `anthropic-beta` vengono inoltrati, in base alla compatibilità del provider.

## Messaggi e blocchi di contenuto {#messages-and-content-blocks}

I messaggi usano i ruoli `user` e `assistant`. Inserisci l'istruzione di sistema nel campo di primo livello `system`. Il contenuto può essere testo semplice o un array di blocchi tipizzati come `text`, `image`, `tool_use` e `tool_result`.

## Strumenti e ragionamento esteso {#tools-and-extended-thinking}

Aggiungi le definizioni degli strumenti in `tools` e controlla la selezione con `tool_choice`. Se il modello selezionato lo supporta, configura il ragionamento esteso con `thinking`; conserva i blocchi di thinking restituiti quando prosegui la conversazione.

## Streaming {#streaming}

Imposta `stream: true` per ricevere eventi SSE in stile Anthropic, tra cui `message_start`, gli eventi dei blocchi di contenuto, `message_delta` e `message_stop`. SandBase inoltra anche gli eventi keepalive e gli eventi beta definiti dal provider. Per garantire la compatibilità futura, i client devono ignorare i tipi di evento sconosciuti e gestire gli eventi `error` a livello di protocollo.

## Compatibilità {#compatibility}

SandBase mappa il nome pubblico del modello sul provider selezionato. Gli altri campi di richiesta compatibili e i byte della risposta vengono conservati, a meno che quel provider non abbia una regola di compatibilità esplicita che rimuove un campo non supportato o scarta il candidato. Le funzionalità beta specifiche del provider potrebbero non essere disponibili su tutti i modelli. Per lo schema completo di richiesta e risposta, vedi [Create Anthropic Message](/api-reference/anthropic-compat).
