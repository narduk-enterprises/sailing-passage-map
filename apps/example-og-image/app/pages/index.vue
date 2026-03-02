<script setup lang="ts">
const route = useRoute()

const ogTitle = computed(() => {
  const value = route.query.title
  return typeof value === 'string' && value.trim().length > 0
    ? value.slice(0, 80)
    : 'nuxt-og-image v6 beta on Cloudflare Workers'
})

const ogDescription = computed(() => {
  const value = route.query.description
  return typeof value === 'string' && value.trim().length > 0
    ? value.slice(0, 140)
    : 'Dynamic Open Graph images rendered at the edge with renderer-suffixed components.'
})

const accent = computed(() => {
  const value = route.query.accent
  // eslint-disable-next-line atx/no-inline-hex
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value : '#8b5cf6'
})

const generatedPaths = defineOgImage('OgPlaygroundTakumi', {
  title: ogTitle.value,
  description: ogDescription.value,
  accent: accent.value,
  badge: 'Query Driven',
}, [
  { key: 'og' },
  { key: 'whatsapp', width: 800, height: 800 },
])

// Keep server-generated OG URLs stable across hydration.
const previewPaths = useState<string[]>('example-og-image-preview-paths', () => generatedPaths)

useSeo({
  title: 'OG Image Playground',
  description: 'Explore query-driven and route-driven dynamic OG images using nuxt-og-image v6 beta on Cloudflare Workers.',
})

useWebPageSchema({
  name: 'OG Image Playground',
  description: 'Interactive examples of dynamic OG generation on Cloudflare Workers.',
})

const examples = [
  '/?title=Edge+OG+Image&description=Generated+from+URL+query+params&accent=%230ea5e9',
  '/?title=Nuxt+SEO+Cards&description=Multi-size+OG+images+for+social+platforms&accent=%23f59e0b',
  '/post/cloudflare-workers-og',
  '/post/nuxt-og-image-v6?category=Release+Notes',
]
</script>

<template>
  <div class="space-y-8 py-10">
    <header class="space-y-4 max-w-3xl">
      <h1 class="text-4xl sm:text-5xl font-bold tracking-tight">
        OG Image Playground
      </h1>
      <p class="text-lg text-muted">
        This example uses <code>defineOgImage()</code> with renderer-suffixed OG components.
        Update query params to generate new social cards and inspect the generated <code>/_og/*</code> paths.
      </p>
    </header>

    <UCard>
      <template #header>
        <h2 class="font-semibold text-lg">
          Generated OG Previews
        </h2>
      </template>

      <div class="space-y-4">
        <p class="text-sm text-muted">
          These images are rendered by nuxt-og-image at runtime. The first card is 1200x600, the second is a square 800x800 variant.
        </p>
        <div class="grid gap-4 md:grid-cols-2">
          <div
            v-for="(path, idx) in previewPaths"
            :key="path"
            class="rounded-lg border border-default p-3 space-y-3"
          >
            <div class="font-medium">
              {{ idx === 0 ? 'Default (og) - 1200x600' : 'Square (whatsapp) - 800x800' }}
            </div>
            <NuxtImg
              :src="path"
              :alt="idx === 0 ? 'Default OG image preview' : 'Square OG image preview'"
              :width="idx === 0 ? 1200 : 800"
              :height="idx === 0 ? 600 : 800"
              class="w-full rounded-md border border-default bg-elevated"
            />
            <code class="block text-xs break-all">{{ path }}</code>
          </div>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="font-semibold text-lg">
          Try These Routes
        </h2>
      </template>

      <div class="grid gap-3">
        <NuxtLink
          v-for="item in examples"
          :key="item"
          :to="item"
          class="text-primary hover:underline break-all"
        >
          {{ item }}
        </NuxtLink>
      </div>
    </UCard>
  </div>
</template>
