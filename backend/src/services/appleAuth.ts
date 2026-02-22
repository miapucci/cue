/**
 * Verify Sign in with Apple identity token and return Apple user subject.
 * Uses apple-signin-auth to decode and verify the JWT with Apple's public keys.
 */

import appleSignin from 'apple-signin-auth';

export interface AppleTokenPayload {
  sub: string; // Apple user ID (use as unique key for account linking)
  email?: string;
  email_verified?: boolean;
}

export async function verifyAppleIdToken(idToken: string): Promise<AppleTokenPayload> {
  try {
    const payload = await appleSignin.verifyIdToken(idToken, {
      audience: process.env['APPLE_CLIENT_ID'] ?? undefined,
      ignoreExpiration: false,
    });
    return {
      sub: payload.sub,
      email: payload.email,
      email_verified:
        payload.email_verified === true || payload.email_verified === 'true'
          ? true
          : payload.email_verified === false || payload.email_verified === 'false'
            ? false
            : undefined,
    };
  } catch (e) {
    throw new Error('Invalid Apple identity token');
  }
}
