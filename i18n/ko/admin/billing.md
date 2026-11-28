---
i18nSource: d560e2374d91a8d6
title: 결제와 크레딧
description: SandBase 조직 잔액을 확인하고, Stripe 또는 Airwallex로 크레딧을 구매하고, 자동 충전을 설정하고, 쿠폰을 사용하고, API 키 지출 제어를 이해합니다.
---

# 결제와 크레딧 {#billing-and-credits}

이 페이지에서는 [SandBase Console](https://www.sandbase.ai/console)의 결제 관리를 다룹니다. 요금과 비용 최적화는 [요금](/guides/billing)을 참고하세요.

SandBase는 지원되는 워크로드 비용을 조직 잔액에서 차감합니다. 현재 가격, 프로모션, 결제 수단 제공업체,
최소 충전 금액, 지역별 제공 여부는 Console에 표시되며 이 가이드와 별개로
변경될 수 있습니다.

## 잔액 {#balance}

[Developer → Billing](https://www.sandbase.ai/console/billing)을 엽니다. **Credits** 페이지에는 활성 조직의 다음 정보가 표시됩니다.

| 항목 | 의미 |
|------|---------------|
| **Available balance** | Models와 API 전반에서 바로 사용할 수 있는 금액 |
| **Credit limit** | 워크스페이스 지출 허용 한도 |
| **Current level** | 계정 등급과 해당 동시 실행 수 |

같은 잔액이 Console Dashboard의 **Balance** 카드와, 로그인한 경우 사이트 헤더에도 표시됩니다.
프로모션과 결제 조건은 Console을 기준으로 확인하고, Console 내부 네트워크 요청을 자동화하지
마세요.

## 크레딧 구매 {#buy-credits}

1. [Billing](https://www.sandbase.ai/console/billing)을 열고 **Credits go to**에 충전할 워크스페이스가 표시되는지 확인합니다.
2. **Buy credits**에서 미리 설정된 금액을 선택하거나 **Custom amount**에 USD 금액을 입력합니다. 최소 충전 금액은 페이지에 표시됩니다.
3. **Payment provider**가 둘 이상 제공되면 **Stripe**(글로벌 카드 및 지갑) 또는 **Airwallex**(카드 및 현지 결제 수단)를 선택합니다.
4. 미리보기에서 **Pay**, **Bonus**, **Receive**를 확인한 다음 **Continue with Stripe**(또는 선택한 제공업체)를 선택하고 호스팅 결제를 완료합니다.
5. 비용에 민감한 워크로드를 시작하기 전에 **Credit transactions**에서 갱신된 잔액을 확인합니다.

SandBase는 카드 정보를 저장하지 않으며, 결제 페이지는 제공업체가 호스팅합니다.

### 첫 충전 보너스 {#first-top-up-bonus}

계정과 워크스페이스 모두 충전한 적이 없으면 **Current offers**에 첫 충전 보너스가 표시됩니다. 페이지에는
보너스 비율과 상한이 표시됩니다. 보너스는 계정당, 워크스페이스당 한 번 적용되며, 환불 시 보너스도
비례하여 회수됩니다. 보너스는 **Credit transactions**에 별도 행으로 표시됩니다.

## 자동 충전 {#auto-top-up}

**Auto Top-up**은 잔액이 기준값 아래로 떨어지면 저장된 카드로 잔액을 다시 채웁니다. 현재는 Stripe만
지원하며, 워크스페이스 소유자와 관리자만 관리할 수 있습니다.

1. **Payment cards**에서 **Add Card**를 선택하고 Stripe에 카드를 저장합니다.
2. **Turn on auto top-up**을 선택한 다음 **When balance goes below**, **Top-up amount**, 선택 사항인 **Monthly limit**, 카드를 설정합니다.
3. **I authorize these automatic charges**를 체크하고 확인합니다.

월 한도에 도달하면 해당 달력 월(UTC)의 남은 기간 동안 자동 충전이 중단됩니다. 자동 결제는
**Credit transactions**에 `Auto top-up · Stripe` 채널로 표시됩니다.

## 쿠폰 사용 {#redeem-a-coupon}

**Redeem a coupon**에서 **Coupon code**를 입력한 다음 **Redeem credit**을 선택합니다. 쿠폰은 활성
워크스페이스에만 적용되므로 먼저 선택한 조직을 확인하세요.

## 지출 제어 {#spending-controls}

| 제어 | 범위 | 동작 |
|---------|-------|----------|
| 조직 자금 한도 | 조직 전체 | 사용 가능 잔액과 설정된 신용 한도의 합. 자금이 부족한 요청은 HTTP 402를 반환할 수 있음 |
| 키 지출 한도 | API 키별 | 선택 사항인 키별 상한으로, 조직 잔액을 넘을 수 없음 |
| 자동 충전 월 한도 | 조직 전체 | 달력 월(UTC)당 자동 결제 금액을 제한 |

키별 지출 한도 설정 방법은 [API 키](/getting-started/api-keys)를 참고하세요.

## Activities와 Analysis {#activities-and-analysis}

[Developer → Activities](https://www.sandbase.ai/console/activities)에는 두 개의 탭이 있습니다.

- **Request History**는 개별 요청을 API 키, 모델, 상태, 지연 시간, 비용과 함께 나열합니다.
- **Usage**는 7일 또는 30일 동안의 요청 수와 비용, **Model APIs by Archived Spend**, **Billing Records**를 보여 줍니다. 두 표 모두 **Export CSV**를 지원합니다. 결제 기록 내보내기에는 일일 무료 할당량으로 처리된 호출을 표시하는 **Free Quota** 열이 포함됩니다.

[Developer → Analysis](https://www.sandbase.ai/console/analytics)는 최근 7일 또는 30일(UTC 기준 완료된 날)에 대한 **Overview**, **Cost analysis**,
**Health diagnostics**를 제공합니다.

공개 요금과 작업 비용 계약은 [요금 및 사용량](/guides/billing)과
[작업 비용 조회](/api-reference/tasks/cost)를 참고하세요.
