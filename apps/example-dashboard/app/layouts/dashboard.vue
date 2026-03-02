<script setup lang="ts">
const { user, logout } = useAuth()
const colorMode = useColorMode()

const colorModeIcon = computed(() => {
  if (colorMode.preference === 'system') return 'i-lucide-monitor'
  return colorMode.value === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'
})

function cycleColorMode() {
  const modes = ['system', 'light', 'dark'] as const
  const idx = modes.indexOf(colorMode.preference as typeof modes[number])
  colorMode.preference = modes[(idx + 1) % modes.length]!
}

const navItems = [
  { label: 'Overview', to: '/', icon: 'i-lucide-layout-dashboard' },
]
</script>

<template>
  <UApp>
    <div class="h-screen flex bg-default">
      <aside class="w-64 border-r border-default bg-elevated flex flex-col hidden md:flex">
        <div class="p-4 border-b border-default flex items-center gap-3">
          <div class="size-8 rounded bg-primary text-white flex items-center justify-center font-bold">
            D
          </div>
          <span class="font-semibold">Dashboard</span>
        </div>

        <nav class="flex-1 p-4 space-y-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors"
            active-class="bg-primary/10 text-primary"
            inactive-class="text-muted hover:bg-default hover:text-default"
          >
            <UIcon :name="item.icon" class="size-4" />
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="p-4 border-t border-default space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-muted truncate">{{ user?.name || 'User' }}</span>
            <UButton :icon="colorModeIcon" variant="ghost" color="neutral" size="sm" @click="cycleColorMode" />
          </div>
          <UButton color="neutral" variant="ghost" icon="i-lucide-log-out" block @click="logout">
            Sign out
          </UButton>
        </div>
      </aside>

      <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header class="h-16 border-b border-default bg-default flex items-center justify-between px-4 md:hidden">
          <span class="font-semibold">Dashboard</span>
          <UButton variant="ghost" icon="i-lucide-menu" color="neutral" />
        </header>

        <div class="flex-1 overflow-auto p-6 md:p-8">
          <slot />
        </div>
      </main>
    </div>
  </UApp>
</template>
