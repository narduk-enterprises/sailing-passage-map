<script setup lang="ts">
// HeroSection.vue
</script>

<template>
  <div class="py-24 sm:py-32 overflow-hidden relative">
    <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
      <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-primary to-neutral opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] [clip-path:polygon(74.1%_44.1%,100%_61.6%,97.5%_26.9%,85.5%_0.1%,80.7%_2%,72.5%_32.5%,60.2%_62.4%,52.4%_68.1%,47.5%_58.3%,45.2%_34.5%,27.5%_76.7%,0.1%_64.9%,17.9%_100%,27.6%_76.8%,76.1%_97.7%,74.1%_44.1%)]"></div>
    </div>

    <div class="mx-auto max-w-7xl px-6 lg:px-8 text-center">
      <h1 class="font-display max-w-4xl mx-auto text-5xl font-bold tracking-tight sm:text-7xl text-highlighted">
        Build at the speed of thought.
      </h1>
      <p class="mt-6 max-w-2xl mx-auto text-lg leading-8 text-muted">
        The ultimate edge-ready stack. Nuxt 4, Nuxt UI 4, Cloudflare Workers, and D1. Everything you need to deploy globally in seconds.
      </p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <UButton size="xl" to="#pricing">
          Get Started
        </UButton>
        <UButton size="xl" variant="ghost" color="neutral" to="https://github.com/loganrenz/nuxt-v4-template" target="_blank" icon="i-lucide-github">
          View on GitHub
        </UButton>
      </div>
    </div>
  </div>
</template>
