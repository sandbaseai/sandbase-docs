---
i18nSource: 258f8ff4bb1ed96f
title: 組織
description: SandBase で組織、メンバー、ロールを管理します。
---

# 組織 {#organizations}

組織は SandBase における課金とアクセス制御の単位です。API キー、残高、使用量、メンバーはすべて組織に属します。

## 組織の種類 {#organization-types}

| 種類 | 説明 |
|------|-------------|
| **Personal** | 初回ログイン時に自動作成されます。ユーザーごとに 1 つです。 |
| **Team** | 手動で作成します。ロールを持つ複数のメンバーで構成されます。 |

## メンバーのロール {#member-roles}

| ロール | 権限 |
|------|-------------|
| **Owner** | メンバーのロール変更を含め、ワークスペースへのフルアクセス権を持ちます。 |
| **Admin** | キーと課金を管理し、Owner 以外のメンバーを追加・削除できます。 |
| **Member** | ワークスペースとその API キーを使用できますが、メンバー管理の権限はありません。 |

## チーム組織を作成する {#create-a-team-organization}

1. Console 右上のアカウントメニューを開きます。
2. **Create Team** を選択するか、**Developer → Team** を開いて **Create team** を選択します。
3. **Team name** を入力し、**Create team** を選択します。
4. **Add member** を選択し、既存の SandBase アカウントの **Account email** を入力して、**Workspace role**（**Member** または **Admin**）を選択します。

追加するメンバーは、SandBase アカウントをすでに持っている必要があります。Owner はメンバーのロールを変更でき、Owner と Admin は
Owner 以外のメンバーを削除できます。

## 組織を切り替える {#switch-organizations}

複数の組織に所属している場合は、アカウントメニュー、または **Developer → Team** の **Switch workspace** ストリップで組織を切り替えます。API キーと課金はアクティブな組織に限定されます。

## 残高と課金 {#balance-and-billing}

組織ごとに個別の残高があります。モデル呼び出し、API 呼び出し、Agent Session、ランタイムの処理はこの残高から差し引かれます。詳しくは [課金](/admin/billing) を参照してください。
