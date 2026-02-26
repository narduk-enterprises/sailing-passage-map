<script setup lang="ts">
/**
 * TEMPLATE: Blog Index Page
 *
 * Lists all blog posts from @nuxt/content.
 */
definePageMeta({ layout: 'blog' })

useSeo({
  title: 'Blog',
  description: 'Latest articles, tutorials, and updates.',
  ogImage: { title: 'Blog', description: 'Articles and tutorials', icon: '📝' },
})
useWebPageSchema({ name: 'Blog', type: 'CollectionPage' })

const { data } = await useAsyncData('blog-posts', () =>
  queryCollection('content').order('date' as any, 'DESC').all(),
)
const posts = computed(() => data.value as any[])
</script>

<template>
  <div>
    <h1 class="font-display text-3xl font-bold mb-2">Blog</h1>
    <p class="text-muted mb-8">Latest articles, tutorials, and updates.</p>

    <div v-if="posts?.length" class="space-y-6">
      <NuxtLink
        v-for="post in posts"
        :key="post.path"
        :to="post.path"
        class="block group"
      >
        <UCard class="transition-shadow hover:shadow-lg">
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-xs text-muted">
              <UIcon name="i-lucide-calendar" class="size-3.5" />
              <time v-if="post.date">{{ new Date(post.date as string).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</time>
              <span v-if="post.readingTime">· {{ post.readingTime }} min read</span>
            </div>
            <h2 class="text-lg font-semibold group-hover:text-primary transition-colors">
              {{ post.title }}
            </h2>
            <p v-if="post.description" class="text-sm text-muted line-clamp-2">
              {{ post.description }}
            </p>
            <div v-if="post.tags" class="flex gap-2 pt-1">
              <UBadge v-for="tag in (post.tags as string[])" :key="tag" variant="subtle" size="xs">
                {{ tag }}
              </UBadge>
            </div>
          </div>
        </UCard>
      </NuxtLink>
    </div>

    <UCard v-else class="text-center py-12">
      <UIcon name="i-lucide-file-text" class="size-12 text-muted mx-auto mb-4" />
      <h3 class="font-semibold mb-2">No posts yet</h3>
      <p class="text-sm text-muted">Add markdown files to <code class="text-xs">content/blog/</code> to get started.</p>
    </UCard>
  </div>
</template>
