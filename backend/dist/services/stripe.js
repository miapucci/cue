/**
 * Stripe: PaymentIntent for creator pay-in, escrow (hold until approval), release to talent (Connect).
 * See BACKEND_STRIPE_FLOWS.md for when each step happens.
 */
import Stripe from 'stripe';
import { getPool } from '../db/index.js';
export function getStripe() {
    const key = process.env['STRIPE_SECRET_KEY'];
    if (!key)
        throw new Error('STRIPE_SECRET_KEY is required for payments');
    return new Stripe(key);
}
/**
 * Create a PaymentIntent for a brief (creator pay-in). Called when:
 * - Creator requests to view submissions for a brief that isn't first-free and hasn't been paid yet.
 * Returns clientSecret for iOS to confirm with Stripe SDK. Use test key in dev, live key in prod (env only).
 */
export async function createPaymentIntent(params) {
    const stripe = getStripe();
    const pi = await stripe.paymentIntents.create({
        amount: params.amountCents,
        currency: params.currency.toLowerCase(),
        automatic_payment_methods: { enabled: true },
        metadata: { briefId: params.briefId },
        customer: params.creatorStripeCustomerId ?? undefined,
    });
    await getPool().query('UPDATE briefs SET payment_intent_id = $1, payment_status = $2 WHERE id = $3', [pi.id, 'pending', params.briefId]);
    return { clientSecret: pi.client_secret, paymentIntentId: pi.id };
}
/**
 * After client confirms payment, Stripe sends webhook. We capture automatically (default).
 * Alternatively, frontend can call an endpoint to "confirm" we've received payment (e.g. after client_secret confirm).
 * For simplicity: when creator calls GET /briefs/:id/submissions we check payment_status; if pending we return 402 + clientSecret to pay; after they pay, webhook sets payment_status to captured, or we poll/list PaymentIntents.
 * Here we just create the PI; capture happens on successful payment. We'll set payment_status = 'captured' via webhook or a one-off "sync" when canViewSubmissions is checked.
 */
export async function getPaymentIntentStatus(paymentIntentId) {
    const stripe = getStripe();
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (pi.status === 'succeeded')
        return 'captured';
    if (pi.status === 'requires_capture')
        return 'captured'; // authorized, will capture
    if (pi.status === 'canceled' || pi.status === 'requires_payment_method')
        return 'failed';
    return 'pending';
}
/**
 * Release payment to talent on submission approval. If talent has Stripe Connect account, create transfer;
 * otherwise we only update our ledger (released balance) and document that payout is deferred.
 */
export async function releasePaymentToTalent(params) {
    const r = await getPool().query('SELECT payment_intent_id, payment_status FROM briefs WHERE id = $1', [params.briefId]);
    const brief = r.rows[0];
    if (!brief || brief.payment_status !== 'captured')
        return;
    await getPool().query('UPDATE briefs SET payment_status = $1 WHERE id = $2', ['released', params.briefId]);
    if (params.talentStripeConnectAccountId) {
        const stripe = getStripe();
        await stripe.transfers.create({
            amount: params.amountCents,
            currency: params.currency.toLowerCase(),
            destination: params.talentStripeConnectAccountId,
            transfer_group: params.transferGroup,
            metadata: { briefId: params.briefId, submissionId: params.submissionId },
        });
    }
    // Else: talent balance is updated in our DB only; actual payout later (Connect onboarding).
}
