# Example: Marketing

Demonstrates **landing page UI components** built with Nuxt UI 4 and a custom landing layout.

## What It Demonstrates

- Reusable marketing UI components: Hero, Pricing, Testimonials, Contact Form
- Landing page layout (`layouts/landing.vue`)
- Zod-validated contact form with Nuxt UI's `<UForm>` integration
- Design token colors and Tailwind CSS 4 styling

## Key Files

| File                                        | Purpose                        |
| ------------------------------------------- | ------------------------------ |
| `app/layouts/landing.vue`                   | Full-width landing page layout |
| `app/components/ui/HeroSection.vue`         | Hero banner with CTA           |
| `app/components/ui/PricingTable.vue`        | Pricing tier cards             |
| `app/components/ui/TestimonialCarousel.vue` | Customer testimonial carousel  |
| `app/components/ui/ContactForm.vue`         | Zod-validated contact form     |
| `app/pages/index.vue`                       | Assembled landing page         |

## Running Standalone

```bash
pnpm --filter example-marketing dev    # http://localhost:3013
```
