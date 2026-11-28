---
i18nSource: 04f3657850b71e58
title: Crea messaggio Anthropic
description: Crea un messaggio compatibile con Anthropic usando un modello SandBase.
aside: false
outline: false
apiReference:
  title: Crea messaggio Anthropic
  operation: Inference
  method: POST
  path: /v1/messages
  description: Crea un messaggio tramite l'endpoint Messages di SandBase compatibile con Anthropic. SandBase mappa il modello per il provider selezionato e preserva i campi compatibili di richiesta e risposta.
  signature: client.messages.create(params)
  groups:
    - title: Header della richiesta
      fields:
        - name: x-api-key
          type: string
          required: false
          description: "API key SandBase. È accettato anche Authorization: Bearer; se sono presenti entrambi, x-api-key ha la precedenza."
        - name: anthropic-version
          type: string
          required: false
          default: 2023-06-01
          description: Versione dell'API Anthropic inoltrata all'upstream. Se omessa, SandBase usa 2023-06-01.
        - name: anthropic-beta
          type: string
          required: false
          description: Identificatori di funzionalità beta separati da virgole, soggetti alla compatibilità del provider.
    - title: Corpo della richiesta
      schema: MessageCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Identificatore del modello compatibile con Anthropic.
        - name: messages
          type: object[]
          required: true
          description: Messaggi user e assistant contenenti testo o blocchi di contenuto tipizzati.
        - name: max_tokens
          type: integer
          required: true
          description: Numero massimo di token di output.
        - name: system
          type: string | object[]
          required: false
          description: Istruzione di sistema di primo livello.
        - name: temperature
          type: number
          required: false
          default: "1"
          description: Temperatura di campionamento da 0 a 1.
        - name: top_p
          type: number
          required: false
          description: Soglia del nucleus sampling.
        - name: top_k
          type: integer
          required: false
          description: Limita il campionamento ai primi K token.
        - name: stop_sequences
          type: string[]
          required: false
          description: Sequenze personalizzate che interrompono la generazione.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Restituisce Server-Sent Events in stile Anthropic.
        - name: metadata
          type: object
          required: false
          description: Metadati della richiesta, incluso un user_id facoltativo.
        - name: tools
          type: object[]
          required: false
          description: Definizioni dei tool disponibili per il modello.
        - name: tool_choice
          type: object
          required: false
          description: Controlla il comportamento di selezione dei tool.
        - name: thinking
          type: object
          required: false
          description: Configurazione dell'extended thinking per i modelli supportati.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/messages \
          -H "x-api-key: $SANDBASE_API_KEY" \
          -H "anthropic-version: 2023-06-01" \
          -H "Content-Type: application/json" \
          -d '{"model":"anthropic/claude-sonnet-4","max_tokens":256,"messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from anthropic import Anthropic

        client = Anthropic(api_key="sk-sb-...", base_url="https://api.sandbase.ai")
        message = client.messages.create(
            model="anthropic/claude-sonnet-4",
            max_tokens=256,
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(message.content[0].text)
    - label: TypeScript
      language: typescript
      code: |-
        import Anthropic from "@anthropic-ai/sdk";

        const client = new Anthropic({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai" });
        const message = await client.messages.create({
          model: "anthropic/claude-sonnet-4",
          max_tokens: 256,
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "msg_01...",
        "type": "message",
        "role": "assistant",
        "model": "anthropic/claude-sonnet-4",
        "content": [{ "type": "text", "text": "Hello! How can I help?" }],
        "stop_reason": "end_turn",
        "usage": { "input_tokens": 8, "output_tokens": 7 }
      }
  notes:
    - title: Autenticazione
      description: "Usa x-api-key o Authorization: Bearer. Se sono forniti entrambi, x-api-key ha la precedenza."
    - title: Protocollo trasparente
      description: Fatta eccezione per la mappatura del modello e le regole di compatibilità del provider configurate, SandBase inoltra i campi di richiesta compatibili, le risposte non in streaming e gli eventi SSE senza tradurre il protocollo.
    - title: Funzionalità beta
      description: anthropic-beta viene inoltrato se presente. Le regole di compatibilità di un candidato possono rimuovere i campi beta non supportati o escludere quel candidato.
  errors:
    - status: "400"
      description: Corpo della richiesta non valido o funzionalità non supportata.
    - status: "401"
      description: API key mancante o non valida.
    - status: "402"
      description: Raggiunto il limite di spesa dell'organizzazione.
    - status: "403"
      description: Limite di spesa dell'API key o permessi dell'organizzazione insufficienti.
    - status: "404"
      description: Modello non trovato o non disponibile.
    - status: "413"
      description: Il provider ha rifiutato la richiesta perché troppo grande.
    - status: "429"
      description: Superato il rate limit del provider.
    - status: "500"
      description: Errore del ciclo di vita della previsione o del provider.
    - status: "502"
      description: Lo stream upstream è terminato prima di produrre contenuto utilizzabile.
    - status: "503"
      description: Routing non riuscito o nessun provider candidato disponibile.
---

<ApiReferencePage />
