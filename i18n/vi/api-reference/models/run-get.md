---
i18nSource: 2ffb24dad49b9c79
title: Lấy một run bất đồng bộ
description: Poll một run model hoặc API bất đồng bộ của SandBase và lấy kết quả hiện tại hoặc kết quả cuối cùng.
aside: false
outline: false
apiReference:
  title: Lấy một run bất đồng bộ
  operation: Models
  method: GET
  path: /v1/run/{id}
  description: Lấy trạng thái hiện tại hoặc trạng thái cuối của một run bất đồng bộ được tạo bởi POST /v1/run.
  groups:
    - title: Tham số đường dẫn
      fields:
        - name: id
          type: string
          required: true
          description: Định danh run không trong suốt do POST /v1/run trả về. Hãy dùng đúng như giá trị được trả về; không có tiền tố nào được đảm bảo.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/run/opaque-run-id \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "completed",
        "outputs": [{"url":"https://media.sandbase.ai/files/result.png","content_type":"image/png"}]
      }
---

<ApiReferencePage />

## Polling {#polling}

Hãy poll mỗi 5–10 giây cho các tác vụ media hoặc API chạy lâu. Dừng khi `status` là `completed`, `failed` hoặc `timeout`. Phản hồi chưa ở trạng thái cuối có thể không có `outputs`; hãy coi run ID là giá trị không trong suốt và đừng tự dựng một URL trạng thái khác.
