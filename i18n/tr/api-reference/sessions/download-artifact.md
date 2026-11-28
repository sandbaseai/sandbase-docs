---
i18nSource: faccf5122e785ea0
title: Session Artifact'ını İndirme
description: Yakalanmış bir Session artifact'ını kimliğiyle indirin. Tam dosya indirme sınırını, desteklenen yanıt türlerini ve Range davranışını öğrenin.
aside: false
outline: false
apiReference:
  title: Session Artifact'ını İndirme
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content
  description: List Session Artifacts ile alınan kimliği kullanarak değiştirilemez bir artifact'ın tamamını indirir. 200 MiB'a kadar dosyalar desteklenir. Sorgu parametresi kabul edilmez; Range istekleri erişim doğrulamasından sonra 416 döndürür.
  groups:
    - title: Yol parametreleri
      fields:
        - name: session_id
          type: string
          required: true
          description: Session kimliği (ses_ önekli).
        - name: artifact_id
          type: string
          required: true
          description: Bu Session'ın artifact listesinin döndürdüğü opak art_ kimliğinin tam hali. Ek kimlikleri ve çalışma alanı yolları kabul edilmez.
    - title: Yanıt başlıkları
      fields:
        - name: Content-Type
          type: string
          required: true
          description: Dosya uzantısından çıkarılan medya türü veya application/octet-stream.
        - name: Content-Disposition
          type: string
          required: true
          description: Artifact dosya adıyla birlikte attachment.
        - name: Content-Length
          type: integer
          required: true
          description: Bayt cinsinden tam dosya boyutu.
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

Başarılı bir yanıt JSON değil, dosyanın baytlarıdır. Dosyanın tamamını indirin; kısmi aktarımlar ve sürdürülebilir Range indirmeleri desteklenmez. Kullanılamayan bir artifact `404` döndürür; artifact hizmeti kullanılamıyorsa `executor_unavailable` döner.
