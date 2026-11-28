---
i18nSource: 258f8ff4bb1ed96f
title: 組織
description: 在 SandBase 上管理組織、成員與角色。
---

# 組織 {#organizations}

組織是 SandBase 中計費與存取控制的單位。API 金鑰、餘額、用量與成員都隸屬於某個組織。

## 組織類型 {#organization-types}

| 類型 | 說明 |
|------|-------------|
| **個人** | 首次登入時自動建立。每位使用者一個。 |
| **團隊** | 手動建立。可有多位具備不同角色的成員。 |

## 成員角色 {#member-roles}

| 角色 | 權限 |
|------|-------------|
| **擁有者** | 擁有完整的工作區存取權，包括變更成員角色。 |
| **管理員** | 管理金鑰與帳務，並可新增或移除非擁有者成員。 |
| **成員** | 可使用工作區及其 API 金鑰，但沒有成員管理權限。 |

## 建立團隊組織 {#create-a-team-organization}

1. 開啟 Console 右上角的帳戶選單。
2. 選擇 **Create Team**，或開啟 **Developer → Team** 並選取 **Create team**。
3. 輸入 **Team name**，然後選取 **Create team**。
4. 選取 **Add member**，輸入既有 SandBase 帳戶的 **Account email**，並選擇 **Workspace role**：**Member** 或 **Admin**。

新增的成員必須已擁有 SandBase 帳戶。擁有者可以變更成員角色；擁有者與管理員可以移除
非擁有者成員。

## 切換組織 {#switch-organizations}

如果您隸屬於多個組織，可以在帳戶選單中切換，或使用 **Developer → Team** 頁面上的 **Switch workspace** 列。您的 API 金鑰與帳務範圍僅限於目前使用中的組織。

## 餘額與帳務 {#balance-and-billing}

每個組織都有各自的餘額。模型呼叫、API 呼叫、Agent Session 與執行階段工作都會從此餘額扣款。詳情請參閱[帳務](/admin/billing)。
