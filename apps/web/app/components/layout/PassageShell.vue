<template>
  <div class="pm-shell">
    <aside class="pm-sidebar">
      <slot name="sidebar" />
    </aside>
    <main class="pm-map-area">
      <slot name="map" />
    </main>
    <footer class="pm-timeline-area">
      <slot name="timeline" />
    </footer>
  </div>
</template>

<script setup lang="ts">
// 3-panel layout: sidebar | map | timeline
</script>
