---
description: Generate a cohesive theme, styling, images, and overarching design aesthetic for a Nuxt 4 app
---

# /generate-app-theme

This workflow instructs an agent to design and implement a polished, cohesive visual identity for a newly created Nuxt 4 app within the monorepo architecture.

The goal is to move the app from a basic functional structure to an aesthetically pleasing, production-ready product with deliberate typography, colors, assets, and styling overrides.

## Step 1: Analyze and Strategize

1. Ask the user for the app's core purpose, target audience, and desired "vibe" (e.g., _playful consumer SaaS_, _serious B2B dashboard_, _minimalist creative tool_).
2. Propose a cohesive design direction:
   - **Primary Color:** A Nuxt UI / Tailwind color (e.g., `emerald`, `indigo`, `rose`, `sky`).
   - **Neutral Color:** A complementary gray scale (e.g., `slate`, `zinc`, `stone`).
   - **Typography Focus:** Recommended Google Fonts for Display (headings) and Sans (body text).
   - **Visual Vibe:** Light vs. dark mode preference, flat vs. glassmorphism style, illustration vs. photographic imagery styles.

Wait for the user's approval on the proposed theory before acting.

## Step 2: Configure Theme & Typography

Once the direction is approved, configure the Nuxt 4 app overriding the `narduk-nuxt-layer` defaults:

1. **Nuxt UI Colors:** Create or update `apps/<app-name>/app/app.config.ts` to set the new colors.

   ```ts
   export default defineAppConfig({
     ui: {
       colors: {
         primary: 'indigo', // Chosen primary
         neutral: 'slate', // Chosen neutral
       },
     },
   });
   ```

2. **Tailwind v4 Theme Overrides:** Create or update `apps/<app-name>/app/assets/css/main.css` to override the layer's `@theme` variables (fonts, specific shadow/radius requirements).

   ```css
   @import 'tailwindcss';
   @import '@nuxt/ui';

   @theme {
     /* Override Typography */
     --font-sans: 'Inter', system-ui, sans-serif;
     --font-display: 'Outfit', system-ui, sans-serif;

     /* Optional: Tweak border radiuses for a sharper or rounder look */
     --radius-card: 1.5rem;
     --radius-button: 9999px; /* Pill buttons */
   }
   ```

   _Note: @nuxt/fonts automatically resolves Google Fonts used in the CSS._

## Step 3: Generate Visual Assets

1. Use the `generate_image` tool to create unique, high-quality visual assets for the app:
   - **Logo:** A minimal, modern app icon (e.g., `apps/<app-name>/public/logo.png` or an SVG).
   - **Auth/Hero Background (Optional):** An abstract, aesthetic background for the login page or landing hero section (e.g., `apps/<app-name>/public/images/auth-bg.webp`).
   - **Placeholder Content (Optional):** Avatars, dashboard charts, or feature illustrations if the app needs them to look polished during development.
2. Move any generated assets from the artifact directory into `apps/<app-name>/public/` (create subdirectories like `images` if needed).

## Step 4: Run Branding Workflow

Execute the `/generate-branding` workflow using the newly minted Logo.

- Inform the user you are running the branding generator.
- Use `pnpm generate:favicons -- --target=apps/<app-name>/public --name="<Display Name>"` substituting the proper name.

## Step 5: Apply Holistic Polish

Ensure the app utilizes the `narduk-nuxt-layer` design primitives intelligently and add application-specific polish:

1. **Glassmorphism & Shadows:** Utilize `.glass`, `.glass-card`, `.shadow-card`, or `.shadow-elevated` on key components (navbars, auth cards, modals).
2. **Micro-animations:** Add `.animate-count-in`, `.transition-base`, etc. to buttons, lists, and dynamic data as appropriate to make the app feel alive.
3. **Layout Adjustments:** Update the main `app.vue` or specific layout files (`layouts/default.vue`) to apply the new background colors, hero areas, and ensure Dark Mode is tested and looks premium.

## Step 6: Review

1. Start the dev server: `pnpm run dev --filter <app-name>`
2. Ask the user to visually review the dev server in their browser.
3. Make any final color contrasting, padding, or typography adjustments based on their feedback.

> **CRITICAL RULE:** Aesthetic excellence is required. Do not settle for basic configurations. Use rich colors, subtle gradients, and modern layout spacing.
