---
i18nSource: e904f2b8bbd0ccc4
title: Sessions
description: Chạy Agent trong Session, stream sự kiện, đọc lịch sử, đính kèm file và xử lý lỗi.
---

# Sessions {#sessions}

Một **Session** chạy một phiên bản Agent đã lưu trên cloud được lưu trữ của SandBase; bạn không cần chọn môi trường thực thi. ID của Session bắt đầu bằng `ses_`, và mọi path của Session đều nằm dưới `/v1/agents/sessions`. Session cố định phiên bản Agent, phiên bản Skill và cấu hình MCP connection tại thời điểm nó bắt đầu.

## Cách Session bắt đầu {#how-sessions-start}

Tạo Session bằng `POST /v1/agents/sessions`. Session báo `source: "direct"`.

## Chạy Session {#run-a-session}

Luồng sự kiện gốc **chỉ phát trực tiếp**: sự kiện không được phát lại sau khi mất kết nối. Hãy mở luồng trước khi gửi input, và đọc lịch sử từ item hoặc turn.

```bash
# 1. Create the Session
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-2026-10-06" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60"}'

# 2. In another terminal, follow live events (server-sent events)
curl -N https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY"

# 3. Send input (202 Accepted, no body)
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "List three notable launches this week."}]}'

# 4. Read the history afterwards
curl "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Cùng quy trình đó với OpenAI Python SDK chính thức. Mở luồng trước, gửi input từ một thread khác và dừng ở sự kiện turn kết thúc. Xem [Tương thích OpenAI](/agents/openai-compatibility) để biết phiên bản Node.js và các khác biệt của SDK.

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
import threading
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
session = client.beta.agents.sessions.create(
    agent_id="agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
    environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
)

def send_input():
    client.beta.agents.sessions.events.create(
        session.id,
        events=[{
            "type": "agent.session.input.message",
            "input": [{"role": "user", "content": [{"type": "input_text", "text": "List three notable launches this week."}]}],
        }],
        idempotency_key="market-scan-input-1",
    )

with client.beta.agents.sessions.events.stream(session.id) as stream:
    threading.Thread(target=send_input).start()
    for event in stream:
        print(event.type)
        if event.type in ("agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"):
            break
```

Mỗi lần gửi mang đúng một sự kiện. `input` là một chuỗi văn bản, hoặc một mảng có đúng một message của người dùng chứa đúng một phần `input_text`: `[{"role": "user", "content": [{"type": "input_text", "text": "…"}]}]`. Mọi dạng khác đều trả về `400 invalid_request`. Để dừng turn đang chạy, hãy gửi `{"type": "agent.session.input.cancel"}` hoặc gọi `POST /v1/agents/sessions/{session_id}/cancel` kèm `Idempotency-Key`. Hủy một Session đang rảnh vẫn trả về `202 {"accepted": true}` và không thay đổi gì. Bạn cũng có thể truyền `input` đầu tiên khi tạo Session. `stream: true` khi tạo không được hỗ trợ.

## Trạng thái và lỗi {#status-and-failures}

| Trường | Giá trị | Ý nghĩa |
|---|---|---|
| `status` | `idle`, `in_progress`, `failed` | Trạng thái thực thi của Session |
| `lifecycle_status` | `active`, `archived` | Session có nhận input hay không |
| `failure` | `null` hoặc `{code, message, action, retryable?}` | Lý do lỗi công khai và bước tiếp theo được đề xuất |

`failure.action` cho bạn biết cần làm gì: `retry_later`, `inspect_history`, `create_new_session`, `check_model_account` hoặc `create_session_with_updated_model_provider`. Xem [bảng mã lỗi](/api-reference/sessions/#status-fields).

Function tool yêu cầu client trả kết quả (`requires_action`) hiện chưa được hỗ trợ; đọc một Session như vậy sẽ trả về `502 executor_contract_error`.

Nếu một lần gửi trả về `409 session_input_pending`, input trước đó vẫn đang được chuyển đi. Hãy chờ và đọc Session; đừng gửi lại với `Idempotency-Key` mới, nếu không input có thể chạy hai lần.

## Lưu trữ {#archive}

`DELETE /v1/agents/sessions/{session_id}` lưu trữ một Session; Session không bị xóa vĩnh viễn. `POST /v1/agents/sessions/{session_id}/archive` và `/unarchive` nhận `{"row_version": …}`. Session đã lưu trữ giữ nguyên lịch sử nhưng từ chối input, cập nhật metadata và luồng.

## Tệp đính kèm {#attachments}

Tải file lên workspace của Session bằng `POST /v1/agents/sessions/{session_id}/files` (trường multipart `file`, tối đa 5 MiB, bắt buộc có `Idempotency-Key`). Các loại được hỗ trợ là `.txt`, `.md`, `.csv`, `.log`, `.json`, `.pdf`, `.png`, `.jpg`, `.jpeg` và `.webp`. Khi `status` của file là `ready`, hãy gửi nó cùng tối đa chín file khác:

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-2" \
  -H "Content-Type: application/json" \
  -d '{"input": "Summarize the attached report.", "file_ids": ["fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72"]}'
```

## Kết nối lại client {#reconnecting-clients}

Client kiểu trình duyệt cần góc nhìn nhất quán sau khi mất kết nối có thể gọi `POST /v1/agents/sessions/{session_id}/reconnect`. Lệnh này trả về Session và một `stream_url` cho `GET /v1/agents/sessions/{session_id}/events/stream`, luồng này gửi `session.snapshot` trước, sau đó là các sự kiện trực tiếp và `heartbeat`. Nếu luồng đó phát ra `stream.interrupted`, hãy kết nối lại thay vì gửi lại input.

## Repository GitHub {#github-repository}

Gửi `github_workspace` khi tạo để clone một repository GitHub vào `/workspace` và cho phép Agent push lên các branch Session của riêng nó. Xem [Workspace repository GitHub](/agents/github-workspace).

## Thông tin xác thực model {#model-credentials}

Session gọi model bằng API key đã tạo ra nó, trừ khi bạn gửi `model_provider`. Dùng `{"type": "custom", "base_url": "https://…", "api_key": "…"}` để chạy với endpoint HTTPS tương thích OpenAI của riêng bạn. `model_provider` chỉ cho phép ghi.

## ID {#ids}

| Tiền tố | Tài nguyên |
|---|---|
| `agt_` | Agent |
| `ses_` | Session |
| `skl_` | Skill |
| `mcp_` | MCP connection |
| `sec_` | Secret |
| `fil_` | Tệp đính kèm Session |

Hãy coi ID là chuỗi mờ.

## Bước tiếp theo {#next-steps}

- [Tài liệu tham khảo Sessions API](/api-reference/sessions/)
- [Tương thích OpenAI](/agents/openai-compatibility)

## File workspace và artifact được tạo {#workspace-files-and-generated-artifacts}

Ba tài nguyên này phục vụ các mục đích khác nhau:

| Tài nguyên | Dùng cho | Phân trang |
|---|---|---|
| [Tệp đính kèm](/api-reference/sessions/list-files) | File bạn đã tải lên và có thể tham chiếu trong input bằng `file_id` | `limit` / `offset` |
| [File workspace](/api-reference/sessions/list-workspace-files) | Path và kích thước file hiện tại trong một thư mục workspace | `page` / `next` |
| [Artifact](/api-reference/sessions/list-artifacts) | Đầu ra được tạo, không thể thay đổi, có sẵn để tải xuống | `after` / `last_id` |

Liệt kê artifact để lấy ID `art_`, rồi truyền đúng ID đó cho [Download Artifact](/api-reference/sessions/download-artifact). Path workspace hoặc `file_id` của tệp đính kèm không thể thay thế nó. Việc liệt kê workspace chỉ trả về metadata và không phải API tải xuống theo path tùy ý. Artifact có thể được tải xuống dưới dạng file hoàn chỉnh tối đa 200 MiB; không hỗ trợ tải từng phần bằng `Range`.
