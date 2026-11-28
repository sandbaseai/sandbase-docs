---
i18nSource: 258f8ff4bb1ed96f
title: Tổ chức
description: Quản lý tổ chức, thành viên và vai trò trên SandBase.
---

# Tổ chức {#organizations}

Tổ chức là đơn vị thanh toán và kiểm soát truy cập trong SandBase. API key, số dư, mức sử dụng và thành viên đều thuộc về một tổ chức.

## Loại tổ chức {#organization-types}

| Loại | Mô tả |
|------|-------------|
| **Personal** | Được tạo tự động khi đăng nhập lần đầu. Mỗi người dùng có một tổ chức. |
| **Team** | Được tạo thủ công. Có nhiều thành viên với các vai trò khác nhau. |

## Vai trò thành viên {#member-roles}

| Vai trò | Quyền |
|------|-------------|
| **Owner** | Toàn quyền truy cập workspace, bao gồm cả việc thay đổi vai trò thành viên. |
| **Admin** | Quản lý key và thanh toán, thêm hoặc xóa các thành viên không phải owner. |
| **Member** | Sử dụng workspace và API key của workspace, không có quyền quản lý thành viên. |

## Tạo tổ chức Team {#create-a-team-organization}

1. Mở menu tài khoản ở góc trên bên phải của Console.
2. Chọn **Create Team**, hoặc mở **Developer → Team** rồi chọn **Create team**.
3. Nhập **Team name**, sau đó chọn **Create team**.
4. Chọn **Add member**, nhập **Account email** của một tài khoản SandBase hiện có và chọn **Workspace role**: **Member** hoặc **Admin**.

Thành viên được thêm phải có sẵn tài khoản SandBase. Owner có thể thay đổi vai trò thành viên; owner và admin có thể xóa
các thành viên không phải owner.

## Chuyển đổi tổ chức {#switch-organizations}

Nếu bạn thuộc nhiều tổ chức, hãy chuyển đổi giữa chúng trong menu tài khoản hoặc dùng thanh **Switch workspace** trên trang **Developer → Team**. API key và thanh toán của bạn được giới hạn trong tổ chức đang hoạt động.

## Số dư và thanh toán {#balance-and-billing}

Mỗi tổ chức có số dư riêng. Các lệnh gọi model, lệnh gọi API, Agent Session và tác vụ runtime đều được trừ vào số dư này. Xem [Thanh toán](/admin/billing) để biết chi tiết.
