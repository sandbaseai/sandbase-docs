---
i18nSource: faccf5122e785ea0
title: Scarica artifact della Session
description: Scarica un artifact acquisito della Session tramite ID. Scopri il limite di download del file completo, i tipi di risposta supportati e il comportamento di Range.
aside: false
outline: false
apiReference:
  title: Scarica artifact della Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content
  description: Scarica un artifact immutabile completo usando il suo ID ottenuto da List Session Artifacts. Sono supportati file fino a 200 MiB. Non sono accettati parametri di query; le richieste Range restituiscono 416 dopo la verifica dell'accesso.
  groups:
    - title: Parametri di percorso
      fields:
        - name: session_id
          type: string
          required: true
          description: ID della Session (prefisso ses_).
        - name: artifact_id
          type: string
          required: true
          description: ID art_ opaco esatto restituito dall'elenco degli artifact di questa Session. Gli ID degli allegati e i percorsi del workspace non sono accettati.
    - title: Header della risposta
      fields:
        - name: Content-Type
          type: string
          required: true
          description: Tipo di media dedotto dall'estensione del file, oppure application/octet-stream.
        - name: Content-Disposition
          type: string
          required: true
          description: attachment con il nome file dell'artifact.
        - name: Content-Length
          type: integer
          required: true
          description: Dimensione completa del file in byte.
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

Una risposta riuscita contiene i byte del file, non JSON. Scarica il file intero: i trasferimenti parziali e i download Range ripristinabili non sono supportati. Un artifact non disponibile restituisce `404`; un servizio artifact non disponibile restituisce `executor_unavailable`.
