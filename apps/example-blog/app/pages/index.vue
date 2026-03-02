<script setup lang="ts">
definePageMeta({
  layout: 'blog',
})

useSeo({
  title: 'Blog',
  description: 'Latest news and updates.',
})

useWebPageSchema({
  name: 'Blog',
  description: 'Latest news and updates.',
  type: 'CollectionPage',
})

const { data: posts } = await useAsyncData('blog-index', () => {
  return queryCollection('blog').order('date', 'DESC').all()
})

// Route for a post: path may be /1.hello-world (prefix: '/') or /blog/1.hello-world
function postTo(post: { path: string }) {
  const p = (post.path ?? '').trim()
  const withoutBase = p.replace(/^(?:\/blog\/?|blog\/?)/, '')
  const slug = withoutBase ? (withoutBase.startsWith('/') ? withoutBase : `/${withoutBase}`) : '/'
  return slug
}
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="font-display text-4xl font-bold tracking-tight">Our Blog</h1>
      <p class="mt-4 text-lg text-muted">Thoughts, updates, and tutorials.</p>
    </div>

    <USeparator />

    <div class="space-y-6">
      <div v-for="post in posts" :key="post.path" class="group">
        <NuxtLink :to="postTo(post)" class="block">
          <UCard class="transition hover:ring-2 hover:ring-primary/50">
            <h2 class="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              {{ post.title }}
            </h2>
            <p class="text-sm text-muted mb-4">{{ post.description }}</p>
            <div class="flex items-center text-xs text-muted font-medium">
              <UIcon name="i-lucide-calendar" class="size-4 mr-2" />
              <NuxtTime :datetime="post.date" year="numeric" month="short" day="numeric" />
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
