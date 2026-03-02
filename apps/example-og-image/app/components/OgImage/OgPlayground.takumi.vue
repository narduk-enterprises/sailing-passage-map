<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
  badge?: string
  accent?: string
}>(), {
  title: 'nuxt-og-image v6 beta',
  description: 'Dynamic OG images on Cloudflare Workers',
  badge: 'Playground',
  accent: '#8b5cf6', // eslint-disable-line atx/no-inline-hex
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
      background: 'linear-gradient(120deg, #0f172a 0%, #131c33 45%, #1f1440 100%)',
      padding: '56px',
      fontFamily: 'Inter, sans-serif',
      // eslint-disable-next-line atx/no-inline-hex
      color: '#f8fafc',
      position: 'relative',
      overflow: 'hidden',
    }"
  >
    <div
      :style="{
        position: 'absolute',
        inset: 'auto -80px -120px auto',
        width: '420px',
        height: '420px',
        borderRadius: '9999px',
        background: `radial-gradient(circle, ${accent}50 0%, transparent 70%)`,
      }"
    />

    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }"
    >
      <div
        :style="{
          display: 'inline-flex',
          alignItems: 'center',
          border: `2px solid ${accent}`,
          borderRadius: '9999px',
          padding: '10px 18px',
          fontSize: '24px',
          fontWeight: '600',
          // eslint-disable-next-line atx/no-inline-hex
          color: '#e2e8f0',
        }"
      >
        {{ badge }}
      </div>
      <div
        :style="{
          fontSize: '22px',
          fontWeight: '600',
          // eslint-disable-next-line atx/no-inline-hex
          color: '#94a3b8',
        }"
      >
        Cloudflare Workers
      </div>
    </div>

    <div :style="{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '940px' }">
      <div :style="{ fontSize: '68px', fontWeight: '700', lineHeight: '1.05', letterSpacing: '-0.02em' }">
        {{ title }}
      </div>
      <div
:style="{ fontSize: '34px', lineHeight: '1.25',
                     // eslint-disable-next-line atx/no-inline-hex
                     color: '#cbd5e1' }">
        {{ description }}
      </div>
    </div>

    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '24px',
      }"
    >
      <div
:style="{
        // eslint-disable-next-line atx/no-inline-hex
        color: '#94a3b8'
      }">
        example-og-image
      </div>
      <div :style="{ color: accent, fontWeight: '700' }">
        /_og/*
      </div>
    </div>
  </div>
</template>
