<script setup lang="ts">
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
</script>

<template>
  <UApp>
    <div class="min-h-screen flex flex-col">
      <!-- Minimal transparent header -->
      <div class="fixed top-0 inset-x-0 z-50 backdrop-blur-lg bg-default/60 border-b border-default">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <NuxtLink to="/" class="font-display font-bold text-lg">
            <slot name="logo">
              <span class="text-primary">N4</span> Template
            </slot>
          </NuxtLink>

          <div class="flex items-center gap-2">
            <slot name="nav" />
            <UButton
              :icon="colorModeIcon"
              variant="ghost"
              color="neutral"
              @click="cycleColorMode"
            />
          </div>
        </div>
      </div>

      <!-- Full-bleed content -->
      <div class="flex-1 pt-14">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <slot />
        </div>
      </div>

      <!-- Minimal footer -->
      <div class="border-t border-default py-6 text-center text-sm text-muted">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <slot name="footer">
            <p>&copy; <NuxtTime :datetime="new Date()" year="numeric" /> Your Company. All rights reserved.</p>
          </slot>
        </div>
      </div>
    </div>
  </UApp>
</template>
