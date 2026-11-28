---
i18nSource: 91ce9f65766e9662
title: Session oluşturma
description: POST /v1/agents/sessions ile kayıtlı veya satır içi bir Agent için Session oluşturun; isteğe bağlı olarak ilk turu akış halinde alın.
aside: false
outline: false
apiReference:
  title: Session oluşturma
  operation: Sessions
  method: POST
  path: /v1/agents/sessions
  description: Kayıtlı bir Agent sürümü veya istekte tanımlanan satır içi bir Agent için Session oluşturun. Agent yapılandırması, Skill sürümleri ve MCP bağlantıları Session boyunca dondurulur. Session'lar her zaman SandBase'in barındırılan bulutunda çalışır; bu nedenle seçilecek bir yürütme ortamı yoktur. stream=true ve bir başlangıç girdisiyle yanıt, JSON Session yerine ilk turun 201 Server-Sent Events akışıdır. Yürütme kabulü (bakiye ve kuruluş durumu) burada denetlenir. OpenAI SDK'sı bir environment argümanı gerektirir; bkz. OpenAI uyumluluğu (/agents/openai-compatibility).
  groups:
    - title: Başlıklar
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: İsteğe bağlı. Atlanırsa hizmet bir anahtar üretir; bu durumda yeniden denenen bir istek kopya oluşturabilir. Yeniden denemeler için kendi sabit anahtarınızı gönderin.
    - title: İstek gövdesi
      description: Katı JSON nesnesi.
      fields:
        - name: agent_id
          type: string
          required: false
          description: Kayıtlı Agent kimliği (agt_ önekli). Agent, projection_status değeri ready olacak şekilde active durumda olmalıdır. agent_id, agent veya her ikisini gönderin.
        - name: agent
          type: object
          required: false
          description: Agent yapılandırması. Kabul edilen alanlar model, instructions, runtime_profile (codex, claude veya mcode; varsayılan codex), service_tier, tools, text, reasoning ve multi_agent'tır ve Create Agent'taki gibi doğrulanır. agent_id olmadan satır içi bir Agent tanımlar ve model zorunludur; satır içi Agent'lar Skills veya MCP bağlantıları taşımaz. agent_id ile gönderdiğiniz her alan, yalnızca bu Session için kayıtlı sürümdeki ilgili alanın yerini alır. Bilinmeyen alanlar 400 döndürür.
        - name: version
          type: integer
          required: false
          description: Agent sürümü. Varsayılan olarak geçerli sürümdür. Satır içi bir Agent ile kullanılamaz.
        - name: title
          type: string
          required: false
          description: Session başlığı.
        - name: input
          type: string | array
          required: false
          description: 'İsteğe bağlı ilk girdi: bir metin veya tam olarak bir mesaj içeren bir dizi, örn. [{"role":"user","content":[{"type":"input_text","text":"…"}]}]. Tek başına bir nesne 400 döndürür.'
        - name: model
          type: string
          required: false
          description: Model geçersiz kılma. agent.model OpenAI SDK biçimidir; ikisi birlikte gönderilirse eşleşmeleri gerekir.
        - name: metadata
          type: object
          required: false
          description: En fazla 16 metin çifti.
        - name: stream
          type: boolean
          required: false
          description: "true olduğunda boş olmayan bir input gerektirir ve text/event-stream gövdesiyle 201 döndürür. Olaylar Stream events biçimini kullanır (event: <type>, data: <json>); ilk olay olan agent.session.created Session anlık görüntüsünü taşır, ardından turun öğe ve çıktı olayları gelir. Akış başlamadan önceki doğrulama, kabul ve diğer hatalar normal JSON hatasını döndürür. Varsayılan false."
        - name: environment
          type: object
          required: false
          description: Yalnızca OpenAI SDK uyumluluğu için. Doğrudan HTTP çağrılarında atlayın; {"type":"openai_hosted"} kabul edilir, diğer tüm türler 400 döndürür.
        - name: model_provider
          type: object
          required: false
          description: Model kimlik bilgisi. Çağıran API anahtarınızı kullanmak için atlayın. {"type":"custom","base_url":"https://…","api_key":"…"} kendi OpenAI uyumlu uç noktanızı çağırır. Yalnızca yazılabilir.
        - name: github_workspace
          type: object
          required: false
          description: "Bu Session için /workspace içine klonlanacak GitHub deposu: {\"repository_id\":\"1195090324\",\"ref\":\"main\",\"connection_id\":\"plc_…\"}. Yalnızca repository_id zorunludur; ref varsayılan olarak varsayılan daldır. Atlanırsa veya null olursa varsa Agent'ın çalışma alanı deposu kullanılır, yoksa hiçbir şey klonlanmaz. Depo, Agent'ın GitHub bağlantısı kapsamında olmalıdır. Bkz. GitHub depo çalışma alanı (/agents/github-workspace)."
    - title: Session nesnesi
      description: create, get, update, rename, archive ve unarchive tarafından döndürülür.
      fields:
        - name: id
          type: string
          required: true
          description: ses_ önekli Session kimliği.
        - name: status
          type: string
          required: true
          description: "Yürütme durumu: idle, in_progress veya failed. requires_action henüz desteklenmez ve 502 executor_contract_error olarak görünür."
        - name: lifecycle_status
          type: string
          required: true
          description: active veya archived. Arşivlenmiş Session'lar girdiyi reddeder.
        - name: failure
          type: object · null
          required: true
          description: code, message, action ve isteğe bağlı retryable içeren herkese açık hata.
        - name: agent_id · agent_version · model
          type: string · integer · string
          required: true
          description: Dondurulmuş Agent sürümü ve geçerli model.
        - name: agent · usage
          type: object · object | null
          required: true
          description: Geçerli Agent yapılandırmasının OpenAI biçimli anlık görüntüsü ve token kullanımı (bir tur kullanım bildirene kadar null).
        - name: source · source_id
          type: string · null
          required: false
          description: Session'ın kaynağı. POST /v1/agents/sessions ile oluşturulan Session'lar direct ve null bir source_id bildirir.
        - name: row_version
          type: integer
          required: true
          description: rename, archive ve unarchive için karşılaştır-ve-ayarla token'ı.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/sessions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: market-scan-2026-10-06" \
          -H "Content-Type: application/json" \
          -d '{
            "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            "title": "Market scan"
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        session = client.beta.agents.sessions.create(
            agent_id="agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
        )
        print(session.id, session.status)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "market-scan-2026-10-06",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents/sessions",
            headers=headers,
            json={
                "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
                "title": "Market scan",
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'market-scan-2026-10-06',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            "title": "Market scan"
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 201 Created
    code: |-
      {
        "id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
        "object": "agent.session",
        "agent": {
          "id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
          "name": "Research assistant",
          "model": "deepseek/deepseek-v4-flash",
          "instructions": "Answer with cited sources.",
          "multi_agent": {"enabled": false, "max_concurrent_subagents": null},
          "reasoning": {"effort": null, "summary": null},
          "service_tier": "auto",
          "text": {"format": {"type": "text"}, "verbosity": "medium"},
          "tools": []
        },
        "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
        "agent_version": 1,
        "title": "Market scan",
        "model": "deepseek/deepseek-v4-flash",
        "environment": {
          "id": "env_…",
          "type": "openai_hosted",
          "capability_directories": [],
          "files": [],
          "network": {"access": "enabled", "allowed_domains": []},
          "packages": {"npm": [], "python": [], "system": []},
          "plugins": [],
          "skills": []
        },
        "metadata": {},
        "status": "idle",
        "lifecycle_status": "active",
        "sync_status": "ready",
        "execution_status": "idle",
        "failure": null,
        "row_version": 1,
        "required_actions": [],
        "vault_ids": [],
        "usage": null,
        "created_at": 1791273600,
        "last_active_at": 1791273600,
        "updated_at": 1791273600,
        "archived_at": null,
        "source": "direct",
        "source_id": null
      }
---

<ApiReferencePage />
