# Cue Backend — Stripe flows

When charges and transfers happen, and how **canViewSubmissions** is determined.

---

## 1. First brief free

- When a **creator posts their first live brief**, the backend sets `isFirstFree: true` and **does not create a PaymentIntent**.
- `payment_status` for that brief is set to `captured` (treated as “already paid”).
- The creator can **view submissions for that brief without paying**.

---

## 2. Creator pay-in (non–first-free briefs)

- When a creator posts a **second or later** brief, the backend does **not** charge at post time. We set `payment_status: pending`.
- **When the creator taps “View submissions”** for such a brief:
  - Backend checks **GET /briefs/:id/can-view-submissions**.
  - If `is_first_free` or already paid → `canViewSubmissions: true`.
  - Otherwise we **create a PaymentIntent** (if none yet), set/update `payment_intent_id` on the brief, and return `canViewSubmissions: false` and **`clientSecret`**.
  - The iOS app shows the **Paywall** and uses the Stripe SDK to confirm payment with `clientSecret`.
  - After the user pays, Stripe confirms the PaymentIntent. On the next call to **can-view-submissions** (or when the app refetches), we detect `succeeded` / `requires_capture` and set `payment_status: captured`, then return `canViewSubmissions: true`.

So: **PaymentIntent is created at “view submissions” (paywall) moment**, not at brief creation. This matches loss-aversion: “You have X submissions waiting. Upgrade to view them.”

---

## 3. Escrow

- Funds from the creator’s payment are held by the **platform** (Stripe account).
- We do **not** transfer to talent until the creator **approves** the submission.

---

## 4. Release to talent (on approve)

- When the creator **approves** a submission (PATCH /submissions/:id with `status: approved`):
  - Backend sets the brief’s `payment_status` to `released` for that brief (one payment per brief; first approved submission gets the pay).
  - If the **talent has a Stripe Connect account** (`stripe_connect_account_id`), we create a **Transfer** to that connected account for the brief’s pay amount.
  - If the talent does **not** have Connect yet, we only update our ledger (earnings: released balance). Actual payout can happen later when they complete Connect onboarding.

---

## 5. canViewSubmissions — summary

| Brief state | canViewSubmissions |
|-------------|--------------------|
| Creator’s first brief (`isFirstFree`) | true |
| Already paid (payment_status captured/released) | true |
| PaymentIntent exists and succeeded (we sync status on check) | true (after we set payment_status) |
| Not paid yet | false + clientSecret for Paywall |

---

## 6. Environment

- **STRIPE_SECRET_KEY** — required for creating PaymentIntents and Transfers.
- Optional: **STRIPE_WEBHOOK_SECRET** if you add a webhook to set `payment_status: captured` as soon as the PaymentIntent succeeds (then you don’t rely only on the next can-view-submissions call).
