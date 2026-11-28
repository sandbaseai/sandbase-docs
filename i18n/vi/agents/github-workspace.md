---
i18nSource: e4dcecbecc736e53
title: Workspace từ kho GitHub
description: Clone kho GitHub vào /workspace của Session, push lên các branch của Session và mở pull request.
---

# Workspace từ kho GitHub {#github-repository-workspace}

Một Session có thể khởi động với kho GitHub đã được clone sẵn vào `/workspace`. Agent làm việc với mã nguồn bằng các lệnh `git` thông thường, push commit lên các branch dành riêng cho Session và có thể mở pull request để người duyệt xem xét.

Kho được truy cập qua git proxy của SandBase. Không có GitHub token nào được đưa vào Session.

## Trước khi bắt đầu {#before-you-start}

Quản trị viên tổ chức thiết lập một lần trong console:

1. Kết nối GitHub trong **Console → Integrations** và chọn các kho mà kết nối được phép dùng.
2. Gán kết nối cho Agent trong mục **Integrations** của Agent. Các công cụ của Agent cho kết nối này phải bao gồm **Read code** để clone. Để push, chúng cũng phải bao gồm **Commit to a task branch**.
3. Tùy chọn: chọn **Workspace repository** và branch cho lần gán đó. Khi đó Session sẽ clone kho này theo mặc định.

`repository_id` là ID số của kho trên GitHub. Bạn có thể lấy nó từ `GET https://api.github.com/repos/{owner}/{repo}` (trường `id`) hoặc từ công cụ `github_list_repositories`.

## Chọn kho cho từng Session {#choose-the-repository-per-session}

Gửi `github_workspace` khi bạn tạo Session:

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: fix-login-2026-11-18" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
    "github_workspace": {"repository_id": "1195090324", "ref": "main"},
    "input": "Fix the failing login test, push your change and open a pull request."
  }'
```

| Trường | Bắt buộc | Ý nghĩa |
|---|---|---|
| `repository_id` | Có | Chuỗi số thập phân. Kho phải nằm trong phạm vi kho của Agent đối với kết nối đó. |
| `ref` | Không | Branch cần checkout. Mặc định là branch mặc định của kho. |
| `connection_id` | Không | Kết nối GitHub cần dùng. Mặc định là lần gán có workspace repository, hoặc kết nối GitHub duy nhất của Agent. |

`github_workspace` là tùy chọn:

- Bỏ qua hoặc `null`: Session clone workspace repository của Agent nếu đã được thiết lập. Nếu không, không có gì được clone và Session khởi động như bình thường.
- Có gửi: giá trị này thay thế mặc định của Agent, chỉ cho Session này.

Mỗi Session có tối đa một workspace repository. Lựa chọn này được cố định khi Session được tạo.

## Session nhận được gì {#what-the-session-gets}

- Bản checkout của `ref` trong `/workspace`, với `origin` trỏ đến git proxy. `git fetch`, `git pull` và `git push` hoạt động như bình thường.
- Commit có tác giả là `sandbase-agents[bot]`.
- `SANDBASE_GIT_BRANCH_PREFIX`, ví dụ `agents/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/`.
- `SANDBASE_WORKSPACE_REPOSITORY`, giá trị `owner/name` của kho.

## Quy tắc push {#push-rules}

Agent chỉ có thể push lên các branch nằm dưới tiền tố của chính nó:

```bash
git push origin HEAD:${SANDBASE_GIT_BRANCH_PREFIX}fix-login
```

- Agent có thể push lại lên cùng một branch, kể cả branch đã có pull request đang mở.
- Các lần push lên branch mặc định, branch khác, tiền tố của Session khác và tag đều bị từ chối trước khi đến GitHub. Git hiển thị `sandbase: only agents/<session>/* branches can be pushed`.
- Proxy không thể thay đổi các file workflow của GitHub Actions.

Chỉ branch do Session đã push mới được coi là branch của Session. Công cụ `github_open_pull_request` chấp nhận branch đó, và kết nối có phạm vi merge giới hạn ở các branch được quản lý cũng vậy.

## Quyền hạn theo kết nối {#permissions-follow-the-connection}

Mọi request git đều được kiểm tra dựa trên lần gán hiện tại của Agent và chính sách hiện tại của kết nối.

- Nếu quản trị viên thu hẹp phạm vi kho, lần fetch hoặc push tiếp theo sẽ bị từ chối.
- Nếu quản trị viên gỡ **Commit to a task branch**, lần push tiếp theo sẽ bị từ chối.
- Nếu quản trị viên thu hồi kết nối, lần fetch hoặc push tiếp theo sẽ bị từ chối.

Mỗi Session có thể thực hiện tối đa 120 request git mỗi phút.

## Lỗi {#errors}

| Response | Nguyên nhân |
|---|---|
| `400 invalid_request` (`param: github_workspace`) | `repository_id` không phải chuỗi số thập phân, `ref` không phải tên branch đơn thuần, Agent không có kết nối GitHub, hoặc tên branch mặc định của kho không được hỗ trợ (hãy đặt `ref` tường minh). |
| `400 invalid_request` | Agent có nhiều kết nối GitHub và không kết nối nào có workspace repository. Hãy gửi `connection_id`. |
| `403 insufficient_scope` | Kho hoặc kết nối nằm ngoài phạm vi của Agent, hoặc các công cụ của Agent không bao gồm **Read code**. |

## Bước tiếp theo {#next-steps}

- [Chạy Session](/agents/sessions)
- [Tài liệu tham chiếu API Create Session](/api-reference/sessions/create)
