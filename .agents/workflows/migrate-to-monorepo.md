---
description: Migrate a flat Nuxt 4 app from ~/code into the nuxt-v4-template monorepo architecture
---

# Migrate Existing Repo to Monorepo Template

> **Scope:** This workflow converts a flat Nuxt 4 application (one of the ~10 repos in `~/code`) into a **new repository** by cloning the `nuxt-v4-template` monorepo scaffold and copying the app code into `apps/web/`.

// turbo-all

---

## Prerequisites — Confirm Before Starting

1. Read `~/code/nuxt-v4-template/AGENTS.md` in full. This is the golden reference.
2. Determine if the source repo is a Nuxt 4 app (has `nuxt.config.ts`). If not, STOP and notify the user.
3. Identify the source repo name, e.g. `papa-everetts-pizza`. Determine the new project name, e.g. `papa-everetts-pizza-v2`.

---

## Phase 0: Scaffold the New Repo

All migration work happens in `/tmp` to keep `~/code` clean.

1. Clone the source repo and the template into `/tmp`:
   ```bash
   git clone ~/code/<source> /tmp/<source>
   git clone https://github.com/loganrenz/nuxt-v4-template.git /tmp/<project-name>-v2
   cd /tmp/<project-name>-v2
   rm -rf .git
   git init && git add . && git commit -m "chore: scaffold from nuxt-v4-template"
   ```
2. Run the init script to rename everything:
   ```bash
   pnpm install
   npx jiti tools/init.ts --name="<project-name>" --display="<Display Name>" --url="https://<domain>"
   ```
   _Note: The init script will output some "Next steps" (like Doppler setup)._
3. **Automate Doppler Setup**: Initialize Doppler for the project using the new generic name:
   ```bash
   doppler setup --project <project-name> --config dev
   ```
4. Verify the scaffold compiles cleanly:
   ```bash
   pnpm install && pnpm run dev
   ```
   Kill the dev server once it starts successfully.

---

## Phase 1: Inventory the Source Repo

Before moving ANY files, audit the source repo (`~/code/<source>`) to categorize every file.

### 1a. Files That the Layer Already Provides (DELETE / DO NOT COPY)

These exist identically in `layers/narduk-nuxt-layer/` and must **not** be duplicated into the new app:

- `app/composables/useSeo.ts` and `app/composables/useSchemaOrg.ts`
- `app/components/OgImage/*`
- `app/plugins/gtag.client.ts`, `app/plugins/posthog.client.ts`, `app/plugins/csrf.client.ts`, `app/plugins/fetch.client.ts`
- `server/utils/` (`auth.ts`, `admin.ts`, `database.ts`, `google.ts`, `kv.ts`, `r2.ts`, `rateLimit.ts` - unless heavily customized)
- `server/middleware/csrf.ts`, `server/middleware/d1.ts`
- `server/api/health.get.ts`, `server/api/indexnow/*`

> **Important:** If the source app has a `server/utils/admin.ts` that exports `requireAdmin`, it is now provided by the layer's `server/utils/auth.ts`. Do NOT copy it — Nuxt will warn about duplicated imports and ignore the app-level version.

### 1b. Files That Belong in `apps/web/` (MOVE)

These files contain the specific business logic and should be copied:

- `app/pages/**`, `app/components/**` (only app-specific ones), `app/composables/**` (app-specific), `app/layouts/**`, `app/middleware/**`
- `app/assets/css/main.css` — **Only app-specific styles** (see Phase 2 CSS merge instructions)
- `app/app.vue` — **Merge, do not overwrite** (see Phase 2 app.vue instructions)
- `app/error.vue`, `app/app.config.ts`
- `content/**` and `content.config.ts` (if using Nuxt Content)
- `server/api/**` (app-specific routes only)
- `server/database/schema.ts` (app-specific schema, extending base schema)
- `public/**`
- `drizzle/**` (app-specific migrations)
- `scripts/**` (app-specific scripts)

### 1c. Files to DELETE Entirely (Junk / Superseded)

- `.env*`, `.dev.vars` (Doppler replaces these)
- All ESLint plugin directories (`eslint-plugin-nuxt-ui/`, etc.) — these are now in `packages/eslint-config/`
- Massive `eslint.config.mjs` — replaced by slim layer version
- `.cursorrules`, `.cursor/` — agent config replaced by `AGENTS.md`
- Lint reports, `.eslint-results.json`, logs, temp artifacts, old workspace configs, package lock files

---

## Phase 2: Move App-Specific Files

Execute commands to selectively copy code from the old repo to the new `apps/web/` directory.

> **Important:** The template scaffold may not have all target directories pre-created (e.g. `components/`, `composables/`, `plugins/`, `types/`, `server/api/`, `server/utils/`). Always `mkdir -p` before copying.

1. **Create target directories and copy app-specific source files:**

   ```bash
   # Make sure you are in the new repo
   cd /tmp/<project-name>-v2

   # Create directories that may not exist in the scaffold
   mkdir -p apps/web/app/components apps/web/app/composables apps/web/app/plugins \
            apps/web/app/types apps/web/app/middleware apps/web/server/api apps/web/server/utils

   # Pages, components, layouts, composables, middleware
   cp -R /tmp/<source>/app/pages/* apps/web/app/pages/ || true
   cp -R /tmp/<source>/app/components/* apps/web/app/components/ || true
   cp -R /tmp/<source>/app/layouts/* apps/web/app/layouts/ || true
   cp -R /tmp/<source>/app/composables/* apps/web/app/composables/ || true
   cp -R /tmp/<source>/app/middleware/* apps/web/app/middleware/ || true

   # Static assets and Content
   cp -R /tmp/<source>/public/* apps/web/public/ || true
   if [ -d /tmp/<source>/content ]; then cp -R /tmp/<source>/content apps/web/content; fi
   ```

   Then **immediately delete** any layer-provided files that were copied (see Phase 1a checklist).

2. **Automate App-Specific CSS merge:**
   - Compare `/tmp/<source>/app/assets/css/main.css` with `layers/narduk-nuxt-layer/app/assets/css/main.css`.
   - The layer provides the base CSS (tailwind imports, `@theme` fonts, glassmorphism, form layout, page transitions). These are typically the first ~176 lines.
   - Extract **only the app-specific CSS** (custom keyframes, component styles, game/app-specific classes) into a new `apps/web/app/assets/css/main.css`.
   - Add `css: ['~/assets/css/main.css']` to `apps/web/nuxt.config.ts` to load the app-specific styles.
   - **Do NOT** duplicate the tailwind/nuxt-ui imports or `@theme` block — the layer handles those.

3. **Automate App-Specific `app.vue` merge:**
   - The template's `app.vue` uses this canonical structure — **do not delete it**:
     ```vue
     <template>
       <UApp>
         <NuxtLayout>
           <NuxtPage />
         </NuxtLayout>
       </UApp>
     </template>
     ```
   - Copy any app-specific `<style>` blocks (CSS custom properties, global overrides) from the source `app.vue` into the template's `app.vue`.
   - Copy any `<script setup>` logic (global providers, schema setup) into the template's `app.vue`.
   - **Do NOT** remove `<UApp>`, `<NuxtLayout>`, or `<NuxtPage>` — these are required.

4. **Copy app-specific server code & migrations:**

   ```bash
   cp -R /tmp/<source>/server/api/* apps/web/server/api/ || true
   cp /tmp/<source>/drizzle/*.sql apps/web/drizzle/ || true
   ```

   Then **delete** any layer-provided server files that were copied (health.get.ts, indexnow/\*, etc.).
   - **Automate Schema Merge**: Read `/tmp/<source>/server/database/schema.ts` and merge any custom tables into `apps/web/server/database/schema.ts` using your code editing tools. The template's schema already re-exports the layer's base tables via `export * from '#layer/server/database/schema'`.

---

## Phase 3: Rewrite Configuration

### 3a. `apps/web/nuxt.config.ts`

The new `nuxt.config.ts` must be **slim**.
**DELETE overrrides** already handled by the layer:

- `modules` array (unless strictly app-specific)
- `css`, `devtools`, `ui`, `colorMode`
- `nitro.preset`, `nitro.esbuild`, `nitro.externals`, `nitro.rollupConfig`
- `image.provider`, `ogImage.defaults`
- `compatibilityDate`, `future.compatibilityVersion`

**KEEP ONLY:**

- `extends: ['../../layers/narduk-nuxt-layer']`
- `runtimeConfig` (app-specific env vars)
- `site` (metadata), `schemaOrg.identity`, `image.cloudflare.baseURL`
- `app.head` (meta tags, favicons)
- `sitemap` exclusions, `robots` rules

### 3b. `apps/web/package.json`

Remove all UI, formatting, and layer dependencies (`@nuxt/ui`, `drizzle-orm`, `tailwindcss`, ESLint plugins, etc.). The init script already creates a slim package.json with `nuxt`, `zod`, and `@narduk/eslint-config`. Only add strictly app-specific dependencies:

```json
{
  "dependencies": {
    "@narduk/eslint-config": "workspace:*",
    "nuxt": "^4.3.1",
    "zod": "^4.3.6"
    // + any strictly app-specific deps (e.g., "cheerio")
  },
  "devDependencies": {
    "eslint": "^10.0.2",
    "typescript": "^5.9.3",
    "vue-tsc": "^3.2.5",
    "wrangler": "^4.20.0"
  }
}
```

### 3c. `apps/web/eslint.config.mjs`

Replace with the slim workspace version:

```js
// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import { sharedConfigs } from '@narduk/eslint-config';
export default withNuxt(...sharedConfigs);
```

### 3d. `apps/web/wrangler.json`

The init script already created this. Update only the `d1_databases` array if the app has specific D1 database bindings:

```json
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "<project-name>-db",
      "database_id": "<real-id-from-old-wrangler>",
      "preview_database_id": "DB"
    }
  ]
}
```

Add any `r2_buckets` bindings if the source app had them.

---

## Phase 4: Handle GitHub Actions and Clean Up

1. **Deploy Workflow:** The `.github/workflows/deploy.yml` is already scaffolded. Ensure `DOPPLER_TOKEN` is set as a GitHub Action secret in the new repo.
2. **Remove Examples App:** If this is a production project, delete the generic examples app shipped with the template:
   ```bash
   rm -rf ~/code/<source>/<project-name>-v2/apps/examples
   ```
   _(Ensure you update `pnpm-workspace.yaml` if it had explicit references, though `apps/_` glob usually handles this).\*
3. **Delete Leftovers:**
   ```bash
   find /tmp/<project-name>-v2/apps/web -name "*.bak" -delete
   find /tmp/<project-name>-v2/apps/web -name ".DS_Store" -delete
   ```

---

## Phase 5: Verification

1. Install, clean, and build plugins:
   ```bash
   cd /tmp/<project-name>-v2
   pnpm install
   rm -rf apps/web/.nuxt apps/web/.output
   pnpm run build:plugins
   ```
2. Run quality checks:
   ```bash
   pnpm run quality
   ```
   _Fix any lint or type errors until this passes cleanly._
3. Start the dev server:
   ```bash
   pnpm run dev
   ```
   _Ask the user to verify the app compiles, pages render, and the layer merges correctly._
4. Seed the database (if applicable):
   ```bash
   pnpm --filter web run db:migrate
   pnpm --filter web run db:seed
   ```
5. Commit:
   ```bash
   git add .
   git commit -m "feat: migrate <source-repo> to monorepo architecture"
   ```

---

## Phase 6: Post-Migration Audits

Run the quality agent slash commands to validate the final state:

```bash
# In the agent: use /check-architecture, /check-ssr-hydration-safety, etc.
```

| Workflow                      | Check                                           |
| ----------------------------- | ----------------------------------------------- |
| `/check-layer-health`         | Layer inheritance, shadowed files, config drift |
| `/check-architecture`         | Thin components / thick composables             |
| `/check-ui-styling`           | Tailwind v4 tokens, Nuxt UI v4 compliance       |
| `/check-seo-compliance`       | useSeo, Schema.org, OG images on every page     |
| `/check-ssr-hydration-safety` | SSR safety, window access, ClientOnly           |
| `/audit-repo-hygiene`         | Secrets, junk files, duplicated code            |

---

## Phase 7: Finalize Directory Structure and Review

Once the migration is fully verified and the new monorepo app is working as expected, move it to `~/code` and archive the old repo.

1. **Move the old repo to graveyard and the new one to `~/code`:**

   ```bash
   mv ~/code/<source> ~/old-code/graveyard/
   mv /tmp/<project-name>-v2 ~/code/<project-name>
   ```

2. **Final Quality Review:**

   ```bash
   cd ~/code/<project-name>
   pnpm run quality
   ```

   _Take a moment to perform one final, thorough review of the app to ensure everything functions perfectly in its new location._

3. **Clean up /tmp:**
   ```bash
   rm -rf /tmp/<source>
   ```

---

## Decision Matrix: What Goes Where

| Question                                | Answer                        |
| --------------------------------------- | ----------------------------- |
| Is this shared across all Narduk apps?  | → `layers/narduk-nuxt-layer/` |
| Is this an ESLint rule or plugin?       | → `packages/eslint-config/`   |
| Is this a root-level automation script? | → `tools/`                    |
| Is this app-specific UI/logic?          | → `apps/web/app/`             |
| Is this an app-specific API endpoint?   | → `apps/web/server/`          |
| Is this a CI/CD workflow?               | → `.github/workflows/`        |
| Is this an agent quality workflow?      | → `.agents/workflows/`        |
