<script setup lang="ts">
useSeo({
  title: 'Nuxt 4 Showcase',
  description: 'Interactive examples showcasing Nuxt 4, Nuxt UI 4, and Cloudflare Workers patterns.',
  ogImage: {
    title: 'Nuxt 4 Showcase',
    description: 'Production-ready example apps',
    icon: '🎯',
  },
})

useWebPageSchema({
  name: 'Nuxt 4 Showcase',
  description: 'Interactive examples showcasing Nuxt 4, Nuxt UI 4, and Cloudflare Workers patterns.',
  type: 'CollectionPage',
})

const config = useRuntimeConfig()

const examples = [
  {
    title: 'Authentication',
    description: 'Login, registration, and session management using Web Crypto PBKDF2 and D1.',
    icon: 'i-lucide-lock',
    href: config.public.exampleAuthUrl as string,
    color: 'text-emerald-500',
    features: ['Web Crypto PBKDF2', 'D1 sessions', 'CSRF protection', 'Zod validation'],
  },
  {
    title: 'Blog',
    description: 'Content-driven blog powered by Nuxt Content v3 with markdown and MDC support.',
    icon: 'i-lucide-file-text',
    href: config.public.exampleBlogUrl as string,
    color: 'text-blue-500',
    features: ['Nuxt Content v3', 'MDC components', 'D1 storage on edge', 'SEO optimized'],
  },
  {
    title: 'Marketing',
    description: 'Landing page components: hero, pricing tables, testimonials, and contact forms.',
    icon: 'i-lucide-megaphone',
    href: config.public.exampleMarketingUrl as string,
    color: 'text-purple-500',
    features: ['Hero section', 'Pricing table', 'Testimonials', 'Contact form'],
  },
  {
    title: 'Dashboard',
    description: 'Protected dashboard with sidebar navigation and auth integration.',
    icon: 'i-lucide-layout-dashboard',
    href: config.public.exampleDashboardUrl as string,
    color: 'text-amber-500',
    features: ['Sidebar layout', 'Auth middleware', 'Stats cards', 'Activity feed'],
  },
  {
    title: 'OG Images',
    description: 'Dynamic Open Graph image generation with nuxt-og-image v6 beta on Cloudflare Workers.',
    icon: 'i-lucide-image-up',
    href: config.public.exampleOgImageUrl as string,
    color: 'text-violet-500',
    features: ['defineOgImage()', 'Renderer suffixes', 'Route + query driven', 'Multi-size cards'],
  },
  {
    title: 'Apple Maps',
    description: 'Apple MapKit JS 5.x integration with JWT token auth on Nuxt 4 and Cloudflare Workers.',
    icon: 'i-lucide-map',
    href: config.public.exampleAppleMapsUrl as string,
    color: 'text-blue-500',
    features: ['MapKit JS 5.x', 'JWT token', 'Client-side init', 'Edge deploy'],
  },
]
</script>

<template>
  <div class="space-y-16 py-12">
    <!-- Hero -->
    <div class="text-center max-w-3xl mx-auto space-y-6">
      <h1 class="font-display text-5xl sm:text-6xl font-bold tracking-tight">
        Nuxt 4 <span class="text-primary">Showcase</span>
      </h1>
      <p class="text-lg text-muted max-w-2xl mx-auto">
        Production-ready example apps built with the Nuxt 4 template layer.
        Each example is a standalone Cloudflare Worker you can explore independently.
      </p>
      <div class="flex items-center justify-center gap-4">
        <UButton
          to="https://github.com/loganrenz/nuxt-v4-template"
          target="_blank"
          icon="i-lucide-github"
          color="neutral"
          variant="outline"
          size="lg"
        >
          View Source
        </UButton>
      </div>
    </div>

    <USeparator />

    <!-- Example Apps Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ULink
        v-for="example in examples"
        :key="example.title"
        :to="example.href"
        target="_blank"
        rel="noopener"
        class="group block"
      >
        <UCard class="h-full transition-all hover:ring-2 hover:ring-primary/50 hover:-translate-y-1">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="p-2.5 rounded-lg bg-elevated">
                <UIcon :name="example.icon" :class="['size-6', example.color]" />
              </div>
              <h2 class="text-xl font-semibold group-hover:text-primary transition-colors">
                {{ example.title }}
              </h2>
              <UIcon name="i-lucide-external-link" class="size-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
            </div>

            <p class="text-sm text-muted leading-relaxed">
              {{ example.description }}
            </p>

            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="feature in example.features"
                :key="feature"
                variant="subtle"
                color="neutral"
                size="sm"
              >
                {{ feature }}
              </UBadge>
            </div>
          </div>
        </UCard>
      </ULink>
    </div>

    <!-- Architecture Note -->
    <UCard class="bg-elevated/50">
      <div class="flex items-start gap-4">
        <div class="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
          <UIcon name="i-lucide-blocks" class="size-5" />
        </div>
        <div class="space-y-2">
          <h3 class="font-semibold">Independent Workers</h3>
          <p class="text-sm text-muted">
            Each example runs as a fully independent Cloudflare Worker with its own domain.
            Click any card above to open it in a new tab. All apps are built from the same
            Nuxt 4 template layer and can be developed and deployed independently.
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>
