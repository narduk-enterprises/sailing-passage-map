# Example: Dashboard

Demonstrates a **dashboard layout with sidebar navigation and auth middleware** on Cloudflare Workers.

## What It Demonstrates

- Dashboard layout with persistent sidebar (`layouts/dashboard.vue`)
- Auth middleware protecting dashboard routes
- `useAuth()` composable integration for session management
- `useSiteOrigin()` composable for environment-aware URL construction
- CSRF-safe fetch interceptor

## Key Files

| File                               | Purpose                                 |
| ---------------------------------- | --------------------------------------- |
| `app/layouts/dashboard.vue`        | Sidebar + main content dashboard layout |
| `app/middleware/auth.ts`           | Route guard for authenticated routes    |
| `app/composables/useAuth.ts`       | Reactive auth state                     |
| `app/composables/useSiteOrigin.ts` | Environment-aware origin helper         |
| `app/pages/index.vue`              | Dashboard home page                     |
| `app/plugins/fetch.client.ts`      | CSRF fetch interceptor                  |

## Running Standalone

```bash
pnpm --filter example-dashboard dev    # http://localhost:3014
```
