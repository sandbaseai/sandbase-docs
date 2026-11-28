---
i18nSource: 9ee3d6d77d12e944
title: Chat Completions API
description: Crea chat completion compatibili con OpenAI con i modelli linguistici e di visione di SandBase.
aside: false
outline: false
apiReference:
  title: Crea chat completion
  operation: Inference
  method: POST
  path: /v1/chat/completions
  description: Crea una chat completion compatibile con OpenAI con qualsiasi modello di chat supportato da SandBase. I campi compatibili con il provider vengono mantenuti quando la route selezionata li supporta.
  signature: client.chat.completions.create(params)
  groups:
    - title: Corpo della richiesta
      schema: ChatCompletionCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Identificatore del modello dalla Models API.
        - name: messages
          type: object[]
          required: true
          description: Messaggi della conversazione con i ruoli supportati dal provider selezionato, di solito system, developer, user, assistant o tool.
        - name: temperature
          type: number
          required: false
          default: "1"
          description: Temperatura di campionamento da 0 a 2.
        - name: top_p
          type: number
          required: false
          default: "1"
          description: Soglia del nucleus sampling.
        - name: max_tokens
          type: integer
          required: false
          description: Numero massimo di token di output.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Restituisce Server-Sent Events incrementali.
        - name: stop
          type: string | string[]
          required: false
          description: Sequenza o sequenze che interrompono la generazione.
        - name: tools
          type: object[]
          required: false
          description: Definizioni di funzioni disponibili per il modello.
        - name: tool_choice
          type: string | object
          required: false
          default: auto
          description: Controlla se e quale tool viene selezionato.
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: Consente ai modelli supportati di emettere più tool call in un unico turno.
        - name: user
          type: string
          required: false
          description: Identificatore dell'utente finale compatibile con il provider.
        - name: response_format
          type: object
          required: false
          description: Configurazione dell'output come oggetto JSON o JSON Schema.
        - name: reasoning_effort
          type: string
          required: false
          description: Impostazione del reasoning effort compatibile con il provider.
        - name: reasoning
          type: object
          required: false
          description: Configurazione del reasoning, ad esempio effort o max_tokens.
        - name: thinking
          type: object
          required: false
          description: Configurazione del thinking, ad esempio type o budget_tokens.
        - name: extra_body
          type: object
          required: false
          description: Parametri specifici del provider per le route che richiedono una traduzione di protocollo.
        - name: n
          type: integer
          required: false
          default: "1"
          description: Numero di scelte di completion da generare.
        - name: presence_penalty
          type: number
          required: false
          default: "0"
          description: Presence penalty da -2 a 2.
        - name: frequency_penalty
          type: number
          required: false
          default: "0"
          description: Frequency penalty da -2 a 2.
        - name: stream_options
          type: object
          required: false
          description: Opzioni di streaming, ad esempio include_usage.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/chat/completions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"deepseek/deepseek-v4-flash","messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(response.choices[0].message.content)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.chat.completions.create({
          model: "deepseek/deepseek-v4-flash",
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(response.choices[0].message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "chatcmpl_01...",
        "object": "chat.completion",
        "model": "deepseek/deepseek-v4-flash",
        "choices": [{
          "index": 0,
          "message": { "role": "assistant", "content": "Hello! How can I help?" },
          "finish_reason": "stop"
        }],
        "usage": { "prompt_tokens": 8, "completion_tokens": 7, "total_tokens": 15 }
      }
  notes:
    - title: Streaming e tool
      description: "Imposta stream su true per SSE; lo stream termina con data: [DONE]. Aggiungi stream_options.include_usage per ricevere il chunk finale con l'utilizzo. Le tool call e i contenuti multimodali seguono lo schema compatibile con OpenAI."
    - title: Compatibilità con i provider
      description: SandBase mantiene i campi compatibili aggiuntivi sulle route con lo stesso protocollo. Il supporto dei campi tra protocolli diversi e specifici del provider varia; usa extra_body dove applicabile.
  errors:
    - status: "400"
      description: Corpo della richiesta non valido o parametro non supportato.
    - status: "401"
      description: Chiave API mancante o non valida.
    - status: "402"
      description: Raggiunto il limite di spesa dell'organizzazione.
    - status: "404"
      description: Modello non trovato o non disponibile.
    - status: "429"
      description: Limite di frequenza superato.
    - status: "500"
      description: Salvataggio della richiesta o ricerca dell'organizzazione non riuscita.
    - status: "502"
      description: Il provider selezionato ha restituito una risposta non valida.
    - status: "503"
      description: Nessuna route del provider è andata a buon fine.
---

<ApiReferencePage />
