# Showcase Gateway

The **central hub** that routes to all example applications via Cloudflare **Service Bindings**.

## What It Demonstrates

- Zero-latency, zero-cost inter-worker routing via Service Bindings
- Gateway dispatch middleware (`server/middleware/dispatch.ts`) routing by path prefix
- Hub landing page with interactive example directory

## How It Works

Each example app is deployed as an independent Cloudflare Worker with a path prefix (e.g., `/auth/`, `/blog/`). The showcase gateway intercepts incoming requests and dispatches them to the correct worker via Service Bindings — no external HTTP hops.

## Key Files

| File                            | Purpose                                              |
| ------------------------------- | ---------------------------------------------------- |
| `server/middleware/dispatch.ts` | Routes requests by path prefix to bound workers      |
| `app/pages/index.vue`           | Hub landing page with example directory              |
| `wrangler.json`                 | Service Binding declarations for each example worker |

## Running the Full Showcase

```bash
# From the workspace root — starts all 5 apps concurrently
pnpm run dev:showcase
```

## Adding a New Example

1. Create `apps/example-<name>/` with `app.baseURL: '/<name>/'` in `nuxt.config.ts`
2. Add a service binding in `apps/showcase/wrangler.json`
3. Add the prefix to `EXAMPLE_ROUTES` in `server/middleware/dispatch.ts`
4. Add a card to `app/pages/index.vue`
