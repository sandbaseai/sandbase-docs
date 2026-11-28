---
i18nSource: 04f3657850b71e58
title: Créer un message Anthropic
description: Créer un message compatible Anthropic avec un modèle SandBase.
aside: false
outline: false
apiReference:
  title: Créer un message Anthropic
  operation: Inference
  method: POST
  path: /v1/messages
  description: Crée un message via l'endpoint Messages compatible Anthropic de SandBase. SandBase associe le modèle au fournisseur sélectionné et conserve les champs de requête et de réponse compatibles.
  signature: client.messages.create(params)
  groups:
    - title: En-têtes de requête
      fields:
        - name: x-api-key
          type: string
          required: false
          description: "Clé API SandBase. Authorization: Bearer est également accepté ; x-api-key est prioritaire lorsque les deux sont présents."
        - name: anthropic-version
          type: string
          required: false
          default: 2023-06-01
          description: Version de l'API Anthropic transmise en amont. SandBase fournit 2023-06-01 si elle est omise.
        - name: anthropic-beta
          type: string
          required: false
          description: Identifiants de fonctionnalités bêta séparés par des virgules, sous réserve de compatibilité avec le fournisseur.
    - title: Corps de la requête
      schema: MessageCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Identifiant de modèle compatible Anthropic.
        - name: messages
          type: object[]
          required: true
          description: Messages user et assistant contenant du texte ou des blocs de contenu typés.
        - name: max_tokens
          type: integer
          required: true
          description: Nombre maximal de tokens de sortie.
        - name: system
          type: string | object[]
          required: false
          description: Instruction système de premier niveau.
        - name: temperature
          type: number
          required: false
          default: "1"
          description: Température d'échantillonnage, de 0 à 1.
        - name: top_p
          type: number
          required: false
          description: Seuil de nucleus sampling.
        - name: top_k
          type: integer
          required: false
          description: Limite l'échantillonnage aux K tokens les plus probables.
        - name: stop_sequences
          type: string[]
          required: false
          description: Séquences personnalisées qui arrêtent la génération.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Renvoyer des Server-Sent Events au format Anthropic.
        - name: metadata
          type: object
          required: false
          description: Métadonnées de la requête, y compris un user_id facultatif.
        - name: tools
          type: object[]
          required: false
          description: Définitions des outils disponibles pour le modèle.
        - name: tool_choice
          type: object
          required: false
          description: Contrôle le comportement de sélection des outils.
        - name: thinking
          type: object
          required: false
          description: Configuration de la réflexion étendue pour les modèles compatibles.
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
    - title: Authentification
      description: "Utilisez x-api-key ou Authorization: Bearer. Lorsque les deux sont fournis, x-api-key est prioritaire."
    - title: Protocole transparent
      description: À l'exception de l'association des modèles et des règles de compatibilité configurées pour les fournisseurs, SandBase transmet les champs de requête compatibles, les réponses non streamées et les événements SSE sans traduction de protocole.
    - title: Fonctionnalités bêta
      description: anthropic-beta est transmis lorsqu'il est présent. Les règles de compatibilité d'un candidat peuvent supprimer les champs bêta non pris en charge ou ignorer ce candidat.
  errors:
    - status: "400"
      description: Corps de requête invalide ou fonctionnalité non prise en charge.
    - status: "401"
      description: Clé API manquante ou invalide.
    - status: "402"
      description: Limite de dépenses de l'organisation atteinte.
    - status: "403"
      description: Limite de dépenses de la clé API atteinte ou permission de l'organisation refusée.
    - status: "404"
      description: Modèle introuvable ou indisponible.
    - status: "413"
      description: Le fournisseur a rejeté la requête car elle est trop volumineuse.
    - status: "429"
      description: Limite de débit du fournisseur dépassée.
    - status: "500"
      description: Erreur du cycle de vie de la prédiction ou du fournisseur.
    - status: "502"
      description: Le flux amont s'est terminé avant de produire un contenu exploitable.
    - status: "503"
      description: Le routage a échoué ou aucun fournisseur candidat n'était disponible.
---

<ApiReferencePage />
