---
i18nSource: 9ee3d6d77d12e944
title: API Chat Completions
description: Créez des chat completions compatibles OpenAI avec les modèles de langage et de vision de SandBase.
aside: false
outline: false
apiReference:
  title: Créer une chat completion
  operation: Inference
  method: POST
  path: /v1/chat/completions
  description: Crée une chat completion compatible OpenAI avec n'importe quel modèle de chat pris en charge par SandBase. Les champs compatibles avec le fournisseur sont conservés lorsque la route sélectionnée les prend en charge.
  signature: client.chat.completions.create(params)
  groups:
    - title: Corps de la requête
      schema: ChatCompletionCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Identifiant du modèle issu de la Models API.
        - name: messages
          type: object[]
          required: true
          description: Messages de la conversation, avec les rôles pris en charge par le fournisseur sélectionné, généralement system, developer, user, assistant ou tool.
        - name: temperature
          type: number
          required: false
          default: "1"
          description: Température d'échantillonnage, de 0 à 2.
        - name: top_p
          type: number
          required: false
          default: "1"
          description: Seuil d'échantillonnage nucleus.
        - name: max_tokens
          type: integer
          required: false
          description: Nombre maximal de tokens en sortie.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Renvoie des Server-Sent Events incrémentaux.
        - name: stop
          type: string | string[]
          required: false
          description: Séquence ou séquences qui arrêtent la génération.
        - name: tools
          type: object[]
          required: false
          description: Définitions de fonctions disponibles pour le modèle.
        - name: tool_choice
          type: string | object
          required: false
          default: auto
          description: Détermine si un outil est sélectionné, et lequel.
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: Autorise les modèles compatibles à émettre plusieurs appels d'outils en un seul tour.
        - name: user
          type: string
          required: false
          description: Identifiant de l'utilisateur final compatible avec le fournisseur.
        - name: response_format
          type: object
          required: false
          description: Configuration de sortie en objet JSON ou JSON Schema.
        - name: reasoning_effort
          type: string
          required: false
          description: Réglage de l'effort de raisonnement compatible avec le fournisseur.
        - name: reasoning
          type: object
          required: false
          description: Configuration du raisonnement, comme effort ou max_tokens.
        - name: thinking
          type: object
          required: false
          description: Configuration de la réflexion, comme type ou budget_tokens.
        - name: extra_body
          type: object
          required: false
          description: Paramètres propres au fournisseur pour les routes qui nécessitent une traduction de protocole.
        - name: n
          type: integer
          required: false
          default: "1"
          description: Nombre de choix de complétion à générer.
        - name: presence_penalty
          type: number
          required: false
          default: "0"
          description: Pénalité de présence, de -2 à 2.
        - name: frequency_penalty
          type: number
          required: false
          default: "0"
          description: Pénalité de fréquence, de -2 à 2.
        - name: stream_options
          type: object
          required: false
          description: Options de streaming, comme include_usage.
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
    - title: Streaming et outils
      description: "Définissez stream sur true pour le SSE ; le flux se termine par data: [DONE]. Ajoutez stream_options.include_usage pour recevoir le chunk final d'utilisation. Les appels d'outils et le contenu multimodal suivent le schéma compatible OpenAI."
    - title: Compatibilité des fournisseurs
      description: SandBase conserve les champs compatibles supplémentaires sur les routes de même protocole. La prise en charge des champs inter-protocoles et propres aux fournisseurs varie ; utilisez extra_body le cas échéant.
  errors:
    - status: "400"
      description: Corps de requête invalide ou paramètre non pris en charge.
    - status: "401"
      description: Clé API manquante ou invalide.
    - status: "402"
      description: Limite de dépenses de l'organisation atteinte.
    - status: "404"
      description: Modèle introuvable ou indisponible.
    - status: "429"
      description: Limite de débit dépassée.
    - status: "500"
      description: Échec de la persistance de la requête ou de la recherche de l'organisation.
    - status: "502"
      description: Le fournisseur sélectionné a renvoyé une réponse invalide.
    - status: "503"
      description: Aucune route de fournisseur n'a abouti.
---

<ApiReferencePage />
