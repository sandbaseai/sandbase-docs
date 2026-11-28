---
i18nSource: b5cf676d897d17a3
title: Crea risposta
description: Crea una risposta del modello compatibile con OpenAI, incluse le richieste in streaming e con strumenti.
aside: false
outline: false
apiReference:
  title: Crea risposta
  operation: Inference
  method: POST
  path: /v1/responses
  description: Crea una risposta del modello compatibile con OpenAI. SandBase conserva i campi della richiesta dopo la mappatura del modello, poi ripulisce le risposte lasciando solo i campi pubblici di OpenAI.
  signature: client.responses.create(params)
  groups:
    - title: Body della richiesta
      schema: ResponseCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Identificatore del modello ricavato dalla Models API.
        - name: input
          type: string | object[]
          required: false
          description: Testo, elementi messaggio o altro input supportato dal modello e dal provider selezionati.
        - name: instructions
          type: string
          required: false
          description: Istruzione di sistema o dello sviluppatore per la risposta.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Restituisce Server-Sent Events compatibili con OpenAI.
        - name: background
          type: boolean
          required: false
          description: Richiede l'esecuzione in background, se supportata dal provider selezionato.
        - name: include
          type: string[]
          required: false
          description: Dati pubblici aggiuntivi della risposta da includere, se supportati.
        - name: max_output_tokens
          type: integer
          required: false
          description: Numero massimo di token generati.
        - name: max_tool_calls
          type: integer
          required: false
          description: Numero massimo di chiamate a strumenti integrati, se supportato.
        - name: metadata
          type: object
          required: false
          description: Metadati della richiesta inoltrati al provider.
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: Consente ai modelli supportati di invocare strumenti in parallelo.
        - name: previous_response_id
          type: string
          required: false
          description: Risposta precedente da proseguire, se supportato dalla route selezionata.
        - name: reasoning
          type: object
          required: false
          description: Configurazione del ragionamento per i modelli supportati.
        - name: store
          type: boolean
          required: false
          description: Richiede l'archiviazione della risposta lato provider, se supportata.
        - name: text
          type: object
          required: false
          description: Configurazione dell'output testuale e del formato strutturato.
        - name: tool_choice
          type: string | object
          required: false
          description: Controlla la selezione degli strumenti.
        - name: tools
          type: object[]
          required: false
          description: Strumenti disponibili per il modello.
        - name: truncation
          type: string
          required: false
          description: Comportamento di troncamento dell'input.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/responses \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-5.2","input":"Explain immutable infrastructure in one sentence."}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.responses.create(
            model="openai/gpt-5.2",
            input="Explain immutable infrastructure in one sentence.",
        )
        print(response.output_text)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.responses.create({
          model: "openai/gpt-5.2",
          input: "Explain immutable infrastructure in one sentence.",
        });
        console.log(response.output_text);
  response:
    status: 200 OK
    code: |-
      {
        "id": "resp_01...",
        "object": "response",
        "status": "completed",
        "model": "openai/gpt-5.2",
        "output": [],
        "usage": {
          "input_tokens": 18,
          "output_tokens": 12,
          "total_tokens": 30,
          "input_tokens_details": {"cached_tokens": 0},
          "output_tokens_details": {"reasoning_tokens": 0}
        }
      }
  notes:
    - title: Compatibilità delle richieste
      description: SandBase riscrive model con il modello upstream selezionato e conserva gli altri campi della richiesta. Il supporto varia comunque in base al provider.
    - title: Risposte ripulite
      description: Vengono restituiti solo i campi pubblici della risposta OpenAI e l'utilizzo dei token. Fatturazione, account e routing del provider, insieme alle estensioni di primo livello sconosciute, vengono rimossi; il contenuto degli elementi di output viene conservato.
    - title: Streaming
      description: Gli eventi SSE pubblici response.* ed error vengono ripuliti e inoltrati. Gli eventi privati sconosciuti vengono scartati; i dati malformati chiudono lo stream invece di inoltrare contenuti non sicuri.
  errors:
    - status: "400"
      description: JSON non valido, model mancante o richiesta al provider non valida.
    - status: "401"
      description: Chiave API mancante o non valida.
    - status: "402"
      description: Raggiunto il limite di spesa dell'organizzazione o della chiave API.
    - status: "403"
      description: Scope della chiave API o permesso upstream rifiutato.
    - status: "413"
      description: Il provider upstream ha rifiutato la richiesta perché troppo grande.
    - status: "500"
      description: Errore nel ciclo di vita della previsione o nella ricerca dell'organizzazione.
    - status: "502"
      description: Non è stato possibile analizzare e ripulire in modo sicuro la risposta upstream.
    - status: "503"
      description: Routing non riuscito o tutti i provider candidati sono stati esauriti.
---

<ApiReferencePage />
