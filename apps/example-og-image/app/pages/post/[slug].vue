<script setup lang="ts">
const route = useRoute()

const slug = computed(() => String(route.params.slug || 'untitled'))
const title = computed(() => slug.value.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' '))

const category = computed(() => {
  const value = route.query.category
  return typeof value === 'string' && value.trim().length > 0 ? value.slice(0, 28) : 'Article'
})

const excerpt = computed(() => `This OG image is generated for /post/${slug.value} and can change with query params.`)

const generatedPaths = defineOgImage('OgArticleCardTakumi', {
  title: title.value,
  excerpt: excerpt.value,
  category: category.value,
}, [
  { key: 'og' },
  { key: 'twitter', width: 1200, height: 630 },
])
const previewPaths = useState<string[]>('example-og-image-post-preview-paths', () => generatedPaths)

useSeo({
  title: `${title.value} | OG Example`,
  description: excerpt.value,
  type: 'article',
})

useArticleSchema({
  headline: title.value,
  description: excerpt.value,
  datePublished: '2026-03-01',
  dateModified: '2026-03-01',
  author: {
    name: 'Nuxt Template Team',
  },
})
</script>

<template>
  <article class="py-10 max-w-3xl space-y-6">
    <NuxtLink to="/" class="text-sm text-primary hover:underline">
      ← Back to playground
    </NuxtLink>

    <h1 class="text-4xl font-bold tracking-tight">
      {{ title }}
    </h1>

    <p class="text-muted text-lg">
      {{ excerpt }}
    </p>

    <UCard>
      <p class="text-sm text-muted">
        Current category is <strong>{{ category }}</strong>. Try a URL such as
        <code>/post/nuxt-og-image-v6?category=Release+Notes</code> to produce a different OG image.
      </p>
    </UCard>

    <UCard class="space-y-4">
      <template #header>
        <h2 class="font-semibold text-lg">
          Generated OG Previews
        </h2>
      </template>

      <div class="grid gap-4 md:grid-cols-2">
        <div
          v-for="(path, idx) in previewPaths"
          :key="path"
          class="space-y-3 rounded-lg border border-default p-3"
        >
          <div class="font-medium">
            {{ idx === 0 ? 'Open Graph (1200x630)' : 'Twitter (1200x630)' }}
          </div>
          <NuxtImg
            :src="path"
            :alt="idx === 0 ? 'Open Graph image preview' : 'Twitter image preview'"
            width="1200"
            height="630"
            class="w-full rounded-md border border-default bg-elevated"
          />
          <code class="block text-xs break-all">{{ path }}</code>
        </div>
      </div>
    </UCard>
  </article>
</template>
