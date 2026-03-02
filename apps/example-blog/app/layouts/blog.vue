<template>
  <UApp>
    <div class="min-h-screen flex flex-col">
      <div class="border-b border-default bg-elevated">
        <div class="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
          <NuxtLink
            to="/"
            class="flex items-center gap-2 text-sm font-medium text-muted hover:text-default"
          >
            <UIcon name="i-lucide-file-text" class="size-4" />
            Blog
          </NuxtLink>
        </div>
      </div>

      <div class="flex-1 py-12">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <slot />
        </div>
      </div>
    </div>
  </UApp>
</template>
