---
i18nSource: 258f8ff4bb1ed96f
title: 조직
description: SandBase에서 조직, 멤버, 역할을 관리합니다.
---

# 조직 {#organizations}

조직은 SandBase의 결제 및 접근 제어 단위입니다. API 키, 잔액, 사용량, 멤버는 모두 조직에 속합니다.

## 조직 유형 {#organization-types}

| 유형 | 설명 |
|------|-------------|
| **Personal** | 첫 로그인 시 자동으로 생성됩니다. 사용자당 하나입니다. |
| **Team** | 직접 생성합니다. 역할이 있는 여러 멤버를 둘 수 있습니다. |

## 멤버 역할 {#member-roles}

| 역할 | 권한 |
|------|-------------|
| **Owner** | 멤버 역할 변경을 포함해 워크스페이스에 대한 모든 권한을 가집니다. |
| **Admin** | 키와 결제를 관리하고, Owner가 아닌 멤버를 추가하거나 제거할 수 있습니다. |
| **Member** | 멤버 관리 권한 없이 워크스페이스와 해당 API 키를 사용할 수 있습니다. |

## Team 조직 만들기 {#create-a-team-organization}

1. Console 오른쪽 상단의 계정 메뉴를 엽니다.
2. **Create Team**을 선택하거나, **Developer → Team**을 열고 **Create team**을 선택합니다.
3. **Team name**을 입력한 다음 **Create team**을 선택합니다.
4. **Add member**를 선택하고 기존 SandBase 계정의 **Account email**을 입력한 뒤 **Workspace role**로 **Member** 또는 **Admin**을 선택합니다.

추가할 멤버는 이미 SandBase 계정이 있어야 합니다. Owner는 멤버 역할을 변경할 수 있고, Owner와 Admin은
Owner가 아닌 멤버를 제거할 수 있습니다.

## 조직 전환 {#switch-organizations}

여러 조직에 속해 있다면 계정 메뉴에서 조직을 전환하거나 **Developer → Team**의 **Switch workspace** 영역을 사용하세요. API 키와 결제는 현재 활성화된 조직 범위에 적용됩니다.

## 잔액과 결제 {#balance-and-billing}

조직마다 별도의 잔액이 있습니다. 모델 호출, API 호출, Agent Session, 런타임 작업 비용은 이 잔액에서 차감됩니다. 자세한 내용은 [결제](/admin/billing)를 참고하세요.
