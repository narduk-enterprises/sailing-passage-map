<script setup lang="ts">
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
