# Example: Authentication

Demonstrates **Web Crypto PBKDF2 + D1 session-based authentication** on Cloudflare Workers.

## What It Demonstrates

- User registration and login using `crypto.subtle` (PBKDF2) — no bcrypt
- Session management stored in D1 with Drizzle ORM
- Route guards via `middleware/auth.ts`
- `useAuth()` composable for reactive auth state (`useState`-backed)
- CSRF-safe fetch interceptor (`plugins/fetch.client.ts`)

## Key Files

| File                         | Purpose                                    |
| ---------------------------- | ------------------------------------------ |
| `server/utils/crypto.ts`     | PBKDF2 password hashing via Web Crypto API |
| `server/utils/session.ts`    | D1-backed session CRUD                     |
| `server/api/auth/*.ts`       | Login, register, logout, me endpoints      |
| `server/database/schema.ts`  | Users + sessions Drizzle schema            |
| `app/composables/useAuth.ts` | Reactive auth state                        |
| `app/middleware/auth.ts`     | Route guard                                |
| `app/pages/login.vue`        | Zod-validated login form                   |
| `app/pages/register.vue`     | Zod-validated registration form            |

## Running Standalone

```bash
pnpm --filter example-auth dev    # http://localhost:3011
```
