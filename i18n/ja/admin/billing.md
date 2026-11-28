---
i18nSource: d560e2374d91a8d6
title: 請求とクレジット
description: SandBase の組織残高の確認、Stripe または Airwallex でのクレジット購入、自動チャージの設定、クーポンの利用、API キーの利用額管理について説明します。
---

# 請求とクレジット {#billing-and-credits}

このページでは、[SandBase Console](https://www.sandbase.ai/console) での請求管理について説明します。料金とコストの最適化については [料金](/guides/billing) を参照してください。

SandBase は、対応するワークロードの料金を組織の残高から請求します。現在の価格、キャンペーン、決済プロバイダー、
最低チャージ金額、利用可能な地域は Console に表示され、このガイドとは別に変更される場合が
あります。

## 残高 {#balance}

[Developer → Billing](https://www.sandbase.ai/console/billing) を開きます。**Credits** ページには、アクティブな組織の次の情報が表示されます。

| 項目 | 意味 |
|------|---------------|
| **Available balance** | Models と API 全体ですぐに使える残高 |
| **Credit limit** | ワークスペースの利用許容額 |
| **Current level** | アカウントのティアとその同時実行数 |

サインインしている場合、同じ残高が Console Dashboard の **Balance** カードとサイトのヘッダーにも表示されます。
キャンペーンと決済条件については Console の表示を正としてください。Console 内部のネットワークリクエストを自動化しないで
ください。

## クレジットを購入する {#buy-credits}

1. [Billing](https://www.sandbase.ai/console/billing) を開き、**Credits go to** にチャージ先のワークスペースが表示されていることを確認します。
2. **Buy credits** で、プリセット金額を選ぶか、**Custom amount** に USD で金額を入力します。最低チャージ金額はページに表示されます。
3. 複数の **Payment provider** が表示される場合は、**Stripe**（世界各国のカードとウォレット）または **Airwallex**（カードと各地域の決済手段）を選びます。
4. プレビューで **Pay**、**Bonus**、**Receive** を確認し、**Continue with Stripe**（または選択したプロバイダー）を選択して、ホスト型の決済ページで支払いを完了します。
5. コストに注意が必要なワークロードを開始する前に、**Credit transactions** で更新後の残高を確認します。

SandBase はカード情報を保存しません。決済ページはプロバイダーがホストします。

### 初回チャージボーナス {#first-top-up-bonus}

アカウントとワークスペースのどちらもチャージしたことがない場合、**Current offers** に初回チャージボーナスが表示されます。ページには
ボーナスの割合と上限が記載されています。ボーナスはアカウントごと・ワークスペースごとに 1 回適用され、返金時にはボーナスが
比例して回収されます。ボーナスは **Credit transactions** に独立した行として表示されます。

## 自動チャージ {#auto-top-up}

**Auto Top-up** は、残高がしきい値を下回ったときに保存済みのカードで残高を補充します。現在は Stripe のみに
対応しており、管理できるのはワークスペースのオーナーと管理者だけです。

1. **Payment cards** で **Add Card** を選択し、Stripe にカードを保存します。
2. **Turn on auto top-up** を選択し、**When balance goes below**、**Top-up amount**、任意の **Monthly limit**、カードを設定します。
3. **I authorize these automatic charges** にチェックを入れて確定します。

月間上限に達すると、その暦月（UTC）の残りの期間は自動チャージが停止します。自動チャージは
**Credit transactions** にチャネル `Auto top-up · Stripe` として表示されます。

## クーポンを利用する {#redeem-a-coupon}

**Redeem a coupon** の **Coupon code** にコードを入力し、**Redeem credit** を選択します。クーポンはアクティブな
ワークスペースにのみ適用されるため、先に選択中の組織を確認してください。

## 利用額の管理 {#spending-controls}

| 管理項目 | 範囲 | 動作 |
|---------|-------|----------|
| 組織の資金上限 | 組織全体 | 利用可能残高と、設定済みのクレジット上限の合計。資金が不足しているリクエストは HTTP 402 を返すことがあります |
| キーの利用上限 | API キーごと | キーごとの任意の上限。組織の残高を超えることはありません |
| 自動チャージの月間上限 | 組織全体 | 暦月（UTC）ごとの自動チャージ額の上限 |

キーごとの利用上限を設定するには、[API キー](/getting-started/api-keys) を参照してください。

## Activities と Analysis {#activities-and-analysis}

[Developer → Activities](https://www.sandbase.ai/console/activities) には 2 つのタブがあります。

- **Request History** には、API キー、モデル、ステータス、レイテンシ、コストとともに個々のリクエストが一覧表示されます。
- **Usage** には、7 日間または 30 日間のリクエスト数とコスト、**Model APIs by Archived Spend**、**Billing Records** が表示されます。どちらの表にも **Export CSV** があります。請求記録のエクスポートには、1 日の無料枠でカバーされた呼び出しを示す **Free Quota** 列が含まれます。

[Developer → Analysis](https://www.sandbase.ai/console/analytics) では、直近 7 日間または 30 日間（UTC で完了した日）の **Overview**、**Cost analysis**、
**Health diagnostics** を確認できます。

公開料金とタスクコストの仕様については、[料金と使用量](/guides/billing) と
[タスクコストの取得](/api-reference/tasks/cost) を参照してください。
