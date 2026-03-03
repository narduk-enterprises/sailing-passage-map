<script setup lang="ts">
useSeo({
  title: 'InfluxDB Explorer — Sailing Passage Map',
  description: 'Explore and query InfluxDB sailing data, measurements, fields, and raw time-series data.',
})

useWebPageSchema()
</script>

<template>
  <NuxtLayout>
    <div class="pm-explorer">
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
        <h1 style="font-size: 1.5rem; font-weight: 700; margin: 0;">InfluxDB Explorer</h1>
        <NuxtLink to="/" style="color: var(--pm-text-muted); text-decoration: none; font-size: 0.875rem;">
          ← Back to Map
        </NuxtLink>
      </div>

      <ClientOnly>
        <InfluxExplorer />
      </ClientOnly>
    </div>
  </NuxtLayout>
</template>
