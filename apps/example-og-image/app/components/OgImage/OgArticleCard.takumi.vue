<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  excerpt?: string
  category?: string
}>(), {
  title: 'Dynamic Route OG Example',
  excerpt: 'This image is generated from route params and query values.',
  category: 'Article',
})
</script>

<template>
  <div
    :style="{
      width: '1200px',
      height: '630px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: 'linear-gradient(145deg, #020617 0%, #111827 70%, #0c4a6e 100%)',
      padding: '56px',
      fontFamily: 'Inter, sans-serif',
      // eslint-disable-next-line atx/no-inline-hex
      color: '#e2e8f0',
    }"
  >
    <div
      :style="{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '8px',
        // eslint-disable-next-line atx/no-inline-hex
        background: '#0ea5e9',
        // eslint-disable-next-line atx/no-inline-hex
        color: '#082f49',
        fontSize: '22px',
        fontWeight: '700',
        padding: '8px 14px',
      }"
    >
      {{ category }}
    </div>

    <div :style="{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '970px' }">
      <div :style="{ fontSize: '64px', lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }">
        {{ title }}
      </div>
      <div
:style="{ fontSize: '30px',
                     // eslint-disable-next-line atx/no-inline-hex
                     color: '#cbd5e1', lineHeight: '1.35' }">
        {{ excerpt }}
      </div>
    </div>

    <div
:style="{ display: 'flex', justifyContent: 'space-between', fontSize: '24px',
                   // eslint-disable-next-line atx/no-inline-hex
                   color: '#7dd3fc' }">
      <div>nuxt-og-image v6 beta</div>
      <div>Route-driven OG</div>
    </div>
  </div>
</template>
