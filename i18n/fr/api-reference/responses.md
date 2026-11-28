---
i18nSource: b5cf676d897d17a3
title: Créer une réponse
description: Créez une réponse de modèle compatible OpenAI, y compris pour les requêtes en streaming et avec outils.
aside: false
outline: false
apiReference:
  title: Créer une réponse
  operation: Inference
  method: POST
  path: /v1/responses
  description: Crée une réponse de modèle compatible OpenAI. SandBase conserve les champs de la requête après le mappage du modèle, puis nettoie les réponses pour ne garder que les champs publics d'OpenAI.
  signature: client.responses.create(params)
  groups:
    - title: Corps de la requête
      schema: ResponseCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Identifiant de modèle issu de l'API Models.
        - name: input
          type: string | object[]
          required: false
          description: Texte, items de message ou autre entrée prise en charge par le modèle et le fournisseur sélectionnés.
        - name: instructions
          type: string
          required: false
          description: Instruction système ou développeur pour la réponse.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Renvoie des Server-Sent Events compatibles OpenAI.
        - name: background
          type: boolean
          required: false
          description: Demande une exécution en arrière-plan si le fournisseur sélectionné la prend en charge.
        - name: include
          type: string[]
          required: false
          description: Données de réponse publiques supplémentaires à inclure lorsque c'est pris en charge.
        - name: max_output_tokens
          type: integer
          required: false
          description: Nombre maximal de tokens générés.
        - name: max_tool_calls
          type: integer
          required: false
          description: Nombre maximal d'appels d'outils intégrés lorsque c'est pris en charge.
        - name: metadata
          type: object
          required: false
          description: Métadonnées de la requête transmises au fournisseur.
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: Autorise les modèles compatibles à invoquer des outils en parallèle.
        - name: previous_response_id
          type: string
          required: false
          description: Réponse précédente à poursuivre si la route sélectionnée le permet.
        - name: reasoning
          type: object
          required: false
          description: Configuration du raisonnement pour les modèles compatibles.
        - name: store
          type: boolean
          required: false
          description: Demande le stockage de la réponse côté fournisseur lorsque c'est pris en charge.
        - name: text
          type: object
          required: false
          description: Configuration de la sortie texte et du format structuré.
        - name: tool_choice
          type: string | object
          required: false
          description: Contrôle la sélection des outils.
        - name: tools
          type: object[]
          required: false
          description: Outils mis à la disposition du modèle.
        - name: truncation
          type: string
          required: false
          description: Comportement de troncature de l'entrée.
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
    - title: Compatibilité des requêtes
      description: SandBase remplace model par le modèle amont sélectionné et conserve les autres champs de la requête. La prise en charge varie toutefois selon le fournisseur.
    - title: Réponses nettoyées
      description: Seuls les champs de réponse publics d'OpenAI et l'utilisation des tokens sont renvoyés. Les données de facturation, de compte et de routage du fournisseur ainsi que les extensions de premier niveau inconnues sont supprimées ; le contenu des items de sortie est conservé.
    - title: Streaming
      description: Les événements SSE publics response.* et error sont nettoyés puis transmis. Les événements privés inconnus sont ignorés ; des données mal formées ferment le flux au lieu de transmettre un contenu non sûr.
  errors:
    - status: "400"
      description: JSON invalide, model manquant ou requête fournisseur invalide.
    - status: "401"
      description: Clé API manquante ou invalide.
    - status: "402"
      description: Limite de dépenses de l'organisation ou de la clé API atteinte.
    - status: "403"
      description: Portée de la clé API insuffisante ou refus d'autorisation en amont.
    - status: "413"
      description: Le fournisseur amont a rejeté la requête car elle est trop volumineuse.
    - status: "500"
      description: Échec du cycle de vie de la prédiction ou de la recherche de l'organisation.
    - status: "502"
      description: La réponse amont n'a pas pu être analysée et nettoyée de façon sûre.
    - status: "503"
      description: Échec du routage ou tous les fournisseurs candidats ont été épuisés.
---

<ApiReferencePage />
