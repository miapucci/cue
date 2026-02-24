# Security notes (backend)

- **Secrets**: Never commit `.env`. Use Vercel env vars (and Supabase env) for production. Rotate `JWT_SECRET` and `SUPABASE_JWT_SECRET` if ever exposed.
- **Production**: On Vercel, mock Apple auth is disabled; only real Apple or Supabase JWTs are accepted.
- **Auth**: Passwords are hashed with scrypt (per-user salt); comparison uses `timingSafeEqual`. Email/password length limits reduce DoS risk.
- **SQL**: All queries use parameterized statements (`$1`, `$2`, …); no string concatenation of user input.
- **CORS**: Default allows all origins. To restrict, set `CORS_ORIGIN` to a comma-separated list of allowed origins.
