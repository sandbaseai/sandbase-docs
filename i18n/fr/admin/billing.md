---
i18nSource: d560e2374d91a8d6
title: Facturation et crédits
description: Consultez le solde de l'organisation SandBase, achetez des crédits avec Stripe ou Airwallex, configurez la recharge automatique, utilisez des coupons et comprenez les contrôles de dépenses des clés API.
---

# Facturation et crédits {#billing-and-credits}

Cette page décrit la gestion de la facturation dans la [SandBase Console](https://www.sandbase.ai/console). Pour les tarifs et l'optimisation des coûts, consultez [Tarifs](/guides/billing).

SandBase facture les charges de travail prises en charge sur le solde de l'organisation. Les prix actuels, les offres, les prestataires de paiement,
les montants minimaux de recharge et la disponibilité régionale sont affichés dans la Console et peuvent évoluer indépendamment de ce
guide.

## Solde {#balance}

Ouvrez [Developer → Billing](https://www.sandbase.ai/console/billing). La page **Credits** affiche, pour l'organisation active :

| Élément | Signification |
|------|---------------|
| **Available balance** | Disponible pour les Models et les API |
| **Credit limit** | Plafond de dépenses de l'espace de travail |
| **Current level** | Le niveau du compte et sa concurrence |

Le même solde apparaît sur la carte **Balance** du tableau de bord de la Console et dans l'en-tête du site lorsque vous êtes connecté.
Considérez la Console comme la source de référence pour les promotions et les conditions de paiement ; n'automatisez pas ses requêtes réseau
internes.

## Acheter des crédits {#buy-credits}

1. Ouvrez [Billing](https://www.sandbase.ai/console/billing) et vérifiez que **Credits go to** indique l'espace de travail que vous souhaitez approvisionner.
2. Sous **Buy credits**, choisissez un montant prédéfini ou saisissez un **Custom amount** en USD. La recharge minimale est indiquée sur la page.
3. Si plusieurs **Payment provider** sont proposés, choisissez **Stripe** (cartes et portefeuilles internationaux) ou **Airwallex** (cartes et moyens de paiement locaux).
4. Vérifiez **Pay**, **Bonus** et **Receive** dans l'aperçu, puis sélectionnez **Continue with Stripe** (ou le prestataire choisi) et terminez le paiement sur la page hébergée.
5. Vérifiez le solde mis à jour sous **Credit transactions** avant de lancer une charge de travail sensible aux coûts.

SandBase ne stocke jamais les données de carte ; la page de paiement est hébergée par le prestataire.

### Bonus de première recharge {#first-top-up-bonus}

Si le compte et l'espace de travail n'ont jamais été rechargés, **Current offers** affiche un bonus de première recharge. La page indique
le pourcentage du bonus et son plafond. Un seul bonus s'applique par compte et par espace de travail, et les remboursements reprennent le bonus
au prorata. Le bonus apparaît sur sa propre ligne dans **Credit transactions**.

## Recharge automatique {#auto-top-up}

**Auto Top-up** recharge le solde avec une carte enregistrée lorsqu'il passe sous un seuil. Seul Stripe est pris en charge
pour l'instant, et seuls les propriétaires et administrateurs de l'espace de travail peuvent la gérer.

1. Sous **Payment cards**, sélectionnez **Add Card** et enregistrez une carte dans Stripe.
2. Sélectionnez **Turn on auto top-up**, puis définissez **When balance goes below**, **Top-up amount**, une **Monthly limit** facultative et la carte.
3. Cochez **I authorize these automatic charges** et confirmez.

Une fois la limite mensuelle atteinte, la recharge automatique s'arrête jusqu'à la fin du mois civil (UTC). Les prélèvements automatiques
apparaissent dans **Credit transactions** avec le canal `Auto top-up · Stripe`.

## Utiliser un coupon {#redeem-a-coupon}

Saisissez le **Coupon code** sous **Redeem a coupon**, puis sélectionnez **Redeem credit**. Un coupon ne s'applique qu'à l'espace de travail
actif ; vérifiez donc d'abord l'organisation sélectionnée.

## Contrôle des dépenses {#spending-controls}

| Contrôle | Portée | Comportement |
|---------|-------|----------|
| Limite de financement de l'organisation | Toute l'organisation | Solde disponible plus toute limite de crédit configurée ; une requête non financée peut renvoyer HTTP 402 |
| Limite de dépenses par clé | Par clé API | Plafond facultatif par clé, borné par le solde de l'organisation |
| Limite mensuelle de recharge automatique | Toute l'organisation | Plafonne les prélèvements automatiques par mois civil (UTC) |

Pour définir une limite de dépenses par clé, consultez [Clés API](/getting-started/api-keys).

## Activités et analyse {#activities-and-analysis}

[Developer → Activities](https://www.sandbase.ai/console/activities) comporte deux onglets :

- **Request History** liste les requêtes individuelles avec la clé API, le modèle, le statut, la latence et le coût.
- **Usage** affiche les requêtes et le coût sur 7 ou 30 jours, **Model APIs by Archived Spend** et **Billing Records**. Les deux tableaux proposent **Export CSV**. L'export des enregistrements de facturation inclut une colonne **Free Quota** qui signale les appels couverts par le quota gratuit quotidien.

[Developer → Analysis](https://www.sandbase.ai/console/analytics) ajoute **Overview**, **Cost analysis** et
**Health diagnostics** pour les 7 ou 30 derniers jours UTC complets.

Pour les tarifs publics et les contrats de coût des tâches, consultez [Tarifs et utilisation](/guides/billing) et
[Obtenir le coût d'une tâche](/api-reference/tasks/cost).
