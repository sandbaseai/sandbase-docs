---
i18nSource: faccf5122e785ea0
title: Télécharger un artefact de Session
description: Téléchargez un artefact de Session capturé à partir de son ID. Découvrez la limite de téléchargement de fichier complet, les types de réponse pris en charge et le comportement de Range.
aside: false
outline: false
apiReference:
  title: Télécharger un artefact de Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content
  description: Télécharge un artefact immuable complet à l'aide de son ID obtenu via List Session Artifacts. Les fichiers jusqu'à 200 Mio sont pris en charge. Aucun paramètre de requête n'est accepté ; les requêtes Range renvoient 416 après la validation de l'accès.
  groups:
    - title: Paramètres de chemin
      fields:
        - name: session_id
          type: string
          required: true
          description: ID de la Session (préfixe ses_).
        - name: artifact_id
          type: string
          required: true
          description: ID art_ opaque exact renvoyé par la liste des artefacts de cette Session. Les ID de pièces jointes et les chemins de l'espace de travail ne sont pas acceptés.
    - title: En-têtes de réponse
      fields:
        - name: Content-Type
          type: string
          required: true
          description: Type de média déduit de l'extension du fichier, ou application/octet-stream.
        - name: Content-Disposition
          type: string
          required: true
          description: attachment avec le nom de fichier de l'artefact.
        - name: Content-Length
          type: integer
          required: true
          description: Taille complète du fichier en octets.
        - name: Cache-Control
          type: string
          required: true
          description: no-store.
  examples:
    - label: cURL
      language: bash
      code: |-
        # Set SESSION_ID and ARTIFACT_ID from your Session and artifact list.
        curl --fail-with-body "https://api.sandbase.ai/v1/agents/sessions/${SESSION_ID}/artifacts/${ARTIFACT_ID}/content" \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          --output report.md
    - label: Python
      language: python
      code: |-
        import os
        from pathlib import Path
        import requests

        # Use IDs returned by your own Session and artifact list.
        session_id = os.environ["SESSION_ID"]
        artifact_id = os.environ["ARTIFACT_ID"]
        response = requests.get(
            f"https://api.sandbase.ai/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        Path("report.md").write_bytes(response.content)
    - label: TypeScript
      language: typescript
      code: |-
        import { writeFile } from 'node:fs/promises';

        const { SESSION_ID, ARTIFACT_ID, SANDBASE_API_KEY } = process.env;
        if (!SESSION_ID || !ARTIFACT_ID || !SANDBASE_API_KEY) throw new Error('Missing configuration');
        const response = await fetch(
          `https://api.sandbase.ai/v1/agents/sessions/${encodeURIComponent(SESSION_ID)}/artifacts/${encodeURIComponent(ARTIFACT_ID)}/content`,
          { headers: { Authorization: `Bearer ${SANDBASE_API_KEY}` } },
        );
        if (!response.ok) throw new Error(await response.text());
        await writeFile('report.md', new Uint8Array(await response.arrayBuffer()));
---

<ApiReferencePage />

Une réponse réussie contient les octets du fichier, pas du JSON. Téléchargez le fichier entier ; les transferts partiels et les téléchargements Range avec reprise ne sont pas pris en charge. Un artefact indisponible renvoie `404` ; un service d'artefacts indisponible renvoie `executor_unavailable`.
