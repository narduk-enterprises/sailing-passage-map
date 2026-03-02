<script setup lang="ts">
definePageMeta({
  layout: 'blog',
})

const route = useRoute()

// Collection has prefix: '/' (content.config), so path matches route path, e.g. /hello-world
const { data: post } = await useAsyncData(`blog-${route.path}`, () => {
  return queryCollection('blog').path(route.path).first()
})

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

useSeo({
  title: post.value?.title || 'Blog Post',
  description: post.value?.description || '',
})
useArticleSchema({
  headline: post.value?.title || 'Blog Post',
  description: post.value?.description || '',
  datePublished: post.value?.date || '',
  dateModified: post.value?.date || '',
  author: { name: 'Blog Author' },
})
</script>

<template>
  <article v-if="post">
    <div class="mb-8">
      <h1 class="text-4xl font-bold font-display tracking-tight">{{ post.title }}</h1>
      <div class="flex items-center gap-4 mt-4 text-muted text-sm font-medium">
        <span class="flex items-center gap-1">
          <UIcon name="i-lucide-calendar" class="size-4" />
          <NuxtTime :datetime="post.date" year="numeric" month="short" day="numeric" />
        </span>
      </div>
    </div>

    <div class="prose prose-primary dark:prose-invert max-w-none">
      <ContentRenderer v-if="post" :value="post" />
    </div>
  </article>
</template>
