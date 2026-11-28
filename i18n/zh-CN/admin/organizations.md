---
i18nSource: 258f8ff4bb1ed96f
title: 组织
description: 在 SandBase 上管理组织、成员和角色。
---

# 组织 {#organizations}

组织是 SandBase 中计费和访问控制的基本单位。API 密钥、余额、用量和成员都归属于某个组织。

## 组织类型 {#organization-types}

| 类型 | 说明 |
|------|-------------|
| **个人** | 首次登录时自动创建，每个用户一个。 |
| **团队** | 手动创建，可包含多个具有不同角色的成员。 |

## 成员角色 {#member-roles}

| 角色 | 权限 |
|------|-------------|
| **Owner** | 拥有工作区的完整访问权限，包括修改成员角色。 |
| **Admin** | 管理密钥和账单，并可添加或移除非 Owner 成员。 |
| **Member** | 可使用工作区及其 API 密钥，但无成员管理权限。 |

## 创建团队组织 {#create-a-team-organization}

1. 打开 Console 右上角的账户菜单。
2. 选择 **Create Team**，或打开 **Developer → Team** 并选择 **Create team**。
3. 输入 **Team name**，然后选择 **Create team**。
4. 选择 **Add member**，输入已有 SandBase 账户的 **Account email**，并选择 **Workspace role**：**Member** 或 **Admin**。

被添加的成员必须已拥有 SandBase 账户。Owner 可以修改成员角色；Owner 和 Admin 可以移除
非 Owner 成员。

## 切换组织 {#switch-organizations}

如果你属于多个组织，可以在账户菜单中切换，或使用 **Developer → Team** 页面上的 **Switch workspace** 栏进行切换。你的 API 密钥和账单都限定在当前活跃的组织范围内。

## 余额与计费 {#balance-and-billing}

每个组织都有独立的余额。模型调用、API 调用、Agent Session 和运行时任务都从该余额中扣费。详见[计费](/admin/billing)。
