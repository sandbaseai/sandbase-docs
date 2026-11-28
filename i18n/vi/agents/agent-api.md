---
i18nSource: 2ba7f0f41847d04f
title: Định nghĩa một Agent
description: Tạo và cập nhật Agent có phiên bản bằng Agents API, bao gồm các trường, giới hạn, phiên bản và lưu trữ.
---

# Định nghĩa một Agent {#define-an-agent}

Tạo một Agent bằng `POST /v1/agents`. API tuân theo giao thức OpenAI Agents, nên bạn có thể dùng HTTP thuần hoặc `client.beta.agents` của OpenAI SDK với `base_url="https://api.sandbase.ai/v1"`. Header `OpenAI-Beta` là tùy chọn; nếu gửi, giá trị phải là `agents=v1`. Xem [Tương thích OpenAI](/agents/openai-compatibility) để biết SDK hỗ trợ những gì.

## Tạo một Agent {#create-an-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: create-research-agent-1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research assistant",
    "model": "deepseek/deepseek-v4-flash",
    "instructions": "Research the question, compare at least two sources, and cite them.",
    "metadata": {"team": "research"}
  }'
```

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
agent = client.beta.agents.create(
    model="deepseek/deepseek-v4-flash",
    name="Research assistant",
    instructions="Research the question, compare at least two sources, and cite them.",
    metadata={"team": "research"},
)
print(agent.id, agent.version)  # agt_..., 1
```

Phản hồi là `201 Created` kèm Agent: một ID `agt_`, `version: 1`, `row_version`, `status: "active"` và `projection_status`. Phiên bản mới được chuẩn bị để thực thi ở chế độ nền; hãy bắt đầu Session khi `projection_status` là `ready`.

`Idempotency-Key` là tùy chọn. Khi bạn bỏ qua, dịch vụ sẽ tự tạo một khóa, nên một yêu cầu gửi lại có thể tạo ra Agent thứ hai. Hãy gửi khóa ổn định của riêng bạn khi thử lại.

## Các trường {#fields}

Body là JSON nghiêm ngặt (tối đa 1 MiB). Trường không xác định trả về 400.

| Trường | Bắt buộc | Giới hạn và giá trị |
|---|---|---|
| `model` | Có | Model ID, tối đa 200 ký tự |
| `name` | Không | Tối đa 128 ký tự |
| `instructions` | Không | Tối đa 256 KiB |
| `description` | Không | Tối đa 4096 ký tự |
| `runtime_profile` | Không | `codex` (mặc định), `claude` hoặc `mcode` |
| `skills` | Không | Tối đa 32 tham chiếu. Một liên kết mới với `version: null` sẽ ghim phiên bản mặc định hiện tại khi lưu; các liên kết hiện có giữ nguyên phiên bản đã ghim. Cung cấp phiên bản cụ thể để nâng cấp; xem [Skills](/agents/mcp-tools#skills) |
| `mcp_connections` | Không | Tối đa 32 tham chiếu; xem [Kết nối MCP](/agents/mcp-tools#mcp-connections) |
| `tools` | Không | Tối đa 64 công cụ `function` và nhiều nhất một công cụ `web_search` |
| `text` | Không | `format.type` là `text` hoặc `json_schema` (schema dạng object); `verbosity` là `low`, `medium` hoặc `high` |
| `reasoning` | Không | `effort` là `none`, `minimal`, `low`, `medium`, `high`, `xhigh` hoặc `max`; `summary` là `concise`, `detailed` hoặc `auto` |
| `service_tier` | Không | `auto` (mặc định), `default`, `flex`, `priority` hoặc `fast` |
| `metadata` | Không | Tối đa 16 cặp chuỗi; khóa tối đa 64 và giá trị tối đa 512 ký tự |
| `note` | Không | Ghi chú thay đổi được lưu cùng phiên bản |

## Giới hạn hiện tại {#current-limits}

- `web_search` phải dùng `"mode": "disabled"` thì Session mới bắt đầu được.
- Có thể lưu công cụ `function`, nhưng các Run cần client trả về kết quả công cụ (`requires_action`) chưa được hỗ trợ. Session ở trạng thái đó trả về `502 executor_contract_error`. Thay vào đó, hãy cung cấp khả năng bên ngoài cho Agent qua [kết nối MCP](/agents/mcp-tools#mcp-connections).
- `multi_agent` phải được bỏ qua hoặc là `null`.

## Cập nhật một Agent {#update-an-agent}

Có hai dạng cập nhật. Cả hai đều tạo ra một phiên bản mới.

- `POST /v1/agents/{agent_id}` là kiểu cập nhật của OpenAI SDK. Chỉ gửi các trường bạn muốn thay đổi. Không cần `row_version`, nên lần ghi sau cùng sẽ thắng. Dạng này không chấp nhận `description` và `note`.
- `PATCH /v1/agents/{agent_id}` là kiểu cập nhật compare-and-set. Nó yêu cầu `row_version` bạn đọc gần nhất và trả về 409 nếu Agent đã thay đổi trong lúc đó. Giá trị `null` tường minh bị từ chối.

```bash
curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 2, "instructions": "Answer in five bullet points with cited sources.", "note": "Shorter answers"}'
```

## Phiên bản, lưu trữ và khôi phục {#versions-archive-and-restore}

- `GET /v1/agents/{agent_id}/versions` liệt kê các snapshot bất biến; `GET /v1/agents/{agent_id}/versions/{version}` đọc một snapshot.
- `POST /v1/agents/{agent_id}/restore` với `{"source_version": 1, "row_version": 3}` sao chép một cấu hình trước đó thành phiên bản hiện tại mới.
- `POST /v1/agents/{agent_id}/archive` và `/unarchive` nhận `{"row_version": …}`. Agent đã lưu trữ không thể bắt đầu Session mới.
- `DELETE /v1/agents/{agent_id}` lưu trữ Agent. Agent không bao giờ bị xóa vĩnh viễn.

## Bước tiếp theo {#next-steps}

- [Skills và công cụ MCP](/agents/mcp-tools)
- [Chạy Agent trong một Session](/agents/sessions)
- [Tài liệu tham khảo Agents API](/api-reference/agents/)
