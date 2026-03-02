# Example: Blog

Demonstrates **Nuxt Content v3 with MDC rendering** and a custom blog layout on Cloudflare Workers.

## What It Demonstrates

- Markdown-based content in `content/` directory
- Blog layout with sidebar navigation (`layouts/blog.vue`)
- Blog index page with `queryCollection` listing
- Dynamic `[slug].vue` detail pages with `ContentRenderer`
- Automatic D1 content storage on Cloudflare Workers

## Key Files

| File                   | Purpose                           |
| ---------------------- | --------------------------------- |
| `content/`             | Markdown blog posts               |
| `content.config.ts`    | Content collection configuration  |
| `app/layouts/blog.vue` | Blog-specific layout with sidebar |
| `app/pages/index.vue`  | Blog index with post listing      |
| `app/pages/[slug].vue` | Dynamic blog post detail page     |

## Running Standalone

```bash
pnpm --filter example-blog dev    # http://localhost:3012
```
