---
i18nSource: 06feb27e20f1b7f5
title: Hesap Geçmişini Listele
description: API anahtarının organizasyonuna ait son yürütme kayıtlarını listeleyin.
aside: false
outline: false
apiReference:
  title: Hesap Geçmişini Listele
  operation: Account
  method: GET
  path: /v1/account/history
  description: Organizasyon kapsamındaki son yürütme kayıtlarını en yeniden eskiye doğru listeleyin. Hata mesajları temizlenir; saklanan JSON anlık görüntüleri çözümlenemediğinde yanıta eklenmez.
  groups:
    - title: Sorgu parametreleri
      fields:
        - name: model
          type: string
          required: false
          description: Tam mantıksal model adı.
        - name: api_key_id
          type: string
          required: false
          description: Tam API Key kaynak kimliği.
        - name: type
          type: multimodal | llm | api
          required: false
          description: Yürütme kategorisi; multimodal görüntü, video ve sesi kapsar.
        - name: status
          type: completed | failure | in_progress
          required: false
          description: Gruplanmış yürütme durumu.
        - name: error_type
          type: string
          required: false
          description: Tam hata türü; hata türü olmayan kayıtlar için unknown.
        - name: range
          type: 1h | 24h | 7d | 30d
          required: false
          description: Kayan oluşturulma zamanı aralığı; varsayılan 7d.
        - name: page
          type: integer
          required: false
          description: 1'den başlayan sayfa numarası.
        - name: page_size
          type: integer
          required: false
          description: Sayfa başına öğe sayısı, 1 ile 100 arası; varsayılan 20.
        - name: request_id
          type: string
          required: false
          description: Organizasyon kapsamındaki tam yürütme kimliği. Ayarlandığında diğer filtreler yok sayılır ve tek bir sonuç istenir.
        - name: time_basis
          type: created_at | settled_at
          required: false
          description: Açık bir zaman penceresi için zaman damgası temeli.
        - name: billing_scope
          type: any | positive | token
          required: false
          description: Mutabakat filtresi; positive ve token için time_basis=settled_at gerekir.
        - name: start_at
          type: RFC 3339 timestamp
          required: false
          description: Pencere başlangıcı (dahil), end_at ile birlikte kullanılır.
        - name: end_at
          type: RFC 3339 timestamp
          required: false
          description: Pencere bitişi (hariç); pencere 32 günü aşamaz.
        - name: latency_sample
          type: positive | terminal_positive
          required: false
          description: Gecikme örneklerini pozitif değerlerle sınırlayın.
        - name: min_latency_ms
          type: integer
          required: false
          description: Milisaniye cinsinden minimum gecikme.
        - name: timezone
          type: IANA time-zone name
          required: false
          description: Yalnızca uyumluluk doğrulaması içindir. Zaman damgaları UTC olarak kalır; tam request_id araması bu parametreyi yok sayar.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl "https://api.sandbase.ai/v1/account/history?range=24h&page_size=20" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "items": [
          {
            "id": "opaque-task-id",
            "model": "openai/gpt-5.4",
            "type": "llm",
            "execution_mode": "sync",
            "status": "completed",
            "latency_ms": 842,
            "user_cost": "0.001250",
            "prompt_tokens": 120,
            "completion_tokens": 48,
            "total_tokens": 168,
            "cached_tokens": 0,
            "cache_creation_tokens": 0,
            "created_at": "2026-08-24T00:00:00Z",
            "completed_at": "2026-08-24T00:00:01Z",
            "api_key_prefix": "sk-1234567"
          }
        ],
        "total": 1,
        "page": 1,
        "page_size": 20
      }
---

<ApiReferencePage />
