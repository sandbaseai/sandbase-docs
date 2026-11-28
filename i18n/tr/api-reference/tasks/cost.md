---
i18nSource: 6f238c169e0f931d
title: Görev Maliyetini Getir
description: Aynı API anahtarıyla oluşturulmuş yakın tarihli bir görevin mutabakat durumunu, nihai maliyetini ve token kullanımını alın.
aside: false
outline: false
apiReference:
  title: Görev Maliyetini Getir
  operation: Tasks
  method: GET
  path: /v1/tasks/{task_id}/cost
  description: Yakın tarihli bir SandBase görevinin asenkron mutabakat durumunu, nihai maliyetini ve token kullanımını alın.
  groups:
    - title: Yol parametreleri
      fields:
        - name: task_id
          type: string
          required: true
          description: Ücretlendirilen bir işlemin döndürdüğü opak görev kimliği; varsa x-task-id yanıt başlığındaki değer de dahildir.
    - title: Yanıt
      fields:
        - name: settled
          type: boolean
          required: true
          description: Nihai maliyet mutabakatının tamamlanıp tamamlanmadığı. Bu değer true olana kadar cost nihai değildir.
        - name: cost · estimated_cost
          type: string
          required: true
          description: Altı ondalık basamaklı USD tutarları. estimated_cost, mutabakattan önceki en iyi tahmine dayalı bir referanstır.
        - name: usage
          type: object
          required: true
          description: Görev için kaydedilen token sayıları.
        - name: pricing
          type: object
          required: false
          description: "Mutabakattan sonra, bir indirim kaydedilmişse: original_cost, discount_amount, discount_percent ve isteğe bağlı discount_type. original_cost eksi discount_amount, cost değerine eşittir."
  examples:
    - label: HTTP
      language: http
      code: "Authorization: Bearer sk-YOUR_API_KEY"
    - label: cURL
      language: bash
      code: |-
        curl -sS \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          "https://api.sandbase.ai/v1/tasks/$TASK_ID/cost" | jq .
  response:
    status: 200 OK
    code: |-
      {
        "id": "f3d2e8a1-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "status": "completed",
        "settled": true,
        "currency": "USD",
        "cost": "0.001234",
        "estimated_cost": "0.001234",
        "usage": {
          "prompt_tokens": 1000,
          "completion_tokens": 200,
          "total_tokens": 1200,
          "cached_tokens": 800,
          "cache_creation_tokens": 0,
          "reasoning_tokens": 0
        }
      }
---

<ApiReferencePage />
