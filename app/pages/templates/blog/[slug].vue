<script setup lang="ts">
/**
 * TEMPLATE: Blog Post Detail
 *
 * Renders a single blog post from @nuxt/content.
 * Includes Schema.org Article structured data.
 */
definePageMeta({ layout: 'blog' })

const route = useRoute()

const { data } = await useAsyncData(`blog-${route.params.slug}`, () =>
  queryCollection('content').path(`/templates/blog/${route.params.slug}`).first(),
)
const post = computed(() => data.value as any)

if (!post.value) {
  throw createError({ statusCode: 404, message: 'Post not found' })
}

useSeo({
  title: post.value.title || 'Blog Post',
  description: (post.value.description as string) || '',
  type: 'article',
  ogImage: {
    title: post.value.title || 'Blog Post',
    description: (post.value.description as string) || '',
    icon: '📝',
  },
})

useArticleSchema({
  headline: post.value.title || 'Blog Post',
  description: (post.value.description as string) || '',
  datePublished: (post.value.date as string) || new Date().toISOString(),
  author: (post.value.author as { name: string }) || { name: 'Admin' },
})
</script>

<template>
  <article v-if="post" class="max-w-none">
    <!-- Post header -->
    <header class="mb-8">
      <div class="flex items-center gap-2 text-sm text-muted mb-3">
        <UButton to="/templates/blog" variant="ghost" color="neutral" size="xs" icon="i-lucide-arrow-left">
          Back to Blog
        </UButton>
      </div>

      <h1 class="font-display text-3xl sm:text-4xl font-bold mb-4">{{ post.title }}</h1>

      <div class="flex items-center gap-4 text-sm text-muted">
        <div v-if="post.date" class="flex items-center gap-1.5">
          <UIcon name="i-lucide-calendar" class="size-4" />
          <time>{{ new Date(post.date as string).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</time>
        </div>
        <div v-if="post.readingTime" class="flex items-center gap-1.5">
          <UIcon name="i-lucide-clock" class="size-4" />
          <span>{{ post.readingTime }} min read</span>
        </div>
      </div>

      <div v-if="post.tags" class="flex gap-2 mt-4">
        <UBadge v-for="tag in (post.tags as string[])" :key="tag" variant="subtle" size="sm">
          {{ tag }}
        </UBadge>
      </div>
    </header>

    <USeparator class="mb-8" />

    <!-- Post content (rendered from MDC) -->
    <div class="prose prose-lg dark:prose-invert max-w-none">
      <ContentRenderer :value="post" />
    </div>
  </article>
</template>
