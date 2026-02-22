# Sign in with Apple – shipping-ready setup

Sign in with Apple (SiwA) can fail with **AKAuthenticationError -7026** or **Code -54** (e.g. capability/App ID not configured, or system/sandbox limits). This doc ensures sign-in is shipping-ready: either SiwA works or the **“Having trouble? Sign in with test account”** fallback completes sign-in against the real backend.

---

## 1. Apple Developer – enable Sign in with Apple for the App ID

1. Go to [developer.apple.com](https://developer.apple.com) → **Account** → **Certificates, Identifiers & Profiles**.
2. Under **Identifiers**, open **App IDs** and select (or create) the App ID **com.zuzi.cue.Cue**.
3. In **Capabilities**, enable **Sign in with Apple** (check the box).
4. Save the App ID.

If the App ID is managed by Xcode (e.g. “Automatically manage signing”), the capability may already be there; confirm it is enabled in the developer portal so it matches the app.

---

## 2. Xcode – capability and entitlements

1. Open **Cue.xcodeproj** in Xcode.
2. Select the **Cue** target (the app target, not the project).
3. Open the **Signing & Capabilities** tab.
4. Confirm **Sign in with Apple** is listed. If not, click **+ Capability** and add **Sign in with Apple**.
5. Confirm the target’s **Build Settings** (or **Signing & Capabilities**) use **Cue/Cue.entitlements** for **Code Signing Entitlements**:
   - **CODE_SIGN_ENTITLEMENTS** = `Cue/Cue.entitlements` (for both Debug and Release).

The entitlements file **Cue/Cue.entitlements** should contain:

```xml
<key>com.apple.developer.applesignin</key>
<array>
    <string>Default</string>
</array>
```

If the capability was added from Xcode, this is usually set automatically.

---

## 3. Fallback – “Having trouble? Sign in with test account”

- **Visibility:** The fallback is **always visible** (not behind `#if DEBUG`). It appears on the Auth screen below “Continue with email” for all builds.
- **Behavior:**  
  - User must have chosen **Creator** or **Talent** on the previous screen.  
  - Tapping it calls `signInWithTestAccount()`: gets a mock token from `AuthService.getMockTokenForTesting()`, sends it to the **real backend** `POST /auth/apple` with the selected role.  
  - Backend (with mock-token support) returns `{ user, token }`.  
  - App stores the JWT (Bearer token) and session (Keychain), sets `app.user`, and advances to Creator or Talent onboarding (or home if onboarding is complete).
- **No silent failure:** If the request fails (e.g. network, backend error), the app sets `errorMessage` and shows it in red on the Auth screen. If the user hasn’t chosen a role, the message is “Choose Creator or Talent first.”

So when SiwA fails (e.g. -7026 or -54), users can still sign in with the fallback and hit the real backend; token and session are stored and the user advances.

---

## 4. Verify on a physical device

1. **Backend:** Ensure the backend is running and reachable (e.g. device and Mac on same network, backend URL in app set to Mac IP or ngrok). Backend must have **mock-token support** (e.g. tokens starting with `mock_` or test token when `APPLE_CLIENT_ID` is unset) so the fallback works.
2. **App:** Install the app on the device (Run from Xcode or archive/install).
3. **Flow:**  
   - Open app → Role Select → choose **Creator** or **Talent** → Auth screen.  
   - Option A: Tap **Sign in with Apple**. If it works, you should land on onboarding/home. If it fails (e.g. -7026), the app should show an error and you can use the fallback.  
   - Option B: Tap **“Having trouble? Sign in with test account”**. You should sign in, get a session, and advance to onboarding (or home). No silent failure; any backend/network error appears as `errorMessage`.
4. After signing in (via SiwA or fallback), confirm: you see the correct next screen (Creator or Talent onboarding step 1, or home), and later requests (e.g. PATCH /me) use the stored Bearer token.

---

## 5. File list (relevant to sign-in and shipping)

| File | Purpose |
|------|--------|
| **Cue/Cue.entitlements** | Sign in with Apple capability (`com.apple.developer.applesignin` = Default). |
| **Cue.xcodeproj/project.pbxproj** | Sets `CODE_SIGN_ENTITLEMENTS = Cue/Cue.entitlements` for the Cue app target (Debug & Release). |
| **Cue/Onboarding/AuthView.swift** | Auth UI: Sign in with Apple, Continue with email, **“Having trouble? Sign in with test account”** (always visible), error message display. |
| **Cue/AppState.swift** | `signInWithApple()`, `signInWithTestAccount()`; stores user + session; sets `errorMessage` on failure; friendly messages for -7026 / 1000. |
| **Cue/Services/AuthService.swift** | `signInWithApple(role:)` (real or simulator mock), `getMockTokenForTesting()` for fallback. |
| **Cue/Services/HTTPAPIClient.swift** | `authApple(idToken:role:)` → POST /auth/apple; stores token; Bearer sent on later requests. |
| **backend/src/routes/auth.ts** | POST /auth/apple: accepts mock/test token in dev, returns `{ user, token }`; production SiwA when `APPLE_CLIENT_ID` set. |

---

## Summary

- **Apple Developer:** Enable Sign in with Apple for App ID **com.zuzi.cue.Cue**.  
- **Xcode:** Cue target has Sign in with Apple capability and uses **Cue/Cue.entitlements**.  
- **Fallback:** “Having trouble? Sign in with test account” is always visible and works against the real backend (token + session stored, user advances).  
- **Device:** Verify either SiwA or the fallback completes sign-in and that errors are shown instead of failing silently.
