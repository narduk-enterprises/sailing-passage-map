<script setup lang="ts">
// 3-panel layout: sidebar | map | timeline
</script>

<template>
  <div class="pm-shell">
    <aside class="pm-sidebar">
      <slot name="sidebar" />
    </aside>
    <div class="pm-map-area">
      <slot name="map" />
    </div>
    <div class="pm-timeline-area">
      <slot name="timeline" />
    </div>
  </div>
</template>
