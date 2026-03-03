<script setup lang="ts">
import { useSeo } from '#imports'

useSeo({
  title: 'Passage Map — Sailing Track Viewer',
  description: 'Interactive sailing passage map with vessel tracking, AIS encounter data, and passage history visualization.',
})

useWebPageSchema()
</script>

<template>
  <PassageShell>
    <template #sidebar>
      <ClientOnly>
        <PassageSidebar />
      </ClientOnly>
    </template>

    <template #map>
      <ClientOnly>
        <PassageMap />
        <template #fallback>
          <div class="pm-loading" style="height: 100%;">
            <div class="pm-loading-spinner" />
            <span>Loading map…</span>
          </div>
        </template>
      </ClientOnly>
    </template>

    <template #timeline>
      <ClientOnly>
        <PassageTimelineEnhanced />
      </ClientOnly>
    </template>
  </PassageShell>
</template>
