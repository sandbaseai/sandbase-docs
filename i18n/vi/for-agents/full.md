---
i18nSource: e566962f42a5f6b0
title: Hướng dẫn SandBase AI API
description: Hướng dẫn SandBase API mở rộng dành cho AI agent, gồm các quy trình cốt lõi, ví dụ request và liên kết tới đặc tả OpenAPI chính thức.
---

# Hướng dẫn AI API {#ai-api-guide}

::: info Hợp đồng Session
Session (`ses_*`) chạy một phiên bản Agent đã lưu và được tạo trực tiếp bằng `POST /v1/agents/sessions`. Runtime Session ID nội bộ không được công khai.
:::

> Hướng dẫn một trang cho các quy trình API phổ biến nhất. Để xem hợp đồng đầy đủ ở dạng máy đọc được, hãy dùng [đặc tả OpenAPI](https://www.sandbase.ai/docs/openapi.yaml). Phiên bản văn bản thuần: [`llms-full.txt`](https://www.sandbase.ai/docs/llms-full.txt).

## Xác thực {#authentication}

Mọi request đều yêu cầu:

```
Authorization: Bearer sk-YOUR_KEY
```

Base URL: `https://api.sandbase.ai/v1`

---

## Thuật ngữ {#terminology}

| Thuật ngữ | Ý nghĩa |
|------|---------|
| **Task** | Bản ghi thực thi có tính phí cho các thao tác như suy luận model. Không phải thao tác API nào cũng tạo task. |
| **Run** | Request tạo media qua `POST /v1/run`. Có thể đồng bộ hoặc bất đồng bộ. Poll bằng `GET /v1/run/{id}`. |
| **Session** | Một lần thực thi Agent qua `POST /v1/agents/sessions`, chứa cuộc hội thoại, hoạt động của công cụ và output. Truy vấn bằng `GET /v1/agents/sessions/{session_id}`. |
> **run và session**: "run" của model (`/v1/run`) là một tác vụ sinh nội dung của model. "Session" (`/v1/agents/sessions`) là một lần thực thi Agent. Mọi ID đều không trong suốt và không được parse.
>
> **task và run**: "run" hoặc "session" là request bạn gửi; "task" là bản ghi thực thi có tính phí. Dùng
> `GET /v1/tasks/{task_id}/cost` khi một thao tác trả về task ID. Không phải thao tác API nào cũng tạo task.

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- GENERATION APIs                                          -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Chat Completions {#chat-completions}

### POST /v1/chat/completions {#post-v1-chat-completions}

Tương thích OpenAI. Khả năng hỗ trợ streaming, công cụ, thị giác, suy luận và structured output phụ thuộc vào model được chọn và schema mà model khai báo.

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Explain quantum computing in one paragraph."}
    ],
    "temperature": 0.7,
    "max_tokens": 500,
    "stream": false
  }'
```

**Response:**

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "model": "openai/gpt-5.6-luna",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Quantum computing leverages quantum mechanical phenomena..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 89,
    "total_tokens": 113
  }
}
```

> Một số thao tác có tính phí có thể trả về `x-task-id: f3d2e8a1-7c4b-4a12-9d2e-123456789abc`; khi có, hãy dùng nó để truy vấn
> `GET /v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost`.

---

## Anthropic Messages {#anthropic-messages}

### POST /v1/messages {#post-v1-messages}

Messages API tương thích Anthropic. Caching và các tính năng tùy chọn khác phụ thuộc vào model được chọn và schema của request.

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-sonnet-5",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "What is SandBase?"}]
  }'
```

**Response:**

```json
{
  "id": "msg_abc123",
  "type": "message",
  "role": "assistant",
  "content": [
    { "type": "text", "text": "SandBase is an AI agent infrastructure platform..." }
  ],
  "model": "anthropic/claude-sonnet-5",
  "stop_reason": "end_turn",
  "usage": { "input_tokens": 12, "output_tokens": 64 }
}
```

---

## Tạo ảnh {#image-generation}

### POST /v1/run {#post-v1-run}

Endpoint `/v1/run` là **endpoint sinh nội dung thống nhất**: trường `model` quyết định loại output (ảnh, video hoặc âm thanh).

> **Cách xử lý response:** Kiểm tra trường `status`.
> - `"completed"` → kết quả nằm trong `outputs`, hoàn tất.
> - `"pending"` hoặc `"running"` → poll `GET /v1/run/{id}` mỗi 2–5 giây cho đến khi có trạng thái kết thúc (`completed`, `failed` hoặc `timeout`).

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bfl/flux-2/flash",
    "prompt": "A futuristic city at sunset, cyberpunk style",
    "aspect_ratio": "1:1"
  }'
```

**Response (đồng bộ):**

```json
{
  "id": "f3d2e8a1-7c4b-4a12-9d2e-123456789abc",
  "status": "completed",
  "model": "bfl/flux-2/flash",
  "created_at": "2026-08-02T12:00:00Z",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/f3d2e8a1-7c4b-4a12-9d2e-123456789abc.png",
    "content_type": "image/png",
    "width": 1024,
    "height": 1024
  }]
}
```

---

## Tạo video {#video-generation}

### POST /v1/run {#post-v1-run-1}

Kiểm tra `execution_mode` của model được chọn. Khi lần gửi trả về `pending` hoặc `running`, hãy poll `GET /v1/run/{id}` cho đến khi có trạng thái kết thúc.

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kwaivgi/kling-video/v3/standard/text-to-video",
    "prompt": "A drone flying over mountains at golden hour",
    "duration": 5
  }'
```

**Response (bất đồng bộ, lần đầu):**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "running",
  "model": "kwaivgi/kling-video/v3/standard/text-to-video",
  "created_at": "2026-08-02T12:00:00Z"
}
```

**Poll trạng thái: `GET /v1/run/{id}`**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "completed",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/6a7b9c10-2d3e-4f50-8a61-23456789abcd.mp4",
    "content_type": "video/mp4",
    "duration": 5
  }]
}
```

---

## Âm thanh (chuyển văn bản thành giọng nói) {#audio-text-to-speech}

### POST /v1/run {#post-v1-run-2}

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seed-speech/tts/2.0",
    "text": "Hello world, this is a test of text to speech."
  }'
```

**Response:**

```json
{
  "id": "7b8c0d21-3e4f-5061-9b72-3456789abcde",
  "status": "completed",
  "model": "bytedance/seed-speech/tts/2.0",
  "created_at": "2026-08-02T12:00:00Z",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/7b8c0d21-3e4f-5061-9b72-3456789abcde.mp3",
    "content_type": "audio/mpeg",
    "duration_seconds": 3.2
  }]
}
```

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- DISCOVERY APIs                                           -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Liệt kê model {#list-models}

### GET /v1/models {#get-v1-models}

Trả về các model logic đang bật theo định dạng danh sách model tương thích OpenAI. Endpoint này không phân trang và
mặc định là `type=llm`. Thông tin chi tiết về khả năng và giá được cố ý lược bỏ.

```bash
curl https://api.sandbase.ai/v1/models \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Response chứa `object: "list"` và mảng `data`. Mỗi phần tử chứa `id`, `object`, `created` và
`owned_by`; dùng `id` làm tên model logic. Lấy chi tiết model đó để có metadata về khả năng và giá.

---

## Lấy thông tin model {#get-model}

### GET /v1/models/{id_or_name} {#get-v1-models-1}

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Response chi tiết bổ sung `unified_schema`, `supported_modes` và `model_card`. Giá chi tiết nằm trong
`model_card`; không có đối tượng `pricing` ở cấp cao nhất.

---

## Lấy chi phí task {#get-task-cost}

### GET /v1/tasks/{task_id}/cost {#get-v1-tasks-task-id-cost}

Kiểm tra chi phí đã ghi nhận của một task bằng task ID do thao tác API trả về.

```bash
curl https://api.sandbase.ai/v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

**Response:**

```json
{
  "id": "f3d2e8a1-7c4b-4a12-9d2e-123456789abc",
  "status": "completed",
  "settled": true,
  "currency": "USD",
  "cost": "0.000325",
  "estimated_cost": "0.000325",
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 89,
    "total_tokens": 113,
    "cached_tokens": 0,
    "cache_creation_tokens": 0,
    "reasoning_tokens": 0
  }
}
```

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- PLATFORM APIs                                            -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Quy ước của nền tảng Agents {#agents-platform-conventions}

- Base URL `https://api.sandbase.ai/v1`. Gửi `Authorization: Bearer sk-YOUR_KEY` hoặc `X-API-Key: sk-YOUR_KEY` (cùng giá trị nếu gửi cả hai). `OpenAI-Beta` là tùy chọn; nếu gửi thì phải là `agents=v1`. OpenAI SDK chính thức (`client.beta.agents`, `client.skills`) hoạt động với `base_url="https://api.sandbase.ai/v1"`; các điểm khác biệt được liệt kê trong [Tương thích OpenAI](/agents/openai-compatibility).

- Body là JSON nghiêm ngặt, tối đa 1 MiB; trường không xác định trả về 400.

- Lỗi: `{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}`. Phân nhánh xử lý theo `code`; xem [Hướng dẫn lỗi](./errors#agents-platform-errors).

- `row_version` là token compare-and-set cho PATCH, archive, restore và rotate. Khi gặp 409, hãy đọc lại.

- Danh sách theo cursor (Agents, Sessions, items, turns, Skills): `limit` 1-100, `after`, `order`; response `{object:"list", data, has_more, first_id, last_id}`.

- Danh sách theo offset (phiên bản Agent, tệp đính kèm, kết nối MCP, Secret): `limit`, `offset`; response `{data, total, limit, offset}`.

- ID: Agent `agt_`, Session `ses_`, Skill `skl_`, kết nối MCP `mcp_`, Secret `sec_`, tệp đính kèm `fil_`. Hãy coi chúng là chuỗi không trong suốt.

---

## Agents {#agents}

### POST /v1/agents — Tạo Agent {#post-v1-agents-—-create-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: create-research-agent-1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research assistant",
    "model": "deepseek/deepseek-v4-flash",
    "instructions": "Research the question and cite sources."
  }'
```

Bắt buộc: `model`. Tùy chọn: `name`, `instructions`, `description`, `runtime_profile` (mặc định `codex`, `claude`, `mcode`), `skills` (`[{"skill_id","version"}]`), `mcp_connections` (`[{"connection_id","server_label","allowed_tools","required"}]`), `tools`, `text`, `reasoning`, `service_tier`, `metadata`, `note`. Trả về `201` với `id` (`agt_`), `version`, `row_version`, `status` và `projection_status`; hãy bắt đầu Session khi `projection_status` là `ready`. Công cụ `web_search` phải dùng `mode: "disabled"`, và kết quả hàm phía client (`requires_action`) không được hỗ trợ.

### GET /v1/agents — Liệt kê Agent {#get-v1-agents-—-list-agents}

Query `status` (mặc định `active`, `archived`, `all`) cùng phân trang theo cursor.

### GET /v1/agents/{agent_id} — Lấy Agent {#get-v1-agents-agent-id-—-get-agent}

### POST /v1/agents/{agent_id} — Cập nhật Agent (kiểu SDK) {#post-v1-agents-agent-id-—-update-agent-sdk-style}

Cập nhật một phần `name`, `instructions`, `model`, `metadata`, `service_tier`, `tools`, `text`, `reasoning`, `runtime_profile`, `mcp_connections`, `skills`. Không cần `row_version`; tạo ra một phiên bản mới.

### PATCH /v1/agents/{agent_id} — Cập nhật Agent (compare-and-set) {#patch-v1-agents-agent-id-—-update-agent-compare-and-set}

Các trường giống trên, cộng thêm `description` và `note`; `row_version` là bắt buộc. `null` tường minh trả về 400.

### Phiên bản, lưu trữ, khôi phục, catalog {#versions-archive-restore-catalog}

- `GET /v1/agents/{agent_id}/versions` và `GET /v1/agents/{agent_id}/versions/{version}` đọc các bản chụp bất biến.

- `POST /v1/agents/{agent_id}/archive`, `POST /v1/agents/{agent_id}/unarchive` nhận `{"row_version"}`. `DELETE /v1/agents/{agent_id}` cũng lưu trữ Agent.

- `POST /v1/agents/{agent_id}/restore` nhận `{"source_version","row_version"}`.

- `GET /v1/agents/catalog` liệt kê các Agent công khai; `POST /v1/agents/catalog/{agent_id}/clone` sao chép một Agent vào tổ chức của bạn (`201`, `agt_` mới).

---

## Sessions {#sessions}

Session chạy một phiên bản Agent đã lưu. Các đường dẫn nằm dưới `/v1/agents/sessions`. Phiên bản Agent, phiên bản Skill và kết nối MCP được cố định khi tạo.

### POST /v1/agents/sessions — Tạo Session {#post-v1-agents-sessions-—-create-session}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_..."}'
```

Gửi `agent_id` (Agent đã lưu), `agent` (Agent inline hoặc ghi đè theo từng Session cho `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` và `multi_agent`), hoặc cả hai. Tùy chọn: `version` (chỉ với Agent đã lưu), `title`, `input` (một chuỗi, hoặc một mảng có đúng một user message chứa một phần `input_text`), `model` hoặc `agent.model`, `metadata`, `model_provider` (`{"type":"custom","base_url":"https://...","api_key":"..."}`; nếu bỏ qua thì dùng key đang gọi của bạn). `stream: true` với `input` không rỗng trả về `201` dưới dạng luồng Server-Sent Events của turn đầu tiên, bắt đầu bằng `agent.session.created`. Session luôn chạy trên cloud do SandBase vận hành, nên không có môi trường nào để chọn; OpenAI SDK vẫn yêu cầu `environment={"type": "openai_hosted"}`. Trả về `201` với `status` (`idle`, `in_progress`, `failed`), `lifecycle_status` (`active`, `archived`), `failure`, `source` (`direct`, `service`, `schedule`) và `row_version`.

### GET /v1/agents/sessions/{session_id}/events — Stream sự kiện (SSE) {#get-v1-agents-sessions-session-id-events-—-stream-events-sse}

Chỉ phát trực tiếp. Hãy mở trước khi gửi input. `Last-Event-ID` hoặc `after` trả về 400; sự kiện không được phát lại. Giá trị `type` của sự kiện bắt đầu bằng `agent.session.`.

### POST /v1/agents/sessions/{session_id}/events — Gửi input {#post-v1-agents-sessions-session-id-events-—-send-input}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_.../events \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "Summarize the findings."}]}'
```

Đúng một sự kiện mỗi request: `agent.session.input.message` hoặc `agent.session.input.cancel`. Trả về `202` không có body. Dạng mở rộng: `{"input": "...", "file_ids": ["fil_..."]}` (tối đa 10 tệp đính kèm ở trạng thái ready). `409 session_input_pending` nghĩa là input trước đó vẫn đang được chuyển; hãy chờ và không gửi lại với key mới.

### Lịch sử và các thao tác Session khác {#history-and-other-session-operations}

- `GET /v1/agents/sessions` (query `lifecycle_status`, `agent_id`), `GET /v1/agents/sessions/{session_id}`.

- `GET /v1/agents/sessions/{session_id}/items`, `GET /v1/agents/sessions/{session_id}/turns`, `GET /v1/agents/sessions/{session_id}/turns/{turn_id}` đọc lịch sử.

- `POST /v1/agents/sessions/{session_id}` thay thế `metadata`; `PATCH /v1/agents/sessions/{session_id}` đổi tên với `{"title","row_version"}`.

- `POST /v1/agents/sessions/{session_id}/cancel` (yêu cầu `Idempotency-Key`) hủy turn đang chạy.

- `DELETE /v1/agents/sessions/{session_id}` lưu trữ Session; `POST /v1/agents/sessions/{session_id}/unarchive` khôi phục.

- `POST /v1/agents/sessions/{session_id}/files` tải lên một tệp đính kèm (multipart `file`, 5 MiB, bắt buộc `Idempotency-Key`).

- `POST /v1/agents/sessions/{session_id}/reconnect` trả về `stream_url` cho `GET /v1/agents/sessions/{session_id}/events/stream`, endpoint này gửi `session.snapshot` rồi đến các sự kiện trực tiếp.

---

### File trong workspace và artifact output {#workspace-files-and-output-artifacts}

- `GET /v1/agents/sessions/{session_id}/workspace-files` liệt kê metadata hiện tại của các file dưới `path` (mặc định `/workspace`). Query `limit` (1-100, mặc định 20), `order` (mặc định `asc` hoặc `desc`) và `page` (cursor `next` trước đó). Trả về `{object:"page", data:[{path,size_bytes}], next, has_more}`. Cursor không hợp lệ thì phải bắt đầu lại từ trang đầu.
- `GET /v1/agents/sessions/{session_id}/artifacts` liệt kê các output bất biến được ghi nhận dưới `/workspace/outputs/`. Query `limit` (mặc định 20), `order` (mặc định `desc`) và `after` (dùng `last_id` khi `has_more` là true).
- `GET /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` tải xuống toàn bộ artifact bằng ID `art_` không trong suốt được trả về. Giới hạn tải xuống là 200 MiB; `Range` không được hỗ trợ (`416`). Metadata của workspace, tệp đính kèm đã tải lên và artifact đã ghi nhận là các tài nguyên riêng biệt.

---

## Skills, kết nối MCP và Secret {#skills-mcp-connections-and-secrets}

### POST /v1/skills — Tạo Skill {#post-v1-skills-—-create-skill}

```bash
curl -X POST https://api.sandbase.ai/v1/skills \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -F "files=@release-notes.zip;type=application/zip"
```

Một phần ZIP `files` (5 MiB). File ZIP phải chứa một thư mục cấp cao nhất có `SKILL.md` (frontmatter có `name` và `description`) bên trong, ví dụ `zip -r release-notes.zip release-notes/`; `SKILL.md` nằm ở gốc file ZIP sẽ trả về `400 invalid_request`. Skill được tham chiếu bởi bất kỳ phiên bản Agent nào (kể cả Agent đã lưu trữ) không thể bị xóa (`409`); thay vào đó, hãy vô hiệu hóa nó bằng `POST /v1/skills/{skill_id}` với `{"status": "disabled"}`. Trả về `201` với `id` (`skl_`) và `default_version`. Thêm phiên bản bằng `POST /v1/skills/{skill_id}/versions`; liệt kê bằng `GET /v1/skills`. Tham chiếu từ Agent dưới dạng `{"skill_id": "skl_...", "version": null}`.

### POST /v1/mcp-connections — Đăng ký máy chủ MCP {#post-v1-mcp-connections-—-register-an-mcp-server}

Body `{"name", "server_url" (HTTPS), "secret_id"?}`; bắt buộc `Idempotency-Key`. Tham chiếu từ `mcp_connections` của Agent. Vô hiệu hóa kết nối sẽ chặn Session mới và các input tiếp theo.

### POST /v1/secrets — Lưu MCP Bearer token {#post-v1-secrets-—-store-an-mcp-bearer-token}

Body `{"name", "kind": "mcp_bearer", "server_url", "token"}`; bắt buộc `Idempotency-Key`. Token là dữ liệu chỉ ghi và được gắn với đúng URL đó. Secret không phải biến môi trường. Xoay vòng bằng `POST /v1/secrets/{secret_id}/rotate`; thu hồi bằng `DELETE /v1/secrets/{secret_id}` (204).

---

## Thanh toán và chi phí {#billing-cost}

### Cách tính chi phí {#how-costs-are-calculated}

- Đọc công thức giá và đơn vị hiện tại của model được chọn từ `model_card` của nó.
- Model tính giá theo token có thể bao gồm các thành phần input, output, cache hoặc suy luận khi được khai báo.
- Model media và các model khác có thể dùng đơn vị theo request, thời lượng, độ phân giải hoặc đơn vị riêng của model.
- Data API (tìm kiếm, mạng xã hội, scraping, thương mại điện tử, tài chính) có 100 lượt gọi miễn phí cho mỗi tổ chức mỗi ngày UTC, dùng chung cho các data API đủ điều kiện và đặt lại lúc 00:00 UTC. Các lượt gọi sau đó được tính phí theo lượt; chúng không bị từ chối. Tổ chức có số dư bằng 0 vẫn có thể dùng các lượt gọi miễn phí.
- Không đủ điều kiện: LLM, model media và các data API giá cao hoặc tính giá theo công thức (ví dụ một số endpoint batch, crawl, Xiaohongshu PGY và các route `kol-*` của Douyin Xingtu), những loại này bị tính phí từ lượt gọi đầu tiên. Hãy kiểm tra `pricing.free_quota` trên `sandbase_inspect`.
- MCP: `sandbase_inspect` hiển thị `pricing.free_quota` trên các công cụ đủ điều kiện; `sandbase_account` trả về `free_api_quota` (`daily_limit`, `used_today`, `remaining`, `resets_at`); kết quả đã quyết toán của `sandbase_run` và `sandbase_run_get` có `free_quota_status` (`free`, `overage` hoặc `degraded`).
- Khi một thao tác có tính phí trả về task ID (kể cả header response `x-task-id`), hãy dùng `GET /v1/tasks/{task_id}/cost` để xem quyết toán và mức sử dụng.
- Với response bất đồng bộ của `POST /v1/run`, hãy truy vấn kết quả sinh nội dung bằng `GET /v1/run/{id}`; run ID không phải task ID và không được gửi tới endpoint chi phí.

### Kiểm soát ngân sách {#budget-control}

- Đặt giới hạn chi tiêu tùy chọn khi tạo hoặc chỉnh sửa key tiêu chuẩn trong [Developer → API Keys](https://www.sandbase.ai/console/keys).
- Theo dõi request và chi phí trong **Developer → Activities → Usage**.
- Xem số dư và giao dịch credit trong [Developer → Billing](https://www.sandbase.ai/console/billing).

---

## Xem thêm {#see-also}

- [Models và giá](./models): khám phá model trực tiếp, khả năng và hướng dẫn về giá
- [Hướng dẫn lỗi](./errors): cấu trúc response được mô tả, cách xử lý HTTP và thử lại an toàn
- [Đặc tả OpenAPI](https://www.sandbase.ai/docs/openapi.yaml): schema dạng máy đọc được


## Liên kết phiên bản Skill của Agent {#agent-skill-version-bindings}

Khi lưu Agent, mỗi tham chiếu Skill mới được ghim vào một phiên bản cụ thể. Với liên kết mới, `version: null` chọn phiên bản mặc định hiện tại tại thời điểm lưu. Với liên kết đã có, `version: null` giữ nguyên phiên bản đã ghim. Thay đổi phiên bản mặc định của Skill không nâng cấp các Agent đã lưu hoặc Session hiện có; hãy lưu một phiên bản cụ thể trên Agent để nâng cấp các Session sau này.
